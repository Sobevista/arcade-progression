# Game-Dev Invariants — earned, not read

*The work product inside the work product. Every line here was bought by something
going wrong in a real build, with the evidence attached. Nothing goes in this file
because it sounded true — it goes in because it cost something.*

*Flows UP to the harness `Knowledge_Base/` when this build exits (Layer 4 law:
lessons flow up, artifacts don't). The game folder is disposable. This isn't.*

**Three files, three kinds of knowledge. Routing rule:**

- *Would violating this be wrong in every game, on every platform, regardless of taste?*
  **Yes → here.** A law. Breaking it is a bug.
- *Does the right answer depend on the game, platform, or audience?*
  **→ `UX_DECISIONS.md`.** A choice, carrying its tradeoff and a re-pick trigger.
- *Is it a fact about the original hardware, economics, or era — why the choice existed
  at all?* **→ `ARCHAEOLOGY.md`.**

A law is timeless. A choice is contextual. Archaeology is the reason the choice existed.
Nothing belongs in two of them.

---

## From rung 2 — INVADERS (2026-07-18)

### INV-1 — Point collision is a lie the moment speed exceeds target size
A projectile tested as a *point* at its new position will pass clean through
anything smaller than its per-frame stride.

**Earned:** bullet speed 0.30 px/ms × dt clamped to 50 ms = **15 px of travel per
frame**, against invader sprites **8 px tall**. A test sweep across 21 starting
offsets found **7 that skipped the sprite entirely** with no hit registered — a
33% dead zone that only appears on slow or stuttering frames. Would have shipped
as "sometimes my shots don't count," the worst class of bug: intermittent,
unreproducible on the dev machine, and rage-inducing on a phone.

**The invariant:** substep every projectile so it never travels more than a
fraction of the smallest thing it can hit between overlap tests. Fix cost 8 lines.
Finding it after ship would have cost days.

### INV-2 — Clamping delta time and point collision are coupled decisions
`dt` clamping is correct and necessary — without it, returning to a backgrounded
tab teleports every entity across the screen. But the clamp *converts a stall into
one enormous step*, which is precisely the condition that breaks INV-1.

**The invariant:** the moment you clamp dt, you have accepted a maximum stride.
Every collision test in the codebase must survive that stride. These two decisions
are made together or the second one is made by accident.

### INV-3 — A red test is a claim about the test until proven otherwise
Four tests failed today. **Three were bad tests. One was a real bug.** Ratio 3:1.

- *Collision failed* → the test placed the bullet 3 px inside the sprite, and the
  bullet moved 4.8 px upward *before* the overlap check ran. Already past it.
- *"Real shot doesn't kill" failed* → the shot was correctly absorbed by a bunker
  sitting directly in the firing line. Working as designed.
- *"Overrun doesn't end game" failed* → checked at 400 ms when the march step
  interval is 560 ms. Looked too early.
- *Tunneling* → **real.**

**The invariant:** form the hypothesis and test the hypothesis before touching
source. Reflexively "fixing" a red test corrupts working code three times out of
four — and each of those fixes is a permanent, invisible scar.

### INV-4 — When a test fires into the world, account for everything in the path
The bunker failure wasn't subtle in hindsight: the test aimed at an invader whose
column had a bunker under it. An integration test that ignores the rest of the
world isn't testing the mechanic, it's testing luck.

**The invariant:** either isolate the mechanic (remove the world) or explicitly
enumerate what else is in the path. Never assume the line of fire is empty.

### INV-5 — Reset must rebuild, not repair
State reset reconstructs entity lists from scratch rather than mutating survivors.
**Verified:** entity count returned to the exact baseline across 5 consecutive
restarts, and score/lives/wave all reset clean.

**The invariant:** "clear and rebuild" is boring, cheap, and provable. "Walk the
list and fix it up" is where save-scumming bugs and ghost entities are born.

### INV-6 — Ship a read-only test hook or you can only test by eyeball
`window.__invaders` exposes state (`alive`, `score`, `entities`, `state`) plus
`newGame()`. That single object is what made **every** PASS criterion machine-
checkable instead of "looks right to me."

**The invariant:** a game with no programmatic handle into its state can only be
verified by a human watching it, which means it will be verified rarely, late, and
by the person least able to be objective — its author.

### INV-7 — Integer-scale pixel art, always
Fractional scaling resamples the grid and turns crisp 1-px sprites to mush.
`Math.floor()` the scale factor, set `image-rendering: pixelated`, and disable
`imageSmoothingEnabled`. All three, or the artifact looks cheap for reasons nobody
can name.

### INV-8 — The tempo ramp is the genre, and it's one line
Space Invaders' acceleration was a hardware accident: fewer sprites to draw meant a
faster loop. **Measured here:** 560 ms per step at 55 alive → 40 ms at 1 alive.
That single curve *is* the dread. Ship it deliberately.

### INV-9 — A green suite proves you met your criteria, not that your criteria were right
Phase 1 passed **8/8**. Every criterion I wrote before building was satisfied and
independently verified. Then Daniel played it for five minutes and found **five real
problems the suite could not have caught**: no way back to the title screen, UFO
appearing constantly instead of as an event, no audio at all, shields not repairing
between waves, and formations that never descend.

None of those were test failures. **They were specification failures.** The tests were
green because the tests were complete with respect to a spec that was incomplete.

**The invariant:** automated tests and playtest are *different oracles*, not redundant
ones. Tests answer "does it do what I said." Play answers "was what I said right."
A build is not verified until both have run, and the second one cannot be delegated
to the author.

### INV-10 — "Authentic" is a claim, and claims need a source
Two of the five findings were places where I had reproduced the original *from memory*
and been wrong: shields persisted across waves (the arcade repairs them), and the
formation never started lower on later waves (the original's real difficulty curve).
I did not flag either as uncertain, because I did not notice I was uncertain.

Daniel's question — *"is it normal that the bunkers do not rebuild between levels?"* —
took thirty seconds to answer with a search, and both answers went against me.

**The invariant:** every "this is how the original did it" is an **ASSUMED** claim until
a source is checked, and it must be tagged as such at the point of claim. Fidelity work
is research, not recall. This is the founding law of the whole system — *reconstruction
drifts, sight doesn't* — and game feel is not exempt from it.

### INV-11 — Name reset functions after the *event*, never after the *scope*
`resetWave(hard)` was called from two different lifecycle events: starting a new
wave, and respawning after a death. The flag controlled only whether shields were
rebuilt — so the respawn path silently inherited *everything else* the new-wave
path did, including **rebuilding all 55 invaders**.

Result: dying on wave 1 handed the player a brand new full rack. Every invader they
had killed came back. The core tension of the game — grind the rack down, protect
your progress — was silently deleted. It shipped, passed a green suite, survived two
playtests, and was caught on the third by Daniel dying once.

**The invariant:** one function per lifecycle event, named for the event
(`resetWave()`, `respawn()`), sharing a small explicit helper if they overlap. The
moment a reset function takes a boolean, two different events are being forced
through one set of assumptions, and the caller written second inherits the first's
semantics by default. **A flag on a reset function is a design smell, not a
parameter.**

---

## From rung 3 — BREAKOUT (2026-07-18)

### INV-12 — A precomputed step vector is stale the moment a collision changes velocity
INV-1 says substep your projectiles. Rung 3 shows that **substepping is necessary but not
sufficient.** The step vector was computed once, before the loop:

```js
const sx = b.vx * dt / steps, sy = b.vy * dt / steps;   // WRONG
for (...) { b.x += sx; b.y += sy; /* bounce may reverse b.vx / b.vy here */ }
```

When a bounce reversed velocity mid-frame, the remaining substeps kept travelling the
**original** direction — the ball ploughing onward through geometry it had just bounced
off. Correct form recomputes from current velocity inside the loop:

```js
const h = dt / steps;
for (...) { const sx = b.vx * h, sy = b.vy * h; ... }
```

**The invariant:** any value derived from mutable state and cached outside the loop that
mutates it is a bug waiting for the right frame. Substepping exists precisely so state
can change mid-frame — so nothing about the step may be decided before the step.

**Honesty note on how this was found, because it matters:** I spotted this while
misdiagnosing something else. The symptom I was chasing (rows scoring 5/11/17 instead of
3/5/7) turned out to be **my test spawning the ball inside a neighbouring brick** — the
game was correct. The stale-vector bug was real and worth fixing, but it was *not* the
cause of what I was looking at. Finding a genuine bug while wrong about the evidence is
not vindication; it is a coincidence that feels like skill.

### INV-13 — A metric that doesn't replicate the user's task doesn't validate it
The orange band was too close to red. I moved it to gold, **measured** the RGB distance
(51 → 115), declared the gap more than doubled, and called it resolved with numbers on
the table.

Daniel played it: *"it makes lines 1 and 3 do funky things to me while playing."*

The measurement was real and it was the wrong measurement. I compared two colour swatches
at rest. The actual task is **reading colour bands in peripheral vision while tracking a
fast-moving ball under time pressure** — a completely different perceptual job, and one
where 115 is nowhere near enough. Moving to a different hue family entirely (blue, 227)
fixed it.

**The invariant:** before trusting a number, ask what task it simulates. A proxy metric
that is easy to compute is usually easy to compute *because* it dropped the hard part of
the real task. Passing the proxy is not passing the task, and a confident number makes it
much harder to notice the difference — I stopped looking precisely *because* I had
measured something.

This is INV-9's cousin. INV-9: a green suite proves you met your criteria, not that they
were right. INV-13: a green *metric* proves you improved what you measured, not that you
improved what matters.

### INV-14 — A benchmark that can return its own configuration will, and it looks like data
The first simulated-playtest sweep reported `totalSeconds: 480` for both stronger tiers.
That is not a measurement — **480 s was exactly the 8-minute cap I had set.** The bots were
still playing when the harness cut them off, and the run silently reported the limit as if
it were the result.

It was only obvious because two independent tiers returned the *identical* number. Had the
cap been slightly higher, or the tiers slightly different, it would have shipped as a
finding: "a full game takes eight minutes."

**The invariant:** any measurement with a ceiling must report whether the ceiling was hit,
and every terminating condition must be distinguishable in the output. `TIMEOUT` and
`FINISHED` are different results, and a harness that collapses them is manufacturing data.
Suspect any benchmark whose answer resembles a number you chose.

### INV-15 — A modal state needs its own input bindings, and must assume every button is already held
Two separate bugs, one root cause: **a modal screen inherited the gameplay input layer.**

**Alias collision.** `A` and `D` are movement aliases *and* letters people put in their
initials. Typing "DAN" on the high-score screen spun the letter wheel with the A and the D
while entering it. An input alias bound for one mode **will** be pressed in another.

**Held-button carry-over.** The SPACE that opened the entry screen was still physically
down on the next frame. With "previous button state" initialised to `false`, that same
press edge-triggered again and skipped slot 0 — "DAN" saved as **"ADA"**, shifted by
exactly one slot.

**The invariant, both halves:**
1. A modal state **defines** its bindings; it never inherits gameplay ones.
2. On entering a modal state, initialise every previous-button flag to **true** — treat
   every control as already held until it is observed released. The transition into a mode
   is itself a button press, and it is still happening when the mode starts.

Corollary worth its own line: **a character that is also a control is a character you can
never enter.** SPACE confirms, so SPACE cannot be in the alphabet.

### INV-16 — Never text-process source files with the shell when an edit tool exists
I rewrote a source file with a PowerShell regex pass to rename a variable. PowerShell 5.1
read the UTF-8 file as Windows-1252 and wrote it back re-encoded, turning **every em dash
in the file into `â€”`** — 29 of them, silently, in a file that still parsed and ran fine.

The rename itself was correct. The collateral damage had nothing to do with the change and
would have shipped, because nothing about the game's behaviour was affected.

**The invariant:** use the purpose-built edit tool for source edits. Shell text processing
carries an encoding round-trip that is invisible in the diff you were looking at, silent at
runtime, and permanent. The blast radius of a tool is not limited to the thing you aimed it at.

### INV-17 — Layout intent is not layout fact. Measure the rendered box.
The touch control row was written as `width: 100%` and had been shipping at **448 px on a
921 px screen** — less than half the width it claimed. Nobody noticed because it *looked*
deliberate: a centred row of buttons.

Cause: a selector list. `html, body { display:flex; align-items:center }` applied the
declaration to **both**, so `<html>` became a flex container and `<body>` became a centred
flex *item* that shrank to its content. `width:100%` then resolved against a body that was
already too narrow. Every "full width" element inherited the lie.

It only surfaced when a 9-year-old said the buttons were too close together to reach with
two thumbs, and I measured the rendered rectangles instead of trusting the CSS.

**The invariant:** for any layout claim that matters — full width, edge-anchored, minimum
touch target — read back `getBoundingClientRect()` and assert on the number. CSS expresses
intent; only the rendered box is fact. And a selector list applies every declaration to
every selector: check that each one is sensible for *each* element, not just the one you
were thinking about.

---

## Ledger

| # | Invariant | Rung | Cost to find |
|---|---|---|---|
| 1 | Substep projectiles vs. small targets | Invaders | caught by test sweep, pre-ship |
| 2 | dt clamp defines max stride | Invaders | derived from INV-1 |
| 3 | Red test = suspect the test first | Invaders | 3 false alarms in one session |
| 4 | Account for the whole firing line | Invaders | 1 false alarm |
| 5 | Reset rebuilds, never repairs | Invaders | free — designed in |
| 6 | Ship a read-only test hook | Invaders | free — designed in |
| 7 | Integer-scale pixel art | Invaders | free — known going in |
| 8 | Tempo ramp is the genre | Invaders | free — historical |
| 9 | Green suite ≠ right criteria | Invaders | **5 real issues found by 5 min of play after 8/8 PASS** |
| 10 | "Authentic" needs a source, not recall | Invaders | 2 wrong mechanics shipped from memory |
| 11 | Reset functions are named per event, never per scope | Invaders | **the game's core tension silently deleted by one boolean** |
| 12 | A cached step vector is stale the moment a collision changes velocity | Breakout | ball ploughed through geometry it had already bounced off |
| 13 | A metric that doesn't replicate the user's task doesn't validate it | Breakout | measured colour separation at rest; the real task was tracking a moving ball |
| 14 | A benchmark that can return its own configuration will, and it looks like data | Breakout | sim reported the 8-min cap as the game length |
| 15 | Modal states define their own bindings, and assume every button is already held | Breakout | "DAN" saved as "ADA"; WASD aliases spun the letter wheel |
| 16 | Never text-process source files with the shell when an edit tool exists | Breakout | PowerShell re-encode corrupted 29 em dashes, silently |
| 17 | Layout intent is not layout fact — measure the rendered box | Breakout + Invaders | "width:100%" was shipping at 448px of 921px |

---

## The number that matters most from rung 2

| Found by | Real bugs |
|---|---|
| My automated suite (22 checks, 8/8 PASS) | **1** — projectile tunneling, and even that surfaced while triaging a *false* alarm rather than from a red test |
| Daniel playing the game | **6** — no exit to title, UFO cadence, no audio, shields not repairing, formation never descending, **rack resetting on death** |
| My tests crying wolf | **5 false alarms** |

Read that ratio honestly: the suite's job turned out to be *guarding what I already
understood*, and it did that well — the tunneling fix and every regression check held.
But **every behavioural defect in this build was found by a human playing it.** The
suite never had a chance at them, because a test can only check the spec, and the spec
was the thing that was wrong (INV-9).

The corollary is uncomfortable and worth keeping: on this build, my confidence was
highest exactly where I was most wrong — the mechanics I "remembered" (INV-10) and the
convenience refactor I never questioned (INV-11).
