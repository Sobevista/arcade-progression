# UI/UX Decision Map — map first, then choose

*Sibling to `INVARIANTS.md`. Same progression, different kind of knowledge.*

---

## The routing rule (read this before adding anything)

Every lesson goes to exactly one file. The test is one question:

> **Would violating this be wrong in every game, on every platform, for every audience —
> regardless of taste?**

- **Yes → `INVARIANTS.md`.** It's a law. Binary. Breaking it is a bug.
- **No → here.** It's a choice with tradeoffs. There is no correct answer, only a
  chosen one, its cost, and the condition that would make us choose differently.
- **It's a fact about the original machine, its economics, or its era → `ARCHAEOLOGY.md`.**
  That file holds *why the choice existed at all*, and the Suffering Ledger deciding
  which historical constraints we keep on purpose.

Why the split is load-bearing: a taste call filed as law gets obeyed by future-you
without the reasoning, forever. A law filed as taste gets *negotiated with* at 2am
when it's inconvenient. Both failures are silent.

**Consequence for this file:** every entry carries a **re-pick trigger** — the
specific condition under which the choice should be revisited. A decision without a
re-pick trigger is just an opinion that got lucky.

---

## The map — the dimensions that exist, before what we picked

*Map the space first. You cannot choose well among options you never listed.*

| Dimension | The options | What each costs |
|---|---|---|
| **Resolution** | native-era fixed · fixed + integer scale · fluid/responsive | authenticity ↔ screen fill; fluid breaks pixel grids |
| **Palette** | era-accurate · modern accessible · free choice | constraint drives style ↔ contrast/legibility risk |
| **Fire rate** | one shot on screen · N shots · free-fire/auto | deliberation & tension ↔ modern players read scarcity as lag |
| **Hitbox** | pixel-exact · sprite AABB · forgiving (shrunk player box) | fairness feel; exact player boxes feel cheap to lose to |
| **Death pacing** | instant respawn · pause + explosion · full stop | rhythm & weight ↔ momentum loss |
| **Difficulty curve** | linear ramp · exponential · plateau-and-spike | dread ↔ wall |
| **Touch input** | on-screen buttons · drag-to-move · tilt · tap-to-position | precision ↔ occlusion (thumbs cover the playfield) |
| **Audio** | none · SFX only · SFX + music bed | arcade feel is ~half sound ↔ autoplay policy, asset weight |
| **Juice** | none · shake/particles/flash · heavy | impact ↔ noise, readability, motion sensitivity |
| **HUD** | corners · single bar · diegetic | glanceability ↔ playfield real estate |
| **Framing text** | in-world only · meta/dev language visible · none | context for a build-in-public audience ↔ breaks the artifact |
| **Onboarding** | none (arcade) · hint line · tutorial | purity ↔ bounce rate for people who never saw a cabinet |

---

## Rung 2 — what was chosen, and why

| # | Decision | Chose | Reasoning | Re-pick trigger |
|---|---|---|---|---|
| UX-1 | Resolution | 224×256, integer-scaled | The real 1978 res. Integer scaling keeps the pixel grid honest (INV-7) | If mobile portrait wastes >40% of screen |
| UX-2 | Palette | TI-99/4A (TMS9918A) | Constraint as forcing function + the homage lives here, not in text | If any pair fails contrast on a phone in daylight |
| UX-3 | Fire rate | One shot on screen | Authentic; makes every trigger pull a decision | **Watch this one.** If playtesters read it as input lag, it's costing more than it buys |
| UX-4 | Player hitbox | Full sprite AABB | Simple, matches the era | If deaths feel unearned — shrink the player box, never the enemy's |
| UX-5 | Death pacing | 900 ms pause + explosion | Gives the loss weight; classic rhythm | If restart-to-play loop feels sluggish in testing |
| UX-6 | Difficulty | Linear 560 ms → 40 ms + 0.88^wave | Faithful to the hardware accident (INV-8) | If wave 4+ is unwinnable rather than tense |
| UX-7 | Touch | 3 on-screen buttons | Predictable, no gesture learning | If thumbs occlude the playfield — drag-to-move is likely better here |
| UX-8 | Audio | **None** | Deferred to Phase 4 | Immediately, if the feel verdict is "it's dead" — this is the top suspect |
| UX-9 | Juice | None beyond explosion sprites | Phase 1 is mechanics; juice on broken mechanics is lipstick | After feel verdict |
| UX-10 | HUD | Score TL, hi-score TR, wave under hi | Glanceable, out of the play column | If wave text distracts during late waves |
| UX-11 | Framing text | "RUNG 2 OF THE PROGRESSION" on title | Build-in-public context — the b4him thesis is *show the homework* | **If this ships to strangers as a game rather than as a lesson, cut it** |
| UX-12 | Onboarding | One hint line, arcade-style | Respects the genre; low cost | If new players don't discover fire |

