import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { sessionMap } from "../shared/sessionMap.mjs";
import {
  buildAskColleagueLine,
  buildAskColleagueReply,
  buildCoworkerWrongReaction,
} from "./staffRoster.mjs";
import {
  getAskedQuestionIds,
  getGlobalAskedQuestionIds,
  getRecentQuestionIds,
} from "./quizHistory.mjs";
import { shuffleChoices } from "./shuffleChoices.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const banksDir = resolve(__dirname, "../../content/question-banks");

let cachedQuestions = null;
/** @type {null | (() => import("./encounterQuestions.mjs").listAllQuestions extends () => infer R ? R : never)} */
let externalQuestionLoader = null;

/** Inject question bank loader (browser static build). Clears cache. */
export function setQuestionLoader(loader) {
  externalQuestionLoader = loader;
  cachedQuestions = null;
}

function loadAllQuestions() {
  if (cachedQuestions) return cachedQuestions;
  if (externalQuestionLoader) {
    cachedQuestions = externalQuestionLoader();
    return cachedQuestions;
  }
  const files = readdirSync(banksDir).filter((f) => f.endsWith(".json"));
  const all = [];
  for (const file of files) {
    const bank = JSON.parse(readFileSync(resolve(banksDir, file), "utf8"));
    const domain = bank.domain || bank.id?.split("-")[0] || "general";
    for (const q of bank.questions || []) {
      all.push({
        ...q,
        domain: q.domain || domain,
        bankId: bank.id,
        bankSource: bank.source,
      });
    }
  }
  cachedQuestions = all;
  return all;
}

function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Satunnainen alkuarvo uuden pelin kysymysvalinnalle (Partio, kollegat, …). */
export function randomEncounterPickNonce() {
  return ((Date.now() ^ ((Math.random() * 0x7fffffff) | 0)) >>> 0) % 2147483646 + 1;
}

function floorFromEntity(entity) {
  const m = entity?.id?.match(/(?:coworker|ceo|security)-(\d+)-/);
  if (m) return Number(m[1]);
  return 0;
}

/** Vaikeus nousee kerroksen ja karman mukaan — pohja vähintään 3. */
function targetDifficulty(entity, karmaTotal) {
  const floor = floorFromEntity(entity);
  let diff = 3;
  if (floor >= 2) diff = 4;
  if (floor >= 5) diff = 5;
  if (karmaTotal >= 80) diff = Math.min(5, diff + 1);
  if (karmaTotal < 20) diff = Math.max(2, diff - 1);
  return diff;
}

const TOPIC_DOMAINS = {
  tools: "cpp",
  style: "cpp",
  safety: "cpp",
  maintainability: "cpp",
  performance: "cpp",
  portability: "cpp",
  threadability: "cpp",
  correctness: "cpp",
  "scrum-dod": "scrum",
  "scrum-dor": "scrum",
  "scrum-estimation": "scrum",
  "scrum-sprint": "scrum",
  "scrum-team": "scrum",
  systemd: "linux",
  journald: "linux",
  "linux-network": "linux",
  avahi: "linux",
  apt: "linux",
  docker: "docker",
  "docker-network": "docker",
  "docker-volumes": "docker",
  "qt-widgets": "qt",
  "qt-signals": "qt",
  "qt-threading": "qt",
  "qt-models": "qt",
  "qt-opengl": "qt",
  "qt-shaders": "qt",
  "js-async": "javascript",
  "js-types": "javascript",
  "js-modules": "javascript",
  "js-runtime": "javascript",
  "pg-indexes": "postgres",
  "pg-explain": "postgres",
  "pg-vacuum": "postgres",
  "pg-config": "postgres",
  "pg-query-design": "postgres",
  "pg-cte-window": "postgres",
  "pg-joins": "postgres",
  "pg-json": "postgres",
  "pg-sql-security": "postgres",
  "cpp-production": "cpp",
  "docker-production": "docker",
  "js-typescript": "javascript",
  "git-workflow": "git",
  "git-ci": "git",
  "backend-data": "backend",
  "backend-api": "backend",
  "ops-incident": "backend",
  "web-security": "security",
  "rf-basics": "robotframework",
  "rf-web": "robotframework",
  "rf-execution": "robotframework",
  "rf-advanced": "robotframework",
};

