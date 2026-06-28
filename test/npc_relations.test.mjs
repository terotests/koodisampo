import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { assert } from "./support/gameTestHarness.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const require = createRequire(import.meta.url);
const {
  NpcRelation,
  NpcRelationStore,
  DialogueCatalog,
  FeatureKarma,
  PlayerNeeds,
} = require(resolve(projectRoot, "generated/es6/koodisampo.cjs"));

export function runNpcRelationsTests() {
  const rel = new NpcRelation();
  rel.resetDefaults();
  assert(rel.anger === 0, `default anger 0, got ${rel.anger}`);
  assert(rel.love === 0, `default love 0, got ${rel.love}`);
  assert(rel.friendliness === 50, `default friendliness 50, got ${rel.friendliness}`);
  rel.applyStatDelta("respect", 3);
  assert(rel.respect === 53, `respect +3, got ${rel.respect}`);

  const store = new NpcRelationStore();
  const a = store.getOrCreate("npc-a");
  a.setStat("anger", 75);
  assert(store.countWithAngerAtLeast(75) === 1, "one angry npc");

  const catalog = new DialogueCatalog();
  catalog.loadDefaults();
  const karma = new FeatureKarma();
  const needs = new PlayerNeeds();
  const relation = store.getOrCreate("npc-a");
  relation.setStat("respect", 50);
  catalog.applyAnswerToRelation(0, 1, relation);
  assert(relation.respect === 60, `dialogue respect +10, got ${relation.respect}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runNpcRelationsTests();
  console.log("npc_relations.test.mjs OK");
}
