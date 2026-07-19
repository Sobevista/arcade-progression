# Arcade Progression — Build Outline

Owner: Daniel + Claude. Purpose: **re-derive the evolution of video games from the
constraints up** — work out what the original designers must have spent a long time
figuring out, build it, and keep the lessons — so the eventual big build starts with its
roadblocks already earned and solved.

## LOCKED

- **Shared contracts are enforced, never just documented (added 2026-07-18).** Every
  cross-rung contract — test hook, sim contract, high score protocol, touch layout, swivel
  stick — is checked by `tools/conformance.js`, which returns FAIL for any rung missing
  one. Born because the leaderboard shipped on rung 3, was written down as a TODO for
  rung 2, and then didn't happen for a day. **A convention with no enforcement is a
  preference, and preferences drift (INV-18).** Adding a new shared contract means adding
  its check in the same commit. Never re-introduce a TODO in place of a check.
- **Simulated playtest before human playtest (added 2026-07-18).** Every rung implements
  the **sim contract** — `sim.input` / `sim.step(dt)` / `sim.reset()` / `sim.observe()` —
  so `tools/playtest-sim.js` can drive it with tiered bots (beginner / intermediate /
  adept) at ~8,600× real time. Bots may touch **only** the virtual controls, never game
  state directly: a harness that teleports the paddle measures nothing.
  Its job is the measurable questions — is this winnable, how long does a level take, does
  difficulty scale with skill — so **human playtest is spent on what only a human can
  answer.** It does not replace human testing; every finding that mattered on rungs 2 and 3
  came from a person playing (INV-9).
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

- **Each rung is a movable cog, and it is measured (added 2026-07-18).** One HTML file,
  zero external requests — verified by the `standalone` conformance check, not assumed.
  Release pacing is controlled by `releases.json` (soft gate: what is advertised) or by
  keeping a rung on a branch until merge (hard gate: what exists). See README.

## GOVERNANCE — how changes reach `main` here vs. on the mesh

Verified 2026-07-18, because Daniel asked whether the merge-to-main requirement was being
bypassed:

| | `agent-mesh` | `arcade-progression` |
|---|---|---|
| Branch protection | **yes** — 1 approving review required | **none** (HTTP 404, unprotected) |
| Required status check | **yes** — `test` | none (no CI) |
| How change lands | branch → PR → CI green → Daniel merges | Daniel runs `git push` |
| Who authored every commit | mixed (mesh + human) | **Daniel Slocum, all of them** |

**The honest reading:** the human gate is intact — Claude has written no commit and pushed
nothing here; every commit on this repo was run by Daniel at his terminal. What is *absent*
compared to the mesh is the **mechanical** gate: no protection, no CI, no review step. So
the guarantee is **self-enforced policy, not enforced mechanics** — the same distinction the
harness already recorded as *"sight is not merge rights."*

That is a deliberate fit for what this repo is (browser games with no test suite to gate on),
not an oversight. It should be revisited the moment either becomes true:
- a rung grows a test suite worth gating (then add CI + protection, per the mesh pattern), or
- anything other than Daniel starts pushing here.

## OPEN

- **Rung 3 target:** Breakout (1976) as a backfill vs. jumping straight to Galaga.
  Recommendation on the table: Breakout first — it is the literal causal link between
  rungs 1 and 2, and it teaches reflection physics that neither neighbour does.
- **Hosting:** GitHub Pages for a public URL; eventual home is b4him.com.
- **CI:** none yet. Add the truth-machine pattern when there is a rung whose tests are
  worth gating (the browser-driven pass criteria would need a headless runner).
- **Audio verification:** synthesised SFX are proven to *construct and schedule*
  correctly, but audibility on a given device is a human check. No automated oracle.
- ~~Rung 5 W9 ruling~~ **RULED 2026-07-18 (Daniel): ratio evidence accepted.** W9's
  intent (deduction beats luck) stands proven at >100× (reasoner 55–58% vs random
  0.5%, zero unsound inferences); the 60% figure is recorded as a pre-build guess
  that sat above the sourced 1980 design's structural luck floor (pit warnings only
  at distance 1). Game unchanged. Criterion lesson stays on the record in RUN_LOG.
- **Rung 5 P10 sub-criterion (recorded defect):** "competent survival time strictly
  decreases per level" measured the wrong proxy — level duration is fixed content
  length. Death-level distribution carries the difficulty signal instead (firstTimer
  100% dead in L1; competent past L2 5/5, dying L3–4 in 40% of runs, marathons
  otherwise — period-faithful per the 2M-point record culture, UX-30).
