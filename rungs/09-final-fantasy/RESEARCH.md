# RESEARCH — Rung 9: FINAL FANTASY (biblical twist), the JRPG rung

*Phase 1 of the pipeline: research → library → extract invariants → build MVP proving the fixes.
Archaeology-first, sourced not recalled (INV-10), visual reference gathered before code (INV-21).
Every line tagged: **[V]** = confirmed from a source cited this session · **[A]** = assumed / not
yet checked, a debt to pay before it reaches the SCOPE fidelity baseline. Stamped 2026-07-24.*

**Target original:** Final Fantasy (Famicom/NES, 1987, Square) — the first game in the series,
NES version specifically (not the GBA/PSX remakes, which change art and mechanics).

**MVP decisions locked with Daniel (2026-07-24):**
- **Scope = battle-first vertical slice:** turn-based party combat (3–4 heroes, menu commands,
  HP/MP) + XP/leveling + one boss, wrapped in a minimal loop — small overworld → one town
  (inn + shop) → one dungeon → boss, with random encounters. The unmistakable JRPG skeleton,
  tiny content.
- **Theme = FF1 structure re-skinned biblically:** four crystals → four biblical relics/rivers;
  four fiends → four cosmic adversaries; light-restored ending. (Story spine content = a later
  content-spec pass; this research is genre-mechanical.)

---

## What made Final Fantasy epic (the genre-defining leap over Dragon Quest)

- **[V]** The battle screen **showed the party as animated sprites** and put **enemies on the
  left vs. the party on the right** — where Dragon Quest used a static first-person view with no
  visible party. This left-vs-right, party-visible turn-based layout became the JRPG template
  "copied by competitors ever since." — Den of Geek
