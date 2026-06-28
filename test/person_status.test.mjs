import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createGameSession, dispatch, stopGameSession, sessionMap } from "../hosts/terminal/gameHost.mjs";
import {
  emptyPersonRegistry,
  normalizePersonRegistry,
  recordPersonEncounter,
  personMapChar,
  isPersonFamiliar,
  hasPersonRecommendation,
  checkFloorRecommendationAccess,
  getFloorRecommendationStatus,
  collectFloorRecommendationStaff,
  applyMapPersonDisplay,
} from "../hosts/terminal/personStatus.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

export function runPersonStatusTests() {
  let registry = emptyPersonRegistry();
  const pekka = { id: "staff-f2-1", name: "Pekka", kind: "coworker", char: "c" };
  const ceo = { id: "ceo-intro", name: "Toimitusjohtaja", kind: "role", char: "C" };

  assert(personMapChar(registry, pekka) === "T", "unfamiliar male coworker shows T");
  recordPersonEncounter(registry, pekka, { correct: true });
  assert(hasPersonRecommendation(registry, pekka.id), "correct quiz gives recommendation");
  assert(isPersonFamiliar(registry, pekka.id), "positive karma makes familiar");
  assert(personMapChar(registry, pekka) === "P", "familiar coworker shows first letter");

  const maija = { id: "staff-f2-2", name: "Maija", kind: "coworker", char: "c" };
  assert(personMapChar(registry, maija) === "t", "unfamiliar female coworker shows t");
  recordPersonEncounter(registry, maija, { tone: "talk" });
  recordPersonEncounter(registry, maija, { tone: "talk" });
  assert(isPersonFamiliar(registry, maija.id), "two talks make familiar without karma");
  assert(personMapChar(registry, maija) === "M", "familiar Maija shows M");

  assert(personMapChar(registry, ceo) === "T", "CEO keeps important map char");

  const roundtrip = normalizePersonRegistry({ byId: registry.byId });
  assert(roundtrip.byId[pekka.id].karma === registry.byId[pekka.id].karma, "registry serializes");

  const mapJson = readFileSync(
    resolve(projectRoot, "content/worlds/corporate-hq-intro.json"),
    "utf8",
  );
  const { root, session } = createGameSession();
  dispatch(session, () => {
    session.loadMapFromText(mapJson);
    session.tools.grant("access_card");
  });

  const floor0 = getFloorRecommendationStatus(session, registry, 0);
  assert(floor0.total >= 1, "courtyard has recommendation NPCs");
  assert(
    !floor0.missing.some((m) => m.id === "ceo-lunch-walk"),
    "lunch CEO walk does not count toward courtyard recommendations",
  );

  const floor1 = getFloorRecommendationStatus(session, registry, 1);
  assert(floor1.total > 0, "floor 2 has recommendation NPCs");
  assert(floor1.complete === false, "empty registry has incomplete floor");

  const block = checkFloorRecommendationAccess(session, registry, 2);
  assert(block.ok === false, "cannot go up without floor recommendations");

  for (const ent of collectFloorRecommendationStaff(session, 1)) {
    recordPersonEncounter(registry, ent, { correct: true });
  }
  const floor1b = getFloorRecommendationStatus(session, registry, 1);
  assert(floor1b.complete === true, "all floor 1 staff recommended");

  dispatch(session, () => {
    sessionMap(session).currentFloor = 1;
  });
  const allow = checkFloorRecommendationAccess(session, registry, 2);
  assert(allow.ok === true, "can go to floor 3 after floor 2 recommendations");

  dispatch(session, () => {
    const map = sessionMap(session);
    map.currentFloor = 1;
    const view = session.getMapView();
    const display = applyMapPersonDisplay(view.lines, map, registry, {
      x: view.cameraX,
      y: view.cameraY,
    });
    assert(display.recommendedCells.length > 0, "recommended staff highlighted on map");
  });

  stopGameSession(root, session);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runPersonStatusTests();
  console.log("person status tests OK");
}