---

## Playtest 1 — Daniel, 2026-07-18 (the outside witness)

The first run where someone who wasn't the author touched it. Five findings; four
were fixed the same session, one was locked as correct-as-is.

| Finding | Verdict | Action |
|---|---|---|
| "I don't know how to get back to the start screen" | **Real gap** — no in-game exit existed at all | `ESC` added, plus a TITLE button for touch. Exiting banks your score to the high score rather than dropping it |
| "I like the authenticity, it keeps you wishing you had faster shots — it's about timing, keep it" | **UX-3 CONFIRMED — locked** | Re-pick trigger removed. This is now settled design, not an open question |
| "Spaceships are too frequent, they should not be constant" | **Real** — was 1.2–3.0 s between passes; it was wallpaper | Now 18–29 s to the first, 20–31 s between. Verified: 6 sampled gaps all ≥20 s |
| "With no sound it is fun, but collision noises would help" | **Real** | Full synthesised SFX added — shoot, hit, death, UFO warble, wave clear, and the four-note descending march bass. Zero assets, still one file. `M` / SOUND button mutes |
| "Is it normal that the bunkers do not rebuild between levels?" | **Real bug — and I was wrong about the original** | Checked the source instead of trusting memory: the 1978 arcade **does** repair the bases between waves. Now repaired on a new rack, still permanently chewed within one. See INV-10 |

**Bonus finding from the same source check:** the original also starts each new wave's
formation **lower down the screen** — that descending start line is the real late-game
difficulty curve, and it was missing entirely. Added: 40 px at wave 1 → 76 px by wave 7,
then capped so it can never start on top of the player.

## Playtest 2 — Daniel, 2026-07-18

| Finding | Verdict | Action |
|---|---|---|
| *"Why does it say RUNG 2 OF THE PROGRESSION?"* | **UX-11 re-pick trigger fired.** The trigger was written as *"if this ships to strangers as a game rather than as a lesson, cut it"* — his kids are about to play it. Internal project vocabulary on a player's screen, meaningless to the player | **Cut.** Title is now `INVADERS` + the palette credit. The build-in-public context belongs in the README and the site, not in the artifact |
| *"The greyed ESC line is redundant and obnoxious"* | **Correct — my sloppiness.** I added a hint line to the title screen without noticing the persistent hint bar already carried it. Two homes for one fact | **Cut.** Hint bar is the single home |
| Sound: good. Ship: good | **Confirmed** | UX-8 and UX-4 locked |
| *"Didn't get to the bonus spaceship level"* | **Terminology gap, mine.** The mystery ship (red saucer) exists and appears every 20–30 s. *Bonus stages* do not exist — that's a Galaga structure | Clarified in README under "Not in this build" |

**Lesson that generalises:** both cuts were the same failure — **one fact, two homes.** That's
already law in the harness (`START_HERE.md` anti-drift rule) and I broke it twice inside one
title screen. Not filed as a new invariant because it's an existing one arriving in a new
costume; noted here so the next build recognises the shape.

**Queued, not forgotten:** *"do not forget the bonus laps as you progress stages"* —
challenging/bonus stages. That's Galaga's structure (rung 3), where a no-fire-back bonus
round breaks the tension rhythm between waves. Logged against rung 3, not this build.

---

## Rung 3 — Breakout — decisions and one open call

