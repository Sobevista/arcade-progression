# RESUME — Arcade Progression

*Cold-start entry point. Read this first, then the files it names. Do not reconstruct
state from memory — everything current is in a file below.*

## What this is

A chronological walk through arcade history, one playable browser game per rung, where
the accumulating **`INVARIANTS.md`** is the actual product. Pong → Breakout → Space
Invaders → Galaga → TI-99/4A → NES.

It is also a homage: Daniel's father was a techie whose machine was the TI-99/4A, and
whose first lesson to him was **"guess and click"** — the phrase that is now the
teaching clause in Daniel's operating system and the method he teaches his own kids.
The homage lives in the craft (the TI palette, the fidelity work), never in dedication
text on a screen.

## Read these, in order

1. **`BUILD_OUTLINE.md`** — LOCKED decisions, OPEN questions, and the STATE OF BUILD log
   whose last entry names the single next action. **This is the current state.**
2. **`ARCHAEOLOGY.md`** — what the original builders faced and the Suffering Ledger.
   Read this *before* the invariants; it explains why the rest exists.
3. **`INVARIANTS.md`** — the laws earned so far. Read before writing any game code;
   several were bought expensively and will not be obvious.
4. **`UX_DECISIONS.md`** — the design map, what was chosen, and what would change it.
5. The rung you're working on: `rungs/NN-name/SCOPE.md` then its `RUN_LOG.md`.

## How to work here

- **Archaeology first, always.** Before any code on a new rung: research the original
  machine, its constraints, and what those forced the designers to invent — **sourced,
  not recalled** — and write it into `ARCHAEOLOGY.md` along with a Suffering Ledger
  saying which constraints we keep and why. Rung 2 was built the other way round and
  shipped two mechanics wrong from confident memory. Research is cheap.
- **Build:** one HTML file per game, vanilla JS + Canvas, zero dependencies, no build
  step. Open by double-clicking. If that stops being true, something has gone wrong.
- **Before building a rung:** write `SCOPE.md` first — what's under test, binary pass
  criteria checkable by something other than you, blast radius, abort condition. A
  scope written afterwards always passes.
- **While building:** append to `RUN_LOG.md` as you go. Wrong turns stay in. A log
  tidied afterwards is a press release.
- **Verify by running it**, not by asserting it. Ship a read-only test hook
  (`window.__<game>`) and drive the pass criteria through it in a real browser.
- **Then playtest with a human.** This is a gate, not a courtesy — see INV-9.
- **Tag every claim.** VERIFIED = you observed it directly this session.
  ASSUMED = you didn't. Fidelity claims about the original arcade game are ASSUMED
  until a source is checked (INV-10 — this cost two wrong mechanics on rung 2).

## Where things live

- **This repo is the only home** for the progression. Nothing authoritative lives in a
  chat, a scratch folder, or anyone's memory.
- **Rung 1 (Pong)** is `Sobevista/Pong_Tower-Repo` — Python/pygame, and Daniel's to
  engineer by hand. Not ported here, not touched by agents.
- **Cross-project doctrine** lives in the harness (`Sobevista/harness` → `START_HERE.md`).
  Lessons flow UP from here into it; the harness never depends on this repo.

## Run it

Double-click `rungs/02-invaders/index.html`. That's the whole setup — no server, no
install, no internet. Sharing options are in that rung's `README.md`.
