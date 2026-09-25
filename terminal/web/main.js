// Koodisampo Terminal — selainisäntä.
//
// Ohut kerros: lataa kysymyspankit, antaa Ranger-sovellukselle kellon,
// näppäimet ja kosketukset, ja maalaa sen palauttaman EVG-näyttölistan
// WebGL 2:lla. Pelilogiikka ja ruudun asettelu ovat KoodisampoTerminal.rgr:ssä.
import { prepareDisplayList, setFontFallback } from "./vendor/evg-webgl.js";
import { moireEnvelope } from "./moire.js";
import { installCanvasMeasurer } from "./vendor/evg-measure.js";

const CONTENT = new URL("../content/question-banks/", location.href);
// Opiskelumateriaali (Docusaurus) julkaistaan pelin viereen: /koodisampo/opiskelu/
const STUDY = new URL("../opiskelu/", location.href);
// Aiheet, joita opiskelusivustolla ei ole (scripts/study-sync-docs.mjs).
const NO_STUDY_DOMAINS = new Set(["kids"]);
// Pankit, joita terminaalissa ei kysytä (lasten kysymykset kuuluvat pelin lapsitilaan).
const SKIP_BANKS = new Set(["kids-easy.json"]);

// Pankin tiedostonimi → aiheen nimi valikossa.
const TITLES = {
  "backend-ops.json": "BACKEND JA TRANSAKTIOT",
  "cpp-best-practices.json": "MODERNI C++",
  "docker-ops.json": "DOCKER",
  "git-ci.json": "GIT JA CI",
  "javascript-web.json": "JAVASCRIPT JA WEB",
  "linux-ops.json": "LINUX JA SYSTEMD",
  "postgresql-tuning.json": "POSTGRESQL-VIRITYS",
  "qt-dev.json": "QT-KEHITYS",
  "qt-native-game.json": "QT-NATIIVIPELI",
  "robot-framework.json": "ROBOT FRAMEWORK",
  "rust.json": "RUST",
  "scrum-best-practices.json": "SCRUM",
  "space-gnss.json": "AVARUUS JA GNSS",
  "sql-query-design.json": "SQL-KYSELYT",
  "web-security.json": "WEB-TIETOTURVA",
};
const THEMES = ["green", "amber", "white"];
const KEYS = new Set(["Enter", " ", "Escape", "ArrowUp", "ArrowDown", "Backspace"]);

const canvas = document.getElementById("screen");
const msg = document.getElementById("msg");
const sr = document.getElementById("sr");
const srLesson = document.getElementById("srLesson");

function fail(text) {
  msg.textContent = text;
}

function store(key, value) {
  try {
    if (value === undefined) return localStorage.getItem(key);
    localStorage.setItem(key, value);
  } catch {
    return null;
  }
  return null;
}

async function loadBanks(app) {
  const files = await (await fetch(new URL("manifest.json", CONTENT))).json();
  const banks = await Promise.all(
    files.filter((f) => !SKIP_BANKS.has(f)).map(async (f) => {
      try {
        const r = await fetch(new URL(f, CONTENT));
        return r.ok ? { file: f, bank: await r.json() } : null;
      } catch {
        return null;
      }
    }),
  );
  const list = banks.filter(Boolean).sort((a, b) => titleOf(a).localeCompare(titleOf(b), "fi"));
  for (const item of list) {
    const t = app.addTopic(item.bank.id || item.file, titleOf(item));
    for (const q of item.bank.questions || []) {
      if (!q.prompt || !Array.isArray(q.choices) || q.choices.length < 2) continue;
      const qi = app.addQuestion(t, q.prompt, q.correctFeedback || "", q.wrongFeedback || "");
      for (const c of q.choices) app.addChoice(qi, String(c.text), !!c.correct);
      const url = lessonUrl(q, item.bank);
      if (url) app.setQuestionLink(qi, url);
    }
  }
}

