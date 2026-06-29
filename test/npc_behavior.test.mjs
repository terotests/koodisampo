import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createGameSession, dispatch, stopGameSession } from "../hosts/terminal/gameHost.mjs";
import { sessionMap } from "../hosts/shared/sessionMap.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const worldJson = readFileSync(
  resolve(__dirname, "../content/worlds/corporate-hq-intro.json"),
  "utf8",
);
const behaviorPackJson = readFileSync(
  resolve(__dirname, "../content/npc-behaviors/pack.json"),
  "utf8",
);

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function floorCoworkers(session, floorIndex) {
  const map = sessionMap(session);
  map.currentFloor = floorIndex;
  map.recomputeSize();
  return map.activeFloor().entities.filter((e) => e.kind === "coworker");
}

function findFollowCandidate(session) {
  for (let f = 0; f < sessionMap(session).floorCount(); f += 1) {
    const hit = floorCoworkers(session, f).find((e) => e.behaviorEligible === "follow_candidate");
    if (hit) return hit;
  }
  return null;
}

export function runNpcBehaviorTests() {
  const { root, session } = createGameSession();
  try {
    dispatch(session, () => {
      session.behaviorSeed = 42;
      session.loadNpcBehaviorsFromText(behaviorPackJson);
      session.loadMapFromText(worldJson);
      session.applyPlayerProfile("Testeri", "cpp");
      session.karma.add("test", 50);
    });

    const candidate = findFollowCandidate(session);
    assert(candidate, "floor 2 should have one follow_candidate coworker");
    assert(candidate.id.startsWith("staff-f2-"), `candidate on floor 2: ${candidate.id}`);

    const seedA = createGameSession();
    try {
      dispatch(seedA.session, () => {
        seedA.session.behaviorSeed = 42;
        seedA.session.loadMapFromText(worldJson);
      });
      const a = findFollowCandidate(seedA.session)?.id;
      dispatch(seedA.session, () => {
        seedA.session.behaviorSeed = 42;
        seedA.session.loadMapFromText(worldJson);
      });
      const b = findFollowCandidate(seedA.session)?.id;
      assert(a === b, "same behaviorSeed should pick same follow candidate");
    } finally {
      stopGameSession(seedA.root, seedA.session);
    }

    dispatch(session, () => {
      session.pendingEntityId = candidate.id;
      session.pendingEntityName = candidate.name;
      session.pendingEntityKind = candidate.kind;
      session.pendingEntityChar = candidate.char;
      session.screen = "encounter";
      session.encounterResult = "quiz";
      session.finishEncounterQuiz(true, "quiz:test", 5, "Hyvä vastaus!");
    });

    const mapAfterQuiz = sessionMap(session);
    const ent = mapAfterQuiz.findEntityById(candidate.id);
    assert(ent.activeBehavior === "follow_admirer", "correct quiz activates follow_admirer");
    assert(ent.moveMode === "follow_player", "follow uses follow_player moveMode");
    assert(ent.behaviorParam >= 3 && ent.behaviorParam <= 5, `follow distance ${ent.behaviorParam}`);

    dispatch(session, () => {
      session.pendingEntityId = candidate.id;
      session.pendingEntityName = candidate.name;
      session.pendingEntityKind = candidate.kind;
      session.pendingEntityChar = candidate.char;
      session.screen = "encounter";
      session.encounterResult = "quiz";
      session.finishEncounterQuiz(false, "", 0, "Väärin.");
    });

    const entAfter = sessionMap(session).findEntityById(candidate.id);
    assert(entAfter.activeBehavior === "", "wrong quiz ends follow state");
    assert(entAfter.moveMode === "schedule", "coworker returns to schedule moveMode");
  } finally {
    stopGameSession(root, session);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runNpcBehaviorTests();
  console.log("npc_behavior.test.mjs OK");
}
