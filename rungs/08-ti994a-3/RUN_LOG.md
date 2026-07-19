# RUN LOG — Rung 8: ALPINER

*Appended as the build went. Wrong turns stay in. A log tidied afterwards is a
press release.*

## 2026-07-19 — session open

Built on **LAPTOP-3GLEQ7L1**, not home base — first arcade work off the promoted
laptop node. Daniel is on a family holiday; **his brother chose Alpiner**, which
overrides the 2026-07-18 back-burner ruling. Daniel is on Auto for this build.

Named the awkward thing before starting: Alpiner was shelved for *diminishing trove
returns*, so a build that produced only a playable game and no finding would have
proved the shelving right. Wrote that risk into SCOPE as criterion A1 rather than
hoping it away.

## Archaeology (before any code, per the law)

Delegated the dig with an explicit instruction that unsourced was an acceptable
answer. It came back with **the original TI manual as a primary source**
(archive.org item `AlpinerManual`) plus ten things it *could not* source, which is
the part that made it useful.

Three findings changed the build:

1. **A-30 — the peripheral problem.** The speech synthesizer was sold separately, and
   the manual says the game is "designed to work with or without" it. That forces the
   speech channel to be **redundant** — TI could not let it carry information the
   silent majority lacked. This **complicates A-19** (rung 5's "a channel earns its
   keep by carrying what the busy channel drops"). Whether a channel may carry unique
   information turns out to be decided by the *business model*, not the bandwidth.
   **This is the finding that justifies a third TI game — and it is only visible
   because two games on one machine made opposite bets with the same peripheral.**
2. **A-31 — the inverted timer.** Manual, verbatim: time "is not counted down except
   when the Alpiner is not moving." Patience free, hesitation expensive.
3. **A-32 — authored curve, randomised layout.** Six named peaks in fixed elevation
   order, hazard classes unlocking at levels 7 and 13, layouts generated per play
   [single-source, tagged].

Also corrected an assumption I would have coded from memory: the mountain order is
**Hood → Matterhorn → Kenya → McKinley → Garmo → Everest**, strict ascending
elevation. I had McKinley second. INV-10 again, and the source cost thirty seconds.

**Left unresolved on purpose:** whether the original scrolled, flipped screens, or
showed a whole mountain (open question 1). The 46 m/step arithmetic rules out one
static screen — Everest is ~193 steps — so our vertical scroll is an **authored
call**, recorded as ours rather than smuggled in as TI's.

## Build

One file, `alpiner/index.html`, 46 KB, zero dependencies. Position is **integer
col/row at all times** — INV-20 satisfied by construction rather than by tolerance,
since there is no float to accumulate. Rendering interpolates; logic never does.

The A-30 finding is enforced structurally: `Speech.say()` is handed a cue id and
produces sound, and **cannot read or write game state**. The single call site,
`cue()`, always sets the on-screen half and only then asks Speech for audio. Muting
is therefore unobservable in gameplay by design — and `tests.muteEquivalence()`
exists to catch me if that is ever untrue.

## First test run — 19/24

Five reds. INV-3 says suspect the test first; the honest split was **three real bugs,
one bad test, one genuine null result**. Ratio close to the rung-2 3:1.

**1. `muteEquivalence` 7/20 — REAL BUG, and not the one it looked like.**
It looked like speech contaminating state, which would have falsified A-30 on its
first outing. It wasn't. `spawnAcc` is module-level and **was never cleared on
reset**, so a new game inherited the previous game's hazard-spawn phase — the same
seed produced different hazard timing depending on what had been played before. The
same defect was independently failing `noLeakAcrossRestarts` (`2:76 1:76 2:76…`).
Two symptoms, one cause, and INV-5's "reset rebuilds, never repairs" would have
prevented it if I had applied it to module scope and not just to entity lists.

Worth keeping: **the thesis test found a bug in the engine, not in the thesis.** Had
I written a weaker A1 I would have shipped non-deterministic seeds.

**2. `skillRatio` THREW `Cannot read properties of undefined (reading 'vy')` — REAL BUG.**
`stepFalling()` iterates `G.falling` backwards and calls `knockDown()` on a hit.
`knockDown` can cascade into `loseLife() → respawn()`, which **replaces `G.falling`
with a new empty array**. The loop then kept indexing the old one. INV-12's cousin:
that one cached a stale step *vector*; this one holds a stale loop bound over a
collection the loop body is allowed to replace. Fixed by returning immediately after
a hit.

**3. `touchLayout` FAIL, `btn 0x0` — REAL BUG, and an instructive one.**
`fitTouch()` used `classList.toggle('touch', isCoarsePointer)` and was bound to
`resize`. The conformance checker adds `.touch`, then fires a `resize` to measure —
so my own handler **tore the class back off** and the checker measured hidden 0×0
buttons, reporting a layout failure that does not exist on a real phone. Fixed to
add-only. The general shape is worth remembering: *a verifier that must provoke the
state it measures can be defeated by the code it is measuring.* Sibling of INV-19
(a checker passing on absent input) — here a checker **failing** on state its subject
undid underneath it. Neither is a data point; both look exactly like one.

**4. `invertedTimer` — MY TEST WAS WRONG.** It read 3.71s for "5s of continuous
stepping" and I nearly changed the timer. The climber was walking into **trees** —
and a climber pushing against a tree genuinely *is* not moving, so the clock
correctly ran. The mechanic was right and the test hadn't isolated it (INV-4). Fixed
by clearing terrain in the test, not by touching the game. Now reads **0.00s
stepping / 5.01s standing**.

**5. `waitingPays` 0.99× — the one I had to be careful with.**
This is A23, the proof that A-31 is earned by *our* build and not just quoted from
the manual. My "patient" bot merely stopped climbing **while staying in the hazard's
column**, which dodges nothing — a rock falling down your lane hits you standing or
moving. That measured *hesitation*, not *patience*.

I changed the bot to express the strategy the free clock is supposed to reward — step
aside, let it pass, resume — and it went **0.99× → 2.49×**.

**Flagging this honestly, because it is exactly the move INV-13 warns about:** I
changed the instrument and the number improved. My defence is that the first bot did
not implement the hypothesis at all, and the game was untouched throughout. But a
reader should know the sequence, and the number should be re-derived by anyone who
doubts it. **If the family playtest finds that waiting doesn't feel worth it, believe
the humans over the 2.49× — that is INV-9, and this bar is the kind of proxy INV-13
says to distrust.**

## Second run — 24/24, CONFORMANT 11/11 (+1 n/a)

Headline numbers:

- **`muteEquivalence` 20/20 seeded games byte-identical with speech on vs off.**
  A-30 holds under test, on our build. This is the rung.
- `containment` 0 violations / 80 games, integer coords throughout (INV-20).
- `allClimbable` 0 unclimbable layouts / 200 generations (flood fill at generation
  time — generation asserts, it does not hope).
- `layoutVariety` 20/20 distinct layouts; same seed byte-identical (A-32).
- `fallingSubstep` 0/63 pass-throughs across 21 offsets × 3 hazard classes (INV-1).
- `penaltyTable` all eleven sourced penalties exact; `scoreTable` all 18 base values
  exact; `summitBonus` matches the manual's 2 × base × seconds.
- `invertedTimer` 0.00s moving / 5.01s standing (A-31, exact).
- `skillRatio` hazard-aware **42/100** summits vs random-walk **0/100** — ratio
  reported as infinite against a null that never once summited.
- `waitingPays` **2.49×** (with the caveat above).

## The black canvas — and a hole in INV-6

Sampled the canvas to prove it rendered: **49,152 pixels, all black.** Then found
`requestAnimationFrame` never fires in this verification pane, so `frame()` never
calls `draw()`.

The important part is that **a game that draws nothing and a game whose rAF is paused
are byte-identical to a checker.** INV-6 said ship a read-only handle into *state* —
and I had, which is why 24 tests passed against an apparently blank screen. The
renderer had no such handle, so it was in exactly the eyeball-only position INV-6
exists to abolish.

Added `__alpiner.render()`. With it: title screen 2,718 non-black pixels including
TI cyan; mid-climb on Hood 42,421 of 49,152, greens dominant. Renderer proven
machine-side, no human needed.

Candidate invariant for Daniel's ruling (not written into INVARIANTS.md yet — it is
his call whether one rung's scar is a law): **a read-only handle into state does not
cover the renderer, and a paused frame loop is indistinguishable from a renderer that
draws nothing.**

## Not done — the gate that matters

**No human has played this.** INV-9 is unambiguous that a green suite proves I met my
criteria, not that my criteria were right, and every behavioural defect on rung 2 was
found by a human. Twenty-four passing tests and a CONFORMANT verdict mean this build
is ready *to be playtested*, not that it is good.

Specific things I expect play to challenge:

- Does the frozen clock read as **deliberate** or as a bug? The HUD says "TIME HELD"
  in green while moving, but that is my guess at legibility, untested.
- Is 46 m/step the right *feel*? Everest is ~193 steps; on a real thumb that may be a
  slog no test can detect.
- The `A18` target-bonus trigger is **[ASSUMED]** — no source explains how bonuses
  fire in the original, so v1 awards them on surviving a close pass and labels the
  guess rather than hiding it.
- Hazard mix by level is ours, not TI's (their per-mountain mapping is unconfirmed).

`releases.json` untouched — **what is advertised stays Daniel's pacing call.**
Committed locally; **the push is Daniel's** (publishing gate).

---

## Same session, after Daniel looked at it — THE GAME HAD NO GRAPHICS

He opened it and said: *"That without a doubt is NOT alpiner. That is a bunch of
letters on a screen."* He was exactly right. Every entity was a **monospace
character** — `T` for tree, `n` for stump, `s` for skunk, `~` for snake, `A` for
the climber — on a flat green wash. I had shipped a debug view and called it
machine-verified.

**The part that matters is that I had an instrument pointed straight at this and
misread it.** I sampled the canvas, got **42,421 non-black pixels of 49,152**, and
concluded "the renderer works." Typography lights pixels too. That is **INV-13
in its purest form** — the proxy was cheap to compute *because* it had dropped the
hard part of the task, and having measured something I stopped looking. Worse, I
had just written a self-congratulatory entry about finding a hole in INV-6 while
the renderer that entry was defending was drawing letters.

The `palette` conformance check is complicit and should be fixed at the fleet
level: it passes on `!!(g && (g.TI || g.game))` with the detail string reading
**`assumed by inspection`**. It has never looked at a pixel on any rung.

### What the repair turned up

**1. Sprites.** Sixteen 8×8 monochrome patterns — one colour per sprite, which is
what the TMS9918A actually enforced (A-33), so the constraint is authentic rather
than an excuse. Trees, stumps, skunks, snakes, bats, fire, bear, lion, vulture,
ram, snowman, climber, rock, avalanche, icefall, summit flag.

**2. Two of those bitmaps were malformed — 60 cells instead of 64.** `stump` and
`snake` had short strings, so their rows wrapped and they rendered as garbage.
Found by *measuring the pattern lengths*, not by squinting at them.

**3. The terrain hash was broken, and that is why the mountain was a flat wash.**
`(r*73856093) ^ (c*19349663)` with one shift-xor loses precision on the multiplies
and never avalanches. Measured `hash(8, 0..7)`: **0.138 0.133 0.131 0.126 0.155
0.152 0.148 0.169** — a 0.04 spread where 0..1 was assumed. Downstream, the relief
noise was **0.232 across an entire row** — a constant. There was nothing to shade,
so nothing looked like ground. Replaced with a proper 32-bit mixer (`Math.imul`,
two rounds): range now 0.06–0.84, sd 0.157.

Sequence worth keeping: **the picture told me something was wrong; the numbers
told me what.** I first tried a "smarter" noise function and got vertical stripes,
i.e. guessed twice. Probing the hash distribution ended it in one step. When output
looks wrong, instrument the input rather than iterating on the output.

**4. Hazard density halved** (.12→.30 became .055→.16). At the old rate roughly
every third cell held a hazard, which means there is no clean ground to route
through — so the wrap-around (A6) and the graded step penalties (A10) both stop
being decisions. Everything a hazard is the same as nothing a hazard.

### Two permanent checks added, because a lesson with no check is a preference

- **`spriteIntegrity`** — every hazard, falling class, the climber and the flag
  must have a pattern of exactly 64 cells, at least 6 lit pixels, and a bitmap
  distinct from every other. This fails on characters-instead-of-sprites, on
  malformed strings, and on blanks. It is the check whose absence let v1 pass 24/24.
- **`terrainRelief`** — the relief noise must span a real range, carry real
  variance, and **differ between neighbouring cells**. A smooth gradient with no
  local variation would pass a naive range test and still render as a wash.

Suite now **26/26**, CONFORMANT 11/11 (+1 n/a), docs clean.

### Still weak — named, not hidden

- The **low forest band is monotone** compared to the rock and snow bands; below
  ~800 m it is a green field with faint contours.
- **Skunks are white blobs** and visually dominate a green slope. Monochrome
  sprites make a black-with-white-stripe skunk impossible without burning a second
  sprite, which is the authentic 1982 trade — but the colour choice is mine.
- The art is **functional, not charming.** It reads correctly; it has no character.
- **I have now been wrong twice about this build's readiness**, both times in the
  direction of over-claiming. Weight the tests accordingly: they cover mechanics
  well and aesthetics barely.

### The invariant candidate, now much stronger — still Daniel's call

Earlier this session I proposed *"a state handle doesn't cover the renderer."* The
letters incident sharpens it into something bigger:

> **A verification suite measures the axis it was built along, and silence on every
> other axis reads exactly like success.** 24 green mechanical tests coexisted with
> a game that had no graphics at all — not because any test was wrong, but because
> no test was *about* that. The canvas sample felt like visual verification while
> measuring luminance, which is what made it dangerous: an instrument pointed near
> the right question answers the wrong one confidently.

INV-9 says tests and playtest are different oracles. This says something narrower
and nastier: **you can have an instrument, aim it at the artifact, read it
correctly, and still learn nothing about the thing you were worried about.**
