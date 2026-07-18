# RUN LOG — Rung 5 (TI-99/4A: Wumpus + Parsec)

*Append-only. Wrong turns stay in.*

## 2026-07-18 — session open

- Archaeology dug and landed first (A-17..A-20), sources in ARCHAEOLOGY.md. SCOPE
  locked before code. Order of build: Wumpus (05a) then Parsec (05b) — the deduction
  game stresses the sim contract in a genuinely new direction (a bot that reasons),
  so it goes first while attention is freshest.
- Feedback contract piloted on these two rungs only; conformance check ships in the
  same commit (INV-18), with a loud pilot-scope abstention for rungs 2–4 (INV-19 —
  an out-of-pilot rung must say so, never silently pass).
- Wumpus render note, decided pre-code: `sim.observe()` exposes ONLY what a player
  could see (current cavern's clues, visited map, state) — ground truth (wumpus/pit
  positions) lives on the test hook root for verification, NOT in observe(). A
  reasoning bot that could read the wumpus position would measure nothing.
- Wumpus reasoning-bot simplification, declared: the bot reads the full tunnel graph
  (as a player who explored completely would) but learns hazards only through clues.
  It measures whether the clue economy pins the wumpus — not human play.

## 2026-07-18 — Wumpus (05a) built and machine-verified

Environment note: the Browser pane refused `file://` for a path outside the session's
project folder (two 5-minute hangs). Stood up `py -m http.server 8377` over the repo
and drove everything over HTTP — which also lets the INV-19-fixed `standalone` check
actually read its subject.

**Verified through `sim.step()` (zero console messages throughout):**
- W1 reachability 150/150 mazes (50 per difficulty); W2 placement 150/150;
  W4 wrap all four edges 150/150; W3 clue derivation exact for every cavern on
  30/30 live games.
- W5: pit → over/pit/score 0; wumpus → over/wumpus; bats → relocation landed
  hazard-free with play continuing. W6: aim→hit→win (score 600); miss →
  over/arrow/0; `arrowUsed` blocks any second aim. W8: score 600 at 0 moves,
  590 after 2 — decreases as specified. W7 fog: visited starts at 1, grows only
  by arrival. W10: five restarts, identical fresh state.
- S2 feedback contract: API complete, opening pauses play, gameplay keys dead while
  open (real dispatchEvent check), report carries game/state/score/date/viewport/UA,
  ESC closes, pause survives close (player resumes on their own terms).

**W9 — the honest story.** Three bot generations: constraint-only (47.5%),
risk-ranked (53%), full probabilistic with consistent-pit-pair enumeration (55–58.5%
across 1,000-game runs). Random-walk baseline: **0.5%**. Instrument bugs found on the
way, both mine (INV-3 held): a pathfinding spin when bat teleports disconnect the
visited region, and my 150-turn cap reporting as results (INV-14 — raised to 400,
timeouts fell from 2.5% to 1.3% and converted mostly to honest losses).

Diagnostic run: **zero deaths on proven-safe claims, zero unsound arrow shots** — every
loss was a forced gamble where no provably-safe cavern existed (pits dominate 2:1).
**The 60% bar in W9 fails as written: measured ceiling ~55–58%.** The cause is
structural and sourced: green walls warn only at distance 1, so the first approach to
any pit region is blind — the 1980 clue economy has an irreducible luck floor around
40% of games. The claim W9 exists to prove — deduction, not luck, is what the game
rewards — is proven at >100× (55–58% vs 0.5%). The 60% was an uncalibrated guess at
a structural constant of the original design. **Flagged for Daniel's ruling in
BUILD_OUTLINE: accept ratio-based evidence, or judge the fidelity-vs-luck tradeoff
differently.** The game itself was not changed to pass the number — one arrow and the
distance-1 pit warning are the sourced 1980 rules.

## 2026-07-18 — Parsec (05b) built and machine-verified

All through `sim.step()`, zero console messages:

- **P1** terrain kills 10/10 scroll offsets. **P2** heat locks at 99 → overheated,
  releases at 39 after decay. **P3** fuel 0 → dying [ASSUMED behaviour, tagged];
  tunnel flown at corridor centre → fuel 100, level advances; tunnel ceiling → dying.
- **P4 score table EXACT, 6/6 classes at levels 1 and 2** — Swoopers/Urbites 100→200,
  LTFs/Dramites 200→300, Saucers/Bynites 300→400. The sourced +100/level holds.
- **P5** saucers spawn at x=−12 (behind the ship, sourced); three trajectory classes
  diverge measurably in 1 s of motion. **P6** speech scheduling counter +2 across a
  level open (announce + wave call); game fully playable with synthesis absent/muted.
- **P7** ramp ceiling authored and asserted: levelMul(20) === levelMul(8) = 1.77 (A-18
  honoured — no datatype wall). **P8** enemy-shot substep sweep **16/16** offsets after
  correcting my own one-step test artifact (INV-3: the 15/16 was the test, not the game).
- **P9** lives 2 → respawn with invulnerability → game over → entry flow on a
  qualifying score; entity count 0,0,0,0,0 across five restarts. **S2** feedback
  battery identical to Wumpus's — all green.
- **P10, read honestly:** firstTimer bot dead in level 1 **20/20**; competent bot past
  level 2 **5/5**, dying at levels 3–4 in 2 of 5 runs — and the "level 13" runs are my
  **600 s timeout, not deaths** (INV-14 again, caught in the reading). The
  "survival time strictly decreases per level" sub-criterion **mismeasures**: level
  duration is fixed content length (~44–49 s at any level), so time cannot carry the
  difficulty signal — the death-level distribution does. Second criterion this rung
  written against the wrong proxy (INV-13's shape). Recorded, not papered over.
  Marathon-at-cap is period-faithful (2M-point records, level 16 repeats) — UX-30
  holds the re-pick trigger.

## 2026-07-18 — Conformance + docs

- `feedback` check added to `tools/conformance.js` **in the same commit as the
  contract** (INV-18), pilot-scoped with a loud abstention elsewhere (INV-19).
- **All five games CONFORMANT**: parsec 12/12, wumpus 11/11 (+1 honest n/a — no
  paddle in a turn-based game), galaga/breakout 11/11, invaders 10/10 (+2 n/a);
  legacy rungs show `[ - ] feedback: PILOT ... abstaining`, never a silent pass.
  Standalone check read real bytes this time (41–54 KB per game).
- README + landing flipped together (docs conformance): rung 5 = two PLAY entries.
  `releases.json` untouched — what is advertised stays Daniel's pacing call.
- **Still ahead, by the repo's own standard: the family playtest.** The sim validated
  mechanics; it has no category for experience (second-oracle law). Wumpus clue
  readability, Parsec difficulty feel, the feedback button in real kids' hands — all
  human questions.

## 2026-07-18 — W9 ruled

Daniel accepted the ratio evidence: deduction-beats-luck proven at >100×; the 60%
number recorded as a guess above the 1980 design's structural ceiling. Wumpus rung
criteria now closed except the human playtest gate.
