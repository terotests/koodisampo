import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createGameSimulator } from "../hosts/shared/gameSimulator.mjs";
import { dispatch, sessionMap } from "../hosts/terminal/gameHost.mjs";
import { assert } from "./support/gameTestHarness.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const require = createRequire(import.meta.url);
const { WorldEvent, WorldEventLog } = require(
  resolve(projectRoot, "generated/es6/koodisampo.cjs"),
);

const worldJson = readFileSync(
  resolve(projectRoot, "content/worlds/corporate-hq-intro.json"),
  "utf8",
);

export function runWorldEventsTests() {
  const log = new WorldEventLog();
  const evt = new WorldEvent();
  evt.type = "WallBroken";
  evt.floor = 2;
  evt.x = 10;
  evt.y = 6;
  evt.timeMinutes = 500;
  evt.noise = 18;
  log.push(evt);

  assert(log.count() === 1, "push adds event");
  assert(log.countOnFloor(2) === 1, "floor filter");
  assert(log.countOnFloor(1) === 0, "other floor empty");
  assert(log.countOnFloorSince(2, 10, 505) === 1, "recent window includes event");
  assert(log.countOnFloorSince(2, 2, 510) === 0, "old event outside window");

  const sim = createGameSimulator(worldJson);
  try {
    sim.bootstrap({ id: "world-events", seed: 7, player: { floor: 2 } });
    dispatch(sim.session, () => {
      const session = sim.session;
      const evt2 = new WorldEvent();
      evt2.floor = 2;
      evt2.x = 8;
      evt2.y = 6;
      evt2.timeMinutes = session.worldClock.gameMinutes;
      evt2.applyPlayerFarted();
      sessionMap(session).pushWorldEvent(evt2);
    });
    const debug = JSON.parse(sim.session.simDebugEventsJson());
    assert(debug.events.length === 1, "session event log via debug json");
    assert(debug.events[0].type === "PlayerFarted", "event type preserved");
  } finally {
    sim.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runWorldEventsTests();
  console.log("world_events.test.mjs OK");
}
