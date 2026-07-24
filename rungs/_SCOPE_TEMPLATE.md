# SCOPE — Rung NN: TITLE (era/genre class)

*Written BEFORE any game code. Pass criteria locked now; a scope written afterwards
always passes (INV-9 corollary). Copy this file to `rungs/NN-name/SCOPE.md` and fill
every section. Delete this italic note and any bracketed guidance when done.*

## What this is
[One paragraph: the rung's genre, what it re-derives, the phase boundary. What this
phase proves vs what is a later phase. "All expression original" if a fidelity/theme
build — say so (UX-34).]

## The fidelity baseline [tag each line VERIFIED or ASSUMED]
[The sourced facts the build must reproduce — mechanics tables, timings, economy.
Cite the source (disassembly, manual, primary doc). VERIFIED = observed this session
from the source; ASSUMED = not yet checked. An ASSUMED baseline is a debt, not a spec.]

## Visual fidelity — the side-by-side gate [MANDATORY — INV-21, INV-22]
*The section rung 8 didn't have, which is how it shipped letters for sprites while
26/27 green. A fidelity build is not done until this passes, judged against the
reference IMAGE, not the author's own tests.*

- **Reference gathered before code:** list the screenshots/video used as primary
  visual sources, with where they came from. If this list is empty, do not write
  render code yet (INV-21).
- **Named visual attributes under test** (fill in per game; each is a pass/fail
  judged side-by-side against a reference frame):
  - **Palette** — the actual hues, checked against reference (NOT `assumed by
    inspection`; sample pixels if the `palette` conformance check has been fixed to,
    else this is an explicit human gate).
  - **Silhouette / readability** — each sprite recognizable at game scale as the thing
    it depicts, not a letter or blob.
  - **Sprite scale + proportion** — characters/objects sized as in the original
    relative to the play field.
  - **Panel / HUD layout** — score, lives, timer placed as the original placed them.
  - [add game-specific: parallax, tile motifs, title screen, etc.]
- **Pass = a side-by-side (our frame next to the reference frame) agrees on every
  named attribute.** Attach the comparison in RUN_LOG.

## Under test — mechanics (binary pass criteria, machine-checkable via the sim contract)
[P1..Pn: speeds, collision, determinism, camera, streaming, winnability/losability,
scoring audit, conformance, frame budget. Each checkable by something other than you,
through `sim.step()` / the read-only test hook. This is the axis the suite covers —
remember it is ONLY this axis (INV-22); the visual gate above covers the rest.]

## Blast radius
- New: `rungs/NN-name/` (index.html, SCOPE.md, RUN_LOG.md).
- Touched: [conformance slug, README + landing docs, BUILD_OUTLINE/ARCHAEOLOGY/UX records].
- NOT touched: [releases.json = Daniel's pacing gate; other rungs; shared tools unless stated].

## Abort condition
[The single result that says stop and re-dig rather than tune. For a fidelity build:
if the sourced baseline, honestly ported, won't reproduce a known landmark — stop.
Do not tune constants to force a criterion; a fudged oracle poisons every later phase.]

## Content spec (this phase — all expression original if themed, UX-34)
[Levels/screens/enemies/player, one line each. Player abilities, lives, scoring,
win/lose conditions.]
