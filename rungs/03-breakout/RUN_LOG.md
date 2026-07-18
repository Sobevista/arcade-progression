# RUN LOG — rung 3, Breakout

*Append-only. Written during the run, not after. Wrong turns stay in.*
*Tags: [VERIFIED] = observed directly. [ASSUMED] = not checked.*

---

### 2026-07-18 — archaeology first (the method inversion, working)

- **This is the first rung built the new way: dig before code.** Rung 2 was built from
  memory and got caught shipping two mechanics wrong, which is how INV-10 was earned.
- Research findings, all sourced into `ARCHAEOLOGY.md`: **no CPU at all** — Breakout is
  discrete TTL logic. Wozniak prototyped at ~42–45 chips; Atari's process couldn't
  reproduce it and shipped ~100, with gameplay reportedly indistinguishable. Black-and-
  white monitor with **coloured cellophane** over the glass — the same trick Space
  Invaders used two years *later*. [VERIFIED]
- **The finding that reframes rung 2:** Breakout's difficulty curve was *authored* —
  speed-ups at 4 hits, 12 hits, orange row, red row, plus paddle-halving on breakthrough.
  The game with the deliberate curve came **two years before** the game whose famous
  curve was a hardware accident. Later ≠ more evolved (A-8). [VERIFIED]
- Suffering Ledger written before code. Notable self-imposed constraint: **no mechanic
  that wasn't in the 1976 circuit.** Their chip count enforced restraint; our marginal
  cost is zero, so it has to be a written rule or it doesn't exist (A-5).
- One thing left honestly open: **paddle segment count.** Sources confirm the ball
  rebounds by contact point but not whether the original stepped it into discrete zones.
  Implemented continuous mapping and tagged it [ASSUMED] rather than inventing a number
  and calling it fidelity.

### 2026-07-18 — build and verification

- Built with **substepped collision from the first line**, not retrofitted — INV-1
  applied on sight. The numbers demanded it: ball 3 px, bricks 6 px tall, stride 11.3 px
  at top speed on a clamped 50 ms frame. **Swept every offset across a full stride:
  zero tunnelling.** The law bought on rung 2 paid for itself on rung 3 before a single
  bug was filed. [VERIFIED]
- **Contact-point angle control works exactly:** paddle left third → vx −0.0855, right
  third → +0.0855, centre → 0.0000, all three bouncing upward. This is the primitive the
  rung exists for. [VERIFIED]
- **REAL BUG — INV-12, stale step vector.** `sx`/`sy` computed once before the substep
  loop, so a mid-frame bounce reversed velocity but the remaining substeps kept moving
  the original direction. Fixed by recomputing from current velocity inside the loop.
- **But I found it while misdiagnosing.** I was chasing rows scoring 5/11/17 instead of
  3/5/7 and assumed the stale vector explained it. It didn't. The real cause was **my
  test spawning the ball inside the brick one row below the target** — it smashed the
  neighbour, bounced down into another, then up into the target. The arithmetic matched
  perfectly once I checked it (row 1: 5+5+7+7 = 24, four bricks). The game was correct
  the whole time. Fixing a real bug while wrong about the evidence is a coincidence, not
  skill — recorded as such in INV-12. [VERIFIED]
- **Three more false alarms after that**, all mine: (a) isolated-brick test waited 300 ms
  for a ball that needed ~900 ms to cross the playfield; (b) paddle-halving test killed
  every brick first, which triggers WALL CLEARED and nulls the ball before it can reach
  the ceiling; (c) red-row test left only one brick standing, so the "RED ROW" message
  was immediately overwritten by "WALL CLEARED". Every one was the test, not the game.
- Final verification, all [VERIFIED] in-browser: 112 bricks · paddle clamps both sides ·
  row values exactly 1/3/5/7 with exactly one brick destroyed per hit · **all four curve
  triggers fire at the right moments** (4 HITS → 0.140, 12 HITS → 0.165, ORANGE ROW →
  0.195, RED ROW → 0.225) · paddle halves on reaching the top wall and **only once** ·
  3 balls then game over · restart without reload · wall clear advances the level and
  resets the curve · no entity leak across 5 restarts · **61 fps** · **zero page console
  messages**.
