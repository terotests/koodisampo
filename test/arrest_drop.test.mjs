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

export function runArrestDropTests() {
  const mapJson = readFileSync(
    resolve(projectRoot, "content/worlds/corporate-hq-intro.json"),
    "utf8",
  );
  const { root, session } = createSession();
  try {
    dispatch(session, () => {
      session.loadMapFromText(mapJson);
      session.applyPlayerProfile("Testi", "cpp");
      const map = sessionMap(session);
      map.currentFloor = 0;
      map.playerX = 20;
      map.playerY = 10;
      map.policeChaseActive = true;
      map.facingX = 0;
      map.facingY = 1;
      session.tools.grant("sledgehammer");
      const floor = map.activeFloor();
      floor.entities = [
        ...(floor.entities ?? []),
        {
          id: "police-test",
          char: "P",
          name: "Poliisi",
          kind: "police",
          x: map.playerX,
          y: map.playerY,
          moveMode: "police_chase",
          isAgent: true,
          offDuty: false,
        },
      ];
    });

    dispatch(session, () => {
      assert(session.tryPoliceCapture() === true, "police capture triggers arrest flow");
      assert(session.screen === "encounter", "arrest uses encounter screen");
      assert(session.encounterResult === "arrest", "encounter result is arrest");
      const view = session.getArrestView();
      assert(view.evidenceLocked === true, "sledgehammer + chase = locked evidence");
      assert((view.reasonLine || "").includes("takaa-ajo"), `reason mentions chase: ${view.reasonLine}`);
    });

    dispatch(session, () => {
      session.onArrestChoice("deny");
      assert(session.screen === "gameover", "strong evidence denial leads to death");
      assert(session.gameOverReason === "PoliceCaught", "police death reason");
    });

    dispatch(session, () => {
      session.reviveFromGameEnd("uusi yritys");
      session.tools.hasCrowbar = false;
      session.tools.hasShovel = false;
      session.tools.hasSledgehammer = false;
      session.tools.hasUsbDrive = false;
      session.tools.hasStolenCard = false;
      session.tools.heldCoworkerCardOwner = "";
      const map = sessionMap(session);
      map.currentFloor = 0;
      map.playerX = 10;
      map.playerY = 10;
      map.facingX = 1;
      map.facingY = 0;
      session.tools.grant("usb_drive");
      session.screen = "inventory";
    });

    dispatch(session, () => {
      session.onInventoryKey("1");
      assert(session.tools.hasUsbDrive === false, "drop removes usb from inventory");
      const map = sessionMap(session);
      const ent = map.entityAt(11, 10);
      assert(ent.kind === "item", "dropped item spawns ahead of player");
      assert(ent.itemTool === "usb_drive", "dropped item keeps tool id");
      session.onInventoryKey("enter");
    });

    dispatch(session, () => {
      const map = sessionMap(session);
      map.playerX = 11;
      map.playerY = 10;
      session.afterPlayerAction();
      assert(session.tools.hasUsbDrive === true, "stepping onto item picks it up");
    });
  } finally {
    stopSession(root, session);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runArrestDropTests();
  console.log("arrest_drop.test.mjs OK");
}
