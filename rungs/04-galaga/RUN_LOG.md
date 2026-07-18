# RUN LOG — rung 4, Galaga

*Append-only. Wrong turns stay in. A log tidied afterwards is a press release.*

## 2026-07-19 — build session opens

- Order held: archaeology (A-13..A-16) → Suffering Ledger → SCOPE locked → code.
  Second rung built the corrected way round.
- Core design decision, per A-14: paths are DATA — normalised control points →
  Catmull-Rom → resampled polyline with cumulative distances, walked at constant
  px/ms. Entrance scripts and challenge scripts are arrays naming a path + slots.
  Authoring a new dive = writing an array. That was the scope's abort condition
  and it held.
- Enemy shots: fixed 8-slot pool (period-correct), with the two rules the 1981
  board lacked — spawn validates coordinates (refuses instead of parking an
  invisible live shot), release fires on EVERY exit axis (x out, y out, hit,
  field clear). `refusedSpawns` exposed on the hook so the A-13 regression is
  checkable from outside.
- Declared simplifications (ASSUMED / declared, not smuggled):
  - Sprite SHAPES are our own pixel art in the TI palette — approximations,
    not claimed authentic (INV-10). Formation counts/scoring/mechanics are the
    sourced part.
  - Dives launch only after the entrance completes (the original interleaves
    on later stages).
  - Ramming awards flying-kill points — no source found either way.
  - Shooting a captive-holding boss in formation destroys the captive (real
    behaviour has more cases; SCOPE locked this simplification).
  - Beam ignores a dual fighter (capture only offered against a single ship).
  - Morphing transforms held out of scope per the Suffering Ledger.
- INV-11 honoured by construction: `newGame` / `startStage` / `respawn` are three
  functions for three events. `respawn` rebuilds ONLY the fighter, sends divers
  home, clears the shot field — the formation keeps its dead.

## 2026-07-19 — in-browser verification (served over localhost, driven through `sim.step()`)

Deterministic through the sim contract, immune to tab throttling (rung-3 lesson —
and it mattered again: two real-time rAF measurements timed out on a backgrounded
pane before I remembered my own note and switched to synchronous measurement).

Every SCOPE criterion exercised, all [VERIFIED]:

- Zero page console errors, at load and after the full test battery.
- Entrance: 40 enemies (20 bees / 16 butterflies / 4 bosses) fly authored trains,
  killable in transit, all settle — phase flips to battle at ~24.6 s.
- Movement exactly the legal speed (16.67 px per 10 frames = spec), clamp at 207
  (computed max), max **2** player shots on screen; dual fighter max **4**.
- Scoring exact: bee 50, butterfly 80, boss 150 (formation); butterfly 160 diving;
  **boss diving with 2 live escorts: 1600**. Boss takes 2 hits, hp visibly drops
  (colour flip) after the first.
- **A-13 pool regression:** spawns at x=0, x=-5, and y in the HUD zone all REFUSED
  (and counted); 10 spawn attempts fill exactly 8 slots; pool drains to 0 in 2.1 s.
  Pool empty after restarts and at game over.
- Tunneling sweep at forced 50 ms frames: **16/16 offsets hit** an 8 px bee.
- Capture loop end-to-end through real steering: capture dive launched, fighter
  steered under the beam, capture began, captive shown on the boss, exactly 1 life
  spent, fighter respawned. Captive boss then dove with priority, was shot while
  flying, rescue tween ran, **dual fighter live** (verified 4-shot budget).
  Counter-case: captor killed IN formation → no rescue, still single.
- Challenge stage: flag fires at stage 3, **zero enemy fire the whole stage**
  (pool max 0), 40/40 hits paid 100 each + the 10,000 perfect bonus (14,000
  total), tally shown, auto-advance to stage 4.
- Extra fighters at exactly 20,000 and 70,000; next threshold 140,000.
- Game over reports shots fired / hits / ratio. Fire → initials entry. **INV-15
  regression:** entry opens with buttons flagged held; 60 ticks of held fire do
  not advance the slot; a real release-press advances exactly one. "DAN as ADA"
  cannot recur here.
- Entity leak: entities and pool at 0 after each of 5 consecutive `newGame()`s.
- Frame cost with full formation + starfield + a dive in flight: **0.93 ms**
  against the 16.7 ms budget (~18× headroom), update alone 0.01 ms. Tagged: this
  is frame COST, not a measured live fps — the pane tab was throttled, so the
  60 fps claim rests on cost + the identical render approach measuring 61-62 fps
  on rungs 2 and 3. A live fps read on real hardware rides the family playtest.
- `tools/conformance.js`: **CONFORMANT, 11/11** — and see below.

### The find of the session: the conformance checker was lying (INV-19)

The `standalone` check reported `(0KB)`. Our file is ~54 KB. It had built its URL
wrong (`/rungs/04-galaga/index.html/index.html`), fetched a **404**, and passed its
regexes over the error page — **on every rung, since the day it was written.** The
enforcement tool that exists because of INV-18 had itself drifted into being a
preference. Fixed (reads `location.pathname`, abstains loudly under 1000 bytes,
reports what it read and via which URL), and all three rungs measured for real for
the first time: 37 KB / 38 KB / 54 KB, zero external tags/fetches/imports each.
Full write-up: INV-19.

### First-pass sim (scripted mid-skill player, honest controls, 5 games)

| Run | Outcome | Score | Stage reached | Stage 1 clear | Session |
|---|---|---|---|---|---|
| 1 | GAME OVER | 52,380 | 11 | 25 s | 4:42 |
| 2 | GAME OVER | 68,400 | 15 | 26 s | 5:57 |
| 3 | GAME OVER | 29,280 | 7  | 29 s | 2:49 |
| 4 | GAME OVER | 49,760 | 11 | 26 s | 4:30 |
| 5 | GAME OVER | 48,140 | 11 | 24 s | 4:27 |

What the numbers say: the game is losable, difficulty scales (dive pressure ends
every run by stage 7-15), sessions land in the 3-6 min casual band. **The flag:
stage 1 clears at ~25 s — the entrance takes 24.6 s, meaning a frame-perfect-aim
player kills nearly everything IN TRANSIT and the battle phase barely happens.**
Whether a human can do that is exactly the question the sim cannot answer
(INV-13 — the bot's frame-perfect aim is not the human task). Flagged for human
playtest, deliberately NOT pre-tuned. If humans replicate it, candidate levers:
faster trains, simultaneous two-side entries, or entry speed scaling by stage.
No tier ladder yet — porting the calibrated Breakout tiers to Galaga is future
work; this scripted player is a smoke test, not a calibrated tier.

### Still open for humans (INV-9 — the suite cannot see these)

Dive difficulty and readability, capture-beam fairness, whether the entrance
choreography feels like Galaga, audio audibility, touch layout on the tablet,
and the transit-kill question above. Daniel + the kids are the oracle.
