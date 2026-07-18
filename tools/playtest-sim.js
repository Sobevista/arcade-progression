/* =========================================================================
   PLAYTEST SIM — tiered simulated players for the arcade-progression rungs

   Why this exists
   ---------------
   Depending on a human for FIRST-pass testing is slow and burns the one oracle
   that catches what machines can't (INV-9). This harness handles the questions
   that are genuinely measurable — is the game winnable, how long does a level
   take, does difficulty scale sanely across skill — so human playtest is spent
   on the questions only a human can answer: does it feel right.

   It does NOT replace human testing. It clears the runway for it.

   The honesty constraint
   ----------------------
   A bot may only touch `sim.input` — the same virtual left/right/fire a human
   presses. It CANNOT set paddleX directly. So it is bound by the same paddle
   speed, the same clamping, the same serve rules. A harness that teleports the
   paddle is measuring nothing and will report whatever you hoped for.

   Usage (paste into the console on a rung page, or load via <script>):
     await PlaytestSim.report()             // all three tiers, formatted
     await PlaytestSim.run('adept', 25)     // one tier, raw results
   ========================================================================= */

const PlaytestSim = (() => {

  /* ---- Skill tiers ---------------------------------------------------
     Skill in a paddle game decomposes into four measurable things. These
     are deliberately parameters, not personalities — a tier is a point in
     a space we can move around, so "too hard" becomes a coordinate rather
     than an opinion.

       predictBounces  how far ahead they model the ball (0 = chase it)
       delayMs         reaction lag before acting on what they see
       errorPx         positional sloppiness, re-rolled periodically
       aims            do they use contact point deliberately, or just return  */
  const TIERS = {
    beginner:     { predictBounces: 0, delayMs: 260, errorPx: 16, aims: false },
    intermediate: { predictBounces: 1, delayMs: 130, errorPx: 8,  aims: false },
    adept:        { predictBounces: 3, delayMs: 55,  errorPx: 3,  aims: true  }
  };

  /* ---- Research benchmarks we score against --------------------------
     Sourced in ARCHAEOLOGY.md (A-11) and UX_DECISIONS.md (UX-22).        */
  const BENCH = {
    arcadeCreditSeconds: 180,   // a 1976 quarter was engineered to last ~3 min
    casualSessionLow:    180,   // modern casual: low end ~3 min
    casualSessionMid:    240,   //                mid    ~4 min
    casualSessionTop:    420    //                top quartile ~7 min
  };

  const DT = 1000 / 60;         // fixed tick; deterministic and fast
  /* Cap raised from 8 to 25 minutes on 2026-07-18: the first run reported
     totalSec === 480 for both stronger tiers, which was not a result, it was
     the cap. They were still playing wall 2 when the harness cut them off, and
     a truncated run silently misreports completion time as "the limit I chose".
     A benchmark that quietly returns its own configuration is worse than none. */
  const MAX_GAME_MS = 25 * 60 * 1000;

  /* ---- Ball landing prediction ---------------------------------------
     Project the ball to the paddle line, reflecting off the side walls up
     to `bounces` times. bounces = 0 means "just chase where it is now",
     which is exactly what a beginner does and why they get beaten by any
     ball with horizontal speed. */
  function predictLandingX(ball, g, bounces) {
    if (!ball) return null;
    if (bounces === 0) return ball.x;
    if (ball.vy <= 0) return ball.x;              // travelling away; no read yet

    let x = ball.x, y = ball.y, vx = ball.vx, vy = ball.vy, used = 0;
    const L = g.PLAY_L + g.BALL / 2, R = g.PLAY_R - g.BALL / 2;
    while (y < g.PADDLE_Y && used <= bounces) {
      const tToPaddle = (g.PADDLE_Y - y) / vy;
      const tToWall = vx > 0 ? (R - x) / vx : vx < 0 ? (L - x) / vx : Infinity;
      if (tToWall < tToPaddle && used < bounces) {
        x += vx * tToWall; y += vy * tToWall; vx = -vx; used++;
      } else {
        x += vx * tToPaddle; return x;
      }
    }
    return x;
  }

  /* ---- One simulated game -------------------------------------------- */
  function playOne(tierName) {
    const B = window.__breakout;
    const g = B.geom, tier = TIERS[tierName];
    const IN = B.sim.input;

    B.sim.reset();
    B.newGame();

    let t = 0, sinceRoll = 0, jitter = 0;
    const delayBuf = [];
    const wallClearedAt = [];
    let lastLevel = 1, ballsLostAt = [];
    let lastBalls = B.sim.observe().balls;

    while (t < MAX_GAME_MS) {
      const o = B.sim.observe();

      if (o.state === 'over' || o.state === 'won') break;

      // serve immediately when asked
      IN.fire = (o.state === 'serve' || o.state === 'title');

      // --- perceive (with lag): where will the ball arrive?
      let target = predictLandingX(o.ball, g, tier.predictBounces);
      if (target === null) target = o.paddleX + o.paddleW / 2;

      // adept aims: bias contact point toward whichever side still has bricks,
      // which is how a real player digs a tunnel up the side
      if (tier.aims && o.ball && o.ball.vy > 0) {
        const mid = g.W / 2;
        const bias = (o.paddleW * 0.30) * (target < mid ? 1 : -1);
        target += bias;
      }

      delayBuf.push(target);
      const lagTicks = Math.max(1, Math.round(tier.delayMs / DT));
      const seen = delayBuf.length > lagTicks
        ? delayBuf[delayBuf.length - 1 - lagTicks]
        : delayBuf[0];

      // --- sloppiness, re-rolled a few times a second (not per tick, or it
      //     averages out to perfect play and the tier stops meaning anything)
      sinceRoll += DT;
      if (sinceRoll > 200) { jitter = (Math.random() * 2 - 1) * tier.errorPx; sinceRoll = 0; }

      const aimAt = seen + jitter;
      const centre = o.paddleX + o.paddleW / 2;
      const dead = 2;
      IN.left  = centre - aimAt > dead;
      IN.right = aimAt - centre > dead;

      B.sim.step(DT);
      t += DT;

      const n = B.sim.observe();
      if (n.level !== lastLevel) { wallClearedAt.push(t); lastLevel = n.level; }
      if (n.balls < lastBalls) { ballsLostAt.push(t); lastBalls = n.balls; }
    }

    const f = B.sim.observe();
    if (f.state === 'won') wallClearedAt.push(t);
    B.sim.reset();

    return {
      tier: tierName,
      outcome: f.state === 'won' ? 'WON' : f.state === 'over' ? 'GAME OVER' : 'TIMEOUT',
      score: f.score,
      totalSeconds: +(t / 1000).toFixed(1),
      wallsCleared: wallClearedAt.length,
      firstWallSeconds: wallClearedAt.length ? +(wallClearedAt[0] / 1000).toFixed(1) : null,
      ballsLost: ballsLostAt.length,
      bricksLeft: f.bricksAlive,
      brokeThrough: f.brokeThrough,
      maxSpeedStep: f.speedStep
    };
  }

  /* ---- Stats ---------------------------------------------------------- */
  const median = a => { if (!a.length) return null;
    const s = [...a].sort((x, y) => x - y), m = s.length >> 1;
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
  const pct = (a, p) => { if (!a.length) return null;
    const s = [...a].sort((x, y) => x - y);
    return s[Math.min(s.length - 1, Math.floor(s.length * p))]; };

  function run(tierName, trials = 20) {
    const B = window.__breakout;
    const wasMuted = B.Sound.muted;
    if (!wasMuted) B.Sound.toggle();          // never blast audio during a sim
    const runs = [];
    for (let i = 0; i < trials; i++) runs.push(playOne(tierName));
    if (!wasMuted) B.Sound.toggle();

    const scores = runs.map(r => r.score);
    const firsts = runs.map(r => r.firstWallSeconds).filter(v => v !== null);
    return {
      tier: tierName, trials,
      clearedWall1Pct: Math.round(firsts.length / trials * 100),
      wonPct: Math.round(runs.filter(r => r.outcome === 'WON').length / trials * 100),
      scoreMedian: median(scores),
      scoreP25: pct(scores, 0.25), scoreP75: pct(scores, 0.75),
      firstWallSecMedian: median(firsts),
      firstWallSecP25: pct(firsts, 0.25), firstWallSecP75: pct(firsts, 0.75),
      totalSecMedian: median(runs.map(r => r.totalSeconds)),
      ballsLostMedian: median(runs.map(r => r.ballsLost)),
      breakthroughPct: Math.round(runs.filter(r => r.brokeThrough).length / trials * 100),
      raw: runs
    };
  }

  /* ---- Report against the researched criteria ------------------------- */
  function report(trials = 20) {
    const out = { benchmarks: BENCH, tiers: {} };
    for (const t of Object.keys(TIERS)) {
      const r = run(t, trials);
      delete r.raw;
      // grade level length against the 1976 coin-op target and modern casual bands
      const s = r.firstWallSecMedian;
      r.vsArcade180s = s === null ? 'never cleared a wall'
        : s < 120 ? 'faster than a 1976 credit'
        : s <= 240 ? 'within the ~180s coin-op window'
        : 'longer than a 1976 credit';
      r.vsCasualSession = r.totalSecMedian < BENCH.casualSessionLow ? 'under casual low (3m)'
        : r.totalSecMedian <= BENCH.casualSessionTop ? 'inside casual band (3-7m)'
        : 'above casual top quartile (7m)';
      out.tiers[t] = r;
    }
    // the shape that matters: does difficulty actually scale with skill?
    const b = out.tiers.beginner, i = out.tiers.intermediate, a = out.tiers.adept;
    out.skillGradient = {
      scoresAscend: b.scoreMedian <= i.scoreMedian && i.scoreMedian <= a.scoreMedian,
      clearRatesAscend: b.clearedWall1Pct <= i.clearedWall1Pct
                     && i.clearedWall1Pct <= a.clearedWall1Pct,
      beginnerNotHopeless: b.scoreMedian > 0,
      adeptNotTrivial: a.wonPct < 100
    };
    return out;
  }

  return { TIERS, BENCH, run, report, playOne, predictLandingX };
})();

if (typeof window !== 'undefined') window.PlaytestSim = PlaytestSim;
