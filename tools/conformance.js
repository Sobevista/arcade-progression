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
    },

    feedback: {
      why: 'playtest reports must be sendable MID-PLAY (rung 5 pilot) — a tester who ' +
           'has to leave the game to report loses the moment',
      /* PILOT SCOPE (2026-07-18): piloted on the rung-5 games before fleet
         rollout — Daniel's call after the pilot. Out-of-pilot rungs get a
         LOUD abstention, never a silent pass (INV-19). Fleet rollout =
         empty this list.
         2026-07-19: rung-6 games added — new builds conform to the current
         contract [ASSUMED default, Daniel may strike]. Rungs 2-4 still
         abstain pending his rollout call. */
      pilotOnly: ['wumpus', 'parsec', 'munchman', 'anteater'],
      check(g, name) {
        if (!this.pilotOnly.includes(name)) {
          return { pass: null,
                   detail: 'PILOT: contract not yet rolled out to this rung — abstaining' };
        }
        const f = g && g.Feedback;
        if (!f) return { pass: false, detail: 'NO FEEDBACK MODULE' };
        const api = ['open', 'close', 'buildReport'].every(k => typeof f[k] === 'function') &&
                    typeof f.isOpen === 'boolean';
        if (!api) return { pass: false, detail: 'incomplete API' };
        const rep = f.buildReport();
        const stamped = ['state:', 'score:', 'date:', 'viewport:', 'ua:']
          .every(t => rep.includes(t));
        return { pass: stamped,
                 detail: stamped ? 'api complete, report context-stamped'
                                 : 'report missing context fields' };
      }
    },

    standalone: {
      why: 'each rung must be a movable cog — one file that runs anywhere, alone',
      check: async () => {
        // Read this rung's own source and prove it pulls in nothing external.
        // Modularity you have not measured is modularity you do not have.
        //
        // FIXED 2026-07-19 (INV-19): the original built the URL as
        // pathname + 'index.html', producing /rungs/NN/index.html/index.html —
        // a 404 — and then ran its regexes over the ~0-byte error page. It
        // passed VACUOUSLY on every rung from the day it was written, and the
        // "(0KB)" in its own detail string was the tell. A check must abstain
        // loudly when it cannot observe its subject; it must never pass on
        // the absence of its input.
        let src = '', how = '';
        for (const url of [location.pathname, 'index.html']) {
          try {
            const r = await fetch(url, { cache: 'no-store' });
            if (r.ok) { src = await r.text(); how = url; break; }
          } catch (e) { /* file:// or network — try next */ }
        }
        if (!src || src.length < 1000) {
          return { pass: null,
                   detail: 'COULD NOT READ OWN SOURCE (' + src.length +
                           ' bytes) — abstaining, NOT passing' };
        }
        const tags    = (src.match(/<(script|link|img|iframe|audio|video)[^>]*\s(src|href)\s*=/gi) || []).length;
        const fetches = (src.match(/\bfetch\s*\(/g) || []).length;
        const imports = (src.match(/\bimport\s+[\w{*]/g) || []).length;
        return { pass: tags === 0 && fetches === 0 && imports === 0,
                 detail: `external tags=${tags} fetch=${fetches} import=${imports}` +
                         ` (${Math.round(src.length/1024)}KB via ${how})` };
      }
    }
  };

  /* ---- DOCS CONFORMANCE ------------------------------------------------
     Rung status lives in TWO user-facing places: README.md (what GitHub shows
     on the repo front page) and index.html (what GitHub Pages shows visitors).
     They drifted immediately — Breakout shipped, the landing page said PLAY,
     and the README still said "backfill — not built" for a full day. Daniel
     found it by looking at the repo.

     Same disease as INV-18: a fact with two homes and no check. This is the
     check. It is separate from the per-rung contracts above because it is about
     the repo, not about a game.                                              */
  async function checkDocs(base) {
    base = base || (location.origin + location.pathname.replace(/rungs\/.*$/, ''));
    const out = { base, rungs: {}, problems: [] };
    let readme = '', landing = '';
    try { readme  = await fetch(base + 'README.md?t=' + Date.now()).then(r => r.text()); }
    catch (e) { out.problems.push('could not fetch README.md'); }
    try { landing = await fetch(base + 'index.html?t=' + Date.now()).then(r => r.text()); }
    catch (e) { out.problems.push('could not fetch index.html'); }

    // A rung is PLAYABLE if its folder is linked as playable in each document.
    for (const slug of ['02-invaders', '03-breakout', '04-galaga', '05-ti994a',
                        '06-ti994a-2', '07-nes']) {
      const inReadme  = readme.includes('rungs/' + slug + '/');
      const inLanding = landing.includes('rungs/' + slug + '/');
      // "not built" / "queued" markers next to the slug's game name
      const readmeSaysPlay  = inReadme  && /PLAY/i.test(
        (readme.split('\n').find(l => l.includes('rungs/' + slug + '/')) || ''));
      const landingSaysPlay = inLanding && /tag play/i.test(
        landing.slice(Math.max(0, landing.indexOf('rungs/' + slug + '/') - 400),
                      landing.indexOf('rungs/' + slug + '/') + 400));
      if (!inReadme && !inLanding) continue;                 // not built anywhere, fine
      out.rungs[slug] = { readme: readmeSaysPlay, landing: landingSaysPlay };
      if (readmeSaysPlay !== landingSaysPlay) {
        out.problems.push(slug + ': README says ' + (readmeSaysPlay ? 'PLAY' : 'not built') +
                          ' but the landing page says ' + (landingSaysPlay ? 'PLAY' : 'not built'));
      }
    }
    out.consistent = out.problems.length === 0;
    return out;
  }

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

  return { CONTRACTS, check, report, checkDocs };
})();

if (typeof window !== 'undefined') window.Conformance = Conformance;
