import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { createGameSession, dispatch, stopGameSession } from "../hosts/terminal/gameHost.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const require = createRequire(import.meta.url);
const { WorldMap } = require(resolve(projectRoot, "generated/es6/koodisampo.cjs"));

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

export function runFloorAccessTests() {
  const mapJson = readFileSync(
    resolve(projectRoot, "content/worlds/corporate-hq-intro.json"),
    "utf8",
  );
  const map = new WorldMap();
  assert(map.loadFromText(mapJson), "intro world loads");
  assert(map.floorCount() === 10, "ten floors");

  const { root, session } = createGameSession();
  dispatch(session, () => {
    session.loadMapFromText(mapJson);
    session.tools.grant("access_card");
  });

  dispatch(session, () => {
    assert(session.canAccessFloor(1), "stolen card: floor 2 ok");
    assert(session.canAccessFloor(2) === false, "floor 3 blocked before guru");
    session.guruIntroPassed = true;
    assert(session.canAccessFloor(2) === false, "floor 3 blocked without promotion");
    session.tools.grant("promoted_card");
    assert(session.canAccessFloor(2), "floor 3 ok after guru + promotion");
    assert(session.canAccessFloor(8), "floor 9 ok with promotion");
    assert(session.canAccessFloor(9) === false, "floor 10 blocked without badge");
    session.tools.grant("official_badge");
    assert(session.canAccessFloor(9), "floor 10 ok with official badge");
    assert(session.tools.accessTier === 4, "official tier 4");
  });

  stopGameSession(root, session);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runFloorAccessTests();
  console.log("floor access tests OK");
}
