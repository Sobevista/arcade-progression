# SCOPE — Rung 6: TI-99/4A part II (Munch Man + Anteater)

*Written 2026-07-19, BEFORE any code, per the archaeology-first law. Pass criteria are
binary and machine-checkable through the sim contract. A scope written afterwards
always passes. Sim-evidence bars are framed as ratios against a null bot, not invented
percentages — the W9 lesson from rung 5.*

## What's under test

1. Can the doctrine handle a **coverage game** (Munch Man) — where the objective is
   filling the world, the enemies have individual personalities, and the power-up
   buffs the player instead of nerfing the enemies (the A-21 inversion)?
2. Can it handle a game whose terrain is **player-authored and adversary-shared**
   (Anteater) — persistent tunnels the enemies also use (A-22), plus a weapon aimed
   with time instead of space (A-23)?
3. Does the **sourced test mode** pattern (Munch Man's `* # *` / "Test Score") work as
   the sim's own level-jump instrument — the 1982 mechanic doubling as our INV-14
   honesty law?

## Blast radius

- New: `rungs/06-ti994a-2/` (this folder), `munchman/index.html`, `anteater/index.html`.
- Touched: `tools/conformance.js` (feedback-check scope extended to rung 6 — new games
  built after the contract conform to it; **[ASSUMED default — Daniel may strike; the
  rung-5 pilot's family playtest hasn't run yet]**), `ARCHAEOLOGY.md` (rung 6 dig —
  already landed), `README.md` + `index.html` landing (docs conformance: both flip
  together), `BUILD_OUTLINE.md`, `tools/SIM_RESULTS.md`.
- NOT touched: existing rungs, `releases.json` (what is advertised stays Daniel's
  pacing call — still Invaders-only).

## Abort condition

If either game cannot meet the one-file / zero-dependency / no-build-step law, or the
sim contract cannot express the tunnel-digging world without a parallel input path,
STOP and write the failure into BUILD_OUTLINE rather than bending a law silently.

---

## Pass criteria — 06a MUNCH MAN (`munchman/index.html`)

Maze and chain (checked via sim):

- **M1** One fixed maze with warp corridors on both sides (sourced feature). Every
  corridor cell reachable from spawn (flood fill = corridor count). Entering a warp
  corridor re-enters on the opposite side.
- **M2** Chain: traversing an unchained cell lays chain and scores **10** points;
  re-traversing chained cells scores nothing. Chain persists across deaths within a
  level **[ASSUMED — Pac-Man precedent]**. Chaining every corridor cell completes the
  level; completion verified via sim full-traversal, final score arithmetic exact
  (10 × cells + energizers + captures).
- **M3** Energizers: 4 per level, 70 points each. Eating one turns all Hoonos edible
  ("black") AND **increases Munch Man's speed** for the window (measured via sim:
  cells/sec strictly greater during the window — the sourced inversion). Capture
  ladder within one window: 100/200/400/800; ladder resets on the next energizer.
- **M4** Four Hoonos (red/yellow/blue/purple) with distinct behaviours, observable via
  sim: trajectories of the four diverge from identical starts; **red** reaches the
  player first in more sim chases than any other Hoono (sourced: most intelligent);
  **yellow** exhibits observable vanish windows (visible flag toggles) and still
  collides while invisible **[ASSUMED lethal-while-vanished]**.
- **M5** Non-energized Hoono contact → life lost; respawn rebuilds entities from
  scratch (INV-5); 3 lives; extra life each 10,000 points (sourced). Lives exhausted →
  game over → leaderboard flow.
- **M6** Level ramp: Hoono speed/aggression rise per level and may exceed player base
  speed (sourced), with an **authored ceiling** (A-18) asserted via sim at a level ≥
  the cap.
- **M7** Invisible level at round 20 (Wikipedia version **[ASSUMED — sources
  conflict, see ARCHAEOLOGY Open list]**): maze walls invisible, no chain; the maze
  is strewn with TI logos and eating them all completes the round. Reached in sim via
  the test mode (M8), not by playing 19 rounds.
