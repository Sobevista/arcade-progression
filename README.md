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

**▶ Play them live: https://sobevista.github.io/arcade-progression/**

| Rung | Game | Year | Adds | Status |
|---|---|---|---|---|
| 1 | Pong | 1972 | paddle/ball physics, scoring | separate repo — [Pong_Tower-Repo](https://github.com/Sobevista/Pong_Tower-Repo) (Python/pygame) |
| 2 | **Invaders** | 1978 | formation, tempo ramp, destructible terrain | ✅ **PLAY** — [`rungs/02-invaders/`](rungs/02-invaders/) · [live](https://sobevista.github.io/arcade-progression/rungs/02-invaders/) |
| 3 | **Breakout** | 1976 | reflection angles, tile grid, an *authored* difficulty curve — and no CPU at all | ✅ **PLAY** — [`rungs/03-breakout/`](rungs/03-breakout/) · [live](https://sobevista.github.io/arcade-progression/rungs/03-breakout/) |
| 4 | **Galaga** | 1981 | entry-flight choreography, dive AI, capture/rescue, challenging stages | ✅ **PLAY** — [`rungs/04-galaga/`](rungs/04-galaga/) · [live](https://sobevista.github.io/arcade-progression/rungs/04-galaga/) |
| 5 | **TI-99/4A: Hunt the Wumpus + Parsec** | 1980 / 1982 | the homage machine itself — deduction as a genre (Wumpus) and the ladder's first scrolling world, fuel, heat, speech (Parsec) | ✅ **PLAY** — [`rungs/05-ti994a/wumpus/`](rungs/05-ti994a/wumpus/) · [`rungs/05-ti994a/parsec/`](rungs/05-ti994a/parsec/) · [wumpus live](https://sobevista.github.io/arcade-progression/rungs/05-ti994a/wumpus/) · [parsec live](https://sobevista.github.io/arcade-progression/rungs/05-ti994a/parsec/) |
| 6 | **TI-99/4A part II: Munch Man + Anteater** | 1982 / 1983 | law and distribution as constraints — the lawsuit-forced chain inversion (Munch Man) and player-dug tunnels the enemies share, plus a weapon aimed with time (Anteater) | ✅ **PLAY** — [`rungs/06-ti994a-2/munchman/`](rungs/06-ti994a-2/munchman/) · [`rungs/06-ti994a-2/anteater/`](rungs/06-ti994a-2/anteater/) · [munchman live](https://sobevista.github.io/arcade-progression/rungs/06-ti994a-2/munchman/) · [anteater live](https://sobevista.github.io/arcade-progression/rungs/06-ti994a-2/anteater/) |
| 7 | NES | 1985+ | tile maps, scrolling, item state | queued |

Rungs are numbered by build order, not strictly by year — Breakout is a backfill, built
third because it is the causal link between Pong and Space Invaders.

All playable games carry: a high score table with initials, a swivel stick for
touch, synthesised audio, and the TI-99/4A palette. The rung-5 and rung-6 games
additionally carry the **in-game feedback contract** — a FEEDBACK button (or `F`)
that pauses play and ships a context-stamped report as a prefilled GitHub issue or
to the clipboard, so testers can report the moment they see something without
leaving the game. (Rollout to rungs 2–4 awaits the pilot verdict.)

## Releasing a rung (pacing the learning)

Each game is a **self-contained cog**: one HTML file, zero dependencies, zero external
requests. Verified mechanically by `tools/conformance.js` (`standalone` check), not assumed.
You can copy any `rungs/NN-name/index.html` onto a USB stick, into an email, or onto a
different site and it runs unchanged.

That means releases can be paced — one game at a time, so the lessons land instead of
blurring together.

**Soft gate (normal use).** Edit `releases.json`:

```json
{ "released": ["02-invaders"] }
```

Push. The landing page shows only listed rungs; the rest are dimmed to `NOT YET` with their
links removed, so the shape of the journey stays visible but only the current game is
offered. No build step, no code change.

> **What "soft" means, honestly:** this controls what is *advertised*, not what *exists*.
> An unlisted rung is still deployed and still reachable by typing its URL. That is fine for
> pacing a family; it is not privacy.

**Hard gate (genuinely not published).** Keep the new rung on a branch and merge it to
`main` only at release:

```powershell
git checkout -b rung-04-galaga
# ...build, playtest...
git push -u origin rung-04-galaga      # not on the live site yet
# at release:
git checkout main; git merge rung-04-galaga; git push
```

Pages only ever serves `main`, so an unmerged rung is genuinely absent from the internet.

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
  playtest-sim.js      tiered simulated players (firstTimer/novice/competent/expert/ceiling)
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
