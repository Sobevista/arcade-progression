# SCOPE — Rung 9: FINAL FANTASY (NES 1987 / JRPG class, biblical re-skin)

*Written BEFORE any game code (INV-9). Pass criteria locked now. Fidelity build →
visual reference gathered before render code (INV-21) + a side-by-side gate (INV-22).
Companion to `RESEARCH.md` (Phase 1). Stamped 2026-07-25. All expression original
(UX-34) — mechanics are re-derived, art/text/names are ours.*

## What this is

Rung 9 re-derives the **JRPG** from its constraints: the menu-driven, party-based,
turn-based combat loop the NES *Final Fantasy* (Square, 1987) set as the genre template.
The deliverable proves the six approved genre-invariants (JRPG-C1..C6, `RESEARCH.md`) in
running code, then graduates them into `INVARIANTS.md` (earned-not-read).

**This phase = a battle-first vertical slice.** Turn-based party combat (4 heroes, menu
commands, HP + charge-based magic) + XP/leveling + one boss, wrapped in the minimal
three-tier loop: small overworld → one town (inn + shop) → one dungeon → boss, with
random encounters. The unmistakable JRPG skeleton, tiny content. **The battle engine is
the load-bearing deliverable**; the world is the thinnest wrapper that proves attrition
(C4/C5). Everything below is scoped to that.

**Explicitly LATER phases (not this SCOPE):** the biblical story spine + named
crystals/fiends (a content-spec pass — this build ships archetypal placeholders with
original names); class promotion; a full spell roster; a full overworld; multiple towns
and dungeons; the 50-level curve.

## The fidelity baseline [tag each line VERIFIED or ASSUMED]

