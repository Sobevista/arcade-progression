# SCOPE — Rung 8: TI-99/4A part III (ALPINER)

*Written 2026-07-19, BEFORE any code, per the archaeology-first law. Pass criteria are
binary and machine-checkable through the sim contract. A scope written afterwards
always passes.*

**Why this rung exists, honestly.** Alpiner was back-burnered 2026-07-18 for
"diminishing trove returns." Daniel's brother chose it on a family holiday, which
overrides the ruling. The dig then showed the back-burner reasoning was wrong: a third
game on the same machine is the only way to catch that **Alpiner and Parsec make
opposite bets with the same optional peripheral** (A-30 vs A-19). The rung earns its
place — but that is a claim, and A1 below is the criterion that tests it rather than
asserting it.

**Numbering note:** folders here are **build order**, not era (`06-ti994a-2` came after
`05` and before NES `07`). This is the 8th build session, hence `08-`. It does not
imply the ladder moved past the NES.

## What's under test

1. **Can a finding be enforced instead of narrated?** A-30 says an optional peripheral's
   channel must be *redundant*. Most trove entries are prose. This one is falsifiable in
   a test: **the same seed, played the same way, must produce the same outcome with
   speech on and speech off.** If muting changes the result, we have built the unfair
   1982 game A-30 says TI could not ship.
2. Can the doctrine handle a **vertical, scrolling, cell-quantised climb** — after two
   flat-plane TI games (Munch Man's maze, Anteater's dig)? INV-20 is the live risk: a
   grid mover on a scrolling field is exactly where accumulated float walks through walls.
3. Does the **inverted timer** (A-31) survive contact with a real player, or does a clock
   that only runs when you stand still read as broken?
4. Does an **authored curve around a randomised layout** (A-32) actually produce replay,
   measurably — or do random layouts just produce unfair ones?

## Blast radius

- New: `rungs/08-ti994a-3/` (this folder), `alpiner/index.html`.
- Touched: `tools/conformance.js` (add `alpiner` to the feedback `pilotOnly` list — new
  builds conform to the current contract, INV-18, same commit), `ARCHAEOLOGY.md` (rung 8
  dig — already landed), `UX_DECISIONS.md` (the scroll call + speech posture),
  `INVARIANTS.md` (only if something is genuinely earned), `README.md` + `index.html`
  landing (docs conformance: both flip together), `BUILD_OUTLINE.md`, `tools/SIM_RESULTS.md`.
- NOT touched: existing rungs, `releases.json` (**what is advertised stays Daniel's
  pacing call** — still Invaders-only).

## Abort condition

If the game cannot meet the one-file / zero-dependency / no-build-step law, or if A1
(the mute-equivalence check) cannot be expressed through `sim.step()` without a parallel
input path, **STOP** and write the failure into BUILD_OUTLINE rather than bending a law
quietly. A1 failing is a *finding*, not a reason to weaken A1.

---

## Pass criteria — ALPINER (`alpiner/index.html`)

### The rung's thesis

- **A1 — MUTE EQUIVALENCE (the A-30 criterion).** For 20 seeded sim games driven by an
  identical scripted input tape, the full outcome tuple (score, summit reached, steps
  taken, lives lost, final elevation) is **byte-identical** with speech enabled and
  disabled. Speech may not gate, delay, or alter any state transition. **A failure here
  fails the rung**, not the checkbox.
- **A2 — Speech is redundant by construction.** Every spoken cue has a simultaneous
  visual counterpart (on-screen warning glyph / colour flash) sourced from the *same*
  state field in the same frame. Asserted by a check that enumerates cue types and
  verifies each has a paired visual, not by inspection.

### Mountain, movement, terrain

- **A3** Six mountains in sourced elevation order — Hood 3,427 / Matterhorn 4,477 /
  Kenya 5,193 / McKinley 6,194 / Garmo 7,495 / Everest 8,848 m — across **18 levels in
  3 rounds** (level N → mountain `(N-1) % 6`). Names and metres exact.