| # | Decision | Chose | Reasoning | Re-pick trigger |
|---|---|---|---|---|
| UX-13 | Difficulty curve | The exact 1976 rules — 4 hits, 12 hits, orange, red | It was *authored*, and reproducing an authored curve is the point of the rung | If playtest says the jumps feel arbitrary rather than escalating |
| UX-14 | Paddle angle | Continuous contact-point mapping, ±60° | Sources confirm the mechanic but **not** the original's segment count. Continuous is honest; a fabricated zone count would be fake fidelity | If a source turns up documenting discrete zones |
| UX-15 | Curve made visible | Speed pips, bottom right | The authored curve is this rung's whole lesson; hiding it wastes it | If it reads as clutter |
| UX-16 | Scope discipline | **No mechanic that wasn't in the 1976 circuit** | Their chip count enforced restraint; our marginal cost is zero, so it must be a written rule (ARCHAEOLOGY A-5) | Never, without an explicit ledger entry |

### UX-17 — orange band legibility — RESOLVED 2026-07-18 [DANIEL]

**Ruling:** *"We have the ability to make them distinguishable here which is a UX issue
not a strict necessity."* Legibility wins. Orange moved from `lightRed` (salmon) to
`darkYellow` (gold).

**Measured, not eyeballed** — RGB distance between the red and orange bands:

| | red ↔ orange | verdict |
|---|---|---|
| Before (`lightRed`) | **51** | too close; the bands blurred into one |
| After (`darkYellow`) | **115** | clearly separable |

Adjacent-band distances after the change: red↔orange **115**, orange↔green **180**,
green↔yellow **207**. No two *adjacent* bands are confusable. Gold and the pale yellow
band are the closest pair overall but green sits between them, so it never matters.

**The principle worth keeping:** a constraint adopted for authenticity stops being worth
holding the moment it destroys information the design depends on. The 1/3/5/7 scoring is
a *risk gradient* — the player is supposed to see that the valuable bricks are the hard
ones. A palette that hides the gradient isn't fidelity, it's a bug wearing a costume.

**REVISED AGAIN — playtest 2, 2026-07-18.** Gold wasn't enough either. Daniel: *"it makes
lines 1 and 3 do funky things to me while playing... Lets make one of the rows blue? We
can so I feel we should."*

My 115 was a real number measuring the wrong thing — two swatches compared at rest, when
the actual task is reading bands in peripheral vision while tracking a fast ball. Became
**INV-13**. Orange band moved to `darkBlue`, a different hue family entirely:

| Pairing | Distance |
|---|---|
| red ↔ blue | **227** |
| blue ↔ green | **212** |
| green ↔ yellow | **207** |
| cyan paddle ↔ blue bricks | 151 (paddle is 130 px away at the opposite end) |

Every adjacent pair now above 200. **Fidelity cost, taken deliberately and recorded:** the
1976 band was orange, ours is blue. The 1/3/5/7 gradient being legible matters more than
the hue being right — same reasoning as A-10, applied twice.

### UX-18 — ball speed curve — REVISED 2026-07-18 after playtest

Daniel: *"seems a bit fast for wall 1... I would like the reference."*

**There is no reference, and the reason is structural.** Breakout has no processor, so
there is no ROM, so it is **absent from MAME** and must be *simulated* rather than
emulated. Nobody can read the original's ball speed out of a binary — anyone quoting a
pixels-per-frame figure is reconstructing it. Tagged **[ASSUMED]** in the source.

What we could do is measure ours against the era norm of roughly 1–2 px/frame for
discrete-logic games. Wall 1 was opening at **1.92 px/frame** — the very top of that
range. Wall 1 was starting where the era's ceiling was.

| Step | Before | After | Trigger |
|---|---|---|---|
| 0 | 1.92 px/f | **1.42** | serve |
| 1 | 2.33 | 1.83 | 4 hits |
| 2 | 2.75 | 2.33 | 12 hits |
| 3 | 3.25 | 2.92 | orange row |
| 4 | 3.75 | 3.58 | red row |

Top/start ratio widened from **1.96× to 2.53×**. Lower floor, similar ceiling — the
escalation is the authored feature of this rung, so it should be *felt*, not merely
measured. Re-verified after the change: all four triggers fire, no tunnelling at the new
top speed, 61 fps.

**Re-pick trigger:** if a credible circuit-level reconstruction of the original timing
ever surfaces, this table gets replaced by it and the [ASSUMED] tag comes off.

**REVISED AGAIN — playtest 2, 2026-07-18.** Daniel, who is not a beginner: *"I cannot make
it past level 1 without dying. That would make a lot of people quit soon after... I think
the initial speed is good, I think the progressive increase is gapped too wide. It is like
lightning on level 1 when I get to the last row."*

