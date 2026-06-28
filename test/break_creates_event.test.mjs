import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createGameSimulator } from "../hosts/shared/gameSimulator.mjs";
import { dispatch, sessionMap } from "../hosts/terminal/gameHost.mjs";
import { assert } from "./support/gameTestHarness.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const worldJson = readFileSync(
  resolve(__dirname, "../content/worlds/corporate-hq-intro.json"),
  "utf8",
);

function findAdjacentBreakable(map) {
  const dirs = [
    { dx: 0, dy: 1 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: -1 },
    { dx: -1, dy: 0 },
  ];
  for (const { dx, dy } of dirs) {
    const x = map.playerX + dx;
    const y = map.playerY + dy;
    const tile = map.tileAt(x, y);
    if (map.isBreakableTile(tile, "sledgehammer")) {
      return { x, y, fx: dx, fy: dy, tile };
    }
  }
  return null;
}

export function runBreakCreatesEventTests() {
  const sim = createGameSimulator(worldJson);
  try {
    sim.bootstrap({
      id: "break-event",
      seed: 21,
      player: { floor: 2, x: 8, y: 6 },
      tool: "sledgehammer",
    });
    const map = sessionMap(sim.session);
    const target = findAdjacentBreakable(map);
    assert(target, "adjacent breakable tile exists on floor 2");

    dispatch(sim.session, () => {
      const session = sim.session;
      map.playerX = target.x - target.fx;
      map.playerY = target.y - target.fy;
      map.facingX = target.fx;
      map.facingY = target.fy;
      const minutes = session.worldClock.gameMinutes;
      const severity = map.tryBreakAt(target.x, target.y, "sledgehammer", minutes);
      assert(severity === "heavy", `expected heavy break, got ${severity}`);
    });

    const events = JSON.parse(sim.session.simDebugEventsJson()).events;
    assert(events.length === 1, "break creates one world event");
    assert(events[0].type === "WallBroken", `event type WallBroken, got ${events[0].type}`);
    assert(events[0].noise >= 15, `wall break is loud (${events[0].noise})`);
  } finally {
    sim.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runBreakCreatesEventTests();
  console.log("break_creates_event.test.mjs OK");
}