// Sama osoite kuin pelin "Lue oppitunti" -linkissä (hosts/shared/studyLessonLinks.mjs):
// aihesivu /docs/topics/<domain>/ ja ankkuri kysymyksen id:hen.
function lessonUrl(q, bank) {
  const ref = (q.lessonRef || "").replace(/^\/+|\/+$/g, "").split("/")[0];
  const domain = ref || q.domain || bank.domain || String(bank.id || "").split("-")[0] || "general";
  if (NO_STUDY_DOMAINS.has(domain) || !q.id) return "";
  return new URL(`docs/topics/${encodeURIComponent(domain)}/#${encodeURIComponent(q.id)}`, STUDY).href;
}

function openLink(url) {
  if (!url) return;
  const w = window.open(url, "_blank", "noopener");
  if (w) w.opener = null;
}

function titleOf(item) {
  return TITLES[item.file] || String(item.bank.id || item.file).replace(/\.json$/, "").toUpperCase();
}

// Näppäinääni: lyhyt suodatettu kohinapurske, kuin vanhan päätteen näppäin.
function makeClicker() {
  let ac = null;
  let noise = null;
  let last = 0;
  return {
    enabled: store("ks-terminal-sound") !== "0",
    wake() {
      if (ac || !this.enabled) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ac = new AC();
      noise = ac.createBuffer(1, Math.floor(ac.sampleRate * 0.03), ac.sampleRate);
      const d = noise.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3);
    },
    click() {
      if (!ac || !this.enabled || ac.state !== "running") return;
      const now = ac.currentTime;
      if (now - last < 0.025) return;
      last = now;
      const src = ac.createBufferSource();
      src.buffer = noise;
      src.playbackRate.value = 0.8 + Math.random() * 0.5;
      const bp = ac.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 1800 + Math.random() * 900;
      const g = ac.createGain();
      g.gain.value = 0.18;
      src.connect(bp).connect(g).connect(ac.destination);
      src.start(now);
    },
    toggle() {
      this.enabled = !this.enabled;
      store("ks-terminal-sound", this.enabled ? "1" : "0");
      if (this.enabled) this.wake();
    },
  };
}