The floor was right; the **jumps** were wrong. Each step was ~25%, compounding to 2.53×
across a single wall — and since the orange and red triggers fire as soon as the ball
reaches those rows, top speed arrived early in wall 1 rather than late in the game.

| Step | Playtest 1 | Now | Jump |
|---|---|---|---|
| 0 | 1.42 px/f | **1.42** | — (confirmed good) |
| 1 | 1.83 | **1.60** | +12.9% |
| 2 | 2.33 | **1.80** | +12.5% |
| 3 | 2.92 | **2.02** | +12.0% |
| 4 | 3.58 | **2.28** | +13.2% |

Total ratio **2.53× → 1.61×**. Four distinct steps are still felt, but the top is now
catchable instead of a wall.

### UX-19 — speed curve resets on a new ball — NEW 2026-07-18

Daniel asked directly whether the ball should slow down again after a death. **No source
either way** (A-9 — no ROM to read), so this is a design call, not a fidelity one.

**Chosen: the curve fully resets on a new ball** — speed step, hit count, and the
orange/red row flags, so the escalation genuinely replays.

Reasoning: without it, losing a ball at top speed hands you every remaining ball already
at maximum difficulty. The game gets harder exactly when you are least equipped and there
is no route back — a death spiral, and the most likely explanation for "a lot of people
would quit."

**What deliberately does NOT reset: the halved paddle.** That one *is* documented as the
punishment for breaking through, and it persists for the rest of the wall.

### UX-21 — HUD labels — FIXED 2026-07-18

Daniel: *"There should be titles under the blue dots in the lower left that I think
represents lives and in the lower right idk what the red dots with 5 there represents."*

He was **guessing** at one and had no idea about the other. Unlabelled iconography is a
quiz. Added `BALLS` and `SPEED` labels, plus `BRICKS nnn` and `WALL n/2` up top.

**Rule going forward:** if a HUD element needs explaining, it needs a label. Retro
aesthetic is not a licence to hide state — the originals had physical cabinet artwork,
instruction cards and an attract mode doing that job, none of which survive a port to a
web page. Losing the cabinet means the screen has to carry what the cabinet used to.

### UX-22 — brick count: 112 or fewer? — RESEARCHED 2026-07-18, awaiting Daniel

Daniel asked whether 112 bricks is too many for modern patience, and asked for a
cross-reference against research rather than a vibe.

**The premise turns out to be wrong in an interesting way.** Archaeology Finding 5: a
1976 arcade credit was engineered to end in **~180 seconds**. Breakout ships exactly two
walls, 448 points each, max 896. **Most players never cleared a single wall** — 896 was
legendary, not expected. The wall was never a completion target; it was a *score
reservoir* you were supposed to fail at, interestingly, for a quarter.

So "112 bricks is too many to clear" measures the game against a goal it never had.

**Modern research, the other half of the cross-reference:**

- Casual mobile session lengths: top-quartile games ~**7 min**, mid ~**4 min**, low ~**3 min**.
  A 112-brick wall sits inside that envelope — length is not obviously the problem.
- Early-session behaviour in the first 72 hours predicts long-term retention better than
  any single retention number — so *the first play* has to feel completable.
- The finding that actually bites: **players abandon a stage much more readily when they
  cannot tell how much is left.** Predictable remaining effort keeps people in.
- Both failure modes are real: too fast → churn from content depletion; too slow → tedium.

**Applied, cheapest first:**

1. **DONE — make the distance visible.** `BRICKS nnn` counter and `WALL n/2`. The research
   points at *legibility of remaining effort*, not less content, as the first lever.
2. **DONE — give the game an ending.** Ours generated walls endlessly, so it had **no win
   state at all** — arguably worse for a modern player than the original. Restored to the
   1976 two-wall limit with a win screen. There is now a finish line, and it is the
   historically correct one.
3. **HELD — reducing the brick count.** Deliberately not done yet. Two changes just landed
   that attack the same complaint; changing brick count in the same pass would make it
   impossible to know which one worked.

**Recommendation:** play it with the counter and the 2-wall ending in place. If it still
drags, cut rows 8 → 6 (112 → 84 bricks, 336/wall) and we will *know* it was content
length rather than opacity. **Daniel's call after the next playtest.**

### UX-23 — touch layout rebuilt for kids' hands — 2026-07-18 [LUCIUS, age 9]

