  // ---- more instruments, for the city and orbit worlds ----
  function brass(S, m, t, o = {}) {   // a CS-80 style brass swell: detuned saws, the filter opening slowly, late vibrato
    const ctx = S.ctx, a = ctx.createOscillator(), b = ctx.createOscillator(), lp = ctx.createBiquadFilter(), g = ctx.createGain(), p = ctx.createStereoPanner();
    const vib = ctx.createOscillator(), vg = ctx.createGain();
    const att = o.att || 1.6, hold = o.hold || 1.5, rel = o.rel || 3, vol = o.vol || 0.05;
    a.type = b.type = 'sawtooth'; a.frequency.value = b.frequency.value = mtof(m); a.detune.value = -9; b.detune.value = 9;
    vib.frequency.value = rnd(4.6, 5.6); vg.gain.setValueAtTime(0, t); vg.gain.linearRampToValueAtTime(9, t + att + 0.6); vib.connect(vg); vg.connect(a.detune); vg.connect(b.detune);
    lp.type = 'lowpass'; lp.Q.value = 3.5;
    lp.frequency.setValueAtTime(260, t); lp.frequency.linearRampToValueAtTime(o.cut || 2400, t + att); lp.frequency.linearRampToValueAtTime((o.cut || 2400) * 0.45, t + att + hold + rel);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + att); g.gain.setValueAtTime(vol, t + att + hold); g.gain.linearRampToValueAtTime(0, t + att + hold + rel);
    a.connect(lp); b.connect(lp); lp.connect(g); g.connect(p); p.pan.value = o.pan || 0;
    route(S, p, 0.55, 1.0, o.delay || 0.2);
    [a, b, vib].forEach(x => { x.start(t); x.stop(t + att + hold + rel + 0.1); }); a.onended = () => p.disconnect();
  }
  function rain(S, level, t) {   // rain on a roof: a hiss, a softer roar under it, and drips close by
    const ctx = S.ctx, rel = ctx.createGain(); route(S, rel, 1, 0.15);
    const hiss = ctx.createBufferSource(), hp = ctx.createBiquadFilter(), hg = ctx.createGain();
    hiss.buffer = S.noise; hiss.loop = true; hiss.playbackRate.value = 2.2; hp.type = 'highpass'; hp.frequency.value = 2600; hg.gain.value = level * 0.45;
    hiss.connect(hp); hp.connect(hg); hg.connect(rel);
    const roar = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), rg = ctx.createGain();
    roar.buffer = S.noise; roar.loop = true; bp.type = 'bandpass'; bp.frequency.value = 600; bp.Q.value = 0.5; rg.gain.value = level * 1.1;
    roar.connect(bp); bp.connect(rg); rg.connect(rel);
    hiss.start(t, rnd(0, 3)); roar.start(t, rnd(0, 3));
    rel.gain.setValueAtTime(0, t); rel.gain.linearRampToValueAtTime(1, t + 1.2);
    let next = t + 0.2;
    return {
      schedule(t0, t1) {
        if (next < t0 - 0.5) next = t0;
        while (next < t1) {
          const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(), pn = ctx.createStereoPanner();
          s.buffer = S.noise; f.type = 'bandpass'; f.frequency.value = rnd(1800, 5200); f.Q.value = rnd(6, 14);
          g.gain.setValueAtTime(0.0001, next); g.gain.exponentialRampToValueAtTime(level * rnd(2, 7), next + 0.002); g.gain.exponentialRampToValueAtTime(0.0001, next + rnd(0.03, 0.08));
          pn.pan.value = rnd(-0.9, 0.9); s.connect(f); f.connect(g); g.connect(pn); pn.connect(rel);
          s.start(next, rnd(0, 3)); s.stop(next + 0.1); s.onended = () => pn.disconnect();
          next += rnd(0.03, 0.22);
        }
      },
      stop(at) { rel.gain.setValueAtTime(1, at); rel.gain.linearRampToValueAtTime(0, at + 2); hiss.stop(at + 2.1); roar.stop(at + 2.1); hiss.onended = () => rel.disconnect(); },
    };
  }
  function snare(S, t, vol = 0.1) {   // a big eighties snare: noise and a short tone into a long reverb
    const ctx = S.ctx, s = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = S.noise; s.playbackRate.value = 1.8; bp.type = 'bandpass'; bp.frequency.value = 2400; bp.Q.value = 0.6;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol * 4, t + 0.003); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    s.connect(bp); bp.connect(g); route(S, g, 1, 0.9); s.start(t, rnd(0, 3)); s.stop(t + 0.25); s.onended = () => g.disconnect();
    const o = ctx.createOscillator(), og = ctx.createGain(); o.type = 'triangle'; o.frequency.setValueAtTime(220, t); o.frequency.exponentialRampToValueAtTime(150, t + 0.08);
    og.gain.setValueAtTime(0.0001, t); og.gain.exponentialRampToValueAtTime(vol, t + 0.002); og.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    o.connect(og); route(S, og, 1, 0.5); o.start(t); o.stop(t + 0.14); o.onended = () => og.disconnect();
  }
  function bleep(S, f, t, o = {}) {   // a short telemetry tone
    const ctx = S.ctx, osc = ctx.createOscillator(), g = ctx.createGain(), p = ctx.createStereoPanner(), d = o.dur || 0.07;
    osc.type = o.wave || 'sine'; osc.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(o.vol || 0.03, t + 0.004); g.gain.setValueAtTime(o.vol || 0.03, t + d); g.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.03);
    p.pan.value = o.pan || 0; osc.connect(g); g.connect(p); route(S, p, 0.8, o.verb == null ? 0.5 : o.verb, o.delay || 0.35);
    osc.start(t); osc.stop(t + d + 0.05); osc.onended = () => p.disconnect();
  }
  function sonar(S, m, t, vol = 0.05) {   // a slow ping that rings out into the delay
    bell(S, m, t, { vol, dur: 4.5, ratio: 1, index: 0.25, att: 0.01, pan: rnd(-0.4, 0.4), verb: 1, delay: 0.7, dry: 0.5 });
  }
  function crackle(S, t, vol = 0.01) {   // a burst of radio static
    const ctx = S.ctx, s = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), g = ctx.createGain(), p = ctx.createStereoPanner(), d = rnd(0.15, 0.6);
    s.buffer = S.noise; s.playbackRate.value = 3; bp.type = 'bandpass'; bp.frequency.value = rnd(1200, 3200); bp.Q.value = 1.5;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    p.pan.value = rnd(-0.7, 0.7); s.connect(bp); bp.connect(g); g.connect(p); route(S, p, 1, 0.3);
    s.start(t, rnd(0, 3)); s.stop(t + d + 0.02); s.onended = () => p.disconnect();
  }
  function subPulse(S, m, t, vol = 0.16, dec = 0.32) {   // a pitched, rounded sub hit
    const ctx = S.ctx, o = ctx.createOscillator(), g = ctx.createGain(), sh = ctx.createWaveShaper();
    const c = new Float32Array(256); for (let i = 0; i < 256; i++) { const x = i / 127.5 - 1; c[i] = Math.tanh(x * 1.6); } sh.curve = c;
    o.type = 'sine'; o.frequency.setValueAtTime(mtof(m) * 2, t); o.frequency.exponentialRampToValueAtTime(mtof(m), t + 0.04);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + dec);
    o.connect(sh); sh.connect(g); route(S, g, 1, 0.05); o.start(t); o.stop(t + dec + 0.05); o.onended = () => g.disconnect();
  }
  // a chord sequence that moves on by itself, with equal-power crossfades between pads
  function cycler(S, chords, secs, padOpts, t) {
    let p = null, i = -1, next = t;
    return {
      get chord() { return chords[Math.max(0, i)]; },
      schedule(t0, t1) {
        if (next < t0 - 1) next = t0;
        while (next < t1) {
          i = (i + 1) % chords.length; const c = chords[i];
          if (p) p.release(next, padOpts.xfade || 4);
          p = pad(S, c, next, Object.assign({ eq: true }, padOpts, { attack: p ? (padOpts.xfade || 4) : (padOpts.first || 1.5) }));
          next += secs;
        }
      },
      stop(at) { if (p) p.release(at, 2.5); },
    };
  }
