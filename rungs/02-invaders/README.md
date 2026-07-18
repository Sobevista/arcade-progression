# INVADERS

A Space Invaders homage. One HTML file, no dependencies, no install, no build step.
Rendered in the TMS9918A palette — the 15 colours of the TI-99/4A.

---

## Play it right now

**Double-click `index.html`.** That's the whole thing.

It opens in your browser and runs. No server, no internet, no npm, nothing to install.
The entire game — code, graphics, sound — is inside that one file.

> If double-clicking opens a text editor instead of a browser: right-click →
> *Open with* → Chrome (or any browser).

### Controls

| | Keyboard | Touch |
|---|---|---|
| Move | `←` `→` (or `A` `D`) | ◀ ▶ buttons |
| Fire | `Space` (or `↑` / `W`) | FIRE button |
| Pause | `P` | PAUSE button |
| Back to title | `Esc` | TITLE button |
| Sound on/off | `M` | SOUND button |

One shot on screen at a time — that's deliberate, it's what makes it about timing.

---

## Share it with someone

Four ways, cheapest first. Pick the lowest one that does the job.

### 1. Just send the file
Email it, drop it in Drive, put it on a USB stick. They double-click it. Works offline,
works forever, no account needed. **This is the right answer for the kids and for anyone
you're handing it to directly.**

> Note: Gmail blocks `.html` attachments. Zip it first, or share it from Drive as a
> download link.

### 2. Serve it on your own machine (so phones on your wifi can play)
Useful for testing on a tablet without copying anything.

```powershell
cd "C:\Users\dansl\Claude\Lab\invaders"
python -m http.server 8731
```

Then on this PC open `http://localhost:8731`, or from a phone on the same wifi use
`http://<this-pc-ip>:8731` (find the IP with `ipconfig` — the IPv4 address).
Press `Ctrl+C` in that window to stop it.

### 3. Put it on the web free — GitHub Pages
This gives you a real URL anyone can open, no hosting bill. It's also the natural
graduation path for this build.

```powershell
cd "C:\Users\dansl\Claude\Lab\invaders"
git init -b main
git add -A
git commit -m "invaders: playable build"
gh repo create Sobevista/invaders --public --source . --push
gh api -X POST repos/Sobevista/invaders/pages -f source[branch]=main -f source[path]=/
```

Live a minute or two later at **`https://sobevista.github.io/invaders/`**.

*Success looks like:* the last command prints JSON containing an `html_url`.
*If it 404s at first:* Pages takes 1–2 minutes to build. Wait, then reload.

### 4. On b4him.com
Once the site exists, this file drops into it as-is — either as a downloadable in the
resources catalogue or embedded in a page with an `<iframe>`. Nothing about the game
needs to change; that's the payoff of keeping it dependency-free.

---

## Edit it

Open `index.html` in any text editor. It's ordinary JavaScript with comments, laid out
top to bottom in the order you'd want to read it:

| Section | What's there |
|---|---|
| `TI` | the 15-colour palette |
| `Sound` | every sound effect, generated in code — no audio files |
| sprites | the invaders/ship/UFO as ASCII art you can literally redraw |
| `GLYPHS` | the 5×7 font |
| bunkers | destructible shields, stored as a grid of true/false pixels |
| `update()` | all game logic per frame |
| `render()` | all drawing per frame |

Save, reload the browser. That's the whole loop. **No build step is the point** — you
should be able to change something and see it in two seconds.

Some knobs worth poking, near the top of the game-state section:

- `UFO_FIRST` / `UFO_GAP` — how often the mystery ship shows up
- `stepInterval()` — the speed ramp as ranks thin (560 ms → 40 ms)
- `waveStartY()` — how much lower each wave begins
- `SUB_PX` — collision precision (**don't raise this**, see `INVARIANTS.md` INV-1)

---

## What's in this folder

| File | What it is |
|---|---|
| `index.html` | the game — the only file you need to play or share |
| `SCOPE.md` | what was being tested and the pass criteria, locked before building |
| `RUN_LOG.md` | what actually happened, wrong turns included |
| `INVARIANTS.md` | laws earned from things going wrong — the real deliverable |
| `UX_DECISIONS.md` | design choices, their tradeoffs, and what would change them |

---

## Not in this build

- **Bonus / challenging stages** — that's a Galaga structure, queued for the next build
- **Capture-and-rescue beam** — same
- The mystery ship (red saucer, 50–300 pts) **does** exist, roughly every 20–30 seconds
