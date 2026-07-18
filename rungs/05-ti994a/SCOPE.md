# SCOPE — Rung 5: TI-99/4A (Hunt the Wumpus + Parsec)

*Written 2026-07-18, BEFORE any code, per the archaeology-first law. Pass criteria are
binary and machine-checkable through the sim contract. A scope written afterwards
always passes.*

## What's under test

1. Can the doctrine handle a **turn-based deduction game** (Wumpus) — a genre with no
   reflexes, where the sim bot must *reason*, not aim?
2. Can it handle the ladder's first **scrolling world** (Parsec) — terrain collision,
   a fuel economy, heat discipline, and speech as an information channel?
3. Does the new **feedback contract** (in-game report overlay → prefilled GitHub issue
   / clipboard) work across two completely different game shapes? Piloted here before
   fleet rollout (Daniel's call after the pilot).

## Blast radius

- New: `rungs/05-ti994a/` (this folder), two game files, feedback code inside them.
- Touched: `tools/conformance.js` (new `feedback` check — same commit as the contract,
  per INV-18), `ARCHAEOLOGY.md` (rung 5 dig — already landed), `README.md` +
  `index.html` landing (docs conformance: both flip together), `BUILD_OUTLINE.md`.
- NOT touched: existing rungs (feedback pilot deliberately excludes them),
  `releases.json` (what is advertised stays Daniel's pacing call).

## Abort condition

If either game cannot meet the one-file / zero-dependency / no-build-step law, or the
sim contract cannot express turn-based play without a parallel input path, STOP and
write the failure into BUILD_OUTLINE rather than bending a law silently.

---

## Pass criteria — 05a HUNT THE WUMPUS (`wumpus/index.html`)

Maze and placement (checked across ≥ 50 generated mazes per difficulty via sim):

- **W1** Every cavern reachable from start (flood fill = cavern count) on EASY 32 /
  HARD 24 / PRO 16.
- **W2** Exactly 1 Wumpus, 2 pits, 2 bat caverns; all in distinct caverns; none of
  them in the start cavern; start cavern is hazard-free.
- **W3** Clue correctness, zero tolerance: bloodspot rendered in a cavern **iff**
  tunnel-distance(cavern, Wumpus) ≤ 2 and cavern ≠ Wumpus cavern; green walls **iff**
  adjacent (distance 1) to at least one pit. Verified for every cavern of every
  generated maze.
- **W4** The grid wraps: stepping off any edge arrives at the opposite side, all four
  directions, and clue distances honour the wrap.

Rules:

- **W5** Entering the Wumpus cavern → loss. Entering a pit → loss. Entering a bat
  cavern → relocation to a random cavern that is not a hazard and not the Wumpus;
  the player survives it.
- **W6** Exactly one arrow. Firing into the adjacent cavern that holds the Wumpus →
  win. Firing anywhere else → loss. No second arrow exists in any state.
- **W7** Fog of war: an unvisited cavern renders nothing; every visited cavern
  persists on screen for the rest of the game.
- **W8** Score (declared adaptation, see UX-27): on a win, score > 0 and decreases
  with moves taken; on a loss, score = 0. Leaderboard integration per the shared
  protocol.

Sim evidence (second-oracle law: this validates mechanics, never experience):

- **W9** A reasoning bot (moves to safe caverns only, fires only when its constraint
  set pins the Wumpus to exactly one adjacent candidate) wins ≥ 60% over 200 sim
  games on EASY. A random-walk bot wins < 15% over the same. The gap is the evidence
  that deduction, not luck, is what the game rewards.
- **W10** No entity/state leak across 5 sim restarts; all three difficulties
  playable to terminal state through `sim.step()` only.

## Pass criteria — 05b PARSEC (`parsec/index.html`)

- **P1** Terrain scrolls continuously; ship–terrain contact at any scroll position →
  death. Verified by sweeping the ship into terrain at ≥ 10 scroll offsets via sim.
- **P2** Laser heat: sustained fire reaches overheat and locks firing; lock releases
  only below the cool threshold; heat decays when not firing. All three transitions
  observed via sim.
- **P3** Fuel drains during play; reaching 0 kills the ship [ASSUMED behaviour,
  tagged]. Completing the refuel tunnel restores full fuel. Tunnel walls kill.
- **P4** Six enemy classes with the sourced score pairs — Swoopers/Urbites 100,
  LTFs/Dramites 200, Saucers/Bynites 300, **+100 per level** — verified exactly via
  sim kills at levels 1 and 2. Asteroids 100 each; surviving the belt +1,000.
- **P5** Saucers approach from behind (spawn left of the ship); at least three
  behaviourally distinct attack patterns exist among the six classes (verified by
  trajectory divergence in sim observation).
- **P6** Speech: when `speechSynthesis` exists, level/wave/fuel announcements are
  scheduled (observable via test hook counter); when absent or muted, the game is
  fully playable with zero errors.
- **P7** Level ramp has an **authored ceiling** (A-18): speed/proximity growth caps
  at a stated level; the cap is asserted in sim at a high level (≥ 20).
- **P8** One-shot-per-press fire with substepped collision (INV-1/INV-12): a
  full-stride sweep at clamped dt finds zero tunnelling through the smallest enemy.
- **P9** 3 lives; ship death → respawn with invulnerability window; lives exhausted →
  game over → leaderboard flow. No entity leak across 5 restarts.
- **P10** Sim tiers: a scripted competent bot survives ≥ 2 levels; a firstTimer-class
  bot dies in level 1 with high probability (≥ 80%). Difficulty scales (competent
  bot's survival time strictly decreases across levels 1→3 measured by sim).

## Pass criteria — shared (both games)

- **S1** All existing conformance contracts green: test hook, sim contract,
  sim-cannot-cheat, hi-score table + storage key + derived-HI, initials entry, touch
  layout, swivel stick, palette, standalone (INV-19-fixed check must actually read
  the source).
- **S2** **Feedback contract**: `window.__<game>.Feedback` exposes `open()`,
  `close()`, `isOpen`, `buildReport()`. Opening pauses gameplay and owns its input
  (INV-15 — game keys dead while the overlay is up, every button treated as already
  held on entry). `buildReport()` includes game name, score, state, date, viewport,
  and user agent. The GitHub path opens a prefilled issue URL (no fetch — standalone
  stays true); the copy path writes the same report to the clipboard. New
  `feedback` conformance check ships in the same commit (INV-18), scoped to the
  pilot rungs with a loud abstention (not a pass) elsewhere (INV-19).
- **S3** Zero console errors on load, on a full game, and on restart, both games.
- **S4** Docs conformance: README and landing page flip together; `releases.json`
  untouched.

## Explicitly out of scope (v1)

Wumpus Blindfold/Express modes; Parsec's morphing bonus vocabulary beyond
level/wave/fuel lines; Killer Satellites (L4+ enemy, add with content pass);
tier-calibration against family scores (comes WITH the family playtest, per the
tier-calibration law — bots get anchored then).