function audienceTags(entity, playerSpecialty = "") {
  if (entity.id === "receptionist") {
    return {
      tags: ["interview", "secretary", "coworker", "guru"],
      voice: "interview",
      preferDomain: "cpp",
      minDifficulty: 1,
    };
  }
  if (entity.id?.startsWith("ceo-")) {
    return { tags: ["ceo"], voice: "executive", preferDomain: "scrum", minDifficulty: 4 };
  }
  if (entity.kind === "security") {
    return {
      tags: ["security"],
      voice: "security",
      preferDomain: "security",
      preferDomains: ["security", "linux", "docker", "backend"],
      preferChapters: ["web-security", "linux-network", "journald", "docker-network", "docker-production", "avahi"],
      minDifficulty: 3,
    };
  }
  if (entity.kind === "guru") {
    return {
      tags: ["guru"],
      voice: "mentor",
      preferDomain: "cpp",
      minDifficulty: 3,
    };
  }
  if (entity.kind === "hostile") {
    return {
      tags: ["hostile"],
      voice: "hostile",
      preferDomains: ["cpp", "docker"],
      minDifficulty: 4,
    };
  }
  if (entity.kind === "role") {
    if (entity.char === "S") {
      return {
        tags: ["secretary"],
        voice: "secretary",
        preferDomain: "scrum",
        preferChapters: ["scrum-dor", "scrum-dod"],
        minDifficulty: 3,
      };
    }
    if (entity.char === "P") {
      return {
        tags: ["project-lead"],
        voice: "project-lead",
        preferDomain: "scrum",
        minDifficulty: 4,
      };
    }
    if (entity.char === "C") {
      return { tags: ["ceo"], voice: "executive", preferDomain: "scrum", minDifficulty: 4 };
    }
  }
  if (entity.kind === "coworker") {
    const topic = entity.topic || "";
    const preferDomain = TOPIC_DOMAINS[topic] || "";
    return {
      tags: ["coworker"],
      voice: "colleague",
      preferChapter: topic,
      preferDomain: preferDomain || playerSpecialty || "",
      playerSpecialty,
      minDifficulty: 3,
    };
  }
  const base = { tags: ["coworker"], voice: "colleague", playerSpecialty, minDifficulty: 3 };
  if (playerSpecialty && !base.preferDomain) {
    base.preferDomain = playerSpecialty;
  }
  return base;
}

const VOICES = {
  colleague: (name, prompt, ctx) => {
    if (ctx.domain === "scrum") {
      return `${name} avaa Jira-ticketin: "Ennen groomingia — ${prompt}"`;
    }
    if (ctx.domain === "linux") {
      return `${name} jakaa terminaalin: "Prod on punainen — ${prompt}"`;
    }
    if (ctx.domain === "docker") {
      return `${name} näyttää compose-logia: "${prompt}"`;
    }
    if (ctx.domain === "qt") {
      return `${name} jakaa Qt Creatorin: "UI-review — ${prompt}"`;
    }
    if (ctx.domain === "javascript") {
      return `${name} avaa devtools-konsolin: "${prompt}"`;
    }
    if (ctx.domain === "postgres") {
      return `${name} jakaa pgAdminin: "Kysely hidastaa prodia — ${prompt}"`;
    }
    if (ctx.domain === "git") {
      return `${name} avaa PR:n kommentit: "Ennen mergeä — ${prompt}"`;
    }
    if (ctx.domain === "backend") {
      return `${name} katsoo Grafana-dashboardia: "Incident review — ${prompt}"`;
    }
    if (ctx.domain === "security") {
      return `${name} auditoi API:a: "${prompt}"`;
    }
    if (ctx.domain === "robotframework") {
      return `${name} avaa Robot Framework -lokin: "Testiraportti punainen — ${prompt}"`;
    }
    return `${name} kysyy koodikatselmassa (${ctx.topicLabel}): "${prompt}"`;
  },
  security: (name, prompt) =>
    `${name} auditoi infraa: "Ennen kuin pääset läpi — ${prompt}"`,
  mentor: (name, prompt) => `${name} nostaa katseensa reviewstä: "${prompt}"`,
  executive: (name, prompt) =>
    `${name} pysäyttää sinut: "Strateginen tarkistus — ${prompt}"`,
  hostile: (name, prompt) =>
    `${name} murisee: "Todista osaaminen — ${prompt}"`,
  secretary: (name, prompt) =>
    `${name} täyttää lomaketta: "Merkitse oikea vastaus — ${prompt}"`,
  interview: (name, prompt) =>
    `${name} katsoo hakemustasi: "Haastattelukysymys — ${prompt}"`,
  "project-lead": (name, prompt) =>
    `${name} sprinttikatselmossa: "${prompt}"`,
};

