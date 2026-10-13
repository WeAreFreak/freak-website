    // ---- the city ----
    neonrain: {
      label: 'Neon rain', note: 'Lush, slow synth chords and brass swells over the rain, in the spirit of an eighties sci-fi score', level: 1.1,
      make(S, t) {
        const CH = [
          { bass: 37, notes: [49, 56, 59, 63, 64], top: [68, 71, 73, 75, 76, 80] },   // C#m9
          { bass: 33, notes: [45, 52, 56, 59, 61], top: [68, 71, 73, 76, 80] },       // Amaj9
          { bass: 30, notes: [54, 57, 59, 61, 64], top: [66, 69, 73, 76, 78] },       // F#m11
          { bass: 32, notes: [52, 56, 59, 63, 66], top: [68, 71, 75, 78, 80] },       // E/G#
        ];
        const cyc = cycler(S, CH, 11, { vol: 0.2, cutoff: 1150, q: 1.6, wave: 'sawtooth', detune: 14, sub: 0.5, verb: 0.85, xfade: 4.5, first: 2.5 }, t + 0.1);
        const r = rain(S, 0.035, t); let next = t + 4, thunder = t + rnd(20, 35);
        return {
          chord() {},
          schedule(t0, t1) {
            cyc.schedule(t0, t1); r.schedule(t0, t1);
            if (next < t0 - 0.5) next = t0 + 2;
            while (next < t1) {   // a short brass phrase now and then
              const c = cyc.chord, n = 1 + Math.floor(Math.random() * 3); let at = next;
              for (let k = 0; k < n; k++) { const d = rnd(1.4, 2.6); brass(S, pick(c.top) - (Math.random() < 0.5 ? 12 : 0), at, { vol: 0.045, att: d * 0.6, hold: d * 0.5, rel: 3.5, pan: rnd(-0.4, 0.4) }); at += d; }
              next = at + rnd(5, 10);
            }
            if (thunder < t1) { boom(S, thunder, 0.13); thunder += rnd(30, 55); }
          },
          spark() {}, sparkGap: 1e9,
          stop(at) { cyc.stop(at); r.stop(at); },
        };
      },
    },
    nightdrive: {
      label: 'Night drive', note: 'Synthwave: a driving bass line, gated chords, an echoing arpeggio and a big snare', level: 2.2,
      make(S, t) {
        const BPM = 96, E = 60 / BPM / 4;   // sixteenths
        S.delayTime(E * 3);
        const CH = [
          { bass: 33, notes: [57, 60, 64, 67], top: [69, 72, 76, 79] },   // Am7
          { bass: 29, notes: [57, 60, 65, 69], top: [69, 72, 77, 81] },   // Fmaj7
          { bass: 36, notes: [55, 60, 64, 67], top: [67, 72, 76, 79] },   // C
          { bass: 31, notes: [55, 59, 62, 67], top: [67, 71, 74, 79] },   // G
        ];
        let step = 0, nextT = t + 0.1, p = null;
        const BASS = [0, 0, 12, 0, 0, 12, 0, 7, 0, 0, 12, 0, 0, 12, 7, 12];
        return {
          chord() {},
          schedule(t0, t1) {
            if (nextT < t0 - 0.3) { step = Math.ceil(step / 16) * 16; nextT = t0 + 0.05; }
            while (nextT < t1) {
              const s = step % 16, bar = Math.floor(step / 16), c = CH[Math.floor(bar / 2) % 4];
              if (s === 0 && bar % 2 === 0) { if (p) p.release(nextT, 0.6); p = pad(S, c, nextT, { vol: 0.07, cutoff: 1500, q: 1, attack: 0.4, wave: 'sawtooth', detune: 12, verb: 0.6 }); }
              pluck(S, c.bass + 12 + BASS[s], nextT, { vol: 0.07, dec: 0.18, cut: 900 + 500 * Math.sin(bar * 0.9 + s * 0.2), q: 6, low: true, verb: 0.05 });
              if (bar >= 1 && s % 2 === 0) { const tn = c.top, k = (s / 2) % tn.length; pluck(S, tn[(k * 2) % tn.length] + (s % 8 === 6 ? 12 : 0), nextT, { vol: 0.035, dec: 0.25, cut: 3200, pan: ((s % 4) - 1.5) * 0.4, verb: 0.3, delay: 0.5 }); }
              if (bar >= 2 && (s === 0 || s === 8)) thump(S, nextT, 0.17);
              if (bar >= 2 && (s === 4 || s === 12)) snare(S, nextT, 0.07);
              if (bar >= 3 && s % 2 === 1) shaker(S, nextT, 0.012);
              step++; nextT += E;
            }
          },
          spark() {}, sparkGap: 1e9,
          stop(at) { if (p) p.release(at, 1.5); S.delayTime(0.42); },
        };
      },
    },
    wire: {
      label: 'Wire', note: 'Dark and minimal: a low pulse, metallic pings in the echo and the rain, like a signal in the network', level: 1.7,
      make(S, t) {
        const E = 60 / 112 / 4; S.delayTime(E * 3);
        const D = { bass: 26, notes: [38, 45, 50, 52, 53], top: [62, 65, 67, 69, 72, 74] };   // Dm(add9)
        const drone = pad(S, D, t + 0.1, { vol: 0.12, cutoff: 420, q: 2.5, attack: 2, eq: true, wave: 'triangle', detune: 6, sub: 0.3, verb: 0.6 });
        const r = rain(S, 0.02, t); let step = 0, nextT = t + 0.2;
        return {
          chord() {},
          schedule(t0, t1) {
            r.schedule(t0, t1);
            if (nextT < t0 - 0.3) { step = Math.ceil(step / 16) * 16; nextT = t0 + 0.05; }
            while (nextT < t1) {
              const s = step % 16, bar = Math.floor(step / 16);
              if (s % 4 === 0) subPulse(S, 38, nextT, s === 0 ? 0.17 : 0.11, 0.3);
              if (s === 14 && bar % 2) subPulse(S, 38, nextT, 0.08, 0.2);
              if (bar >= 1 && Math.random() < (s % 4 === 2 ? 0.45 : 0.12)) bell(S, pick(D.top) + (Math.random() < 0.3 ? 12 : 0), nextT, { vol: 0.03, dur: 1.4, ratio: 1.41, index: 2.6, pan: rnd(-0.8, 0.8), verb: 0.4, delay: 0.55, dry: 0.7 });
              if (bar >= 2 && s % 2 === 1) shaker(S, nextT, s % 4 === 3 ? 0.012 : 0.006);
              step++; nextT += E;
            }
          },
          spark() {}, sparkGap: 1e9,
          stop(at) { drone.release(at, 2.5); r.stop(at); S.delayTime(0.42); },
        };
      },
    },
    // ---- orbit ----
    orbit: {
      label: 'Orbit', note: 'Vast, slow organ-like chords with shimmering high notes. No beat, just space', level: 1.35,
      make(S, t) {
        const CH = [
          { bass: 40, notes: [52, 59, 63, 66, 71], top: [75, 78, 80, 83, 87] },   // Emaj9
          { bass: 36, notes: [48, 55, 59, 62, 66], top: [74, 78, 79, 83, 86] },   // Cmaj7#11
          { bass: 33, notes: [45, 52, 56, 59, 64], top: [71, 73, 76, 80, 83] },   // Amaj9
          { bass: 35, notes: [47, 54, 59, 61, 66], top: [73, 75, 78, 83, 85] },   // Bsus
        ];
        const cyc = cycler(S, CH, 14, { vol: 0.17, cutoff: 1400, q: 0.7, wave: 'triangle', detune: 4, sub: 0.45, verb: 0.9, xfade: 6, first: 3 }, t + 0.1);
        let next = t + 3;
        return {
          chord() {},
          schedule(t0, t1) {
            cyc.schedule(t0, t1);
            if (next < t0 - 0.5) next = t0 + 1;
            while (next < t1) {
              const c = cyc.chord;
              bell(S, pick(c.top), next, { vol: 0.022, dur: 6, ratio: 2, index: 0.5, att: 0.08, pan: rnd(-0.7, 0.7), verb: 1, delay: 0.5, dry: 0.4 });
              if (Math.random() < 0.3) swell(S, pick(c.notes) + 12, next + rnd(0.5, 2), { vol: 0.03, att: 5, rel: 7, pan: rnd(-0.5, 0.5), cut: 1800 });
              next += rnd(3, 7);
            }
          },
          spark() {}, sparkGap: 1e9,
          stop(at) { cyc.stop(at); },
        };
      },
    },
    signal: {
      label: 'Signal', note: 'A warm drone with telemetry bleeps, sonar pings and the odd crackle of radio, the sound of reaching out', level: 1.85,
      make(S, t) {
        const D = { bass: 38, notes: [50, 57, 62, 64, 69], top: [74, 76, 78, 81, 83, 86] };
        const drone = pad(S, D, t + 0.1, { vol: 0.15, cutoff: 700, q: 1, attack: 2.5, eq: true, wave: 'sawtooth', detune: 8, sub: 0.45, verb: 0.75 });
        let nextB = t + 1.5, nextS = t + 4, nextC = t + 6;
        return {
          chord() {},
          schedule(t0, t1) {
            if (nextB < t0 - 0.5) nextB = t0 + 0.5;
            while (nextB < t1) {   // a little burst of data
              const n = 2 + Math.floor(Math.random() * 5), base = pick([1760, 2093, 2349, 2637]), pan = rnd(-0.7, 0.7);
              for (let k = 0; k < n; k++) bleep(S, base * (Math.random() < 0.3 ? 1.5 : 1), nextB + k * 0.11, { vol: 0.018, dur: 0.05, pan, delay: 0.3 });
              nextB += rnd(2.5, 6);
            }
            if (nextS < t1) { sonar(S, pick(D.top), nextS, 0.045); nextS += rnd(7, 12); }
            if (nextC < t1) { crackle(S, nextC, 0.012); nextC += rnd(5, 14); }
          },
          spark() {}, sparkGap: 1e9,
          stop(at) { drone.release(at, 2.5); },
        };
      },
    },
