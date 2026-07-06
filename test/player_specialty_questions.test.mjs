import { pickQuestion, ANY_TOPIC_CHANCE } from "../hosts/terminal/encounterQuestions.mjs";
import { emptyQuizHistory } from "../hosts/terminal/quizHistory.mjs";
import { assert } from "./support/gameTestHarness.mjs";

/**
 * pickQuestion() sekoittaa nykyään tarkoituksella ANY_TOPIC_CHANCE:n (oletus 50 %)
 * verran kysymyksiä ihan mistä vain aiheesta, jotta samat kysymykset eivät toistu
 * pelistä toiseen. Tämän takia pelaajan erikoisalue (playerSpecialty) tai NPC:n oma
 * topic EIVÄT enää sanele joka ainoaa yksittäistä poimintaa — ne näkyvät nyt selvänä
 * enemmistönä useiden poimintojen yli, eivät 100 % lukituksena.
 */

const receptionist = { id: "receptionist", name: "Vastaanottovirkailija", char: "S", kind: "role" };
const guru = { id: "mentor", kind: "guru", name: "Senior-guru" };
const hostile = { id: "hostile-1", kind: "hostile", name: "Legacy-guard" };
const coworker = { id: "staff-1", kind: "coworker", name: "Kollega", topic: "" };

function pickFor(entity, specialty, pickNonce = 1) {
  return pickQuestion(entity, 50, emptyQuizHistory(), { pickNonce, playerSpecialty: specialty }).question;
}

function domainRatio(entity, specialty, domain, total = 120) {
  let hits = 0;
  for (let nonce = 0; nonce < total; nonce += 1) {
    if (pickFor(entity, specialty, nonce).domain === domain) hits += 1;
  }
  return hits / total;
}

// Odotettu vähimmäisosuus: ANY_TOPIC_CHANCE takaa n. (1 - ANY_TOPIC_CHANCE) osuuden
// varmaa erikoisalue/topic-osumaa, plus satunnaisen lisän "mistä vain" -poolista.
// Käytetään reilua turvamarginaalia lipsahdusten (flaky) välttämiseksi.
const MIN_BIASED_RATIO = 0.3;
const MAX_BIASED_RATIO = 0.95; // ei saa olla enää 100 %-varma — mixiä pitää näkyä

const jsInterviewRatio = domainRatio(receptionist, "javascript", "javascript");
assert(
  jsInterviewRatio >= MIN_BIASED_RATIO,
  `JS interview should mostly pick javascript, got ${(jsInterviewRatio * 100).toFixed(0)}%`,
);
assert(
  jsInterviewRatio <= MAX_BIASED_RATIO,
  `JS interview should also vary thanks to ANY_TOPIC_CHANCE, got ${(jsInterviewRatio * 100).toFixed(0)}% locked`,
);

const cppInterviewRatio = domainRatio(receptionist, "cpp", "cpp");
assert(
  cppInterviewRatio >= MIN_BIASED_RATIO,
  `C++ interview should mostly pick cpp, got ${(cppInterviewRatio * 100).toFixed(0)}%`,
);

const jsGuruRatio = domainRatio(guru, "javascript", "javascript");
assert(
  jsGuruRatio >= MIN_BIASED_RATIO,
  `JS guru should mostly pick javascript, got ${(jsGuruRatio * 100).toFixed(0)}%`,
);

let hostilePickedJs = false;
for (let nonce = 0; nonce < 30; nonce += 1) {
  if (pickFor(hostile, "javascript", nonce).domain === "javascript") {
    hostilePickedJs = true;
    break;
  }
}
assert(hostilePickedJs, "JS specialty should pick javascript for hostile encounters");

const jsCoworkerRatio = domainRatio(coworker, "javascript", "javascript");
assert(
  jsCoworkerRatio >= MIN_BIASED_RATIO,
  `JS coworker without topic should mostly prefer javascript, got ${(jsCoworkerRatio * 100).toFixed(0)}%`,
);

const cppTopicCoworker = { ...coworker, id: "staff-cpp", topic: "tools" };
const cppTopicJsRatio = domainRatio(cppTopicCoworker, "javascript", "javascript");
assert(
  cppTopicJsRatio >= MIN_BIASED_RATIO,
  `JS specialty should mostly override C++ coworker topic, got ${(cppTopicJsRatio * 100).toFixed(0)}% javascript`,
);
assert(
  cppTopicJsRatio <= MAX_BIASED_RATIO,
  `JS-over-C++-topic should still leave room for ANY_TOPIC_CHANCE mix, got ${(cppTopicJsRatio * 100).toFixed(0)}% locked`,
);

const dockerTopicCoworker = { ...coworker, id: "staff-docker", topic: "docker-network" };
const jsDockerRatio = domainRatio(dockerTopicCoworker, "javascript", "docker");
assert(
  jsDockerRatio >= MIN_BIASED_RATIO,
  `JS player should mostly still get docker from docker-topic coworker, got ${(jsDockerRatio * 100).toFixed(0)}%`,
);

const scrumTopicCoworker = { ...coworker, id: "staff-scrum", topic: "scrum-estimation" };
const jsScrumRatio = domainRatio(scrumTopicCoworker, "javascript", "scrum");
assert(
  jsScrumRatio >= MIN_BIASED_RATIO,
  `JS player should mostly still get scrum from scrum-topic coworker, got ${(jsScrumRatio * 100).toFixed(0)}%`,
);

const dockerTopicRatio = domainRatio(dockerTopicCoworker, "docker", "docker");
assert(
  dockerTopicRatio >= MIN_BIASED_RATIO,
  `docker specialty should mostly pick docker even when coworker topic differs, got ${(dockerTopicRatio * 100).toFixed(0)}%`,
);

// ANY_TOPIC_CHANCE:n olemassaolo pitäisi näkyä myös suoraan: erikoisalueen kanssa
// ristiriitaisesta topicista pitäisi silti nähdä muitakin domaineja kuin vain
// erikoisalue + coworkerin oma topic.
{
  const seenDomains = new Set();
  for (let nonce = 0; nonce < 150; nonce += 1) {
    seenDomains.add(pickFor(cppTopicCoworker, "javascript", nonce).domain);
  }
  assert(
    seenDomains.size >= 3,
    `ANY_TOPIC_CHANCE (${ANY_TOPIC_CHANCE}) pitäisi tuoda muitakin domaineja kuin javascript/cpp, nähty: ${[...seenDomains].join(", ")}`,
  );
}

console.log("player_specialty_questions.test.mjs OK");
