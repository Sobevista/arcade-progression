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
