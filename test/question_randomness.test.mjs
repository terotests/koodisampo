import assert from "node:assert/strict";
import {
  pickQuestion,
  listAllQuestions,
  randomEncounterPickNonce,
  ANY_TOPIC_CHANCE,
  _internal,
} from "../hosts/terminal/encounterQuestions.mjs";
import { emptyQuizHistory, recordQuizAnswer } from "../hosts/terminal/quizHistory.mjs";

/**
 * Randomness & coverage test:
 * Verifies that the question selection algorithm provides good variety
 * across many picks and doesn't get stuck or repeat excessively.
 */

const allQ = listAllQuestions();

// 1) Verify new question banks are loaded
assert(allQ.some((q) => q.domain === "robotframework"), "robot framework bank loaded");
assert(allQ.some((q) => q.chapter === "apt"), "apt chapter loaded");
assert(allQ.some((q) => q.id === "jenkins-pipeline-stages"), "jenkins questions loaded");
assert(allQ.some((q) => q.id === "git-cherry-pick-conflict"), "new git questions loaded");

const rfCount = allQ.filter((q) => q.domain === "robotframework").length;
assert(rfCount >= 10, `robot framework has enough questions (${rfCount})`);

const aptCount = allQ.filter((q) => q.chapter === "apt").length;
assert(aptCount >= 8, `apt chapter has enough questions (${aptCount})`);

const gitCount = allQ.filter((q) => q.domain === "git").length;
assert(gitCount >= 15, `git domain has enough questions (${gitCount})`);

// 2) Test randomness: pick 50 questions for a coworker — no excessive repeats
const coworker = { id: "coworker-2-42", kind: "coworker", topic: "git-workflow", char: "W", name: "Kalle" };
let history = emptyQuizHistory();
const pickedIds = [];

for (let i = 0; i < 50; i += 1) {
  const { question } = pickQuestion(coworker, 40 + i, history, { pickNonce: i, deaths: 0 });
  assert(question?.id, `pick ${i} returned a question`);
  pickedIds.push(question.id);
  history = recordQuizAnswer(history, coworker.id, question.id, i % 3 !== 0);
}

// Check variety: unique IDs should be significant portion
const uniqueIds = new Set(pickedIds);
assert(
  uniqueIds.size >= 15,
  `50 picks yielded ${uniqueIds.size} unique questions — expected at least 15 for variety`,
);

// 3) Test that different entity topics bias toward the expected domain, but — since
// ANY_TOPIC_CHANCE (50 %) also allows questions from any topic — not on every single pick.
const topics = [
  { topic: "apt", expectedDomain: "linux" },
  { topic: "rf-basics", expectedDomain: "robotframework" },
  { topic: "git-ci", expectedDomain: "git" },
  { topic: "docker", expectedDomain: "docker" },
  { topic: "systemd", expectedDomain: "linux" },
];

for (const { topic, expectedDomain } of topics) {
  const entity = { id: `coworker-1-${topic}`, kind: "coworker", topic, char: "W", name: "Test" };
  const total = 120;
  let matches = 0;
  for (let nonce = 0; nonce < total; nonce += 1) {
    const { question } = pickQuestion(entity, 50, emptyQuizHistory(), {
      pickNonce: nonce,
      sessionPickSeed: 777,
      deaths: 0,
    });
    if (question.domain === expectedDomain || question.chapter === topic) matches += 1;
  }
  const ratio = matches / total;
  assert(
    ratio >= 0.3,
    `topic '${topic}' should still land on '${expectedDomain}' at least ~30% of the time (got ${(ratio * 100).toFixed(1)}%)`,
  );
  assert(
    ratio <= 0.9,
    `topic '${topic}' should also pick unrelated topics thanks to ANY_TOPIC_CHANCE (got ${(ratio * 100).toFixed(1)}% on-topic — too locked-in)`,
  );
}

// 4) Test that Robot Framework questions are accessible via coworker with rf topic
// (over several picks, since ANY_TOPIC_CHANCE means not every single pick is on-topic)
const rfCoworker = { id: "coworker-rf-1", kind: "coworker", char: "W", name: "RF-pro", topic: "rf-basics" };
let sawRfQuestion = false;
for (let nonce = 0; nonce < 20; nonce += 1) {
  const rfPick = pickQuestion(rfCoworker, 60, emptyQuizHistory(), { pickNonce: nonce, deaths: 0 });
  if (rfPick.question.domain === "robotframework" || rfPick.question.chapter?.startsWith("rf-")) {
    sawRfQuestion = true;
    break;
  }
}
assert(sawRfQuestion, "coworker with rf-basics topic gets RF question at least once in 20 picks");

// 5) Verify no question has duplicate ID across all banks
const allIds = allQ.map((q) => q.id);
const idSet = new Set(allIds);
assert(
  allIds.length === idSet.size,
  `Duplicate question IDs found: ${allIds.length} total vs ${idSet.size} unique`,
);

