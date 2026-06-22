import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { sessionMap } from "../hosts/shared/sessionMap.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const require = createRequire(import.meta.url);

const {
  GameSession,
  KoodisampoAppRoot,
  ProcessRuntime,
} = require(resolve(projectRoot, "generated/es6/koodisampo.cjs"));

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function dispatch(session, work) {
  const turnRoot = session.__rangerFindRoot();
  ProcessRuntime.beginDispatchTurn(turnRoot);
  try {
    work();
  } finally {
    ProcessRuntime.endDispatchTurn(turnRoot);
  }
}

function createSession() {
  const root = new KoodisampoAppRoot();
  ProcessRuntime.startInstance(root);
  const session = root.createSession();
  return { root, session };
}

function stopSession(root, session) {
  if (session?.__rangerId !== 0) ProcessRuntime.stopInstance(session);
  if (root?.__rangerId !== 0) ProcessRuntime.stopInstance(root);
}

export function runActionsTests() {
  const mapJson = readFileSync(
    resolve(projectRoot, "content/worlds/corporate-hq-intro.json"),
    "utf8",
  );
  const { root, session } = createSession();
  try {
    dispatch(session, () => {
      session.loadMapFromText(mapJson);
      const map = sessionMap(session);
      map.currentFloor = 1;
      map.playerX = 65;
      map.playerY = 23;
      map.facingX = 1;
      map.facingY = 0;
      session.tools.grant("usb_drive");
      session.actionTargetX = 66;
      session.actionTargetY = 23;
      session.actionTargetId = "workstation";
    });

    dispatch(session, () => {
      const view = session.getActionView();
      assert(view.targetId === "workstation", "K tile ahead is workstation");
      assert(view.toolIds.includes("usb_drive"), "USB in usable tools");
    });

    dispatch(session, () => {
      session.applyToolToTarget("usb_drive");
      assert(session.actionResultOk, "USB on workstation succeeds");
      assert(typeof session.actionResultMessage === "string", "USB gives message");
    });

    dispatch(session, () => {
      const map = sessionMap(session);
      map.currentFloor = 1;
      map.playerX = 65;
      map.playerY = 23;
      map.facingX = 1;
      map.facingY = 0;
      map.setTileAt(66, 23, "K");
      session.actionTargetX = 66;
      session.actionTargetY = 23;
      session.actionTargetId = "workstation";
      session.tools.grant("crowbar");
    });

    dispatch(session, () => {
      session.applyToolToTarget("crowbar");
      assert(session.actionResultOk, "hammer on PC succeeds");
      assert(session.karma.total() < 50, "hammer on PC is bad karma");
      assert(sessionMap(session).tileAt(66, 23) === "x", "broken workstation tile");
    });

    dispatch(session, () => {
      const map = sessionMap(session);
      map.currentFloor = 0;
      const floor = map.activeFloor();
      const item = floor.entities.find((e) => e.id === "yard-crowbar");
      assert(item, "yard crowbar exists");
      map.playerX = item.x;
      map.playerY = item.y;
      const picked = map.pickupItemAt(item.x, item.y);
      assert(picked === "crowbar", "pickup returns tool id");
      assert(!map.entityAt(item.x, item.y).id, "entity removed");
      session.tools.grant(picked);
      assert(map.tileAt(item.x, item.y) === ".", "tile cleared after pickup");
    });

    dispatch(session, () => {
      const map = sessionMap(session);
      map.currentFloor = 1;
      const coworker = map.activeFloor().entities.find((e) => e.kind === "coworker");
      assert(coworker, "coworker on floor 2");
      coworker.offDuty = true;
      map.playerX = coworker.x - 1;
      map.playerY = coworker.y;
      map.facingX = 1;
      map.facingY = 0;
      const moved = map.tryMove(1, 0);
      assert(moved, "player walks through off-duty invisible coworker");
      assert(!map.entityBlocksPlayer(coworker), "off-duty entity does not block");
    });

    dispatch(session, () => {
      const map = sessionMap(session);
      map.setTileAt(70, 23, "#");
      map.playerX = 69;
      map.playerY = 23;
      map.facingX = 1;
      map.facingY = 0;
      session.tools.grant("shovel");
      session.actionTargetX = 70;
      session.actionTargetY = 23;
      session.applyToolToTarget("shovel");
      assert(session.actionResultOk, "shovel breaks wall");
      assert(map.tileAt(70, 23) === ".", "wall tile opened");
    });
  } finally {
    stopSession(root, session);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runActionsTests();
  console.log("actions.test.mjs OK");
}
