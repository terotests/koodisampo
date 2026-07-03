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
const dialoguePackJson = readFileSync(
  resolve(__dirname, "../content/dialogues/pack.json"),
  "utf8",
);

function findDialogueIndex(catalog, id) {
  let i = 0;
  while (i < 200) {
    const dlg = catalog.dialogueAt(i);
    if (!dlg || !dlg.id) break;
    if (dlg.id === id) return i;
    i += 1;
  }
  return -1;
}

function ensureDialoguePack(session) {
  session.loadEmotionalDialoguesFromText(dialoguePackJson);
}

function startUsbHelpEncounter(session, { withUsb = true } = {}) {
  ensureDialoguePack(session);
  const map = sessionMap(session);
  const ent = map.findEntityById("staff-f3-1");
  ent.x = 11;
  ent.y = 7;
  ent.mainTask = "searching_item";
  session.pendingEntityId = "staff-f3-1";
  session.pendingEntityName = ent.name;
  session.pendingEntityKind = "coworker";
  session.pendingEntityChar = ent.char;
  session.screen = "encounter";
  session.encounterResult = "emotional";
  const usbIdx = findDialogueIndex(session.dialogueCatalog, "help_usb_search");
  assert(usbIdx >= 0, "help_usb_search dialogue exists");
  session.pendingEmotionalDialogueIndex = usbIdx;
  if (withUsb) {
    session.tools.grant("usb_drive");
  }
}

function startLostBadgeHelpEncounter(session, { withCard = true } = {}) {
  ensureDialoguePack(session);
  const map = sessionMap(session);
  const ent = map.findEntityById("staff-f3-1");
  ent.x = 11;
  ent.y = 7;
  ent.mainTask = "searching_item";
  session.pendingEntityId = "staff-f3-1";
  session.pendingEntityName = ent.name;
  session.pendingEntityKind = "coworker";
  session.pendingEntityChar = ent.char;
  session.screen = "encounter";
  session.encounterResult = "emotional";
  const badgeIdx = findDialogueIndex(session.dialogueCatalog, "help_lost_badge");
  assert(badgeIdx >= 0, "help_lost_badge dialogue exists");
  session.pendingEmotionalDialogueIndex = badgeIdx;
  if (withCard) {
    session.tools.grant("access_card");
  }
}

export function runHelpRequestTests() {
  const sim = createGameSimulator(worldJson);
  try {
    sim.bootstrap({
      id: "help-request",
      seed: 4,
      player: { floor: 2, x: 10, y: 7 },
      relations: [{ npcId: "staff-f3-1", respect: 50, anger: 25 }],
      npcTask: { id: "staff-f3-1", mainTask: "searching_item" },
    });
    startUsbHelpEncounter(sim.session, { withUsb: true });
    const karmaBefore = sim.session.karma.total();
    dispatch(sim.session, () => {
      sim.session.finishEmotionalChoice(0);
    });
    const karmaAfter = sim.session.karma.total();
    assert(karmaAfter > karmaBefore, "helping with USB grants karma");
    const ent = sessionMap(sim.session).findEntityById("staff-f3-1");
    assert(ent.mainTask === "working", `NPC stops searching after help (${ent.mainTask})`);
  } finally {
    sim.stop();
  }

  const sim2 = createGameSimulator(worldJson);
  try {
    sim2.bootstrap({
      id: "help-request-no-usb",
      seed: 4,
      player: { floor: 2, x: 10, y: 7 },
      relations: [{ npcId: "staff-f3-1", respect: 50, anger: 25 }],
      npcTask: { id: "staff-f3-1", mainTask: "searching_item" },
    });
    startUsbHelpEncounter(sim2.session, { withUsb: false });
    const view = sim2.session.getEncounterView();
    const answers = view.emotionalAnswers || [];
    assert(
      answers.every((a) => !a.includes("Minulla on tikku")),
      "give-USB answer hidden when player has not found the stick",
    );
    assert(answers.length === 2, `expected 2 answers without USB (${answers.length})`);
    dispatch(sim2.session, () => {
      sim2.session.onEmotionalAnswerKey("1");
    });
    const ent2 = sessionMap(sim2.session).findEntityById("staff-f3-1");
    assert(ent2.mainTask === "searching_item", "NPC still searching after 'not seen' answer");
  } finally {
    sim2.stop();
  }

  const sim3 = createGameSimulator(worldJson);
  try {
    sim3.bootstrap({
      id: "help-request-lost-badge",
      seed: 4,
      player: { floor: 2, x: 10, y: 7 },
      relations: [{ npcId: "staff-f3-1", respect: 50, anger: 25 }],
      npcTask: { id: "staff-f3-1", mainTask: "searching_item" },
    });
    startLostBadgeHelpEncounter(sim3.session, { withCard: true });
    dispatch(sim3.session, () => {
      sim3.session.finishEmotionalChoice(0);
    });
    const status3 = sessionMap(sim3.session).lastStatus;
    assert(
      status3.includes("kortti") && !status3.includes("USB"),
      `lost badge help mentions card not USB: ${status3}`,
    );
    assert(sim3.session.tools.hasStolenCard === false, "stolen card removed after return");
    const ent3 = sessionMap(sim3.session).findEntityById("staff-f3-1");
    assert(ent3.mainTask === "working", `NPC stops searching after badge return (${ent3.mainTask})`);
  } finally {
    sim3.stop();
  }

  const sim4 = createGameSimulator(worldJson);
  try {
    sim4.bootstrap({
      id: "help-request-no-badge",
      seed: 4,
      player: { floor: 2, x: 10, y: 7 },
      relations: [{ npcId: "staff-f3-1", respect: 50, anger: 25 }],
      npcTask: { id: "staff-f3-1", mainTask: "searching_item" },
    });
    startLostBadgeHelpEncounter(sim4.session, { withCard: false });
    const view4 = sim4.session.getEncounterView();
    const answers4 = view4.emotionalAnswers || [];
    assert(
      answers4.every((a) => !a.includes("Löysin sen")),
      "give-badge answer hidden when player has no card",
    );
    assert(answers4.length === 2, `expected 2 answers without badge (${answers4.length})`);
  } finally {
    sim4.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runHelpRequestTests();
  console.log("help_request.test.mjs OK");
}
