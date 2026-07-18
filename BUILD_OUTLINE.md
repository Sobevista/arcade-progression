# Arcade Progression — Build Outline

Owner: Daniel + Claude. Purpose: **re-derive the evolution of video games from the
constraints up** — work out what the original designers must have spent a long time
figuring out, build it, and keep the lessons — so the eventual big build starts with its
roadblocks already earned and solved.

## LOCKED

- **Archaeology before code (added 2026-07-18).** Every rung starts with sourced research
  into the original machine and its constraints, written into `ARCHAEOLOGY.md` with a
  **Suffering Ledger** naming which constraints we KEEP (the constraint teaches something
  unreadable) and which we SKIP (tedium, not insight). No code until that exists. Rung 2
  was built in the opposite order and shipped two mechanics wrong from confident memory.
- **Three artifacts, three kinds of knowledge, no overlap.** `INVARIANTS.md` = laws.
  `UX_DECISIONS.md` = choices with re-pick triggers. `ARCHAEOLOGY.md` = the history that
  explains why the choice existed. A law filed as taste gets negotiated with; a taste
  call filed as law gets obeyed forever without its reasoning.
- **No rush.** The trove is the point. A rung is done when its lessons are extracted and
  sourced, not when the game is playable.

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

- **2026-07-18 — Project reframed and `ARCHAEOLOGY.md` opened.** Daniel's framing: we are
  "Dr. Stone-ing" the evolution of video games — deriving what must have taken the
  originals a long time to work out, so we learn their lessons rather than just copying
  their results. Method inverted accordingly: **archaeology before code**, and a
  **Suffering Ledger** per rung (his own mantra — *be intentional with your suffering*)
  deciding which historical constraints we keep on purpose.

  First archaeology entry written for rung 2, sourced: Intel 8080 @ 2 MHz, 1-bit 7 KB
  framebuffer, **no sprite hardware**, colour faked with physical cellophane over the
  CRT, monitor rotated 90° to turn a 256×224 raster into the portrait play area the whole
  genre inherited. **The canonical finding: the tempo ramp is not in the source code** —
  it was an 8080 bottleneck, so the genre's defining feature was never designed. Which
  means on modern hardware the game has *no difficulty curve at all* unless you author
  one, and we had to hand-build a 560 ms → 40 ms curve to buy back what they got free.
  Generalised as A-1/A-2: constraints generate identity, and removing a constraint
  silently removes whatever it was accidentally providing.

  **NEXT ACTION: rung 3 = Breakout (1976).** Step 1 is archaeology, not code — the open
  questions are already listed in `ARCHAEOLOGY.md` (was it discrete TTL with no CPU at
  all? what did Wozniak's chip-count constraint remove? was paddle-angle control designed
  or emergent? were the speed-up and paddle-shrink authored or another side effect?).
  Galaga becomes rung 4.
