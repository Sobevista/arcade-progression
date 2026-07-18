# RUN LOG — Rung 6 (Munch Man + Anteater)

*Append-only. Wrong turns stay in. A log tidied afterwards is a press release.*

## 2026-07-19 — session open (rung 6 chat)

- Entry ritual run in the harness; Daniel's docket: Munch Man + Anteater, archaeology
  first. Browser-tool pre-approval staged for Daniel's one-paste apply (auto-mode
  classifier correctly refused to let the session grant itself permissions — that's
  INV-18 thinking applied to us, and it held).
- **Archaeology landed before any code** (A-21..A-24): the lawsuit-as-level-designer
  (1981 dots prototype → K.C. Munchkin injunction 1982-03-02 → chain inversion),
  tunnels-as-shared-attack-surface, the delayed-fuse egg aimed by retracing, Romox
  ECPC dial-up cartridge kiosks (patent 4,597,058). Suffering Ledger written; five
  Open/unverified items tagged rather than guessed — including a real source conflict
  on Munch Man's invisible levels (Wikipedia vs 4A-Pedia).
- SCOPE.md locked. Two deliberate process choices: sim-evidence bars framed as ratios
  vs null bots (the W9 lesson — no more invented percentages), and Munch Man's sourced
  `* # *` "Test Score" mode adopted as the sim's own level-jump instrument.
- Feedback contract extended to rung 6 as an [ASSUMED default] Daniel can strike —
  the rung-5 pilot's family playtest hasn't run yet.

## 2026-07-19 — build + verification (same session)

- **Munch Man built.** Maze validates itself at load (flood fill throws on an
  incomplete maze — INV-19 applied to level data). Three defects caught by reading
  my own diff before first run: warp-edge oscillation in the mover (seek-centre
  logic would reverse an entity that had just left the centre), chain missing the
  spawn cell, convoluted eyes-respawn block. All fixed statically.
- First smoke test: movement, chain, scoring, pen release, kill, respawn-with-
  chain-persisting all worked in one probe (red killed the bot mid-run — as designed).
- **Anteater built** on the same mover + scaffold. First smoke test accidentally
  demonstrated the rung's thesis: bot dug a shaft to the surface and the eater used
  that same shaft to come down and kill it. Zero tunnel violations.
- Browser pane refused both file:// and a hand-rolled localhost server; serving via
  `.claude/launch.json` + preview_start (the pane only trusts servers it started).
- **INV-20 born:** during the 80-game flee sweep, yellow escaped the maze through a
  wall — float overshoot past a cell centre skips the direction pick. Crash at game
  21 of 40 was the lucky LOUD case; in-bounds escapes would read as AI weirdness.
  Fix: snap-to-centre on arrival, both games (shared mover). Proof: 80 games, zero
  escapes, containment asserted every sample.
- **Ramp cap retuned 135% → 108%** after the bot proved round 20 unwinnable: an
  authored ceiling above the playability wall is just a different overflow (A-18 on
  ourselves). Round-20 HUMAN winnability still unverified — bot ceiling < human
  ceiling with energizer resets; family playtest question, on the record.
- **T6 crush test mis-sequenced on first attempt** (rock settled into its one-cell
  hole before the eater was parked) — rebuilt as a deep-shaft scenario; crush
  verified at exactly +300.
- **T9 MISS as written, not silently re-barred (W9 shape):** kite 9 kills / 10
  games vs skilled-movement-random-eggs 3 vs all-random 0. Timing premium = 3x,
  bar said 10x, bar was a guess. Flagged for Daniel's ruling; candidate re-measure
  named (kills per egg) but not adopted post-hoc.
- Full evidence tables in `tools/SIM_RESULTS.md`. Both games 12/12 CONFORMANT,
  docs flipped together, releases.json untouched.

## 2026-07-19 — Daniel's first playtest (minutes after push) — two hits

The feedback loop worked at chat speed. Both reports were **testimony about the
original** (Daniel played it on his dad's machine), and both beat my [ASSUMED]
choices — written sources are silent on each:

- **Ant coasted perpetually** — never a decision, just the shared mover's default
  slipping past the Suffering Ledger. FIXED per Daniel's call: stop at the next
  cell centre on stick release (UX-32). Verified: frozen at a centre after
  release, one full second sampled.
- **Rocks sat forever after falling** — my [ASSUMED] obstacle behaviour; Daniel
  remembers them exploding, Dig Dug precedent agrees. FIXED: shatter on landing,
  tunnel stays open (UX-33). Verified: state `done`, socket and landing cells
  both AIR, crush-during-fall still kills (+300), tunnel rule still 0 violations.

Lesson repeated from rung 2's founding: the sources you can reach are not the
only sources — **the family IS a primary source for this machine.**