const TOPIC_LABELS = {
  tools: "C++ työkalut",
  style: "C++ tyyli",
  safety: "C++ turvallisuus",
  maintainability: "ylläpidettävyys",
  performance: "suorituskyky",
  "scrum-dod": "Definition of Done",
  "scrum-dor": "Definition of Ready",
  "scrum-estimation": "estimointi",
  "scrum-sprint": "sprintti",
  "scrum-team": "tiimi",
  systemd: "systemd",
  journald: "journald",
  "linux-network": "verkko",
  avahi: "Avahi/mDNS",
  apt: "apt/dpkg",
  docker: "Docker",
  "docker-network": "Docker-verkot",
  "docker-volumes": "Docker-volumet",
  "qt-widgets": "Qt-widgetit",
  "qt-signals": "signaalit/slotit",
  "qt-threading": "Qt-säikeet",
  "qt-models": "Qt-mallit",
  "qt-opengl": "Qt OpenGL",
  "qt-shaders": "Qt-shaderit",
  "js-async": "JavaScript async",
  "js-types": "JavaScript-tyypit",
  "js-modules": "JS-moduulit",
  "js-runtime": "JS-runtime",
  "pg-indexes": "PostgreSQL-indeksit",
  "pg-explain": "EXPLAIN/suunnitelmat",
  "pg-vacuum": "VACUUM/autovacuum",
  "pg-config": "PostgreSQL-konfig",
  "pg-query-design": "SQL-kyselysuunnittelu",
  "pg-cte-window": "CTE ja ikkunafunktiot",
  "pg-joins": "JOIN-kuviot",
  "pg-json": "JSON/JSONB-kyselyt",
  "pg-sql-security": "SQL-turvallisuus",
  "cpp-production": "C++ tuotanto",
  "docker-production": "Docker tuotanto",
  "js-typescript": "TypeScript",
  "git-workflow": "Git-työnkulku",
  "git-ci": "CI/CD",
  "backend-data": "backend-data",
  "backend-api": "backend-API",
  "ops-incident": "incident-hallinta",
  "web-security": "web-turvallisuus",
  "rf-basics": "Robot Framework",
  "rf-web": "RF web-testaus",
  "rf-execution": "RF suoritus/CI",
  "rf-advanced": "RF-laajennukset",
};

function scoreQuestion(q, profile, targetDiff) {
  const audienceMatch = q.audiences.some((a) => profile.tags.includes(a));
  if (!audienceMatch) return -1;
  if (q.difficulty < (profile.minDifficulty ?? 3)) return -1;

  let score = 90 - Math.abs(q.difficulty - targetDiff) * 12;
  if (q.difficulty >= targetDiff) score += 8;

  if (profile.preferChapter && q.chapter === profile.preferChapter) score += 35;
  if (profile.preferDomain && q.domain === profile.preferDomain) score += 20;
  if (profile.playerSpecialty && q.domain === profile.playerSpecialty) score += 22;
  if (profile.preferDomains?.includes(q.domain)) score += 12;
  if (profile.preferChapters?.includes(q.chapter)) score += 15;

  if (profile.tags.includes("security") && (q.domain === "linux" || q.domain === "docker" || q.domain === "security" || q.domain === "backend")) {
    score += 6;
  }
  if (profile.tags.includes("project-lead") && q.domain === "scrum") score += 10;
  if (profile.tags.includes("ceo") && q.domain === "scrum") score += 8;

  if (profile.tags.includes("coworker") && q.domain === "cpp" && (!profile.preferDomain || profile.preferDomain === "cpp")) {
    score += 30;
  }
  if (profile.tags.includes("interview") && q.domain === "cpp") {
    score += 28;
  }
  if (profile.tags.includes("guru") && q.domain === "cpp" && (!profile.preferDomain || profile.preferDomain === "cpp")) {
    score += 15;
  }
  if (profile.tags.includes("guru") && (q.domain === "qt" || q.chapter === "qt-shaders" || q.chapter === "qt-opengl")) {
    score += 10;
  }

  return score;
}

