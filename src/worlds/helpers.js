/* ---------------- shared by the worlds ---------------- */
const phone = matchMedia('(max-width: 720px)').matches;
const rnd = (a, b) => a + Math.random() * (b - a);
const WORLDS = {};
/* Assets are fetched in the background (prefetchAssets) and kept as blob URLs, so building a world later
   never waits on the network. */
const ASSET = new Map();
const asset = u => ASSET.get(u) || u;
async function prefetchAssets(urls) {
  for (const u of urls) {
    if (ASSET.has(u)) continue;
    try { const r = await fetch(u); if (r.ok) ASSET.set(u, URL.createObjectURL(await r.blob())); } catch (e) {}
  }
}
const texLoader = new THREE.TextureLoader();

async function loadGLB64(url) {
  const b64 = (await (await fetch(asset(url))).text()).trim();
  const bin = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  return new GLTFLoader().parseAsync(bin.buffer, '');
}
async function loadTex(url, srgb = true) {
  const t = await texLoader.loadAsync(asset(url));
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function softDot(size = 64, stops = [[0, 'rgba(255,255,255,1)'], [0.4, 'rgba(255,255,255,.35)'], [1, 'rgba(255,255,255,0)']]) {
  const c = document.createElement('canvas'); c.width = c.height = size; const g = c.getContext('2d');
  const gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  stops.forEach(([p, col]) => gr.addColorStop(p, col)); g.fillStyle = gr; g.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
/* Project an equirectangular panorama, captured at `eye`, onto whatever geometry uses this material.
   Exact wherever the geometry matches the real surfaces. The panorama is already tone mapped. */
const EQUIRECT_GLSL = `
  vec2 equirect(vec3 d) { return vec2(atan(d.z, d.x) * 0.15915494 + 0.5, asin(clamp(d.y, -1.0, 1.0)) * 0.31830989 + 0.5); }`;
function projectionMaterial(tex, eye, opts = {}) {
  return new THREE.ShaderMaterial({
    uniforms: { uPano: { value: tex }, uEye: { value: eye } }, side: opts.side ?? THREE.FrontSide, toneMapped: false,
    depthWrite: opts.depthWrite ?? true, depthTest: opts.depthTest ?? true,
    vertexShader: `varying vec3 vWorld; void main() { vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: `uniform sampler2D uPano; uniform vec3 uEye; varying vec3 vWorld; ${EQUIRECT_GLSL}
      void main() { gl_FragColor = vec4(texture2D(uPano, equirect(normalize(vWorld - uEye))).rgb, 1.0);
        #include <colorspace_fragment>
      }`,
  });
}
function panoTexture(tex) { tex.colorSpace = THREE.SRGBColorSpace; tex.generateMipmaps = false; tex.minFilter = THREE.LinearFilter; return tex; }
function envFrom(tex) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const e = tex.clone(); e.mapping = THREE.EquirectangularReflectionMapping; e.needsUpdate = true;
  const out = pmrem.fromEquirectangular(e).texture; pmrem.dispose(); return out;
}

