#!/usr/bin/env node
/**
 * Aja JSON-skenaario Ranger-simulaattorilla.
 *
 *   node scripts/run-scenario.mjs content/scenarios/courtyard-move.json
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createGameSimulator } from "../hosts/shared/gameSimulator.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function evalAssert(snap, assert, label) {
  const failures = [];
  if (assert.floor != null && snap.floor !== assert.floor) {
    failures.push(`floor expected ${assert.floor}, got ${snap.floor}`);
  }
  if (assert.playerX != null && snap.player.x !== assert.playerX) {
    failures.push(`player.x expected ${assert.playerX}, got ${snap.player.x}`);
  }
  if (assert.playerXMin != null && snap.player.x < assert.playerXMin) {
    failures.push(`player.x expected >= ${assert.playerXMin}, got ${snap.player.x}`);
  }
  if (assert.playerY != null && snap.player.y !== assert.playerY) {
    failures.push(`player.y expected ${assert.playerY}, got ${snap.player.y}`);
  }
  if (assert.clockMinutes != null && snap.clockMinutes !== assert.clockMinutes) {
    failures.push(`clockMinutes expected ${assert.clockMinutes}, got ${snap.clockMinutes}`);
  }
  if (assert.clockMinutesMin != null && snap.clockMinutes < assert.clockMinutesMin) {
    failures.push(`clockMinutes expected >= ${assert.clockMinutesMin}, got ${snap.clockMinutes}`);
  }
  if (assert.screen != null && snap.screen !== assert.screen) {
    failures.push(`screen expected ${assert.screen}, got ${snap.screen}`);
  }
  if (assert.onElevator != null && snap.onElevator !== assert.onElevator) {
    failures.push(`onElevator expected ${assert.onElevator}, got ${snap.onElevator}`);
  }
  if (assert.interviewPassed != null && snap.interviewPassed !== assert.interviewPassed) {
    failures.push(`interviewPassed expected ${assert.interviewPassed}, got ${snap.interviewPassed}`);
  }
  if (assert.karmaMin != null && snap.karma < assert.karmaMin) {
    failures.push(`karma expected >= ${assert.karmaMin}, got ${snap.karma}`);
  }
  return {
    id: label,
    ok: failures.length === 0,
    failures,
  };
}

export function runScenario(scenarioPath, options = {}) {
  const scenario = loadJson(scenarioPath);
  const worldFile = scenario.world ?? "corporate-hq-intro.json";
  const worldPath = join(projectRoot, "content/worlds", worldFile);
  if (!existsSync(worldPath)) {
    throw new Error(`World not found: ${worldPath}`);
  }
  const worldJson = readFileSync(worldPath, "utf8");

  const sim = createGameSimulator(worldJson);
  const assertions = [];

  try {
    const setup = {
      id: scenario.id ?? "unnamed",
      seed: scenario.seed ?? 1,
      ...scenario.setup,
    };
    sim.bootstrap(setup);

    let stepIndex = 0;
    for (const action of scenario.script ?? []) {
      if (action.assert) {
        const snap = sim.snapshot();
        const result = evalAssert(snap, action.assert, `step-${stepIndex}`);
        assertions.push(result);
        if (!result.ok && !options.continueOnFail) {
          break;
        }
        stepIndex += 1;
        continue;
      }

      if (action.tick != null) {
        sim.step({ tick: action.tick });
      } else if (action.move) {
        const repeat = action.repeat ?? 1;
        for (let i = 0; i < repeat; i += 1) {
          sim.step({ move: action.move });
        }
      } else if (action.key) {
        sim.step({ key: action.key });
      } else {
        throw new Error(`Unknown script action at index ${stepIndex}: ${JSON.stringify(action)}`);
      }
      stepIndex += 1;
    }

    const report = sim.report();
    report.assertions = assertions;
    report.outcome = assertions.every((a) => a.ok) ? "pass" : "fail";
    if (report.errors?.length > 0) {
      report.outcome = "error";
    }

    return { scenario, snapshot: sim.snapshot(), report };
  } finally {
    sim.stop();
  }
}

function formatMarkdown(result) {
  const { scenario, report } = result;
  const lines = [
    `## ${scenario.id} (seed=${scenario.seed ?? 1})`,
    `- **Tulos:** ${report.outcome.toUpperCase()} (${report.steps} askelta, ${report.simMinutes} sim-min)`,
    `- **RNG seed:** ${report.rngSeed}`,
  ];
  if (report.assertions?.length) {
    lines.push("- **Assertiot:**");
    for (const a of report.assertions) {
      lines.push(`  - ${a.ok ? "✓" : "✗"} ${a.id}${a.failures?.length ? `: ${a.failures.join("; ")}` : ""}`);
    }
  }
  if (report.errors?.length) {
    lines.push(`- **Virheet:** ${report.errors.join("; ")}`);
  }
  return lines.join("\n");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const scenarioPath = process.argv[2];
  if (!scenarioPath) {
    console.error("Usage: node scripts/run-scenario.mjs <scenario.json>");
    process.exit(1);
  }
  const abs = resolve(process.cwd(), scenarioPath);
  const result = runScenario(abs);
  if (process.argv.includes("--md")) {
    console.log(formatMarkdown(result));
  } else {
    console.log(JSON.stringify(result.report, null, 2));
  }
  if (result.report.outcome !== "pass") {
    process.exit(1);
  }
}
