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
- Breaking through to the **back wall** is punished with **both** a halved paddle **and**
  the ball jumping to **maximum speed** (found 2026-07-18 while chasing a different
  question — I had originally implemented only the paddle half of this rule)
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

### Finding 5 — arcade difficulty was a business model, not a design ideal

This is the one that reframes every rung in this project.

A coin-op cabinet earned money per play. **A single quarter was engineered to reach GAME
OVER in roughly 180 seconds.** Nolan Bushnell's formulation, 1971: *"all the best games
are easy to learn and difficult to master. They should reward the first quarter and the
hundredth."* Cabinets could take 2,500 quarters a week; difficulty was the throttle on
revenue per hour.

So the brutality was **deliberate and commercial**. And it lands directly on Breakout's
numbers:

- The full wall is 112 bricks worth **448 points**. Two walls exist, max score **896**,
  after which the ball bounces off empty walls forever — there is no wall 3.
- If a credit ends in ~3 minutes, **the overwhelming majority of players never cleared
  even one wall.** 896 was a legendary achievement, not an expectation.

**Which means the wall was never a completion target. It was a score reservoir.** The
design intent was that you *fail* to clear it, having spent your quarter interestingly.

**The transferable lesson, and it's the sharpest one in this file:**

> **A-11.** Before copying a design decision, find out what it was optimising for.
> Arcade difficulty was optimised for revenue per cabinet-hour. We have no coin slot —
> so inheriting that difficulty means inheriting a constraint whose *reason no longer
> exists*. A-2 says removing a constraint silently removes what it provided; A-11 is the
> mirror: **removing a constraint also means you should stop paying its costs.**

The trap for this whole project: "authentic" difficulty is not automatically good
difficulty. It was tuned by an accountant.

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
  the discrete-logic era norm of roughly 1–2 px/frame and two rounds of playtest, opening
  at **1.42 px/frame** and escalating to **2.28** across the four authored triggers.
  **[ASSUMED]**
- **Whether the speed curve resets after losing a ball.** No source either way — a direct
  consequence of Finding 4. We reset it, on playability grounds rather than fidelity
  grounds, and say so (UX-19). **[ASSUMED — and unresolvable from sources]**
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
| **High score table with initials** | **DELIBERATE ANACHRONISM — added** | Didn't exist until 1979 (Star Fire), so this is three years early. Added anyway: the competitive loop is what makes a cabinet *social*, and kids won't come back to a game they can't beat each other at. The date matters less than the mechanic. Declared here rather than smuggled in |
| Building it in discrete logic / a gate simulator | **SKIP** | Teaches TTL, not game design. Wrong axis of suffering |
| Cellophane colour simulation | **SKIP** | We have real colour; the lesson is recorded, not re-suffered |
| **TI-99/4A palette has no true orange** | **INVERTED — accepted cost** | Holding the series palette means we *cannot* reproduce Breakout's actual colour bands. Substituting the nearest available. A constraint we chose, now constraining us — exactly how the originals felt |

---

## Rung 4 — Galaga (Namco, 1981)

Dug 2026-07-19, before any code — the method holding for its second rung.

### The machine