*Sourced this session (see Sources). We reproduce the NES 1987 formulas — NOT the
GBA/PSX remakes, which changed both art and mechanics. The charge-based magic system is
the deliberate fidelity showcase (Daniel's call 2026-07-25): "do the charges so we can
see why they changed it."*

**Combat resolution**
- **[V] Turn order = pure random shuffle, agility-independent.** Each round builds a list
  of the 9 enemy slots + 4 hero slots (13), then swaps two random slots 17 times; the
  shuffled list is the action order. Empty/dead slots skipped. Agility does **not** affect
  order in the NES version (it only adds +1 evade per point). *(This is a rung finding: the
  remakes' Dawn-of-Souls "agility + random(0–49)" ordering was a later fix to exactly this.)*
- **[V] Commands are chosen for all four heroes at the start of the round, then the whole
  round executes.** No mid-round re-planning; a target that dies before a queued attack
  lands "wastes" the action (NES behavior).
- **[V] Physical damage** = random integer in **[1×, 2×] of the attacker's Damage score,
  minus target Absorb, minimum 1.** Damage = weapon base power + ¼ Strength + ¼ hit-skill.
- **[V] Accuracy** = base ~**84%**, adjusted by attacker Hit% and defender Evade%
  (~1% avoided per 2 Evade). A multi-hit attacker rolls accuracy per hit.
- **[V] Magic resolves like an attack.** A damage spell that "misses" still deals **half**
  damage (FIRE 20–40 on hit → 10–20 on miss). Spell success = spell Hit% vs. target Magic
  Defense.
- **[V] Poison** = 2 HP/round in battle, 1 HP/step on the map.

**Magic — charge system (the D&D spell-slot model, NOT MP) [V]**
- **[V]** Spells are organized into **8 tiers (spell levels)**; a character can know up to
  **3 spells per tier**; learning a 4th forces forgetting one.
- **[V]** Each tier has a **pool of charges**; casting any spell of that tier spends **one
  charge of that tier** (a level-1 and a level-1 spell draw from the same pool — cost is the
  tier, not the spell).
- **[V]** Charges refill **only** on rest (inn) or a Cottage/Tent-class item — never
  passively. This is the engine of C5 attrition.
- **[V] cap / [A] exact growth:** max charges per tier **grows with character level and caps
  at 9 per tier**. The full per-level growth table is [A] — **MVP simplification (UX-DEC-9a
  below):** charges per tier scale on a simple sourced-shape curve, capped at 9.

**Growth [V]**
- **[V]** On level-up, **each of the 5 base stats independently has a 1-in-8 chance of +1**
  (no base stat rises more than +1/level). **Max HP always rises**, by an amount driven by
  Stamina. Growth is probabilistic, not a fixed table — reproduce the randomness.
- **[V]** Hit% grows per class: Fighter/Monk +3/level, Thief/Red +2, White/Black +1 (≈ a new
  attack every ~11 levels for fighters).
- **[V]** NES level cap 50; from L29+ each level ≈ **32,800 XP** (near-flat top end).
- **[A] MVP simplification (UX-DEC-9b):** the slice caps at a low level band (≈1–10) with a
  gentle sourced-shape XP curve; the full 50-level curve is a later phase. The *mechanic*
  (probabilistic per-stat growth + guaranteed HP) is reproduced exactly; the *table depth* is
  trimmed.

## Visual fidelity — the side-by-side gate [MANDATORY — INV-21, INV-22]

*The section rung 8 didn't have — which is how Alpiner shipped letters-for-sprites at 26/27
green. Not done until this passes, judged against the reference IMAGE, not our own tests.*

- **Reference gathered before code:** the NES FF1 frame set at
  `thefinalfantasy.net/ff1/screenshots.html` (19 frames incl. **Battle**, **Garland boss**,
  **Dungeon**, **World Map/Castle**, **Town/Mysidia**, **Inn**, **Menu**, **Class Select**).
  **DANIEL EYEBALL GATE (INV-21):** Daniel confirms the exact palette + sprite scale off these
  frames before the attribute values below are locked. If reference is not in hand, no render
  code.
- **Named visual attributes under test** (each pass/fail, side-by-side vs a reference frame):
  - **Battle layout** *(locked from the reference frame, 2026-07-25 — see RUN_LOG)* — a
    near-black field with a **thin terrain band across the top**; enemies clustered on the
    **LEFT** in a formation grid (up to 9); the **4 hero sprites in a vertical column
    center-right, facing left**; a **far-right window** listing `NAME / HP nn` per hero; a
    bottom-left **message box** (enemy name + damage) and the command menu. This left-vs-right
    party-visible layout is the genre-defining frame (vs Dragon Quest's first-person) — getting
    it wrong fails the rung.
  - **The window frame** — the iconic **black box with a white double-line border** + `►`
    cursor; the command menu reads **FIGHT / MAGIC / DRINK / ITEM** (+ party RUN) — DRINK is the
    potion command (corrected from memory at the reference frame). Our glyphs/labels original.
  - **Palette** — sparse, tense, limited NES palette (flat dark battle field, not the remakes'
    lush cartoon). Checked against reference pixels, NOT `assumed by inspection`. *(The `palette`
    conformance check has never inspected a pixel on any rung — this rung either fixes it to
    sample pixels or this attribute is an explicit human gate. See open item.)*
  - **Silhouette / readability** — each hero and enemy recognizable at game scale as the thing
    it depicts (a knight, a mage, a fiend), **never a letter or blob** (the rung-8 failure).
  - **Sprite scale + proportion** — larger side-view battle sprites; small (~16px) overworld/
    town sprites; the ratio matches the original.
  - **Font** — a bitmap face in the NES FF register (ours, original glyphs), not a browser
    system font.
- **Pass = a side-by-side (our frame next to the reference frame) agrees on every named
  attribute.** Attach the comparison images in `RUN_LOG.md`.

## Under test — mechanics (binary pass criteria, sim-contract checkable)

*Each driven through a read-only state hook + `sim.step()` so something other than the author
verifies it (sim-contract skill). This suite covers the MECHANICAL axis ONLY — the visual gate
above covers the rest (INV-22: silence on an axis reads exactly like success).*

- **P1 — Determinism:** given a fixed seed, a scripted sequence of battle commands produces a
  byte-identical battle log (damage rolls, turn order, XP awarded). Re-run = identical.
- **P2 — Turn order is the sourced shuffle:** over N seeded rounds, action-order distribution
  matches the 17-swap random shuffle (uniform-ish, agility-independent) — a mutation that makes
  order agility-sorted must turn this test RED.
- **P3 — Damage formula:** sampled hits fall in [1×,2×]·Damage − Absorb, min 1; a spell "miss"
  deals exactly half; boundaries (Absorb ≥ max roll → 1) hold.
- **P4 — Accuracy band:** hit rate over many seeded swings sits at the sourced ~84% baseline as
  modified by Hit%/Evade, within tolerance.
- **P5 — Charge accounting:** casting spends exactly one charge of the spell's TIER; at 0
  charges the spell is unselectable; rest at the inn refills to the (level-capped, ≤9) max; no
  passive regen. A mutation that regenerates a charge per turn must fail this.
- **P6 — Growth is probabilistic + HP-guaranteed:** over many seeded level-ups each base stat's
  gain rate ≈ 1/8 and never exceeds +1; HP rises every level. Mutation to a fixed +1-all table
  fails.
- **P7 — Attrition / losability (C5):** the dungeon is beatable from full resources on a
  competent line AND a no-heal/over-spend line depletes charges+HP and can wipe before the boss
  — proving the safe-point tension is real, not cosmetic (the winnability-bot pattern from
  earlier rungs, JRPG-shaped).
- **P8 — Win/lose states:** boss defeat → victory + XP/loot; whole party at 0 HP → game over.
- **P9 — Conformance:** the rung passes the arcade conformance checker (slug wired, feedback
  contract honored per rungs 5+6 convention, one HTML file, zero deps, no build step).
- **P10 — Frame budget:** the battle scene holds the arcade's frame-time bar on a mid-range
  device (menus + up to 9 enemies + 4 heroes).

## Under test — UX decisions (with re-pick triggers)

- **UX-DEC-9a (charges, MVP depth):** reproduce the tier-charge mechanic exactly (spend-by-tier,
  refill-only-at-rest, ≤9 cap) but trim to **~4 tiers** for the slice. *Re-pick trigger:* if
  playtest shows attrition doesn't bite in 4 tiers, widen toward 8.
- **UX-DEC-9b (level band):** cap the slice at ~L1–10 on a gentle sourced-shape curve. *Re-pick
  trigger:* if a hero can't reach the boss-viable band inside the one dungeon, retune the curve
  (do NOT hand out free levels).
- **UX-DEC-9c (charges vs MP — the fidelity showcase):** we ship **charges, not MP**, on
  purpose. Watchpoint for the archaeology finding: log whether charges make the slice feel
  *rigid/opaque* (the suspected reason every remake switched to MP). If the friction is real and
  reproducible, that becomes A-3x in the trove — the "why they changed it" payload of this rung.

## Blast radius
- **New:** `rungs/09-final-fantasy/` — `index.html` (the game), `SCOPE.md` (this),
  `RUN_LOG.md` (playtest + side-by-side evidence). `RESEARCH.md` already exists.
- **Touched (on graduation, not before):** conformance slug + registry; `INVARIANTS.md`
  (JRPG-C1..C6 earn their lines once proven); `ARCHAEOLOGY.md`/`UX_DECISIONS.md` (the charge
  and turn-order findings); README + landing docs.
- **NOT touched:** `releases.json` (Daniel's pacing gate — direct rung URL works once pushed,
  landing advertises on his call); other rungs; shared tools unless stated. **Commits/pushes on
  this repo are Daniel's** (arcade governance).

## Abort condition
If the sourced NES formulas, honestly ported, won't produce a recognizable JRPG battle — a
readable menu round where allocation across the party and charge attrition decide the fight —
**stop and re-dig, do not tune constants to force a criterion.** A fudged battle oracle poisons
every later JRPG rung. Specifically: if reproducing pure-random turn order makes the fight feel
purely luck-driven and unwinnable-by-skill, that is a *finding to write up*, not a number to
quietly weight toward agility.

## Content spec (this phase — all expression original, UX-34)
- **Party (4 heroes, archetypal, original names/art):** a **Warrior** (physical, high HP/Absorb),
  a **White-magic healer** (support + cure), a **Black-magic caster** (elemental nukes), and a
  **hybrid** (Thief/Red-class — modest melee + a little magic). Roles complementary (C2). Class
  promotion out of scope.
- **Overworld:** one small walkable top-down field linking town ↔ dungeon; random encounters on
  the field and in the dungeon (C4).
- **Town (safe point):** an **inn** (rest → full HP + charge refill, the C5 pivot) and a **shop**
  (buy a weapon/armor/potion tier); one or two info NPCs. No plot gate.
- **Dungeon (risk):** a short multi-room tile map, darker set, random encounters, a locked path
  to the boss; one mid treasure (a weapon or a Cottage).
- **Enemies:** ~4–6 original common foes (melee + a caster) + **one boss** (a Fiend re-skin,
  original design — the slice's crystal-restore beat). Boss has a gimmick that rewards party
  allocation (e.g. a heavy hit that punishes an un-healed line).
- **Player abilities:** menu commands FIGHT / MAGIC / DRINK / ITEM (+ party RUN); magic by
  tier-charge; DRINK/ITEM = potion + Cottage. **Win** = defeat the boss (crystal lights).
  **Lose** = whole party at 0 HP.
- **Growth:** XP from encounters → probabilistic stat growth + guaranteed HP + charge-cap growth,
  feeding the compulsion loop (C3).
