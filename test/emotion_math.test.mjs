import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { assert } from "./support/gameTestHarness.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const require = createRequire(import.meta.url);
const { EmotionMath } = require(resolve(projectRoot, "generated/es6/koodisampo.cjs"));

export function runEmotionMathTests() {
  const math = new EmotionMath();
  assert(math.chanceBps(5) === 1, "value 5 ~ 0.01%");
  assert(math.chanceBps(50) === 200, "value 50 ~ 2%");
  assert(math.chanceBps(100) === 2000, "value 100 = 20%");
  assert(math.rollTriggers(100, 1999) === true, "high value triggers");
  assert(math.rollTriggers(5, 0) === true, "low roll always triggers at min bps");
  assert(math.rollTriggers(5, 5) === false, "low value rarely triggers");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runEmotionMathTests();
  console.log("emotion_math.test.mjs OK");
}
