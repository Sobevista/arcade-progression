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

## Rung 5 — TI-99/4A (Texas Instruments, 1981 machine; games 1980–82)

Dug 2026-07-18, before any code. This is the homage rung: the series palette has been
this machine's TMS9918A from rung 2 onward — now the machine itself is the subject.
Two games chosen for maximum orthogonality: **Hunt the Wumpus** (1980, deduction) and
**Parsec** (1982, the flagship scroller).

### The machine

| | |
|---|---|
| CPU | TMS9900, a true 16-bit minicomputer chip at 3 MHz — architecturally the most powerful CPU in any machine in our ladder so far ([Wikipedia](https://en.wikipedia.org/wiki/TI-99/4A)) |
| CPU RAM | **256 bytes.** That is the entire fast memory — the "scratchpad" at >8300, the only RAM on the 16-bit bus. Even the CPU's registers R0–R15 live in it (the chip has only three physical registers) ([Nouspikel](https://www.unige.ch/medecine/nouspikel/ti99/architec.htm)) |
| Main RAM | 16 KB — but it belongs to the **video chip**. The CPU cannot address it; every byte moves through the TMS9918A's I/O port, slowly ([Nouspikel](https://www.unige.ch/medecine/nouspikel/ti99/architec.htm)) |
| Software layer | Most console software, including TI BASIC, is **GPL bytecode interpreted from GROM** — a second interpretation layer that made the machine famously slower than its CPU deserved ([Nouspikel GPL](https://www.unige.ch/medecine/nouspikel/ti99/gpl.htm)) |
| Sprites | TMS9918A: 32 hardware sprites, 4 per scanline, and **automotion** — the VDP moves sprites autonomously with signed 8-bit velocities, no CPU per frame |
| Scrolling | **None in hardware.** The TMS9918A has no scroll register |
| Speech | The Solid State Speech Synthesizer peripheral — LPC synthesis (TMS5200 family), a phrase ROM, and per-game vocabularies |
| Colour | 15 fixed colours + transparent. Real colour at last — the cellophane era (A-3/A-7) is over, and this exact palette is our series constraint |

### Finding 1 — the defining constraint was memory topology, not memory size (A-17)

The spec sheet says 16 KB. The truth is **256 bytes** — everything else lives behind
the video chip's port. A game's hot loop either fits in the scratchpad or crawls.
Parsec's famous smooth ground scroll worked because the scroll routine was **copied
into the 256-byte console RAM and run from there** ([Xona rare facts](https://xona.com/about/computers/ti994a/parsec.html)).
The machine had plenty of memory; it had almost no memory *near the CPU*.

**The transferable lesson (A-17):** where memory lives shapes software more than how
much exists. The fast region is always small, so *what you promote into it* is the
design decision. Modern costume: cache lines, hot paths, CPU↔GPU transfers. The 1982
version was literally hand-carrying your inner loop into 256 bytes.

### Finding 2 — Parsec's difficulty ceiling is an integer width (A-18)

Levels ramp by starting enemies closer and faster. Level 16 repeats forever — and
eventually the game becomes unplayable, because sprite automotion velocities are
**signed 8-bit**: past +127 a speed wraps to −128 ([Xona](https://xona.com/about/computers/ti994a/parsec.html)).
The endgame wall was never designed. It is the datatype.

**The transferable lesson (A-18):** an unexamined numeric limit will eventually become
gameplay, and the player will meet it before the author does. Kin of A-1 (identity
from unchosen constraints) — but here it's the *ending* that nobody wrote. Every ramp
needs an authored ceiling, or its real ceiling is whatever overflows first.

### Finding 3 — speech as an information channel, not a gimmick (A-19)

Speech during gameplay was reportedly considered impossible on the machine before
Parsec shipped it ([Xona](https://xona.com/about/computers/ti994a/parsec.html), [HBFS](https://hbfs.wordpress.com/2008/12/16/tunnels-of-doom/)).
And the game spends it functionally: wave announcements, enemy warnings, fuel alerts —
information delivered **off-screen** so the eyes stay on the fight. The first audio in
our ladder that carries *semantic* content rather than feedback.

**The transferable lesson (A-19):** a new output channel earns its keep when it carries
information the busy channel (the eyes) would otherwise drop. Voice that duplicates
the screen is decoration; voice that replaces a glance is bandwidth.

### Finding 4 — the display re-gridded the game the designer built to escape grids (A-20)

Gregory Yob wrote the original Hunt the Wumpus (1973) specifically because every
hide-and-seek game of the era ran on a 10×10 grid — he built his cave as a
**dodecahedron** (20 rooms, 3 tunnels each) to make topology, not coordinates, the
puzzle ([Wikipedia](https://en.wikipedia.org/wiki/Hunt_the_Wumpus)). The TI-99/4A
version (Kevin Kenney, 1980) is a fine adaptation — and it is a **wrapping grid**
([4A-Pedia](https://4apedia.com/index.php/Hunt_the_Wumpus)). A character-cell display
renders grids natively; drawing an arbitrary graph is hard. The medium quietly bent
the design back toward the exact thing its designer had fled.

**The transferable lesson (A-20):** the rendering technology has opinions about the
design, and it lobbies silently. When a port changes a game's *shape*, look for the
display in the room. (The wrap is what saves the TI version: edges stop being safe
walls, so the deduction stays honest.)

### The Wumpus clue economy — the whole game is information design

Sourced rules of the TI version ([4A-Pedia](https://4apedia.com/index.php/Hunt_the_Wumpus)):
bloodspots appear in **every cavern within two tunnels of the Wumpus**; **green-walled
caverns** flag an adjacent slime pit (two exist); bats relocate you randomly; one
arrow, fired into an adjacent cavern — hit wins, miss loses. Explored caverns stay
visible; difficulty changes the cavern count (roughly 32 / 24 / 16 — *fewer* caverns
is harder, because each clue then covers proportionally more of the map and carries
less information). The game is turn-based inference with a renderer on top — and it
sits near the *root* of our ladder chronologically (1973 origin), before most action
genres existed. The ladder was never "simple action → complex action."

### Open / unverified

- **Parsec wave structure per level** (order and size of the six enemy groups, when
  the asteroid belt and refuel tunnel arrive). Scoring pairs are sourced (100/200/300
  by class, +100 per level, asteroids 100, belt bonus 1,000 — [Creative Computing review](https://www.atarimagazines.com/creative/v9n9/135_Fun_and_games_with_the_TI.php));
  the exact sequencing in our build is an approximation. **[ASSUMED]**
- **Parsec fuel-exhaustion behaviour** (crash vs. dead stick) and exact heat/fuel
  rates. **[ASSUMED, tuned by play]**
- **Wumpus bat-adjacency warning.** Yob's original warns "bats nearby"; whether the
  TI version gives any bat warning is unverified. We warn on adjacency, mirroring
  Yob. **[ASSUMED]**
- **Wumpus arrow reach.** TI manual language implies firing into an adjacent cavern
  by direction; Yob's five-cave crooked arrows are definitely NOT the TI mechanic.
  **[ASSUMED: one cavern]**

### Our Suffering Ledger for rung 5

| Constraint | Verdict | Reasoning |
|---|---|---|
| **Wumpus:** wrapping-grid maze, cavern count by difficulty (32/24/16) | **KEEP** | The TI adaptation is the rung's subject, and the wrap keeps edges dangerous (A-20) |
| **Wumpus:** clue radii exactly — bloodspots ≤ 2 tunnels, green walls adjacent to pits | **KEEP exactly** | The clue economy IS the game; changing a radius changes everything |
| **Wumpus:** one arrow, miss = loss | **KEEP** | The commitment moment. Five crooked arrows are Yob's game, not TI's |
| **Wumpus:** bats as random relocation | **KEEP** | The chaos agent that keeps pure deduction humble — a re-randomizer mid-proof |
| **Wumpus:** fog of war (explored persists, unexplored invisible) | **KEEP** | The map is the player's memory made visible — the interface teaches note-taking |
| **Wumpus:** Blindfold / Express modes | **SKIP v1** | Modes multiply the test surface; Normal mode carries the lesson |
| **Parsec:** scrolling terrain + terrain collision | **KEEP — the rung's technical heart** | The scroll is what the 256-byte trick bought (A-17). First scrolling game in the ladder |
| **Parsec:** fuel + refuel tunnel at reduced speed | **KEEP** | The resource loop, and risk priced into the reward (slow flight in a narrow corridor) |
| **Parsec:** laser heat | **KEEP** | Fire discipline in continuous form — rungs 2/4 budgeted shots; Parsec prices *sustained* fire |
| **Parsec:** six enemy classes, sourced score pairs, +100/level | **KEEP** | The scoring table is sourced; behaviours approximated [ASSUMED] |
| **Parsec:** asteroid belt between levels | **KEEP** | The pacing beat (A-16's rhythm, one year after Galaga) |
| **Parsec:** speech during play | **KEEP the result** via the browser's built-in speech synthesis, optional | A-19 is the lesson; LPC silicon is not. Game fully playable silent |
| **Parsec:** 8-bit automotion overflow endgame | **SKIP the bug, KEEP the scar** | Same ruling as Galaga's leak: recorded (A-18), not reproduced. Our ramp gets an authored cap |
| **Parsec:** bitmap-mode scanline tricks | **SKIP** | We have real colour and a real framebuffer; the lesson is recorded in A-17 |
| GPL / TMS9900 assembly | **SKIP** | Teaches 1981 toolchains, not game design |

---

## Rung 6 — TI-99/4A part II: law and distribution (games 1982–83)

Dug 2026-07-19 (rung 6 session), before any code. Same silicon as rung 5 — the machine
table there stands unchanged. What's new on this rung is everything *around* the
machine: the 1982 legal earthquake and the birth of third-party cartridge distribution.
Two games, again orthogonal: **Munch Man** (TI in-house, Q1 1982, $39.95, PHM 3057 —
written by **Jim Dramis, the same hand as Parsec**) and **Anteater** (Romox, third-party,
TI 102, Q2 1983, $39.95).

### Finding 1 — the lawsuit was a level designer (A-21)

The 1981 Munch Man prototype had **dots and power pills** — the screenshots survive
([Videogame House prototype page](https://www.videogamehouse.net/munchmanproto.html)).
On **March 2, 1982** the Seventh Circuit granted Atari an injunction killing Magnavox's
K.C. Munchkin for capturing Pac-Man's **"total concept and feel"** — one of the first
copyright rulings applied to a video game ([Atari v. North American Philips](https://en.wikipedia.org/wiki/Atari,_Inc._v._North_American_Philips_Consumer_Electronics_Corp.),
[Justia 672 F.2d 607](https://law.justia.com/cases/federal/appellate-courts/F2/672/607/331150/)).
TI's response: replace the dots with **laying down a chain** and the power pills with
**TI logos** ([Wikipedia](https://en.wikipedia.org/wiki/Munch_Man)).

The dodge inverted the game's verb. Same underlying objective — visit every cell of
the maze — but the marker flipped sign: Pac-Man's maze is a to-do list (what's left),
Munch Man's is a ledger (what you've built). The energizer inverted too: eating one
turns the Hoonos black **and speeds Munch Man up** ([4A-Pedia](https://4apedia.com/index.php?title=Munch_Man)) —
your power-up buffs *you* rather than nerfing *them*. The forced differentiation is
what the market remembered: Munch Man became one of the most popular TI-99/4A titles
([Wikipedia](https://en.wikipedia.org/wiki/Munch_Man)).

**The transferable lesson (A-21):** the constraint classes keep widening — hardware
(rung 2), manufacturing and business model (rung 3), now **law**. A legal constraint
taken seriously generates design the same way a hardware constraint does; the clone
that survived 1982 is the one that stopped being a clone.

*Sourced aside, kin to our own instrument laws:* the title screen hides a `* # *`
cheat that unlocks round/lives selection — and scores earned that way are recorded as
**"Test Score"**, not "Your Score" ([Videogame House](https://www.videogamehouse.net/munchman.html)).
The 1982 cartridge already refused to let test runs masquerade as real runs.

### Finding 2 — you dig your own attack surface (A-22)

Anteater is sourced as Dig Dug-inspired, but it inverts the power relation: you are
not the armed digger clearing monsters — you are **an ant foraging** (colony → surface
food → colony; points only on the round trip), and the anteaters wait *above ground*
where the food is. The pivot: tunnels persist, and **"Anteaters can also access
tunnels in the dirt once they've been created"** ([4A-Pedia](https://4apedia.com/index.php?title=Anteater)).
Every corridor you dig for mobility is a corridor the predator can use to reach you.
Comfort infrastructure and attack surface are the same object.

**The transferable lesson (A-22):** player-built structure is *shared* structure —
whatever you build for your own convenience, you build for the adversary too, and a
design gets depth for free by making the player's past choices into terrain. (Modern
costume: every API you open for yourself is an attack surface; every road in an RTS
carries both armies.)

### Finding 3 — a weapon you aim with time, not space (A-23)

The ant carries **five eggs that explode seconds after the fire button is pressed**,
and the manual teaches the aiming technique outright: the ant out-runs the eater in
tunnels, "so you can adjust your distance for laying the delayed eggs **by retracing
your steps**" ([manual text](https://www.videogamehouse.net/anteater.txt),
[4A-Pedia](https://4apedia.com/index.php?title=Anteater)). The weapon has no direction —
placement, fuse, and your own movement *are* the targeting system. Second
environmental kill: dig under a rock and it falls on the follower.

**The transferable lesson (A-23):** when the weapon is a timer, aim becomes
choreography — the player's movement is the targeting mechanism, and the skill being
tested is prediction, not reflex. This is the tunnel speed asymmetry cashing out:
without the speed edge, kiting is impossible and the eggs are decoration.

### Finding 4 — digital distribution shipped in 1983, twenty years early (A-24)

Romox wasn't just a publisher. Their **ECPC** (Edge Connector Programmable Cartridge)
system — US patent 4,597,058, filed May 9, 1983 — describes a host computer pushing a
program library **over dial-up phone lines** to in-store terminals; the customer picks
a title, the kiosk burns it onto a blank reprogrammable cartridge, **verifies the copy,
and records the transaction so royalties could be billed** ([patent](https://www.freepatentsonline.com/4597058.html)).
One terminal had nine edge-connector slots to serve incompatible machines. That is a
digital storefront: catalogue, network delivery, integrity check, royalty accounting —
in a mall, in 1983.

**The transferable lesson (A-24):** a distribution innovation can precede its
viability window by decades. Being right about the idea is not the same as being right
about the year — the surrounding ecosystem (bandwidth, install base, trust) is part of
the product.

### Open / unverified

- **Munch Man invisible levels (20/40/60) — sources conflict.** [Wikipedia](https://en.wikipedia.org/wiki/Munch_Man):
  maze invisible, *no chains*, eat all the TI logos. [4A-Pedia](https://4apedia.com/index.php?title=Munch_Man):
  "completely invisible, although the chain is completely connected." Our build follows
  Wikipedia's version. **[ASSUMED]**
- **Munch Man energizer "three power levels (high/medium/low), each usable once per
  level"** (4A-Pedia) vs four energizers per level — unclear how these reconcile; the
  manual is scanned images only. v1 ships uniform energizers. **[ASSUMED]**
- **Munch Man maze topology** (wall layout, chain-cell count) and **Hoono AI** beyond
  the sourced traits (red = most intelligent; yellow can vanish briefly; aggression
  and speed rise per level, eventually exceeding the player's) are approximations.
  **[ASSUMED]** Speed "eventually surpassing Munch Man" gets an authored ceiling per A-18.
- **Anteater numbers:** scoring values, egg fuse seconds, eater count beyond set 3,
  and what difficulty 1–9 changes are not in the manual excerpt. **[ASSUMED, tuned by play]**
- **Anteater food items:** manual says four cubes of "food"; the box screenshots say
  "Go get those eggs!" — we render food cubes. **[ASSUMED]**

### Our Suffering Ledger for rung 6

| Constraint | Verdict | Reasoning |
|---|---|---|
| **Munch Man:** chain interlock over the entire maze | **KEEP — the rung's subject** | The lawsuit-forced inversion IS the finding (A-21) |
| **Munch Man:** energizer speeds the player up (not just Hoonos nerfed) | **KEEP exactly** | The second half of the inversion; changing it un-digs the archaeology |
| **Munch Man:** 4 energizers, 10 pts/link, 70 pts/energizer, 100–800 capture ladder, extra life per 10,000 | **KEEP** | Sourced scoring is cheap fidelity |
| **Munch Man:** warp corridors both sides | **KEEP** | Sourced maze feature, teaches wrap topology |
| **Munch Man:** Hoono colour personalities (red smartest, yellow vanishes) | **KEEP** | Sourced behavioural asymmetry — four enemies, four characters (Pac-Man's own deepest idea, legally re-costumed) |
| **Munch Man:** 20 Hoono shape sets across 60 levels | **SKIP v1** | 20 sprite sets is art volume, not design; v1 cycles a smaller set, ramp gets an authored cap (A-18) |
| **Munch Man:** invisible levels 20/40/60 | **KEEP the concept** (reachable via ramp, testable via sim) | A renderer flag that converts the ledger into memory — fog lesson, kin to Wumpus |
| **Munch Man:** `* # *` test mode labelling scores "Test Score" | **KEEP** | It's our own INV-3/INV-14 instrument-honesty law, shipped in 1982 — homage inside the homage |
| **Anteater:** persistent tunnels + eater tunnel access | **KEEP — the rung's second subject** | A-22; the whole game is this rule |
| **Anteater:** ant faster than eater in tunnels | **KEEP** | Without the asymmetry A-23's timing weapon is unusable |
| **Anteater:** five delayed-fuse eggs | **KEEP** | The choreography weapon (A-23) |
| **Anteater:** rocks fall when undermined | **KEEP** | Environmental kill, Dig Dug lineage acknowledged |
| **Anteater:** 4 food round trips per set, extra ant per set, eater count/speed per set | **KEEP** | The sourced risk economy: surface = exposure |
| **Anteater:** difficulty select 1–9 | **SKIP v1** | One authored curve; a start-level picker multiplies the test surface |
| **Anteater:** two-player alternating | **SKIP v1** | Series-wide ruling, same as rungs 2–5 |
| TMS9918A palette, character-grid discipline | **KEEP** | Series constraint since rung 2, and this is the machine's own rung |

---

## Rung 7 — NES (Nintendo, 1985–92) — the governance era

Dug 2026-07-18 evening, before any code — and before the game has a name. The ruling
(Daniel, this session): SMB-class mechanics re-derived from the public record, with
**all expression original** — an Exodus-themed platformer, original title, levels, art,
and characters (legal posture and tone guard in UX-34). Two digs this time: the machine,
and **the gate around the machine**. On this rung the gate is the bigger story — and it
is the reason the theme ruling exists at all.

*(Stamp note, recorded honestly: the rung-6 entries above say "2026-07-19"; the actual
commit clocks read 2026-07-18 afternoon. The drift is noted, not rewritten.)*

### The machine

| | |
|---|---|
| CPU | Ricoh 2A03 — a 6502 core with BCD disabled, ~1.79 MHz, with the APU, rudimentary DMA, and controller polling on the same die ([Wikipedia](https://en.wikipedia.org/wiki/Ricoh_2A03), [NESdev](https://www.nesdev.org/wiki/2A03)) |
| RAM | **2 KB** of CPU SRAM; zero page + stack are architecture-dictated slices of it ([Copetti](https://www.copetti.org/writings/consoles/nes/)) |
| PPU | 256×240 output; 2 KB of video RAM = **two physical nametables**; the background scrolls in 1-pixel steps but all tiles move together ([Famicom Party](https://famicom.party/book/09-theppu/)); 64 sprites, **hard limit 8 per scanline** ([NESdev PPU OAM](https://www.nesdev.org/wiki/PPU_OAM)); colour assigned per **16×16-pixel region** via attribute tables ([NESdev](https://www.nesdev.org/wiki/PPU_attribute_tables)) — the reason NES art looks the way it does |
| Cartridge | NROM — no mapper. Super Mario Bros. is **32 KB PRG + 8 KB CHR = 40 KB total**: engine, 32 levels, all art, all music ([NESdev NROM](https://www.nesdev.org/wiki/NROM), [HN](https://news.ycombinator.com/item?id=21213840)) |
| Sound | APU on the CPU die: 2 pulse channels, triangle, noise, and a DPCM sample channel |
| Lockout | **10NES** — a lock-and-key CIC chip pair; the console refuses any cartridge that can't complete the handshake ([Atari v. Nintendo](https://en.wikipedia.org/wiki/Atari_Games_Corp._v._Nintendo_of_America_Inc.)) |
| The record | **The anti-A-9 machine.** SMB's complete commented disassembly is public ([6502disassembly.com](https://6502disassembly.com/nes-smb/SuperMarioBros.html)) — every physics constant is readable. Breakout's ball speed genuinely doesn't exist; Mario's is a number in a file |

### Finding 1 — the gate: platform governance is a constraint class (A-25)

The NES is the first machine in our ladder with a **gatekeeper burned into the silicon**.
The 10NES chip pair meant Nintendo, not the market, decided who could ship a cartridge —
backed by a licensing regime (fees, content rules, quantity control). What happened at
the gate is the whole era in miniature:

- **Tengen (Atari Games)** couldn't reverse-engineer the chip, so its lawyers obtained
  the 10NES source from the **US Copyright Office by falsely claiming pending
  litigation**, and built the "Rabbit" chip from it — producing signals indistinguishable
  from the real key. The Federal Circuit held that the ill-gotten copy poisoned their
  fair-use defence; Atari settled and paid ([case](https://en.wikipedia.org/wiki/Atari_Games_Corp._v._Nintendo_of_America_Inc.),
  [MIT Press Reader](https://thereader.mitpress.mit.edu/how-nintendo-bled-atari-games-to-death/)).
- **Color Dreams** defeated the chip *legally* — a voltage spike at power-on stuns it —
  so Nintendo's enforcement **migrated to the retail layer**: pressure on stores that
  stocked unlicensed carts ([Wikipedia](https://en.wikipedia.org/wiki/Wisdom_Tree)).
- Color Dreams' answer, 1990: **Wisdom Tree** — Christian games sold through
  **Christian bookstores**, a channel Nintendo had no leverage over. Bible Adventures
  sold ~**350,000 copies** there ([Wikipedia](https://en.wikipedia.org/wiki/Bible_Adventures)).

**The transferable lesson (A-25):** a gate does not eliminate the market it excludes —
it **reroutes** it. Enforcement migrates to whatever layer is cheapest to pressure (the
courtroom, the retail buyer), and the excluded market forms exactly where that pressure
cannot reach. The constraint-class ladder completes: hardware (rung 2) → manufacturing
(3) → business model (3/4) → law (6) → **platform governance** (7). We still live under
this one's descendants: every app store is a 10NES with a legal department.

### Finding 2 — 40 KB: levels are object streams, and the camera guards the encoding (A-26)

SMB's level data is not a tile grid. It is a stream of **~2-byte objects**: 4-bit X and
4-bit Y on a 16×16 grid (page-relative), a 7-bit object type, and a 1-bit new-page flag
([NESdev forum](https://forums.nesdev.org/viewtopic.php?t=16220),
[Matt's Ramblings](https://matthewearl.github.io/2018/06/28/smb-level-extractor/)).
Levels are decoded forward as the camera advances and **discarded behind it** — and the
famous forward-only camera is what makes stream-and-discard safe: nothing behind you can
ever need rebuilding. (That the memory budget *motivated* the camera rule is not on
record from the designers — the coupling is structural, and tagged **[ASSUMED as motive,
verified as mechanism]**.)

*Sourced aside — what living at this seam cost:* the **Minus World**. A wall-clip (a
physics edge case) reaches the 1-2 warp zone before the trigger scroll initializes its
pipe-destination data, so the pipes read the **stale default table (36-5-36)** and send
the player to a world that was never authored ([Wikipedia](https://en.wikipedia.org/wiki/Minus_World),
[Mario Wiki](https://www.mariowiki.com/Minus_World)). The most famous glitch in video
games is **two half-bugs composing**: an initialization-order assumption made reachable
by a collision edge case.

**The transferable lesson (A-26):** when memory forces an encoding, the encoding writes
design rules — and every assumption it makes ("this data is initialized," "that region
is gone") sits one physics edge case away from being player-observable. The positive
half matters just as much: the 2-byte vocabulary made levels **cheap to author** — 32
levels fit in the corner of 40 KB because the vocabulary existed. An encoding is a
level-design *language*, and our scarce resource (authoring time, not ROM) wants the
same language.

### Finding 3 — game feel is a table of numbers (A-27)

Mario's position runs at **16 subpixels per pixel** — fixed-point arithmetic on a chip
with no floating point and no multiply instruction ([TASVideos](https://tasvideos.org/GameResources/NES/SuperMarioBros),
[subpixel explainer](http://hcfyk.blogspot.com/2019/09/what-is-subpixel-in-super-mario-bros.html)).
jdaster64's read of the code found **gravity that is piecewise velocity-dependent AND
keyed to whether A is held** ([Physics Factbook](https://hypertextbook.com/facts/2007/mariogravity.shtml)) —
the entire celebrated "feel" (momentum, skid, air control, variable jump) is a **small
table of constants**, every one of them readable today in the public disassembly. Even
the wall-ejection rule (pushed out opposite to your steering) is documented behaviour.

**The transferable lesson (A-27):** "game feel" is authored numbers — deterministic,
transcribable, testable — not emergent magic. The corollary is ours: fixed timestep and
fixed-point-style arithmetic aren't retro cosplay, they are **what makes feel
reproducible** — and therefore simmable. Floats plus variable dt make feel a moving
target; INV-20 already caught the first symptom one rung early.

### Finding 4 — input is a measurement, not a fact (A-28)

On the NTSC NES, the DPCM sample channel's DMA can collide with a controller read: the
pad's shift register sees an extra clock edge, **drops a bit, and reports a phantom
press** — most often a spurious RIGHT. The standard fix in shipped games: **read the
controller repeatedly until two reads agree**
([NESdev](https://www.nesdev.org/wiki/Controller_reading)). The console's own hardware
made input untrustworthy, and every game with sampled drums silently voted on the
workaround.

**The transferable lesson (A-28):** at a noisy boundary, the read is not the value —
verification belongs *at the boundary*, once, not scattered through the logic. Modern
costume: debouncing, networked input, any sensor. Our version: browser input (touch,
key ghosting, backgrounded-tab throttling — rung 6's testing note already paid this
toll) flows through one verified chokepoint.

### Finding 5 — theme selects who shows up; mechanics decide whether they stay (A-29)

Wisdom Tree's catalogue was **mechanically borrowed** — Bible Adventures is an SMB2-style
engine reskinned with Noah, Baby Moses, and David & Goliath, built fast by a secular
studio and widely panned as craft ([Wikipedia](https://en.wikipedia.org/wiki/Bible_Adventures),
[Game Developer](https://www.gamedeveloper.com/production/wisdom-tree-lazy-uninspired-corporate-strategy-at-its-finest)).
It sold 350,000 copies anyway, because the audience was **real and unserved**. The theme
was a genuine distribution innovation (A-25); the craft debt was real too, and it is
what the games are remembered for.

**The transferable lesson (A-29):** an underserved audience forgives craft debt exactly
once. Theme opens the door; mechanics keep people in the room. **This rung's thesis is
the inversion:** six rungs of earned craft first, theme last — finish what they were too
ill-funded to start properly.

### Open / unverified

- **Exact SMB physics constants.** The sources exist (jdaster64's table; the full
  disassembly) but the values are **not yet transcribed** into this repo. Until the
  transcription pass, any specific speed/gravity number is **[ASSUMED]**. Transcription
  is a SCOPE task, not a research gap.
- **Forward-only camera motive.** Mechanism verified (stream-and-discard); designer
  intent **[ASSUMED]** — no primary testimony found.
- **NES palette RGB values.** The PPU generated analog NTSC signal directly; every RGB
  palette is a reconstruction — **kin of A-9**. We will pick one published palette and
  tag it [ASSUMED].
- **"No coyote time / jump buffering in 1985."** Community consensus, not yet verified
  against the disassembly. **[ASSUMED until the transcription pass].**

### Our Suffering Ledger for rung 7

| Constraint | Verdict | Reasoning |
|---|---|---|
| Subpixel fixed-point physics, fixed timestep | **KEEP — the rung's technical heart** | A-27: feel that can be transcribed, verified, and simmed. Floats with variable dt is how feel drifts (INV-20) |
| SMB's documented physics values as the starting table | **KEEP (once transcribed)** | The best-documented feel in game history; start from the master's numbers, retune for our game, record every divergence |
| Object-stream level encoding (compact typed objects, not tile grids) | **KEEP** | A-26: the encoding is the level-design language, and it keeps authoring cheap — our scarce resource is authoring time, not ROM |
| Forward-only camera | **KEEP for Phase 1** | The 1985 rule; teaches the streaming discipline. Re-pick if an Exodus set-piece genuinely needs backtracking |
| NES palette + colour in 16×16 attribute regions | **KEEP** | The machine's own look on the machine's own rung (UX-29 precedent). The attribute constraint is what makes art read "NES" |
| D-pad + two buttons; run is a **held** button | **KEEP** | The 1985 control vocabulary; held-B-to-run is load-bearing in the physics table |
| APU-style audio (2 pulse + triangle + noise) | **KEEP the result** via WebAudio synthesis | Series ruling since rung 2: the sound matters, the silicon doesn't |
| 8 sprites per scanline / flicker | **SKIP** | Tedium without a lesson for us; nothing in this design needs flicker as an overload telegraph. Recorded, not reproduced |
| vblank cycle budget | **SKIP the cycles, KEEP a frame budget** | The discipline transfers as a measured frame-cost ceiling (rung 4 measured 0.93 ms; this rung will be heavier) |
| Mappers / bank switching | **SKIP** | SMB itself is NROM — even the original didn't need one |
| 6502 assembly | **SKIP** | Teaches 1985 toolchains, not game design (series ruling) |
| 10NES lockout | **SKIP the chip, KEEP the finding** | A-25 is the trove entry — and we ship through its descendants (Pages today, app stores someday) with eyes open |
| DPCM controller-read bug | **SKIP the bug, KEEP the scar** | Input verification at the boundary (A-28): one chokepoint reads input, everything else trusts it |
| Coyote time / jump buffering (modern grace windows) | **INVERTED — 1985 had none** | Ship strict first; the family playtest decides. If added, it's a declared anachronism with tuned ms on the record (A-12 precedent) |

---

## Rung 8 — ALPINER (Texas Instruments, 1982)

*Dug 2026-07-19, before any code. Rung chosen by Daniel's brother on a family holiday,
which overrides the 2026-07-18 back-burner ruling ("diminishing trove returns" — the
worry that a third TI-99/4A game teaches less than the first two). **The worry was
wrong, and why it was wrong is this rung's finding: Alpiner does not confirm A-19, it
complicates it.** A third game on one machine was the only way to catch that, because
the contradiction only appears when two games on the same platform make opposite bets
with the same peripheral.*

**Primary source obtained:** the original TI Alpiner manual, full text (archive.org
item `AlpinerManual`). Where the manual speaks it is authoritative here; secondary
sources are named at the point of claim, and the open questions below are genuinely
open rather than softened.

**Programmed by Janet Srimushnam** (manual credits page; corroborated by Wikipedia,
4apedia, videogamehouse). Voices by Aubree Anderson and Cliff Easthom. Published Q4
1982, part no. PHM 3056, $39.95. **No preserved interview with Srimushnam was found**
— every statement of design *intent* below is inference from the artifact, not
testimony, and is tagged as such. Alpiner appears to be her only industry credit
[ASSUMED — single-source].

### The peripheral problem (the finding)

Rung 5 read Parsec's speech and earned **A-19**: a new output channel earns its keep
when it carries information the busy channel would drop. Alpiner uses the *same
optional peripheral* on the *same machine* and cannot have made that trade — and the
manual says why in its own words: Alpiner is **"designed to work with or without the
Texas Instruments Solid State Speech Synthesizer (sold separately)."**

That sentence is a design constraint with teeth. The synthesizer was sold separately,
so the cartridge had to be a complete and fair game for every owner without one.
**Any warning the speech carried that the screen did not therefore had to be
redundant**, or the silent majority was quietly playing a harder game than the box
advertised. The publisher's own copy braids three functions — "warning you of
approaching obstacles, commenting on your performance, and congratulating you for
obtaining bonus points" — but only the first is actionable, and it is precisely the
one that cannot be allowed to matter.

What the peripheral uniquely delivered was **affect**: a sarcastic female voice
("Good move, sport." on a fall; "Yuck!" on a skunk spray) against an encouraging male
one ("Onward and upward"). The reviewer record is the tell — players remember being
*taunted*, not *warned*. One review's reaction to the sarcasm: **"you want to go back
and show her by conquering that mountain."** The accessory sold retention through
antagonism, not advantage.

**Honest limit, and it is the crux:** no source establishes the *timing* of a spoken
warning relative to the hazard becoming visible. Fired before the sprite enters the
screen, it is a real information channel; fired simultaneously, it is decoration with
a functional veneer. [ASSUMED: redundant, because graceful degradation forces it.
Resolvable only by frame-accurate emulator capture comparing audio onset to the
hazard's first visible frame — not done. **A-30 rests on the design economics, which
are sourced, not on the timing, which is not.**]

### The inverted timer

The manual, verbatim: **"Time allotted for your climb is not counted down except when
the Alpiner is not moving."** The clock runs *only while you stand still*.

Not a quirk — a fix for a problem the genre creates. In a climbing game the correct
play is often to **wait**: let the rockslide pass, let the ram go by. A conventional
countdown punishes exactly that, so the game would teach patience with one hand and
tax it with the other. Decoupling the clock from real time makes patience free and
**hesitation** expensive: wait out a hazard as long as you like, but dithering about
where to go costs you. [Mechanic VERIFIED: manual. Rationale ASSUMED — mine; no
designer statement exists.]

### The shape of the climb

Six mountains, ordered strictly by real elevation: **Hood (3,427 m) → Matterhorn
(4,477) → Kenya (5,193) → McKinley (6,194) → Garmo (7,495) → Everest (8,848)**, across
18 levels in 3 rounds. Eleven obstacles with sourced step penalties (stump 2, skunk 2
plus 2 more for the spray, snake 3, bat 5, brush fire 5, bear 6, mountain lion 7,
vulture 8, ram 9) and the **Abominable Snowman on skis**, who costs no steps at all —
he "sends you crashing to the bottom of the mountain." Falling hazards escalate by
round: rockslides throughout, avalanches from level 7, icefalls from level 13. You
ascend **46 metres per upward step**; the screen wraps left-to-right, so the mountain
is a cylinder. Four Alpiners to start, one more per completed round.

**The layout question, and it changes the design:** one source states mountain layouts
are **randomly generated each play** [ASSUMED — single-source, absent from the manual].
If true, Alpiner is a hybrid: an *authored* difficulty curve (six named peaks, fixed
order, hazard classes unlocked at levels 7 and 13) wrapped around a *randomised*
layout inside each climb. More interesting than either pure model, because neither
half has to do the other's job — named peaks supply legibility and pacing,
randomisation supplies replay.

**Unresolved and load-bearing:** whether the display scrolls, flips screens, or shows
a whole mountain at once. **46 m/step against Everest's 8,848 m implies ~192 upward
steps**, which cannot fit in 24 character rows — so the view must advance somehow, and
no source says how. Our build makes an authored call (UX_DECISIONS) rather than
guessing at TI's; the arithmetic is on the record so the call can be re-picked when
someone watches a real Everest climb in an emulator.

### Suffering Ledger — rung 8

| Constraint | Verdict | Reasoning |
|---|---|---|
| Optional speech peripheral, game complete without it | **KEEP — the rung's thesis** | A-30. Our speech must be strictly redundant; muting must never make the game harder, and that is machine-checkable |
| Timer runs only while stationary | **KEEP** | A-31. The mechanic that makes waiting out a hazard a real strategy instead of a punished one |
| Named fixed peak order + randomised layout within a climb | **KEEP** | A-32. Authored curve, procedural detail — and randomisation is what makes a climbing game bear replay |
| Wrap-around screen (mountain as cylinder) | **KEEP** | Sourced, cheap, and it changes routing: there is always a way around, at a step cost |
| 46 m per step, real elevations | **KEEP** | Free legibility — the summit number means something, and six named peaks are a difficulty curve the player can say out loud |
| Step-penalty table (knock-downs graded by hazard) | **KEEP** | The graduated cost IS the difficulty texture; binary die/don't-die flattens eleven hazards into one |
| Cascading fall to the bottom = lose a climber | **KEEP** | The Snowman needs a punishment class of his own or he is just an expensive ram |
| TMS9918A 15-colour palette | **KEEP** | Series constraint since rung 5; the machine's own look on the machine's own rung |
| 4 sprites per scanline / flicker multiplexing | **SKIP the limit, KEEP the finding** | A-33 is the trove entry; reproducing flicker is tedium without a lesson (rung 7 precedent) |
| Monochrome one-colour sprites | **SKIP** | Recorded as the reason 1982 hazard art looks flat; nothing in our design needs the restriction |
| 256-byte CPU scratchpad / GROM serial addressing | **SKIP the mechanism, KEEP A-17** | Already earned on rung 5; re-paying it teaches nothing new |
| Speech as LPC data in the cartridge | **SKIP the silicon, KEEP the result** | Series ruling since rung 2 — the sound matters, the chip doesn't |
| Two-player alternating turns on one mountain | **SKIP (v1)** | Sources disagree (manual "for his or her turn" vs 4apedia "simultaneous"); unresolved, and out of scope either way |
| `*#*` Test mode (1–9 lives, levels 1–18) | **KEEP** | Sourced debug entry point and the sim's honest level-jump path — rung-6 precedent (TI's own instrument-honesty law) |

### Open questions — rung 8

*The web record on Alpiner is thin past this point; all of these want an emulator
session, not more searching.*

1. **Does the display scroll, flip screens, or show the mountain at once?** The most
   load-bearing gap. The 46 m/step arithmetic contradicts a single-screen reading and
   nothing addresses it directly.
2. **Is the spoken warning anticipatory or simultaneous?** The crux of A-30 vs A-19.
   Unstated everywhere.
3. **What happens after level 18** — ending, loop, or endless at max difficulty. Manual
   silent, no secondary source.
4. **The complete speech phrase list.** ~5 fragments recovered, none from the manual;
   one ("Did you mean to do that?") is an admitted paraphrase.
5. **Which mountain introduces which hazard.** 4apedia asserts elevation-band grouping;
   unconfirmed against the manual.
6. **Are layouts truly randomised per play?** Single-source. Materially changes A-32.
7. **How target bonuses (bear 500 / lion 750 / ram 1000) are triggered** — collision, or
   a separate aim action? Unexplained in every source found.
8. **Is the climber a sprite or a background character**, and does Alpiner multiplex
   sprites? Inferred from the jerky/smooth split and reported flicker; not confirmed.
9. **Any designer statement from Janet Srimushnam.** None located.
10. **Two-player: alternating or simultaneous?** Manual and 4apedia disagree.

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
| A-17 | Memory topology beats memory size — the fast region is always small, and what you promote into it is the design decision | 5 | TI-99/4A: 256 bytes of true CPU RAM; Parsec's scroll routine hand-carried into the scratchpad |
| A-18 | An unexamined numeric limit eventually becomes gameplay; every ramp needs an authored ceiling or its real ceiling is whatever overflows first | 5 | Parsec's endgame wall is signed 8-bit sprite velocity wrapping at +127 |
| A-19 | A new output channel earns its keep when it carries information the busy channel would drop — voice that replaces a glance is bandwidth, voice that duplicates the screen is decoration | 5 | Parsec's in-game speech: wave warnings and fuel alerts while the eyes stay on the fight |
| A-20 | The rendering technology lobbies silently for shapes it draws natively; when a port changes a game's topology, look for the display in the room | 5 | Yob's anti-grid dodecahedron (1973) became a wrapping grid on a character-cell display (1980) |
| A-21 | Legal constraints generate design like hardware constraints do — the clone that survived 1982 is the one the lawsuit forced to stop being a clone | 6 | Munch Man: 1981 prototype had dots; K.C. Munchkin injunction (Mar 2, 1982); dots became chain, pills became TI logos |
| A-22 | Player-built structure is shared structure — whatever you build for your own mobility, you build for the adversary too | 6 | Anteater: eaters use the tunnels you dug; comfort infrastructure = attack surface |
| A-23 | When the weapon is a timer, aim becomes choreography — the player's movement is the targeting system, and the skill tested is prediction | 6 | Anteater: delayed-fuse eggs aimed by retracing steps, priced by the tunnel speed asymmetry |
| A-24 | A distribution innovation can precede its viability window by decades; the surrounding ecosystem is part of the product | 6 | Romox ECPC: dial-up game delivery to cartridge-burning mall kiosks with royalty accounting, patented 1983 |
| A-25 | A gate doesn't eliminate the market it excludes — it reroutes it. Enforcement migrates to the cheapest layer to pressure, and the excluded market forms exactly where that pressure can't reach | 7 | 10NES → Tengen's Copyright-Office fraud, Color Dreams' voltage spike, Wisdom Tree's Christian-bookstore channel (350k carts) |
| A-26 | When memory forces an encoding, the encoding writes the design rules — and every assumption it makes is one physics edge case from player-observable. The same encoding is a level-design language that makes authoring cheap | 7 | SMB's 2-byte level objects + forward-only camera; the Minus World is a stale-default read behind a wall-clip |
| A-27 | Game feel is a table of numbers — authored, deterministic, transcribable, testable. Fixed timestep and fixed point are what make feel reproducible | 7 | 16 subpixels/px on a chip with no multiply; gravity piecewise on velocity and keyed to a held button |
| A-28 | At a noisy boundary the read is not the value — input is a measurement, and verification belongs at the boundary, once | 7 | NTSC DPCM DMA double-clocks the pad register into phantom RIGHT presses; shipped games read twice and compare |
| A-29 | Theme selects who shows up; mechanics decide whether they stay — an underserved audience forgives craft debt exactly once | 7 | Bible Adventures: SMB2-engine reskin, 350k sold through the channel the gate couldn't reach, remembered for its craft debt |
| A-30 | **An optional peripheral forces its own channel to be redundant.** If the accessory is sold separately, the base game must be complete without it — so the add-on cannot carry load-bearing information, and what it actually sells is *affect*, not advantage. **Complicates A-19: whether a channel may carry unique information is decided by the business model, not the bandwidth** | 8 | Alpiner "designed to work with or without" the speech synthesizer; players remember the sarcasm ("Good move, sport."), not the warnings |
| A-31 | Decouple the clock from real time and you can price *hesitation* instead of *slowness* — when the correct play is sometimes to wait, a conventional countdown taxes the very patience the design is teaching | 8 | Alpiner's timer counts down only while the climber is standing still |
| A-32 | An authored curve wrapped around a randomised layout lets each supply what the other can't — named fixed stages give legibility and pacing, procedural detail gives replay, and neither has to do the other's job | 8 | Six real peaks in fixed elevation order, hazard classes unlocked at levels 7 and 13, layouts generated per play [ASSUMED — single-source] |
| A-33 | Motion smoothness advertises which layer an object lives on — a jerky background against smooth hazards is not bad animation, it is the tile/sprite split made visible, and players read it as a style | 8 | TMS9918A: cell-quantised terrain moving in 8px jumps while skunks and falling rocks move per-pixel as sprites |
