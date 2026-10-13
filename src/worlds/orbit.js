/* ================================================================ ORBIT (About)
   The chrome F floats in orbit above Earth at night. As the sun comes round, the F catches the first
   light on its edges, then turns to full colour as day sweeps across the ground. An astronaut works on
   it. London, Barcelona and Abu Dhabi glow brightest below, linked to the F and out to the world. */
WORLDS.orbit = (() => {
  const R = 600, D = 1250, TILT = THREE.MathUtils.degToRad(31);
  const C = new THREE.Vector3(Math.cos(TILT) * D, -Math.sin(TILT) * D, 0);   // Earth's centre, beyond and below the F
  const bg = new THREE.Scene(), fg = new THREE.Scene();
  const P = 120;   // seconds for a full day
  const SUB = { lat: 21, lon: 27 };   // the point on Earth directly under the F
  const OFFICES = [['London', 51.507, -0.128], ['Barcelona', 41.385, 2.173], ['Abu Dhabi', 24.454, 54.377]];
  const MARKETS = [['New York', 40.71, -74.0], ['Toronto', 43.65, -79.38], ['Los Angeles', 34.05, -118.24], ['Mexico City', 19.43, -99.13], ['São Paulo', -23.55, -46.63],
    ['Paris', 48.86, 2.35], ['Berlin', 52.52, 13.4], ['Madrid', 40.42, -3.7], ['Milan', 45.46, 9.19], ['Amsterdam', 52.37, 4.9], ['Stockholm', 59.33, 18.07], ['Warsaw', 52.23, 21.01],
    ['Istanbul', 41.01, 28.98], ['Athens', 37.98, 23.73], ['Cairo', 30.04, 31.24], ['Lagos', 6.52, 3.38], ['Nairobi', -1.29, 36.82], ['Johannesburg', -26.2, 28.05], ['Riyadh', 24.71, 46.68],
    ['Doha', 25.29, 51.53], ['Mumbai', 19.08, 72.88], ['Delhi', 28.61, 77.21], ['Singapore', 1.35, 103.82], ['Hong Kong', 22.32, 114.17], ['Shanghai', 31.23, 121.47], ['Tokyo', 35.68, 139.69],
    ['Seoul', 37.57, 126.98], ['Sydney', -33.87, 151.21], ['Lisbon', 38.72, -9.14], ['Dublin', 53.35, -6.26], ['Casablanca', 33.57, -7.59], ['Tel Aviv', 32.09, 34.78], ['Copenhagen', 55.68, 12.57]];
  const local = (lat, lon) => { const a = THREE.MathUtils.degToRad(lat), b = THREE.MathUtils.degToRad(lon); return new THREE.Vector3(Math.cos(a) * Math.cos(b), Math.sin(a), -Math.cos(a) * Math.sin(b)); };
  const localNorth = (lat, lon) => { const a = THREE.MathUtils.degToRad(lat), b = THREE.MathUtils.degToRad(lon); return new THREE.Vector3(-Math.sin(a) * Math.cos(b), Math.cos(a), Math.sin(a) * Math.sin(b)); };
  // turn Earth so the point under the F faces it, with north running up the screen towards the horizon
  const nW = C.clone().negate().normalize();
  const tW = new THREE.Vector3(1, 0, 0).sub(nW.clone().multiplyScalar(nW.x)).normalize(), eW = tW.clone().cross(nW);
  const nL = local(SUB.lat, SUB.lon), tL = localNorth(SUB.lat, SUB.lon), eL = tL.clone().cross(nL);
  const Mw = new THREE.Matrix4().makeBasis(eW, tW, nW), Ml = new THREE.Matrix4().makeBasis(eL, tL, nL);
  const EARTH_Q = new THREE.Quaternion().setFromRotationMatrix(Mw.multiply(Ml.transpose()));
  const onEarth = (lat, lon, h = 0) => local(lat, lon).applyQuaternion(EARTH_Q).multiplyScalar(R + h).add(C);
  const sunDir = new THREE.Vector3(), tmp = new THREE.Vector3();
  let t0 = 0, light = 0, arcsGoal = 1, arcsOn = 1;
  // the F leaves Earth's shadow when the sun is this many degrees east of the point under it (10 s after arriving)
  const SUNRISE = 180 - THREE.MathUtils.radToDeg(Math.asin(R / D)) + 1.5;

  // ---- stars and the Milky Way
  {
    const n = phone ? 3000 : 6000, pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
    const band = new THREE.Vector3(0.3, 0.8, 0.5).normalize();
    for (let i = 0; i < n; i++) {
      let v = new THREE.Vector3(rnd(-1, 1), rnd(-1, 1), rnd(-1, 1)).normalize();
      if (i % 3 === 0) { v.sub(band.clone().multiplyScalar(v.dot(band) * rnd(0.8, 1))).normalize(); }   // crowd a third of them along the band
      v.multiplyScalar(2600); pos.set([v.x, v.y, v.z], i * 3);
      const b = Math.pow(Math.random(), 3) * 1.4 + 0.08, warm = Math.random();
      col.set([b * (0.8 + 0.2 * warm), b * (0.82 + 0.1 * warm), b * (1.0 - 0.25 * warm)], i * 3);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const stars = new THREE.Points(g, new THREE.PointsMaterial({ size: phone ? 1.6 : 1.9, sizeAttenuation: false, vertexColors: true, depthWrite: false }));
    stars.renderOrder = -5; stars.frustumCulled = false; bg.add(stars);
  }

  // ---- Earth: day and night maps, clouds, ocean glint, the warm band at the terminator, our offices brightest
  const earthU = { uDay: { value: null }, uNight: { value: null }, uClouds: { value: null }, uWater: { value: null }, uSun: { value: sunDir }, uC: { value: C },
    uOff: { value: OFFICES.map(o => onEarth(o[1], o[2]).sub(C).normalize()) }, uTime: { value: 0 } };
  const earth = new THREE.Mesh(new THREE.SphereGeometry(R, 160, 96), new THREE.ShaderMaterial({
    uniforms: earthU,
    vertexShader: `varying vec2 vUv; varying vec3 vN, vW; void main() { vUv = uv; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: `uniform sampler2D uDay, uNight, uClouds, uWater; uniform vec3 uSun, uC, uOff[3]; uniform float uTime; varying vec2 vUv; varying vec3 vN, vW;
      void main() {
        vec3 n = normalize(vN), V = normalize(cameraPosition - vW); float l = dot(n, uSun);
        float day = smoothstep(-0.1, 0.16, l);
        float cl = texture2D(uClouds, vUv + vec2(uTime * 0.0004, 0.0)).r;
        vec3 dayC = texture2D(uDay, vUv).rgb * (0.012 + 1.3 * max(l, 0.0));
        dayC = mix(dayC, vec3(0.95, 0.97, 1.0) * (0.008 + 1.35 * max(l, 0.0)), cl * 0.8);
        float water = texture2D(uWater, vUv).r;
        vec3 H = normalize(uSun + V);
        dayC += vec3(1.0, 0.85, 0.65) * water * (1.0 - cl) * pow(max(dot(n, H), 0.0), 70.0) * 1.2 * step(0.0, l);
        vec3 nightC = pow(texture2D(uNight, vUv).rgb, vec3(1.35)) * 3.6 * (1.0 - cl * 0.7);
        float off = 0.0;
        for (int i = 0; i < 3; i++) { float a = acos(clamp(dot(n, uOff[i]), -1.0, 1.0)); off += exp(-pow(a / 0.0055, 2.0)) * 2.5 + exp(-pow(a / 0.02, 2.0)) * 0.5; }
        nightC += vec3(1.0, 0.72, 0.62) * off * (0.85 + 0.15 * sin(uTime * 2.0));
        vec3 col = mix(nightC, dayC, day) + nightC * 0.04;
        col += vec3(1.0, 0.42, 0.2) * exp(-pow(l / 0.07, 2.0)) * 0.1 * (1.0 - cl * 0.5);
        float rim = pow(1.0 - max(dot(n, V), 0.0), 2.5);
        col += mix(vec3(0.004, 0.01, 0.03), vec3(0.28, 0.5, 1.0), smoothstep(-0.2, 0.3, l)) * rim * 0.75;
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  }));
  earth.position.copy(C); earth.quaternion.copy(EARTH_Q); bg.add(earth);

  // ---- the atmosphere: a glow just outside the limb, blue by day, orange at sunrise, bright looking into the sun
  const atmo = new THREE.Mesh(new THREE.SphereGeometry(R * 1.04, 128, 64), new THREE.ShaderMaterial({
    uniforms: { uSun: { value: sunDir }, uC: { value: C } }, side: THREE.BackSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `varying vec3 vW; void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: `uniform vec3 uSun, uC; varying vec3 vW;
      void main() {
        vec3 ro = cameraPosition, rd = normalize(vW - ro);
        float tc = dot(uC - ro, rd); vec3 p = ro + rd * tc; float h = length(p - uC);
        float R = ${R.toFixed(1)};
        if (h < R) discard;
        float x = (h - R) / (R * 0.04);
        float glow = exp(-x * 4.0) * (1.0 - smoothstep(0.85, 1.0, x));
        vec3 up = normalize(p - uC); float lit = dot(up, uSun);
        vec3 col = mix(vec3(0.02, 0.04, 0.12), vec3(0.3, 0.55, 1.0), smoothstep(-0.25, 0.35, lit));
        col = mix(col, vec3(1.0, 0.5, 0.25), exp(-pow(lit / 0.18, 2.0)) * 0.8);
        float fwd = pow(max(dot(rd, uSun), 0.0), 12.0);
        gl_FragColor = vec4(col * glow * (0.9 + 3.0 * fwd), 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  }));
  atmo.position.copy(C); bg.add(atmo);

  // ---- the sun: a hot core, a wide glow and a streak; hidden when Earth is in the way
  const sunCore = new THREE.Sprite(new THREE.SpriteMaterial({ map: softDot(128, [[0, 'rgba(255,255,255,1)'], [0.2, 'rgba(255,250,235,1)'], [0.45, 'rgba(255,220,170,.35)'], [1, 'rgba(255,200,150,0)']]), color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  const sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: softDot(128, [[0, 'rgba(255,230,190,.6)'], [0.3, 'rgba(255,190,130,.18)'], [1, 'rgba(255,160,100,0)']]), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  const streak = new THREE.Sprite(new THREE.SpriteMaterial({ map: softDot(128, [[0, 'rgba(255,240,220,.7)'], [0.5, 'rgba(255,220,190,.12)'], [1, 'rgba(255,200,170,0)']]), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  bg.add(sunGlow, streak, sunCore);

  // ---- connections: beams from the F down to our offices, and arcs out from the offices to the world
  const lines = [], pulses = [];
  function curveLine(points, colour, width, opacity, dash, fade = 0) {
    const geo = new LineGeometry(); geo.setPositions(points.flatMap(p => [p.x, p.y, p.z]));
    const c = new THREE.Color(colour), cols = [];
    points.forEach((p, i) => { const t = i / (points.length - 1), k = fade ? Math.pow(t, fade) * 0.9 + 0.1 : Math.sin(Math.PI * t) * 0.85 + 0.15; cols.push(c.r * k, c.g * k, c.b * k); });
    geo.setColors(cols);
    const m = new LineMaterial({ color: 0xffffff, vertexColors: true, linewidth: width, transparent: true, opacity, depthWrite: false, dashed: true, dashSize: dash[0], gapSize: dash[1] });
    m.blending = THREE.AdditiveBlending;
    const l = new Line2(geo, m); l.computeLineDistances(); l.frustumCulled = false; bg.add(l); lines.push(l); return l;
  }
  function buildConnections() {
    const F = new THREE.Vector3(0, 0.15, 0);
    OFFICES.forEach(([, lat, lon], i) => {
      const g = onEarth(lat, lon), mid = F.clone().lerp(g, 0.5).add(new THREE.Vector3(0, 30 + i * 12, 0));
      const pts = new THREE.QuadraticBezierCurve3(F, mid, g).getPoints(90);
      const l = curveLine(pts, 0xff8fc8, 1.7, 0.9, [10, 7], 1.6); l.userData = { speed: 30 + i * 6, base: 0.9 };
      pulses.push({ curve: new THREE.QuadraticBezierCurve3(F, mid, g), speed: 0.11 + i * 0.02, off: i * 0.33, col: 0xffc0e0 });
    });
    MARKETS.filter((m, i) => i % 3 !== 2).forEach(([, lat, lon], i) => {
      const o = OFFICES[i % 3], a = local(o[1], o[2]), b = local(lat, lon);
      const ang = a.angleTo(b), lift = Math.min(0.045, ang * 0.05), pts = [];
      for (let k = 0; k <= 64; k++) {
        const t = k / 64, v = a.clone().lerp(b, t).normalize();
        pts.push(v.applyQuaternion(EARTH_Q).multiplyScalar(R * (1 + 0.004 + lift * Math.sin(Math.PI * t))).add(C));
      }
      const l = curveLine(pts, 0x9feaff, 1.1, 0.42, [2.5, 7]); l.userData = { speed: 10 + (i % 5) * 3, base: 0.42 };
    });
  }
  const pulseGeo = new THREE.BufferGeometry(), pulsePos = new Float32Array(9 * 3), pulseCol = new Float32Array(9 * 3);
  pulseGeo.setAttribute('position', new THREE.BufferAttribute(pulsePos, 3)); pulseGeo.setAttribute('color', new THREE.BufferAttribute(pulseCol, 3));
  const pulsePts = new THREE.Points(pulseGeo, new THREE.PointsMaterial({ map: softDot(64), color: 0xffd6ec, vertexColors: true, size: phone ? 8 : 10, sizeAttenuation: false, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  pulsePts.frustumCulled = false; pulsePts.layers.set(1); bg.add(pulsePts);
  const officeGlow = OFFICES.map(([, lat, lon]) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: softDot(64), color: 0xffb8dc, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    s.position.copy(onEarth(lat, lon, 1.5)); s.scale.setScalar(16); s.layers.set(1); bg.add(s); return s;
  });

  // ---- the F, chrome, with a reflection of the world around it
  const cubeRT = new THREE.WebGLCubeRenderTarget(phone ? 128 : 512, { type: THREE.HalfFloatType });
  const cubeCam = new THREE.CubeCamera(1, 5000, cubeRT); cubeCam.position.set(0, 1, 0);
  const chrome = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.35, roughness: 0.32, envMap: cubeRT.texture, envMapIntensity: 1.2, clearcoat: 1, clearcoatRoughness: 0.04, iridescence: 0.35, iridescenceIOR: 1.35, iridescenceThicknessRange: [300, 600] });
  // at night only its edges catch the glow; in the sun it turns to full colour, a thin-film sheen over the chrome
  // the F in candy paint under a clear coat: at night just the coat's highlights, in the sun its full colour
  const chromeU = { uDay: { value: 0 }, uNight: { value: 1 }, uTime: { value: 0 }, uObjToView: { value: new THREE.Matrix3() } };
  chrome.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, chromeU);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vObj;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvObj = (modelMatrix * vec4(position, 1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader.replace('uniform float opacity;', 'uniform float opacity; uniform float uDay, uNight, uTime; uniform mat3 uObjToView; varying vec3 vObj;\n'
        + 'vec3 h3(vec3 c) { return fract(sin(vec3(dot(c, vec3(127.1, 311.7, 74.7)), dot(c, vec3(269.5, 183.3, 246.1)), dot(c, vec3(113.5, 271.9, 124.6)))) * 43758.5453) - 0.5; }')
      .replace('#include <color_fragment>', `#include <color_fragment>
        float gt = clamp(vObj.y / 1.95 * 0.7 + (vObj.z + 0.83) / 1.55 * 0.3, 0.0, 1.0);
        vec3 gc = mix(vec3(0.22, 0.05, 0.75), vec3(0.95, 0.06, 0.42), smoothstep(0.0, 0.42, gt));
        gc = mix(gc, vec3(1.0, 0.32, 0.18), smoothstep(0.42, 0.75, gt));
        gc = mix(gc, vec3(1.0, 0.68, 0.16), smoothstep(0.75, 1.0, gt));
        diffuseColor.rgb = gc;`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        float fr = pow(1.0 - saturate(dot(normalize(normal), normalize(vViewPosition))), 2.0);
        totalEmissiveRadiance += vec3(0.55, 0.7, 1.0) * pow(fr, 3.0) * 0.5 * uNight;`);
  };
  const heroG = new THREE.Group(); fg.add(heroG);
  // navigation lights at the F's corners, blinking like a satellite's
  const navs = [[-0.13, 1.92, -0.8, 0xff3030, 0], [-0.13, 1.86, 0.69, 0x30ff70, 0.5], [-0.13, 0.04, -0.55, 0xffffff, 0.25]].map(([x, y, z, c, ph]) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: softDot(64), color: c, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    s.position.set(x, y, z); s.scale.setScalar(0.22); s.userData.ph = ph; heroG.add(s); return s;
  });
  const sunLight = new THREE.DirectionalLight(0xfff3e2, 0); sunLight.castShadow = true; sunLight.shadow.mapSize.set(1024, 1024);
  Object.assign(sunLight.shadow.camera, { left: -2, right: 2, top: 2, bottom: -2, near: 1, far: 30 }); sunLight.shadow.bias = -0.0005;
  const earthShine = new THREE.HemisphereLight(0x000000, 0x30476e, 0.4);
  fg.add(sunLight, sunLight.target, earthShine);

  // ---- an astronaut doing maintenance on the F
  const astro = new THREE.Group(); let spark = null, sparkLight = null, forearm = null;
  function buildAstronaut() {
    const suit = new THREE.MeshStandardMaterial({ color: 0xeeeeea, roughness: 0.78, metalness: 0.0 });
    const grey = new THREE.MeshStandardMaterial({ color: 0x8a8d93, roughness: 0.5, metalness: 0.4 });
    const visor = new THREE.MeshStandardMaterial({ color: 0xd9a441, roughness: 0.06, metalness: 1, envMap: cubeRT.texture, envMapIntensity: 1.5 });
    const part = (geo, mat, x, y, z, rx = 0, ry = 0, rz = 0, parent = astro) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.rotation.set(rx, ry, rz); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m; };
    part(new THREE.CapsuleGeometry(0.07, 0.11, 6, 14), suit, 0, 0, 0);
    part(new THREE.BoxGeometry(0.15, 0.19, 0.08), suit, 0, 0.01, -0.085);
    part(new THREE.BoxGeometry(0.07, 0.05, 0.03), grey, 0, 0.0, 0.07);
    part(new THREE.SphereGeometry(0.066, 24, 16), suit, 0, 0.145, 0);
    part(new THREE.SphereGeometry(0.058, 24, 16, Math.PI * 0.08, Math.PI * 0.84, Math.PI * 0.25, Math.PI * 0.42), visor, 0, 0.147, 0.012);
    part(new THREE.TorusGeometry(0.052, 0.008, 8, 24), grey, 0, 0.1, 0, Math.PI / 2);
    // left arm resting, right arm reaching out to the F with a tool
    const sh = (side) => { const g = new THREE.Group(); g.position.set(side * 0.085, 0.06, 0); astro.add(g); return g; };
    const lA = sh(-1); lA.rotation.set(0.3, 0, 0.35); part(new THREE.CapsuleGeometry(0.026, 0.08, 4, 10), suit, 0, -0.06, 0, 0, 0, 0, lA); part(new THREE.CapsuleGeometry(0.024, 0.07, 4, 10), suit, 0, -0.15, 0.03, -0.5, 0, 0, lA); part(new THREE.SphereGeometry(0.026, 12, 8), grey, 0, -0.2, 0.06, 0, 0, 0, lA);
    const rA = sh(1); rA.rotation.set(-1.2, 0, -0.25); part(new THREE.CapsuleGeometry(0.026, 0.08, 4, 10), suit, 0, -0.06, 0, 0, 0, 0, rA);
    forearm = new THREE.Group(); forearm.position.set(0, -0.11, 0); rA.add(forearm); forearm.rotation.x = -0.6;
    part(new THREE.CapsuleGeometry(0.024, 0.07, 4, 10), suit, 0, -0.05, 0, 0, 0, 0, forearm); part(new THREE.SphereGeometry(0.026, 12, 8), grey, 0, -0.1, 0, 0, 0, 0, forearm);
    part(new THREE.CylinderGeometry(0.008, 0.012, 0.08, 8), grey, 0, -0.15, 0, 0, 0, 0, forearm);
    // legs as proper joints: hip, knee and ankle, so the shin hangs from the knee and the boots point forward
    const leg = (side, hipBend, kneeBend, ankleBend) => {
      const hip = new THREE.Group(); hip.position.set(side * 0.04, -0.12, 0); hip.rotation.set(hipBend, 0, side * 0.06); astro.add(hip);
      part(new THREE.CapsuleGeometry(0.032, 0.1, 4, 10), suit, 0, -0.07, 0, 0, 0, 0, hip);
      const knee = new THREE.Group(); knee.position.set(0, -0.15, 0); knee.rotation.x = kneeBend; hip.add(knee);
      part(new THREE.SphereGeometry(0.031, 12, 8), suit, 0, 0, 0, 0, 0, 0, knee);
      part(new THREE.CapsuleGeometry(0.029, 0.095, 4, 10), suit, 0, -0.066, 0, 0, 0, 0, knee);
      const ankle = new THREE.Group(); ankle.position.set(0, -0.14, 0); ankle.rotation.x = ankleBend; knee.add(ankle);
      part(new THREE.SphereGeometry(0.03, 12, 8), suit, 0, 0, 0, 0, 0, 0, ankle);
      part(new THREE.CapsuleGeometry(0.027, 0.055, 4, 10), suit, 0, -0.012, 0.03, Math.PI / 2, 0, 0, ankle);
      part(new THREE.BoxGeometry(0.05, 0.014, 0.1), grey, 0, -0.036, 0.03, 0, 0, 0, ankle);
    };
    leg(-1, -0.5, 0.85, -0.05); leg(1, -0.3, 0.6, 0.0);
    // tip of the tool: a welding spark and its light
    spark = new THREE.Sprite(new THREE.SpriteMaterial({ map: softDot(64), color: 0xbfe6ff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    spark.position.set(0, -0.2, 0); spark.scale.setScalar(0.1); forearm.add(spark);
    sparkLight = new THREE.PointLight(0x9fd8ff, 0, 1.5, 2); sparkLight.position.set(0, -0.2, 0); forearm.add(sparkLight);
    astro.scale.setScalar(1.1);
    astro.position.set(-0.42, 1.58, 1.05); astro.rotation.set(0.15, 2.3, -0.25);
    fg.add(astro);
    // tether back to the F
    const a = new THREE.Vector3(-0.42, 1.6, 0.9), b = new THREE.Vector3(-0.05, 1.2, 0.45);
    const curve = new THREE.CatmullRomCurve3([a, a.clone().lerp(b, 0.3).add(new THREE.Vector3(-0.15, -0.25, 0.1)), a.clone().lerp(b, 0.7).add(new THREE.Vector3(-0.05, -0.3, 0.05)), b]);
    fg.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 0.004, 5), suit));
  }

  const labelsEl = document.getElementById('labels'), labels = []; let fMesh = null;
  const world = {
    id: 'orbit', scene: fg, entering: 'Going into orbit', exposure: 1.0,
    kicker: 'World test 03 · About', title: 'In orbit',
    blurb: 'The F above Earth at night, catching the first light as day comes round. London, Barcelona and Abu Dhabi shine brightest, connected to the world.',
    cam: { radius: 6.6, height: 2.3, look: 0.95, lookPhone: 0.6, fov: 38, far: 4000 },
    assets: () => [WDIR + (phone ? 'day-2k.jpg' : 'day-4k.jpg'), WDIR + (phone ? 'night-2k.jpg' : 'night-4k.jpg'), WDIR + 'clouds-2k.jpg', WDIR + 'water-2k.jpg'],
    views: [{ label: 'Hero view', deg: 0 }, { label: 'About angle', deg: -105 }, { label: 'Into the sun', deg: 140 }],
    toggle: { label: 'Connections', set(on) { arcsGoal = on ? 1 : 0; } },
    async load() {
      const big = !phone;
      const [day, night, clouds, water, logo] = await Promise.all([
        loadTex(WDIR + (big ? 'day-4k.jpg' : 'day-2k.jpg')), loadTex(WDIR + (big ? 'night-4k.jpg' : 'night-2k.jpg')), loadTex(WDIR + 'clouds-2k.jpg', false), loadTex(WDIR + 'water-2k.jpg', false), loadGLB64(LOGO_URL),
      ]);
      [day, night, clouds, water].forEach(t => { t.anisotropy = 8; });
      clouds.wrapS = THREE.RepeatWrapping;
      earthU.uDay.value = day; earthU.uNight.value = night; earthU.uClouds.value = clouds; earthU.uWater.value = water;
      const g = logo.scene; g.scale.setScalar(3.416); g.position.y = 0.0476 * 3.416;
      g.traverse(o => { if (o.isMesh) { o.material = chrome; o.castShadow = true; o.receiveShadow = true; fMesh = fMesh || o; } });
      const inner = new THREE.Group(); inner.add(g); inner.rotation.y = -Math.PI / 2; inner.position.set(-0.056, 0, -0.056); heroG.add(inner);
      buildAstronaut(); buildConnections();
      OFFICES.forEach(([name]) => { const el = document.createElement('div'); el.className = 'city-label'; el.textContent = name; labelsEl.appendChild(el); labels.push(el); });
    },
    enter() { t0 = clock.elapsedTime; labelsEl.hidden = false; camera.layers.enable(1); },
    reveal() { t0 = clock.elapsedTime; },   // night again each time you arrive, so the sunrise plays
    exit() { labelsEl.hidden = true; camera.layers.disable(1); },
    resize(w, h) { for (const l of lines) l.material.resolution.set(w, h); },
    update(t, dt) {
      const tt = t - t0;
      // the sun comes round: Earth's axis is fixed, the point under the sun moves west
      const delta = SUNRISE + 360 * 10 / P - 360 * tt / P;   // degrees east of the point under the F
      tmp.copy(local(0, SUB.lon + delta)).applyQuaternion(EARTH_Q); sunDir.copy(tmp).normalize();
      // is the F in Earth's shadow? soft at the edge, which is when its edges catch the first light
      const v = tmp.set(0, 1, 0).sub(C), along = v.dot(sunDir), off = v.clone().sub(sunDir.clone().multiplyScalar(along)).length();
      const target = along > 0 ? 1 : THREE.MathUtils.smoothstep(off, R * 0.985, R * 1.03);
      light += (target - light) * (1 - Math.exp(-dt * 4));
      sunLight.position.copy(sunDir).multiplyScalar(15); sunLight.target.position.set(0, 1, 0);
      sunLight.intensity = 3.4 * light;
      chromeU.uDay.value = light; chromeU.uNight.value = 1 - light; chromeU.uTime.value = t;
      if (fMesh) { fMesh.updateWorldMatrix(true, false); chromeU.uObjToView.value.setFromMatrix4(new THREE.Matrix4().multiplyMatrices(camera.matrixWorldInverse, fMesh.matrixWorld)); }
      navs.forEach(n => { const k = (t * 0.8 + n.userData.ph) % 1; n.material.opacity = k < 0.08 ? 1 : 0.08; n.scale.setScalar(k < 0.08 ? 0.3 : 0.16); });
      // light from Earth below: blue by day, a faint warm glow of cities at night
      const below = nW.dot(sunDir);
      earthShine.groundColor.setRGB(0.12 + 0.2 * Math.max(below, 0), 0.16 + 0.3 * Math.max(below, 0), 0.22 + 0.5 * Math.max(below, 0));
      earthShine.intensity = 0.25 + 0.9 * Math.max(below, 0);
      const sp = sunDir.clone().multiplyScalar(2400);
      sunCore.position.copy(sp); sunGlow.position.copy(sp); streak.position.copy(sp);
      sunCore.scale.setScalar(150); sunGlow.scale.setScalar(900 + 400 * (1 - light)); streak.scale.set(2600, 60, 1);
      // the F floats, turning a little
      heroG.position.y = Math.sin(t * 0.45) * 0.05; heroG.rotation.y = Math.sin(t * 0.13) * 0.08; heroG.rotation.z = Math.sin(t * 0.21) * 0.02;
      astro.position.y = 1.58 + heroG.position.y + Math.sin(t * 0.6 + 1) * 0.015; astro.rotation.z = -0.25 + Math.sin(t * 0.4) * 0.04;
      if (forearm) forearm.rotation.x = -0.6 + Math.sin(t * 1.3) * 0.08;
      const weld = (Math.sin(t * 0.8) > 0.2) ? (0.6 + 0.4 * Math.random()) : 0;
      if (spark) { spark.material.opacity = weld; spark.scale.setScalar(0.06 + 0.08 * weld); sparkLight.intensity = 0.6 * weld; }
      // connections
      arcsOn += (arcsGoal - arcsOn) * (1 - Math.exp(-dt * 3));
      for (const l of lines) { l.material.dashOffset -= dt * l.userData.speed; l.material.opacity = l.userData.base * arcsOn; l.visible = arcsOn > 0.01; }
      pulses.forEach((p, i) => { const u = (tt * p.speed + p.off) % 1, q = p.curve.getPoint(1 - u), k = Math.sin(Math.PI * u); pulsePos.set([q.x, q.y, q.z], i * 3); pulseCol.set([k, k, k], i * 3); });
      pulseGeo.attributes.position.needsUpdate = true; pulseGeo.attributes.color.needsUpdate = true; pulsePts.material.opacity = arcsOn;
      const nightUnder = 1 - THREE.MathUtils.smoothstep(below, -0.1, 0.25);
      officeGlow.forEach((s, i) => { s.material.opacity = (0.35 + 0.65 * nightUnder) * (0.8 + 0.2 * Math.sin(t * 2 + i)); });
      earthU.uTime.value = t;
      // the F's reflections: refresh the view of the world from the F a few times a second
      if ((Math.floor(t * 30) % 4) === 0) { heroG.visible = false; cubeCam.update(renderer, bg); heroG.visible = true; }
      // labels for the offices
      OFFICES.forEach(([, lat, lon], i) => {
        const p = onEarth(lat, lon, 2), n = p.clone().sub(C).normalize(), toCam = camera.position.clone().sub(p).normalize();
        const s = p.clone().project(camera), vis = n.dot(toCam) > 0.05 && s.z < 1 && Math.abs(s.x) < 1.1 && Math.abs(s.y) < 1.1;
        const el = labels[i]; if (!el) return;
        el.style.opacity = vis ? String(0.95 * (0.5 + 0.5 * arcsOn)) : '0';
        el.style.transform = `translate(${(s.x * 0.5 + 0.5) * innerWidth + 8}px, ${(-s.y * 0.5 + 0.5) * innerHeight - 6}px)`;
      });
    },
    hero: heroG,
    compileExtra(r, cam) { r.compile(bg, cam); },
    render(r, cam) {
      r.autoClear = false; r.setClearColor(0x000000, 1); r.clear();
      r.render(bg, cam); r.render(fg, cam);
      r.autoClear = true;
    },
  };
  return world;
})();
