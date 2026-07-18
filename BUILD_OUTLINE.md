# Arcade Progression — Build Outline

Owner: Daniel + Claude. Purpose: walk arcade history one rung at a time, extracting a
game-dev invariant list along the way, so the eventual big build starts with its
roadblocks already earned and solved.

## LOCKED

- **One HTML file per game.** Vanilla JS + Canvas 2D, zero dependencies, no build step.
  Reassessed only if a rung provably cannot be built this way — and that reassessment
  gets written down, not decided silently.
- **`INVARIANTS.md` is the deliverable.** The games are the vehicle. Append-only, every
  entry carrying the failure that bought it.
- **Laws and taste live in different files.** `INVARIANTS.md` = would be wrong in every
  game, on every platform, regardless of taste. `UX_DECISIONS.md` = a choice, with its
  tradeoff and a re-pick trigger. Nothing belongs in both.
- **Every rung ships a read-only test hook** (`window.__<game>`) so pass criteria are
  machine-checkable rather than eyeballed (INV-6).
- **Pass criteria are locked before building**, never written to fit what got built.
- **Playtest is a required gate, not a nicety.** On rung 2 the automated suite passed
  8/8 and a human found six real defects it structurally could not catch (INV-9).
- **Rung 1 (Pong) stays in `Pong_Tower-Repo`** and stays Daniel's to engineer by hand.
  It is not ported here.

## OPEN

- **Rung 3 target:** Breakout (1976) as a backfill vs. jumping straight to Galaga.
  Recommendation on the table: Breakout first — it is the literal causal link between
  rungs 1 and 2, and it teaches reflection physics that neither neighbour does.
- **Hosting:** GitHub Pages for a public URL; eventual home is b4him.com.
- **CI:** none yet. Add the truth-machine pattern when there is a rung whose tests are
  worth gating (the browser-driven pass criteria would need a headless runner).
- **Audio verification:** synthesised SFX are proven to *construct and schedule*
  correctly, but audibility on a given device is a human check. No automated oracle.

## STATE OF BUILD

- **2026-07-18 — Rung 2 (Invaders) built, playtested, and graduated out of `Lab/`.**
  Single-file browser build: authentic 5×11 formation, shuffle-march with edge drop,
  tempo ramp measured 560 ms → 40 ms, destructible bunkers on a real pixel grid, UFO,
  waves that start progressively lower, three lives, synthesised audio including the
  four-note march bass, touch controls, pause, ESC-to-title, localStorage high score
  hardened against `file://` storage restrictions. TMS9918A palette (TI-99/4A) as the
  homage.

  Phase 1 pass criteria: **8/8 verified in-browser**, not asserted — zero page console
  errors, clamps at 6/205, exactly-one-kill collision with correct scoring, overrun
  ends the game, restart without reload, 62 fps with 55 sprites, no entity leak across
  5 restarts.

  **Four invariants earned the hard way:** INV-1 projectile tunneling (15 px stride vs
  8 px sprite; 7 of 21 offsets passed clean through — fixed with substepped collision,
  prove-the-fix 7/7); INV-9 a green suite proves you met your criteria, not that your
  criteria were right; INV-10 "authentic" is a claim needing a source, not recall
  (shields-repair-between-waves and descending wave start were both shipped wrong from
  memory); INV-11 reset functions are named per event, never per scope (a single
  boolean silently deleted the game's core tension by rebuilding the whole rack on
  death).

  **Honest scoreboard for the rung:** automated suite found 1 real bug and raised 5
  false alarms; Daniel playing found 6. Every behavioural defect was found by a human.

  **NEXT ACTION: Daniel picks rung 3 — Breakout (1976) backfill, or forward to Galaga
  (1981).** Recommendation is Breakout; Galaga then becomes rung 4.