- **A4** **46 m per upward step** (sourced, exact). Steps-to-summit is therefore derived,
  not authored: `ceil(height / 46)` — Hood ~75, Everest ~193. Elevation readout = steps
  climbed × 46, and must equal the mountain height (±46) at the summit.
- **A5** Eight-directional movement on a **cell grid**, one step per input edge.
  **INV-20 is the live risk: arrival assigns the target cell coordinate exactly, never
  accumulates toward it.** Asserted by a containment sweep — 80 sim games, zero climbers
  outside the terrain bounds, zero cells entered without a rules check.
- **A6** **Wrap-around horizontally** (the mountain is a cylinder): stepping off the left
  edge re-enters at the right, preserving row. Asserted over full sim climbs.
- **A7** The view **scrolls vertically** with the climber [AUTHORED CALL — see
  UX_DECISIONS; the original's display behaviour is unresolved (ARCHAEOLOGY rung-8 open
  question 1) and the 46 m/step arithmetic rules out a single static screen]. Terrain
  scrolls in whole cells; the climber never leaves the visible field.
- **A8** **Randomised layout per play, seeded** (A-32) — same seed, same mountain; a
  different seed, a different layout. Asserted: 2 games at one seed have identical hazard
  placement, 20 games at distinct seeds have ≥ 18 distinct layouts.
- **A9** **Every generated layout is climbable.** A path from spawn to summit exists using
  only legal steps, proven by flood fill **at generation time** (the Munch Man
  self-validating-maze precedent — generation asserts, it does not hope). Zero
  unclimbable layouts across 200 generations.

### Hazards and cost

- **A10** Eleven obstacles with the sourced step-penalty table exact: trees block
  movement only (0), stumps 2, skunks 2 (**+2 more if sprayed**), snakes 3, bats 5,
  brush fires 5, bears 6, mountain lions 7, vultures 8, rams 9. "Penalty" = knocked down
  that many steps, cascading (see A12). Arithmetic audited across 100 sim collisions,
  zero mismatches.
- **A11** **The Abominable Snowman on skis** is its own punishment class: contact sends
  the climber **to the bottom of the mountain** and costs a life. He does not use the
  step table.
- **A12** A knock-down **cascades**: if a fall lands on another hazard, that hazard's
  penalty applies too. A cascade reaching the bottom costs a life. Chain resolution
  terminates (no infinite cascade) — asserted over 100 forced cascades.
- **A13** Falling hazards escalate by round (sourced): **rockslides all levels,
  avalanches from level 7, icefalls from level 13**. Falling objects are **substepped**
  (INV-1 / INV-12: recompute the step vector inside the loop from current velocity) so
  none passes through a climber between frames. Sweep: 21 approach offsets × 3 hazard
  types, zero pass-throughs.
- **A14** Later-level falling hazards may descend **faster than the climber can step**
  (sourced) — forcing predictive positioning. Measured via sim and reported, with an
  **authored ceiling** (A-18) asserted at a level ≥ the cap.

### Timer, lives, scoring

- **A15 — The inverted timer (A-31), exact.** The clock decrements **only while the
  climber is stationary**. Asserted directly: 5 s of continuous stepping consumes **0**
  timer; 5 s standing still consumes 5 s. Timer expiry costs a life.
- **A16** **Four climbers** to start (sourced: three reserve boots + the one on screen);
  **+1 per completed round** (i.e. on summiting Everest). Respawn **rebuilds** entity
  state from scratch (INV-5), never repairs it. Lives exhausted → game over →
  leaderboard flow.
- **A17** Scoring exact per the sourced table — base points per step by mountain and
  round: Hood 10/20/30, Matterhorn 12/24/36, Kenya 15/30/45, McKinley 20/40/60, Garmo
  25/50/75, Everest 30/60/90. **Summit bonus = 2 × base × seconds remaining** (manual,
  verbatim). Score arithmetic audited across 100 bot games, zero mismatches.