// 6) Shuffle diversity: pick from same entity many times with nonce variation
const freshCoworker = { id: "coworker-3-55", kind: "coworker", topic: "git-workflow", char: "W", name: "Anna" };
const nonceResults = new Set();
for (let nonce = 0; nonce < 30; nonce += 1) {
  const { question } = pickQuestion(freshCoworker, 50, emptyQuizHistory(), { pickNonce: nonce, deaths: 0 });
  nonceResults.add(question.id);
}
assert(
  nonceResults.size >= 5,
  `30 nonce-varied picks yielded only ${nonceResults.size} unique — expected at least 5`,
);

// 7) Security patrol (Partio): without nonce salt, first pick is always the same
const partio = { id: "editor-police-car-24-3", kind: "security", char: "🚓", name: "Partio" };
const stalePartioPicks = new Set();
for (let i = 0; i < 5; i += 1) {
  const { question } = pickQuestion(partio, 50, emptyQuizHistory(), { pickNonce: 0, deaths: 0 });
  stalePartioPicks.add(question.id);
}
assert(
  stalePartioPicks.size === 1,
  "pickNonce=0 reproduces same Partio question (regression guard)",
);

const partioNoncePicks = new Set();
for (let nonce = 1; nonce <= 10; nonce += 1) {
  const { question } = pickQuestion(partio, 50, emptyQuizHistory(), { pickNonce: nonce, deaths: 0 });
  partioNoncePicks.add(question.id);
}
assert(
  partioNoncePicks.size >= 5,
  `Partio with encounterPickNonce yielded only ${partioNoncePicks.size} unique — expected at least 5`,
);

const randomPartioStarts = new Set();
for (let i = 0; i < 20; i += 1) {
  const { question } = pickQuestion(partio, 50, emptyQuizHistory(), {
    pickNonce: randomEncounterPickNonce(),
    deaths: 0,
  });
  randomPartioStarts.add(question.id);
}
assert(
  randomPartioStarts.size >= 2,
  `randomEncounterPickNonce should vary first Partio question (${randomPartioStarts.size} unique / 20)`,
);

// 8) Ilman historiaa valintapoolin pitäisi tarjota selvästi enemmän kuin 6 uniikkia / 100 arvontaa
const noHistoryTopics = [
  { topic: "tools", minUnique: 20 },
  { topic: "style", minUnique: 15 },
  { topic: "apt", minUnique: 6 },
  { topic: "rf-basics", minUnique: 6 },
];
for (const { topic, minUnique } of noHistoryTopics) {
  const entity = { id: `coworker-4-${topic}`, kind: "coworker", topic, char: "W", name: "Test" };
  const seen = new Set();
  for (let nonce = 1; nonce <= 100; nonce += 1) {
    const { question } = pickQuestion(entity, 50, emptyQuizHistory(), {
      pickNonce: nonce,
      deaths: 0,
      sessionPickSeed: 4242,
      playerSpecialty: "cpp",
    });
    seen.add(question.id);
  }
  assert(
    seen.size >= minUnique,
    `topic '${topic}' without history: ${seen.size} unique / 100 picks — expected at least ${minUnique}`,
  );
}

// 9) Sama pickNonce + sama suola = sama kysymys; eri sessionPickSeed vaihtaa
const stableCoworker = { id: "coworker-5-tools", kind: "coworker", topic: "tools", char: "W", name: "Test" };
const stablePick = pickQuestion(stableCoworker, 50, emptyQuizHistory(), {
  pickNonce: 7,
  sessionPickSeed: 100,
  playerSpecialty: "cpp",
}).question.id;
const stableRepeat = pickQuestion(stableCoworker, 50, emptyQuizHistory(), {
  pickNonce: 7,
  sessionPickSeed: 100,
  playerSpecialty: "cpp",
}).question.id;
const differentSession = pickQuestion(stableCoworker, 50, emptyQuizHistory(), {
  pickNonce: 7,
  sessionPickSeed: 101,
  playerSpecialty: "cpp",
}).question.id;
assert(stablePick === stableRepeat, "same nonce + session seed is deterministic");
assert(stablePick !== differentSession, "sessionPickSeed changes the pick");

// 10) Ei taso-/kokemusrajaa: matalalla karmalla voi tulla vaikea kysymys
const lowKarmaCoworker = { id: "coworker-1-tools", kind: "coworker", topic: "tools", char: "W", name: "Junior" };
let sawHard = false;
for (let nonce = 1; nonce <= 80; nonce += 1) {
  const { question } = pickQuestion(lowKarmaCoworker, 5, emptyQuizHistory(), {
    pickNonce: nonce,
    sessionPickSeed: 9001,
    playerSpecialty: "cpp",
  });
  if (question.difficulty >= 4) {
    sawHard = true;
    break;
  }
}
assert(sawHard, "low karma coworker should still receive difficulty 4+ questions");

