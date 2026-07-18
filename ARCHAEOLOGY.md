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

## Rung 3 — Breakout (Atari, May 1976)

Breakout sits between rungs 1 and 2 not just chronologically but **causally** — it is
Pong's direct descendant, and Nishikado cited it as his inspiration for Space Invaders.
Building it completes the actual chain rather than skipping a link.

### The machine

| | |
|---|---|
| CPU | **None.** Discrete transistor-transistor logic. There is no processor and no program — the game *is* the circuit |
| Prototype | Steve Wozniak, ~42–45 TTL chips (sources vary), engineered for minimum part count |
| Production | Atari could not manufacture Woz's design; shipped their own at **~100 TTL chips** |
| Display | 19" **black-and-white** monitor, portrait orientation |
| Colour | **None.** Coloured cellophane strips over the glass again — yellow, green, orange, red bands bottom to top |
| Design | Nolan Bushnell and Steve Bristow |

### The authored rules — and why this matters

Unlike Space Invaders, **Breakout's difficulty curve was deliberately designed**:

- Ball speeds up **after 4 hits**, again **after 12 hits**, and again on reaching the
  **orange** and **red** rows
- The paddle **halves in width** once the ball breaks through to the top wall
- 8 brick rows, two per colour: yellow **1 pt**, green **3**, orange **5**, red **7**
- 3 balls per game

Every one of those is an explicit rule. And here is the finding: **the game with the
authored difficulty curve came two years BEFORE the one with the accidental curve.**
Rung 2's tempo ramp wasn't a step forward in design thinking — it was a hardware
accident that happened to land on something Breakout had already done on purpose.

### Finding 1 — when a rule costs a physical chip, feature creep is impossible

There is no CPU. Every rule had to be expressible as *wiring*. "Speed up after four
hits" means a counter circuit; "paddle halves" means gating a width signal. A designer
who wants a new mechanic is asking someone to add hardware to every cabinet ever built.

That is why Breakout's rule set is so small and so countable — 4 hits, 12 hits, two row
colours, one paddle-shrink. It is not simplicity as taste. **It is simplicity as
physics.**

Our marginal cost of a new rule is zero. So the discipline the hardware used to impose
has to be imposed by us, deliberately, or it doesn't exist at all. This is A-2 again in
a new costume: remove the constraint, lose what it was providing.

### Finding 2 — elegance that can't be manufactured isn't elegance

Wozniak's design is legendary precisely because of its part count. Atari's production
process couldn't reproduce it, so they shipped a version with more than twice the chips.
Woz himself reportedly could not tell the difference in gameplay.

**The player experiences behaviour, not implementation.** A brilliant reduction that the
factory cannot build is worth less than a clumsy one that ships — and the clever version
scores zero points with the person holding the paddle. That is "build for repair, not
forever" arriving from the opposite direction.

### Finding 3 — the cellophane trick is a pattern, not a one-off

Breakout (1976) and Space Invaders (1978) both faked colour with coloured plastic taped
over a monochrome CRT. Two different companies, two countries, two years apart, same
hack. A-3 is upgraded from an anecdote to an **era-defining constraint**: for most of the
1970s, colour was a physical layer, not a software property.

### Finding 4 — a game with no processor cannot be emulated, only reconstructed

**Breakout is absent from MAME.** Not by oversight — there is nothing to emulate. No CPU
means no ROM, no instruction stream, no binary anyone can read the behaviour out of. The
game exists as timing in discrete circuits, so it must be *simulated* by reproducing what
the hardware did, judged by feel.

The consequence lands directly on us: **there is no authoritative figure for the original
ball speed.** Not obscure, not hard to find — it does not exist in a readable form.
Anyone who quotes you a pixels-per-frame number for 1976 Breakout is reconstructing, and
should say so.

**The transferable lesson:** software leaves a readable artifact; hardware leaves
behaviour. Once the last working cabinet dies, a discrete-logic game survives only as
other people's reconstructions of how it *felt* — which is a far weaker form of
preservation than a ROM dump. This is why our own speed table is tagged ASSUMED in the
source rather than presented as fidelity.