- **Feedback contract rollout (DANIEL, after the family pilot):** the in-game
  FEEDBACK overlay (pause → context-stamped report → prefilled GitHub issue or
  clipboard) is live on the two rung-5 games only; conformance abstains loudly on
  rungs 2–4. Rollout = empty `pilotOnly` in tools/conformance.js and add the overlay
  to the three legacy rungs. Also queued: a `.github/ISSUE_TEMPLATE/playtest` form so
  drive-by GitHub visitors arrive structured.
- **Release gating for rung 5 (DANIEL):** `releases.json` still advertises Invaders
  only; rungs 3, 4, and now 5a/5b await the pacing call.
- ~~Rung 7 title~~ **RULED same evening (Daniel): DELIVERANCE.** Folder
  `rungs/07-deliverance/`; docs-conformance slug updated in the same commit.
- **Alpiner (extra TI rung): BACK-BURNER (Daniel's ruling, 2026-07-18).** Buildable
  any time; diminishing returns against the trove now that the TI has two rungs. The
  harness OPEN LOOPS carries it.

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

- **2026-07-18 — Rung 3 playtest 4 (Daniel scored 319, cleared most of wall 1) and the
  simulated-playtest harness built.** His verdict: *"tense the whole time knowing the
  rules, the labeling really helped and the speed was spot on."* Speed curve and HUD
  **locked**. One bug he caught: the speed-up message still read `ORANGE ROW` while the
  band was blue — same one-fact-two-homes failure as the title screen, fixed by splitting
  historical `name` (drives 1976 logic) from displayed `label` (must match what's on screen).

  **`tools/playtest-sim.js` + the sim contract, his idea:** three tiered bots so a human
  isn't burned on first-pass testing. Verified honest — the bot moved exactly the legal
  paddle maximum and no further. Results in `tools/SIM_RESULTS.md`:

  | | Beginner | Intermediate | Adept |
  |---|---|---|---|
  | Clears wall 1 | 0% | 67% | 100% |
  | Median score | 5 | 826 | 896 perfect |
  | Time for wall 1 | never | 311 s | 309 s |

  **Answering UX-22 with numbers:** wall 1 takes **~5.2 min** even played well; the full
  two-wall game **~9–10 min**. That is ~72% over the 180 s coin-op window and above the
  3–7 min casual band. Cutting 8 rows → 6 would land the full game near 7 min.
  **But the sim measures length, not drag** — Daniel found the current build tense and
  engaging, and no timing metric distinguishes those (INV-13). Brick count still held.

  **The sharper finding is the floor, not the ceiling:** the beginner tier scores 5 points
  and is dead in 16 seconds. If anything here is broken it is the newcomer experience.

  **New law INV-14** — a benchmark that can return its own configuration will, and it looks
  like data. The first sweep reported the 8-minute cap as the game length; only two tiers
  returning the *identical* number gave it away.

- **2026-07-18 — Family playtest: high score table, and the touch layout rebuilt by a
  9-year-old.** Real scores in: Daniel **319**, Lucius (9) **12 → 13 → 37**, Mum **21**,
  the 6-year-old **4, 4, 5, 7**.

  **Sim calibration result: the beginner tier was never wrong, it was mislabelled.** Bot
  beginner median **5**, range **4–7**; the six-year-old scored **4, 4, 5, 7** — the same
  distribution. What's wrong is the ladder above it: `intermediate` (826) and `adept` (896
  perfect, zero balls lost) are beyond any human measured, leaving **a hole exactly where
  every real player lives**. Proposed relabel to `firstTimer / novice / competent / expert
  / ceiling` with two tiers to build. Also noted: Lucius improved **3× across three
  attempts**, and no bot tier models learning at all.

  **High score table shipped** (8 entries, 3-letter initials, `arcade.<game>.scores`),
  protocol in `tools/hiscore.js`. Declared anachronism — initials entry didn't exist until
  **Star Fire, 1979** (A-12); imported backwards because the competitive loop is what
  brings kids back. Three new laws from building it: **INV-15** (modal states own their
  bindings and must assume every button is already held — "DAN" saved as "ADA"),
  **INV-16** (never shell-text-process source files — a PowerShell pass silently corrupted
  29 em dashes), **INV-17** (layout intent is not layout fact).

  **Lucius's layout feedback, verbatim: *"Dad this is for kids not adults and our hands
  aren't that big."*** Arrows moved to the physical screen edges (245 px inboard → **10 px**;
  separation 155 px → **521 px**), buttons enlarged 104×56 → 190×76, and PAUSE/TITLE/SOUND
  moved **above the canvas** after he reported hitting them by accident. Fixing the reach
  problem made the centre FIRE button unreachable, so **tapping the play area now fires**.
  Applied to both rungs. Root cause of the width bug was INV-17 — the control row had been
  shipping at 448 px on a 921 px screen because a selector list made `<body>` a shrunken
  flex item.

  **Also confirmed for Lucius:** Invaders aliens **hold position through a death** (they do
  not reset), and reaching the player's line is an instant game over even with lives left.
  Both match 1978. Whether to soften it for kids is Daniel's call (UX-24) — A-11 says that
  difficulty was tuned for a coin slot we don't have.