// 11) "Mistä vain aiheesta" -sekoitus: NPC:n oman aiheen kysymyksiä TAI ihan minkä
// tahansa aiheen kysymyksiä pitäisi tulla suunnilleen ANY_TOPIC_CHANCE-osuudella.
// Tarkistus koko kysymyspankin laajuudella (ei vain 1-2 domainia), jotta nähdään
// että jakauma on lähellä 50 % eikä esim. topic-painotus dominoi silti.
{
  assert.equal(ANY_TOPIC_CHANCE, 0.5, "any-topic chance should be exactly 50%");

  const domainCoverageEntity = { id: "coworker-domain-coverage", kind: "coworker", topic: "tools", char: "W", name: "Domainit" };
  const total = 400;
  const domainsSeen = new Set();
  let cppOnTopic = 0;
  for (let nonce = 0; nonce < total; nonce += 1) {
    const { question } = pickQuestion(domainCoverageEntity, 50, emptyQuizHistory(), {
      pickNonce: nonce,
      sessionPickSeed: 3131,
      deaths: 0,
    });
    domainsSeen.add(question.domain);
    if (question.domain === "cpp") cppOnTopic += 1;
  }
  // NPC:n oma topic on cpp/tools — koko pankin domainit (linux, docker, scrum, git, ...)
  // pitäisi silti näkyä ANY_TOPIC_CHANCE:n ansiosta, ei vain cpp.
  assert(
    domainsSeen.size >= 6,
    `50/50-sekoituksella pitäisi nähdä kysymyksiä monesta domainista, nähty: ${[...domainsSeen].join(", ")}`,
  );
  const cppRatio = cppOnTopic / total;
  assert(
    cppRatio > 0.35 && cppRatio < 0.85,
    `cpp-osuuden pitäisi olla lähellä 50 % + pieni ylimäärä, oli ${(cppRatio * 100).toFixed(1)}%`,
  );
}

// 12) Hash-pohjaisen indeksivalitsimen jakaumatasaisuus (matemaattinen tasaisuus).
// pickQuestion() yhdistää tarkoituksella kaksi eri kokoista poolia (topic-painotettu +
// "mistä vain"), jolloin lopulliset kysymys-ID:t EIVÄT ole tasajakautuneita keskenään —
// se on tarkoituksellista (ks. testi 11). Sen sijaan testataan suoraan pickIndexFromPool()-
// funktion sisäistä hashString(salt) % pool.length -mekanismia, joka on se osa joka
// vastaa "onko satunnaisgeneraattori/seed tasainen" -kysymykseen.
{
  const { pickIndexFromPool, hashString } = _internal;

  // Käytetään alkulukukokoista poolia (37) jotta modulo-vinouma näkyisi jos sitä olisi.
  const poolSize = 37;
  const fakePool = Array.from({ length: poolSize }, (_, i) => ({ q: { id: `q${i}` } }));
  const counts = new Array(poolSize).fill(0);
  const totalSalts = 200000;
  for (let i = 0; i < totalSalts; i += 1) {
    const idx = pickIndexFromPool(fakePool, `salt-${i}:${i * 7919}`);
    counts[idx] += 1;
  }
  const expected = totalSalts / poolSize;
  const maxDeviation = Math.max(...counts.map((c) => Math.abs(c - expected)));
  const relativeDeviation = maxDeviation / expected;
  assert(
    relativeDeviation < 0.05,
    `pickIndexFromPool ei ole tasajakautunut ${poolSize}-kokoisella poolilla: suurin poikkeama ${(relativeDeviation * 100).toFixed(2)}% odotusarvosta ${expected.toFixed(0)} (raja 5%)`,
  );

  // hashString():n koko 32-bittinen tulosavaruus — modulo-vinouma pienelle poolille pitäisi
  // olla häviävän pieni (< poolSize / 2^32), joten se ei näy käytännössä millään otoskoolla.
  assert(
    typeof hashString("koodisampo") === "number" && hashString("koodisampo") >= 0 && hashString("koodisampo") < 4294967296,
    "hashString palauttaa 32-bittisen etumerkittömän kokonaisluvun",
  );
  assert(
    hashString("a") !== hashString("b"),
    "hashString erottaa eri syötteet (ei degeneroitunut vakiofunktio)",
  );
}

console.log("question_randomness.test.mjs OK");
console.log(`  Total questions: ${allQ.length}`);
console.log(`  Robot Framework: ${rfCount}`);
console.log(`  apt: ${aptCount}`);
console.log(`  git: ${gitCount}`);
console.log(`  50-pick variety: ${uniqueIds.size} unique out of 50`);
console.log(`  Nonce variety: ${nonceResults.size} unique out of 30`);