- Dead code removed: a no-op ternary in the balls-remaining render (`balls - (serve ? 0 : 0)`).

**Scoreboard so far for rung 3:** 1 real bug found by my tests, **4 false alarms.** The
ratio is unchanged from rung 2 and the pattern is now established well enough to state
plainly: **my tests are less reliable than my code.** INV-3 is not a one-off observation,
it is the dominant failure mode of this whole approach — and the only reason it hasn't
cost anything yet is that the rule to suspect the test first was written down after rung 2.

### 2026-07-18 — playtest 1 (Daniel), both calls made

- **Orange band → `darkYellow`.** Daniel: *"We have the ability to make them
  distinguishable here which is a UX issue not a strict necessity."* Measured rather than
  eyeballed: red↔orange RGB distance went **51 → 115**. Adjacent-band distances now
  115 / 180 / 207 — no two neighbouring bands confusable. Recorded as **A-10**: a
  constraint adopted for authenticity stops being worth holding the moment it destroys
  information the design depends on. [VERIFIED]
- **Ball speed queried — and the answer is that no reference exists.** Chased it properly
  and hit something worth keeping: **Breakout is absent from MAME because it has no
  processor.** No CPU → no ROM → nothing to emulate; it can only be *simulated*. So the
  original's ball speed is not obscure, it is genuinely unreadable. Anyone quoting a
  px/frame figure is reconstructing. Now **Finding 4 / A-9** in the archaeology, and our
  table is tagged [ASSUMED] in the source rather than dressed up as fidelity.
- **Daniel's instinct was right, quantified:** wall 1 opened at **1.92 px/frame** against
  a discrete-logic era norm of roughly 1–2 px/frame — starting at the ceiling of the
  period range. Lowered to **1.42** and widened the ramp; top/start ratio **1.96× → 2.53×**.
  Lower floor, similar ceiling, so the escalation is felt rather than merely measured —
  which matters because the authored curve *is* this rung's lesson. [VERIFIED]
- Re-verified after both changes: row values still 1/3/5/7 one brick each · **all four
  curve triggers fire in a single run** (4 HITS / 12 HITS / ORANGE ROW / RED ROW) · zero
  tunnelling swept across the full stride at the new top speed · 61 fps. [VERIFIED]
- Cleaned up after myself again: autoplay had written a high score into localStorage.
  Removed. Second time this session — tests that touch persistent user state must clean
  up, and I keep needing to be reminded by my own log.

### 2026-07-18 — playtest 2 (Daniel): the difficulty was actually broken

- *"I am not a new booty to gaming and I cannot make it past level 1 without dying. That
  would make a lot of people quit soon after."* The most important feedback of the rung —
  the game was **failing at its job** and my suite had no way to notice, because "is this
  winnable" was never a pass criterion and could not have been. INV-9, third confirmation.
- **Colour, second attempt.** Gold still interfered with red in motion. My 115 RGB
  separation was a real number **measuring the wrong task** — two swatches at rest, when
  the actual job is reading bands peripherally while tracking a fast ball. Moved to
  `darkBlue`: adjacent separations now **227 / 212 / 207**. Became **INV-13** — a metric
  that doesn't replicate the user's task doesn't validate it. Worth noting *how* this
  failed: I stopped looking precisely **because** I had measured something. [VERIFIED]
- **Speed gaps narrowed.** Daniel's diagnosis was exact — floor good, jumps too wide. Each
  step was ~25%, compounding to **2.53×** within a single wall, and because the orange/red
  triggers fire on reaching those rows, top speed arrived *early in wall 1*. Narrowed to
  ~12.5% per step, total **1.61×**. Four steps still distinctly felt; the top is now
  catchable. [VERIFIED]
- **Speed curve now resets on a new ball (UX-19).** He asked whether it should — no source
  either way (A-9), so it's a design call. Without it, dying at top speed hands you every
  remaining ball at maximum difficulty with no route back: a death spiral, and the likeliest
  mechanical cause of "a lot of people would quit." Resets speed, hits, and the row flags
  so the curve genuinely replays. The halved paddle deliberately persists — that one *is*
  documented. [VERIFIED]