function filterAndScoreQuestions(questions, profile, targetDiff, excludeIds) {
  const exclude = new Set(excludeIds);
  return questions
    .map((q) => ({ q, score: scoreQuestion(q, profile, targetDiff) }))
    .filter((x) => x.score >= 0 && !exclude.has(x.q.id))
    .sort((a, b) => b.score - a.score || a.q.id.localeCompare(b.q.id));
}

function buildQuestionTier(scored, minSize = 6) {
  if (scored.length === 0) return scored;
  const topScore = scored[0].score;
  let band = 8;
  let tier = scored.filter((x) => x.score >= topScore - band);
  while (tier.length < minSize && band < 64) {
    band += 8;
    tier = scored.filter((x) => x.score >= topScore - band);
  }
  if (tier.length < minSize) {
    return scored.slice(0, Math.min(scored.length, Math.max(minSize, 12)));
  }
  return tier;
}

export function pickQuestion(entity, karmaTotal = 0, quizHistory = null, pickOptions = null) {
  const questions = loadAllQuestions();
  const playerSpecialty = pickOptions?.playerSpecialty ?? "";
  const profile = audienceTags(entity, playerSpecialty);
  const targetDiff = targetDifficulty(entity, karmaTotal);
  const entityId = entity.id || "";
  const pickNonce = pickOptions?.pickNonce ?? 0;
  const deaths = pickOptions?.deaths ?? 0;

  const globalAsked = getGlobalAskedQuestionIds(quizHistory);
  const entityAsked = getAskedQuestionIds(quizHistory, entityId);
  const recent = getRecentQuestionIds(quizHistory, 20);

  if (profile.tags.includes("guru") && !entity.topic) {
    const cppTopics = [
      "tools",
      "style",
      "safety",
      "maintainability",
      "correctness",
      "performance",
    ];
    const round = entity.guruRound ?? entityAsked.length;
    profile.preferChapter = cppTopics[hashString(`${entityId}:guru:${round}:${pickNonce}`) % cppTopics.length];
  }

  if (entity.id === "receptionist") {
    const cppTopics = [
      "tools",
      "style",
      "safety",
      "maintainability",
      "correctness",
    ];
    profile.preferChapter =
      cppTopics[
        hashString(`interview:${entityId}:${entityAsked.length}:${pickNonce}:${deaths}`)
          % cppTopics.length
      ];
  }

  // 1) Älä toista globaalisti kysyttyjä — myös eri NPC:iltä.
  let exclude = [...new Set([...globalAsked, ...recent])];
  let scored = filterAndScoreQuestions(questions, profile, targetDiff, exclude);

  // 2) Jos profiilin pooli loppuu, salli vanhoja mutta ei ihan viimeisiä.
  if (scored.length === 0) {
    exclude = [...new Set(recent.slice(-5))];
    scored = filterAndScoreQuestions(questions, profile, targetDiff, exclude);
  }

  // 3) Viimeinen keino: mikä tahansa profiiliin sopiva.
  if (scored.length === 0) {
    scored = filterAndScoreQuestions(questions, profile, targetDiff, []);
  }

  if (scored.length === 0) {
    const fallback = questions
      .filter((q) => q.domain === "cpp" && q.difficulty >= 2)
      .sort((a, b) => b.difficulty - a.difficulty)[0];
    return { question: fallback ?? questions[0], profile, targetDiff };
  }

  const topScore = scored[0].score;
  const tier = buildQuestionTier(scored);
  const salt = `${pickNonce}:${entityAsked.length}:${deaths}:${globalAsked.length}:${recent.length}:${topScore}:${tier.length}`;
  const idx =
    hashString(`${entityId}:${salt}:${tier.map((x) => x.q.id).join("|")}`) % tier.length;
  return { question: tier[idx].q, profile, targetDiff };
}

let activeQuizCache = null;

export function clearEncounterQuizCache() {
  activeQuizCache = null;
}