- **2026-07-18 — Leaderboard ported to rung 2, swivel stick added, and the process gap
  closed.** Daniel: *"why does Space Invaders not have a retro leaderboard? I feel we both
  missed it and the processes shouldn't have allowed us to."* He is right, and worse than
  he knew: the gap was **written down as a TODO inside `tools/hiscore.js` and shipped
  anyway.** Documenting it discharged the feeling of handling it without handling it.

  **`tools/conformance.js` built** — checks every rung against every shared contract (test
  hook, sim contract, sim-cannot-cheat, high score table, storage key, HI-derived-not-
  stored, initials entry, touch layout, swivel stick). **It caught a real drift on its
  first run**: rung 3 had the swivel stick but never exposed it on the test hook, making it
  unverifiable from outside. Caught the author immediately, which is the only enforcement
  worth trusting. New law: **INV-18 — a convention with no enforcement is a preference,
  and preferences drift.**

  **Rung 2 now has the full leaderboard** (8 entries, initials entry, HI derived from the
  table, legacy key deleted) plus the sim contract it was missing. **Both rungs CONFORMANT,
  10/10.**

  **Swivel stick (UX-25):** left half of the play area is a virtual stick whose origin is
  wherever the thumb lands — no fixed hotspot to reach for, which is the real answer to
  Lucius's complaint. Right half fires. Multi-touch verified: steering and firing work
  simultaneously. Button pad retained as an alternative.

  **UX-26 — game over mechanic KEPT** on Daniel's ruling: *"gotta teach the kids failure to
  recognize and work within the pattern."* Note this deliberately overrides A-11 — same
  difficulty, entirely different justification, which is what makes it a decision instead
  of an inheritance.

  **Testing note:** several verification runs failed spuriously because the browser tab was
  backgrounded and rAF throttled to one tick per 2.9 s. Re-run deterministically through
  `sim.step()` — the sim contract makes tests immune to throttling, and I had built it and
  then not used it for my own verification.

  ~~NEXT ACTION: build the two missing sim tiers~~ *(done same day — see next entry; this
  line went stale because the work landed without a STATE entry, which is exactly the
  drift the freshness gate exists to catch).*

