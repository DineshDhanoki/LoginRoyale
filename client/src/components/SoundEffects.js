// small web-audio helper: click, spin, dice roll, win
export function createSfx() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();

  function click() {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = 880;
    g.gain.value = 0.02;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.06);
  }

  function spin() {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(200, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.45);
    g.gain.value = 0.02;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.45);
  }

  function dice() {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = 420;
    g.gain.value = 0.02;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.frequency.setValueAtTime(420, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.2);
    o.stop(ctx.currentTime + 0.25);
  }

  function win() {
    const o1 = ctx.createOscillator();
    const o2 = ctx.createOscillator();
    const g = ctx.createGain();
    o1.frequency.value = 660;
    o2.frequency.value = 880;
    g.gain.value = 0.02;
    o1.connect(g);
    o2.connect(g);
    g.connect(ctx.destination);
    o1.start();
    o2.start();
    o1.stop(ctx.currentTime + 0.18);
    o2.stop(ctx.currentTime + 0.26);
  }

  return { click, spin, dice, win };
}
