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

- **2026-07-18 — Rung 3 (Breakout) built the new way: archaeology first, then code.**
  Dig answered every open question: **no CPU at all** (discrete TTL, Woz ~42–45 chips,
  Atari shipped ~100 with indistinguishable gameplay), cellophane colour again, and —
  the finding that reframes rung 2 — **Breakout's difficulty curve was deliberately
  authored two years before Space Invaders got one by accident.** Later ≠ more evolved.

  Built with substepped collision applied **on sight** from INV-1 rather than retrofitted;
  the numbers demanded it (3 px ball, 6 px bricks, 11.3 px stride at top speed on a
  clamped frame) and a full-stride sweep found **zero tunnelling**. The rung-2 law paid
  for itself on rung 3 before a bug was filed.

  All criteria [VERIFIED] in-browser: contact-point angle control exact (−0.0855 / 0 /
  +0.0855), row values 1/3/5/7 with exactly one brick per hit, **all four curve triggers
  firing correctly**, paddle halving once on breakthrough, 3 balls to game over, level
  advance resetting the curve, no entity leak, 61 fps, zero page console messages.

  **One new law: INV-12** — a cached step vector is stale the moment a collision changes
  velocity. Substepping is necessary but not sufficient. Found while *misdiagnosing*
  something else (the symptom was my own test spawning the ball inside a neighbouring
  brick), and recorded that way, because finding a real bug while wrong about the
  evidence is a coincidence, not skill.

  **Scoreboard: 1 real bug from my tests, 4 false alarms.** Identical ratio to rung 2.
  Stated plainly in the run log: my tests are less reliable than my code, and INV-3
  (suspect the test first) is the dominant failure mode of this whole approach.

- **2026-07-18 — Rung 3 playtested; both calls made and applied.** Orange band moved to
  `darkYellow` (red↔orange RGB separation **51 → 115**; Daniel's ruling: legibility beats
  palette fidelity when the constraint hides information the design depends on — **A-10**).
  Ball speed retuned: wall 1 was opening at **1.92 px/frame** against a discrete-logic era
  norm of ~1–2, so the floor dropped to **1.42** and the ramp widened from **1.96× to
  2.53×**.

  Chasing the speed question produced **A-9**, the best archaeology finding of the rung:
  **Breakout is absent from MAME because it has no processor.** No CPU → no ROM → nothing
  to emulate, only simulate. The original's ball speed is not obscure, it is genuinely
  unreadable — software leaves a readable artifact, hardware leaves only behaviour. Our
  table is tagged [ASSUMED] in the source accordingly.

  All regressions re-verified after both changes: row values 1/3/5/7 one brick each, all
  four curve triggers firing in a single run, zero tunnelling at the new top speed, 61 fps.

- **2026-07-18 — Rung 3 playtest 2: the difficulty was genuinely broken.** Daniel, an
  experienced player, could not clear wall 1 without dying. Four changes:

  1. **Orange band → `darkBlue`.** Gold still interfered with red *in motion*. My 115 RGB
     separation was a real number measuring the wrong task — swatches at rest, when the job
     is reading bands peripherally while tracking a fast ball. Now 227/212/207 across all
     adjacent pairs. New law: **INV-13**, a metric that doesn't replicate the user's task
     doesn't validate it. Notable failure mode: I stopped looking *because* I had measured.
  2. **Speed jumps narrowed** ~25% → ~12.5% per step; total ratio **2.53× → 1.61×**. Floor
     unchanged at 1.42 px/frame (he confirmed that one was right).
  3. **Speed curve resets on a new ball** (UX-19). No source either way (A-9), so decided
     on playability: without it, dying at top speed leaves every remaining ball at maximum
     difficulty with no route back.
  4. **Breakthrough now spikes to max speed** (UX-20) — a documented 1976 rule I had only
     half-implemented. Works *because* of change 3; the two only function as a pair.

  All regressions re-verified. **Three playtests in, the pattern is unambiguous: every time,
  the human oracle has found something the suite had no category for.** Tunnelling was in
  scope and machine-caught. "Is this winnable," "can I read this while moving," "does the
  ramp feel like lightning" are not assertions and no coverage converts them into ones.

- **2026-07-18 — Rung 3 playtest 3: HUD labels, a win state, and A-11.** Daniel couldn't
  tell what the HUD dot-rows meant (labels added: BALLS / SPEED / BRICKS nnn / WALL n/2)
  and asked what the actual objective was. Researching that produced the rung's best
  finding and a real defect:

  **The defect:** our game generated walls endlessly and therefore had **no win state at
  all** — arguably worse for a modern player than the original. The 1976 game ships
  **exactly two walls, 448 points each, max 896**, then genuinely ends. Restored, with a
  win screen. Our layout independently produces exactly 448/wall, confirming the brick
  layout is historically correct.

  **A-11 — arcade difficulty was a business model, not a design ideal.** A quarter was
  engineered to reach GAME OVER in ~180 seconds (Bushnell, 1971: *"reward the first
  quarter and the hundredth"*). So most players **never cleared even one wall**; 896 was
  legendary, not expected. The wall was never a completion target — it was a score
  reservoir you were meant to fail at. **"Authentic" difficulty is not automatically good
  difficulty: it was tuned by an accountant, and we have no coin slot.** This reframes
  every remaining rung.

  Daniel's brick-count question cross-referenced against modern retention research (UX-22):
  casual sessions run 3–7 min so length isn't obviously wrong, but abandonment tracks
  **not knowing how much is left**. First lever is visible distance, not less content —
  hence the counter and the ending. **Brick reduction held deliberately** so the next
  playtest can attribute the effect.

  **NEXT ACTION: Daniel plays it** — can wall 1 be cleared now, and does visible distance
  change how long it feels? If it still drags, cut 8 rows → 6 (112 → 84). Then **rung 4 =
  Galaga (1981)**, archaeology first.
