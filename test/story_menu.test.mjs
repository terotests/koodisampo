import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createGameSession } from "../hosts/terminal/gameHost.mjs";
import {
  buildMenuItems,
  isSocialStory,
  partitionMenuStories,
} from "../hosts/terminal/storyMenu.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { StoryCatalog } = require(resolve(__dirname, "../generated/es6/koodisampo.cjs"));

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

export function runStoryMenuTests() {
  const catalog = new StoryCatalog().list();
  const { lessons, social } = partitionMenuStories(catalog);
  assert(isSocialStory({ id: "courtyard-janitor" }), "janitor story is social");
  assert(isSocialStory({ id: "courtyard-dog" }), "dog story is social");
  assert(!isSocialStory({ id: "modern-cpp-intro" }), "cpp intro is lesson");
  assert(!lessons.some((s) => s.id === "courtyard-janitor"), "janitor not in lessons");
  assert(social.some((s) => s.id === "courtyard-dog"), "dog in social section");

  const items = buildMenuItems(catalog);
  const janitorItem = items.find((x) => x.storyId === "courtyard-janitor");
  assert(janitorItem?.category === "social", "janitor menu category social");
  assert(items.filter((x) => x.category === "lesson").length === lessons.length, "lesson count");

  const { session } = createGameSession();
  const fromSession = buildMenuItems(session.catalogList());
  assert(fromSession.length === items.length, "session catalog matches");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runStoryMenuTests();
  console.log("story menu tests OK");
}