async function main() {
  const gl = canvas.getContext("webgl2", { antialias: true, premultipliedAlpha: false, stencil: true });
  if (!gl) return fail("TÄMÄ SELAIN EI TUE WEBGL 2:TA.");
  if (typeof KoodisampoTerminal !== "function") return fail("koodisampo-terminal.js puuttuu.");

  // Sama fontti mitataan (EVG:n layout) ja piirretään (WebGL-atlas).
  setFontFallback(["VT323"]);
  const measure = installCanvasMeasurer(globalThis.KoodisampoTerminalModule, { fallback: ["VT323"] });
  try {
    await document.fonts.load('32px "VT323"');
  } catch {
    /* järjestelmän monospace kelpaa varalle */
  }
  measure.refresh();

  const app = new KoodisampoTerminal();
  const studyHub = new URL("docs/intro/", STUDY).href;
  app.setStudyUrl(studyHub);
  document.getElementById("srStudy").href = studyHub;
  app.setSeed((Date.now() ^ (Math.random() * 0x7fffffff)) & 0x7fffffff);
  const savedTheme = Number(store("ks-terminal-theme") || 0);
  app.setTheme(savedTheme >= 0 && savedTheme < THEMES.length ? savedTheme : 0);

  try {
    await loadBanks(app);
  } catch (e) {
    return fail("KYSYMYSPANKKIEN LATAUS EPÄONNISTUI.\n" + String(e && e.message || e));
  }
  if (app.questionCount() === 0) return fail("EI KYSYMYKSIÄ.");
  msg.textContent = "";

  const coarseQuery = matchMedia("(pointer: coarse)");
  const clicker = makeClicker();
  let dpr = 1;
  let needPaint = true;

  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(280, window.innerWidth);
    const h = Math.max(320, window.innerHeight);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    app.setViewport(w, h, coarseQuery.matches);
    needPaint = true;
  }
  window.addEventListener("resize", resize);
  coarseQuery.addEventListener?.("change", resize);
  resize();

  // Moiré liikkuu hitaasti; liikettä vähentävä asetus pysäyttää sen ja
  // E-näppäin kytkee sen pois kokonaan (muistetaan selaimessa).
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  let effectOn = store("ks-terminal-moire") !== "0";
  let doc = null;
  let built = null;
  let fxTime = 0;
  let fxWasVisible = false;

  function draw() {
    for (const inst of doc.list.effects || []) {
      inst.off = !effectOn;
      inst.time = fxTime;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    built.draw();
  }

  let lastTheme = -1;
  let wasDone = false;
  function paint() {
    doc = JSON.parse(app.render());
    if (built) built.dispose();
    built = prepareDisplayList(gl, doc, { dpr });
    draw();
    const theme = app.themeIndex();
    if (theme !== lastTheme) {
      lastTheme = theme;
      document.documentElement.dataset.theme = THEMES[theme] || "green";
      document.querySelector('meta[name="theme-color"]').content = doc.bg;
      store("ks-terminal-theme", String(theme));
    }
    const lesson = app.currentLesson();
    srLesson.hidden = !lesson;
    if (lesson) srLesson.href = lesson;
    const done = app.typingDone();
    if (done && !wasDone) sr.textContent = app.screenText();
    wasDone = done;
    window.__ksTerminal = {
      app, commands: doc.list.cmds.length, cssErrors: doc.cssErrors, mode: app.modeIndex(),
      // Tarkistuksia varten: siirrä efektin kelloa (s).
      setFxTime(t) { fxTime = t; needPaint = true; },
    };
  }

  app.start();
  let prev = performance.now();
  function tickFrame(now) {
    const dt = now - prev;
    prev = now;
    if (app.tick(dt)) needPaint = true;
    if (app.takeTyped() > 0) clicker.click();
    const fx = doc && (doc.list.effects || [])[0];
    let moving = false;
    if (effectOn && !still.matches && fx) {
      fxTime += dt / 1000;
      // Piirretään joka ruutu vain kun efekti näkyy, ja kerran sen jälkeen,
      // jotta viimeinenkin jälki pyyhkiytyy pois.
      const visible = moireEnvelope(fxTime, fx.p) > 0;
      moving = visible || fxWasVisible;
      fxWasVisible = visible;
    }
    if (needPaint) {
      needPaint = false;
      paint();
    } else if (moving) {
      draw();
    }
    requestAnimationFrame(tickFrame);
  }
  requestAnimationFrame(tickFrame);

  window.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    clicker.wake();
    if (e.key === "m" || e.key === "M") {
      clicker.toggle();
      return;
    }
    if (e.key === "e" || e.key === "E") {
      effectOn = !effectOn;
      store("ks-terminal-moire", effectOn ? "1" : "0");
      needPaint = true;
      return;
    }
    if (app.keyDown(e.key) || KEYS.has(e.key)) {
      e.preventDefault();
      needPaint = true;
    }
    openLink(app.takeOpenUrl());
  });

  canvas.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    canvas.style.cursor = app.linkAt(e.clientX - r.left, e.clientY - r.top) ? "pointer" : "text";
  });

  // pointerup eikä pointerdown: kosketuksessa vasta nosto on käyttäjän ele,
  // jonka aikana selain sallii uuden ikkunan avaamisen.
  canvas.addEventListener("pointerup", (e) => {
    clicker.wake();
    const r = canvas.getBoundingClientRect();
    app.tap(e.clientX - r.left, e.clientY - r.top);
    needPaint = true;
    openLink(app.takeOpenUrl());
  });
}

main().catch((e) => fail("VIRHE: " + String(e && e.stack || e)));