export function getEncounterQuiz(session, quizHistory = null, pickOptions = null) {
  if (session.screen !== "encounter") {
    clearEncounterQuizCache();
    return null;
  }

  const entity = findPendingEntity(session);
  if (!entity) {
    clearEncounterQuizCache();
    return null;
  }

  let quizEntity = entity;
  if (entity.kind === "guru") {
    quizEntity = { ...entity, guruRound: session.guruQuizCorrect ?? 0 };
  }

  const entityId = entity.id || "";
  if (activeQuizCache?.entityId === entityId && activeQuizCache.quiz) {
    return activeQuizCache.quiz;
  }

  let pickNonce = pickOptions?.pickNonce ?? session.exportDeaths?.() ?? 0;
  if (typeof pickOptions?.nextPickNonce === "function") {
    pickNonce = pickOptions.nextPickNonce(entityId, entity.kind);
  }

  const picked = pickQuestion(quizEntity, session.karma.total(), quizHistory, {
    pickNonce,
    deaths: session.exportDeaths?.() ?? 0,
    playerSpecialty: session.playerSpecialty ?? "",
  });
  if (!picked?.question?.id) {
    clearEncounterQuizCache();
    return null;
  }
  const shuffleSeed = `${entityId}:${picked.question.id}:${session.karma.total()}`;
  const question = {
    ...picked.question,
    choices: shuffleChoices(picked.question.choices ?? [], shuffleSeed),
  };
  const quiz = {
    entity,
    ...picked,
    question,
    greeting: frameQuestion(entity, question, picked.profile),
  };
  activeQuizCache = { entityId, quiz };
  return quiz;
}

/** Laajempi opetusnäkymä AI-vihjeeseen. */
export function buildAiStudyText(question) {
  const correct = question.choices?.find((c) => c.correct);
  const wrong = question.choices?.filter((c) => !c.correct) || [];
  const parts = [];

  const tag = question.chapter || question.domain || "aihe";
  parts.push(`【 ${tag} 】`);
  parts.push("");
  parts.push(question.prompt);
  parts.push("");
  parts.push("── Perustelu ──");
  if (question.studyNotes) {
    parts.push(question.studyNotes);
  } else {
    parts.push(question.correctFeedback);
  }
  if (correct?.text) {
    parts.push(`\nOikea valinta: ${correct.text}`);
  }
  if (wrong.length > 0) {
    parts.push("\n── Miksi muut eivät kelpaa? ──");
    for (const w of wrong) {
      parts.push(`• ${w.text}`);
    }
  }
  if (question.wrongFeedback && question.studyNotes) {
    parts.push(`\nYleinen virhe: ${question.wrongFeedback}`);
  }
  const src = question.sourceUrl || question.bankSource;
  if (src) {
    parts.push(`\n── Lisätietoa ──\n${src}`);
  }
  return parts.join("\n");
}

export const AI_STUDY_KARMA_COST = 5;

export function frameQuestion(entity, question, profile) {
  const voice = VOICES[profile.voice] ?? VOICES.colleague;
  const topic = entity.topic || question.chapter || "";
  const ctx = {
    domain: question.domain,
    topic,
    topicLabel: TOPIC_LABELS[topic] || question.domain || "tekninen",
  };
  return voice(entity.name || entity.id, question.prompt, ctx);
}

export function needsEncounterQuiz(session) {
  if (session.pendingEntityId === "receptionist") {
    if (session.interviewPassed) return false;
    return true;
  }
  const kind = session.pendingEntityKind;
  if (kind === "guru") {
    if (session.guruIntroPassed) return false;
    return true;
  }
  const storyId = session.pendingStoryId;
  if (storyId && storyId.length > 0) return false;
  if (!kind || kind === "item") return false;
  return true;
}

export function findPendingEntity(session) {
  const id = session.pendingEntityId;
  if (!id) return null;
  const map = sessionMap(session);
  if (!map) return null;
  for (let f = 0; f < map.floorCount(); f += 1) {
    map.currentFloor = f;
    const ents = map.activeFloor().entities;
    for (let i = 0; i < ents.length; i += 1) {
      if (ents[i].id === id) return ents[i];
    }
  }
  return {
    id,
    name: session.pendingEntityName,
    char: session.pendingEntityChar,
    kind: session.pendingEntityKind,
  };
}

