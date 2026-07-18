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

### Open for Daniel

- **Palette legibility.** The TI-99/4A has no true orange, so the orange band is rendered
  with `lightRed` and reads as salmon — visually close to the red band above it. The
  1/3/5/7 score gradient is meant to be *visible*, so this may be costing the player
  information. Options: accept it (series palette fidelity), or move orange to
  `darkYellow` (olive-gold, clearly distinct from both red and the yellow band). Daniel's
  call — recorded in `UX_DECISIONS.md`, not silently changed.
- **Playtest pending.** Per INV-9 this rung is not verified until a human plays it.