- **Fidelity gap found while chasing that question:** the 1976 back-wall breakthrough
  punishes with **max speed AND** the smaller paddle. I had implemented only the paddle.
  Now both (UX-20) — and it only reads as a dramatic spike rather than a death sentence
  *because* the curve resets on the next ball. The two decisions only work as a pair.
- Re-verified after all four changes: row values 1/3/5/7 one brick each · all four triggers
  fire in sequence · breakthrough halves paddle **and** maxes speed · death resets curve to
  1.42 px/frame while leaving the paddle halved · zero tunnelling · **61 fps**. [VERIFIED]

**Pattern worth stating plainly, three playtests in:** every single time, Daniel has found
something the suite structurally could not. Not bugs it missed — bugs it had no *category*
for. Tunnelling was in scope and got caught by machine. "Is this winnable," "can I read
this while moving," "does the ramp feel like lightning" are not assertions, and no amount
of test coverage converts them into ones.

### 2026-07-18 — playtest 3: HUD legibility, and the question that reframed the rung

- **Unlabelled HUD.** Daniel was *guessing* what the lower-left dots meant and had no idea
  about the lower-right ones. Added `BALLS`, `SPEED`, `BRICKS nnn`, `WALL n/2`. Standing
  rule now: if a HUD element needs explaining, it needs a label. The originals had cabinet
  artwork, instruction cards and an attract mode carrying that load — none of which
  survive a port to a web page, so the screen has to do it. [VERIFIED]
- **"Is the point to break through, or to clear all the squares?"** Researched rather than
  answered from memory: clear the wall. **Exactly two walls exist, 448 points each, max
  896**, after which the ball bounces off empty walls forever — there is no wall 3.
  **Our layout produces exactly 448 per wall** (14 × 2 × (7+5+3+1)) — independent
  confirmation the brick layout is historically right. [VERIFIED]
- **Found a real gap doing so: our game had NO WIN STATE.** It generated walls endlessly.
  For a modern player that is arguably worse than the original — infinite content with no
  finish line. Restored the 1976 two-wall limit plus a win screen. Verified: wall 1 clear
  → wall 2 → `won`, high score banked, fire returns to title. [VERIFIED]
- **A-11, the best archaeology finding of the rung, and it reframes the whole project:**
  arcade difficulty was a *business model*. A quarter was engineered to reach GAME OVER in
  **~180 seconds**; Bushnell in 1971: *"reward the first quarter and the hundredth."* So
  **most players never cleared even one wall** — 896 was legendary, not expected. The wall
  was never a completion target, it was a **score reservoir you were meant to fail at**.
  Which means "authentic" difficulty is not automatically good difficulty: **it was tuned
  by an accountant**, and we have no coin slot. [VERIFIED]
- Cross-referenced against modern retention research for Daniel's brick-count question —
  full write-up in UX-22. Short version: casual sessions run 3–7 minutes so length isn't
  obviously wrong, but players abandon a stage far more readily **when they can't tell how
  much is left**. So the first lever is visible distance, not less content. Brick-count
  reduction deliberately **held** — two changes already landed against this complaint, and
  changing a third would make attribution impossible.
- Regressions re-verified after all of it: 448/wall · row values 1/3/5/7 one brick each ·
  death still resets the speed curve · 61 fps. [VERIFIED]

### Open for Daniel

- ~~**Palette legibility.**~~ **CLOSED** — orange → `darkYellow`, separation more than
  doubled. See UX-17.
- ~~**Ball speed reference.**~~ **CLOSED as far as it can be** — no authoritative source
  exists (A-9). Retuned against the era norm and Daniel's playtest; tagged ASSUMED.
- **UX-22 — brick count.** Held deliberately. Play it with the `BRICKS` counter and the
  two-wall ending in place. If it still drags, cut 8 rows → 6 (112 → 84 bricks, 336/wall)
  and we'll *know* it was content length rather than opacity. Changing it now would
  confound three fixes aimed at the same complaint.
- **Playtest 4 pending** — specifically: can wall 1 be cleared now, and does the visible
  distance change how long it feels?
