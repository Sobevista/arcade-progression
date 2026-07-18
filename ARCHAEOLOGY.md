# Archaeology — what they faced, what it forced, what we re-derive

*The third artifact, and the reason this project exists. We are re-deriving the evolution
of video games in order, from the constraints up — working out what must have taken them
a long time to figure out, so we inherit the reasoning instead of just the result.*

---

## The three files, and what goes where

| File | Holds | Test |
|---|---|---|
| `INVARIANTS.md` | **Laws.** Breaking one is a bug. | Would violating this be wrong in every game, on every platform, regardless of taste? **Yes.** |
| `UX_DECISIONS.md` | **Choices.** Tradeoffs with re-pick triggers. | No — the right answer depends on the game, platform, audience. |
| `ARCHAEOLOGY.md` | **History.** What the original builders were up against, what it forced them to invent, and which of their constraints we keep on purpose. | It's a fact about 1972–1990 hardware, economics, or culture — not about our code. |

A law is timeless. A choice is contextual. **Archaeology is why the choice existed at all.**

---

## The method — archaeology *before* build

This inverts how rung 2 was done, and the inversion is the whole correction.

On rung 2 I built Space Invaders from memory, then got caught shipping two mechanics
wrong (shields not repairing between waves; the formation never starting lower). Both
were confident recall. Both took thirty seconds to check. That became `INVARIANTS.md`
INV-10 — *"authentic" is a claim, and claims need a source.*

**So every rung from 3 onward runs in this order:**

1. **Archaeology.** What machine? What did it cost? What could it physically not do?
   What did the designers invent to get around that? *Sourced, not recalled.*
2. **Suffering Ledger.** Which of those constraints do we deliberately keep, and which
   do we skip? Decided out loud, before code.
3. **`SCOPE.md`** — pass criteria locked.
4. Build → verify in a browser → **playtest with a human** → extract invariants.

Research is cheap. Being wrong in public and having to unpick it is not.

---

## The Suffering Ledger

Daniel's own mantra, and it turns out to be the exact methodology: **be intentional with
your suffering.**

Every historical constraint is optional for us. We have 16.7 million colours, gigabytes
of RAM, and a language with garbage collection. So each constraint is a live choice:

- **KEEP** — the constraint *generates* something. Working inside it teaches what the
  original builders learned, and you cannot get that lesson by reading about it.
- **SKIP** — the constraint is tedium, not insight. Hand-assembling 8080 opcodes teaches
  you 8080 opcodes, not game design.

The trap to avoid in both directions: keeping every constraint is cosplay, and skipping
every constraint means you build a modern game with retro graphics and learn nothing
about why any of it is shaped the way it is.

**Third category, and the most interesting one — INVERTED SUFFERING:** things that were
*free* for them and *work* for us. Those are the ones nobody thinks to check, and they're
where fidelity quietly dies.

---

## Rung 2 — Space Invaders (Taito, 1978)

### The machine

| | |
|---|---|
| CPU | Intel 8080 @ ~2 MHz |
| Display | 256×224 raster, 1 bit per pixel, ~7 KB framebuffer, 32 bytes per scanline, 60 Hz |
| Sprites | **None.** No sprite hardware at all — everything drawn into a bitmap by the CPU |
| Colour | **None.** Simulated with physical coloured cellophane strips taped over the CRT, plus a painted background |
| Orientation | Monitor physically **rotated 90°** to turn a 256×224 landscape raster into a 224×256 portrait play area |
| Tooling | Nishikado built custom hardware *and* his own development tools — there was nothing to buy |

### Constraint → what it forced

| Constraint | What it forced | What that became |
|---|---|---|
| No sprite hardware; CPU draws every pixel | Redraw cost scales with the number of objects on screen | **The tempo ramp** — see below |
| 1-bit display, no colour | Colour faked *physically* with cellophane over the glass | Fixed colour bands by screen region — an aesthetic born of tape |
| ~7 KB framebuffer, 2 MHz | Small sprites, few objects, simple motion | 5×11 grid marching in discrete steps — not smooth motion, *stepped* motion |
| Landscape raster, portrait game | Rotate the physical monitor | The tall play area the whole genre inherited |
| No sound chip | Discrete analogue circuits | The four-note bass loop — cheap to generate, unforgettable |

### The canonical finding: the tempo ramp was an accident

The invaders speed up as you kill them. It is the single most famous thing about the
game — the rising dread that defines the genre.

