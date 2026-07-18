# SCOPE — Rung 7 Phase 1: DELIVERANCE (NES-class Exodus platformer)

*Written 2026-07-18 evening, BEFORE any game code. Pass criteria locked now; a scope
written afterwards always passes. Title: Daniel's ruling this session. Theme + legal
posture: UX-34. Archaeology: A-25..A-29.*

## What this is

The ladder's NES rung: SMB-class scrolling-platformer mechanics re-derived from the
public record (the commented disassembly), with **all expression original** — an
Exodus-themed game. Phase 1 = engine + physics + forward-only camera + **one complete
three-level world** (Egypt → the Red Sea). More worlds are later phases; this phase
proves the engine and the feel.

## The physics fidelity baseline [VERIFIED — transcribed this session]

Transcribed directly from SMBDIS.ASM (doppelganger's commented disassembly,
gist 1wErt3r/4048722, data tables at lines 6014–6034; tier-selection logic at
lines 6095–6123). Units: X speed in 1/16 px/frame with a 1/256 accumulator
(so 1/4096 px/f² for accelerations); Y speed in px/frame with a 1/256 accumulator.

| Table | Values (hex) | Meaning |
|---|---|---|
| MaxRightXSpdData | $28, $18, $10 (+$0c pipe) | max run 2.5 px/f · walk 1.5 · water/slow 1.0 |
| MaxLeftXSpdData | $d8, $e8, $f0 | the same three, negative (two's complement) |
| FrictionData | $e4, $98, $d0 | accel/decel by regime: run · walk · above-walk |
| PlayerYSpdData | $fc, $fc, $fc, $fb, $fb | jump initial Vy by takeoff-speed tier: −4, −4, −4, −5, −5 px/f |
| JumpMForceData | $20, $20, $1e, $28, $28 | gravity while rising with A held, by tier (1/256 px/f²) |
| FallMForceData | $70, $70, $60, $90, $90 | gravity falling / A released, by tier |
| Tier thresholds | < $09, < $10, < $19, < $1c, ≥ $1c | takeoff |Vx| selects the tier (disasm lines 6095–6107) |

Self-validation this table predicts (and P2 must measure): standing hold-A jump apex
= **66 px (~4 tiles)**; full-run hold-A apex = **82 px (~5 tiles)** — the two famous
SMB jump heights ("clears a 4-block wall standing, a 5-block wall running"), derived
from the table by discrete summation (Σ(v₀−gk)/256, move-then-integrate order), not
tuned. *(Pre-build correction, logged: first draft said 64/80 from continuous
physics; the discrete derivation was done before any code existed.)*

Declared simplifications, tagged [ASSUMED]: air-control rules reduced to walk-accel
with takeoff-locked max; release-decel = walk accel, skid = $d0; downward terminal
velocity capped at 4 px/f; swim tiers (5–6) unused (no water levels in Phase 1).
Divergences from the baseline for OUR game's feel are allowed **only after** P1/P2
pass against the table first, and each gets a RUN_LOG entry.

## Under test (binary pass criteria — machine-checkable via the sim contract)

- **P1 Speed conformance:** steady-state walk speed = 24/16 px/f and run = 40/16 px/f,
  measured through `sim.step()` at fixed 60 Hz, exact (integer engine — no tolerance).
- **P2 Jump conformance:** standing hold-A apex height 64 px ±1; full-run hold-A apex
  80 px ±1; a 1-frame A tap gives a measurably lower apex than held A (variable jump
  works); apex ordering monotonic across the five tiers.
- **P3 Determinism:** identical seeded input script → byte-identical `observe()`
  serialization after 3,000 steps, run twice from `sim.reset()` (fixed timestep,
  integer physics, seeded RNG — A-27's law made testable).
- **P4 Camera law:** camX is monotonically non-decreasing over any run (forward-only,
  the 1985 rule); player's left edge never goes below camX.
- **P5 Collision:** zero tunneling in a full-speed sweep (run + max-fall into walls,
  floors, and single-tile columns; substepped per INV-1/INV-12, snap per INV-20);
  after any horizontal ejection the player AABB overlaps no solid tile.
- **P6 Streaming:** entities exist only within the live window (spawn ahead of camera,
  culled behind); live entity count bounded (≤ 24) across a full traversal of every
  level; zero entity leak across 5 deaths/restarts (series law).
- **P7 Winnability + losability:** a scripted competent bot (virtual inputs only —
  bots cannot cheat) completes 1-1, 1-2, and 1-3 end to end; a seeded random-input
  firstTimer bot dies in 1-1. Both through `sim.step()` at speed.
- **P8 Scoring audit:** manna +100, stomp +100/+200, clear bonus + time bonus — zero
  arithmetic mismatches across an audited bot run (rung-6 precedent). Manna spoils
  (despawns) 600 frames after entering the world [UX-35, Exodus 16] — timing exact.
- **P9 Conformance:** `tools/conformance.js` fully green for `deliverance` (test hook,
  sim contract, hi-score table + storage key + derived-HI, initials entry, touch
  layout, swivel stick, feedback module [ASSUMED default per rung-6 precedent —
  Daniel may strike], standalone: one file, zero external requests).
- **P10 Frame budget:** average step+draw ≤ 4 ms at 60 Hz on this machine (measured,
  not assumed — the vblank lesson in modern units).

## Blast radius

- New: `rungs/07-deliverance/` (this folder): `index.html`, `SCOPE.md`, `RUN_LOG.md`.
- Touched: `tools/conformance.js` (docs slug `07-nes` → `07-deliverance`; pilotOnly
  += `deliverance`), `README.md` + `index.html` landing (docs conformance — both flip
  together), `BUILD_OUTLINE.md` / `ARCHAEOLOGY.md` / `UX_DECISIONS.md` (records).
- NOT touched: `releases.json` (what is advertised stays Daniel's pacing call),
  every other rung, `tools/hiscore.js`, `tools/playtest-sim.js` (Phase 1 bots live
  in-page; tier-ladder calibration rides the family playtest, as with Galaga).

## Abort condition

If the transcribed table, honestly ported to the fixed-point engine, fails to
reproduce the two known jump heights (4 and 5 tiles) — stop and re-dig the
disassembly. Do not tune constants to force P2; the table is the oracle, and a
fudged oracle poisons every later phase.

## Content spec (Phase 1 world — all expression original, UX-34)

- **1-1 THE BRICKYARD** — Goshen's mud-pits and brick stacks. Teach walk/run/jump;
  taskmaster walkers; manna intro; midpoint pillar-of-cloud checkpoint; gate goal.
- **1-2 THE NINTH PLAGUE** — darkness palette; serpents join; tighter platforming.
- **1-3 THE RED SEA** — the set-piece: the sea PARTS at a trigger (the rung's camera
  showcase), a corridor between towering water walls, chariots pressing from behind,
  far shore = world clear, sea closes behind.
- Player: the Shepherd (staff in hand). One-hit death Phase 1 (staff power-ups are a
  later phase). 3 lives; level timer; extra life at 10,000.