| | |
|---|---|
| CPU | **Three Z80s** (~3 MHz), shared address space. CPU1 "the game boss" holds 16 KB of code; the two slaves hold 4 KB each. All three share one 8 KB RAM that is both video memory and general storage ([Computer Archeology](https://www.computerarcheology.com/Arcade/Galaga/), [System 16](https://www.system16.com/hardware.php?id=516)) |
| Sprites | **Hardware sprites at last** — up to 64, with dedicated sprite ROM. The first rung in our ladder where the machine draws moving objects *for* the programmer |
| Display | 224×288 portrait, tilemap background |
| Starfield | A dedicated custom chip — the **Namco 05XX** — generates the scrolling starfield: 4 sets of 63 stars, 2 sets shown at a time for the blink ([Arcade Shop](https://www.arcadeshop.com/i/2/05xx-galaga-starfield-generator.htm)). The *background ambience* had its own silicon |
| Sound | The same custom 3-voice waveform generator (WSG) as Pac-Man ([System 16](https://www.system16.com/hardware.php?id=516)) |
| Lineage | Sequel to Galaxian (1979). Planning took two months; it was intended for the Galaxian board, and moved to the new board at Namco R&D's suggestion. Director Shigeru Yokoyama ([Wikipedia](https://en.wikipedia.org/wiki/Galaga)) |

### Constraint → what it forced (and what *removing* one enabled)

| Constraint / change | What it did | What that became |
|---|---|---|
| Sprite hardware (was: none in 1978) | Smooth curved motion became *free* | **Choreography became the content** — entrance trains, looping dives, the tractor beam. See Finding 1 |
| Three CPUs, 8 KB shared RAM | Enemy logic, shots, and sound split across processors | The seam between CPU1 and CPU2 is where the no-fire bug lives — see Finding 2 |
| Fixed pools: 64 sprite slots, **8 enemy-shot slots** | Every moving thing is a slot in a finite table | The most famous cheat in arcade history is a **resource leak** — Finding 2 |
| Two player shots on screen (Galaxian allowed one) | "Hardware improvements" doubled fire rate | Pacing roughly doubled — a sequel buying *pace* with silicon ([Retro Game Deconstruction Zone](https://www.retrogamedeconstructionzone.com/2020/05/metamorphosis-from-galaxian-to-galaga.html)) |

### Finding 1 — when sprites become free, choreography becomes the medium

Rung 2's formation moved in steps because the CPU drew every pixel; stepped motion was
the *only* motion. Three years later the sprite hardware moves objects for free — and
Galaga's entire identity is what the designers did with that freedom: enemies **enter the
stage in choreographed trains** before settling into formation (the stage starts before
the formation exists — you can shoot them en route), dives are **authored curved paths**
that loop and return, butterflies adjust their path depending on which side you're on
([RGDZ](https://www.retrogamedeconstructionzone.com/2020/05/metamorphosis-from-galaxian-to-galaga.html)).

**The transferable lesson (A-14):** Galaga has barely more *mechanics* than Galaxian —
its content is **motion data**. When a constraint recedes, the next competitive axis is
whatever the constraint was suppressing; the studios that noticed first (Namco, 1981)
defined the era. For us: the flight paths are the build. Get the choreography data model
right and the game exists; get it wrong and no amount of mechanics saves it.

### Finding 2 — the no-fire bug: a resource leak with a coin slot

The famous trick — kill everything except two left-side bees, dodge them for ~15
minutes, and no enemy fires for the rest of the game — has a fully understood cause,
read out of the disassembly ([Computer Archeology](https://www.computerarcheology.com/Arcade/Galaga/),
[Jason Eckert's summary](https://jasoneckert.github.io/myblog/the-galaga-no-fire-cheat-mystery/)):

- Enemy shots live in a **fixed pool of 8 sprite slots**.
- In late-stage attack patterns, bees diving at the screen edge occasionally fire a shot
  at **X = 0**. The hardware draws X=0 off-screen: the shot is invisible but *live*.
- CPU2's `InitiateBeeShot` never validates coordinates; CPU1's `MoveBeeFire` **ignores**
  sprites at X=0; and `RemoveBeeShot` frees a slot **only on Y-coordinate bounds** — which
  an X=0 shot never crosses. So each such shot leaks its slot **permanently**.
- After ~15 minutes all 8 slots are clogged and the game can never fire again.

Three routines, split across **two different CPUs**, each assuming another had validated.
Off-screen was treated as equivalent to dead. The release check was on a different axis
(Y) than the corruption (X).

**The transferable lesson (A-13):** a fixed resource pool needs exactly one owner whose
release condition covers *every* way an entry can become useless — "not visible" and
"not alive" are different predicates, and the gap between them is where slots leak.
Modern costume: connection pools, entity freelists, event listeners. The 1981 version
just happened to be exploitable by children, which is why it's the best-documented
resource leak in history.

### Finding 3 — the capture mechanic prices a loss as an investment

The Boss Galaga's tractor beam **takes a life and shows it to you** — your fighter, held
hostage at the top of the screen. Shoot the captor while it dives and the hostage returns
as a **dual fighter**: double firepower, double hitbox. Yokoyama took the beam from a
film scene of a ship captured by a circling laser ([Wikipedia](https://en.wikipedia.org/wiki/Galaga)).

The score table carries the same philosophy — **danger is priced**: every enemy is worth
double while diving (bee 50→100, butterfly 80→160), and a Boss diving with two escorts
is worth 1,600 against 150 in formation — **more than 10×** for attacking the most
dangerous thing on screen at its most dangerous moment
([StrategyWiki](https://strategywiki.org/wiki/Galaga/Gameplay), [PrimeTime](https://primetimeamusements.com/getting-good-galaga/)).

**The transferable lesson (A-15):** 1981's designers had discovered *incentive design*.
Galaga doesn't force aggressive play; it **prices** it. And the capture mechanic converts
the worst moment in the game (losing a ship) into the setup for the best one (the
rescue) — a loss the player can invest instead of merely absorb. Note the balance rider:
the reward carries its own cost (a dual fighter is twice as easy to hit).

### Finding 4 — the challenging stage: pacing as an invented feature

Stage 3 and every 4th after is a **challenging stage**: 40 enemies fly through in preset
patterns and never fire. 100 points each; all 40 = a **10,000 perfect bonus**; the game
reports your hit/miss ratio at game over ([StrategyWiki](https://strategywiki.org/wiki/Galaga/Walkthrough),
[Wikipedia](https://en.wikipedia.org/wiki/Galaga)).

A stage with **zero threat** was a genuinely new idea: a breather beat that converts the
skill the normal stages taught (leading moving targets) into a pure test with a coin-op
scoreboard payoff. The difficulty curve gained a *rhythm* — tension, tension, release —
rather than a slope. Note it does exactly what A-11 predicts a coin-op wouldn't do
(gives away free playtime) and pays for itself in engagement anyway: even the accountants
learned pacing.

### Open / unverified

- **Exact dive-path shapes and speeds.** The disassembly documents the data tables exist,
  but no readable spline spec. Ours are authored approximations tuned by playtest.
  **[ASSUMED]**
- **Entrance-train composition per stage.** Three entrance patterns cycling per stage is
  sourced ([StrategyWiki](https://strategywiki.org/wiki/Galaga/Walkthrough)); the exact
  train orders/groupings in our build are approximations. **[ASSUMED]**
- **Formation "breathing" (the spread-and-contract idle animation).** Widely described,
  no timing source found. Implemented by feel. **[ASSUMED]**
- **Refresh rate.** Often quoted as ~60.6 Hz; not verified against a primary source, and
  we run at the display's 60 anyway. **[ASSUMED, immaterial]**

### Our Suffering Ledger for rung 4

| Constraint | Verdict | Reasoning |
|---|---|---|
| 40-enemy formation, exactly 20 bees / 16 butterflies / 4 bosses ([Arcade Quartermaster](https://www.arcadequartermaster.com/galaga_characters.html)) | **KEEP** | The formation is the stage; its composition drives the scoring economy |
| Entrance choreography — enemies fly in as trains, vulnerable en route, then settle | **KEEP — the rung's central lesson** | This is A-14 made playable. Authoring path data *is* the build |
| Two player shots on screen, max | **KEEP** | The 1981 fire discipline: double rung 2's budget, still a budget. Every trigger pull still a decision |
| **Fixed 8-slot enemy-shot pool** | **KEEP the pool, fix the leak** | The pool is period-correct discipline; we validate on spawn and release on every death path (A-13). The bug is recorded, not reproduced |
| Capture / rescue / dual fighter | **KEEP — the rung's second lesson** | Risk-reward invention at its origin (A-15) |
| Challenging stage (stage 3 cadence, 10,000 perfect) | **KEEP** | Pacing rhythm (Finding 4), and it's the kids' favourite part of any Galaga |
| Score table exactly: 50/100, 80/160, 150/400/800/1600, challenge 100 + 10,000 perfect | **KEEP** | The incentive-design lesson is *in the numbers* |
| Extra fighter at 20,000 then every 70,000 (a standard DIP option) | **KEEP** ([Namco Wiki](https://namco.fandom.com/wiki/Galaga)) | Standard economy; interacts with the capture gamble |
| Morphing transform enemies (scorpions etc., stage 4+) | **SKIP for now — held, not judged** | Content, not a lesson-bearing mechanic. Add later if the rung wants depth |
| Three-CPU architecture | **SKIP — but keep its scar** | Teaches 1981 board engineering, not game design. The lesson it left (A-13, the cross-CPU validation gap) is kept |
| 05XX starfield chip | **SKIP the chip, KEEP the result** | Two-layer blinking scrolling starfield is a dozen lines of JS. The ambience matters; the silicon doesn't |
| Smooth curved motion | **INVERTED from rung 2** | On rung 2 we kept *stepped* motion because smoothness would betray 1978. Here smoothness IS 1981 — the sprite hardware existed. The palette stays TI-99/4A (series constraint), the motion goes fluid |

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
| A-11 | Find out what a design decision was optimising for before copying it. Arcade difficulty was tuned for revenue per cabinet-hour — remove the coin slot and you should stop paying its costs | 3 | ~180 s per quarter; 896 max was never an expectation |
| A-12 | The social layer arrived late and was itself an invention. Initials-entry high score tables did not exist until **Star Fire (Exidy, 1979)**; Asteroids copied it the same year. Three letters specifically to limit obscenities in the attract mode | 3 | imported backwards into 1976/78 on purpose — declared, not smuggled |
| A-13 | A fixed resource pool needs one owner whose release condition covers every way an entry can die — "not visible" and "not alive" are different predicates, and the gap leaks slots. Validation split across components is validation nobody does | 4 | the no-fire cheat: X=0 shots clog all 8 slots forever; release checked only Y |
| A-14 | When a constraint recedes, the next competitive axis is whatever it was suppressing — sprite hardware made motion free, so choreography became the content. Galaga's identity is authored path data, not mechanics | 4 | 1978 stepped march → 1981 entrance trains and looping dives |
| A-15 | Don't force the risky play — *price* it. Diving enemies worth 2×, a boss with escorts 10×; and the capture mechanic converts a lost life into a potential upgrade the player can invest in. Reward carries its own cost (dual fighter = double hitbox) | 4 | Galaga's score table + tractor beam / rescue loop |
| A-16 | A zero-threat stage was an invention: difficulty needs a rhythm, not just a slope. The challenging stage converts taught skill into a pure test and pays the pacing cost back in engagement | 4 | stage 3 + every 4th; 10,000 perfect bonus; hit/miss ratio at game over |
