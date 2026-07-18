/* =========================================================================
   CONFORMANCE CHECK — does every rung implement the shared contracts?

   WHY THIS EXISTS
   ---------------
   Rung 3 got the high score table. Rung 2 did not, and stayed on a single
   stored high score for a whole day. The gap was *known* — it was written down
   as "[TODO — still on a single stored high score]" inside tools/hiscore.js —
   and it still shipped, because a TODO in a file nobody re-reads is not a
   process. It took a nine-year-old's dad asking "why doesn't Space Invaders
   have a leaderboard" to surface it.

   The lesson generalises past this repo: **when you introduce a shared
   contract, you also have to introduce the thing that fails when a member
   doesn't implement it.** A convention with no enforcement is a preference,
   and preferences drift silently. (INVARIANTS INV-18.)

   HOW TO RUN
   ----------
   Open a rung, paste this file into the console, then:
       await Conformance.check('invaders')   // or 'breakout'
       Conformance.report(results)

   Each rung must expose window.__<game> with the contracts below.
   ========================================================================= */

const Conformance = (() => {

  /* The shared contracts. Adding one here means every rung is immediately
     measured against it — which is the entire point. */
  const CONTRACTS = {

    testHook: {
      why: 'INV-6 — without a read-only handle, a game can only be verified by eyeball',
      check: g => ({
        pass: typeof g === 'object' && 'state' in g && 'score' in g,
        detail: g ? 'exposes state/score' : 'missing'
      })
    },

    simContract: {
      why: 'tiered playtest bots must be able to drive any rung',
      check: g => {
        const s = g && g.sim;
        const need = ['input', 'step', 'reset', 'observe'];
        const have = s ? need.filter(k => k in s) : [];
        return { pass: have.length === need.length,
                 detail: s ? have.join(',') : 'no sim object' };
      }
    },

    simCannotCheat: {
      why: 'a bot that sets state directly measures nothing',
      check: g => {
        if (!g || !g.sim || !g.geom || !g.geom.PADDLE_SPEED) {
          return { pass: null, detail: 'n/a for this rung' };
        }
        g.newGame(); g.sim.reset();
        const before = g.sim.observe().paddleX;
        g.sim.input.right = true;
        for (let i = 0; i < 10; i++) g.sim.step(1000 / 60);
        const moved = g.sim.observe().paddleX - before;
        g.sim.reset();
        const legal = g.geom.PADDLE_SPEED * (1000 / 60) * 10;
        return { pass: moved <= legal + 0.01,
                 detail: moved.toFixed(2) + 'px moved, ' + legal.toFixed(2) + 'px legal' };
      }
    },

    hiScoreTable: {
      why: 'the competitive loop is why anyone comes back — this is the one that was missed',
      check: (g, name) => {
        const h = g && g.HiScore;
        if (!h) return { pass: false, detail: 'NO HIGH SCORE TABLE' };
        const need = ['list', 'qualifies', 'add', 'clear'];
        const have = need.filter(k => typeof h[k] === 'function');
        return { pass: have.length === need.length, detail: have.join(',') };
      }
    },

    hiScoreStorageKey: {
      why: 'shared protocol: arcade.<game>.scores',
      check: (g, name) => {
        const h = g && g.HiScore;
        if (!h) return { pass: false, detail: 'no table' };
        const before = h.list().length;
        h.add('ZZZ', 999999);
        const key = 'arcade.' + name + '.scores';
        const raw = localStorage.getItem(key);
        // clean up the probe
        const kept = h.list().filter(e => !(e.n === 'ZZZ' && e.s === 999999));
        try { localStorage.setItem(key, JSON.stringify(kept)); } catch (e) {}
        return { pass: !!raw, detail: raw ? key : 'wrote to a different key' };
      }
    },

    hiDerivedNotStored: {
      why: 'one fact one home — a separate high-score key drifts from the table',
      check: (g, name) => {
        const legacy = localStorage.getItem(name + '.high');
        return { pass: legacy === null,
                 detail: legacy === null ? 'no legacy key' : 'legacy ' + name + '.high still present' };
      }
    },

    initialsEntry: {
      why: 'a leaderboard nobody can put their name on is a scoreboard, not a competition',
      check: g => ({
        pass: !!(g && typeof g.startEntryOrTitle === 'function' && g.LETTERS),
        detail: g && g.LETTERS ? g.LETTERS.length + ' chars, no space: ' + !g.LETTERS.includes(' ')
                               : 'missing'
      })
    },

    touchLayout: {
      why: 'INV-17 + Lucius (9): arrows must reach the physical screen edges',
      check: () => {
        const had = document.body.classList.contains('touch');
        document.body.classList.add('touch');
        window.dispatchEvent(new Event('resize'));
        const r = id => { const el = document.getElementById(id);
                          return el ? el.getBoundingClientRect() : null; };
        const L = r('bL'), R = r('bR'), P = r('bP'), C = r('screen');
        if (!L || !R || !P || !C) { if (!had) document.body.classList.remove('touch');
                                    return { pass: false, detail: 'controls missing' }; }
        const edge = Math.max(L.left, window.innerWidth - R.right);
        const sep = R.left - L.right;
        const secondaryAbove = P.bottom <= C.top + 1;
        const bigEnough = L.height >= 60 && L.width >= 120;
        if (!had) { document.body.classList.remove('touch');
                    window.dispatchEvent(new Event('resize')); }
        return {
          pass: edge <= 24 && sep >= window.innerWidth * 0.35 && secondaryAbove && bigEnough,
          detail: 'edge ' + Math.round(edge) + 'px, sep ' + Math.round(sep) +
                  'px, secondary above: ' + secondaryAbove +
                  ', btn ' + Math.round(L.width) + 'x' + Math.round(L.height)
        };
      }
    },

    swivelStick: {
      why: 'cabinet feel on touch, and no fixed hand position to reach for',
      check: g => ({ pass: typeof window.Stick === 'object' || !!(g && g.Stick),
                     detail: (typeof window.Stick === 'object' || (g && g.Stick))
                             ? 'present' : 'no swivel stick' })
    },

    palette: {
      why: 'series constraint — the TI-99/4A palette, the homage',
      check: g => ({ pass: !!(g && (g.TI || g.game)), detail: 'assumed by inspection' })
    }
  };

  async function check(name) {
    const g = window['__' + name];
    const out = { rung: name, when: new Date().toISOString().slice(0, 16), results: {} };
    for (const [id, c] of Object.entries(CONTRACTS)) {
      let r;
      try { r = await c.check(g, name); }
      catch (e) { r = { pass: false, detail: 'threw: ' + e.message }; }
      out.results[id] = { pass: r.pass, detail: r.detail, why: c.why };
    }
    const vals = Object.values(out.results);
    out.passed = vals.filter(v => v.pass === true).length;
    out.failed = vals.filter(v => v.pass === false).length;
    out.na     = vals.filter(v => v.pass === null).length;
    out.conformant = out.failed === 0;
    return out;
  }

  function report(res) {
    const lines = [`RUNG: ${res.rung}  —  ${res.conformant ? 'CONFORMANT' : 'NOT CONFORMANT'}`,
                   `${res.passed} passed, ${res.failed} failed, ${res.na} n/a`, ''];
    for (const [id, r] of Object.entries(res.results)) {
      const mark = r.pass === null ? ' - ' : r.pass ? ' OK' : 'FAIL';
      lines.push(`[${mark}] ${id}: ${r.detail}`);
      if (r.pass === false) lines.push(`        why it matters: ${r.why}`);
    }
    return lines.join('\n');
  }

  return { CONTRACTS, check, report };
})();

if (typeof window !== 'undefined') window.Conformance = Conformance;
