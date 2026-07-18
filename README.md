# Arcade Progression

A chronological walk through arcade history, one game at a time, built from scratch.
Pong → Breakout → Space Invaders → Galaga → TI-99/4A → NES.

Every rung is playable in a browser. Every rung teaches a primitive the previous one
didn't have. **And the real deliverable isn't the games — it's `INVARIANTS.md`**, the
accumulating list of laws earned by things going wrong, so that when the big build
comes, its roadblocks are already solved and paid for.

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
INVARIANTS.md          the deliverable — laws earned across every rung
UX_DECISIONS.md        design choices, tradeoffs, re-pick triggers
index.html             landing page (GitHub Pages) linking every playable rung
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
