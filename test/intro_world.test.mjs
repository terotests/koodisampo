import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { getEncounterQuiz, clearEncounterQuizCache, pickQuestion } from "../hosts/terminal/encounterQuestions.mjs";
import { emptyQuizHistory, recordQuizAnswer } from "../hosts/terminal/quizHistory.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const require = createRequire(import.meta.url);
const { WorldMap, KoodisampoAppRoot, ProcessRuntime } = require(
  resolve(projectRoot, "generated/es6/koodisampo.cjs"),
);

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function dispatch(session, work) {
  const turnRoot = session.__rangerFindRoot();
  ProcessRuntime.beginDispatchTurn(turnRoot);
  try {
    work();
  } finally {
    ProcessRuntime.endDispatchTurn(turnRoot);
  }
}

export function runIntroWorldTests() {
  const mapJson = readFileSync(
    resolve(projectRoot, "content/worlds/corporate-hq-intro.json"),
    "utf8",
  );
  const map = new WorldMap();
  assert(map.loadFromText(mapJson), "intro world loads");
  assert(map.mapId === "corporate-hq-intro", "map id");
  assert(map.floorCount() === 10, "ten floors");
  assert(map.currentFloor === 0, "start on courtyard");

  assert(map.isBlockedTile("L") === true, "locked door blocked");
  assert(map.isBlockedTile(",") === false, "courtyard walkable");

  const crowbar = map.entityAt(4, 4);
  assert(crowbar.id === "yard-crowbar" && crowbar.itemTool === "crowbar", "crowbar item on courtyard");
  const sledge = map.entityAt(16, 4);
  assert(sledge.id === "yard-sledge" && sledge.itemTool === "sledgehammer", "sledgehammer item on courtyard");

  const card = map.entityAt(13, 8);
  assert(card.id === "stolen-card", "card entity in shed");
  assert(card.itemTool === "access_card", "card item type");

  assert(map.tryMove(0, -1) === true || map.tryMove(1, 0) === true, "player can move from spawn area");

  let atCount = 0;
  for (let y = 0; y < map.height; y += 1) {
    for (let x = 0; x < map.width; x += 1) {
      if (map.tileAt(x, y) === "@") atCount += 1;
    }
  }
  assert(atCount === 0, "map tiles must not contain @ — player is drawn separately");

  const view = map.getView();
  let viewAtCount = 0;
  for (const line of view.lines) {
    for (const ch of line) {
      if (ch === "@") viewAtCount += 1;
    }
  }
  assert(viewAtCount === 1, "exactly one @ on screen at spawn (the player)");

  map.currentFloor = 1;
  map.recomputeSize();
  const officeFloor = map.activeFloor();
  map.playerX = officeFloor.spawnX;
  map.playerY = officeFloor.spawnY;

  let reachedElevator = false;
  const queue = [{ x: map.playerX, y: map.playerY }];
  const seen = new Set([`${map.playerX},${map.playerY}`]);
  while (queue.length > 0) {
    const { x, y } = queue.shift();
    if (map.tileAt(x, y) === "E") {
      reachedElevator = true;
      break;
    }
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx;
      const ny = y + dy;
      const key = `${nx},${ny}`;
      if (seen.has(key)) continue;
      const tile = map.tileAt(nx, ny);
      if (map.isBlockedTile(tile)) continue;
      seen.add(key);
      queue.push({ x: nx, y: ny });
    }
  }
  assert(reachedElevator, "office floor elevator is reachable from spawn");

  map.currentFloor = 1;
  map.recomputeSize();
  assert(map.findElevatorOnFloor(1) === true, "office floor has real elevator");
  const officeElevX = map.foundElevatorX;
  const officeElevY = map.foundElevatorY;
  assert(map.tileAt(officeElevX, officeElevY) === "E", "elevator tile is E");

  map.currentFloor = 0;
  map.recomputeSize();
  assert(map.findElevatorOnFloor(0) === true, "courtyard has elevator");
  const courtyardElevX = map.foundElevatorX;
  const courtyardElevY = map.foundElevatorY;
  map.playerX = courtyardElevX;
  map.playerY = courtyardElevY;
  assert(map.findElevatorOnFloor(1) === true, "office elevator found while on courtyard floor");
  assert(map.isOnElevator() === true, "player on courtyard elevator");
  assert(map.tryElevatorTo(1) === true, "elevator from courtyard to office floor");
  assert(map.currentFloor === 1, "arrived on office floor");
  assert(map.playerX === officeElevX && map.playerY === officeElevY, "spawned at office elevator");

  const guru = officeFloor.entities.find((e) => e.id === "mentor");
  const coworker = officeFloor.entities.find((e) => e.id === "staff-f2-1");
  assert(guru, "guru entity on office floor");
  assert(coworker, "coworker on office floor");
  assert(map.roleDisplayChar(guru) === "g", "guru map char");
  assert(map.roleDisplayChar(coworker) === "t", "coworker map char");
  assert(map.renderChar(guru.x, guru.y) === "g", "guru rendered on map");
  assert(map.renderChar(coworker.x, coworker.y) === "t", "coworker rendered on map");

  map.playerX = 3;
  map.playerY = 2;
  map.ensurePlayerOnWalkable();
  assert(map.isBlockedTile(map.tileAt(map.playerX, map.playerY)) === false, "ensurePlayerOnWalkable escapes wall");

  const { root, session } = createSessionFromIntro();
  try {
    dispatch(session, () => {
      session.loadMapFromText(mapJson);
      const rec = session._map.activeFloor().entities.find((e) => e.id === "receptionist");
      session.startEncounter(rec);
    });
    assert(session.needsEncounterQuiz() === true, "receptionist uses quiz not fixed story");
    dispatch(session, () => session.onEncounterChoice("talk"));
    assert(session.encounterResult === "quiz", "receptionist talk routes to quiz");
    const q1 = getEncounterQuiz(session);
    clearEncounterQuizCache();
    const hist = recordQuizAnswer(emptyQuizHistory(), "receptionist", q1.question.id, false);
    const q2 = getEncounterQuiz(session, hist, { nextPickNonce: () => 99 });
    assert(q2.question.id !== q1.question.id, "second interview attempt differs");

    const rec = { id: "receptionist", name: "Vastaanottovirkailija", char: "S", kind: "role" };
    const a = pickQuestion(rec, 85, emptyQuizHistory(), { pickNonce: 1, deaths: 4 });
    const b = pickQuestion(rec, 85, emptyQuizHistory(), { pickNonce: 2, deaths: 4 });
    assert(a.question.id !== b.question.id, "interview pick nonce rotates question");
  } finally {
    stopSession(root, session);
  }
}

function createSessionFromIntro() {
  const root = new KoodisampoAppRoot();
  ProcessRuntime.startInstance(root);
  return { root, session: root.createSession() };
}

function stopSession(root, session) {
  if (session?.__rangerId !== 0) ProcessRuntime.stopInstance(session);
  if (root?.__rangerId !== 0) ProcessRuntime.stopInstance(root);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runIntroWorldTests();
  console.log("intro world tests OK");
}
