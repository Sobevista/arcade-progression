# Arcade Progression

**Re-deriving the evolution of video games, in order, from the constraints up.**
Pong → Breakout → Space Invaders → Galaga → TI-99/4A → NES.

Not tribute builds. We work out what the original designers must have spent a long time
figuring out — what machine they had, what it physically couldn't do, and what that
forced them to invent — then build it ourselves and keep the lessons. The games are the
vehicle. **The deliverable is the trove**: three accumulating documents that mean the
next build starts with its roadblocks already solved.

| File | What it holds |
|---|---|
| [`INVARIANTS.md`](INVARIANTS.md) | **Laws** — earned by things going wrong, each carrying the failure that bought it |
| [`UX_DECISIONS.md`](UX_DECISIONS.md) | **Choices** — the design map, tradeoffs priced, each with a re-pick trigger |
| [`ARCHAEOLOGY.md`](ARCHAEOLOGY.md) | **History** — what they were up against, what it forced, and the *Suffering Ledger*: which constraints we keep on purpose |

## Entry ritual
Follow `RESUME.md`.

## Play

| Rung | Game | Year | Adds | Play |
|---|---|---|---|---|
| 1 | Pong | 1972 | paddle/ball physics, scoring | [Pong_Tower-Repo](https://github.com/Sobevista/Pong_Tower-Repo) (Python/pygame, separate repo) |
| 2 | **Invaders** | 1978 | formation, tempo ramp, destructible terrain | [`rungs/02-invaders/`](rungs/02-invaders/) |
| 3 | Breakout | 1976 | reflection angles, tile grid | *backfill — not built* |
| 4 | Galaga | 1981 | entry-flight paths, dive AI, capture/rescue, bonus stages | *not built* |
| 5 | TI-99/4A titles | 1979–84 | the machine this whole thing is an homage to | *not built* |
| 6 | NES | 1985+ | tile maps, scrolling, item state | *not built* |

Rungs are numbered by build order, not strictly by year — Breakout is a backfill.

## The rules of this repo

- **Archaeology before code.** Every rung starts by researching the original machine and
  its constraints — sourced, not recalled — then deciding which of those constraints to
  keep. No code until that's written down. (Rung 2 was built the other way round and
  shipped two mechanics wrong from confident memory.)
- **Be intentional with your suffering.** Every historical constraint is optional for us,
  so each one is a live choice: KEEP (the constraint teaches something you can't get from
  reading) or SKIP (tedium, not insight). Keeping all of them is cosplay; skipping all of
  them means learning nothing about why any of it is shaped the way it is.
- **Sim first, human second.** Every rung implements the sim contract so tiered bots can
  answer the measurable questions — winnable? how long? does difficulty scale? — at ~8,600×
  real time. Bots may only touch the virtual controls, never game state, so they are bound
  by the same paddle speed a person is. **This does not replace human playtest**; it clears
  the runway so a human is spent on what only a human can judge.
- **One HTML file per game.** Vanilla JS, Canvas 2D, zero dependencies, no build step.
  A game you can't open by double-clicking is a game nobody will ever repair.
- **Build for repair, not forever.** If a near-beginner can't open it and change
  something, it's built wrong.
- **`INVARIANTS.md` is append-only and earned.** Nothing goes in it because it sounded
  true. It goes in because something broke and cost us.
- **`UX_DECISIONS.md` holds the choices**, with tradeoffs and a re-pick trigger each.
  A law and a taste call are different kinds of knowledge and never share a file.
- **Fidelity claims need a source.** "This is how the original did it" is ASSUMED until
  checked. Two mechanics shipped wrong on rung 2 from confident memory (INV-10).

## Layout

```
INVARIANTS.md          laws earned across every rung
UX_DECISIONS.md        design choices, tradeoffs, re-pick triggers
ARCHAEOLOGY.md         the original machines, what they forced, the Suffering Ledger
index.html             landing page (GitHub Pages) linking every playable rung
tools/
  playtest-sim.js      tiered simulated players (beginner/intermediate/adept)
  SIM_RESULTS.md       their measured results vs the researched criteria
  hiscore.js           shared high-score protocol (inlined per rung)
  conformance.js       fails any rung missing a shared contract
rungs/
  02-invaders/
    index.html         the game — the only file you need to play or share
    README.md          how to run it, share it, and edit it
    SCOPE.md           what was under test, pass criteria locked before building
    RUN_LOG.md         what actually happened, wrong turns included
```

## Why this exists

Two reasons, both load-bearing:

1. **The invariants.** Every roadblock hit here is one not hit later, already solved and
   already written down.
2. **Showing the work.** The run logs keep the false starts in on purpose. The failures
   are the teaching material — that's the whole point, and it's why this is public.
