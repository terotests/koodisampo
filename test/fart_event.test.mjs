import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createGameSimulator } from "../hosts/shared/gameSimulator.mjs";
import { dispatch, sessionMap } from "../hosts/terminal/gameHost.mjs";
import { assert } from "./support/gameTestHarness.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const require = createRequire(import.meta.url);
const { WorldEvent } = require(resolve(projectRoot, "generated/es6/koodisampo.cjs"));
const worldJson = readFileSync(
  resolve(__dirname, "../content/worlds/corporate-hq-intro.json"),
  "utf8",
);

export function runFartEventTests() {
  const sim = createGameSimulator(worldJson);
  try {
    sim.bootstrap({
      id: "fart-event",
      seed: 39,
      player: { floor: 2, x: 8, y: 6 },
      needs: { gas: 18 },
      relations: [{ npcId: "staff-f3-1", anger: 0, respect: 50, love: 0 }],
    });

    dispatch(sim.session, () => {
      const map = sessionMap(sim.session);
      const ent = map.findEntityById("staff-f3-1");
      ent.x = map.playerX + 1;
      ent.y = map.playerY;
      sim.session.simRngState = 39;
    });

    sim.tick(1);

    const events = JSON.parse(sim.session.simDebugEventsJson()).events;
    const fart = events.find((e) => e.type === "PlayerFarted");
    assert(fart, "high gas tick can emit PlayerFarted event");

    const rel = sim.session.npcRelations.getOrCreate("staff-f3-1");
    assert(rel.anger === 0, `default anger is zero (${rel.anger})`);

    dispatch(sim.session, () => {
      const map = sessionMap(sim.session);
      const ent = map.findEntityById("staff-f3-1");
      const evt = new WorldEvent();
      evt.x = map.playerX;
      evt.y = map.playerY;
      evt.applyPlayerFarted();
      sim.session.onNpcNoticedEvent(ent, evt, rel);
    });

    assert(rel.anger === 10, `noticed fart raises anger from zero (${rel.anger})`);
    assert(rel.respect === 40, `noticed fart lowers respect (${rel.respect})`);
  } finally {
    sim.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runFartEventTests();
  console.log("fart_event.test.mjs OK");
}
