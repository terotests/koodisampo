import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import {
  finnishAblative,
  parseDisplayFirstName,
  pickAlternateCoworker,
  buildAskColleagueLine,
  buildCoworkerWrongReaction,
  collectStaffFromSession,
  collectAllCastFromSession,
  formatCastRosterText,
  CAST_KIND_HELP,
  roleMapChar,
} from "../hosts/terminal/staffRoster.mjs";
import { buildQuizReaction } from "../hosts/terminal/encounterQuestions.mjs";
import { createGameSession, dispatch, sessionMap } from "../hosts/terminal/gameHost.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const require = createRequire(import.meta.url);
const { ProcessRuntime } = require(resolve(projectRoot, "generated/es6/koodisampo.cjs"));

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

export function runStaffRosterTests() {
  assert(finnishAblative("Pekka") === "Pekalta", "Pekka ablative");
  assert(finnishAblative("Maija") === "Maijalta", "Maija ablative");
  assert(finnishAblative("Jarmo") === "Jarmolta", "Jarmo ablative");
  assert(finnishAblative("Mikko") === "Mikolta", "Mikko ablative");
  assert(parseDisplayFirstName("Kollega Pekka") === "Pekka", "strip Kollega prefix");

  const mapJson = readFileSync(
    resolve(projectRoot, "content/worlds/corporate-hq-intro.json"),
    "utf8",
  );
  const { root, session } = createGameSession(null);
  try {
    dispatch(session, () => session.loadMapFromText(mapJson));
    const staff = collectStaffFromSession(session);
    assert(staff.some((s) => s.firstName === "Pekka"), "Pekka on henkilöstölistalla");
    assert(staff.some((s) => s.firstName === "Jarmo"), "Jarmo on henkilöstölistalla");

    const pekka = staff.find((s) => s.firstName === "Pekka");
    assert(pekka, "Pekka löytyy");
    const alt = pickAlternateCoworker(pekka, staff.filter((s) => s.kind === "coworker"));
    assert(alt.firstName !== "Pekka", "vaihtoehtoinen kollega ei ole sama");

    const ask = buildAskColleagueLine(pekka, session);
    assert(ask.includes("Oletko kysynyt"), "kysymys alkaa oikein");
    assert(/lt[aä]/.test(ask), "kysymyksessä on -lta/-ltä-pääte");

    const wrong = buildCoworkerWrongReaction(pekka, session);
    assert(wrong.includes("Pekka:"), "väärä vastaus attribuoidaan Pekalle");
    assert(!wrong.includes("päin honkia"), "ei vanhaa honkia-selitystä");
    assert(/lt[aä]/.test(wrong), "väärässä vastauksessa kollegan nimi oikeassa sijassa");

    const reaction = buildQuizReaction(pekka, false, session);
    assert(reaction === wrong, "buildQuizReaction käyttää sosiaalista väärää vastausta");

    const cast = collectAllCastFromSession(session);
    assert(cast.some((c) => c.kind === "pet"), "koira mukana hahmolistassa");
    assert(!cast.some((c) => c.kind === "item"), "esineet eivät ole hahmolistassa");
    assert(CAST_KIND_HELP.length >= 5, "roolityyppien dokumentaatio");
    assert(roleMapChar({ id: "c1", kind: "coworker", char: "c" }) === "t", "työkaveri t");
    assert(roleMapChar({ id: "ceo", kind: "role", char: "C" }) === "T", "toimitusjohtaja T");
    const rosterText = formatCastRosterText(cast);
    assert(rosterText.includes("DEBUG"), "hahmolista merkitty debugiksi");
    assert(rosterText.includes("Pekka"), "Pekka näkyy hahmolistassa");
    const floorAfter = sessionMap(session)?.currentFloor;
    dispatch(session, () => {});
    assert(sessionMap(session)?.currentFloor === floorAfter, "kerros palautuu listauksen jälkeen");
  } finally {
    ProcessRuntime.stopInstance(session);
    ProcessRuntime.stopInstance(root);
  }

  return true;
}

const isMain =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  runStaffRosterTests();
  console.log("staff_roster.test.mjs OK");
}