- **M8** Sourced test mode: `* # *` on the title screen unlocks round/lives selection;
  any score earned through it is labelled **"Test Score"** and is **excluded from the
  leaderboard** (our adaptation of TI's own honesty law; also the sim's level-jump
  path — the instrument is in-fiction).
- **M9** No entity/state leak across 5 sim restarts; a full game to terminal state
  drives through `sim.step()` only.

Sim evidence (second-oracle law — validates mechanics, never experience):

- **M10** A chasing-aware bot (avoids Hoonos, seeks unchained cells) completes level 1
  at ≥ 10× the completion rate of a random-walk bot over 100 sim games each. The
  ratio, not an absolute bar, is the evidence that the maze rewards play.

## Pass criteria — 06b ANTEATER (`anteater/index.html`)

- **T1** World: dirt field below a surface strip; colony entrance and 4 food items
  placed per set. Moving through dirt converts it to tunnel; tunnels persist for the
  whole set.
- **T2** Round-trip economy: food is collected on the surface and scores **only when
  delivered to the colony**; delivering all 4 completes the set → extra ant (sourced)
  → next set with more/faster eaters.
- **T3** The A-22 rule, binary: eaters move **only** on the surface or in dug tunnel
  cells — never through undug dirt. Asserted over every eater position of every sim
  frame across full sets.
- **T4** Speed asymmetry: ant speed > eater speed inside tunnels (measured via sim —
  without this A-23's weapon is unusable).
- **T5** Eggs: 5 carried **per ant [ASSUMED count-per-life]**; fire lays an egg at the
  ant's cell; it explodes after a fixed fuse; the blast kills eaters in adjacent
  cells; egg count decrements and firing with 0 does nothing. Fuse length is
  **[ASSUMED, tuned by play]**.
- **T6** Rocks: embedded in dirt; digging the cell directly beneath one makes it fall
  until it lands; a falling rock kills eaters — and the ant **[ASSUMED — Dig Dug
  precedent]** — in its path.
- **T7** Eater contact → lose an ant; 3 ants to start; exhausted → game over →
  leaderboard flow.
- **T8** Set ramp (speed, eater count) has an **authored ceiling** (A-18) asserted via
  sim at a set ≥ the cap.
- **T9** The A-23 proof, as a ratio: a scripted kiting bot (lures an eater into a
  tunnel, lays an egg, retraces at tunnel speed advantage) kills eaters at ≥ 10× the
  rate of a bot that drops eggs at random while fleeing, over 100 sim attempts each.
- **T10** No entity/state leak across 5 sim restarts; full game to terminal state
  through `sim.step()` only.

## Pass criteria — shared (both games)

- **S1** All existing conformance contracts green: test hook, sim contract,
  sim-cannot-cheat, hi-score table + storage key + derived-HI, initials entry, touch
  layout, swivel stick, palette, standalone (the INV-19-fixed check reading real
  bytes).
- **S2** Feedback contract per rung 5's S2, extended to both rung 6 games
  **[ASSUMED default — Daniel may strike]**: `Feedback.open/close/isOpen/buildReport`,
  pause + modal input ownership (INV-15), prefilled GitHub issue URL or clipboard, no
  network from the file; conformance `feedback` check scope updated in the same
  commit (INV-18), loud abstention preserved for rungs 2–4 (INV-19).
- **S3** Zero console errors on load, full game, and restart, both games.
- **S4** Docs conformance: README and landing page flip together; `releases.json`
  untouched.

## Explicitly out of scope (v1)

Munch Man: 20 Hoono shape sets (v1 cycles fewer), energizer "three power levels"
(unresolved sourcing — Open list), rounds 40/60 as distinct content (same invisible
mode as 20), two-player. Anteater: difficulty select 1–9, two-player alternating.
Both: tier calibration against family scores (anchored at the family playtest, per
the tier-calibration law).
