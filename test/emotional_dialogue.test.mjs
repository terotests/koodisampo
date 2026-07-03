import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { assert } from "./support/gameTestHarness.mjs";
import { createGameSimulator } from "../hosts/shared/gameSimulator.mjs";
import { dispatch, sessionMap } from "../hosts/terminal/gameHost.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const require = createRequire(import.meta.url);
const { NpcRelation, DialogueCatalog } = require(
  resolve(projectRoot, "generated/es6/koodisampo.cjs"),
);
const worldJson = readFileSync(
  resolve(projectRoot, "content/worlds/corporate-hq-intro.json"),
  "utf8",
);

export function runEmotionalDialogueTests() {
  const catalog = new DialogueCatalog();
  catalog.loadDefaults();

  const calm = new NpcRelation();
  calm.setStat("anger", 25);
  const calmIdx = catalog.pickIndex(calm);
  assert(calmIdx === 0, `calm picks neutral, got ${calmIdx}`);
  assert(
    catalog.dialogueAt(calmIdx).id === "neutral_work_stress",
    "neutral dialogue id",
  );

  const angry = new NpcRelation();
  angry.setStat("anger", 60);
  const angryIdx = catalog.pickIndex(angry);
  assert(angryIdx === 1, `angry picks confrontation, got ${angryIdx}`);

  const packJson = readFileSync(
    resolve(projectRoot, "content/dialogues/pack.json"),
    "utf8",
  );
  const catalog2 = new DialogueCatalog();
  assert(catalog2.loadFromText(packJson), "pack.json loads");
  const angry2 = new NpcRelation();
  angry2.setStat("anger", 60);
  assert(catalog2.pickIndex(angry2) === 1, "json angry pick");

  const neutral = new NpcRelation();
  neutral.setStat("anger", 10);
  const ent = { id: "staff-test-1", kind: "coworker", name: "Testi" };
  const picks = new Set();
  for (let i = 0; i < 40; i += 1) {
    const idx = catalog2.pickForEncounter(neutral, ent);
    picks.add(catalog2.dialogueAt(idx).id);
  }
  assert(picks.size >= 3, `neutral dialogue variety: ${[...picks].join(", ")}`);

  const catalog3 = new DialogueCatalog();
  catalog3.loadFromText(packJson);
  const romantic = new NpcRelation();
  romantic.setStat("love", 60);
  romantic.setStat("anger", 20);
  const romanticIdx = catalog3.pickCategoryIndex("romantic", romantic, "staff-test-1");
  assert(romanticIdx >= 0, "romantic dialogue available");
  const reaction = catalog3.answerStatusReaction(romanticIdx, 0);
  assert(
    reaction.includes("ihastun") || reaction.includes("ilois"),
    `romantic answer has status reaction: ${reaction}`,
  );

  const sim = createGameSimulator(worldJson);
  try {
    sim.bootstrap({
      id: "status-reaction",
      seed: 3,
      player: { floor: 2, x: 10, y: 7 },
      relations: [{ npcId: "staff-f3-1", love: 60, anger: 20, respect: 50 }],
    });
    dispatch(sim.session, () => {
      const session = sim.session;
      const map = sessionMap(session);
      const ent = map.findEntityById("staff-f3-1");
      ent.x = 11;
      ent.y = 7;
      ent.romanticPreference = "any";
      session.pendingEntityId = "staff-f3-1";
      session.pendingEntityName = ent.name;
      session.pendingEntityKind = "coworker";
      session.pendingEntityChar = ent.char;
      session.screen = "encounter";
      session.encounterResult = "emotional";
      const rel = session.npcRelations.getOrCreate("staff-f3-1");
      session.pendingEmotionalDialogueIndex = session.dialogueCatalog.pickForEncounter(rel, ent);
      session.finishEmotionalChoice(0);
    });
    const status = sessionMap(sim.session).lastStatus;
    assert(
      status.includes(entName(sim.session)) && status.includes("näyttää"),
      `lastStatus shows emotional reaction: ${status}`,
    );
  } finally {
    sim.stop();
  }
}

function entName(session) {
  return sessionMap(session).findEntityById("staff-f3-1").name;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runEmotionalDialogueTests();
  console.log("emotional_dialogue.test.mjs OK");
}
