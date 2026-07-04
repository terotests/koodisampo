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

export function runDeathResetTests() {
  const sim = createGameSimulator(worldJson);
  try {
    sim.bootstrap({
      id: "death-reset-gameover",
      seed: 51,
      player: { floor: 2, x: 8, y: 6 },
      tool: "sledgehammer",
      progress: { interviewPassed: true, guruIntroPassed: true },
    });
    const session = sim.session;
    const map = sessionMap(session);

    dispatch(session, () => {
      session.tools.grant("official_badge");
      session.tools.grant("promoted_card");
    });
    assert(session.playerSalary() === 3000, `employed salary before death (${session.playerSalary()})`);

    const target = findAdjacentBreakable(map);
    assert(target, "adjacent breakable tile exists");
    dispatch(session, () => {
      map.playerX = target.x - target.fx;
      map.playerY = target.y - target.fy;
      map.facingX = target.fx;
      map.facingY = target.fy;
      map.tryBreakFacing("sledgehammer", 500);
    });
    assert(map.tileAt(target.x, target.y) === ".", "wall broken before death");

    dispatch(session, () => {
      session.gameOverFall();
    });
    assert(session.screen === "gameover", "fall death goes to gameover");

    dispatch(session, () => {
      session.onMapKey("enter");
    });
    assert(session.screen === "map", "gameover enter returns to map");
    assert(session.playerSalary() === 0, `salary reset after death (${session.playerSalary()})`);
    assert(session.interviewPassed === false, "interview progress reset after death");
    assert(session.tools.hasOfficialBadge === false, "official badge cleared after death");
    assert(map.tileAt(target.x, target.y) === target.tile, `broken wall restored (${map.tileAt(target.x, target.y)})`);
    assert(map.eventLog.count() === 0, "break events cleared after death");
  } finally {
    sim.stop();
  }

  const simEncounter = createGameSimulator(worldJson);
  try {
    simEncounter.bootstrap({
      id: "death-reset-encounter",
      seed: 52,
      player: { floor: 2, x: 8, y: 6 },
      tool: "sledgehammer",
      progress: { interviewPassed: true },
    });
    const session = simEncounter.session;
    const map = sessionMap(session);

    dispatch(session, () => {
      session.tools.grant("official_badge");
    });
    assert(session.playerSalary() === 3000, `salary before encounter death (${session.playerSalary()})`);

    const target = findAdjacentBreakable(map);
    assert(target, "adjacent breakable tile for encounter death");
    dispatch(session, () => {
      map.playerX = target.x - target.fx;
      map.playerY = target.y - target.fy;
      map.facingX = target.fx;
      map.facingY = target.fy;
      map.tryBreakFacing("sledgehammer", 500);
    });

    dispatch(session, () => {
      session.encounterDeath("Testikuolema.");
    });
    assert(session.screen === "map", "encounter death stays on map");
    assert(session.playerSalary() === 0, `salary reset after encounter death (${session.playerSalary()})`);
    assert(map.tileAt(target.x, target.y) === target.tile, "wall restored after encounter death");
  } finally {
    simEncounter.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runDeathResetTests();
  console.log("death_reset.test.mjs OK");
}
