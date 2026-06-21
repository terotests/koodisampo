/** Yksinkertainen merkkijonon hash seediä varten. */
function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Yksinkertainen seeded PRNG (mulberry32). */
function mulberry32(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Fisher–Yates — sekoittaa vastausvaihtoehdot (ei muuta alkuperäistä listaa).
 * Seed per encounter + kysymys → sama järjestys uudelleen avattaessa, eri kohtaamisissa vaihtelee.
 */
export function shuffleChoices(choices, seedKey = "") {
  if (!Array.isArray(choices) || choices.length < 2) {
    return choices ? [...choices] : [];
  }

  const out = choices.map((c) => ({ ...c }));
  const rnd = mulberry32(hashString(seedKey || String(Math.random())));

  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rnd() * (i + 1));
    const tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
  }

  return out;
}
