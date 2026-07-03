import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createGameSimulator } from "../hosts/shared/gameSimulator.mjs";
import { sessionMap } from "../hosts/terminal/gameHost.mjs";
import { assert } from "./support/gameTestHarness.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const worldJson = readFileSync(
  resolve(__dirname, "../content/worlds/corporate-hq-intro.json"),
  "utf8",
);

function floorHasWcDoor(floor) {
  return floor.entities.some(
    (e) =>
      (e.char === "🚪" || e.name === "Ovi") &&
      Math.abs(e.x - floor.wcX) + Math.abs(e.y - floor.wcY) <= 3,
  );
}

export function runWcRouteTests() {
  const sim = createGameSimulator(worldJson);
  try {
    sim.bootstrap({
      id: "wc-route",
      seed: 11,
      player: { floor: 1 },
      skipProfile: true,
    });
    const map = sessionMap(sim.session);
    const offices = map.floors[1];
    assert(offices.wcX >= 0, `offices floor needs WC, wcX=${offices.wcX}`);
    assert(
      map.canReachTileOnFloor(
        1,
        offices.spawnX,
        offices.spawnY,
        offices.wcX,
        offices.wcY,
      ),
      "spawn should reach WC on offices floor",
    );
    assert(floorHasWcDoor(offices), "offices WC area should have a door entity");

    const devFloor = map.floors[2];
    assert(devFloor.wcX >= 0, "floor 3 should have WC coords");
    assert(
      map.canReachTileOnFloor(
        2,
        devFloor.spawnX,
        devFloor.spawnY,
        devFloor.wcX,
        devFloor.wcY,
      ),
      "spawn should reach WC on dev floor",
    );
    assert(floorHasWcDoor(devFloor), "dev floor WC area should have a door entity");
  } finally {
    sim.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runWcRouteTests();
  console.log("wc_route.test.mjs OK");
}