The first playtest by an actual child, and the most specific feedback of the project:

> *"Dad this is for kids not adults and our hands aren't that big."*

Two problems, both real, both mine:

**1. The movement arrows were too close together.** He plays on a tablet held two-handed
with a thumb at each edge — the arrows have to be *at those edges*. Mine were clustered
centrally. Worse, they had been shipping at less than half the intended width for a
layout reason nobody had measured (INV-17).

| | Before | After |
|---|---|---|
| Distance from screen edge | 245 px | **10 px** |
| Separation between arrows | 155 px (17%) | **521 px (57%)** |
| Button size | 104×56 | **190×76** |

**2. PAUSE / TITLE / SOUND sat next to the arrows and got hit by accident.** Moved
**above the canvas** — thumbs live at the bottom of a tablet, so the top edge is the safe
home for controls you rarely want and never want by mistake. They are now 540 px away
from the nearest arrow instead of adjacent.

**3. Consequence of fixing (1): the centre FIRE button became unreachable** for a thumb
resting on an edge arrow. So **tapping the play area anywhere now fires**. The button
stays for anyone who prefers it.

Applied to **both** rungs, since Invaders had the identical layout.

**The general rule this earns:** the person with the smallest hands is the best reviewer
of a touch layout, and an adult testing with two free hands and a mouse will never find
these. Children are not a lesser test case here — for this project they are the *primary*
one, and Lucius found in five minutes what I had shipped past twice.

### UX-24 — Invaders: aliens hold position through a death — CONFIRMED CORRECT

Lucius asked whether the aliens reset to the top when you lose a life, reasoning that if
they were near the bottom you'd be dead on arrival. Verified in-build:

| Behaviour | Result |
|---|---|
| Aliens on losing a life | **Hold position exactly** (166 → 166); kills preserved |
| Aliens reaching the player's line | **Instant game over, even with lives remaining** |
| New wave | Resets to the top, but starts progressively lower each wave |

All three match the 1978 original — the rack persisting through your death *is* the
pressure, exactly like Breakout's wall. His instinct that it can feel unwinnable is
correct and it is the intended feeling.

**Open for Daniel, since A-11 applies:** that difficulty was tuned for a coin slot we
don't have. If the kids find it discouraging rather than tense, the mercy option is to
push the formation up a row or two on respawn — a deliberate, declared anachronism like
the high score table. Not doing it unilaterally.

### UX-25 — swivel stick for touch — NEW 2026-07-18 [DANIEL]

> *"What if we did something like a Roblox joystick type deal where they just swivel left
> and right… and the right hand is the fire button?"*

**Left half of the play area is a virtual stick, right half fires.** The stick's origin is
**wherever you put your thumb down** — there is no fixed hotspot to reach for, which is the
real fix for Lucius's small-hands problem. Discrete buttons demand you find them; a stick
comes to you.

Multi-touch by identifier, so steering and firing are genuinely simultaneous — verified:
the ship keeps moving while a bullet is fired from the other thumb. 9px deadzone so a
resting thumb doesn't drift.

**The button pad stays.** This is an alternative, not a replacement — keyboard players,
mouse users and anyone who prefers buttons lose nothing. Both rungs.

### UX-26 — Invaders game-over mechanic: KEEP — 2026-07-18 [DANIEL]

Ruling on the UX-24 question: **do not soften it.**

> *"Keep the game over mechanic, gotta teach the kids failure to recognize and work within
> the pattern."*

So: aliens still hold position through a death, and reaching the player's line is still an
instant game over even with lives in hand. Verified still true after the leaderboard port.

Worth noting this **overrides A-11 deliberately.** A-11 says arcade difficulty was tuned
for a coin slot we don't have and shouldn't be inherited unexamined. Here the same
difficulty is being kept for a completely different reason — it teaches pattern
recognition under failure. Same mechanic, different justification, and the justification is
what makes it a decision rather than an inheritance.

### UX-20 — breakthrough now spikes to max speed — NEW 2026-07-18 (fidelity fix)

Chasing the reset question surfaced a documented 1976 rule I had only half-implemented:
breaking through to the back wall punishes the player with **both** a halved paddle **and**
the ball jumping to maximum speed. I had shipped only the paddle half.

Now implemented. It reads as a dramatic spike rather than a death spiral specifically
*because* UX-19 resets the curve on the next ball — the two decisions only work together.

