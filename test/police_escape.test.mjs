import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createGameSimulator } from "../hosts/shared/gameSimulator.mjs";
import { dispatch, sessionMap } from "../hosts/terminal/gameHost.mjs";
import { assert, findElevatorTile, teleportToElevator } from "./support/gameTestHarness.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const worldJson = readFileSync(
  resolve(__dirname, "../content/worlds/corporate-hq-intro.json"),
  "utf8",
);

export function runPoliceEscapeTests() {
  const sim = createGameSimulator(worldJson);
  try {
    sim.bootstrap({
      id: "police-escape-elevator",
      seed: 60,
      player: { floor: 0, x: 20, y: 10 },
    });
    const session = sim.session;
    const map = sessionMap(session);

    dispatch(session, () => {
      session.tools.grant("official_badge");
      map.startPoliceChase();
    });
    assert(map.policeChaseActive === true, "police chase active on courtyard");

    teleportToElevator(session, dispatch, 0);
    dispatch(session, () => {
      session.onMapKey("2");
    });
    assert(map.currentFloor === 1, "player escaped to floor 1");
    assert(map.policeChaseActive === false, "police chase ends after indoor escape");
    assert(
      (map.lastStatus || "").includes("turvaan"),
      `escape status mentions safety: ${map.lastStatus}`,
    );
    assert(session.screen === "map", "escape keeps player on map");
  } finally {
    sim.stop();
  }

  const simNoCard = createGameSimulator(worldJson);
  try {
    simNoCard.bootstrap({
      id: "police-no-card-no-escape",
      seed: 61,
      player: { floor: 0, x: 20, y: 10 },
    });
    const session = simNoCard.session;
    const map = sessionMap(session);

    dispatch(session, () => {
      map.startPoliceChase();
    });
    teleportToElevator(session, dispatch, 0);
    dispatch(session, () => {
      session.onMapKey("2");
    });
    assert(map.currentFloor === 0, "no card keeps player on courtyard");
    assert(map.policeChaseActive === true, "chase continues without access card");
    assert(
      (map.lastStatus || "").toLowerCase().includes("kulkukort"),
      `denied without card: ${map.lastStatus}`,
    );
  } finally {
    simNoCard.stop();
  }

  const simTexts = createGameSimulator(worldJson);
  try {
    simTexts.bootstrap({
      id: "police-death-texts",
      seed: 62,
      player: { floor: 0, x: 20, y: 10 },
    });
    const session = simTexts.session;
    const map = sessionMap(session);

    dispatch(session, () => {
      map.policeChaseActive = true;
      const floor = map.activeFloor();
      const police = {
        id: "police-test-text",
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
      assert(session.tryPoliceCapture() === true, "police capture for death text test");
    });
    dispatch(session, () => {
      session.onArrestChoice("cooperate");
    });
    assert(session.screen === "gameover", "police arrest is game over");
    const line = session.memorialDeathLine || "";
    assert(line.length > 10, `police death line present: ${line}`);
    assert(!line.includes("Kiinni poliisien toimesta"), "uses varied death text");
    assert(session.gameOverTexts.policeCount() === 30, "30 police death texts loaded");

    const elevator = findElevatorTile(map, 0);
    assert(elevator, "courtyard elevator exists for hint coverage");
  } finally {
    simTexts.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runPoliceEscapeTests();
  console.log("police_escape.test.mjs OK");
}
