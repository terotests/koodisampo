import { pickQuestion, ANY_TOPIC_CHANCE } from "../hosts/terminal/encounterQuestions.mjs";
import { emptyQuizHistory } from "../hosts/terminal/quizHistory.mjs";
import { assert } from "./support/gameTestHarness.mjs";

/**
 * pickQuestion() sekoittaa nykyään tarkoituksella ANY_TOPIC_CHANCE:n (oletus 50 %)
 * verran kysymyksiä ihan mistä vain aiheesta, jotta samat kysymykset eivät toistu
 * pelistä toiseen. Tämän takia pelaajan erikoisalue (playerSpecialty) ei enää sanele
 * joka ainoaa yksittäistä poimintaa — se näkyy nyt selvänä enemmistönä useiden
 * poimintojen yli, ei 100 % lukituksena.
 *
 * NPC:n oma entity.topic-kenttä (esim. coworkerin "docker-network") EI ENÄÄ vaikuta
 * kysymysvalintaan lainkaan — se poistettiin audienceTags()-funktiosta kokonaan, koska
 * se lukitsi kysymykset liian voimakkaasti NPC:n omaan aiheeseen. Vain pelaajan itse
 * valitsema erikoisala (playerSpecialty) painottaa poimintaa, ja sekin vain
 * ANY_TOPIC_CHANCE:n verran.
 */

const receptionist = { id: "receptionist", name: "Vastaanottovirkailija", char: "S", kind: "role" };
const guru = { id: "mentor", kind: "guru", name: "Senior-guru" };
const hostile = { id: "hostile-1", kind: "hostile", name: "Legacy-guard" };
const coworker = { id: "staff-1", kind: "coworker", name: "Kollega", topic: "" };

function pickFor(entity, specialty, pickNonce = 1) {
  return pickQuestion(entity, 50, emptyQuizHistory(), { pickNonce, playerSpecialty: specialty }).question;
}

function domainRatio(entity, specialty, domain, total = 200) {
  let hits = 0;
  for (let nonce = 0; nonce < total; nonce += 1) {
    if (pickFor(entity, specialty, nonce).domain === domain) hits += 1;
  }
  return hits / total;
}

// Odotettu vähimmäisosuus: ANY_TOPIC_CHANCE takaa n. (1 - ANY_TOPIC_CHANCE) osuuden
// varmaa erikoisalue-osumaa, plus satunnaisen lisän "mistä vain" -poolista.
// Käytetään reilua turvamarginaalia lipsahdusten (flaky) välttämiseksi.
const MIN_BIASED_RATIO = 0.3;
const MAX_BIASED_RATIO = 0.95; // ei saa olla enää 100 %-varma — mixiä pitää näkyä
// NPC:n oma topic ei saa enää nostaa toisen domainin osumaa merkittävästi yli
// kysymyspankin luonnollisen perustason, kun pelaajan erikoisala on jotain muuta.
const MAX_REMOVED_TOPIC_BIAS = 0.25;

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

// entity.topic on nykyään puhtaasti kosmeettinen kenttä kysymysvalinnan kannalta —
// coworkerin oma "tools"/"docker-network"/"scrum-estimation" -topic ei enää vaikuta
// pisteytykseen ollenkaan. Alla varmistetaan että pelaajan erikoisala käyttäytyy
// samoin kuin ilman topicia, ja että NPC:n oma (aiemmin bias-lähteenä toiminut) topic
// EI enää nosta oman domaininsa osumaa yli luonnollisen perustason.

const cppTopicCoworker = { ...coworker, id: "staff-cpp", topic: "tools" };
const cppTopicJsRatio = domainRatio(cppTopicCoworker, "javascript", "javascript");
assert(
  cppTopicJsRatio >= MIN_BIASED_RATIO,
  `JS specialty should pick javascript regardless of coworker's own (now-ignored) C++ topic, got ${(cppTopicJsRatio * 100).toFixed(0)}%`,
);
assert(
  cppTopicJsRatio <= MAX_BIASED_RATIO,
  `JS specialty should still leave room for ANY_TOPIC_CHANCE mix, got ${(cppTopicJsRatio * 100).toFixed(0)}% locked`,
);

const dockerTopicCoworker = { ...coworker, id: "staff-docker", topic: "docker-network" };
const jsOverDockerTopicRatio = domainRatio(dockerTopicCoworker, "javascript", "javascript");
assert(
  jsOverDockerTopicRatio >= MIN_BIASED_RATIO,
  `JS specialty should dominate even on a docker-topic coworker now that entity.topic is ignored, got ${(jsOverDockerTopicRatio * 100).toFixed(0)}%`,
);
const dockerLeakRatio = domainRatio(dockerTopicCoworker, "javascript", "docker");
assert(
  dockerLeakRatio <= MAX_REMOVED_TOPIC_BIAS,
  `coworker's own docker topic should NOT bias toward docker anymore (JS specialty in play), got ${(dockerLeakRatio * 100).toFixed(0)}% docker`,
);

const scrumTopicCoworker = { ...coworker, id: "staff-scrum", topic: "scrum-estimation" };
const jsOverScrumTopicRatio = domainRatio(scrumTopicCoworker, "javascript", "javascript");
assert(
  jsOverScrumTopicRatio >= MIN_BIASED_RATIO,
  `JS specialty should dominate even on a scrum-topic coworker now that entity.topic is ignored, got ${(jsOverScrumTopicRatio * 100).toFixed(0)}%`,
);
const scrumLeakRatio = domainRatio(scrumTopicCoworker, "javascript", "scrum");
assert(
  scrumLeakRatio <= MAX_REMOVED_TOPIC_BIAS,
  `coworker's own scrum topic should NOT bias toward scrum anymore (JS specialty in play), got ${(scrumLeakRatio * 100).toFixed(0)}% scrum`,
);

// Kun pelaajan erikoisala JA coworkerin (nykyään merkityksettömäksi tehty) topic
// sattuvat osumaan yhteen, tulos on tietenkin edelleen sama domain — tässä ei ole
// ristiriitaa testattavaksi, mutta varmistetaan ettei mikään mene rikki.
const dockerSpecialtyRatio = domainRatio(dockerTopicCoworker, "docker", "docker");
assert(
  dockerSpecialtyRatio >= MIN_BIASED_RATIO,
  `docker specialty should mostly pick docker, got ${(dockerSpecialtyRatio * 100).toFixed(0)}%`,
);

// ANY_TOPIC_CHANCE:n olemassaolo pitäisi näkyä myös suoraan: erikoisalueen kanssa
// ristiriitaisesta (nyt merkityksettömästä) topicista pitäisi silti nähdä muitakin
// domaineja kuin vain erikoisala.
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