---

## Rung 5 — TI-99/4A (Wumpus + Parsec) — decisions

| # | Decision | Chose | Reasoning | Re-pick trigger |
|---|---|---|---|---|
| UX-27 | Wumpus score for the shared leaderboard | Win = difficulty base (600/900/1200) − 5/move, floor 100; loss = 0 | The 1980 original has no score; the leaderboard is a series contract. Rewarding fewer moves rewards *sharper deduction* — the game's own virtue. Declared adaptation, same class as A-12's backported initials | If playtest shows move-count pressure making players reckless (rushing into unproven caverns to protect score) — then flatten to difficulty base only |
| UX-28 | Feedback contract shape | In-game overlay (pause + textarea) → prefilled GitHub issue URL, clipboard fallback; piloted on rung 5 only | Reports must be sendable mid-play or the moment is lost. Issue URL needs zero backend and lands tickets where the repo already works; clipboard covers testers without GitHub accounts (the kids). DOM modal because typing needs a real textarea | After the family pilot: roll out fleet-wide (empty the `pilotOnly` list in conformance.js) or redesign per what testers actually did |
| UX-29 | Parsec raster | 256×192 — the TI-99/4A's own resolution, landscape | Rung 5's subject is the machine; using its true raster is the homage where it belongs (in craft). Wumpus stays on the series 224×288 portrait since it has no scrolling axis | If phone-portrait play makes the landscape canvas unusably small — revisit with a rotated layout |
| UX-30 | Parsec marathon at the ramp cap | Authored ceiling at level 8 (1.77×), levels then repeat at constant difficulty — long runs possible for a skilled player | Sourced: level 16 repeats and 2M-point marathons were the original's celebrated culture. A-18 forbids the overflow wall, not the marathon | If family playtest finds sessions overstaying their welcome, add fatigue (fuel drain scaling) — a *deliberate* ceiling, never an accidental one |

## Rung 6 — TI-99/4A part II (Munch Man + Anteater) — decisions

