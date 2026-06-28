import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createGameSession, dispatch, stopGameSession } from "../hosts/terminal/gameHost.mjs";
import { assert } from "./support/gameTestHarness.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const require = createRequire(import.meta.url);
const { WorldClock } = require(resolve(projectRoot, "generated/es6/koodisampo.cjs"));

export function runWorldClockTests() {
  const clock = new WorldClock();

  assert(clock.gameMinutes === 480, "default start 08:00");
  assert(clock.formatTime() === "08:00", "formatTime at start");
  assert(clock.phaseLabel() === "aamu", "morning phase");

  clock.setGameMinutes(660);
  assert(clock.gameMinutes === 660, "setGameMinutes forward");
  assert(clock.phaseLabel() === "lounas", "lunch phase");

  clock.setGameMinutes(480);
  assert(clock.gameMinutes === 480, "setGameMinutes backward");
  assert(clock.phaseLabel() === "aamu", "back to morning");

  clock.setGameMinutes(900);
  assert(clock.phaseLabel() === "lähtöaika", "departure phase");

  clock.setGameMinutes(-5);
  assert(clock.gameMinutes === 0, "negative clamps to 0");

  clock.setGameMinutes(1079);
  clock.advance(2);
  assert(clock.gameMinutes === 480, "advance wraps day at 1080");

  clock.setGameMinutes(500);
  clock.advance(30);
  assert(clock.gameMinutes === 530, "advance adds delta");

  clock.setGameMinutes(600);
  const spent = clock.spendTime(10);
  assert(spent === 10, "spendTime returns minutes");
  assert(clock.gameMinutes === 610, "spendTime advances clock");
  assert(clock.lastSpentMinutes === 10, "lastSpentMinutes tracked");

  const { root, session } = createGameSession();
  dispatch(session, () => {
    session.worldClock.setGameMinutes(780);
    assert(session.worldClock.phaseLabel() === "iltapäivä", "session clock settable");
    session.worldClock.setGameMinutes(1020);
    assert(session.worldClock.phaseLabel() === "tyhjä toimisto", "empty office phase");
  });
  stopGameSession(root, session);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runWorldClockTests();
  console.log("world clock tests OK");
}
