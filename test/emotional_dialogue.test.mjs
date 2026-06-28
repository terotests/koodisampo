import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { assert } from "./support/gameTestHarness.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const require = createRequire(import.meta.url);
const { NpcRelation, DialogueCatalog } = require(
  resolve(projectRoot, "generated/es6/koodisampo.cjs"),
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
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runEmotionalDialogueTests();
  console.log("emotional_dialogue.test.mjs OK");
}
