# SCOPE — rung 3, Breakout (Atari 1976)

**Locked 2026-07-18, before any code.** Archaeology and Suffering Ledger completed first
(`ARCHAEOLOGY.md` rung 3) — the method inversion earned by INV-10 on rung 2.

---

## 1. What's under test

Can we reproduce a **deliberately authored difficulty curve** and **contact-point angle
control** — the two things Breakout has that neither Pong nor Invaders does — while
holding ourselves to the 1976 rule set and nothing more.

## 2. The primitive this rung teaches

**Reflection angle as a control surface.** Pong has a crude version; Invaders has none.
Where the ball strikes the paddle determines where it goes, which is what converts a
reflex game into a skill game. Also: a destructible tile grid — the direct ancestor of
both Invaders' formation *and* its bunkers.

## 3. Inherited laws that apply on sight

- **INV-1 (substep projectiles).** This rung is where that law earns its keep before a
  single bug: the ball is 3 px, bricks are 6 px tall, and at a clamped 50 ms frame the
  ball travels far enough to pass through a brick untouched. Substepped collision from
  the first line of code, not retrofitted.
- **INV-6 (ship a test hook).** `window.__breakout` exposed for machine-checkable criteria.
- **INV-10 (authentic needs a source).** Every fidelity claim below traces to
  `ARCHAEOLOGY.md`; the one unknown (paddle segment count) is tagged ASSUMED there
  rather than invented.
- **INV-11 (reset per event, not per scope).** Separate functions for new-game, new-ball,
  and new-level. No booleans.

## 4. PASS criteria — binary, checkable by something other than me

- [ ] Loads with **zero page console errors**
- [ ] Paddle moves on input and is clamped inside the playfield
- [ ] Ball reflects off left/right/top walls and off the paddle
- [ ] **Contact point controls angle:** striking the paddle's left third vs right third
      produces opposite-signed horizontal velocity; centre produces near-vertical
- [ ] Brick collision destroys **exactly one** brick and scores its row value (1/3/5/7)
- [ ] **No tunneling:** ball passes through no brick at a forced large-`dt` frame,
      swept across every start offset in one full stride
- [ ] **Speed increases at 4 hits, at 12 hits, on first orange, on first red** — four
      distinct measurable steps
- [ ] **Paddle halves** after the ball reaches the top wall, and only once
- [ ] 3 balls, then game over; restart works without a page reload
- [ ] Clearing all 112 bricks advances to a fresh wall
- [ ] Sustains **60 fps** with a full wall
- [ ] No entity leak across 5 restarts

**Explicitly NOT claimed:** that it feels right. That's Daniel's verdict and it's recorded
as his words. Per INV-9, playtest is a required gate, not a courtesy — the automated suite
can only confirm I met this spec, not that this spec is correct.

## 5. Fidelity targets (all sourced in ARCHAEOLOGY.md)

8 rows × 14 bricks · two rows per colour · yellow 1 / green 3 / orange 5 / red 7 ·
speed-ups at 4 and 12 hits and at the orange and red rows · paddle halves on breakthrough ·
3 balls · portrait playfield.

**Self-imposed constraint (Suffering Ledger):** no mechanic that wasn't in the 1976
circuit. Zero marginal cost is exactly why this has to be a written rule.

## 6. Tech — unchanged

One HTML file, vanilla JS, Canvas 2D, zero dependencies, no build step. TI-99/4A palette,
accepting that it has no true orange (recorded as an accepted cost, not hidden).

## 7. Blast radius

Writes limited to `rungs/03-breakout/` plus the repo's shared docs. No pushes to
`Sobevista/*` without Daniel's word — unchanged from rung 2.

## 8. Abort condition

Ball physics that can't be made to feel controllable; or the substepped collision failing
to hold at large `dt` (which would mean INV-1 is wrong, not just unimplemented).