### Open / unverified

- **Ball speed.** No authoritative source exists (see Finding 4). Ours is tuned against
  the discrete-logic era norm of roughly 1–2 px/frame and Daniel's playtest, opening at
  **1.42 px/frame** and escalating to 3.58 across the four authored triggers. **[ASSUMED]**
- **Paddle segmentation.** Sources confirm the mechanic — the ball rebounds at different
  angles depending where it strikes the paddle — but **not** how many discrete zones the
  original used, or whether deflection was stepped or continuous. **[ASSUMED]** We will
  implement continuous contact-point mapping and flag it here rather than invent a
  segment count and present it as fidelity.

### Our Suffering Ledger for rung 3

| Constraint | Verdict | Reasoning |
|---|---|---|
| Authored difficulty curve (4 hits / 12 hits / orange / red) | **KEEP exactly** | This is the rung's central lesson — a designed curve, two years before the famous accidental one |
| Paddle halves on breakthrough | **KEEP** | Punishes the exact success it rewards. Elegant, and free to implement |
| 8 rows × 14 bricks, 1/3/5/7 scoring | **KEEP** | Score as a risk gradient — the valuable bricks are the hard ones |
| 3 balls | **KEEP** | Authentic, and it makes the speed thresholds matter |
| Contact-point angle control | **KEEP** — it's the reason for this rung | Turns a reflex game into a skill game. The primitive neither neighbour teaches |
| **No new mechanics beyond the 1976 rule set** | **KEEP — self-imposed** | Deliberately adopting the discipline the TTL chip count used to enforce. If it wasn't in the circuit, it isn't in our build |
| Building it in discrete logic / a gate simulator | **SKIP** | Teaches TTL, not game design. Wrong axis of suffering |
| Cellophane colour simulation | **SKIP** | We have real colour; the lesson is recorded, not re-suffered |
| **TI-99/4A palette has no true orange** | **INVERTED — accepted cost** | Holding the series palette means we *cannot* reproduce Breakout's actual colour bands. Substituting the nearest available. A constraint we chose, now constraining us — exactly how the originals felt |

---

## Running list of transferable lessons

*The trove. One line per finding, sourced, added as each rung is dug.*

| # | Lesson | Rung | Source |
|---|---|---|---|
| A-1 | Constraints generate identity — the memorable feature is often the unchosen one | 2 | 8080 bottleneck / tempo ramp |
| A-2 | Removing a constraint silently removes what it was providing; you must replace it deliberately | 2 | flat 60 fps kills the difficulty curve |
| A-3 | Aesthetics can be a physical hack, not a software decision | 2 | cellophane over the CRT |
| A-4 | The screen shape a genre inherits may just be how someone bolted a monitor in | 2 | 90° rotated raster |
| A-5 | When a rule costs a physical chip, feature creep is impossible — zero marginal cost means the discipline must now be self-imposed | 3 | Breakout has no CPU; every rule is wiring |
| A-6 | Elegance the factory can't build is worth less than a clumsy version that ships; the player experiences behaviour, not implementation | 3 | Woz's ~42 chips → Atari's ~100, gameplay indistinguishable |
| A-7 | Colour was a *physical layer* for most of the 1970s, not a software property — confirmed across two companies, two countries, two years | 2, 3 | cellophane on both |
| A-8 | The deliberate solution can predate the famous accidental one — later ≠ more evolved | 3 | Breakout authored its difficulty curve in 1976; Invaders got one by accident in 1978 |
| A-9 | Software leaves a readable artifact; hardware leaves only behaviour. A game with no processor can't be emulated, only reconstructed — so some "facts" about it genuinely do not exist | 3 | Breakout is absent from MAME; no ROM to read a ball speed out of |
| A-10 | A constraint adopted for authenticity stops being worth holding the moment it destroys information the design depends on | 3 | TI palette hid the 1/3/5/7 risk gradient; legibility won |