const COWORKER_WRONG = [
  "Umm... okei?",
  "Ahaa. No jos sanot niin...",
  "Selvä... kai?",
];
const COWORKER_RIGHT = [
  "Kiitos — tästä oli apua!",
  "Hyvä pointti, kiitos!",
  "Selvä, kiitos!",
  "Jes, tuo auttaa!",
];
const SECURITY_WRONG = [
  "Merkitään muistiin — tarkistan tämän vielä.",
  "En ole varma että tämä täyttää audit-kriteerin.",
];
const SECURITY_RIGHT = [
  "OK — tämä täyttää audit-linjan.",
  "Hyväksytty. Voit jatkaa.",
];
const EXEC_WRONG = [
  "Mielenkiintoinen näkemys... palaamme asiaan myöhemmin.",
  "Kirjataan muistiin strategiapalaveria varten.",
];
const EXEC_RIGHT = [
  "Hyvä. KPI:t kiittävät.",
  "Selvä — jatketaan.",
];
const MENTOR_WRONG = [
  "Tuota... tarkistetaanpa dokumentaatiosta vielä.",
  "En ole täysin vakuuttunut — mietitään uudelleen.",
];
const MENTOR_RIGHT = [
  "Juuri näin.",
  "Hyvä vastaus — jatketaan reviewstä.",
];

function pickVariant(seed, options) {
  if (!options.length) return "";
  const idx = hashString(String(seed)) % options.length;
  return options[idx];
}

/** Sosiaalinen reaktio — ei teknistä selitystä. */
export function buildQuizReaction(entity, correct, session = null) {
  const name = entity.name || entity.id || "Henkilö";
  const kind = entity.kind || "";

  if (kind === "coworker") {
    if (correct) {
      return `${name}: "${pickVariant(entity.id, COWORKER_RIGHT)}"`;
    }
    if (session) {
      return buildCoworkerWrongReaction(entity, session);
    }
    const ablative = "joltain";
    return `${name}: "Hmm… kiitos, ehkä kysyn vielä ${ablative}."`;
  }
  if (entity.id === "staff-f7-hermit") {
    if (correct) {
      return `${name}: "Valoa! Ja oikea vastaus — ehkä uskallan mennä lounaalle. Suosittelen sinua lämpimästi."`;
    }
    return `${name}: "Ehkä projekti ei ollut valmis… mutta kiitos että yritit. Odotan vielä yhden oikean vastauksen."`;
  }
  if (kind === "security") {
    const line = pickVariant(entity.id, correct ? SECURITY_RIGHT : SECURITY_WRONG);
    return `${name}: "${line}"`;
  }
  if (kind === "guru") {
    const line = pickVariant(entity.id, correct ? MENTOR_RIGHT : MENTOR_WRONG);
    return `${name}: "${line}"`;
  }
  if (entity.id?.startsWith("ceo-") || entity.char === "C") {
    const line = pickVariant(entity.id, correct ? EXEC_RIGHT : EXEC_WRONG);
    return `${name}: "${line}"`;
  }
  if (kind === "role" && entity.char === "P") {
    if (correct) return `${name}: "Hyvä — otetaan tämä sprinttiin."`;
    return `${name}: "Umm... tarkistetaan backlog groomingissa uudestaan."`;
  }
  if (kind === "role" && entity.char === "S" && entity.id !== "receptionist") {
    if (correct) return `${name}: "Kiitos — merkitsen lomakkeeseen."`;
    return `${name}: "Hmm... tämä ei täsmää ohjeistukseen."`;
  }
  if (entity.id === "receptionist") {
    if (correct) return `${name}: "Hyvä vastaus — kulkulupa on tulossa."`;
    return `${name}: "Valitettavasti tämä ei riittänyt. Voit yrittää uudelleen."`;
  }
  if (kind === "hostile") {
    if (correct) return `${name} mutisee tunnustuksen: "No... oikein."`;
    return `${name} nauraa halveksivasti: "Tuollaista neuvoa?"`;
  }

  if (correct) {
    return `${name}: "Kiitos!"`;
  }
  return `${name}: "Umm... okei?" — vastaus ei ollut ihan kohdillaan.`;
}