- **A18** Target bonuses (bear 500, lion 750, ram 1000) [**ASSUMED trigger** — no source
  explains the mechanism, ARCHAEOLOGY open question 7]. v1 awards them on **surviving**
  a close pass, and the assumption is labelled in-game in the scoring help, not hidden.
- **A19** After level 18: [**AUTHORED** — sources silent, ARCHAEOLOGY open question 3]
  the game continues at level-18 difficulty with round-3 scoring, flagged as an authored
  choice rather than a claim about the original.

### Instrument and hygiene

- **A20** Sourced **`*#*` test mode** on the title screen: select levels 1–18 and lives
  1–9, displaying **"Test"**. Any score earned through it is labelled **Test Score** and
  is **excluded from the leaderboard** (rung-6 precedent — TI's own instrument-honesty
  law, and the sim's level-jump path, so the instrument stays in-fiction).
- **A21** No entity/state leak across 5 sim restarts; a full game to terminal state drives
  through `sim.step()` only.

### Sim evidence (second-oracle law — validates mechanics, never experience)

- **A22** A hazard-aware bot (waits out falling objects, routes around ground hazards
  using the wrap) summits Hood at **≥ 10×** the rate of a random-walk bot over 100 sim
  games each. **The ratio against a null, not an invented percentage** — the W9/T9 lesson
  from rungs 5 and 6.
- **A23 — the A-31 proof, as a ratio.** A bot that *waits* for falling hazards to pass
  scores **≥ 2×** a bot that never stops moving, over 100 games each. If waiting is not
  worth more than rushing, the inverted timer is decoration and A-31 is not earned here.
  **A null result gets written up, not tuned away** (INV-13).
- **A24 — the A-32 proof.** Across 100 seeds, summit rate for a fixed-skill bot varies but
  **no seed is unwinnable** (A9) and **no seed is trivially winnable** (summit rate not
  100% for the random-walk null on any seed). Randomisation must add variance without
  adding unfairness.

### Shared contracts

- **A25** All existing conformance contracts green: test hook (`window.__alpiner` with
  `state`/`score`), sim contract (`input/step/reset/observe`), sim-cannot-cheat, hi-score
  table + storage key `arcade.alpiner.scores` + no legacy `alpiner.high`, initials entry
  (`LETTERS`, no space — INV-15 corollary), touch layout (**measured rendered boxes**,
  INV-17), swivel stick, palette, standalone (real bytes, INV-19).
- **A26** Feedback contract per rung 5's S2, extended to Alpiner [ASSUMED default — Daniel
  may strike]: `Feedback.open/close/isOpen/buildReport`, pause + **modal input ownership
  (INV-15: modal defines its own bindings and assumes every button is already held)**,
  prefilled GitHub issue URL or clipboard, no network from the file. Conformance
  `pilotOnly` updated **in the same commit** (INV-18); rungs 2–4 keep abstaining loudly.
- **A27** Zero console errors on load, full game, and restart.
- **A28** Docs conformance: README and landing page flip together; `releases.json`
  untouched.

## Explicitly out of scope (v1)

Two-player (sources disagree on the mode — ARCHAEOLOGY open question 10); the complete
speech phrase list (only ~5 fragments recovered — v1 ships a small sourced set and says
so); per-mountain hazard assignment as distinct content (4apedia's elevation-band
grouping is unconfirmed, so v1 scales hazard *mix* by level rather than claiming TI's
mapping); flicker/sprite multiplexing (A-33 recorded, not reproduced); tier calibration
against family scores (anchored at the family playtest, per the tier-calibration law).

## What would make me stop and ask

If A1 fails and the cause is that a spoken cue genuinely carries information the screen
cannot — that is not a bug to patch, it is evidence **against A-30** and for A-19, and it
goes to Daniel before I change either the game or the finding.