**It is not in the source code.** There is no difficulty curve, no speed variable, no
ramp. The 8080 simply had fewer objects to draw each frame, so the loop ran faster. The
defining feature of the genre was a **hardware bottleneck that nobody designed**
([Tom's Hardware](https://www.tomshardware.com/video-games/retro-gaming/space-invaders-arcade-game-ran-faster-as-enemies-died-due-to-intel-8080-bottleneck-expert-coder-asserts-hardware-accident-to-blame),
[Computer Archeology](https://www.computerarcheology.com/Arcade/SpaceInvaders/Hardware.html)).

**The lesson that transfers, and it's the big one:**

> **Constraints generate identity. The features people remember are frequently the ones
> nobody chose.**
>
> And the corollary that actually costs you money: **when you remove a constraint, you
> must deliberately replace whatever it was accidentally providing.** Our machine is fast
> enough to draw 55 invaders at a flat 60 fps forever — so on modern hardware, Space
> Invaders has *no difficulty curve at all* unless you put one there on purpose. We had
> to hand-author a 560 ms → 40 ms curve to buy back a feature they got for free.

That is the entire Dr. Stone exercise in one mechanic. You cannot learn it by playing the
game or reading about it. You only learn it by building the game on hardware that doesn't
have the bottleneck, watching the tension fail to appear, and working out why.

### Our Suffering Ledger for rung 2

| Constraint | Verdict | Reasoning |
|---|---|---|
| One player shot on screen | **KEEP** | Makes every trigger pull a decision. Playtested and confirmed: *"it keeps you wishing you had faster shots, it's about timing."* |
| Fixed 224×256, integer-scaled | **KEEP** | Forces pixel discipline; teaches why the play area is tall |
| Hand-authored sprites as bit arrays | **KEEP** | Teaches what a sprite actually *is* before any library hides it |
| Severely restricted palette | **KEEP** (adapted) | They had zero colours and faked it with tape; we restrict to the TI-99/4A's 15. Same discipline, different century |
| Stepped formation movement, not smooth | **KEEP** | Smooth motion would be trivial for us and would destroy the feel entirely |
| Writing it in 8080 assembly | **SKIP** | Teaches opcodes, not game design. Wrong axis of suffering |
| Physical cellophane over a CRT | **SKIP** | Obsolete constraint with no transferable lesson |
| Discrete analogue sound circuits | **SKIP** — but keep the *result* | Synthesised the four-note bass in Web Audio. The sound matters; the circuit doesn't |
| **Tempo ramp** | **INVERTED — had to build what they got free** | The single most valuable finding of the rung |

---

## Rung 3 — Breakout (Atari, 1976) — questions to answer BEFORE building

*This section is deliberately unanswered. Filling it in is step 1 of rung 3, and no code
gets written until it is.*

Breakout sits between rungs 1 and 2 not just chronologically but **causally** — it is
Pong's direct descendant, and Nishikado has cited it as his inspiration for Space
Invaders. Building it completes the actual chain rather than skipping a link.

Open questions, all to be sourced:

1. **Was there a CPU at all?** Breakout is widely described as built from discrete TTL
   logic with no microprocessor. If true, that is a profoundly different machine from the
   8080 — and it means the "accidental tempo ramp" mechanism could not have happened the
   same way. What did Breakout's difficulty curve consist of, and was *it* deliberate?
2. **The Wozniak chip-count story.** Woz is said to have prototyped it with a famously
   low part count. What did that constraint remove from the design?
3. **How was paddle-angle control actually implemented?** Reflection based on contact
   point is the mechanic that makes Breakout a skill game rather than a reflex game.
   Was that intentional or emergent?
4. **The documented speed-up and paddle-shrink rules** — were they authored, or another
   side effect?
5. **Colour** — same cellophane trick, or real?

**What Breakout should teach us that neither neighbour does:** reflection angle as a
*control surface*, a destructible tile grid (the direct ancestor of both Invaders'
formation and its bunkers), and difficulty as an authored curve rather than an accident.

---

## Running list of transferable lessons

*The trove. One line per finding, sourced, added as each rung is dug.*

| # | Lesson | Rung | Source |
|---|---|---|---|
| A-1 | Constraints generate identity — the memorable feature is often the unchosen one | 2 | 8080 bottleneck / tempo ramp |
| A-2 | Removing a constraint silently removes what it was providing; you must replace it deliberately | 2 | flat 60 fps kills the difficulty curve |
| A-3 | Aesthetics can be a physical hack, not a software decision | 2 | cellophane over the CRT |
| A-4 | The screen shape a genre inherits may just be how someone bolted a monitor in | 2 | 90° rotated raster |