const OFFICE_JOKES = [
  "Miksi dev meni standuppiin? Unohdin missä sprintti päättyy.",
  "Montako Scrum Masteria tarvitaan lamppuun? Ei yhtään — se on tiimin vastuu.",
  "Eräs dev ja tuotepäällikkö astuvat baariin. Baari sanoo: 404.",
];
const SCRUM_JOKES = [
  "Miksi retro kesti kolme tuntia? Koska action itemit olivat WIP-limitti 9000.",
  "Mikä on Scrumin lempieläin? Kanban-kani joka hyppii takaisin Doingiin.",
  "Sprint review: \"99 % valmis\" — kuten mun lounastunti.",
];
const CPP_JOKES = [
  "Miksi C++ dev itki? unique_ptr meni shared_ptr:n kanssa treffeille.",
  "auto x = 42; — kääntäjä sanoi: selvä juttu. Minä sanoin: MIKÄ juttu?",
];
const LINUX_JOKES = [
  "systemd: se toimii. Paitsi kun ei toimi. Silloin se on feature.",
  "Docker-kontti ja minä ollaan parhaat kaverit — kunnes se exit 0.",
];
const DOCKER_JOKES = [
  "Miksi kontti on tyhjä? Koska se on distroless — ja henkinen tila.",
  "docker network ls — verkko on se joka yhdistää meidät. Tai ei.",
];
const QT_JOKES = [
  "connect(sender, &Sender::signal, …) — ja sitten mietit miksi slot ei koskaan laukea.",
  "QObject::findChild — löysin bugin. Se oli parentin parentin parent.",
];
const JS_JOKES = [
  "typeof null === 'object' — JavaScript sanoo terveisiä logiikasta.",
  "async function standup() { await coffee; return undefined; }",
];
const PG_JOKES = [
  "EXPLAIN ANALYZE — kun SELECT * oli 'väliaikainen' ratkaisu vuonna 2019.",
  "Autovacuum: se tekee taustalla hommat. Paitsi kun ei tee.",
];

function jokesForQuestion(question) {
  const domain = question?.domain || "";
  const chapter = question?.chapter || "";
  if (domain === "scrum" || String(chapter).startsWith("scrum")) return SCRUM_JOKES;
  if (domain === "docker" || String(chapter).startsWith("docker")) return DOCKER_JOKES;
  if (domain === "linux" || ["systemd", "journald", "avahi", "linux-network"].includes(chapter)) {
    return LINUX_JOKES;
  }
  if (domain === "cpp") return CPP_JOKES;
  if (domain === "qt") return QT_JOKES;
  if (domain === "javascript") return JS_JOKES;
  if (domain === "postgres") return PG_JOKES;
  return OFFICE_JOKES;
}

export function pickOfficeJoke(entity, question) {
  const pool = jokesForQuestion(question);
  return pickVariant(`${entity.id}:joke`, pool);
}

export function buildDismissiveLine(entity) {
  const last = (entity.name || "kaveri").split(" ").pop();
  const lines = [
    "Ihan sama. Ei kiinnosta.",
    "En jaksa. Jira voittaa.",
    `Sorry ${last}, mun kapasiteetti on loppu.`,
    "Ei oikeesti. Pingaa myöhemmin.",
  ];
  return pickVariant(`${entity.id}:meh`, lines);
}

export function buildNpcMehReply(entity) {
  const name = entity.name || "Kollega";
  const lines = [
    `${name} kohauttaa olkapäitä: "No joo. Mimmit menee."`,
    `${name} nyökkää välinpitämättömästi ja palaa Jiraan.`,
    `${name}: "Selvä. Merkitsen 'ei vastannut'."`,
    `${name} huokaisee ja sulkee ticketin.`,
  ];
  return pickVariant(`${entity.id}:meh-npc`, lines);
}

export function buildQuizSideMenu(entity, session = null) {
  const menu = {
    jokeLabel: "Kerro vitsi",
    mehLabel: buildDismissiveLine(entity),
    leaveLabel: "Poistu hiljaa",
  };
  if (entity.kind === "coworker" && session) {
    menu.askColleagueLabel = buildAskColleagueLine(entity, session);
  }
  return menu;
}

export { buildAskColleagueReply };

/** Testaus: palauttaa kaikki ladatut kysymykset. */
export function listAllQuestions() {
  return loadAllQuestions();
}
