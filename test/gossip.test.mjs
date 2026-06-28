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

export function runGossipTests() {
  const sim = createGameSimulator(worldJson);
  try {
    sim.bootstrap({
      id: "gossip",
      seed: 17,
      player: { floor: 2, x: 10, y: 7 },
    });
    dispatch(sim.session, () => {
      sim.session.setNpcRelationStat("staff-f3-2", "jealousy", 80);
      const map = sessionMap(sim.session);
      const ent = map.findEntityById("staff-f3-2");
      ent.x = 11;
      ent.y = 7;
      sim.session.tryGossipFromJealousNpc();
    });
    const map = sessionMap(sim.session);
    assert(
      map.overheardMsg.includes("Larry") || map.overheardMsg.includes("epäilyttävää"),
      `jealous NPC gossip overheard: ${map.overheardMsg}`,
    );
  } finally {
    sim.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runGossipTests();
  console.log("gossip.test.mjs OK");
}
