import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { assert } from "./support/gameTestHarness.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const require = createRequire(import.meta.url);
const { WorldEvent, EventPerception, MapEntity, NpcRelation } = require(
  resolve(projectRoot, "generated/es6/koodisampo.cjs"),
);

export function runPerceptionTests() {
  const perception = new EventPerception();
  const npc = new MapEntity();
  npc.x = 10;
  npc.y = 6;
  npc.sociability = 50;

  const rel = new NpcRelation();
  rel.resetDefaults();

  const loudNear = new WorldEvent();
  loudNear.x = 11;
  loudNear.y = 6;
  loudNear.noise = 18;
  loudNear.visibility = 12;

  const quietFar = new WorldEvent();
  quietFar.x = 30;
  quietFar.y = 30;
  quietFar.noise = 2;
  quietFar.visibility = 2;

  const nearPct = perception.noticePercent(npc, loudNear, rel);
  const farPct = perception.noticePercent(npc, quietFar, rel);

  assert(nearPct >= 50, `loud nearby event noticeable (${nearPct}%)`);
  assert(farPct <= 10, `quiet distant event hard to notice (${farPct}%)`);
  assert(perception.noticesWithRoll(nearPct, 0) === true, "roll 0 notices loud event");
  assert(perception.noticesWithRoll(farPct, 99) === false, "roll 99 misses quiet far event");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runPerceptionTests();
  console.log("perception.test.mjs OK");
}
