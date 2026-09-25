// Moiré — EVG surface effect -plugin (filter) Koodisampo Terminalille.
//
// Kaksi hienoa ristikkoa päällekkäin. Toisen vaihe on hieman siirretty:
// loiva kallistus antaa leveät juovat, ja muutama paikallinen kumpare antaa
// samankeskiset ellipsit ("pallot"), kuten putkinäytön maskin ja kameran
// kennon moiréssa. Vaikutus on tarkoituksella heikko: tekstiä tummennetaan
// muutama prosentti ja taustaan tulee hento väri vain vyöhykkeiden kohdalla.
//
// Ja se on HETKITTÄINEN: jokaisessa `every` sekunnin jaksossa efekti häivyttyy
// esiin kerran `duration` sekunniksi, jakson sisällä vaihtelevaan kohtaan, ja
// pallot ovat joka kerta eri paikoissa. Muun ajan ruutu on puhdas.
// `moireEnvelope` laskee saman käyrän JavaScriptissä, jotta isäntä piirtää
// joka ruudun vain silloin kun efekti näkyy.
//
// Hajautus ei käytä sin()-temppua: GPU:n sin ei ole bitilleen sama kuin
// JavaScriptin, ja isännän ja shaderin on oltava samaa mieltä ajoituksesta.
//
// Käyttö tyylissä (KoodisampoTerminal.rgr):
//   evg-surface-effect: moire; evg-effect-on: always; evg-fx-<param>: <luku>
import { registerSurfaceEffect } from "./vendor/evg-webgl.js";

export const MOIRE_DEFAULTS = {
  strength: 0.1,  // ristikon tummennus, 0 = pois
  glow: 0.06,     // vyöhykkeiden väri taustalla
  period: 3.2,    // viivaväli, px
  skew: 2.2,      // juovien tiheys (toisen ristikon kallistus), astetta
  rings: 4,       // renkaita pallossa
  balls: 3,       // pallojen määrä, 0…4
  speed: 0.05,    // ajelehtimisnopeus, kierrosta / s
  every: 24,      // jakson pituus, s
  duration: 6,    // kuinka kauan efekti näkyy jaksossa, s (sis. häivytykset)
  r: 0.25, g: 1.0, b: 0.44,
};

registerSurfaceEffect({
  name: "moire",
  layer: "filter",
  params: MOIRE_DEFAULTS,
  frag: `
float moireHash(float n) { return fract(n * 0.6180339887 + fract(n * n * 0.0137 + 0.31)); }

// Sama käyrä kuin moireEnvelope() alla.
float moireEnv(float t) {
  float every = max(p_every, 1.0);
  float dur = clamp(p_duration, 0.5, every);
  float n = floor(t / every);
  float x = t - n * every - moireHash(n) * (every - dur);
  float fade = min(1.5, dur * 0.5);
  float inside = step(0.0, x) * step(x, dur);
  return inside * smoothstep(0.0, fade, x) * smoothstep(0.0, fade, dur - x);
}

vec4 fxColor(vec2 p, vec2 local) {
  vec3 c = texture(uSrc, vUV).rgb;
  float env = moireEnv(uTime);
  if (env <= 0.0) return vec4(c, 1.0);
  vec2 q = p - 0.5 * uRes;
  float t = uTime * p_speed * 6.2831853;
  float n = floor(uTime / max(p_every, 1.0));
  float per = max(p_period, 1.5);
  // Ristikko kaartuu reunoilla kuin putken lasi.
  vec2 w = q + vec2(0.00012 * q.y * q.y, 0.00016 * q.x * q.x);
  // Toisen ristikon vaihesiirto (kierroksina): kallistus + aalto + pallot.
  float d = q.x * tan(radians(p_skew)) / per * 0.12 + 0.35 * sin(q.y * 0.004 + t);
  for (int i = 0; i < 4; i++) {
    if (float(i) >= p_balls) break;
    float fi = float(i);
    vec2 ci = (vec2(moireHash(n * 3.0 + fi + 1.0), moireHash(n * 7.0 + fi * 5.0 + 2.0)) - 0.5) * uRes * 0.8;
    ci += 18.0 * vec2(sin(t + fi * 2.1), cos(t * 0.8 + fi * 1.3));
    float s = uRes.y * (0.09 + 0.07 * moireHash(n + fi * 11.0 + 3.0));
    vec2 e = (q - ci) / vec2(s, s * 1.5);
    d += p_rings * exp(-dot(e, e));
  }
  const float TAU = 6.2831853;
  float my = (0.5 + 0.5 * cos(TAU * w.y / per)) * (0.5 + 0.5 * cos(TAU * (w.y / per + d)));
  float mx = (0.5 + 0.5 * cos(TAU * w.x / per)) * (0.5 + 0.5 * cos(TAU * (w.x / per + d * 0.8)));
  float m = mx + my;                        // 0…2, keskimäärin 0,5
  float beat = 0.5 + 0.5 * cos(TAU * d);    // pelkät matalataajuiset vyöhykkeet
  float dark = env * p_strength * clamp(1.0 - m, 0.0, 1.0);
  vec3 col = c * (1.0 - dark) + vec3(p_r, p_g, p_b) * (env * p_glow * beat * min(m, 1.0));
  return vec4(col, 1.0);
}
`,
});

const hash = (n) => {
  const a = n * n * 0.0137 + 0.31;
  const v = n * 0.6180339887 + (a - Math.floor(a));
  return v - Math.floor(v);
};

/** Efektin voimakkuus 0..1 hetkellä t (s): sama käyrä kuin shaderissa. */
export function moireEnvelope(t, p = {}) {
  const every = Math.max(p.every ?? MOIRE_DEFAULTS.every, 1);
  const dur = Math.min(Math.max(p.duration ?? MOIRE_DEFAULTS.duration, 0.5), every);
  const n = Math.floor(t / every);
  const x = t - n * every - hash(n) * (every - dur);
  if (x < 0 || x > dur) return 0;
  const fade = Math.min(1.5, dur * 0.5);
  const s = (e, v) => { const k = Math.min(Math.max(v / e, 0), 1); return k * k * (3 - 2 * k); };
  return s(fade, x) * s(fade, dur - x);
}
