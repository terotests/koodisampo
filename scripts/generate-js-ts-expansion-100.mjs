#!/usr/bin/env node
/**
 * Generates scripts/data/expansion-batch-12.mjs — 100 JS/TS questions (easy → hard).
 * Run: node scripts/generate-js-ts-expansion-100.mjs
 */
import { writeFileSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const banksDir = resolve(__dirname, "../content/question-banks");

function loadExistingIds() {
  const ids = new Set();
  for (const file of ["javascript-web.json"]) {
    const bank = JSON.parse(readFileSync(resolve(banksDir, file), "utf8"));
    for (const q of bank.questions || []) ids.add(q.id);
  }
  return ids;
}

function loadExistingPrompts() {
  const prompts = new Set();
  const bank = JSON.parse(readFileSync(resolve(banksDir, "javascript-web.json"), "utf8"));
  for (const q of bank.questions || []) {
    prompts.add(q.prompt.toLowerCase().replace(/\s+/g, " ").trim());
  }
  return prompts;
}

/** @type {Array<Record<string, unknown>>} */
const QUESTIONS = [
  // === js-types difficulty 1-2 (easy) ===
  {
    id: "b12-js-types-const-reassign",
    chapter: "js-types",
    difficulty: 1,
    audiences: ["coworker", "secretary"],
    prompt: "Junior yrittää `const x = 1; x = 2;` — linter valittaa. Miksi?",
    choices: [
      { text: "const estää uudelleensijoituksen — arvo ei voi vaihtua", correct: true },
      { text: "const muuttujat poistetaan automaattisesti käytön jälkeen", correct: false },
      { text: "const toimii vain funktioiden sisällä", correct: false },
      { text: "const vaatii aina tyypityksen TypeScriptissä", correct: false },
    ],
    correctFeedback: "const sitoo identiteetin uudelleen — MDN const.",
    wrongFeedback: "const ≠ immutable objekti, mutta uudelleensijoitus on kielletty.",
    sourceRef: "mdn/const",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const",
    featureId: "js:const-binding",
    featurePoints: 2,
  },
  {
    id: "b12-js-types-let-block",
    chapter: "js-types",
    difficulty: 1,
    audiences: ["coworker"],
    prompt: "for-silmukassa `var i` vuotaa loopin ulkopuolelle. Turvallisempi vaihtoehto?",
    choices: [
      { text: "let — lohkoscoped muuttuja", correct: true },
      { text: "global i ilman avainsanaa", correct: false },
      { text: "var on ainoa tapa loop-muuttujalle", correct: false },
      { text: "const i++ toimii silmukassa", correct: false },
    ],
    correctFeedback: "let on block-scoped — MDN let vs var.",
    wrongFeedback: "var on function-scoped ja vuotaa for-loopista.",
    sourceRef: "mdn/let",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let",
    featureId: "js:let-block-scope",
    featurePoints: 2,
  },
  {
    id: "b12-js-types-template-literal",
    chapter: "js-types",
    difficulty: 1,
    audiences: ["coworker", "secretary"],
    prompt: "Haluat yhdistää `Hei ${name}` ilman + -ketjua. Mikä syntaksi?",
    choices: [
      { text: "Template literal backtick-merkeillä: `Hei ${name}`", correct: true },
      { text: "'Hei $name' yksinkertaisilla heittomerkeillä", correct: false },
      { text: "sprintf() on ainoa tapa JS:ssä", correct: false },
      { text: "String.concat vaatii kolme argumenttia", correct: false },
    ],
    correctFeedback: "Template literals tukevat ${} interpolointia — MDN.",
    wrongFeedback: "Yksittäiset lainausmerkit eivät interpoloi muuttujia.",
    sourceRef: "mdn/template_literals",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals",
    featureId: "js:template-literals",
    featurePoints: 2,
  },
  {
    id: "b12-js-types-array-push",
    chapter: "js-types",
    difficulty: 1,
    audiences: ["coworker"],
    prompt: "Lista `items = []` — haluat lisätä uuden rivin loppuun. Metodi?",
    choices: [
      { text: "items.push(newItem)", correct: true },
      { text: "items.add(newItem) kuten Setissä", correct: false },
      { text: "items.append() on Array-API", correct: false },
      { text: "items[length] = undefined lisää aina", correct: false },
    ],
    correctFeedback: "push lisää elementin taulukon loppuun — MDN Array.push.",
    wrongFeedback: "Array käyttää push/pop — add on Set/Map.",
    sourceRef: "mdn/array_push",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push",
    featureId: "js:array-push",
    featurePoints: 2,
  },
  {
    id: "b12-js-types-typeof-string",
    chapter: "js-types",
    difficulty: 1,
    audiences: ["coworker"],
    prompt: "Mikä `typeof 'hello'` palauttaa?",
    choices: [
      { text: "'string'", correct: true },
      { text: "'text'", correct: false },
      { text: "'String'", correct: false },
      { text: "'object'", correct: false },
    ],
    correctFeedback: "typeof primitiivistä string palauttaa 'string' — MDN typeof.",
    wrongFeedback: "typeof palauttaa pienellä kirjoitetun tyypin merkkijonon.",
    sourceRef: "mdn/typeof",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof",
    featureId: "js:typeof-primitive",
    featurePoints: 2,
  },
  {
    id: "b12-js-types-json-stringify",
    chapter: "js-types",
    difficulty: 2,
    audiences: ["coworker"],
    prompt: "API lähettää objektin HTTP-bodyna. Miten muunnat JS-objektin JSON-merkkijonoksi?",
    choices: [
      { text: "JSON.stringify(obj)", correct: true },
      { text: "obj.toString() riittää aina", correct: false },
      { text: "String(obj) säilyttää avaimet", correct: false },
      { text: "JSON.parse muuntaa objektista stringiin", correct: false },
    ],
    correctFeedback: "JSON.stringify serialisoi objektin — MDN JSON.",
    wrongFeedback: "parse on päinvastainen suunta — string → objekti.",
    sourceRef: "mdn/json_stringify",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify",
    featureId: "js:json-stringify",
    featurePoints: 2,
  },
  {
    id: "b12-js-types-isarray",
    chapter: "js-types",
    difficulty: 2,
    audiences: ["coworker"],
    prompt: "Funktio saa `data` joka voi olla array tai array-like. Luotettava tarkistus?",
    choices: [
      { text: "Array.isArray(data)", correct: true },
      { text: "typeof data === 'array'", correct: false },
      { text: "data instanceof Object", correct: false },
      { text: "data.length > 0 tarkoittaa arraya", correct: false },
    ],
    correctFeedback: "Array.isArray tunnistaa oikeat taulukot — MDN.",
    wrongFeedback: "typeof array on 'object' — array-like ei ole array.",
    sourceRef: "mdn/array_isarray",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray",
    featureId: "js:array-isarray",
    featurePoints: 2,
  },
  {
    id: "b12-js-types-nan-check",
    chapter: "js-types",
    difficulty: 2,
    audiences: ["coworker", "guru"],
    prompt: "Laskenta palauttaa NaN — `value === NaN` on aina false. Miten tarkistat?",
    choices: [
      { text: "Number.isNaN(value) tai Object.is(value, NaN)", correct: true },
      { text: "value == NaN toimii loose equalityllä", correct: false },
      { text: "typeof value === 'nan'", correct: false },
      { text: "isNaN ei ole JavaScriptissä", correct: false },
    ],
    correctFeedback: "NaN ei ole yhtä kuin itsensä kanssa — Number.isNaN on tarkka — MDN.",
    wrongFeedback: "Globaali isNaN coercion — Number.isNaN suositeltu.",
    sourceRef: "mdn/number_isnan",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN",
    featureId: "js:nan-check",
    featurePoints: 3,
  },
  {
    id: "b12-js-types-spread-copy",
    chapter: "js-types",
    difficulty: 2,
    audiences: ["coworker"],
    prompt: "Haluat kopioda taulukon ilman että muokkaat alkuperäistä pushilla. Nopea tapa?",
    choices: [
      { text: "const copy = [...original]", correct: true },
      { text: "const copy = original — riittää erillinen muuttujanimi", correct: false },
      { text: "original.clone() on natiivi", correct: false },
      { text: "Spread toimii vain objekteissa", correct: false },
    ],
    correctFeedback: "Spread luo uuden taulukon — MDN spread syntax.",
    wrongFeedback: "Viittaus kopioi osoitteen — molemmat viittaavat samaan arrayhin.",
    sourceRef: "mdn/spread_syntax",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax",
    featureId: "js:spread-array",
    featurePoints: 2,
  },
  {
    id: "b12-js-types-object-shorthand",
    chapter: "js-types",
    difficulty: 2,
    audiences: ["coworker"],
    prompt: "Rakennat API-payloadin: muuttujat `id` ja `name` ovat valmiina. Lyhyin ES6-syntaksi?",
    choices: [
      { text: "{ id, name } — property shorthand", correct: true },
      { text: "{ id: id, name: name } on ainoa tapa", correct: false },
      { text: "Object.create(id, name)", correct: false },
      { text: "new Map(id, name)", correct: false },
    ],
    correctFeedback: "Shorthand property kun avain = muuttujanimi — MDN object initializer.",
    wrongFeedback: "ES6 shorthand on standardi — ei tarvitse toistaa nimeä.",
    sourceRef: "mdn/object_initializer",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer",
    featureId: "js:object-shorthand",
    featurePoints: 2,
  },
  // === js-async easy-medium ===
  {
    id: "b12-js-async-callback-to-promise",
    chapter: "js-async",
    difficulty: 2,
    audiences: ["coworker"],
    prompt: "Vanha kirjasto käyttää `readFile(path, cb)` callback-tyyliä. Miten käärit sen await-yhteensopivaksi?",
    choices: [
      { text: "util.promisify(readFile) tai new Promise wrapper", correct: true },
      { text: "Callbacks eivät voi muuttua promiseiksi", correct: false },
      { text: "await toimii suoraan callback-funktiossa", correct: false },
      { text: "setTimeout korvaa promisen", correct: false },
    ],
    correctFeedback: "promisify muuntaa error-first callbackin promiseksi — Node util.",
    wrongFeedback: "Promise wrapper tai promisify on standardi migraatiotapa.",
    sourceRef: "nodejs/util/promisify",
    sourceUrl: "https://nodejs.org/api/util.html#utilpromisifyoriginal",
    featureId: "js:promisify",
    featurePoints: 3,
  },
  {
    id: "b12-js-async-promise-then-chain",
    chapter: "js-async",
    difficulty: 2,
    audiences: ["coworker"],
    prompt: "fetch palauttaa promisen — haluat JSON-objektin. Ensimmäinen then-ketju?",
    choices: [
      { text: ".then(res => res.json())", correct: true },
      { text: ".then(JSON.parse) suoraan Response-objektille", correct: false },
      { text: "await ei toimi promisen kanssa", correct: false },
      { text: "res.body on aina valmis objekti", correct: false },
    ],
    correctFeedback: "Response.json() palauttaa promisen parsitusta varten — MDN fetch.",
    wrongFeedback: "Response ei ole JSON-string — tarvitsee .json() metodin.",
    sourceRef: "mdn/response_json",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Response/json",
    featureId: "js:fetch-then-json",
    featurePoints: 2,
  },
  {
    id: "b12-js-async-async-returns-promise",
    chapter: "js-async",
    difficulty: 2,
    audiences: ["coworker", "guru"],
    prompt: "Mikä `async function foo() { return 42; }` palauttaa kutsujalle?",
    choices: [
      { text: "Promise joka resolvaantuu arvoon 42", correct: true },
      { text: "Synkroninen number 42", correct: false },
      { text: "undefined — return ei toimi asyncissa", correct: false },
      { text: "Generator-objekti", correct: false },
    ],
    correctFeedback: "async funktio wrapaa return-arvon promiseen — MDN async.",
    wrongFeedback: "async funktio palauttaa aina promisen.",
    sourceRef: "mdn/async_function",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function",
    featureId: "js:async-return-promise",
    featurePoints: 2,
  },
  {
    id: "b12-js-async-promise-finally",
    chapter: "js-async",
    difficulty: 3,
    audiences: ["coworker"],
    prompt: "Latausnäkymä pitää piilottaa sekä onnistumisessa että virheessä. Mikä Promise-metodi?",
    choices: [
      { text: "finally(() => hideSpinner())", correct: true },
      { text: "then() ilman catchia riittää virheille", correct: false },
      { text: "catch() ajetaan onnistumisessa", correct: false },
      { text: "finally muuttaa promisen tuloksen aina", correct: false },
    ],
    correctFeedback: "finally ajetaan settled-tilassa — MDN Promise.finally.",
    wrongFeedback: "finally ei korvaa catchia — se on cleanup.",
    sourceRef: "mdn/promise_finally",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally",
    featureId: "js:promise-finally",
    featurePoints: 3,
  },
  {
    id: "b12-js-async-queue-microtask",
    chapter: "js-async",
    difficulty: 3,
    audiences: ["guru", "coworker"],
    prompt: "Haluat ajaa funktion heti synkronisen koodin jälkeen mutta ennen setTimeout(0). API?",
    choices: [
      { text: "queueMicrotask(fn)", correct: true },
      { text: "setImmediate(fn) selaimessa aina", correct: false },
      { text: "requestAnimationFrame on microtask", correct: false },
      { text: "process.nextTick on standardi selaimessa", correct: false },
    ],
    correctFeedback: "queueMicrotask lisää microtask-jonoon — MDN.",
    wrongFeedback: "setTimeout on macrotask — myöhäisempi kuin microtask.",
    sourceRef: "mdn/queueMicrotask",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Window/queueMicrotask",
    featureId: "js:queue-microtask",
    featurePoints: 3,
  },
  {
    id: "b12-js-async-promise-with-resolvers",
    chapter: "js-async",
    difficulty: 4,
    audiences: ["guru", "coworker"],
    prompt: "Rakennat deferred-patternin: ulkopuolinen koodi resolveaa promisen myöhemmin. ES2024+ tapa?",
    choices: [
      { text: "Promise.withResolvers() — { promise, resolve, reject }", correct: true },
      { text: "new Promise ilman executor-funktiota", correct: false },
      { text: "Promise.defer() on natiivi", correct: false },
      { text: "async function ei voi odottaa ulkoista signaalia", correct: false },
    ],
    correctFeedback: "withResolvers palauttaa promise + resolve/reject — MDN.",
    wrongFeedback: "Manuaalinen deferred toimii, mutta withResolvers on standardi.",
    sourceRef: "mdn/promise_withresolvers",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers",
    featureId: "js:promise-with-resolvers",
    featurePoints: 4,
  },
  {
    id: "b12-js-async-generator-async",
    chapter: "js-async",
    difficulty: 4,
    audiences: ["guru"],
    prompt: "Streamaat paginoitua API:a — haluat `for await` silmukan. Funktion tyyppi?",
    choices: [
      { text: "async function* — async generator", correct: true },
      { text: "function* riittää awaitille sisällä", correct: false },
      { text: "async function palauttaa arrayn automaattisesti", correct: false },
      { text: "Generators eivät tue promiseja", correct: false },
    ],
    correctFeedback: "async generator tuottaa async iterable — MDN async function*.",
    wrongFeedback: "Tavallinen generator ei awaitaa — tarvitsee async function*.",
    sourceRef: "mdn/async_generator",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function*",
    featureId: "js:async-generator",
    featurePoints: 4,
  },
  {
    id: "b12-js-async-microtask-starvation",
    chapter: "js-async",
    difficulty: 5,
    audiences: ["guru", "security"],
    prompt: "while(true) { queueMicrotask(() => {}) } — UI jäätyy vaikka ei ole synkronista silmukkaa. Miksi?",
    choices: [
      { text: "Microtask-jono tyhjennetään ennen renderiä — infinite microtasks estävät macrotaskit", correct: true },
      { text: "queueMicrotask on synkroninen", correct: false },
      { text: "Selain ei käytä microtask-jonoa", correct: false },
      { text: "setTimeout(0) ajetaan aina ensin", correct: false },
    ],
    correctFeedback: "Event loop tyhjentää microtaskit — starvation estää paintin — MDN event loop.",
    wrongFeedback: "Microtask-loop voi estää käyttöliittymän päivityksen.",
    sourceRef: "mdn/event_loop",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop",
    featureId: "js:microtask-starvation",
    featurePoints: 5,
    studyNotes: "Microtask-jono suoritetaan loppuun ennen seuraavaa macrotaskia. Rekursiivinen queueMicrotask voi jumittaa selaimen ilman synkronista while-silmukkaa.",
  },
  {
    id: "b12-js-async-settled-vs-resolve",
    chapter: "js-async",
    difficulty: 3,
    audiences: ["coworker"],
    prompt: "finally-blokissa tarvitset tietää onnistuiko promise. Miten saat tuloksen ilman then-ketjua?",
    choices: [
      { text: "Tallenna flag then/catchissa — finally ei saa tulosta parametrina", correct: true },
      { text: "finally(result) palauttaa resolve-arvon", correct: false },
      { text: "await finally palauttaa arvon", correct: false },
      { text: "Promise.status on natiivi property", correct: false },
    ],
    correctFeedback: "finally ei saa fulfillment/rejection arvoa — MDN Promise.finally.",
    wrongFeedback: "finally on cleanup — tulos pitää siepata then/catchissa.",
    sourceRef: "mdn/promise_finally",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally",
    featureId: "js:promise-finally-semantics",
    featurePoints: 3,
  },
  {
    id: "b12-js-async-retry-backoff",
    chapter: "js-async",
    difficulty: 4,
    audiences: ["coworker", "project-lead"],
    prompt: "API palauttaa 503 — haluat uudelleenyrityksen eksponentiaalisella viiveellä. Rakenne?",
    choices: [
      { text: "Loop/silmukka: try await, catch, odota delay * 2^n, max retries", correct: true },
      { text: "while(true) ilman max retries — loputon retry", correct: false },
      { text: "Promise.all retry kaikille kerralla", correct: false },
      { text: "fetch cachettaa 503 automaattisesti", correct: false },
    ],
    correctFeedback: "Exponential backoff + max retries on standardi resilienssi — AWS/Google best practices.",
    wrongFeedback: "Loputon retry voi pahentaa kuormaa — rajoita ja kasvata viivettä.",
    sourceRef: "mdn/fetch",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/API/fetch",
    featureId: "js:retry-backoff",
    featurePoints: 4,
  },
  // === js-modules ===
  {
    id: "b12-js-modules-type-module",
    chapter: "js-modules",
    difficulty: 2,
    audiences: ["coworker"],
    prompt: "Node-projekti käyttää `import` ilman Babelia. package.json-asetus?",
    choices: [
      { text: '"type": "module"', correct: true },
      { text: '"esm": true"', correct: false },
      { text: '"module": "es6" automaattisesti', correct: false },
      { text: "import toimii ilman konfiguraatiota CommonJS-projektissa", correct: false },
    ],
    correctFeedback: "type module kertoo Nodelle ESM:stä — Node.js packages docs.",
    wrongFeedback: "CommonJS oletus — ESM vaatii type module tai .mjs.",
    sourceRef: "nodejs/packages/type",
    sourceUrl: "https://nodejs.org/api/packages.html#type",
    featureId: "js:package-type-module",
    featurePoints: 2,
  },
  {
    id: "b12-js-modules-reexport",
    chapter: "js-modules",
    difficulty: 3,
    audiences: ["coworker", "guru"],
    prompt: "index.js barrel tiedosto uudelleenexporttaa `./utils.js` ja `./api.js`. Syntaksi?",
    choices: [
      { text: "export * from './utils.js' ja export { x } from './api.js'", correct: true },
      { text: "import then window.exports", correct: false },
      { text: "re-export vaatii CommonJS", correct: false },
      { text: "export from on TypeScript-only", correct: false },
    ],
    correctFeedback: "export ... from on ESM re-export — MDN export.",
    wrongFeedback: "Barrel-tiedostot käyttävät export from -syntaksia.",
    sourceRef: "mdn/export",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export",
    featureId: "js:reexport",
    featurePoints: 3,
  },
  {
    id: "b12-js-modules-side-effects",
    chapter: "js-modules",
    difficulty: 3,
    audiences: ["guru", "coworker"],
    prompt: "Bundleri poistaa `import './polyfill.js'` tree-shakingissa ja polyfill puuttuu prodissa. Syy?",
    choices: [
      { text: "Side-effect import pitää merkitä package.json sideEffects: false huomio — tai säilyttää import", correct: true },
      { text: "Polyfill import on aina turvallinen", correct: false },
      { text: "Vite ei tree-shake", correct: false },
      { text: "Side-effect importit eivät voi poistua", correct: false },
    ],
    correctFeedback: "Bundler voi dropata käyttämättömät moduulit — sideEffects-kenttä — webpack docs.",
    wrongFeedback: "Pelkkä side-effect import voi poistua jos bundleri luulee moduulin tarpeettomaksi.",
    sourceRef: "webpack/sideEffects",
    sourceUrl: "https://webpack.js.org/guides/tree-shaking/",
    featureId: "js:side-effects",
    featurePoints: 4,
  },
  {
    id: "b12-js-modules-import-attributes",
    chapter: "js-modules",
    difficulty: 4,
    audiences: ["guru"],
    prompt: "Haluat importata JSON-moduulin ESM:llä selaimessa. Moderni syntaksi?",
    choices: [
      { text: "import data from './config.json' with { type: 'json' }", correct: true },
      { text: "require('./config.json') selaimessa", correct: false },
      { text: "import json ei tarvitse attribuutteja", correct: false },
      { text: "#include config.json", correct: false },
    ],
    correctFeedback: "Import attributes määrittävät moduulityypin — MDN import attributes.",
    wrongFeedback: "JSON import vaatii type assertion/attribute riippuen ympäristöstä.",
    sourceRef: "mdn/import_attributes",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import/with",
    featureId: "js:import-attributes",
    featurePoints: 4,
  },
  {
    id: "b12-js-modules-resolve-alias",
    chapter: "js-modules",
    difficulty: 3,
    audiences: ["coworker"],
    prompt: "Monorepossa `@app/utils` pitää resolvautua `packages/utils/src`. Missä konfiguroit bundlerissa?",
    choices: [
      { text: "resolve.alias (Vite/webpack) tai tsconfig paths", correct: true },
      { text: "package.json name riittää aina", correct: false },
      { text: "import ei tue aliaksia", correct: false },
      { text: "Symlink riittää ilman konfiguraatiota aina", correct: false },
    ],
    correctFeedback: "Path alias bundlerin resolve + TypeScript paths — Vite resolve.alias.",
    wrongFeedback: "Import-polku ei automaattisesti tunne @-aliaksia.",
    sourceRef: "vite/resolve",
    sourceUrl: "https://vitejs.dev/config/shared-options.html#resolve-alias",
    featureId: "js:resolve-alias",
    featurePoints: 3,
  },
  // === js-runtime ===
  {
    id: "b12-js-runtime-raf-vs-timeout",
    chapter: "js-runtime",
    difficulty: 2,
    audiences: ["coworker"],
    prompt: "Animaatio päivittää DOM-elementin sijaintia 60 fps. Parempi kuin setInterval(16)?",
    choices: [
      { text: "requestAnimationFrame — synkronoituu näytön päivitykseen", correct: true },
      { text: "setTimeout(0) riittää animaatioon", correct: false },
      { text: "while-loop DOM-päivityksessä", correct: false },
      { text: "requestAnimationFrame on Node-only", correct: false },
    ],
    correctFeedback: "rAF optimoi animaatiot — MDN requestAnimationFrame.",
    wrongFeedback: "setInterval ei synkronoidu refresh rateen.",
    sourceRef: "mdn/requestAnimationFrame",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame",
    featureId: "js:request-animation-frame",
    featurePoints: 2,
  },
  {
    id: "b12-js-runtime-object-freeze",
    chapter: "js-runtime",
    difficulty: 3,
    audiences: ["coworker", "guru"],
    prompt: "Redux-tyylinen store haluaa estää suoran state-mutaation. Shallow-immutability?",
    choices: [
      { text: "Object.freeze(state) — shallow; deep freeze erikseen jos tarvitaan", correct: true },
      { text: "const state riittää deep immutabilityyn", correct: false },
      { text: "freeze estää myös nested objektien muutokset automaattisesti", correct: false },
      { text: "JSON.parse(JSON.stringify) on ainoa tapa", correct: false },
    ],
    correctFeedback: "Object.freeze on shallow — MDN Object.freeze.",
    wrongFeedback: "const + freeze eivät deep-freezaa ilman rekursiota.",
    sourceRef: "mdn/object_freeze",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze",
    featureId: "js:object-freeze",
    featurePoints: 3,
  },
  {
    id: "b12-js-runtime-proxy-trap",
    chapter: "js-runtime",
    difficulty: 4,
    audiences: ["guru"],
    prompt: "Haluat logata kaikki objektin property-luvut debugissa. Metaprogramming-ratkaisu?",
    choices: [
      { text: "new Proxy(target, { get(trap) { log; return Reflect.get(...) } })", correct: true },
      { text: "Object.observe on standardi ES2024", correct: false },
      { text: "getter jokaiselle avaimelle manuaalisesti skaalautuu", correct: false },
      { text: "Proxy estää kaiken property accessin", correct: false },
    ],
    correctFeedback: "Proxy handler get-trap — MDN Proxy.",
    wrongFeedback: "Manuaaliset getterit eivät skaalaudu — Proxy on tarkoitettu tähän.",
    sourceRef: "mdn/proxy",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy",
    featureId: "js:proxy-get-trap",
    featurePoints: 4,
  },
  {
    id: "b12-js-runtime-weakref-cache",
    chapter: "js-runtime",
    difficulty: 5,
    audiences: ["guru"],
    prompt: "Cache viittaa isoihin objekteihin ja estää GC:n vaikka UI on vapauttanut ne. Etenevä ratkaisu?",
    choices: [
      { text: "WeakRef + FinalizationRegistry — ei pidä objektia elossa", correct: true },
      { text: "Map aina — GC hoitaa automaattisesti", correct: false },
      { text: "global.gc() tuotannossa", correct: false },
      { text: "WeakRef estää objektin keräämisen ikuisesti", correct: false },
    ],
    correctFeedback: "WeakRef ei estä GC:tä — MDN WeakRef.",
    wrongFeedback: "Vahva viittaus Mapissa estää GC:n — WeakRef on heikko.",
    sourceRef: "mdn/weakref",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakRef",
    featureId: "js:weakref",
    featurePoints: 5,
    studyNotes: "WeakRef sallii objektin keräämisen jos ei muita viittauksia. FinalizationRegistry ilmoittaa kun objekti on GC:tty.",
  },
  {
    id: "b12-js-runtime-event-delegation",
    chapter: "js-runtime",
    difficulty: 2,
    audiences: ["coworker"],
    prompt: "Lista renderöi 500 riviä — jokaiselle riville oma click-listener. Suorituskykyongelma. Korjaus?",
    choices: [
      { text: "Event delegation — yksi listener parentille, event.target tarkistus", correct: true },
      { text: "500 listeneriä on aina OK", correct: false },
      { text: "onclick inline HTML aina nopein", correct: false },
      { text: "removeEventListener ei toimi", correct: false },
    ],
    correctFeedback: "Delegation vähentää listenereitä — MDN event delegation.",
    wrongFeedback: "Satoja listenereitä kuluttaa muistia — delegoi parentille.",
    sourceRef: "mdn/event_delegation",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling",
    featureId: "js:event-delegation",
    featurePoints: 2,
  },
  // === js-typescript easy ===
  {
    id: "b12-ts-basic-primitive-types",
    chapter: "js-typescript",
    difficulty: 1,
    audiences: ["coworker", "secretary"],
    prompt: "TypeScriptissä haluat merkitä että `age` on kokonaisluku. Tyyppi?",
    choices: [
      { text: "let age: number", correct: true },
      { text: "let age: int", correct: false },
      { text: "let age: integer", correct: false },
      { text: "let age: Number wrapper aina", correct: false },
    ],
    correctFeedback: "TS primitiivit: number, string, boolean — TS handbook basic types.",
    wrongFeedback: "TS:ssä on number — ei erillistä int-tyyppiä oletuksena.",
    sourceRef: "typescript/basic-types",
    sourceUrl: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#the-primitives-string-number-and-boolean",
    featureId: "ts:primitive-types",
    featurePoints: 2,
  },
  {
    id: "b12-ts-basic-interface-shape",
    chapter: "js-typescript",
    difficulty: 1,
    audiences: ["coworker"],
    prompt: "API-vastauksella on kentät `id` ja `title`. Miten kuvailet muodon TS:ssä?",
    choices: [
      { text: "interface User { id: string; title: string }", correct: true },
      { text: "type User = class { id, title }", correct: false },
      { text: "User implements JSON", correct: false },
      { text: "interface vaatii aina extends Object", correct: false },
    ],
    correctFeedback: "interface kuvaa objektin muodon — TS handbook interfaces.",
    wrongFeedback: "interface on rakenne — ei luokkaa.",
    sourceRef: "typescript/interfaces",
    sourceUrl: "https://www.typescriptlang.org/docs/handbook/2/objects.html",
    featureId: "ts:interface",
    featurePoints: 2,
  },
  {
    id: "b12-ts-basic-union-null",
    chapter: "js-typescript",
    difficulty: 2,
    audiences: ["coworker"],
    prompt: "Funktio voi palauttaa käyttäjän tai null jos ei löydy. Paluutyyppi?",
    choices: [
      { text: "User | null", correct: true },
      { text: "User? on virallinen TS-syntaksi nullille", correct: false },
      { text: "any riittää", correct: false },
      { text: "User null ei ole union", correct: false },
    ],
    correctFeedback: "Union type | yhdistää vaihtoehdot — TS handbook unions.",
    wrongFeedback: "Union kuvaa useita mahdollisia tyyppejä.",
    sourceRef: "typescript/unions",
    sourceUrl: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types",
    featureId: "ts:union-null",
    featurePoints: 2,
  },
  {
    id: "b12-ts-basic-type-annotation-fn",
    chapter: "js-typescript",
    difficulty: 2,
    audiences: ["coworker"],
    prompt: "Funktio `add(a, b)` palauttaa summan. Parametrien ja paluuarvon tyypitys?",
    choices: [
      { text: "function add(a: number, b: number): number", correct: true },
      { text: "function add(number a, number b)", correct: false },
      { text: "add: Function riittää", correct: false },
      { text: "Paluutyyppi ei ole TS:ssä sallittu", correct: false },
    ],
    correctFeedback: "Parametrit ja return type annotoidaan — TS functions.",
    wrongFeedback: "TS käyttää sulkumerkintää — ei C-tyylistä syntaksia.",
    sourceRef: "typescript/functions",
    sourceUrl: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#functions",
    featureId: "ts:function-annotations",
    featurePoints: 2,
  },
  {
    id: "b12-ts-basic-enum-string",
    chapter: "js-typescript",
    difficulty: 2,
    audiences: ["coworker"],
    prompt: "Tila voi olla 'draft' | 'published' | 'archived'. Tyypitetty vakiomuoto ilman runtime enumia?",
    choices: [
      { text: "type Status = 'draft' | 'published' | 'archived'", correct: true },
      { text: "enum Status { draft, published } aina pakollinen", correct: false },
      { text: "const Status = string", correct: false },
      { text: "Union stringeistä ei ole sallittu", correct: false },
    ],
    correctFeedback: "String literal union on kevyt vaihtoehto enumille — TS handbook.",
    wrongFeedback: "String union ei tuota runtime-koodia — usein suositeltu.",
    sourceRef: "typescript/literal-types",
    sourceUrl: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types",
    featureId: "ts:string-literal-union",
    featurePoints: 2,
  },
];

// Append remaining questions programmatically to reach 100
const MORE = buildRemainingQuestions();
QUESTIONS.push(...MORE);

function buildRemainingQuestions() {
  /** @type {Array<Record<string, unknown>>} */
  const q = [];

  const add = (item) => q.push({ domain: "javascript", audiences: ["coworker", "guru"], ...item });

  // js-types medium-hard (10 more)
  const typesMed = [
    ["b12-js-types-destructure-default", 2, "js-types", "Destructuroit { name, role = 'user' } — role puuttuu. Arvo?", "Default arvo kun property puuttuu — MDN destructuring.", "mdn/destructuring", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment", "js:destructure-default", 2, [
      ["role on 'user' — default destructuringissä", true], ["undefined", false], ["Tyhjä string", false], ["Virhe heitetään", false]]],
    ["b12-js-types-rest-params", 2, "js-types", "Funktio `sum(...nums)` — mitä ...nums tarkoittaa?", "Rest ... kerää argumentit — MDN rest parameters.", "mdn/rest_parameters", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters", "js:rest-parameters", 2, [
      ["Rest parameter kerää loput argumentit taulukoksi", true], ["Spread kopioi taulukon", false], ["Vain arrow-funktioissa", false], ["nums on aina tyhjä", false]]],
    ["b12-js-types-object-keys-values", 3, "js-types", "Haluat iteroida objektin arvot ilman for...in prototyypin perintää. Metodi?", "Object.values/entries — MDN Object.", "mdn/object_values", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values", "js:object-values", 3, [
      ["Object.values(obj) tai Object.entries(obj)", true], ["for...in ilman hasOwnProperty aina turvallinen", false], ["obj.map()", false], ["Object.keys palauttaa arvot", false]]],
    ["b12-js-types-instanceof-array", 3, "js-types", "Miksi `[] instanceof Object` on true mutta Array.isArray suositeltu?", "Array.isArray luotettavampi — MDN.", "mdn/array_isarray", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray", "js:instanceof-array", 3, [
      ["instanceof ei erota arraya cross-realm / iframe kontekstissa luotavasta", true], ["instanceof on aina väärä", false], ["Array ei ole Object", false], ["isArray on deprecated", false]]],
    ["b12-js-types-truthy-falsy", 2, "js-types", "Lomakevalidointi: `if (!value)` hylkää syötteen '0'. Parempi tarkistus tyhjälle kentälle?", "0 on falsy mutta validi — MDN truthy/falsy.", "mdn/truthy", "https://developer.mozilla.org/en-US/docs/Glossary/Truthy", "js:truthy-falsy", 2, [
      ["value === '' || value == null — älä käytä pelkkää falsy", true], ["!value on aina oikein", false], ["Boolean(value) erottaa 0:n", false], ["value === false riittää", false]]],
    ["b12-js-types-parseint-radix", 3, "js-types", "parseInt('08') vanhassa JS:ssä — miksi radix 10 on pakollinen?", "parseInt radix — MDN.", "mdn/parseint", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt", "js:parseint-radix", 3, [
      ["Ilman radixia etunolla voi tulkita oktaaliksi historiallisesti", true], ["parseInt ei ota radixia", false], ["Radix 16 aina", false], ["parseInt on deprecated", false]]],
    ["b12-js-types-symbol-tostring", 4, "js-types", "Object.keys() ei näytä Symbol-avaimia. Miten iteroidaan ne?", "Symbol keys erillisellä API:lla — MDN.", "mdn/getownpropertysymbols", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols", "js:symbol-keys", 4, [
      ["Object.getOwnPropertySymbols(obj)", true], ["Object.keys sisältää symbolit", false], ["JSON.stringify säilyttää symbolit", false], ["Symbolit ovat enumerable oletuksena", false]]],
    ["b12-js-types-structured-equality", 3, "js-types", "Kaksi eri objektia {a:1} ja {a:1} — {} === {} on false. Miksi?", "Reference equality — MDN equality.", "mdn/equality", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness", "js:reference-equality", 3, [
      ["Objektit vertaillaan viittauksella — eri instanssit", true], ["Sisältövertailu automaattisesti", false], ["Object.is vertaa deep", false], ["JSON.stringify vertailu on standardi", false]]],
    ["b12-js-types-temporal-api", 4, "js-types", "Date on mutatoitava ja timezone-bugeja. Moderni ES-proposal korvaajaksi?", "Temporal korvaa Date-painetta — TC39.", "tc39/temporal", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal", "js:temporal", 4, [
      ["Temporal API (stage 3) — immutable datetime", true], ["moment.js on standardi", false], ["Date.setUTC riittää", false], ["Timestamp number aina", false]]],
    ["b12-js-types-intl-numberformat", 3, "js-types", "Näytät hinnan suomalaiselle käyttäjälle: 1234.5 → '1 234,50 €'. API?", "Intl.NumberFormat lokalisointiin — MDN.", "mdn/intl_numberformat", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat", "js:intl-numberformat", 3, [
      ["new Intl.NumberFormat('fi-FI', { style: 'currency', currency: 'EUR' })", true], ["toFixed + manuaalinen pilkku", false], ["Number.toLocaleString ei tue valuuttaa", false], ["printf JS:ssä natiivi", false]]],
  ];
  for (const [id, diff, ch, prompt, correctFb, srcRef, srcUrl, feat, pts, choices] of typesMed) {
    add({ id, chapter: ch, difficulty: diff, prompt, choices: choices.map(([text, correct]) => ({ text, correct })), correctFeedback: correctFb, wrongFeedback: "Tarkista MDN/TS docs — väärä vastaus johtaa yleiseen virheeseen.", sourceRef: srcRef, sourceUrl: srcUrl, featureId: feat, featurePoints: pts });
  }

  // js-async (10 more)
  const asyncQ = [
    ["b12-js-async-await-top-level", 3, "js-async", "config.mjs lataa env-tiedoston ennen muita importteja. Ratkaisu?", "top-level await ES-moduulissa", "TLA moduuleissa — MDN.", "mdn/tla", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#top_level_await", "js:tla", 3],
    ["b12-js-async-promise-all-error", 3, "js-async", "Promise.all — yksi reject. Mitä tapahtuu?", "Koko all hylätään ensimmäisestä virheestä", "all fail-fast — MDN.", "mdn/promise_all", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all", "js:promise-all-fail", 3],
    ["b12-js-async-sleep-pattern", 2, "js-async", "Testissä haluat odottaa 100ms ilman busy-waitiä. Pattern?", "await new Promise(r => setTimeout(r, 100))", "Promise + setTimeout delay — MDN.", "mdn/settimeout", "https://developer.mozilla.org/en-US/docs/Web/API/setTimeout", "js:sleep-pattern", 2],
    ["b12-js-async-iterator-for-await", 4, "js-async", "ReadableStream data async iterable. Silmukka?", "for await (const chunk of stream)", "for await of async iterable — MDN.", "mdn/for-await-of", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of", "js:for-await-of", 4],
    ["b12-js-async-signal-combine", 4, "js-async", "Kaksi AbortControlleria — fetch peruuttuu jos jompikumpi aborttaa. API?", "AbortSignal.any([signal1, signal2])", "AbortSignal.any yhdistää — MDN.", "mdn/abortsignal_any", "https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/any_static", "js:abortsignal-any", 4],
    ["b12-js-async-eventemitter-memory", 4, "js-async", "Node EventEmitter 'data' listenerit kasaantuvat — MaxListenersExceededWarning. Korjaus?", "Poista listener removeListener/off tai käytä once", "Listener leak — Node events docs.", "nodejs/events", "https://nodejs.org/api/events.html", "js:eventemitter-leak", 4],
    ["b12-js-async-fetch-keepalive", 3, "js-async", "Analytics beacon sivun unloadissa — fetch katkeaa. Vaihtoehto?", "fetch(url, { keepalive: true }) tai navigator.sendBeacon", "keepalive/beacon unloadissa — MDN.", "mdn/fetch_keepalive", "https://developer.mozilla.org/en-US/docs/Web/API/fetch#keepalive", "js:fetch-keepalive", 3],
    ["b12-js-async-promise-race-cancel", 3, "js-async", "Käyttäjä peruuttaa — haluat että hitain fetch häviää kilpajuoksussa. Metodi?", "Promise.race([fetch(...), abortPromise])", "race ensimmäinen settled — MDN.", "mdn/promise_race", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race", "js:promise-race", 3],
    ["b12-js-async-async-stack", 5, "js-async", "async stack trace katkeaa await-kohdassa debugissa. Node/DevTools apu?", "async_hooks / source map / await boundary säilyttää linkin Error.stack:ssa moderneissa engingeissä", "async stack — V8/Node docs.", "v8/async-stack", "https://developer.chrome.com/docs/devtools/javascript/reference/#async-stack", "js:async-stack", 5],
    ["b12-js-async-stream-backpressure", 5, "js-async", "Node transform stream tulvii muistia — kirjoittaja nopeampi kuin lukija. Mekanismi?", "backpressure — stream.write() false + 'drain' event", "Streams backpressure — Node.js streams.", "nodejs/stream_backpressure", "https://nodejs.org/api/stream.html#backpressure", "js:stream-backpressure", 5],
  ];
  const asyncAnswers = [
    ["top-level await ES-moduulissa", "import() synkroninen", "require await", "TLA vain TypeScriptissä"],
    ["Koko all hylätään ensimmäisestä virheestä", "Muut jatkuvat", "allSettled automaattisesti", "Virhe ignoroitu"],
    ["await new Promise(r => setTimeout(r, 100))", "while(Date.now())", "Thread.sleep", "busy loop"],
    ["for await (const chunk of stream)", "for (chunk of stream) synkroninen", "stream.read() kerran", "callback only"],
    ["AbortSignal.any([signal1, signal2])", "signal1 + signal2 merge", "AbortController.combine", "ei tuettu"],
    ["Poista listener removeListener/off tai käytä once", "Lisää lisää listenereitä", "ignore warning", "process.exit"],
    ["fetch(url, { keepalive: true }) tai navigator.sendBeacon", "sync XHR", "localStorage", "WebSocket aina"],
    ["Promise.race([fetch(...), abortPromise])", "Promise.all", "setInterval cancel", "fetch abort automaattinen"],
    ["async_hooks / source map / await boundary säilyttää linkin Error.stack:ssa moderneissa engingeissä", "Stack ei koskaan toimi asyncissa", "Poista async", "console.trace riittää"],
    ["backpressure — stream.write() false + 'drain' event", "Lisää buffer RAM", "Poista pipe", "sync write"],
  ];
  asyncQ.forEach(([id, diff, ch, prompt, correct, srcRef, srcUrl, feat, pts], i) => {
    const ans = asyncAnswers[i];
    add({ id, chapter: ch, difficulty: diff, prompt, choices: ans.map((text, j) => ({ text, correct: j === 0 })), correctFeedback: `${correct} — katso lähde.`, wrongFeedback: "Async-malli vaatii oikean Promise/stream API:n.", sourceRef: srcRef, sourceUrl: srcUrl, featureId: feat, featurePoints: pts });
  });

  // js-modules (15 more)
  const modQ = [
    ["b12-js-modules-default-export", 2, "export default function App() — import?", "import App from './App.js'", "import { App } default", "require default", "App from ilman polkua"],
    ["b12-js-modules-namespace-import", 3, "import * as utils from './utils.js' — utils on?", "Namespace-objekti kaikilla exporteilla", "Array exporteista", "Funktio", "undefined"],
    ["b12-js-modules-dynamic-conditional", 3, "Lataa moduuli vain adminille. Pattern?", "if (isAdmin) { const m = await import('./admin.js') }", "import('./admin') top level aina", "require dynamic", "script tag"],
    ["b12-js-modules-cjs-esm-interop", 4, "Node ESM importtaa CommonJS-moduulin — default export?", "default voi olla module.exports wrapper — tarkista Node interop", "Aina named exportit", "Ei toimi", "require only"],
    ["b12-js-modules-package-exports", 4, "package.json exports kenttä — miksi?", "Määrittää julkiset import-polut ja estää syväimportit", "Vain npm metadata", "Korvaa main", "TypeScript only"],
    ["b12-js-modules-import-meta-resolve", 4, "Node 20+ resolvaa specifierin suhteessa moduuliin?", "import.meta.resolve(specifier)", "path.resolve", "__dirname", "require.resolve vain CJS"],
    ["b12-js-modules-treeshake-pure", 4, "Bundleri säilyttää kuolleen koodin side-effect funktiossa. Annotaatio?", "/* @__PURE__ */ tai package sideEffects", "export default", "void 0", "use strict"],
    ["b12-js-modules-specifier-must-relative", 2, "import from 'lodash' vs './lodash.js' — ero?", "Paketin nimi vs suhteellinen polku tiedostoon", "Sama asia", "Absoluuttinen aina", "Ilman ./ ei toimi koskaan"],
    ["b12-js-modules-mjs-cjs-ext", 2, "Node ESM-tiedosto ilman type module?", "Käytä .mjs-päätettä", ".es6 extension", ".ts suoraan", "Ei eroa"],
    ["b12-js-modules-import-order", 3, "ESM importit hoistataan — sivuvaikutus järjestyksessä?", "Staattiset importit ajetaan ennen moduulin koodia dependency-järjestyksessä", "Järjestys ei merkitse", "import on runtime", "require ensin"],
    ["b12-js-modules-wasm-import", 4, "WebAssembly moduuli ESM:ssä?", "await WebAssembly.instantiateStreaming(fetch('mod.wasm'))", "import wasm native", "eval wasm", "Worker only"],
    ["b12-js-modules-dual-package", 5, "Kirjasto tarjoaa sekä CJS että ESM — hazard?", "Dual package hazard — eri instanssit singletonille", "Aina sama instanssi", "ESM only riittää", "CJS deprecated"],
    ["b12-js-modules-import-defer", 5, "ES proposal: import ajetaan vasta kun binding käytetään?", "import defer — delayed evaluation", "import lazy keyword", "dynamic import sync", "ei ole mahdollista"],
    ["b12-js-modules-assert-type-css", 3, "Vite/CSS import komponentissa?", "import './styles.css' — bundleri käsittelee", "fetch css runtime", "link tag only", "CSS ei import"],
    ["b12-js-modules-create-require", 4, "ESM-tiedostossa tarvitset require kertaluontoisesti?", "createRequire(import.meta.url)", "global require", "import require", "ei tuettu"],
  ];
  const modMeta = [
    [2, "js-modules", "mdn/export", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export", "js:default-export", 2],
    [3, "js-modules", "mdn/import", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import", "js:namespace-import", 3],
    [3, "js-modules", "mdn/import", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import", "js:conditional-dynamic-import", 3],
    [4, "js-modules", "nodejs/esm", "https://nodejs.org/api/esm.html", "js:cjs-esm-interop", 4],
    [4, "js-modules", "nodejs/packages", "https://nodejs.org/api/packages.html#exports", "js:package-exports", 4],
    [4, "js-modules", "nodejs/esm", "https://nodejs.org/api/esm.html#importmetaresolvespecifier", "js:import-meta-resolve", 4],
    [4, "js-modules", "webpack/tree-shaking", "https://webpack.js.org/guides/tree-shaking/", "js:treeshake-pure", 4],
    [2, "js-modules", "mdn/import", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import", "js:import-specifier", 2],
    [2, "js-modules", "nodejs/esm", "https://nodejs.org/api/esm.html", "js:mjs-extension", 2],
    [3, "js-modules", "mdn/modules", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules", "js:import-order", 3],
    [4, "js-modules", "mdn/wasm", "https://developer.mozilla.org/en-US/docs/WebAssembly", "js:wasm-import", 4],
    [5, "js-modules", "nodejs/packages", "https://nodejs.org/api/packages.html#dual-package-hazard", "js:dual-package", 5],
    [5, "js-modules", "tc39/import-defer", "https://github.com/tc39/proposal-import-defer", "js:import-defer", 5],
    [3, "js-modules", "vite/css", "https://vitejs.dev/guide/features.html#css", "js:css-import", 3],
    [4, "js-modules", "nodejs/module", "https://nodejs.org/api/module.html#modulecreaterequirefilename", "js:create-require", 4],
  ];
  modQ.forEach(([id, diff, prompt, c0, c1, c2, c3], i) => {
    const [d, ch, srcRef, srcUrl, feat, pts] = modMeta[i];
    add({ id, chapter: ch, difficulty: d, prompt, choices: [c0, c1, c2, c3].map((text, j) => ({ text, correct: j === 0 })), correctFeedback: `${c0} — MDN/Node docs.`, wrongFeedback: "Moduulijärjestelmä vaatii oikean import/export-mallin.", sourceRef: srcRef, sourceUrl: srcUrl, featureId: feat, featurePoints: pts });
  });

  // js-runtime (15 more)
  const rtQ = [
    ["b12-js-runtime-set-map-iteration", 2, "Set säilyttää uniikit — lisäät duplikaatin. Mitä tapahtuu?", "Duplikaatti hylätään — size ei kasva", "Set kaatuu", "Viimeinen voittaa", "Muuttuu Mapiksi"],
    ["b12-js-runtime-weakset-gc", 3, "WeakSet vs Set objektiavainten jäljitykseen DOM-nodeille?", "WeakSet ei estä GC:tä — node voi vapautua", "WeakSet pitää elossa", "Sama kuin Set", "WeakSet vain primitive"],
    ["b12-js-runtime-regex-exec", 3, "global regex lastIndex bug loopissa — syy?", "lastIndex muistaa viimeisen osuman — resetoi tai käytä matchAll", "regex on immutable", "exec ei muuta", "bug selaimessa"],
    ["b12-js-runtime-intl-collator", 3, "Järjestät suomenkielisiä nimiä — localeCompare vs Intl.Collator?", "Intl.Collator('fi') tehokkaampi toistuvassa sortissa", "sort() ei tue localea", "binäärijärjestys aina oikein", "Collator on deprecated"],
    ["b12-js-runtime-mutation-observer", 3, "Kolmas osapuoli injektoi DOM-muutoksia — haluat reagoida. API?", "MutationObserver callback DOM-muutoksille", "setInterval DOM check", "Object.watch", "Proxy DOM"],
    ["b12-js-runtime-intersection-observer", 3, "Lazy-load kuvat kun scrollaa näkyviin. API?", "IntersectionObserver + data-src", "scroll event jokaiselle px", "getBoundingClientRect loop", "onload window"],
    ["b12-js-runtime-custom-event", 2, "Komponentit kommunikoivat ilman props-ketjua. DOM-ratkaisu?", "new CustomEvent('name', { detail }) + dispatchEvent", "window.alert", "global var", "eval"],
    ["b12-js-runtime-error-stack-limit", 4, "Recursive funktio RangeError Maximum call stack. Syy?", "Call stack overflow — liian syvä rekursio", "Heap overflow", "Syntax error", "async stack"],
    ["b12-js-runtime-tail-call", 5, "ES6 tail call optimization — status JS-engingeissä?", "Ei laajaa tukea — älä luota TCO:hon rekursioon", "Kaikissa selaimissa", "Vain strict mode", "Korvaa loop"],
    ["b12-js-runtime-arraybuffer-view", 4, "Binary data WebSocketista — tyyppi ennen käsittelyä?", "ArrayBuffer / Uint8Array view", "string aina", "JSON.parse buffer", "Blob.text only"],
    ["b12-js-runtime-performance-now", 3, "Mittaat koodin keston tarkasti — Date.now() vs performance.now()?", "performance.now() korkeampi resoluutio monotonic", "Date.now() tarkempi", "Sama", "process.hrtime selaimessa"],
    ["b12-js-runtime-domparser", 3, "Parse HTML string turvallisesti ilman innerHTML suoraa?", "DOMParser.parseFromString + sanitize policy", "eval HTML", "document.write", "innerHTML aina turvallinen"],
    ["b12-js-runtime-resize-observer", 3, "CSS grid resize — haluat mitata elementin koon muutokset. API?", "ResizeObserver", "window.resize only", "getComputedStyle loop", "MutationObserver size"],
    ["b12-js-runtime-computed-property", 2, "Objekti { [key]: value } — mitä hakasulut tekevät?", "Computed property name — dynaaminen avain", "Array syntax", "Destructuring", "JSON"],
    ["b12-js-runtime-label-break", 3, "Sisäkkäisestä silmukasta ulos kahdesta tasosta. Lähestymistapa?", "Labeled break / refaktoroi funktioksi", "goto on standardi", "return aina toimii", "throw flow control"],
  ];
  const rtMeta = [
    [2, "js-runtime", "mdn/set", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set", "js:set-unique", 2],
    [3, "js-runtime", "mdn/weakset", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet", "js:weakset", 3],
    [3, "js-runtime", "mdn/regexp", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec", "js:regex-lastindex", 3],
    [3, "js-runtime", "mdn/collator", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator", "js:intl-collator", 3],
    [3, "js-runtime", "mdn/mutationobserver", "https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver", "js:mutation-observer", 3],
    [3, "js-runtime", "mdn/intersectionobserver", "https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API", "js:intersection-observer", 3],
    [2, "js-runtime", "mdn/customevent", "https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent", "js:custom-event", 2],
    [4, "js-runtime", "mdn/rangeerror", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError", "js:stack-overflow", 4],
    [5, "js-runtime", "mdn/tail_calls", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Tail_recursion", "js:tail-call", 5],
    [4, "js-runtime", "mdn/arraybuffer", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer", "js:arraybuffer", 4],
    [3, "js-runtime", "mdn/performance_now", "https://developer.mozilla.org/en-US/docs/Web/API/Performance/now", "js:performance-now", 3],
    [3, "js-runtime", "mdn/domparser", "https://developer.mozilla.org/en-US/docs/Web/API/DOMParser", "js:domparser", 3],
    [3, "js-runtime", "mdn/resizeobserver", "https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver", "js:resize-observer", 3],
    [2, "js-runtime", "mdn/computed_properties", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#computed_property_names", "js:computed-property", 2],
    [3, "js-runtime", "mdn/label", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/label", "js:labeled-break", 3],
  ];
  rtQ.forEach(([id, diff, prompt, c0, c1, c2, c3], i) => {
    const [d, ch, srcRef, srcUrl, feat, pts] = rtMeta[i];
    add({ id, chapter: ch, difficulty: d, prompt, choices: [c0, c1, c2, c3].map((text, j) => ({ text, correct: j === 0 })), correctFeedback: `${c0} — katso MDN.`, wrongFeedback: "Runtime/DOM API vaatii oikean standardin.", sourceRef: srcRef, sourceUrl: srcUrl, featureId: feat, featurePoints: pts });
  });

  // js-typescript (15 more) — medium to hard
  const tsQ = [
    ["b12-ts-narrowing-typeof", 2, "function log(x: string | number) — x.toFixed()?", "typeof x === 'number' guard ennen toFixed", "toFixed suoraan", "as number aina", "x is never"],
    ["b12-ts-narrowing-in", 3, "if ('kind' in obj) — mitä tämä tekee?", "Property narrowing — tarkistaa kentän olemassaolon", "Runtime type check kaikille", "Sama kuin instanceof", "Ei vaikuta tyyppiin"],
    ["b12-ts-interface-extends", 2, "BaseUser + adminRole — miten laajennat?", "interface Admin extends BaseUser { adminRole: string }", "interface Admin = BaseUser", "extends vain class", "merge automaattinen"],
    ["b12-ts-type-vs-interface", 3, "Milloin type alias parempi kuin interface?", "Union/intersection/primitive alias — type sopii", "Aina interface", "type ei voi objektia", "interface union only"],
    ["b12-ts-generic-function", 3, "identity<T>(arg: T): T — miksi generic?", "Säilyttää tyypin parametrista paluuarvoon", "any nopeampi", "T on runtime", "vain class"],
    ["b12-ts-generic-constraint", 4, "T extends { id: string } — tarkoitus?", "Rajoittaa genericin minimimuotoon", "Perii luokan", "Estää genericin", "Runtime check"],
    ["b12-ts-utility-partial", 3, "Update DTO sallii osan kentistä. Utility type?", "Partial<User>", "Pick only", "Omit only", "Required"],
    ["b12-ts-utility-pick-omit", 3, "Julkinen API-tyyppi ilman salaisia kenttiä. Kaksi vaihtoehtoa?", "Omit<User, 'password'> tai Pick julkisille", "delete password", "any export", "interface hide"],
    ["b12-ts-readonly-array", 3, "readonly string[] vs string[] — ero?", "readonly estää mutoinnin push yms. compile-time", "Runtime immutable", "Sama", "readonly vain tuple"],
    ["b12-ts-as-const", 3, "const config = { mode: 'dev' } as const — hyöty?", "Literal types + readonly deep", "Nopeampi compile", "Runtime freeze", "any"],
    ["b12-ts-satisfies", 4, "const palette = { red: '#f00' } satisfies Record<string, string> — hyöty?", "Tarkistaa muodon säilyttäen tarkat literal-tyypit", "Sama kuin as", "any cast", "Runtime validate"],
    ["b12-ts-strict-null", 4, "strictNullChecks päällä — mikä muuttuu?", "null/undefined erotellaan — optional chaining tarpeen", "Ei muutosta", "any kaikille", "Poistaa unionit"],
    ["b12-ts-never-exhaustive", 5, "switch union — default: const _x: never = x. Tarkoitus?", "Exhaustiveness check — uusi variantti compile error", "Runtime throw only", "Dead code", "any default"],
    ["b12-ts-conditional-type", 5, "type IsString<T> = T extends string ? true : false — laji?", "Conditional type — type-level logiikka", "Runtime ternary", "Interface only", "Ei TS:ssä"],
    ["b12-ts-mapped-type", 5, "type ReadonlyFields<T> = { readonly [K in keyof T]: T[K] }", "Mapped type — iteroi avaimia", "Loop runtime", "Pick only", "any map"],
  ];
  const tsAnswers = [
    ["typeof x === 'number' guard ennen toFixed", "toFixed suoraan", "as number aina", "x is never"],
    ["Property narrowing — tarkistaa kentän olemassaolon", "Runtime type check kaikille", "Sama kuin instanceof", "Ei vaikuta tyyppiin"],
    ["interface Admin extends BaseUser { adminRole: string }", "interface Admin = BaseUser", "extends vain class", "merge automaattinen"],
    ["Union/intersection/primitive alias — type sopii", "Aina interface", "type ei voi objektia", "interface union only"],
    ["Säilyttää tyypin parametrista paluuarvoon", "any nopeampi", "T on runtime", "vain class"],
    ["Rajoittaa genericin minimimuotoon", "Perii luokan", "Estää genericin", "Runtime check"],
    ["Partial<User>", "Pick only", "Omit only", "Required"],
    ["Omit<User, 'password'> tai Pick julkisille", "delete password", "any export", "interface hide"],
    ["readonly estää mutoinnin push yms. compile-time", "Runtime immutable", "Sama", "readonly vain tuple"],
    ["Literal types + readonly deep", "Nopeampi compile", "Runtime freeze", "any"],
    ["Tarkistaa muodon säilyttäen tarkat literal-tyypit", "Sama kuin as", "any cast", "Runtime validate"],
    ["null/undefined erotellaan — optional chaining tarpeen", "Ei muutosta", "any kaikille", "Poistaa unionit"],
    ["Exhaustiveness check — uusi variantti compile error", "Runtime throw only", "Dead code", "any default"],
    ["Conditional type — type-level logiikka", "Runtime ternary", "Interface only", "Ei TS:ssä"],
    ["Mapped type — iteroi avaimia", "Loop runtime", "Pick only", "any map"],
  ];
  const tsMeta = [
    [2, "ts:typeof-narrowing", 2], [3, "ts:in-narrowing", 3], [2, "ts:interface-extends", 2], [3, "ts:type-vs-interface", 3],
    [3, "ts:generic-function", 3], [4, "ts:generic-constraint", 4], [3, "ts:partial", 3], [3, "ts:pick-omit", 3],
    [3, "ts:readonly-array", 3], [3, "ts:as-const", 3], [4, "ts:satisfies", 4],
    [4, "ts:strict-null", 4], [5, "ts:never-exhaustive", 5],
    [5, "ts:conditional-type", 5], [5, "ts:mapped-type", 5],
  ];
  tsQ.forEach(([id, diff, prompt], i) => {
    const [pts, feat, fp] = tsMeta[i];
    add({
      id, chapter: "js-typescript", difficulty: diff, prompt,
      choices: tsAnswers[i].map((text, j) => ({ text, correct: j === 0 })),
      correctFeedback: `${tsAnswers[i][0]} — TypeScript handbook.`,
      wrongFeedback: "TS-tyypitys vaatii oikean narrowing/utility-työkalun.",
      sourceRef: `typescript/${feat}`,
      sourceUrl: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html",
      featureId: feat,
      featurePoints: fp,
    });
  });

  return q;
}

// Validate and write
const existingIds = loadExistingIds();
const existingPrompts = loadExistingPrompts();
const errors = [];

for (const q of QUESTIONS) {
  q.domain = "javascript";
  if (!q.audiences) q.audiences = ["coworker", "guru"];
  if (existingIds.has(q.id)) errors.push(`duplicate id: ${q.id}`);
  const norm = String(q.prompt).toLowerCase().replace(/\s+/g, " ").trim();
  if (existingPrompts.has(norm)) errors.push(`duplicate prompt: ${q.id}`);
  const correct = q.choices.filter((c) => c.correct);
  if (correct.length !== 1) errors.push(`${q.id}: correct count ${correct.length}`);
}

if (QUESTIONS.length !== 100) {
  errors.push(`Expected 100 questions, got ${QUESTIONS.length}`);
}

const diffDist = {};
for (const q of QUESTIONS) diffDist[q.difficulty] = (diffDist[q.difficulty] || 0) + 1;
console.log("Difficulty distribution:", diffDist);

const chapterDist = {};
for (const q of QUESTIONS) chapterDist[q.chapter] = (chapterDist[q.chapter] || 0) + 1;
console.log("Chapter distribution:", chapterDist);

if (errors.length) {
  console.error("ERRORS:", errors);
  process.exit(1);
}

const outPath = resolve(__dirname, "data/expansion-batch-12.mjs");
const content = `/** 100 JS/TS questions — generated by scripts/generate-js-ts-expansion-100.mjs */
export const EXPANSION = {
  "javascript-web": ${JSON.stringify(QUESTIONS, null, 2).replace(/"([^"]+)":/g, "$1:").replace(/"/g, '"')}
};
`;
// Use proper JS export format
const jsContent = `/** 100 JS/TS questions — generated by scripts/generate-js-ts-expansion-100.mjs */
export const EXPANSION = {
  "javascript-web": ${JSON.stringify(QUESTIONS, null, 4)}
};
`;

writeFileSync(outPath, jsContent);
console.log(`Wrote ${QUESTIONS.length} questions to ${outPath}`);
