/* ---------------- worlds: each page has its own ----------------
   Work keeps the desert. Capabilities is the studio with the flower F, Contact the city at night,
   About the F in orbit. Going into a page dives into the F, and that page's world is swapped in behind
   it, so you come back out somewhere new. The other worlds download quietly once the desert is up,
   and each one is built the first time its page covers the screen. */
const WORLD_OF = { work: 'desert', capabilities: 'studio', contact: 'city', about: 'orbit' };
const WORLD_YAW = { desert: 0, studio: 0, city: 0, orbit: -105 };   // turns a world so its best view faces its page's card
let worldKey = 'desert', desertUp;
const desertReady = new Promise(r => { desertUp = r; });
const activeCam = () => worldKey === 'desert' ? CAM : WORLDS[worldKey].cam;
const diveTarget = () => worldKey === 'desert' ? fGroup : (WORLDS[worldKey].hero || fGroup);
const building = {};
function buildWorld(key) {
  const w = WORLDS[key];
  if (!w || w.ready) return Promise.resolve();
  if (!building[key]) {
    building[key] = (async () => {
      await prefetchAssets(w.assets());
      await w.load(); w.ready = true;
      const W = innerWidth, H = innerHeight; w.resize?.(W, H);
      try { renderer.compile(w.scene, camera); w.compileExtra?.(renderer, camera); } catch (e) {}
    })().catch(e => { console.warn('world did not load', key, e); delete building[key]; throw e; });
  }
  return building[key];
}
function setWorld(key) {
  if (key === worldKey) return;
  if (worldKey !== 'desert') WORLDS[worldKey].exit?.();
  worldKey = key;
  const w = key === 'desert' ? null : WORLDS[key];
  w?.enter?.();
  camera.far = w ? (w.cam.far ?? 400) : 400; camera.updateProjectionMatrix();
  renderer.toneMappingExposure = w ? (w.exposure ?? 1) : 1.05;
  Sound.setWorld(key); renderMoods();
  const hint = document.getElementById('dragHint');
  if (hint) hint.textContent = { desert: 'Drag the desert to turn', studio: 'Drag the studio to turn', city: 'Drag the city to turn', orbit: 'Drag to orbit' }[key];
  fit();
}
function requestWorld(key, el) {
  if (!gl || key === worldKey) return;
  desertReady.then(() => buildWorld(key)).then(() => { if (openSheet && openSheet === el) setWorld(key); }).catch(() => {});
}
let prefetching = false;
function prefetchWorlds() {   // network only, so the desert keeps running smoothly
  if (prefetching || !gl) return; prefetching = true;
  const go = async () => { for (const k of ['studio', 'city', 'orbit']) await prefetchAssets(WORLDS[k].assets()); };
  if ('requestIdleCallback' in window) requestIdleCallback(go, { timeout: 4000 }); else setTimeout(go, 300);
}