| # | Decision | Chose | Reasoning | Re-pick trigger |
|---|---|---|---|---|
| UX-31 | Frightened Hoonos: "black" on a black field | Dark body (#444) on a faint backing square, blinking near the window's end | Sourced: "the Hoonos turn black" — but literal black on our black background is invisible, and an invisible edible enemy is information destroyed (the A-10/INV-13 lesson). Reads as "powered down" while staying visible | If a source surfaces showing the original's maze background colour, match it and go literal black |
| UX-32 | Anteater ant movement: stop on stick release — **2026-07-19 [DANIEL, TESTIMONY — played the original]** | Ant moves only while a direction is held; stops at the next cell centre | First build coasted Pac-Man-style — which was never a decision, just the shared mover's default. Dig Dug lineage stops on release, and Daniel's memory of the original agrees. Stopping also makes egg-fuse timing deliberate (A-23) | If a source contradicts the testimony — but two independent lines already agree |
| UX-33 | Anteater rocks shatter after falling — **2026-07-19 [DANIEL, TESTIMONY]** | Falling rock explodes on landing; the tunnel stays open | First build left it as a permanent undiggable obstacle [ASSUMED]. Written sources are silent on post-fall behaviour; Dig Dug precedent shatters, and Daniel's memory says "exploded". Testimony beats assumption | Same as UX-32 — a primary source (manual scan, footage) showing persistent rocks |

## Rung 7 — NES (Exodus platformer) — decisions

| # | Decision | Chose | Reasoning | Re-pick trigger |
|---|---|---|---|---|
| UX-34 | Theme + legal posture — **2026-07-18 [DANIEL'S RULING]** | SMB-class mechanics re-derived from the public record; **all expression original** — title, level layouts, art, characters, text, music. Theme: the Exodus story. Tone: reverent-playful, never preachy (the b4him thesis — show the homework, invite play). Single game, phased build | Mechanics aren't protectable expression; layouts/names/art are — and Nintendo's enforcement record is exact and current (Full Screen Mario C&D'd 2013, its GitHub repo DMCA'd 2016; an 8,535-repo takedown in one 2024 notice). A-21/A-25 both teach the forced divergence is where identity comes from, and A-29 is the rung's thesis: Wisdom Tree proved this audience is real and then under-served it on craft — this build inverts their order | If any Nintendo-protectable expression is found in the build (a name, a layout lift, an art lift) — strike on sight, no debate. If a playtester reads the tone as preachy — retune the presentation, not the doctrine |
| UX-35 | Manna spoils — the collectible has a shelf life | Manna despawns 600 frames (10 s) after streaming into the world. +100 when gathered | Exodus 16 is the one collectible in games with a source text: gather daily, hoard it and it rots. Mechanically it prices dawdling without a hurry-up siren — the world's reward decays, the player's isn't punished. Checked exact in P8 | If playtesters read the fade as a rendering bug rather than spoilage — add a visual rot cue first, only then reconsider the timer |
| UX-36 | Touch RUN is AUTO by default | On touch, holding a direction runs; a RUN:AUTO/OFF toggle sits in the top row | A held second modifier while steering with one thumb and jumping with the other is a three-thumb ask. Keyboard keeps held-B (the 1985 vocabulary, load-bearing in the physics table) | If the family playtest shows kids wanting walk-speed precision on touch — flip the default, keep the toggle |
| UX-37 | Minimum headroom over traversal ground: 50 px (row 8), unless the ceiling IS the challenge | Patrol-lane overhangs raised after the bot exposed two headroom traps | A platform 18–34 px over walkable ground **denies the jump verb** — over an enemy lane that's an unwinnable corridor, and next to a staircase it was a literal softlock (see RUN_LOG). The overhang looked fine on paper; only traversal exposed it | A level where ducking under a low ceiling is the *intended* mechanic — then the constraint is the content and this rule yields, declared |
| UX-38 | **Rung 8 — the mountain scrolls vertically** (view follows the climber; terrain scrolls in whole cells) | Camera keeps the climber ~2/3 down a 24-row view; the mountain is a tall cell grid, `ceil(height / 46)` rows | **This is OUR call, not TI's** — whether the original scrolled, flipped screens, or showed a whole mountain is genuinely unresolved (ARCHAEOLOGY rung-8 open question 1). What forced a decision is arithmetic: the manual's sourced 46 m per step against Everest's 8,848 m is ~193 upward steps, which cannot fit in 24 character rows. So a static single screen is ruled out even though the original's actual behaviour isn't known | Someone watches a real Everest climb in an emulator and finds TI flipped screens or compressed elevation — then this is re-picked and the finding goes to ARCHAEOLOGY, because it would mean the elevation counter was decoupled from steps |
| UX-39 | **Rung 8 — the frozen clock is shown, not just implemented** | While the climber is moving the timer renders green and reads `TIME HELD`; standing still it reads `TIME` and counts down (red under 15 s) | A-31's mechanic is invisible by nature — a clock that stops is indistinguishable from a clock that is broken, and the player has to *learn* that waiting is free or the mechanic may as well not exist. The label is the teaching surface | **Untested guess at legibility.** If playtesters read "TIME HELD" as a bug, a stall, or miss it entirely — change the presentation (a freeze icon, a pulse, the clock visibly stopping) before touching the mechanic, which is sourced and exact |

## Open UX debts found during the build

Named, not silently carried:

1. ~~**No pause on touch.**~~ **CLOSED** — PAUSE / TITLE / SOUND buttons added for touch.
2. ~~**No audio whatsoever.**~~ **CLOSED** — synthesised SFX + march bass, mutable.
3. **Bunkers can fully shadow an invader column.** Found while testing (a shot at x=26 was eaten by bunker 0, spanning 22–44). Authentic-ish, but it means some columns are unreachable until the bunker erodes. Deliberate or accidental — currently accidental.
4. **Meta language on the title screen.** Correct for Daniel's build-in-public audience, wrong if this ever ships as a standalone game. Two audiences, one screen.
5. **Game-over accepts FIRE to continue** — edge-detected so held fire won't skip it, but there's no visible timer or "are you sure." Low risk, noted.
6. **No motion-reduction respect.** Once juice lands in Phase 4, `prefers-reduced-motion` needs honoring — accessibility, and it's cheap if designed in rather than retrofitted.

---

## What this file is for, long-term

Same as its sibling: when the dream build starts, the design space is already
**mapped** — so choices get made deliberately from a known option set, with the
costs already priced, instead of being defaulted into by whatever was easiest to
type at the time. The invariants stop you shipping bugs. This stops you shipping
accidents.