- **2026-07-18 — Sim tiers calibrated to the family's real scores; release gating added.**
  (This entry appended 2026-07-19 — commits `6c61bb7` and `3322808` landed without one,
  leaving the previous entry's next-action line stale. Recorded late, honestly.)

  Five tiers now: `firstTimer / novice / competent / expert / ceiling`, every human anchor
  within a factor of 2 (6yo→firstTimer 1.11, 9yo→novice 1.00, Mum→novice 0.62,
  Daniel→competent 0.78), ladder monotonic **5 → 13 → 248 → 882 → 896**. The fix required
  a new parameter, `predictChance`: with only `predictBounces`, the tiers had a cliff
  (always-chase ≈ 5, always-predict ≈ 350) and every real novice lives inside that gap.
  A novice reads the ball *sometimes* — consistency, not accuracy, is what grows. Full
  record in `tools/SIM_RESULTS.md`.

  Also landed: `releases.json` soft gate + `standalone` conformance check (one HTML file,
  zero external requests — verified, not assumed) and the GOVERNANCE record above.

  **NEXT ACTION: rung 4 = Galaga (1981), archaeology first** — sourced dig into the Namco
  board (the first rung with real sprite hardware), Suffering Ledger, then SCOPE, then code.

- **2026-07-19 — Rung 4 (Galaga) built the doctrine's way end-to-end: dig → ledger →
  SCOPE → code → machine verification. Human playtest still ahead — not yet done by the
  repo's own standard.**

  Archaeology first, four lessons into the trove before any code: **A-13** (the famous
  no-fire cheat is a resource leak — 8 shot slots, X=0 spawns invisible-but-live, release
  checked only Y), **A-14** (sprite hardware made motion free, so choreography became the
  content — the game is authored path data), **A-15** (danger is priced, not forced —
  diving pays 2×, a boss with escorts 10×, and capture converts a lost life into an
  investment), **A-16** (the challenging stage invented pacing rhythm — difficulty needs
  a beat, not just a slope).

  Build: one 54 KB file, paths as data (normalised control points → Catmull-Rom →
  constant-speed polyline; entrance scripts and dives are arrays). Full formation
  (20/16/4), three cycling entrance patterns, breathing, dives with escorts, the
  **capture / rescue / dual-fighter loop**, challenging stage with 10,000 perfect bonus,
  the sourced score table exactly, extra fighters at 20,000 then every 70,000, hit/miss
  ratio at game over, two-layer blinking starfield, all shared contracts (leaderboard,
  swivel stick, touch layout, sim contract). The 8-slot enemy-shot pool is kept
  period-correct **with the leak fixed** — spawn validates, release covers every exit
  axis, and the A-13 regression (hostile spawns refused, pool returns to 0) is machine-
  checked.

  **Verification: every SCOPE criterion [VERIFIED] in-browser through `sim.step()`** —
  scoring table exact including 1600 for boss+2-escorts, capture→rescue→dual proven
  end-to-end by steering into the beam, challenge stage fires zero shots, tunneling
  sweep 16/16 at forced 50 ms, INV-15 held-button regression clean, entity/pool zero
  across 5 restarts, frame cost 0.93 ms (~18× headroom; live-fps read rides the family
  playtest). **Conformance: 11/11.**

  **INV-19 earned — the conformance checker itself was lying.** The `standalone` check
  had passed a 404 page on every rung since birth (`(0KB)` printed in its own detail
  string the whole time). Fixed; all three rungs now measured genuinely standalone for
  the first time (37/38/54 KB, zero external references). Law: a check that cannot
  observe its subject must abstain loudly, never pass — and the enforcement layer is
  itself a convention unless something checks the checker's evidence.

  **First-pass sim (scripted mid-skill player, 5 games):** losable, difficulty scales
  (dead by stage 7-15), sessions 3-6 min. **Flag for playtest: a frame-perfect-aim
  player clears stage 1 at ~25 s — killing nearly everything in transit, so the battle
  phase barely happens.** Deliberately not pre-tuned (INV-13); humans first. Tier-ladder
  port to Galaga is named future work.

  Docs flipped together (README + landing, per the docs conformance rule); README's
  stale tier names fixed in passing. `releases.json` untouched — **what is advertised
  stays Daniel's pacing call** (currently Invaders only).

  **NEXT ACTION: family playtest of rung 4** — the transit-kill question, dive feel,
  capture fairness, tablet touch, audio; then Daniel's release-gating call for rungs
  3 and 4. After that: rung 5 = TI-99/4A titles, archaeology first.

- **2026-07-18 — Rung 5 (TI-99/4A: Hunt the Wumpus + Parsec) built the doctrine's way,
  both games machine-verified. Human playtest still ahead — not done by the repo's own
  standard.** Pair chosen for maximum learning orthogonality (Daniel locked Parsec;
  the learning call picked Wumpus over Munch Man/Alpiner/Anteater for the second
  slot): a turn-based deduction game and the ladder's first scrolling world.

  Archaeology first, four lessons into the trove before code: **A-17** (the TI's
  defining constraint was memory *topology* — 256 bytes of true CPU RAM, 16 KB behind
  the video chip's port; Parsec's scroll routine ran inside the scratchpad), **A-18**
  (Parsec's endgame wall is a signed 8-bit sprite-velocity overflow — an unexamined
  numeric limit becomes gameplay; our ramp gets an authored ceiling, asserted in sim),
  **A-19** (speech as an information channel: it earns its keep replacing a glance,
  not duplicating the screen), **A-20** (Yob built the 1973 dodecahedron to escape
  grids; the TI's character-cell display re-gridded it — the renderer lobbies
  silently for shapes it draws natively).

  **Wumpus:** wrapping-grid maze (32/24/16 caverns by difficulty), sourced clue radii
  exact (bloodspots ≤2 tunnels, green walls adjacent to pits), bats, one arrow.
  Verified: maze/placement/wrap 150/150, clue derivation exact 30/30 games, all rule
  outcomes, fog, score-by-moves, restarts clean. **The deduction evidence: reasoning
  bot 55–58% wins vs random 0.5% — >100×, zero unsound inferences.** W9's 60% bar
  fails as written; measured as the sourced design's structural luck floor, flagged
  for Daniel's ruling (OPEN above) rather than silently re-barred — and two of my own
  instrument bugs were caught en route (INV-3, INV-14 both exercised).

  **Parsec:** native 256×192 raster, procedural scrolling terrain, laser heat, fuel +
  refuel tunnel, six sourced enemy classes with the **score table exact at levels 1
  and 2** (100/200/300 pairs, +100/level), saucers from behind, asteroid belt +1,000,
  speech via built-in synthesis (playable silent), authored ramp cap 1.77× at level 8.
  Substep sweep 16/16 (after correcting my own test artifact), entity leak zero
  across restarts, tiers: firstTimer 100% dead in L1, competent 5/5 past L2.

  **Feedback contract born (pilot):** FEEDBACK button / `F` pauses play, opens a
  context-stamped report overlay → prefilled GitHub issue URL or clipboard (no
  network from the file; standalone stays true). Conformance check shipped **in the
  same commit** (INV-18), pilot-scoped to rung 5 with loud abstention elsewhere
  (INV-19). **All five games CONFORMANT** (parsec 12/12, wumpus 11/11+1 n/a, legacy
  rungs unchanged). Docs flipped together; `releases.json` untouched (Daniel's
  pacing gate — still Invaders-only).

  Environment note for the record: the Browser pane refused file:// outside the
  session project; verification ran over a local `py -m http.server` — which also
  gave the INV-19-fixed standalone check real bytes to read (41–54 KB per game).

  **NEXT ACTION: family playtest of rungs 4 AND 5 together** — Galaga's transit-kill
  flag, Wumpus clue readability with the kids, Parsec difficulty feel, and the
  feedback button in real testers' hands (its pilot IS the test). Then Daniel:
  W9 ruling, feedback rollout call, release gating for 3/4/5.

- **2026-07-19 — RUNG 6 (TI-99/4A part II: MUNCH MAN + ANTEATER) BUILT AND
  MACHINE-VERIFIED, archaeology first, same session.** Dig landed before any code:
  **A-21** (the lawsuit was a level designer — 1981 dots prototype, K.C. Munchkin
  injunction 1982-03-02, dots→chain / pills→TI logos; the constraint classes now
  span hardware → manufacturing → business → LAW), **A-22** (you dig your own
  attack surface — eaters use the player's tunnels), **A-23** (a weapon aimed with
  time: delayed-fuse eggs, targeting = your own retreat), **A-24** (Romox ECPC:
  dial-up game delivery to cartridge-burning mall kiosks with royalty accounting,
  patent 4,597,058 — digital distribution in 1983). Trove now **20 invariants /
  24 archaeology findings.**

  **Munch Man:** self-validating maze (160 cells, flood-fill assert at load), warp
  corridors exact, sourced scoring proven to the point (0 arithmetic mismatches
  across 100 audited bot games), energizer inversion measured (1.35× player speed
  exactly), Hoono personalities measured (red first-to-catch 36/70 — the sourced
  intelligence order), dark round 20 + `* # *` Test-Score mode live (TI's own
  instrument-honesty law, 1982, adopted as the sim's level-jump path). Coverage
  bot 85/100 level-1 completions vs random 0/100.

  **Anteater:** A-22 rule held binarily (0 eater-in-dirt violations across every
  run, self-instrumented), tunnel speed asymmetry live, round-trip economy exact
  (extra ant on all 5 observed set completions), eggs/rocks/ceilings all proven.

  **INV-20 earned** (float overshoot past a cell centre skips the rules check —
  yellow walked through a wall once in ~60 games; snap-to-centre fix proven by an
  80-game containment sweep). **Honest misses on the record:** ramp cap first set
  ABOVE the playability wall (bot proved round 20 unwinnable at 135%; retuned to
  108%; human winnability still open), and **T9's 10× kiting bar was a guess —
  measured timing premium is 3× over a skilled-movement null (all-random null: 0
  kills). Flagged for Daniel's ruling, not silently re-barred (W9 precedent).**

  Feedback contract extended to both rung-6 games [ASSUMED default — Daniel may
  strike]; rungs 2–4 still abstain loudly. Both games 12/12 CONFORMANT; docs
  flipped together; `releases.json` untouched. Committed locally — **push is
  Daniel's** (publishing gate).

  **NEXT ACTION: unchanged — family playtest, now rungs 4+5+6 (Galaga transit-kill
  flag, Wumpus clues, Parsec feel, Munch Man round-20 winnability, Anteater egg
  timing feel, feedback button in real hands). Daniel's calls stacked behind it:
  T9 bar ruling, feedback rollout to 2–4, release gating. Next build pair: NES
  (rung 7), fresh chat, archaeology first.**

- **2026-07-18 evening — RUNG 7 (NES) OPENED: ruling made, archaeology dug, no code
  yet — by design ("measure twice").** Daniel's ruling, this session: SMB-class
  mechanics re-derived from the public record, reskinned as an **Exodus platformer**
  with all-original expression (title/levels/art/characters — legal posture and tone
  guard in UX-34); **single game, phased build; Alpiner back-burnered** (diminishing
  trove returns). The ruling has a historical twin dug the same hour: **Wisdom Tree
  did exactly this on this exact console in 1990** — SMB2-engine Bible reskins sold
  through Christian bookstores because Nintendo's gate couldn't reach that channel —
  and their failure mode (theme carrying craft debt, A-29) is this rung's thesis
  inverted: six rungs of craft first, theme last.

  Dig landed before any code — **five findings, the biggest single-rung haul yet
  (A-25..A-29)**: platform governance as the completed constraint class (10NES →
  Tengen's Copyright-Office fraud → Color Dreams' voltage spike → the bookstore
  channel); levels-as-object-streams with the forward-only camera guarding the
  encoding (Minus World = stale-default read behind a wall-clip); game feel as a
  transcribable table of numbers (16 subpixels/px, velocity-piecewise gravity keyed
  to a held button — and the full commented disassembly public: the anti-A-9
  machine); input as a measurement needing boundary verification (the DPCM phantom-
  press bug); theme-vs-craft (A-29). Suffering Ledger set: KEEP fixed-point physics
  + fixed timestep, object-encoded levels, forward-only camera (Phase 1), NES
  palette + 16×16 attribute discipline, held-B run vocabulary; SKIP flicker, vblank
  cycles, mappers, assembly; INVERTED: modern grace windows (coyote/buffer) — ship
  1985-strict, playtest decides, declared anachronism if adopted.

  Stamp correction on the record: rung-6 entries say 2026-07-19; actual commit
  clocks read 2026-07-18 afternoon. Noted, not rewritten.

  **NEXT ACTION: Daniel names the game (candidates in OPEN), then `SCOPE.md` for
  Phase 1 — engine + transcribed SMB physics table + forward-only camera + one
  complete world (Egypt brickyards → Red Sea set-piece), pass criteria locked
  before code. The physics-table transcription from the disassembly is a SCOPE
  task with its own verification step.**

- **2026-07-18 evening — RUNG 7 PHASE 1: DELIVERANCE BUILT AND MACHINE-VERIFIED,
  same session as the dig. Human playtest still ahead — not done by the repo's own
  standard.** Title ruled (Daniel), CRLF churn fixed repo-wide first
  (`.gitattributes`, harness pattern, his call).

  **The physics are transcribed, not tuned:** SMBDIS.ASM's data tables pulled from
  the primary source (751 KB disassembly grepped locally; tables at lines 6014–6034,
  tier logic 6095–6123) — and the SCOPE-derived predictions held on first
  measurement: **walk 96 px / run 160 px per 64 frames exact; jump apexes 66 px
  standing, 82.5 px running; a 1-frame tap jumps 23 px** (variable jump live). The
  abort condition was never approached. One prospective criterion fix on record:
  P2's 64/80 was corrected to the discrete 66/82 BEFORE any code existed.

  Build: one 40 KB file — **the size of the actual SMB cartridge, unplanned** —
  integer fixed-point engine (1/4096 px X, 1/256 px Y), fixed 60 Hz timestep,
  seeded RNG, levels authored in a compact object language (A-26 kept), forward-only
  camera, streaming entity window, three levels (Brickyard → Ninth Plague → Red Sea
  with the parting set-piece and pursuing chariots), manna-spoils economy (UX-35,
  Ex. 16), NES-palette art in 16×16 attribute-aligned regions, APU-flavoured
  WebAudio, all shared contracts (leaderboard, initials, swivel stick, touch edges,
  feedback overlay [ASSUMED default, Daniel may strike]).

  **Verification: 9/9 suite green, conformance 11/11 CONFORMANT, docs check
  consistent across six rungs** — run in real Chrome over local HTTP (the Cowork
  Browser pane refused both localhost and live file:// this session; environment
  note in RUN_LOG). Determinism byte-identical at 3,000 frames; tunneling sweep
  clean; camera provably never rewinds; 0.046 ms/frame.

  **The suite's first catch was real: two level-design defect classes** — a
  platform underside 2 px above a staircase step (an authored softlock: every hop
  bonks until the timer kills you) and 18–34 px overhangs above enemy patrol lanes
  (the jump verb denied where it's most needed). Both found by the winnability bot,
  both fixed, ruled as **UX-37 (50 px minimum headroom over traversal ground)**.
  Also on record: bot v1 died with jump held through landing — **INV-15's held-
  button law biting a bot** exactly as it bit "DAN"→"ADA" on rung 3. Four test-rig
  bugs fixed along the way (INV-3 scoreboard: my tests were wrong 4 times, the
  engine 0, the levels 2).

  Docs flipped together (README + landing + conformance slug, same commit set).
  `releases.json` untouched — advertising stays Daniel's pacing call. Committed
  locally; **push is Daniel's** (publishing gate).

  **NEXT ACTION: Daniel plays it** — double-click `rungs/07-deliverance/index.html`
  (keyboard: arrows/Shift-run/Space-jump). The feel verdict is his: jump weight,
  run commitment, manna-spoil pressure, Red Sea moment, difficulty of all three
  levels. Then: family playtest rungs 4+5+6+7, the stacked calls (T9 bar, feedback
  rollout, release gating — now four rungs waiting), and Phase 2 scoping (staff
  power-ups, more worlds, enemy variety) after the feel verdict lands.**

- **2026-07-19 — RUNG 8 (TI-99/4A part III: ALPINER) BUILT AND MACHINE-VERIFIED,
  archaeology first, same session. 24/24 suite, CONFORMANT 11/11 (+1 n/a), 46 KB.
  Built on LAPTOP-3GLEQ7L1 — the first arcade work off the promoted laptop node.**

  **Provenance of the rung:** Alpiner was **back-burnered 2026-07-18** for
  diminishing trove returns. **Daniel's brother chose it** on a family holiday,
  which overrides the ruling; Daniel was on Auto. The back-burner reasoning turned
  out to be wrong, and the reason is the rung's whole finding.

  Dig landed before any code, off the **original TI manual as a primary source**
  (archive.org `AlpinerManual`) plus ten explicitly unsourced items:
  **A-30** (an optional peripheral forces its own channel to be redundant — the
  synthesizer was sold separately, so speech could not carry load-bearing
  information, and what the accessory actually sold was *affect*; **this
  COMPLICATES A-19 rather than confirming it** — whether a channel may carry unique
  information is decided by the business model, not the bandwidth), **A-31** (the
  inverted timer: the clock counts down only while the climber is *stationary*, so
  patience is free and hesitation is expensive), **A-32** (authored curve wrapped
  around randomised layout — neither half doing the other's job), **A-33** (motion
  smoothness advertises which layer an object lives on; the jerky/smooth split is
  the tile/sprite boundary made visible). Trove now **20 invariants / 33 findings**.

  **The A-30 finding is ENFORCED, not narrated** — the rung's point. `Speech.say()`
  cannot read or write game state, every cue's on-screen half is set independent of
  audio, and `tests.muteEquivalence()` drives **20 seeded games on an identical
  input tape with speech on vs off: 20/20 byte-identical** outcome tuples. A trove
  entry that can fail a test is worth more than one that can only be quoted.

  Sourced exactly: six peaks in ascending elevation (Hood 3,427 → Everest 8,848),
  **46 m per step** (so summit step-counts are *derived*, not authored — Hood 75,
  Everest 193), all eleven obstacle penalties, the Snowman as his own crash class,
  falling-hazard unlocks at levels 7 and 13, the 18 base-point values, summit bonus
  = 2 × base × seconds remaining, four climbers +1 per round, and the `*#*` Test
  mode whose scores are barred from the leaderboard (rung-6 precedent).
  **Corrected from memory before it reached code:** the mountain order is Hood →
  Matterhorn → Kenya → McKinley → Garmo → Everest — I had McKinley second (INV-10,
  again; the source cost thirty seconds).

  **INV-3 scoreboard, first run 19/24 — three real bugs, one bad test, one bad bot:**
  (1) `spawnAcc` was module-level and never cleared on reset, so seeds were
  contaminated by whatever had been played before — it *presented* as speech
  breaking A-30 and was nothing of the kind; (2) `stepFalling()` held a stale loop
  bound over `G.falling` while `knockDown → loseLife → respawn` replaced the array
  underneath it (INV-12's cousin); (3) `fitTouch()` used `classList.toggle` on
  `resize`, so it **tore off the `.touch` class the conformance checker had just
  added to measure with** — a checker defeated by its own subject, INV-19's mirror
  image; (4) the timer test read 3.71s for "continuous stepping" because the climber
  was walking into trees, and a climber pushing a tree genuinely *is* stationary —
  **the test was wrong, the mechanic was right** (INV-4, and I nearly changed the
  game); (5) `waitingPays` read 0.99× because my "patient" bot stopped climbing
  *inside the hazard's lane*, measuring hesitation rather than patience.

  **Honest flag on that last one:** I changed the bot and the number went 0.99× →
  **2.49×**. The game was untouched and the first bot did not implement the
  hypothesis at all — but this is precisely the move INV-13 warns about, it is
  logged as such in the RUN_LOG, and **if the family playtest says waiting doesn't
  feel worth it, the humans outrank the 2.49×**.

  **A hole in INV-6 found the hard way:** the canvas sampled as 49,152 black pixels
  while 24 tests passed. Cause was `requestAnimationFrame` never firing in the
  verification pane, so `draw()` never ran — but **a game that draws nothing and a
  game whose frame loop is paused are byte-identical to a checker.** INV-6 bought a
  handle into *state*; the renderer had none, leaving it exactly in the eyeball-only
  position INV-6 exists to abolish. Added `__alpiner.render()`; title screen then
  sampled 2,718 non-black px incl. TI cyan, mid-climb 42,421 of 49,152.
  **Candidate invariant for Daniel's ruling — deliberately NOT written into
  INVARIANTS.md by me:** *a read-only handle into state does not cover the renderer,
  and a paused frame loop is indistinguishable from a renderer that draws nothing.*

  Feedback contract extended to Alpiner [ASSUMED default — Daniel may strike];
  `pilotOnly` updated **in the same commit as the game** (INV-18). Docs flipped
  together (README + landing). `releases.json` untouched. Committed locally;
  **push is Daniel's** (publishing gate).

  **NEXT ACTION: nobody has played this.** INV-9 is the gate — 24 green tests prove
  I met my criteria, not that they were right, and on rung 2 every behavioural
  defect came from a human. Specific things to attack: does the frozen clock read as
  deliberate or broken (HUD says "TIME HELD" in green — my untested guess at
  legibility)? Is 46 m/step the right *feel* when Everest is 193 steps on a real
  thumb? The `A18` target-bonus trigger is **[ASSUMED]** — no source explains how
  bonuses fire in the original. Then: the stacked calls are now five rungs deep
  (T9 bar, feedback rollout to 2–4, release gating), plus the renderer-handle
  invariant ruling above.

- **2026-07-18 ~20:30 — First playtest lap ran the same sitting (feedback loop at
  chat speed, second rung in a row).** Daniel finished the world first try
  (14,790) and immediately caught what the machine verification could not:
  **"Level 3 had no enemies"** — the pursuing chariots are slower than run speed
  and spawn behind the camera, so a competent player never sees one. The sim had
  displayed the symptom (chariots=0) and it was rationalized instead of flagged —
  miss on the record in the RUN_LOG, with three fix options held for his full
  report (favourite: the closing sea as the level's true antagonist). **Daniel is
  running more playtest laps; the build stays frozen until his report lands.**

  **NEXT ACTION: Daniel's full playtest report → TESTIMONY-style fixes under
  prove-the-fix, then his push. The stacked calls unchanged (T9, feedback
  rollout, release gating for 3–7).**
