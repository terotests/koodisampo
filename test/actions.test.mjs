import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import {
  getActionTargetInFront,
  listUsableItems,
  resolveActionApply,
  applyActionResult,
} from "../hosts/terminal/actions.mjs";
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
    });

    const target = getActionTargetInFront(session);
    assert(target?.id === "workstation", "K tile ahead is workstation");

    const items = listUsableItems(session);
    assert(items.some((i) => i.id === "usb_drive"), "USB in usable items");

    const usbResult = resolveActionApply(session, target, "usb_drive");
    assert(usbResult.ok, "USB on workstation succeeds");
    assert(typeof usbResult.message === "string", "USB gives message");

    dispatch(session, () => {
      applyActionResult(session, usbResult);
    });

    dispatch(session, () => {
      const map = sessionMap(session);
      map.currentFloor = 1;
      map.playerX = 65;
      map.playerY = 23;
      map.facingX = 1;
      map.facingY = 0;
      map.setTileAt(66, 23, "K");
    });

    const hammerResult = resolveActionApply(session, target, "crowbar");
    assert(hammerResult.ok && hammerResult.karmaDelta < 0, "hammer on PC is bad karma");
    dispatch(session, () => {
      applyActionResult(session, hammerResult);
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
  } finally {
    stopSession(root, session);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runActionsTests();
  console.log("actions.test.mjs OK");
}
