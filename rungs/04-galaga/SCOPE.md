# SCOPE — rung 4, Galaga (Namco 1981)

**Locked 2026-07-19, before any code.** Archaeology and Suffering Ledger completed first
(`ARCHAEOLOGY.md` rung 4) — findings A-13 through A-16 already extracted from the dig.

---

## 1. What's under test

Can we build a game whose **content is choreography** — authored entrance trains and
dive paths (A-14) — plus the two mechanics Galaga invented: the **capture/rescue/dual
fighter** loop (A-15) and the **challenging stage** pacing beat (A-16), while keeping
the fixed 8-slot enemy-shot pool *without* reproducing its famous leak (A-13).

## 2. The primitive this rung teaches

**Motion as data.** Rungs 2–3 move things with rules; Galaga moves things with *authored
paths*. The build stands or falls on the path data model (parametric curves driven by
per-entity progress), not on any mechanic. Second primitive: **priced risk** — the score
table pays multiples for attacking danger at its most dangerous.

## 3. Inherited laws that apply on sight

- **INV-1/INV-2/INV-12 (substep, recompute per substep).** Player shots at speed vs 8 px
  sprites; enemy shots vs the fighter. Substepped from the first line, vectors recomputed
  inside the loop.
- **INV-5/INV-11 (reset rebuilds; one function per lifecycle event).** `newGame()`,
  `startStage()`, `respawn()` — no booleans. Galaga adds a subtle case: death during a
  stage must NOT rebuild the formation (rung 2's INV-11 scar, same tension here).
- **INV-6 (test hook).** `window.__galaga` with `state`, `score`, and everything the
  criteria below need.
- **INV-10 (authentic needs a source).** Fidelity claims trace to `ARCHAEOLOGY.md`;
  dive-path shapes, entrance-train composition, and breathing timing are tagged ASSUMED
  there, not presented as fidelity.
- **INV-14 (no benchmark returns its own configuration).** Sim runs distinguish
  TIMEOUT from GAME OVER.
- **INV-15 (modal states own their bindings, assume buttons held).** Initials entry per
  the shared protocol.
- **INV-17/INV-18 (measure the rendered box; contracts are enforced).** Ships with the
  edge-anchored touch layout, swivel stick, and must pass `tools/conformance.js` —
  **all applicable contracts, zero FAIL** — before playtest.

## 4. PASS criteria — binary, checkable by something other than me

- [ ] Loads with **zero page console errors**
- [ ] Fighter moves on input, clamped to the playfield; **max two player shots on screen**
      — a third fire request while two are live is refused
- [ ] Stage 1 entrance: enemies fly in along authored paths in trains, are **killable in
      transit**, and every survivor settles into its formation slot (**40 slots:
      20 bees / 16 butterflies / 4 bosses**)
- [ ] Formation "breathes" (spread/contract cycle) while idle
- [ ] Enemies leave formation on dives and **return to their slot** if not destroyed
- [ ] Scoring exact per the sourced table: bee 50/100 (formation/diving), butterfly
      80/160, boss 150/400, boss+1 escort 800, boss+2 escorts 1600
- [ ] Boss takes **two hits** (first hit visibly wounds it)
- [ ] **Enemy shots draw from a fixed 8-slot pool; a slot is always released** —
      verified by forcing spawn attempts at hostile coordinates (including x=0) and
      confirming pool occupancy returns to 0 (the A-13 regression)
- [ ] **Capture loop:** a diving boss can tractor-beam the fighter (costs a life, ship
      shown captive); shooting that boss **while it dives** frees the ship → **dual
      fighter** with two side-by-side shots (pool budget doubles to 4) and double hitbox;
      shooting the captor **while it sits in formation** destroys the captive (no rescue)
- [ ] **Challenging stage** at stage 3 (and every 4th after): enemies fly through and
      never fire, 100/enemy, **perfect 40/40 pays 10,000**, tally screen shown
- [ ] Extra fighter at 20,000 and every 70,000 after
- [ ] Game over shows **shots fired / hits / hit-miss ratio**
- [ ] **No tunneling** at forced-large-`dt`, swept across a full stride (player shot vs
      an 8 px target)
- [ ] No entity leak across 5 restarts; shot pool empty at each game over
- [ ] Sustains **~60 fps** with full formation + starfield
- [ ] All shared contracts green in `tools/conformance.js`

**Explicitly NOT claimed:** that it feels right — dive difficulty, entrance speed,
capture frequency are Daniel's and the kids' verdicts (INV-9). Sim tiers run first to
answer the measurable half (winnable? stage length? floor experience?) so human playtest
is spent on what only humans can see.

## 5. Fidelity targets (all sourced in ARCHAEOLOGY.md rung 4)

40-enemy formation (20/16/4) · staged entrance trains, three patterns cycling · two
player shots max · score table 50/100, 80/160, 150/400/800/1600 · challenging stage at
3 + every 4th, 10,000 perfect · capture/rescue/dual fighter · extra life 20,000 then
every 70,000 · scrolling two-layer blinking starfield (the 05XX's *result*) · portrait
play area · TI-99/4A palette (series constraint) · smooth motion (the 1981 inversion —
see Suffering Ledger).

**ASSUMED and declared:** dive-path shapes and speeds, entrance-train composition,
breathing timing — authored approximations, tuned by playtest, tagged in ARCHAEOLOGY.

**Deliberately out (held, not judged):** morphing transform enemies (stage 4+ content);
the no-fire bug itself (recorded as archaeology, not reproduced).

## 6. Tech — unchanged

One HTML file, vanilla JS, Canvas 2D, zero dependencies, no build step, integer-scaled
pixel art (INV-7), Web Audio synthesised SFX, `window.__galaga` hook, sim contract,
shared touch layout + swivel stick, hi-score per `tools/hiscore.js` protocol
(`arcade.galaga.scores`).

## 7. Blast radius

Writes limited to `rungs/04-galaga/` plus the repo's shared docs (ARCHAEOLOGY, BUILD_OUTLINE,
INVARIANTS/UX if lessons are earned, landing page + README when the rung goes live —
README and landing must flip together per the docs conformance check).

## 8. Abort condition

The path data model failing to produce controllable, tunable choreography — i.e., if
authoring a new dive means rewriting code rather than editing data, the model is wrong
(that would gut A-14, the rung's central lesson). Or the capture state machine proving
untestable deterministically through `sim.step()`.
