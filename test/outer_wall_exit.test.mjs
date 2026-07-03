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

function breakOuterWallAt(map, x, y) {
  assert(map.isOuterWallCell(map.currentFloor, x, y), `(${x},${y}) is outer wall`);
  const severity = map.tryBreakAt(x, y, "sledgehammer", 500);
  assert(severity === "heavy", `break severity heavy, got ${severity}`);
  assert(map.hasOuterWallBreach(x, y), "breach recorded");
}

export function runOuterWallExitTests() {
  const sim = createGameSimulator(worldJson);
  try {
    sim.bootstrap({
      id: "outer-wall-fall",
      seed: 42,
      player: { floor: 1, x: 2, y: 1 },
      tool: "sledgehammer",
    });
    const map = sessionMap(sim.session);
    const session = sim.session;

    breakOuterWallAt(map, 0, 1);
    dispatch(session, () => {
      map.playerX = 0;
      map.playerY = 1;
    });
    assert(map.wouldExitBuilding(-1, 0) === true, "left exit detected on breach");

    dispatch(session, () => {
      session.onMapKey("left");
    });
    assert(session.screen === "map", "2. kerros fall keeps playing on map");
    assert(map.currentFloor === 0, "fell to courtyard floor");
    assert(map.policeChaseActive === true, "police chase after courtyard fall");
    assert(
      (map.lastStatus || "").includes("pihamaalle"),
      `courtyard fall status: ${map.lastStatus}`,
    );
  } finally {
    sim.stop();
  }

  const simHigh = createGameSimulator(worldJson);
  try {
    simHigh.bootstrap({
      id: "outer-wall-death",
      seed: 43,
      player: { floor: 2, x: 2, y: 1 },
      tool: "sledgehammer",
    });
    const map = sessionMap(simHigh.session);
    const session = simHigh.session;

    breakOuterWallAt(map, 0, 1);
    dispatch(session, () => {
      map.playerX = 0;
      map.playerY = 1;
    });
    dispatch(session, () => {
      session.onMapKey("left");
    });
    assert(session.screen === "gameover", "higher floor exit is game over");
    assert(session.gameOverReason === "FallDeath", `reason FallDeath, got ${session.gameOverReason}`);
    assert(session.exportDeaths() === 1, "fall death increments deaths");
    assert(session.memorialCount() >= 3, "memorial uses fallback mourners when no bonds");
    assert(session.memorialHasId("janitor"), "memorial has janitor");
    assert(session.memorialHasId("office-dog"), "memorial has dog");
    assert(session.memorialHasId("police-memorial"), "memorial has police");

    dispatch(session, () => {
      session.onMapKey("enter");
    });
    assert(session.screen === "map", "gameover enter returns to map");
    assert(session.gameOverReason === "", "gameover enter clears gameOverReason");
    assert(session.playerNeeds.satiety > 0, "gameover enter resets satiety");
    assert(session.conduct.misconduct === 0, "gameover enter resets misconduct");
    assert(map.policeChaseActive === false, "gameover enter clears police chase");
    assert(session.memorialCount() === 0, "gameover enter clears memorial");
  } finally {
    simHigh.stop();
  }

  const simBond = createGameSimulator(worldJson);
  try {
    simBond.bootstrap({
      id: "memorial-bond",
      seed: 46,
      player: { floor: 2, x: 2, y: 1 },
      tool: "sledgehammer",
    });
    const map = sessionMap(simBond.session);
    const session = simBond.session;
    dispatch(session, () => {
      const rel = session.npcRelations.getOrCreate("hr-greeter");
      rel.love = 72;
      rel.respect = 68;
      rel.friendliness = 80;
    });
    breakOuterWallAt(map, 0, 1);
    dispatch(session, () => {
      map.playerX = 0;
      map.playerY = 1;
    });
    dispatch(session, () => {
      session.onMapKey("left");
    });
    assert(session.screen === "gameover", "bond memorial triggers on fall death");
    assert(session.memorialHasId("hr-greeter"), "memorial prefers bonded NPC");
    assert(!session.memorialHasId("janitor"), "no fallback janitor when bonded NPC mourns");
    assert(session.memorialCount() === 1, `one bonded mourner, got ${session.memorialCount()}`);
  } finally {
    simBond.stop();
  }

  const simPolice = createGameSimulator(worldJson);
  try {
    simPolice.bootstrap({
      id: "police-capture",
      seed: 44,
      player: { floor: 0, x: 20, y: 10 },
    });
    const map = sessionMap(simPolice.session);
    const session = simPolice.session;

    dispatch(session, () => {
      map.policeChaseActive = true;
      const floor = map.activeFloor();
      const police = {
        id: "police-test-0",
        char: "P",
        name: "Poliisi",
        kind: "police",
        x: map.playerX,
        y: map.playerY,
        moveMode: "police_chase",
        isAgent: true,
        offDuty: false,
      };
      floor.entities = [...(floor.entities ?? []), police];
    });
    dispatch(session, () => {
      session.applyPlayerProfile("Pekka", "cpp");
    });
    dispatch(session, () => {
      assert(session.tryPoliceCapture() === true, "police capture on same tile");
    });
    assert(session.screen === "gameover", "police capture goes to game over");
    assert(session.screen !== "encounter", "police does not start encounter");
    assert(session.gameOverReason === "PoliceCaught", "police capture reason");
    assert(session.memorialCount() >= 1, "police death builds memorial");
    assert(session.memorialPlayerName === "Pekka", `memorial uses player name, got ${session.memorialPlayerName}`);
  } finally {
    simPolice.stop();
  }

  const simEncounter = createGameSimulator(worldJson);
  try {
    simEncounter.bootstrap({
      id: "police-no-talk",
      seed: 45,
      player: { floor: 0, x: 20, y: 10 },
    });
    const map = sessionMap(simEncounter.session);
    const session = simEncounter.session;
    dispatch(session, () => {
      map.policeChaseActive = true;
    });
    dispatch(session, () => {
      const bump = {
        id: "police-test-1",
        char: "P",
        name: "Poliisi",
        kind: "police",
        storyId: "",
      };
      session.startEncounter(bump);
    });
    assert(session.screen === "gameover", "startEncounter with police during chase is game over");
  } finally {
    simEncounter.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runOuterWallExitTests();
  console.log("outer_wall_exit.test.mjs OK");
}
