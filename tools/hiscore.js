/* =========================================================================
   HIGH SCORE PROTOCOL — canonical reference for every rung

   Why this file exists
   --------------------
   The games are single-file by rule (you double-click one file and it runs),
   so this cannot be imported. Each rung INLINES a copy. This file is the
   source of truth for the shape; if you change it, change the copies.
   That duplication is a deliberate trade: single-file distribution beats DRY.

   Rungs currently implementing it:
     rungs/03-breakout/index.html
     rungs/02-invaders/index.html   [TODO — still on a single stored high score]

   ---------------------------------------------------------------------
   STORAGE CONTRACT
   ---------------------------------------------------------------------
     key      arcade.<game>.scores          e.g. arcade.breakout.scores
     value    JSON array, sorted descending, capped at MAX (8)
     entry    { n: "ABC", s: 319, d: "2026-07-18" }
                n  three characters from LETTERS
                s  integer score
                d  ISO date, YYYY-MM-DD

   ONE FACT, ONE HOME: the HUD's "HI" value is DERIVED from entry [0], never
   stored separately. Breakout originally kept a standalone `breakout.high`
   key alongside the table and they drifted within one session — the HUD read
   HI 0037 while the table's top row said 0319. Any rung adopting this must
   delete its legacy key on load.

   ---------------------------------------------------------------------
   INITIALS ENTRY
   ---------------------------------------------------------------------
   Three letters, entered with left / right / confirm — the same stick-and-
   one-button a cabinet had, which is why it also works on a touch pad with no
   on-screen keyboard. Typing letters directly is an extra convenience, never
   the only path.

   TWO TRAPS, BOTH HIT ON THE FIRST BUILD:

   1. Modal states need their OWN input bindings (INV-15). The WASD movement
      aliases are also letters people put in their initials — typing "DAN"
      spun the letter wheel with the A and the D. Entry reads arrows + touch
      only, never the gameplay aliases.

   2. Initialise every "previous button state" flag to TRUE, not false. The
      button that opened the entry screen is still physically down on the next
      frame; with false it edge-triggers again and skips slot 0. "DAN" came
      out as "ADA", shifted by exactly one slot.

   Also: no space character in the alphabet, because SPACE is the confirm
   button. A character that is also a control is a character you can never
   actually enter.

   ---------------------------------------------------------------------
   HISTORICAL NOTE (ARCHAEOLOGY A-12)
   ---------------------------------------------------------------------
   This is an ANACHRONISM and it is deliberate. Initials-entry high score
   tables did not exist in 1976 or 1978. Star Fire (Exidy, 1979) was the first
   arcade game to let a player enter initials; Asteroids copied it that same
   year and made it standard. Three letters specifically because manufacturers
   wanted to limit obscenities appearing in the attract mode.

   We import it backwards anyway. The competitive loop is why anyone comes
   back to a cabinet, and it is the mechanic that makes a game social — which
   matters more here than the date. Declared in the Suffering Ledger rather
   than smuggled in.
   ========================================================================= */

const HiScore = (game => {
  const KEY = 'arcade.' + game + '.scores', MAX = 8;
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; }
                       catch (e) { return []; } };
  const store = l => { try { localStorage.setItem(KEY, JSON.stringify(l)); } catch (e) {} };
  return {
    list: load,
    /** Would this score make the table? */
    qualifies(score) {
      if (score <= 0) return false;
      const l = load();
      return l.length < MAX || score > l[l.length - 1].s;
    },
    /** Insert and return the 1-based rank, or 0 if it didn't make the cut. */
    add(name, score) {
      const l = load();
      l.push({ n: name, s: score, d: new Date().toISOString().slice(0, 10) });
      l.sort((a, b) => b.s - a.s);
      const cut = l.slice(0, MAX);
      store(cut);
      return cut.findIndex(e => e.s === score && e.n === name) + 1;
    },
    /** The single source of truth for the HUD's HI value. */
    top() { const l = load(); return l.length ? l[0].s : 0; },
    clear() { try { localStorage.removeItem(KEY); } catch (e) {} }
  };
})('breakout');

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ.';   // no space: space is confirm
