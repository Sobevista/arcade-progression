# SCOPE — arcade-poc

**Status: PROPOSED — not locked. Daniel rules on §7 before build starts.**
Written 2026-07-18, before any code. Per Lab protocol + GENESIS §4.

---

## 1. What's under test

Two things at once, deliberately separated so one doesn't hide behind the other:

- **The artifact:** a browser-playable Galaga/Space-Invaders homage, good enough to be the launch content for the b4him site.
- **The method:** what Claude produces under bypassed permissions with context + goal + parameters and no per-step steering. This is the actual experiment. The game is the vehicle.

## 2. Why this task was chosen

It has an **oracle that isn't me.** Code runs or crashes; collisions land or don't; the frame budget is met or missed. Prose deliverables let the author grade the author — a game doesn't. "Is it fun" stays Daniel's call and is explicitly *not* claimed as a PASS criterion.

## 3. The primitives (deconstructed before detail, per doctrine)

**Space Invaders (1978) contributes:**
1. Grid formation, shuffle-march, drop a rank at each edge
2. **Tempo ramp** — fewer enemies = faster. A hardware accident that became the soul of the genre
3. Inexorable descent — you lose when they reach your line
4. Scarcity of fire (one shot on screen)

**Galaga (1981) contributes:**
1. **Entry flights** — enemies swoop in on curved paths, *then* assemble into formation
2. **Formation breathing** — the assembled grid sways/pulses instead of marching
3. **Dive attacks** — individuals peel off, fly an attack run, return to slot
4. **Capture → rescue → dual fighter** — the signature mechanic; the one thing that makes it unmistakably Galaga
5. Two shots on screen; challenging/bonus stages

**The spine of this homage:** Galaga's *entry-flight → formation → dive* loop is the identity. Space Invaders donates the *tempo ramp* and the *dread of descent*. Capture/rescue is the highest-cost, highest-payoff mechanic and is deliberately sequenced late (Phase 3) so it can be cut without killing the game.

## 4. Phases — each ends in a Stop-&-Verify

| Phase | Ships | Verify |
|---|---|---|
| **1** | Player ship, movement, fire, static formation, collision, death, score, restart | Playable. "This is Space Invaders." |
| **2** | Entry flights, formation breathing, dive attacks | "Now it's Galaga." |
| **3** | Capture → rescue → dual fighter, wave progression, tempo ramp | The signature mechanic works |
| **4** | Sound, juice (screen shake, particles), mobile touch, local high scores | Feels finished on a phone |
| **5** | Ships to the site | Reachable at a URL |

Phase 1 is the real gate. If Phase 1 isn't fun to poke at, later phases are polish on a corpse.

## 5. Tech — locked

**One HTML file. Vanilla JS + Canvas 2D. Zero dependencies. No build step.**

Rationale, straight from build doctrine: *"build for repair, not forever"* and the resource ladder. No React, no Phaser, no bundler, no npm. It runs by double-clicking the file; it deploys by copying the file; a near-beginner can open it and fix it. Adding a framework buys nothing Phase 1–4 needs and costs the ability to repair it.

Reassessed only if a phase provably can't be built this way. That reassessment gets written here, not decided silently.

## 6. PASS criteria — binary, checkable by someone other than me

Phase 1 passes when **all** of these are true, verified by running it:

**PHASE 1 PASSED 2026-07-18 — 8/8, verified in Chrome, not asserted.**

- [x] Loads with **zero console errors** — 0 errors, 0 messages after clean reload + stress
- [x] Ship moves and is clamped — right clamp 205 (max 205), left clamp 6 (min 6)
- [x] Projectile travels and despawns, no leak — entity count returns to baseline
- [x] Collision removes exactly the hit enemy and scores it — 1 removed, exact points
- [x] Formation advances; reaching the player's line ends the game — state → over
- [x] Death and restart work without page reload — verified, plus live death under load
- [x] Sustains 60fps with a full formation — **62 fps**, 55 invaders on screen
- [x] No state leaks between restarts — entities stable over 5 restarts; score/lives/wave reset

**Bonus, beyond Phase 1 scope:** destructible bunkers on a real pixel grid (13 px eroded per hit, verified), tempo ramp measured 560 ms → 40 ms, UFO, waves, one-bullet rule, pause, touch controls, localStorage high score.

**One real bug found and fixed during verification:** projectile tunneling at large `dt`. See `INVARIANTS.md` INV-1 and the prove-the-fix entry in `RUN_LOG.md`.

**Explicitly NOT claimed as PASS:** "it's fun," "it feels like Galaga," "it's good." Those are Daniel's verdict and are recorded separately in `RUN_LOG.md` as his words, not mine.

## 7. OPEN — Daniel rules before build starts

**(a) Theme. — RETRACTED 2026-07-18.** I proposed a lighthouse-keeper skin, having wrongly imported b4him's identity onto the game. Corrected by Daniel: the lightkeeper metaphor belongs to **the site** (teach others to shine, act rather than be acted upon). The game's emotional core is different and is **an homage to Daniel's father** — detail pending, and not to be guessed at.

**(b) Name.** `arcade-poc` — deliberately provisional and deliberately *not* the natural-repo-name rule. That rule requires knowing what the thing is; this one is named after what it honors, and that isn't mine to invent. Real name lands once Daniel supplies the father context.

**(c) Capture mechanic.** Recommendation: **in, at Phase 3.** It's the signature and the reason to build Galaga instead of Invaders. Sequenced so it can be cut under time pressure without invalidating Phases 1–2.

## 8. Blast radius

- **May touch:** `C:\Users\dansl\Claude\Lab\lightkeeper\` — freely, no per-step approval
- **May read:** the harness, live repos, public web
- **May NOT touch without Daniel's word:** anything under `Sobevista/*` (no pushes, no PRs, no repo creation), the harness repo, the b4him domain/DNS, any Google account resource, anything that publishes outward

Bypassed permissions apply to the bench. They do not extend to the fleet or to anything public-facing.

## 9. Abort condition

Daniel pulls the cord if: build churns past **Phase 1 without a playable artifact**, the single-file constraint gets quietly abandoned, or `RUN_LOG.md` stops matching what actually happened.

## 10. Exit

Per Lab protocol, this folder ends in GRADUATE, HARVEST, or KILL. Expected exit: **GRADUATE** to `Sobevista/lightkeeper` if Phase 1–3 land, at which point this folder is deleted and the repo becomes the only home.
