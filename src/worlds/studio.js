/* ================================================================ STUDIO (Capabilities)
   A daylight studio in an old industrial building. The room is projected back onto a box the size of
   the real room; the copper scaffold F and its flowers are live, with their shadows baked in. */
WORLDS.studio = (() => {
  const ROOM = { x: 11.8, z: 11.8, h: 7.2, eye: 1.4 };
  const EL = THREE.MathUtils.degToRad(17), AZ = THREE.MathUtils.degToRad(-28);
  const SUN = new THREE.Vector3(Math.cos(EL) * Math.cos(AZ), Math.sin(EL), -Math.cos(EL) * Math.sin(AZ)).normalize();
  const SUN_COL = new THREE.Color(1.0, 0.84, 0.66);
  const scene = new THREE.Scene();

  // sunlight through the four windows on the +X wall, with their glazing bars: shared by the haze and the dust
  const BEAM_GLSL = `
    uniform vec3 uSun;
    float bars(float v, float pitch, float half_) {
      float c = fract(v / pitch) * pitch;
      return smoothstep(half_ - 0.01, half_ + 0.035, c) * smoothstep(half_ - 0.01, half_ + 0.035, pitch - c);
    }
    float inBeam(vec3 p) {
      float t = (${ROOM.x.toFixed(2)} - p.x) / uSun.x;
      if (t < 0.0) return 0.0;
      vec3 h = p + uSun * t;
      float y = h.y - 0.85;
      float lit = smoothstep(-0.04, 0.06, y) * smoothstep(-0.04, 0.06, 5.5 - y);
      if (lit <= 0.0) return 0.0;
      float b = 0.0;
      for (int i = 0; i < 4; i++) {
        float lz = h.z - (6.9 - 4.6 * float(i) - 1.8);
        b += smoothstep(-0.04, 0.06, lz) * smoothstep(-0.04, 0.06, 3.6 - lz) * bars(lz, 0.6, 0.0225);
      }
      return lit * b * bars(y, 0.6875, 0.0225);
    }`;
  const roomU = {
    uPano: { value: null }, uEye: { value: new THREE.Vector3(0, ROOM.eye, 0) }, uSun: { value: SUN },
    uSunCol: { value: SUN_COL.clone() }, uHaze: { value: 1 }, uSteps: { value: phone ? 14 : 26 },
  };
  const room = new THREE.Mesh(
    new THREE.BoxGeometry(ROOM.x * 2, ROOM.h, ROOM.z * 2).translate(0, ROOM.h / 2, 0),
    new THREE.ShaderMaterial({
      uniforms: roomU, side: THREE.BackSide, toneMapped: false,
      vertexShader: `varying vec3 vWorld; void main() { vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: `
        uniform sampler2D uPano; uniform vec3 uEye, uSunCol; uniform float uHaze; uniform int uSteps;
        varying vec3 vWorld;
        ${BEAM_GLSL} ${EQUIRECT_GLSL}
        void main() {
          vec3 col = texture2D(uPano, equirect(normalize(vWorld - uEye))).rgb;
          if (uHaze > 0.001) {
            vec3 ro = cameraPosition, rd = vWorld - ro; float L = length(rd); rd /= L;
            float n = float(uSteps), dt = L / n;
            float j = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
            float acc = 0.0;
            for (int i = 0; i < 32; i++) {
              if (i >= uSteps) break;
              vec3 p = ro + rd * (dt * (float(i) + j));
              acc += inBeam(p) * (1.0 - smoothstep(2.0, 6.5, p.y) * 0.6);
            }
            float mu = max(dot(rd, uSun), 0.0);
            col += uSunCol * acc * dt * 0.011 * (0.12 + 1.1 * pow(mu, 10.0) + 0.3 * pow(mu, 2.5)) * uHaze;
          }
          gl_FragColor = vec4(col, 1.0);
          #include <colorspace_fragment>
        }`,
    }));
  room.renderOrder = -1; scene.add(room);

  // the sun on the back of the F (as in the panorama), a key light on its front (also in the panorama), and fill
  function shadowLight(dir, colour, intensity, size) {
    const l = new THREE.DirectionalLight(colour, intensity);
    l.position.copy(dir).multiplyScalar(12); l.target.position.set(0, 0.9, 0);
    l.castShadow = true; l.shadow.mapSize.set(size, size);
    Object.assign(l.shadow.camera, { left: -1.8, right: 1.8, top: 1.8, bottom: -1.8, near: 4, far: 20 });
    l.shadow.bias = -0.0004; l.shadow.normalBias = 0.015;
    scene.add(l, l.target); return l;
  }
  shadowLight(SUN, SUN_COL, 2.6, phone ? 1024 : 2048);
  shadowLight(new THREE.Vector3(-0.63, 0.57, -0.53).normalize(), new THREE.Color(1.0, 0.92, 0.84), 1.9, phone ? 1024 : 1536);
  scene.add(new THREE.HemisphereLight(0xfff1df, 0x5b4636, 0.14));

  // dust in the sunbeams, bright only where it crosses a beam
  const DUST = { count: phone ? 800 : 1700, box: 10.5, top: 6.0, size: 0.024 };
  const dustU = { uTime: { value: 0 }, uFocal: { value: 1000 }, uSun: { value: SUN }, uOn: { value: 1 } };
  {
    const n = DUST.count, pos = new Float32Array(n * 3), seed = new Float32Array(n), scale = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() * 2 - 1) * DUST.box; pos[i * 3 + 1] = 0.05 + Math.pow(Math.random(), 1.3) * DUST.top; pos[i * 3 + 2] = (Math.random() * 2 - 1) * DUST.box;
      seed[i] = Math.random(); scale[i] = 0.5 + Math.pow(Math.random(), 2.5) * 2.2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1)); geo.setAttribute('aScale', new THREE.BufferAttribute(scale, 1));
    const B = DUST.box.toFixed(1), B2 = (DUST.box * 2).toFixed(1);
    const dust = new THREE.Points(geo, new THREE.ShaderMaterial({
      uniforms: dustU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `
        uniform float uTime, uFocal, uOn; attribute float aSeed, aScale; varying float vAlpha, vGlint, vBlur;
        ${BEAM_GLSL}
        void main() {
          vec3 p = position;
          float tw = 0.5 + 0.5 * sin(uTime * (0.5 + aSeed * 1.6) + aSeed * 40.0); tw = 0.3 + 0.7 * tw * tw;
          float t = uTime * 0.12 + aSeed * 50.0;
          p.x = mod(p.x - uTime * 0.035 * (0.4 + aSeed) + ${B}, ${B2}) - ${B};
          p.y += sin(t * 1.3) * 0.14 + sin(t * 0.37) * 0.08; p.z += cos(t * 0.8 + aSeed * 3.0) * 0.28;
          vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv;
          float dist = -mv.z, blur = 1.0 - smoothstep(0.7, 2.6, dist);
          gl_PointSize = clamp(${DUST.size} * aScale * uFocal / dist * (1.0 + blur * 1.8), 1.5, 80.0);
          vBlur = blur;
          float beam = inBeam(p);
          vGlint = pow(max(dot(normalize(p - cameraPosition), uSun), 0.0), 5.0) * beam;
          vAlpha = uOn * smoothstep(0.35, 1.1, dist) * (1.0 - smoothstep(16.0, 26.0, dist)) * (0.2 + 0.8 * aSeed * aSeed) * tw * mix(1.0, 0.08, blur) * (0.03 + 0.97 * beam);
        }`,
      fragmentShader: `
        varying float vAlpha, vGlint, vBlur;
        void main() {
          float r = length(gl_PointCoord - 0.5) * 2.0;
          float dot_ = 1.0 - smoothstep(0.3, 1.0, r); dot_ *= dot_;
          float disc = (1.0 - smoothstep(0.5, 1.0, r)) * (0.75 + 0.25 * smoothstep(0.3, 0.8, r));
          vec3 col = mix(vec3(1.0, 0.84, 0.64), vec3(1.0, 0.95, 0.85), vGlint);
          gl_FragColor = vec4(col * (0.6 + vGlint * 1.1), mix(dot_, disc, vBlur) * vAlpha * (0.5 + vGlint * 0.6));
        }`,
    }));
    dust.frustumCulled = false; scene.add(dust);
  }

  let hazeGoal = 1;
  return {
    id: 'studio', scene, entering: 'Entering the studio', exposure: 1.0,
    kicker: 'World test 01 · Capabilities', title: 'The Studio',
    blurb: 'Afternoon sun through steel windows, and the copper F from the showreel, wrapped in flowers.',
    cam: { radius: 6.6, height: 0.9, look: 1.45, lookPhone: 0.6, fov: 38, far: 80 },
    assets: () => [WDIR + (phone ? 'studio-2k.jpg' : 'studio.jpg'), WDIR + 'hero_protos.txt', WDIR + 'hero_instances.json'],
    views: [{ label: 'Hero view', deg: 0, chord: 0 }, { label: 'Capabilities angle', deg: -35, chord: 1 }, { label: 'Back', deg: 180, chord: 3 }],
    toggle: { label: 'Sunbeams', set(on) { hazeGoal = on ? 1 : 0; } },
    async load() {
      const tex = panoTexture(await loadTex(WDIR + (phone ? 'studio-2k.jpg' : 'studio.jpg')));
      roomU.uPano.value = tex; scene.environment = envFrom(tex);
      const [gltf, inst] = await Promise.all([loadGLB64(WDIR + 'hero_protos.txt'), fetch(asset(WDIR + 'hero_instances.json')).then(r => r.json())]);
      const hero = new THREE.Group();
      // shade each flower by how buried it is in the arrangement, with a little random variation
      const all = [];
      for (const [name, arr] of Object.entries(inst.instances)) {
        if (name === 'Scaffold' || name === 'Twigs') continue;
        for (let i = 0; i < arr.length; i += 16) all.push([arr[i + 12], arr[i + 13], arr[i + 14]]);
      }
      const CELL = 0.14, grid = new Map(), key = (x, y, z) => `${x},${y},${z}`;
      all.forEach((p, i) => { const k = key(Math.floor(p[0] / CELL), Math.floor(p[1] / CELL), Math.floor(p[2] / CELL)); (grid.get(k) || grid.set(k, []).get(k)).push(i); });
      function shade(x, y, z) {
        const cx = Math.floor(x / CELL), cy = Math.floor(y / CELL), cz = Math.floor(z / CELL); let n = 0;
        for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (let k = -1; k <= 1; k++) {
          const c = grid.get(key(cx + i, cy + j, cz + k)); if (!c) continue;
          for (const idx of c) { const q = all[idx]; if (Math.hypot(q[0] - x, q[1] - y, q[2] - z) < 0.14) n++; }
        }
        return THREE.MathUtils.clamp(1.15 - n * 0.022, 0.5, 1.0);
      }
      const tint = new THREE.Color(), done = new Set();
      for (const [name, arr] of Object.entries(inst.instances)) {
        const node = gltf.scene.getObjectByName(name);
        if (!node) { console.warn('missing', name); continue; }
        const count = arr.length / 16;
        node.traverse(o => {
          if (!o.isMesh) return;
          const m = o.material;
          if (name === 'Scaffold') { m.envMapIntensity = 2.2; m.roughness = 0.26; }
          else if (!done.has(m)) { m.envMapIntensity = 0.75; m.roughness = Math.max(m.roughness, 0.6); done.add(m); }
          const im = new THREE.InstancedMesh(o.geometry, m, count);
          im.instanceMatrix.array.set(arr); im.instanceMatrix.needsUpdate = true;
          if (name !== 'Scaffold' && name !== 'Twigs') {
            for (let i = 0; i < count; i++) {
              const ao = shade(arr[i * 16 + 12], arr[i * 16 + 13], arr[i * 16 + 14]) * (0.92 + Math.random() * 0.16);
              im.setColorAt(i, tint.setRGB(ao, ao * (0.97 + Math.random() * 0.06), ao));
            }
            im.instanceColor.needsUpdate = true;
          }
          im.castShadow = true; im.receiveShadow = true; im.frustumCulled = false;
          hero.add(im);
        });
      }
      scene.add(hero); this.hero = hero;
    },
    update(t, dt) {
      roomU.uHaze.value += (hazeGoal - roomU.uHaze.value) * (1 - Math.exp(-dt * 5));
      dustU.uOn.value = 0.25 + 0.75 * roomU.uHaze.value;
      dustU.uTime.value = reduced ? 0 : t;
      dustU.uFocal.value = renderer.domElement.height * 0.5 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    },
  };
})();
