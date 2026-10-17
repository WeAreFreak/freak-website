/* ================================================================ CITY (Contact)
   A rain-soaked rooftop in a dense future city at night. The skyline and the roof are a path-traced
   panorama; the roof and everything on it are projected back onto their real shapes (exported from
   Blender), the far city onto a cylinder. Live: the black glass F, rain and ripples, steam, neon that
   flickers, giant animated billboards, cables, a blinking mast, flying traffic, and the F, signs and
   screens reflected in the puddles. */
WORLDS.city = (() => {
  const EYE = new THREE.Vector3(0, 1.4, 0);
  const b2t = a => new THREE.Vector3(a[0], a[2], -a[1]);           // Blender -> three.js
  const scene = new THREE.Scene(), mirror = new THREE.Scene();
  const mirrored = new THREE.Group(); mirrored.scale.y = -1; mirror.add(mirrored);
  const PINK = new THREE.Color(1.0, 0.12, 0.55), CYAN = new THREE.Color(0.15, 0.95, 1.0);
  const U = { uTime: { value: 0 } };
  let reflRT = null, floorMat = null, rainOn = 1, rainGoal = 1;
  const flickers = [], screens = [];

  const BAND = { lat: new THREE.Vector2(THREE.MathUtils.degToRad(-25), THREE.MathUtils.degToRad(55)) };
  const PANO_GLSL = `uniform sampler2D uPano, uBand; uniform vec2 uLat; uniform float uHasBand;
    ${EQUIRECT_GLSL}
    vec3 pano(vec3 d) {
      vec2 uv = equirect(d); vec3 c = texture2D(uPano, uv).rgb;
      if (uHasBand > 0.5) {
        float vb = (asin(clamp(d.y, -1.0, 1.0)) - uLat.x) / (uLat.y - uLat.x);
        float w = smoothstep(0.0, 0.04, vb) * smoothstep(0.0, 0.04, 1.0 - vb);
        if (w > 0.0) c = mix(c, texture2D(uBand, vec2(uv.x, vb)).rgb, w);
      }
      return c;
    }`;
  const panoU = { uPano: { value: null }, uBand: { value: null }, uLat: { value: BAND.lat }, uHasBand: { value: 0 }, uEye: { value: EYE } };
  function cityProjection(opts = {}) {
    return new THREE.ShaderMaterial({
      uniforms: panoU, side: opts.side ?? THREE.FrontSide, toneMapped: false, depthWrite: opts.depthWrite ?? true, depthTest: opts.depthTest ?? true,
      vertexShader: `varying vec3 vWorld; void main() { vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: `uniform vec3 uEye; varying vec3 vWorld; ${PANO_GLSL}
        void main() { gl_FragColor = vec4(pano(normalize(vWorld - uEye)), 1.0);
          #include <colorspace_fragment>
        }`,
    });
  }
  function addBoth(obj) { scene.add(obj); const c = obj.clone(); mirrored.add(c); return c; }

  // ---- neon sign: crisp tubes plus a soft glow, flickering now and then
  function neonMaterial(tex, colour, gain, additive) {
    return new THREE.ShaderMaterial({
      uniforms: { uTex: { value: tex }, uCol: { value: colour.clone() }, uOn: { value: 1 }, uGain: { value: gain } },
      transparent: true, depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending, side: THREE.DoubleSide,
      vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `uniform sampler2D uTex; uniform vec3 uCol; uniform float uOn, uGain; varying vec2 vUv;
        void main() { float m = texture2D(uTex, vUv).r; vec3 c = uCol * m * uGain * uOn + vec3(1.0) * pow(m, 3.0) * uGain * 0.35 * uOn;
          gl_FragColor = vec4(c, ${additive ? '1.0' : 'm'});
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    });
  }
  function orient(mesh, centre, facing) { mesh.position.copy(centre); mesh.lookAt(centre.clone().add(facing)); return mesh; }

  // ---- billboards: canvas slides with scanlines, a slow pulse and a glitch between slides
  const F_PATH = [];
  function drawSlide(ctx, W, H, s, theme) {
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, theme.bg0); g.addColorStop(1, theme.bg1); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.globalAlpha = 0.18; ctx.strokeStyle = theme.ink; ctx.lineWidth = Math.max(2, W / 400);
    for (let x = -H; x < W; x += W / 14) { ctx.beginPath(); ctx.moveTo(x, H); ctx.lineTo(x + H, 0); ctx.stroke(); }
    ctx.restore();
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = theme.ink; ctx.shadowColor = theme.glow; ctx.shadowBlur = W / 28;
    if (s.mark) {   // the Freak F, glowing
      const sc = H * 0.36, cx = W * (s.text ? 0.27 : 0.5), cy = H * 0.84;
      ctx.lineWidth = Math.max(3, W / 160); ctx.strokeStyle = theme.ink;
      for (const loop of F_PATH) { ctx.beginPath(); loop.forEach(([x, y], i) => (i ? ctx.lineTo : ctx.moveTo).call(ctx, cx + x * sc, cy - y * sc)); ctx.closePath(); ctx.stroke(); }
      if (s.text) { ctx.font = `400 ${H * 0.34}px "Bebas Neue", Impact, sans-serif`; ctx.fillText(s.text, W * 0.66, H * 0.5); }
      return;
    }
    if (s.vertical) {
      const n = s.text.length, size = Math.min(W * 0.8, H / (n * 1.05));
      ctx.font = `400 ${size}px "Monoton", "Bebas Neue", Impact, sans-serif`;
      [...s.text].forEach((ch, i) => ctx.fillText(ch, W / 2, H * (i + 0.5) / n));
      return;
    }
    ctx.font = `400 ${H * (s.size || 0.46)}px ${s.font || '"Bebas Neue", Impact, sans-serif'}`;
    ctx.fillText(s.text, W / 2, H * (s.sub ? 0.43 : 0.52), W * 0.92);
    if (s.sub) { ctx.shadowBlur = W / 60; ctx.font = `600 ${H * 0.09}px "Plus Jakarta Sans", system-ui, sans-serif`; ctx.fillText(s.sub, W / 2, H * 0.8, W * 0.9); }
  }
  const THEMES = {
    hero: { bg0: '#2a0016', bg1: '#ff1f8e', ink: '#fff2f8', glow: '#ff5cb0', slides: [
      { text: 'TALK TO US' }, { text: 'SAY HELLO', sub: 'LONDON  ·  BARCELONA  ·  ABU DHABI' }, { mark: true, text: 'FREAK' }, { text: 'HOLA · HELLO · مرحبا', size: 0.3 }, { text: "WE'RE LISTENING", size: 0.36 }] },
    contact: { bg0: '#001820', bg1: '#00b8d9', ink: '#eaffff', glow: '#5ff3ff', slides: [{ text: 'GET IN TOUCH' }, { text: 'TALK TO US' }, { text: 'ALWAYS ON' }] },
    tall: { bg0: '#071400', bg1: '#2f6b00', ink: '#e8ffd0', glow: '#a6ff3c', slides: [{ text: 'FREAK', vertical: true }, { text: 'TALK', vertical: true }] },
    back: { bg0: '#200800', bg1: '#ff6a12', ink: '#fff1e6', glow: '#ff9a4a', slides: [{ text: 'TALK TO US' }, { text: 'OPEN 24/7' }] },
  };
  function billboard(b) {
    const theme = THEMES[b.name] || THEMES.hero;
    const W = b.h > b.w ? 512 : 1024, H = Math.round(W * b.h / b.w);
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const ctx = cv.getContext('2d');
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.ShaderMaterial({
      uniforms: { uTex: { value: tex }, uTime: U.uTime, uGlitch: { value: 0 }, uGain: { value: 2.2 }, uLines: { value: H * 0.5 } },
      vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `uniform sampler2D uTex; uniform float uTime, uGlitch, uGain, uLines; varying vec2 vUv;
        float h(float x) { return fract(sin(x * 91.7) * 43758.5); }
        void main() {
          vec2 uv = vUv;
          float band = floor(uv.y * 24.0); uv.x += (h(band + floor(uTime * 20.0)) - 0.5) * 0.08 * uGlitch;
          float sh = 0.004 + 0.02 * uGlitch;
          vec3 c = vec3(texture2D(uTex, uv + vec2(sh, 0.0)).r, texture2D(uTex, uv).g, texture2D(uTex, uv - vec2(sh, 0.0)).b);
          float scan = 0.82 + 0.18 * sin((uv.y * uLines - uTime * 6.0) * 3.14159);
          float pulse = 0.92 + 0.08 * sin(uTime * 1.7);
          float edge = smoothstep(0.0, 0.02, uv.x) * smoothstep(0.0, 0.02, 1.0 - uv.x) * smoothstep(0.0, 0.03, uv.y) * smoothstep(0.0, 0.03, 1.0 - uv.y);
          gl_FragColor = vec4(c * scan * pulse * uGain * edge * (1.0 - 0.6 * uGlitch * h(band + uTime)), 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    });
    const centre = b2t(b.centre), facing = b2t(b.facing).normalize();
    const screen = orient(new THREE.Mesh(new THREE.PlaneGeometry(b.w, b.h), mat), centre, facing);
    const glowMat = new THREE.MeshBasicMaterial({ map: softDot(128), color: new THREE.Color(theme.glow).multiplyScalar(0.6), transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false });
    const glowP = orient(new THREE.Mesh(new THREE.PlaneGeometry(b.w * 1.9, b.h * 1.9), glowMat), centre.clone().add(facing.clone().multiplyScalar(0.3)), facing);
    scene.add(screen, glowP); addBoth(screen);   // screens reflect in the puddles
    const st = { slide: -1, next: rnd(0, 2), mat, draw: i => { drawSlide(ctx, W, H, theme.slides[i], theme); tex.needsUpdate = true; }, n: theme.slides.length, glitchT: 0 };
    screens.push(st);
  }

  // ---- rain, as fine streaks in a box that follows the camera
  const RAIN = { n: phone ? 3000 : 7500, box: new THREE.Vector3(18, 12, 18) };
  const rainU = { uTime: U.uTime, uCam: { value: new THREE.Vector3() }, uBox: { value: RAIN.box }, uOn: { value: 1 },
    uPink: { value: new THREE.Vector3(-1.0, 1.95, -11.55) }, uCyan: { value: new THREE.Vector3(2.5, 1.85, 11.55) } };
  {
    const n = RAIN.n, pos = new Float32Array(n * 6), end = new Float32Array(n * 2), seed = new Float32Array(n * 2);
    for (let i = 0; i < n; i++) {
      const x = Math.random(), y = Math.random(), z = Math.random(), s = Math.random();
      pos.set([x, y, z, x, y, z], i * 6); end[i * 2] = 0; end[i * 2 + 1] = 1; seed[i * 2] = seed[i * 2 + 1] = s;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('aEnd', new THREE.BufferAttribute(end, 1)); g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    const rainMesh = new THREE.LineSegments(g, new THREE.ShaderMaterial({
      uniforms: rainU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `uniform float uTime, uOn; uniform vec3 uCam, uBox, uPink, uCyan; attribute float aEnd, aSeed; varying float vA; varying vec3 vC;
        void main() {
          float speed = 7.5 + aSeed * 3.0; vec3 dir = normalize(vec3(0.12, -1.0, 0.05));
          vec3 p = position * uBox;
          p.y -= uTime * speed; p.x += uTime * speed * 0.12; p.z += uTime * speed * 0.05;
          vec3 o = uCam - uBox * 0.5; o.y = -0.2;
          p = mod(p - o, uBox) + o;
          p -= dir * aEnd * (0.10 + aSeed * 0.12);
          vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv;
          float d = -mv.z;
          vA = uOn * (0.10 + 0.22 * aSeed) * smoothstep(0.3, 1.5, d) * (1.0 - smoothstep(9.0, 16.0, d)) * step(0.0, p.y);
          vC = vec3(0.55, 0.62, 0.78) + vec3(1.0, 0.12, 0.55) * 1.4 * exp(-distance(p, uPink) / 3.5) + vec3(0.15, 0.95, 1.0) * 1.2 * exp(-distance(p, uCyan) / 3.5);
        }`,
      fragmentShader: `varying float vA; varying vec3 vC; void main() { gl_FragColor = vec4(vC * vA, 1.0); }`,
    }));
    rainMesh.frustumCulled = false; scene.add(rainMesh);
  }

  // ---- steam from the vents
  const steamU = { uTime: U.uTime, uTex: { value: softDot(64, [[0, 'rgba(255,255,255,.9)'], [0.5, 'rgba(255,255,255,.35)'], [1, 'rgba(255,255,255,0)']]) }, uFocal: { value: 900 } };
  function steam(vents) {
    const per = phone ? 18 : 30, n = vents.length * per, base = new Float32Array(n * 3), seed = new Float32Array(n);
    vents.forEach((v, k) => { for (let i = 0; i < per; i++) { base.set([v.x, v.y, v.z], (k * per + i) * 3); seed[k * per + i] = Math.random(); } });
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(base, 3)); g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    const pts = new THREE.Points(g, new THREE.ShaderMaterial({
      uniforms: steamU, transparent: true, depthWrite: false,
      vertexShader: `uniform float uTime, uFocal; attribute float aSeed; varying float vA, vAge;
        void main() {
          float age = fract(uTime * (0.11 + aSeed * 0.05) + aSeed * 7.0);
          vec3 p = position + vec3(age * 2.6 + sin(aSeed * 40.0 + uTime * 0.7) * 0.3 * age, age * 4.2, -age * 0.8 + cos(aSeed * 31.0) * 0.4 * age);
          vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv;
          gl_PointSize = clamp((0.35 + age * 2.4) * uFocal / -mv.z, 2.0, 420.0);
          vA = sin(3.14159 * age) * (0.9 - 0.4 * age); vAge = age;
        }`,
      fragmentShader: `uniform sampler2D uTex; varying float vA, vAge;
        void main() { float a = texture2D(uTex, gl_PointCoord).a * vA * 0.24;
          vec3 c = mix(vec3(0.55, 0.85, 0.95), vec3(0.75, 0.6, 0.8), vAge);
          gl_FragColor = vec4(c, a);
          #include <colorspace_fragment>
        }`,
    }));
    pts.frustumCulled = false; scene.add(pts);
  }

  // ---- flying traffic far across the city
  function traffic() {
    const n = 26, pos = new Float32Array(n * 3), data = [];
    for (let i = 0; i < n; i++) {
      const a = rnd(0, Math.PI * 2), r = rnd(70, 360), h = rnd(14, 95), dir = rnd(0, Math.PI * 2);
      data.push({ c: new THREE.Vector3(Math.cos(a) * r, h, Math.sin(a) * r), d: new THREE.Vector3(Math.cos(dir), rnd(-0.02, 0.02), Math.sin(dir)), v: rnd(12, 30), o: rnd(0, 600) });
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const col = new Float32Array(n * 3); const tints = [[1, 0.95, 0.85], [1, 0.2, 0.15], [0.4, 0.9, 1], [1, 0.4, 0.8]];
    for (let i = 0; i < n; i++) col.set(tints[i % 4], i * 3);
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const m = new THREE.PointsMaterial({ size: phone ? 7 : 9, sizeAttenuation: false, map: softDot(64), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const pts = new THREE.Points(g, m); pts.frustumCulled = false; scene.add(pts);
    return t => {
      for (let i = 0; i < n; i++) { const q = data[i], s = ((t * q.v + q.o) % 600) - 300; pos[i * 3] = q.c.x + q.d.x * s; pos[i * 3 + 1] = q.c.y + q.d.y * s; pos[i * 3 + 2] = q.c.z + q.d.z * s; }
      g.attributes.position.needsUpdate = true;
    };
  }
  let moveTraffic = () => {};

  // ---- cables, railing and the mast: thin things are live, so they never slide against the sky
  const metal = new THREE.MeshStandardMaterial({ color: 0x15161a, metalness: 0.8, roughness: 0.32 });
  function cable(a, b, sag) {
    const pts = []; for (let i = 0; i <= 40; i++) { const t = i / 40; const p = a.clone().lerp(b, t); p.y -= sag * 4 * t * (1 - t); pts.push(p); }
    scene.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, 0.035, 5), metal));
  }
  function railing(R, PH) {
    const posts = [], rails = [];
    [[-R, R + 0.1, R, R + 0.1], [-R, -R - 0.1, R, -R - 0.1], [R + 0.1, -R, R + 0.1, R], [-R - 0.1, -R, -R - 0.1, R]].forEach(([x0, y0, x1, y1]) => {
      const a = b2t([x0, y0, 0]), b = b2t([x1, y1, 0]), L = a.distanceTo(b), n = Math.round(L / 2);
      for (let k = 0; k <= n; k++) posts.push(a.clone().lerp(b, k / n));
      rails.push([a, b]);
    });
    const post = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.022, 0.022, 0.95, 6).translate(0, PH + 0.48, 0), metal, posts.length);
    posts.forEach((p, i) => post.setMatrixAt(i, new THREE.Matrix4().makeTranslation(p.x, 0, p.z))); scene.add(post);
    rails.forEach(([a, b]) => [PH + 0.95, PH + 0.5].forEach(h => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, a.distanceTo(b), 6), metal);
      m.position.copy(a).lerp(b, 0.5); m.position.y = h; m.lookAt(b.x, h, b.z); m.rotateX(Math.PI / 2); scene.add(m);
    }));
  }
  let beacon = null;
  function mast(top) {
    const base = b2t([top[0], top[1], 0]);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, top[2], 8).translate(0, top[2] / 2, 0), metal); m.position.copy(base); scene.add(m);
    for (let k = 0; k < 5; k++) { const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.2, 5), metal); arm.position.set(base.x, 2.5 + k * 2.1, base.z); arm.rotation.set(Math.PI / 2, 0, k * 1.1); scene.add(arm); }
    beacon = new THREE.Sprite(new THREE.SpriteMaterial({ map: softDot(64), color: 0xff2a1a, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    beacon.position.set(base.x, top[2] + 0.1, base.z); beacon.scale.setScalar(1.3); scene.add(beacon);
  }

  // ---- the F: black glass with a pink edge light
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x050508, metalness: 0.0, roughness: 0.04, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 3.0, ior: 1.7, specularIntensity: 1 });
  glass.onBeforeCompile = sh => {
    // pink light from the left as you face it, cyan from the right, strongest at the edges
    sh.uniforms.uPink = { value: new THREE.Vector3(1.0, 0.18, 0.6).multiplyScalar(1.1) };
    sh.uniforms.uCyan = { value: new THREE.Vector3(0.15, 0.85, 1.0).multiplyScalar(0.7) };
    sh.fragmentShader = sh.fragmentShader.replace('uniform float opacity;', 'uniform float opacity; uniform vec3 uPink, uCyan;')
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        vec3 nW = inverseTransformDirection(normalize(normal), viewMatrix);
        float edge = pow(1.0 - saturate(dot(normalize(normal), normalize(vViewPosition))), 2.5);
        totalEmissiveRadiance += (uPink * smoothstep(-0.2, 0.9, -nW.z) + uCyan * smoothstep(-0.2, 0.9, nW.z)) * edge;`);
  };

  const world = {
    id: 'city', scene, entering: 'Entering the city', exposure: 1.0,
    kicker: 'World test 02 · Contact', title: 'The City',
    blurb: 'A rain-soaked rooftop after dark. Neon in the puddles, steam from the vents and the skyline asking you to talk to us.',
    cam: { radius: 6.6, height: 0.9, look: 1.45, lookPhone: 0.6, fov: 38, far: 1200 },
    assets: () => [WDIR + (phone ? 'city-2k.jpg' : 'city.jpg'), ...(phone ? [] : [WDIR + 'city-band.jpg']), WDIR + 'puddles.png', WDIR + 'city_layout.json', WDIR + 'roof_proxy.txt',
      WDIR + 'talk.png', WDIR + 'talk_glow.png', WDIR + 'always.png', WDIR + 'always_glow.png'],
    views: [{ label: 'Hero view', deg: 0 }, { label: 'Contact angle', deg: -70 }, { label: 'Skyline', deg: 150 }],
    toggle: { label: 'Rain', set(on) { rainGoal = on ? 1 : 0; } },
    async load() {
      const [pano, puddles, layout, proxy, logo, talk, talkG, always, alwaysG, fshape] = await Promise.all([
        loadTex(WDIR + (phone ? 'city-2k.jpg' : 'city.jpg')), loadTex(WDIR + 'puddles.png', false), fetch(asset(WDIR + 'city_layout.json')).then(r => r.json()),
        loadGLB64(WDIR + 'roof_proxy.txt'), loadGLB64(LOGO_URL),
        loadTex(WDIR + 'talk.png', false), loadTex(WDIR + 'talk_glow.png', false), loadTex(WDIR + 'always.png', false), loadTex(WDIR + 'always_glow.png', false),
        typeof F_SHAPE !== 'undefined' ? F_SHAPE : fetch(WDIR + 'fshape.json').then(r => r.json()),
      ]);
      F_PATH.push(fshape.stem, fshape.chevron);
      try { await Promise.all(['400 100px "Bebas Neue"', '400 100px "Monoton"', '600 40px "Plus Jakarta Sans"'].map(f => document.fonts.load(f))); } catch (e) {}
      panoTexture(pano); panoU.uPano.value = pano;
      if (!phone) {   // the sharp strip round the horizon, for big screens
        try { const band = panoTexture(await loadTex(WDIR + 'city-band.jpg')); panoU.uBand.value = band; panoU.uHasBand.value = 1; } catch (e) { console.warn('no horizon band', e); }
      }
      const panoMip = pano.clone(); panoMip.generateMipmaps = true; panoMip.minFilter = THREE.LinearMipmapLinearFilter; panoMip.needsUpdate = true;
      const env = envFrom(pano); scene.environment = env; mirror.environment = env;
      // the far city on a cylinder, then the roof on its real shapes
      const far = new THREE.Mesh(new THREE.CylinderGeometry(70, 70, 470, 96, 1, true).translate(0, 173, 0), cityProjection({ side: THREE.DoubleSide, depthWrite: false, depthTest: false }));
      const cap = new THREE.Mesh(new THREE.CircleGeometry(70, 64).rotateX(Math.PI / 2).translate(0, 408, 0), far.material);
      far.renderOrder = cap.renderOrder = -3; scene.add(far, cap);
      const near = cityProjection();
      floorMat = new THREE.ShaderMaterial({
        uniforms: { uPano: panoU.uPano, uBand: panoU.uBand, uLat: panoU.uLat, uHasBand: panoU.uHasBand, uMip: { value: panoMip }, uEye: { value: EYE }, uPuddle: { value: puddles }, uRefl: { value: null }, uRes: { value: new THREE.Vector2(1, 1) }, uTime: U.uTime, uRain: { value: 1 } },
        toneMapped: false,
        vertexShader: `varying vec3 vWorld; void main() { vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
        fragmentShader: `uniform sampler2D uMip, uPuddle, uRefl; uniform vec3 uEye; uniform vec2 uRes; uniform float uTime, uRain; varying vec3 vWorld;
          ${PANO_GLSL}
          float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
          vec2 ripples(vec2 p, float t) {
            vec2 n = vec2(0.0);
            for (int k = 0; k < ${phone ? 1 : 2}; k++) {
              float s = k == 0 ? 0.42 : 0.26;
              vec2 g = floor(p / s), f = fract(p / s);
              for (int i = -1; i <= 1; i++) for (int j = -1; j <= 1; j++) {
                vec2 id = g + vec2(i, j), h2 = vec2(hash(id + float(k) * 19.0), hash(id + 7.3 + float(k)));
                vec2 c = (vec2(i, j) + h2 - f) * s;
                float ph = fract(t * (0.6 + 0.7 * h2.x) + h2.y * 9.0), r = length(c), R = ph * 0.2;
                n += (c / max(r, 1e-4)) * exp(-pow((r - R) / 0.011, 2.0)) * (1.0 - ph) * (1.0 - ph);
              }
            }
            return n;
          }
          void main() {
            float wet = texture2D(uPuddle, vec2((vWorld.x + 12.0) / 24.0, (12.0 - vWorld.z) / 24.0)).r;
            vec2 rn = ripples(vWorld.xz, uTime) * (0.3 + 0.7 * wet) * uRain;
            vec3 d = normalize(vWorld - uEye); d.xz -= rn * 0.035;
            vec3 col = pano(normalize(d));
            vec3 V = normalize(cameraPosition - vWorld);
            float fres = 0.05 + 0.95 * pow(1.0 - clamp(V.y, 0.0, 1.0), 5.0);
            // the city in the wet roof: look the reflected ray up in the panorama, sharp in the puddles, blurred elsewhere
            vec3 nrm = normalize(vec3(-rn.x * 0.5, 1.0, -rn.y * 0.5));
            vec3 r = reflect(-V, nrm); r.y = max(r.y, 0.002);
            vec2 ru = equirect(normalize(r));
            vec3 env = mix(textureLod(uMip, ru, 4.5).rgb, pano(normalize(r)), smoothstep(0.25, 0.85, wet));
            col += env * fres * mix(0.35, 0.95, wet);
            vec2 suv = gl_FragCoord.xy / uRes + rn * 0.025;   // a little vertical smear, like a real wet roof
            vec3 refl = (texture2D(uRefl, suv).rgb * 2.0 + texture2D(uRefl, suv + vec2(0.0, 0.006)).rgb + texture2D(uRefl, suv - vec2(0.0, 0.006)).rgb + texture2D(uRefl, suv - vec2(0.0, 0.014)).rgb) / 5.0;
            col += refl * mix(0.18, 0.9, wet) * mix(0.4, 1.0, fres);
            col += vec3(0.6, 0.7, 0.9) * length(rn) * 0.05 * uRain;
            gl_FragColor = vec4(col, 1.0);
            #include <colorspace_fragment>
          }`,
      });
      proxy.scene.traverse(o => { if (o.isMesh) { o.material = o.name === 'roof' ? floorMat : near; o.renderOrder = -2; } });
      scene.add(proxy.scene);

      // live neon on the roof
      const tx = { talk: [talk, talkG], always: [always, alwaysG] };
      for (const s of layout.signs) {
        const [t1, t2] = tx[s.name], c = b2t(s.centre), f = b2t(s.facing).normalize(), col = new THREE.Color(...s.colour);
        const core = orient(new THREE.Mesh(new THREE.PlaneGeometry(s.w, s.h), neonMaterial(t1, col, 3.2, true)), c, f);
        const gw = s.w * t2.image.width / t1.image.width, gh = s.h * t2.image.height / t1.image.height;
        const halo = orient(new THREE.Mesh(new THREE.PlaneGeometry(gw, gh), neonMaterial(t2, col, 0.9, true)), c.clone().add(f.clone().multiplyScalar(0.02)), f);
        scene.add(core, halo); addBoth(core); addBoth(halo);
        flickers.push({ mats: [core.material, halo.material], seed: Math.random() * 100, steady: s.name === 'always' });
        const L = new THREE.PointLight(col, 160, 0, 2); L.position.copy(c).add(f.clone().multiplyScalar(0.6)); scene.add(L); addBoth(L);
        flickers[flickers.length - 1].light = L;
      }
      layout.billboards.forEach(billboard);
      steam(layout.vents.map(b2t));
      railing(layout.roof, layout.parapet);
      mast(layout.mast);
      moveTraffic = traffic();
      const H = b2t([-9.6, 9.4, 3.3]);
      [[H, new THREE.Vector3(-46, 24, -52), 4], [H, new THREE.Vector3(-62, 30, 6), 5], [H.clone().add(new THREE.Vector3(1.5, 0, 0)), new THREE.Vector3(14, 27, -64), 4.5],
        [b2t([-10.8, -10.8, 11.6]), new THREE.Vector3(-56, 36, 44), 5], [b2t([-10.8, -10.8, 10.5]), new THREE.Vector3(8, 30, 66), 4], [b2t([9.6, -9.6, 5.2]), new THREE.Vector3(58, 28, 40), 4]]
        .forEach(([a, b, s]) => cable(a, b, s));
      // the F
      const g = logo.scene; g.scale.setScalar(3.416); g.position.y = 0.0476 * 3.416;
      g.traverse(o => { if (o.isMesh) { o.material = glass; o.castShadow = false; } });
      const hero = new THREE.Group(); hero.add(g); hero.rotation.y = -Math.PI / 2; hero.position.set(-0.056, 0, -0.056);
      scene.add(hero); addBoth(hero); world.hero = hero;
      // a soft magenta light from the big screen behind, and a cool fill from the sky
      const back = new THREE.DirectionalLight(0xff3d9a, 0.6); back.position.set(60, 14, 26); scene.add(back); addBoth(back);
      const sky = new THREE.HemisphereLight(0x5a4f9a, 0x110814, 0.25); scene.add(sky); mirror.add(sky.clone());
    },
    resize(w, h) {
      const pr = renderer.getPixelRatio(), W = Math.max(2, Math.floor(w * pr / 2)), H = Math.max(2, Math.floor(h * pr / 2));
      if (!reflRT) reflRT = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType });
      else reflRT.setSize(W, H);
      if (floorMat) { floorMat.uniforms.uRefl.value = reflRT.texture; floorMat.uniforms.uRes.value.set(w * pr, h * pr); }
    },
    update(t, dt) {
      U.uTime.value = t;
      rainOn += (rainGoal - rainOn) * (1 - Math.exp(-dt * 3)); rainU.uOn.value = rainOn; if (floorMat) floorMat.uniforms.uRain.value = rainOn;
      rainU.uCam.value.copy(camera.position);
      steamU.uFocal.value = renderer.domElement.height * 0.5 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      for (const f of flickers) {   // neon: mostly steady, with the odd stutter
        const k = Math.floor(t * 14 + f.seed), r = Math.abs(Math.sin(k * 12.9898 + f.seed) * 43758.5) % 1;
        const burst = (Math.sin(t * 0.37 + f.seed) > 0.93) && !f.steady;
        const on = burst ? (r > 0.45 ? 1 : 0.15) : 0.96 + 0.04 * Math.sin(t * 50 + f.seed);
        f.mats.forEach(m => { m.uniforms.uOn.value = on; }); if (f.light) f.light.intensity = 160 * on;
      }
      for (const s of screens) {   // billboards: change slide every few seconds, with a glitch
        if (t > s.next) { s.slide = (s.slide + 1) % s.n; s.draw(s.slide); s.next = t + rnd(5, 8); s.glitchT = t; }
        const g = Math.max(0, 1 - (t - s.glitchT) / 0.45); s.mat.uniforms.uGlitch.value = g * g + (Math.random() < 0.004 ? 0.6 : 0);
      }
      if (beacon) beacon.material.opacity = (t % 1.6) < 0.18 ? 1 : 0.05;
      moveTraffic(t);
      if (floorMat && !reflRT) world.resize(innerWidth, innerHeight);
    },
    compileExtra(r, cam) { r.compile(mirror, cam); },
    render(r, cam) {
      if (reflRT) { r.setRenderTarget(reflRT); r.setClearColor(0x000000, 1); r.clear(); r.render(mirror, cam); r.setRenderTarget(null); }
      r.render(scene, cam);
    },
  };
  return world;
})();