- **[V]** The four-member party was **built by the player from six character classes** (vs. Dragon
  Quest II's fixed party) — customization as a genre pillar. — Den of Geek
- **[V]** Deeper mechanics + a mythic, archetypal story (crystals, elemental fiends, a time loop)
  raised the scope of what an NES RPG could be — "set the foundation of what all other RPGs would
  become." — Den of Geek / Gamerant

## The structure — the four-crystals / four-fiends spine (our theme hangs on this)

- **[V]** Four Warriors of Light restore power to **four elemental crystals** by defeating **four
  Fiends**: **Lich (Earth), Marilith (Fire), Kraken (Water), Tiamat (Wind/Air).** — FF Wiki
- **[V]** The loop: a party of four **explores towns and dungeons across a world map**; in towns
  they **shop, gather information, and rest (inn)**; the goal is defeating the four Fiends. — FF
  Wiki / dlab.epfl wikipedia mirror
- **Biblical re-skin mapping [A — Daniel's creative call, drafted]:** four crystals → four relics
  or the four rivers of Eden (Pishon/Gihon/Tigris/Euphrates); four fiends → four cosmic
  adversaries (candidate: the four horsemen); light restored → the ending. To be ruled in the
  content-spec pass.

## The classes (MVP needs 3–4 hero archetypes, not all six)

- **[V]** Six base classes: **Warrior, Monk (Black Belt), Thief, Black Mage, White Mage, Red
  Mage**; each promotes once (Knight, Master, Ninja, Black Wizard, White Wizard, Red Wizard)
  after the Citadel of Trials. — StrategyWiki / FF Wiki
- **MVP pick [A — proposal]:** a 4-hero party covering the archetype spread — a **Warrior**
  (physical), a **White Mage** (heal/support), a **Black Mage** (offensive magic), and one of
  **Thief/Monk/Red Mage** (hybrid). Class *promotion* is out of MVP scope (later phase).

## The battle system — the JRPG bone (formulas = SCOPE fidelity baseline; re-confirm before code)

- **[V]** **Menu-driven, turn-based.** Commands per character: Fight / Magic / Item (+ Drink/Run
  class variants). The battle screen is "an abstraction and menu first" — UI-central, not a
  cinematic. — Marina Kittaka / HubPages
- **[V]** **Damage:** a hit deals a random amount between **1× and 2× the attacker's Damage
  score, minus the target's Absorb, min 1.** Attack (Damage) = weapon base power + ¼ Strength +
  ¼ skill. — GameFAQs (AstralEsper mechanics guide)
- **[V]** **Accuracy:** base hit chance ~**84%**, adjusted by attacker Hit% and defender Evade%
  (~1% avoidance per 2 Evade); blind = ∓40. — GameFAQs
- **[V]** **Magic:** works like an attack; the spell's Hit% is its success chance vs. 0 Magic
  Defense, minus the target's Magic Defense. A *missed* damage spell still deals **half** damage
  (e.g. FIRE 20–40 on hit, 10–20 on miss). — GameFAQs
- **[V]** **Magic is charge-based, NOT MP-per-spell** in the NES original: spells are cast from a
  **per-level charge pool (8 spell levels)**, D&D-style — a detail the remakes replaced with MP.
  [V-partial: strongly attested across sources; **confirm exact charge counts at SCOPE**.]
- **[V]** **Status:** poison deals **2 HP/round in battle and 1 HP/step on the map.** — GameFAQs
- **[A — to pin at SCOPE]:** exact **turn-order rule** within a round (agility-influenced order;
  commands chosen at round start then executed) and **XP thresholds / level-up stat gains**.
  Not asserted from memory — these get fetched + tagged [V] in the SCOPE fidelity baseline.

## Visual reference (INV-21 — gathered before any render code)

The canonical NES reference frames (source: thefinalfantasy.net/ff1 screenshot gallery — 19
frames incl. **Battle**, **Garland boss battle**, **Dungeon**, **World Map / Castle**, **Town /
Mysidia**, **Inn interior**, **Menu screen**, **Class Select**). These are the primary sources
for the side-by-side gate; **Daniel should eyeball them before the SCOPE's visual attributes are
locked** (the render agent must not infer the look from prose — the rung-8 lesson).

Attributes the SCOPE visual gate must name (from sourced descriptions [V], exact values pending
Daniel's eyeball on the frames [A]):
- **Palette:** sparse, tense, limited 8-bit NES palette (not the "lush cartoon" of remakes). [V]
- **Battle layout:** enemies left, party sprites right facing left, a bottom/side **command
  window + HP/status window** with the classic NES double-line box border. [V]
- **Sprite scale:** small overworld sprites; larger, side-view battle sprites. [A — measure off
  the reference frame.]
- **Overworld / town / dungeon:** tile-based top-down; town = walkable NPCs + shop/inn buildings;
  dungeon = darker tile set. [V shape, A exact.]

---

## Candidate JRPG genre-invariants (the trove deliverable — DRAFT for Daniel's ruling)

*Proposed, not yet promoted. These are the "bones" the MVP must get right — the laws that make a
JRPG a JRPG, distinct from the platformer laws. Daniel rules which enter INVARIANTS.md.*

- **JRPG-C1 — The battle is a menu, not an arcade.** Input is discrete command selection resolved
  over turns, not real-time dexterity. The screen serves information (HP/MP/status) first.
- **JRPG-C2 — Party, not avatar.** The unit of play is a party of distinct classes whose roles
  are complementary (tank / heal / nuke); the challenge is *allocation across the party*, not one
  character's skill.
- **JRPG-C3 — Growth is the reward loop.** XP → levels → stat/ability growth is the core
  compulsion; combat exists to feed it. A JRPG with no persistent growth is a puzzle, not a JRPG.
- **JRPG-C4 — The world is a three-tier loop:** overworld (travel + random encounters) → town
  (safe: heal/shop/info) → dungeon (risk: encounters + a boss + a reward). Tension comes from
  resource attrition (HP/MP/charges) between safe points.
- **JRPG-C5 — Attrition is the real difficulty.** A single battle is rarely lethal; the dungeon
  is lethal because resources deplete with no refill until the next town. This is the JRPG's
  substitute for the platformer's moment-to-moment execution pressure.
- **JRPG-C6 — Story is a spine the mechanics hang on.** A mythic goal (restore the crystals)
  frames the grind; the narrative is structural, not decorative.

## Open questions carried to the SCOPE
- Turn-order rule + XP curve + level-up gains — fetch + tag [V] before coding the engine.
- MP-charges vs simplified MP-pool for OUR MVP (fidelity to NES charges vs. approachability) —
  a UX_DECISION with a re-pick trigger, Daniel's call.
- Exact palette + sprite scale — off the reference frames, Daniel's eyeball.

## Sources (this session)
- Den of Geek — "Was Final Fantasy Really the First JRPG?" https://www.denofgeek.com/games/final-fantasy-first-jrpg-ever-genre-history/
- Game Rant — Final Fantasy / JRPG genre foundation https://gamerant.com/final-fantasy-franchise-jrpg-genre-foundation-influence/
- FF Wiki — Four Fiends https://finalfantasy.fandom.com/wiki/Four_Fiends_(Final_Fantasy)
- StrategyWiki — Final Fantasy / Classes https://strategywiki.org/wiki/Final_Fantasy/Classes
- GameFAQs — FF1 Game Mechanics Guide (AstralEsper) https://gamefaqs.gamespot.com/nes/522595-final-fantasy/faqs/57009
- Marina Kittaka — "Marina Plays Final Fantasy 1 NES" https://marinakittaka.com/posts/2020-10-23-Marina-Plays-Final-Fantasy-1-NES
- HubPages — "Final Fantasy Graphics: A Look Back" https://discover.hubpages.com/games-hobbies/final-fantasy-graphics
- thefinalfantasy.net — FF1 screenshots (visual reference set) https://thefinalfantasy.net/ff1/screenshots.html
