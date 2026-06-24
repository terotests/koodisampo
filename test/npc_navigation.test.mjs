import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { dispatch, sessionMap } from "../hosts/terminal/gameHost.mjs";
import { createTestController, findElevatorTile, assert } from "./support/gameTestHarness.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const require = createRequire(import.meta.url);
const { WorldMap } = require(resolve(projectRoot, "generated/es6/koodisampo.cjs"));

function manhattan(ax, ay, bx, by) {
  return Math.abs(ax - bx) + Math.abs(ay - by);
}

function findEntity(map, floorIndex, id) {
  const saved = map.currentFloor;
  map.currentFloor = floorIndex;
  map.recomputeSize?.();
  const floor = map.activeFloor();
  const ent = floor.entities.find((e) => e.id === id);
  map.currentFloor = saved;
  map.recomputeSize?.();
  return ent ?? null;
}

export function runNpcNavigationTests() {
  const worldJson = readFileSync(
    resolve(projectRoot, "content/worlds/corporate-hq-intro.json"),
    "utf8",
  );
  const map = new WorldMap();
  assert(map.loadFromText(worldJson), "load intro world");

  assert(findEntity(map, 0, "hr-greeter") == null, "HR not on courtyard before access");
  const hr = findEntity(map, 1, "hr-greeter");
  assert(hr != null, "hr-greeter exists on floor 2");
  assert(hr.offDuty === true, "HR dormant until official access");
  assert(hr.moveMode === "seek_player", "HR seeks player when active");
  assert(hr.agentGoal === "welcome_hr", "HR welcome goal");

  map.currentFloor = 1;
  map.recomputeSize();
  map.playerX = map.activeFloor().spawnX;
  map.playerY = map.activeFloor().spawnY;

  const staff = findEntity(map, 1, "staff-f2-1");
  if (staff) {
    const elevator = findElevatorTile(map, 1);
    assert(elevator != null, "office floor elevator");
    const startDist = manhattan(staff.x, staff.y, elevator.x, elevator.y);
    for (let t = 0; t < 50; t += 1) {
      map.tickSchedules(910 + t);
    }
    const after = findEntity(map, 1, "staff-f2-1");
    const endDist = manhattan(after.x, after.y, elevator.x, elevator.y);
    assert(endDist < startDist, "scheduled staff moves toward elevator after 17:00");
  }

  const ctrl = createTestController();
  try {
    const session = ctrl.session;
    const liveMap = sessionMap(session);
    assert(findEntity(liveMap, 0, "hr-greeter") == null, "HR not active on courtyard in live session");

    session.interviewPassed = true;
    session.tools.grant("official_badge");
    session.syncHrGreeter();

    liveMap.currentFloor = 1;
    liveMap.recomputeSize();
    liveMap.playerX = liveMap.activeFloor().spawnX;
    liveMap.playerY = liveMap.activeFloor().spawnY;

    const hrLive = findEntity(liveMap, 1, "hr-greeter");
    assert(hrLive != null, "HR on floor 2 after access");
    assert(hrLive.offDuty === false, "HR active after official access");
    const startHrDist = manhattan(hrLive.x, hrLive.y, liveMap.playerX, liveMap.playerY);

    for (let i = 0; i < 80; i += 1) {
      dispatch(session, () => {
        session.handleAgentTick();
      });
      const hrNow = findEntity(liveMap, 1, "hr-greeter");
      if (manhattan(hrNow.x, hrNow.y, liveMap.playerX, liveMap.playerY) <= 1) {
        break;
      }
    }

    const hrAfter = findEntity(liveMap, 1, "hr-greeter");
    const endHrDist = manhattan(hrAfter.x, hrAfter.y, liveMap.playerX, liveMap.playerY);
    assert(endHrDist < startHrDist, "HR moved closer to player while seeking on floor 2");

    dispatch(session, () => {
      session.handleAgentTick();
    });
    assert(session.screen === "encounter", "HR should start welcome encounter when adjacent");
    assert(session.pendingEntityId === "hr-greeter", "encounter is with HR");
  } finally {
    ctrl.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runNpcNavigationTests();
  console.log("npc navigation tests OK");
}
