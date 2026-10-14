const SoundKit = (() => {
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const curve = f => { const c = new Float32Array(64); for (let i = 0; i < 64; i++) c[i] = f(i / 63); return c; };
  const RISE = curve(x => Math.sin(x * Math.PI / 2)), FALL = curve(x => Math.cos(x * Math.PI / 2));   // equal-power crossfades
  // Work, Capabilities, AI, Contact, About. Melody notes ("top") stay inside D major pentatonic plus colour tones.
  const CHORDS = [
    { bass: 38, notes: [50, 54, 57, 61, 64], top: [69, 73, 76, 78, 81] },   // Dmaj9
    { bass: 35, notes: [47, 54, 57, 62, 64], top: [66, 69, 71, 74, 76] },   // Bm11
    { bass: 33, notes: [45, 52, 57, 59, 64], top: [69, 71, 73, 76, 78] },   // Aadd9, for AI
    { bass: 31, notes: [50, 54, 57, 59, 61], top: [66, 69, 71, 73, 74, 78] },   // Gmaj9#11
    { bass: 40, notes: [47, 54, 55, 59, 62], top: [66, 67, 71, 74, 78] },   // Em9
    { bass: 42, notes: [49, 54, 57, 59, 64], top: [66, 69, 71, 73, 76] },   // F#m11, for the Resource Centre
  ];

  function noiseBuffer(ctx) {
    const len = ctx.sampleRate * 4, b = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = b.getChannelData(ch); let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.997 * b0 + w * 0.029; b1 = 0.985 * b1 + w * 0.032; b2 = 0.95 * b2 + w * 0.048;
        d[i] = (b0 + b1 + b2) * 0.9;
      }
    }
    return b;
  }
  function impulse(ctx, secs, decay) {   // a soft, dark hall
    const len = Math.floor(ctx.sampleRate * secs), b = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = b.getChannelData(ch); let lp = 0;
      for (let i = 0; i < len; i++) {
        const x = i / len; lp += ((Math.random() * 2 - 1) - lp) * (0.62 - 0.5 * x);
        d[i] = lp * Math.pow(1 - x, decay) * (i < ctx.sampleRate * 0.012 ? i / (ctx.sampleRate * 0.012) : 1);
      }
    }
    return b;
  }

  // shared effects: compressor, reverb and a ping-pong delay; each mood gets its own level into them
  function bus(ctx, dest) {
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.knee.value = 14; comp.ratio.value = 3; comp.attack.value = 0.02; comp.release.value = 0.4;
    comp.connect(dest);
    const dry = ctx.createGain(); dry.connect(comp);
    const verb = ctx.createConvolver(); verb.buffer = impulse(ctx, 5, 2.6);
    const verbIn = ctx.createGain(), verbOut = ctx.createGain(); verbOut.gain.value = 0.85;
    verbIn.connect(verb); verb.connect(verbOut); verbOut.connect(comp);
    const dIn = ctx.createGain(), tone = ctx.createBiquadFilter(), dl = ctx.createDelay(2), dr = ctx.createDelay(2);
    const fb = ctx.createGain(), merge = ctx.createChannelMerger(2), dOut = ctx.createGain(), dVerb = ctx.createGain();
    tone.type = 'lowpass'; tone.frequency.value = 2400; fb.gain.value = 0.36; dOut.gain.value = 0.7; dVerb.gain.value = 0.35;
    dl.delayTime.value = dr.delayTime.value = 0.42;
    dIn.connect(tone); tone.connect(dl); dl.connect(dr); dr.connect(fb); fb.connect(tone);
    dl.connect(merge, 0, 0); dr.connect(merge, 0, 1); merge.connect(dOut); dOut.connect(comp); dOut.connect(dVerb); dVerb.connect(verbIn);
    const noise = noiseBuffer(ctx);
    const A = {
      ctx, noise,
      delayTime(s) { const t = ctx.currentTime; dl.delayTime.setTargetAtTime(s, t, 0.05); dr.delayTime.setTargetAtTime(s, t, 0.05); },
      sub(level) {   // a mood's own entry points into the shared effects
        const g = [ctx.createGain(), ctx.createGain(), ctx.createGain()];
        g.forEach(x => { x.gain.value = level; }); g[0].connect(dry); g[1].connect(verbIn); g[2].connect(dIn);
        return { ctx, noise, dry: g[0], verbIn: g[1], dIn: g[2], delayTime: A.delayTime, dispose(at) { setTimeout(() => g.forEach(x => x.disconnect()), Math.max(0, (at - ctx.currentTime) * 1000) + 8000); } };
      },
    };
    return A;
  }
  function route(S, node, dry = 1, verb = 0, delay = 0) {
    const c = S.ctx;
    if (dry) { const g = c.createGain(); g.gain.value = dry; node.connect(g); g.connect(S.dry); }
    if (verb) { const g = c.createGain(); g.gain.value = verb; node.connect(g); g.connect(S.verbIn); }
    if (delay) { const g = c.createGain(); g.gain.value = delay; node.connect(g); g.connect(S.dIn); }
  }

  // ---- instruments ----
  function pad(S, chord, t, o) {
    const ctx = S.ctx, env = ctx.createGain(), rel = ctx.createGain(), lp = ctx.createBiquadFilter();
    if (o.eq) { env.gain.value = 0; env.gain.setValueCurveAtTime(RISE.map(v => v * o.vol), t, o.attack); }
    else { env.gain.setValueAtTime(0, t); env.gain.linearRampToValueAtTime(o.vol, t + o.attack); }
    lp.type = 'lowpass'; lp.frequency.value = o.cutoff; lp.Q.value = o.q || 0.5;
    const lfo = ctx.createOscillator(), lfoG = ctx.createGain();
    lfo.frequency.value = rnd(0.03, 0.07); lfoG.gain.value = o.cutoff * 0.4; lfo.connect(lfoG); lfoG.connect(lp.frequency);
    const srcs = [lfo], notes = o.notes || chord.notes;
    notes.forEach((m, i) => {
      [-1, 1].forEach(side => {
        const osc = ctx.createOscillator(), g = ctx.createGain(), p = ctx.createStereoPanner();
        osc.type = o.wave || 'sawtooth'; osc.frequency.value = mtof(m);
        osc.detune.value = side * (o.detune == null ? 7 : o.detune) + rnd(-2, 2);
        g.gain.value = 1 / (notes.length * 2);
        p.pan.value = side * (0.2 + 0.5 * i / Math.max(1, notes.length - 1));
        osc.connect(g); g.connect(p); p.connect(lp); srcs.push(osc);
      });
    });
    lp.connect(env);
    if (o.sub) {
      const s = ctx.createOscillator(), sg = ctx.createGain();
      s.type = 'sine'; s.frequency.value = mtof(chord.bass); sg.gain.value = o.sub * 0.3; s.connect(sg); sg.connect(env); srcs.push(s);
      const h = ctx.createOscillator(), hg = ctx.createGain();   // an octave up so small speakers hear the root
      h.type = 'triangle'; h.frequency.value = mtof(chord.bass + 12); hg.gain.value = o.sub * 0.3; h.connect(hg); hg.connect(env); srcs.push(h);
    }
    env.connect(rel); route(S, rel, 1, o.verb == null ? 0.5 : o.verb, o.delay || 0);
    srcs.forEach(s => s.start(t));
    let done = false;
    return {
      release(t2, r = 3) {
        if (done) return; done = true;
        if (o.eq) rel.gain.setValueCurveAtTime(FALL, t2, r);
        else { rel.gain.setValueAtTime(1, t2); rel.gain.linearRampToValueAtTime(0, t2 + r); }
        srcs.forEach(s => s.stop(t2 + r + 0.1)); srcs[1].onended = () => rel.disconnect();
      },
    };
  }
  function bell(S, m, t, o = {}) {   // FM: glassy, a little metallic
    const ctx = S.ctx, f = mtof(m), car = ctx.createOscillator(), mod = ctx.createOscillator();
    const mg = ctx.createGain(), g = ctx.createGain(), p = ctx.createStereoPanner();
    const dur = o.dur || 3, vol = o.vol || 0.08, idx = o.index == null ? 1.5 : o.index;
    car.frequency.value = f; mod.frequency.value = f * (o.ratio || 3.5);
    mg.gain.setValueAtTime(f * idx, t); mg.gain.exponentialRampToValueAtTime(f * idx * 0.02 + 0.01, t + dur * 0.5);
    mod.connect(mg); mg.connect(car.frequency);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + (o.att || 0.005)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    p.pan.value = o.pan || 0;
    car.connect(g); g.connect(p); route(S, p, o.dry == null ? 1 : o.dry, o.verb == null ? 0.6 : o.verb, o.delay || 0);
    car.start(t); mod.start(t); car.stop(t + dur + 0.05); mod.stop(t + dur + 0.05);
    car.onended = () => p.disconnect();
  }
  function pluck(S, m, t, o = {}) {
    const ctx = S.ctx, a = ctx.createOscillator(), b = ctx.createOscillator(), bg = ctx.createGain();
    const lp = ctx.createBiquadFilter(), g = ctx.createGain(), p = ctx.createStereoPanner();
    const dec = o.dec || 0.4, vol = o.vol || 0.06;
    a.type = 'sawtooth'; a.frequency.value = mtof(m); a.detune.value = rnd(-4, 4);
    b.type = 'triangle'; b.frequency.value = mtof(m) * (o.low ? 0.5 : 1); bg.gain.value = 0.6;
    lp.type = 'lowpass'; lp.Q.value = o.q || 4;
    lp.frequency.setValueAtTime(o.cut || 2400, t); lp.frequency.exponentialRampToValueAtTime(220, t + dec * 0.7);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + dec);
    a.connect(lp); b.connect(bg); bg.connect(lp); lp.connect(g); g.connect(p); p.pan.value = o.pan || 0;
    route(S, p, 1, o.verb == null ? 0.25 : o.verb, o.delay || 0);
    a.start(t); b.start(t); a.stop(t + dec + 0.05); b.stop(t + dec + 0.05);
    a.onended = () => p.disconnect();
  }
  function thump(S, t, vol = 0.2) {   // a soft, rounded kick
    const ctx = S.ctx, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.12);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    o.connect(g); route(S, g, 1, 0.04);
    o.start(t); o.stop(t + 0.55); o.onended = () => g.disconnect();
  }
  function shaker(S, t, vol = 0.02) {
    const ctx = S.ctx, s = ctx.createBufferSource(), hp = ctx.createBiquadFilter(), g = ctx.createGain(), p = ctx.createStereoPanner();
    s.buffer = S.noise; hp.type = 'highpass'; hp.frequency.value = 6500;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol * 6, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    p.pan.value = rnd(-0.35, 0.35);
    s.connect(hp); hp.connect(g); g.connect(p); route(S, p, 1, 0.12);
    s.start(t, rnd(0, 3)); s.stop(t + 0.1); s.onended = () => p.disconnect();
  }
  function swell(S, m, t, o = {}) {   // a slow bowed tone that blooms and fades
    const ctx = S.ctx, a = ctx.createOscillator(), b = ctx.createOscillator(), bg = ctx.createGain();
    const lp = ctx.createBiquadFilter(), g = ctx.createGain(), p = ctx.createStereoPanner(), vib = ctx.createOscillator(), vg = ctx.createGain();
    const att = o.att || 4, rel = o.rel || 6, vol = o.vol || 0.04;
    a.type = 'triangle'; b.type = 'sine'; a.frequency.value = mtof(m); b.frequency.value = mtof(m) * 2; bg.gain.value = 0.25;
    vib.frequency.value = rnd(4, 5.2); vg.gain.value = 5; vib.connect(vg); vg.connect(a.detune); vg.connect(b.detune);
    lp.type = 'lowpass'; lp.frequency.value = o.cut || 1600;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + att); g.gain.linearRampToValueAtTime(0, t + att + rel);
    a.connect(lp); b.connect(bg); bg.connect(lp); lp.connect(g); g.connect(p); p.pan.value = o.pan || 0;
    route(S, p, 0.6, 0.9, o.delay || 0);
    [a, b, vib].forEach(x => { x.start(t); x.stop(t + att + rel + 0.1); });
    a.onended = () => p.disconnect();
  }
  function boom(S, t, vol = 0.2) {   // a distant, soft cinematic hit
    const ctx = S.ctx, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(70, t); o.frequency.exponentialRampToValueAtTime(38, t + 1.6);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t + 2.6);
    o.connect(g); route(S, g, 1, 0.5); o.start(t); o.stop(t + 2.7); o.onended = () => g.disconnect();
    const s = ctx.createBufferSource(), lp = ctx.createBiquadFilter(), ng = ctx.createGain();
    s.buffer = S.noise; lp.type = 'lowpass'; lp.frequency.setValueAtTime(900, t); lp.frequency.exponentialRampToValueAtTime(120, t + 1.4);
    ng.gain.setValueAtTime(0.0001, t); ng.gain.exponentialRampToValueAtTime(vol * 1.4, t + 0.02); ng.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
    s.connect(lp); lp.connect(ng); route(S, ng, 0.7, 0.8); s.start(t, rnd(0, 2)); s.stop(t + 1.7); s.onended = () => ng.disconnect();
  }
  function wind(S, level, t, o = {}) {   // a quiet bed of desert air under the music
    const ctx = S.ctx, s = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), lp = ctx.createBiquadFilter(), g = ctx.createGain(), rel = ctx.createGain();
    s.buffer = S.noise; s.loop = true; bp.type = 'bandpass'; bp.frequency.value = 480; bp.Q.value = 0.55; lp.type = 'lowpass'; lp.frequency.value = 1500;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(level, t + (o.quick ? 0.5 : 3));
    s.connect(bp); bp.connect(lp); lp.connect(g); g.connect(rel); route(S, rel, 1, 0.2);
    s.start(t, rnd(0, 3));
    let next = t + (o.quick ? 0.5 : 3);
    return {
      schedule(t0, t1) {
        if (next < t0 - 1) next = t0;
        while (next < t1) { bp.frequency.setTargetAtTime(rnd(280, 900), next, 1.4); g.gain.setTargetAtTime(level * rnd(0.72, 1.1), next, 2.2); next += rnd(1.8, 4.6); }
      },
      stop(at) { rel.gain.setValueAtTime(1, at); rel.gain.linearRampToValueAtTime(0, at + 2); s.stop(at + 2.1); s.onended = () => rel.disconnect(); },
    };
  }

  // ---- moods ----
  const MOODS = {
    golden: {
      label: 'Golden hour', note: 'Warm, slow chords that change as you turn the world, with the odd glint of a bell', level: 1.38,
      make(S, t) {
        let p = null, cur = 0, next = t + 2.5; const w = wind(S, 0.05, t);
        return {
          chord(i, at) {
            cur = i; if (p) p.release(at, 4.5);
            p = pad(S, CHORDS[i], at, { vol: 0.2, cutoff: 900, attack: 3.2, wave: 'sawtooth', detune: 8, sub: 0.35, verb: 0.55 });
          },
          schedule(t0, t1) {
            if (next < t0 - 0.5) next = t0 + 0.5;
            while (next < t1) {
              const up = Math.random() < 0.3 ? 12 : 0;
              bell(S, pick(CHORDS[cur].top) + up, next, { vol: 0.03, dur: 5, ratio: 2, index: 0.8, att: 0.03, pan: rnd(-0.6, 0.6), verb: 0.9, delay: 0.3, dry: 0.6 });
              next += rnd(3.5, 8);
            }
            w.schedule(t0, t1);
          },
          spark(v, at) { bell(S, pick(CHORDS[cur].top) + 12, at, { vol: 0.008 + 0.016 * v, dur: 2.5, ratio: 2, index: 0.6, att: 0.01, pan: rnd(-0.7, 0.7), verb: 0.9, delay: 0.3, dry: 0.4 }); },
          sparkGap: 260,
          stop(at) { if (p) p.release(at, 2.5); w.stop(at); },
        };
      },
    },
    mirage: {
      label: 'Mirage', note: 'Glassy notes shimmering in the heat. The dust chimes as your cursor moves through it', level: 1.36,
      make(S, t) {
        let d = null, cur = 0, next = t + 0.6;
        return {
          chord(i, at) {
            cur = i; const c = CHORDS[i];
            if (d) d.release(at, 4);
            d = pad(S, c, at, { notes: [c.bass + 12, c.bass + 19, c.bass + 24], vol: 0.13, cutoff: 520, attack: 3, wave: 'triangle', detune: 5, sub: 0.4, verb: 0.6 });
            if (at > t + 0.2) c.top.slice(0, 3).forEach((m, k) => bell(S, m + 12, at + k * 0.11, { vol: 0.04, dur: 2.5, ratio: 3.5, index: 1.1, pan: -0.4 + k * 0.4, verb: 0.7, delay: 0.35 }));
          },
          schedule(t0, t1) {
            if (next < t0 - 0.5) next = t0 + 0.2;
            while (next < t1) {
              const c = CHORDS[cur], m = pick(c.top) + (Math.random() < 0.35 ? 12 : 0);
              bell(S, m, next, { vol: rnd(0.03, 0.06), dur: rnd(2.5, 4.5), ratio: 3.5, index: rnd(0.9, 1.7), pan: rnd(-0.7, 0.7), verb: 0.75, delay: 0.4 });
              if (Math.random() < 0.18) bell(S, pick(c.top) + 12, next + 0.14, { vol: 0.025, dur: 2.5, ratio: 3.5, index: 1, pan: rnd(-0.7, 0.7), verb: 0.8, delay: 0.4 });
              next += Math.random() < 0.2 ? rnd(2.4, 4) : rnd(0.55, 1.6);
            }
          },
          spark(v, at) { bell(S, pick(CHORDS[cur].top) + 12, at, { vol: 0.012 + 0.03 * v, dur: 1.6, ratio: 3.5, index: 0.8, pan: rnd(-0.8, 0.8), verb: 0.8, delay: 0.3, dry: 0.6 }); },
          sparkGap: 120,
          stop(at) { if (d) d.release(at, 2.5); },
        };
      },
    },
    pulse: {
      label: 'Pulse', note: 'A soft beat under a plucked arpeggio. More forward energy, still relaxed', level: 1.9,
      make(S, t) {
        const E = 60 / 88 / 2, PAT = [0, 2, 4, 2, 1, 3, 5, 3];
        S.delayTime(E * 1.5);
        let p = null, cur = 0, want = 0, step = 0, nextT = t + 0.1;
        const tones = c => [...c.notes.map(m => m + 12), c.notes[1] + 24].sort((a, b) => a - b);
        return {
          chord(i) { want = i; },   // lands on the next bar line
          schedule(t0, t1) {
            if (nextT < t0 - 0.3) { step = Math.ceil(step / 8) * 8; nextT = t0 + 0.05; }
            while (nextT < t1) {
              const s = step % 8, bar = Math.floor(step / 8);
              if (s === 0 && (want !== cur || !p)) {
                cur = want; if (p) p.release(nextT, 2.5);
                p = pad(S, CHORDS[cur], nextT, { vol: 0.08, cutoff: 650, attack: 1.2, wave: 'sawtooth', detune: 9, sub: 0.45, verb: 0.45 });
              }
              const c = CHORDS[cur], tn = tones(c), idx = (bar % 4 === 3 ? [...PAT].reverse() : PAT)[s];
              pluck(S, tn[idx], nextT, { vol: s % 2 ? 0.055 : 0.075, dec: 0.36, cut: 2100 + 700 * Math.sin(bar * 0.7), pan: (idx / 5 - 0.5) * 0.8, verb: 0.25, delay: 0.3 });
              if (s === 0 || s === 3) pluck(S, c.bass + 12, nextT, { vol: 0.05, dec: 0.7, cut: 650, q: 2, low: true, verb: 0.08 });
              if (bar >= 1 && (s === 0 || s === 4)) thump(S, nextT, 0.15);
              if (bar >= 2 && s % 2 === 1) shaker(S, nextT, s === 3 || s === 7 ? 0.022 : 0.013);
              step++; nextT += E;
            }
          },
          spark() {}, sparkGap: 1e9,
          stop(at) { if (p) p.release(at, 2); S.delayTime(0.42); },
        };
      },
    },
    heat: {
      label: 'Heat', note: 'A deep, cinematic drone with slow swells, like a film score. Turning the world lands with a soft boom', level: 0.94,
      make(S, t) {
        let d = null, cur = 0, next = t + 1.5; const w = wind(S, 0.08, t, { quick: true });
        return {
          chord(i, at) {
            cur = i; const c = CHORDS[i];
            const first = !d;
            if (d) d.release(at, 4);
            d = pad(S, c, at, { notes: [c.bass, c.bass + 7, c.bass + 12, c.bass + 19, c.bass + 24], vol: 0.26, cutoff: 520, q: 1.2, attack: first ? 0.5 : 4, eq: true, wave: 'sawtooth', detune: 10, sub: 0.5, verb: 0.7 });
            if (at > t + 0.2) boom(S, at, 0.2);
          },
          schedule(t0, t1) {
            if (next < t0 - 0.5) next = t0 + 1;
            while (next < t1) {
              const c = CHORDS[cur];
              swell(S, pick(c.notes) + 12, next, { vol: 0.045, att: rnd(3, 5), rel: rnd(5, 7), pan: rnd(-0.5, 0.5) });
              if (Math.random() < 0.4) swell(S, pick(c.top), next + rnd(1, 2.5), { vol: 0.025, att: rnd(3, 4), rel: rnd(5, 7), pan: rnd(-0.6, 0.6), cut: 2200 });
              next += rnd(6, 10);
            }
            w.schedule(t0, t1);
          },
          spark() {}, sparkGap: 1e9,
          stop(at) { if (d) d.release(at, 3); w.stop(at); },
        };
      },
    },
  };
  return { MOODS, bus, CHORDS };
})();