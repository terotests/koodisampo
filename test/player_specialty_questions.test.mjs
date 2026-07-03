import { pickQuestion } from "../hosts/terminal/encounterQuestions.mjs";
import { emptyQuizHistory } from "../hosts/terminal/quizHistory.mjs";
import { assert } from "./support/gameTestHarness.mjs";

const receptionist = { id: "receptionist", name: "Vastaanottovirkailija", char: "S", kind: "role" };
const guru = { id: "mentor", kind: "guru", name: "Senior-guru" };
const hostile = { id: "hostile-1", kind: "hostile", name: "Legacy-guard" };
const coworker = { id: "staff-1", kind: "coworker", name: "Kollega", topic: "" };

function pickFor(entity, specialty, pickNonce = 1) {
  return pickQuestion(entity, 50, emptyQuizHistory(), { pickNonce, playerSpecialty: specialty }).question;
}

const jsInterview = pickFor(receptionist, "javascript");
assert(jsInterview.domain === "javascript", `JS interview should pick javascript, got ${jsInterview.domain}`);

const cppInterview = pickFor(receptionist, "cpp");
assert(cppInterview.domain === "cpp", `C++ interview should pick cpp, got ${cppInterview.domain}`);

const jsGuru = pickFor(guru, "javascript");
assert(jsGuru.domain === "javascript", `JS guru should pick javascript, got ${jsGuru.domain}`);

let hostilePickedJs = false;
for (let nonce = 0; nonce < 30; nonce += 1) {
  if (pickFor(hostile, "javascript", nonce).domain === "javascript") {
    hostilePickedJs = true;
    break;
  }
}
assert(hostilePickedJs, "JS specialty should pick javascript for hostile encounters");

const jsCoworker = pickFor(coworker, "javascript", 5);
assert(jsCoworker.domain === "javascript", `JS coworker without topic should prefer javascript, got ${jsCoworker.domain}`);

const cppTopicCoworker = { ...coworker, id: "staff-cpp", topic: "tools" };
let cppTopicPickedJs = 0;
for (let nonce = 0; nonce < 30; nonce += 1) {
  if (pickFor(cppTopicCoworker, "javascript", nonce).domain === "javascript") {
    cppTopicPickedJs += 1;
  }
}
assert(
  cppTopicPickedJs === 30,
  `JS specialty should override C++ coworker topic, got ${cppTopicPickedJs}/30 javascript`,
);

const dockerTopicCoworker = { ...coworker, id: "staff-docker", topic: "docker-network" };
const jsDockerPick = pickFor(dockerTopicCoworker, "javascript", 3);
assert(
  jsDockerPick.domain === "docker",
  `JS player should still get docker from docker-topic coworker, got ${jsDockerPick.domain}`,
);

const scrumTopicCoworker = { ...coworker, id: "staff-scrum", topic: "scrum-estimation" };
const jsScrumPick = pickFor(scrumTopicCoworker, "javascript", 4);
assert(
  jsScrumPick.domain === "scrum",
  `JS player should still get scrum from scrum-topic coworker, got ${jsScrumPick.domain}`,
);

const dockerTopicPick = pickFor(dockerTopicCoworker, "docker", 3);
assert(
  dockerTopicPick.domain === "docker",
  `docker specialty should pick docker even when coworker topic differs, got ${dockerTopicPick.domain}`,
);

console.log("player_specialty_questions.test.mjs OK");
