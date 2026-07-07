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
import { lessonLinkLine } from "../shared/studyLessonLinks.mjs";
import {
  getAiStudySolution,
  lessonSolutionMarkdown,
  resolveAiStudySolution,
} from "../shared/lessonSolutionCore.mjs";

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

/**
 * Testaustuki: paljastaa hash/indeksi-toteutuksen niin että jakauman tasaisuutta
 * voi mitata suoraan (ilman koko pickQuestion-putkea, joka sekoittaa tarkoituksella
 * kaksi eri kokoista poolia — ks. ANY_TOPIC_CHANCE).
 */
export const _internal = { hashString, pickIndexFromPool: (pool, salt) => pickIndexFromPool(pool, salt) };

/** Satunnainen alkuarvo uuden pelin kysymysvalinnalle (Partio, kollegat, …). */
export function randomEncounterPickNonce() {
  return ((Date.now() ^ ((Math.random() * 0x7fffffff) | 0)) >>> 0) % 2147483646 + 1;
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
  "qt-quick": "qt",
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
  "rust-ownership": "rust",
  "rust-borrowing": "rust",
  "rust-types": "rust",
  "rust-error": "rust",
  "rust-concurrency": "rust",
  "rust-tooling": "rust",
  "rust-safety": "rust",
  "rust-traits": "rust",
  "rust-async": "rust",
  "rust-testing": "rust",
};

/** Luvut domainin mukaan (haastattelu/guru-kierros). */
function chaptersForDomain(domain) {
  if (!domain) return [];
  return Object.entries(TOPIC_DOMAINS)
    .filter(([, d]) => d === domain)
    .map(([chapter]) => chapter);
}

function specialtyDomain(playerSpecialty, fallback = "cpp") {
  return playerSpecialty || fallback;
}

/** Kielikohtaiset erikoisalueet — eivät ohita toisiaan työkaverin geneerisen topicin kanssa. */
const LANGUAGE_SPECIALTY_DOMAINS = new Set(["cpp", "javascript", "qt", "rust"]);

/**
 * Työkaverin kysymädomain: pelaajan kielivalinta voittaa ristiriitaisen C++/Qt-topicin,
 * mutta Scrum, Docker, Linux jne. säilyvät työkaverin omana aiheena.
 */
function coworkerQuestionDomain(playerSpecialty, topicDomain) {
  if (!playerSpecialty) return topicDomain || "";
  if (!topicDomain) return playerSpecialty;
  if (topicDomain === playerSpecialty) return topicDomain;
  const playerIsLanguage = LANGUAGE_SPECIALTY_DOMAINS.has(playerSpecialty);
  const topicIsLanguage = LANGUAGE_SPECIALTY_DOMAINS.has(topicDomain);
  if (playerIsLanguage && topicIsLanguage) return playerSpecialty;
  return topicDomain;
}

function audienceTags(entity, playerSpecialty = "") {
  if (entity.id === "receptionist") {
    const domain = specialtyDomain(playerSpecialty);
    return {
      tags: ["interview", "secretary", "coworker", "guru"],
      voice: "interview",
      preferDomain: domain,
      playerSpecialty,
    };
  }
  if (entity.id?.startsWith("ceo-")) {
    return { tags: ["ceo"], voice: "executive", preferDomain: "scrum" };
  }
  if (entity.kind === "security") {
    return {
      tags: ["security"],
      voice: "security",
      preferDomain: "security",
      preferDomains: ["security", "linux", "docker", "backend"],
      preferChapters: ["web-security", "linux-network", "journald", "docker-network", "docker-production", "avahi"],
    };
  }
  if (entity.kind === "guru") {
    const domain = specialtyDomain(playerSpecialty);
    return {
      tags: ["guru"],
      voice: "mentor",
      preferDomain: domain,
      playerSpecialty,
    };
  }
  if (entity.kind === "hostile") {
    const preferDomains = ["cpp", "docker"];
    if (playerSpecialty && !preferDomains.includes(playerSpecialty)) {
      preferDomains.unshift(playerSpecialty);
    }
    return {
      tags: ["hostile"],
      voice: "hostile",
      preferDomain: playerSpecialty || "",
      playerSpecialty,
      preferDomains,
    };
  }
  if (entity.kind === "role") {
    if (entity.char === "S") {
      return {
        tags: ["secretary"],
        voice: "secretary",
        preferDomain: "scrum",
        preferChapters: ["scrum-dor", "scrum-dod"],
      };
    }
    if (entity.char === "P") {
      return {
        tags: ["project-lead"],
        voice: "project-lead",
        preferDomain: "scrum",
      };
    }
    if (entity.char === "C") {
      return { tags: ["ceo"], voice: "executive", preferDomain: "scrum" };
    }
  }
  if (entity.kind === "coworker") {
    const topic = entity.topic || "";
    const topicDomain = TOPIC_DOMAINS[topic] || "";
    const specialty = playerSpecialty || "";
    const preferDomain = coworkerQuestionDomain(specialty, topicDomain);
    return {
      tags: ["coworker"],
      voice: "colleague",
      preferChapter: topic && preferDomain === topicDomain ? topic : "",
      preferDomain,
      playerSpecialty: specialty,
    };
  }
  const base = { tags: ["coworker"], voice: "colleague", playerSpecialty };
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
  "qt-quick": "Qt Quick / QML",
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

function scoreQuestion(q, profile, scoreOptions = null) {
  const audienceMatch = q.audiences.some((a) => profile.tags.includes(a));
  if (!audienceMatch) return -1;

  const maxDiff = scoreOptions?.maxDifficulty;
  if (maxDiff != null && (q.difficulty ?? 5) > maxDiff) return -1;

  let score = 50;
  const globalAsked = scoreOptions?.globalAsked;
  if (globalAsked && !globalAsked.has(q.id)) score += 16;

  if (profile.preferChapter && q.chapter === profile.preferChapter) score += 35;
  if (profile.preferDomain && q.domain === profile.preferDomain) score += 20;
  const specialtyMatchesPick =
    profile.playerSpecialty &&
    q.domain === profile.playerSpecialty &&
    (!profile.preferDomain || profile.preferDomain === profile.playerSpecialty);
  if (specialtyMatchesPick) score += 22;
  if (profile.preferDomains?.includes(q.domain)) score += 12;
  if (profile.preferChapters?.includes(q.chapter)) score += 15;

  if (profile.tags.includes("security") && (q.domain === "linux" || q.domain === "docker" || q.domain === "security" || q.domain === "backend")) {
    score += 6;
  }
  if (profile.tags.includes("project-lead") && q.domain === "scrum") score += 10;
  if (profile.tags.includes("ceo") && q.domain === "scrum") score += 8;

  const focusDomain = profile.preferDomain || profile.playerSpecialty || "";
  if (
    profile.tags.includes("coworker") &&
    focusDomain &&
    q.domain === focusDomain &&
    (!profile.preferChapter || q.chapter === profile.preferChapter)
  ) {
    score += 30;
  }
  if (profile.tags.includes("interview") && focusDomain && q.domain === focusDomain) {
    score += 28;
  }
  if (profile.tags.includes("guru") && focusDomain && q.domain === focusDomain) {
    score += 15;
  }
  if (profile.tags.includes("guru") && (q.domain === "qt" || q.chapter === "qt-shaders" || q.chapter === "qt-opengl")) {
    score += 10;
  }

  return score;
}

function filterAndScoreQuestions(questions, profile, excludeIds, scoreOptions = null) {
  const exclude = new Set(excludeIds);
  return questions
    .map((q) => ({ q, score: scoreQuestion(q, profile, scoreOptions) }))
    .filter((x) => x.score >= 0 && !exclude.has(x.q.id))
    .sort((a, b) => b.score - a.score || a.q.id.localeCompare(b.q.id));
}

/**
 * "Mistä vain"-profiili: samat audience-tagit (jotta kysymys sopii NPC:lle puheessa),
 * mutta ei topic/domain-bonuksia — antaa tasapuolisen poolin läpi kaikkien aiheiden.
 */
function neutralizeProfile(profile) {
  return { tags: profile.tags };
}

/**
 * Ajaa saman 3-vaiheisen poissulkukaskadin (globaali+recent → recent-8 → ei poissulkua)
 * millä tahansa profiililla. Palauttaa aina jonkin poolin jos audience-osuma löytyy.
 */
function scoreWithExclusionCascade(questions, profile, globalAsked, recent, scoreOptions) {
  let exclude = [...new Set([...globalAsked, ...recent])];
  let scored = filterAndScoreQuestions(questions, profile, exclude, scoreOptions);
  if (scored.length === 0) {
    exclude = [...new Set(recent.slice(-8))];
    scored = filterAndScoreQuestions(questions, profile, exclude, scoreOptions);
  }
  if (scored.length === 0) {
    scored = filterAndScoreQuestions(questions, profile, [], scoreOptions);
  }
  return scored;
}

/**
 * Todennäköisyys sille, että kysymys haetaan koko pankista ("mistä vain aiheesta")
 * sen sijaan että se painotetaan NPC:n omaan topiciin/domainiin.
 * 0.5 = 50 % ajasta ihan mikä tahansa aihe, 50 % ajasta NPC:n oma aihe.
 */
export const ANY_TOPIC_CHANCE = 0.5;

/** Laaja valintapooli — kapea top-6 -taso toisti samoja kysymyksiä ilman historiaa. */
const QUESTION_POOL_MIN = 20;
const QUESTION_POOL_MAX = 48;

function buildQuestionPool(scored, profile, minPool = QUESTION_POOL_MIN, maxPool = QUESTION_POOL_MAX) {
  if (scored.length === 0) return scored;

  let pool = scored;
  const focusChapter = profile?.preferChapter || "";
  const focusDomain = profile?.preferDomain || "";

  if (focusChapter) {
    const chapterHits = scored.filter((x) => x.q.chapter === focusChapter);
    if (chapterHits.length >= minPool) {
      pool = chapterHits;
    } else if (focusDomain) {
      const domainHits = scored.filter((x) => x.q.domain === focusDomain);
      if (domainHits.length > 0) pool = domainHits;
      else if (chapterHits.length > 0) pool = chapterHits;
    } else if (chapterHits.length > 0) {
      pool = chapterHits;
    }
  } else if (focusDomain) {
    const domainHits = scored.filter((x) => x.q.domain === focusDomain);
    if (domainHits.length > 0) pool = domainHits;
  }

  if (pool.length < minPool && profile?.preferDomains?.length) {
    const allowed = new Set(profile.preferDomains);
    const wider = scored.filter((x) => allowed.has(x.q.domain));
    if (wider.length > pool.length) pool = wider;
  }

  if (pool.length <= minPool) {
    return pool.slice(0, maxPool);
  }

  const topScore = pool[0].score;
  let band = 8;
  let bandPool = pool.filter((x) => x.score >= topScore - band);
  while (bandPool.length < minPool && band < 160) {
    band += 8;
    bandPool = pool.filter((x) => x.score >= topScore - band);
  }
  if (bandPool.length < minPool) {
    bandPool = pool.slice(0, Math.min(pool.length, minPool));
  }
  return bandPool.slice(0, maxPool);
}

function pickIndexFromPool(pool, salt) {
  if (pool.length === 0) return 0;
  if (pool.length === 1) return 0;
  return hashString(salt) % pool.length;
}

export function pickQuestion(entity, karmaTotal = 0, quizHistory = null, pickOptions = null) {
  const allQuestions = loadAllQuestions();
  const kidsMode = !!pickOptions?.kidsMode;
  const questions = kidsMode
    ? allQuestions.filter((q) => q.bankId === "kids-easy")
    : allQuestions;
  const playerSpecialty = pickOptions?.playerSpecialty ?? "";
  const profile = audienceTags(entity, playerSpecialty);
  const entityId = entity.id || "";
  const pickNonce = pickOptions?.pickNonce ?? 0;
  const deaths = pickOptions?.deaths ?? 0;
  const sessionPickSeed = pickOptions?.sessionPickSeed ?? 0;

  const globalAsked = getGlobalAskedQuestionIds(quizHistory);
  const entityAsked = getAskedQuestionIds(quizHistory, entityId);
  const recent = getRecentQuestionIds(quizHistory, 32);
  const globalAskedSet = new Set(globalAsked);
  const scoreOptions = {
    globalAsked: globalAskedSet,
    maxDifficulty: kidsMode ? 2 : null,
  };

  const domainChapters = chaptersForDomain(profile.preferDomain || profile.playerSpecialty || "cpp");

  if (profile.tags.includes("guru") && !entity.topic && domainChapters.length > 0) {
    const round = entity.guruRound ?? entityAsked.length;
    profile.preferChapter =
      domainChapters[hashString(`${entityId}:guru:${round}:${pickNonce}`) % domainChapters.length];
  }

  if (entity.id === "receptionist" && domainChapters.length > 0) {
    profile.preferChapter =
      domainChapters[
        hashString(`interview:${entityId}:${entityAsked.length}:${pickNonce}:${deaths}`)
          % domainChapters.length
      ];
  }

  // 1)-3) Poissulkukaskadi NPC:n omalla topic/domain-painotuksella.
  const scored = scoreWithExclusionCascade(questions, profile, globalAsked, recent, scoreOptions);

  if (scored.length === 0) {
    const fallbackDomain = profile.preferDomain || profile.playerSpecialty || "cpp";
    const fallback =
      questions.find(
        (q) =>
          q.domain === fallbackDomain &&
          q.audiences.some((a) => profile.tags.includes(a)),
      ) ?? questions[0];
    return { question: fallback, profile, targetDiff: fallback?.difficulty ?? 1 };
  }

  const biasedPool = buildQuestionPool(scored, profile);

  // "Mistä vain aiheesta" -pooli: samalla poissulkukaskadilla, mutta ilman
  // topic/domain-painotusta ja ilman min/max-poolin rajausta — kaikilla audienssiin
  // sopivilla kysymyksillä on tasan sama pistemäärä (vain "ei kysytty" -bonus vaihtelee),
  // jolloin buildQuestionPool()-rajaus leikkaisi poolin aakkosjärjestyksen mukaan eikä
  // tasapuolisesti kaikista domaineista. Käytetään siis suoraan koko poissuljettua listaa.
  const neutralProfile = neutralizeProfile(profile);
  const neutralScored = scoreWithExclusionCascade(questions, neutralProfile, globalAsked, recent, scoreOptions);
  const widePool = neutralScored.length > 0 ? neutralScored : biasedPool;

  // Riippumaton 50/50-arvonta: sama syötesuola kaikissa poimintapaikoissa pitäisi silti
  // antaa hajonnan, koska entityAsked/globalAsked/recent/pickNonce muuttuvat jokaisella kutsulla.
  const gateSalt = [
    "gate",
    sessionPickSeed,
    pickNonce,
    entityAsked.length,
    deaths,
    globalAsked.length,
    recent.length,
    entityId,
  ].join(":");
  const gateRoll = hashString(gateSalt) / 4294967296;
  const useAnyTopic = gateRoll < ANY_TOPIC_CHANCE;

  let pool = useAnyTopic ? widePool : biasedPool;
  if (pool.length === 0) pool = useAnyTopic ? biasedPool : widePool;

  const salt = [
    sessionPickSeed,
    pickNonce,
    entityAsked.length,
    deaths,
    globalAsked.length,
    recent.length,
    useAnyTopic ? "any" : "topic",
    pool.map((x) => x.q.id).join(","),
  ].join(":");
  const idx = pickIndexFromPool(pool, salt);
  const question = pool[idx].q;
  return { question, profile, targetDiff: question.difficulty ?? 1 };
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
    sessionPickSeed: pickOptions?.sessionPickSeed ?? 0,
    kidsMode: !!session.kidsMode,
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

/** Ratkaisu shufflatusta monivalinnasta (valintanumero + teksti). */
export { getAiStudySolution, resolveAiStudySolution } from "../shared/lessonSolutionCore.mjs";

/** Laajempi opetusnäkymä AI-vihjeeseen. */
export function buildAiStudyText(question, readLessonFile = null) {
  const solution = getAiStudySolution(question);
  const lesson = lessonSolutionMarkdown(question, readLessonFile);
  const parts = [];

  const tag = question.chapter || question.domain || "aihe";
  parts.push(`【 ${tag} 】`);
  parts.push("");
  parts.push(question.prompt);
  parts.push("");
  parts.push("── Ratkaisu ──");
  if (solution.choiceN > 0) {
    parts.push(`[${solution.choiceN}] ${solution.choiceText}`);
  } else if (solution.choiceText) {
    parts.push(solution.choiceText);
  }
  if (lesson.markdown) {
    parts.push("");
    parts.push(lesson.markdown);
  }
  parts.push(`\n── Oppitunti ──\n${lessonLinkLine(question)}`);
  return parts.join("\n");
}

/** AI-näkymän lisäsisältö ratkaisun jälkeen (tyhjä — väärät vaihtoehdot ja linkit kuuluvat peliin). */
export function buildAiStudySupplement(_question) {
  return "";
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
  if (session.pendingEntity?.id === "receptionist") {
    if (session.interviewPassed) return false;
    return true;
  }
  const kind = session.pendingEntity?.kind ?? "";
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
  const id = session.pendingEntity?.id ?? "";
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
    name: session.pendingEntity?.name ?? "",
    char: session.pendingEntity?.char ?? "",
    kind: session.pendingEntity?.kind ?? "",
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

/** Sosiaalinen reaktio + tunnetila suhteen mukaan. */
export function buildQuizReactionWithEmotion(entity, correct, session = null) {
  const social = buildQuizReaction(entity, correct, session);
  if (!session?.pickQuizEmotionReaction || !entity?.id) return social;
  const emotion = session.pickQuizEmotionReaction(entity.id, correct);
  if (!emotion) return social;
  const name = entity.name || entity.id || "Henkilö";
  return `${social} ${name} ${emotion}`;
}

const ADULT_JOKES = [
  "Miksi dev meni standuppiin? Unohdin missä sprintti päättyy.",
  "Montako Scrum Masteria tarvitaan lamppuun? Ei yhtään — se on tiimin vastuu.",
  "Eräs dev ja tuotepäällikkö astuvat baariin. Baari sanoo: 404.",
  "Miksi kahvikone sai tiketin? Se ei osannut vastata ilman papuja.",
  "Toimiston kasvi pyysi etätöihin. Sillä oli juuret täällä, mutta latva pilvessä.",
  "Miksi kalenteri oli stressaantunut? Kaikki päivät olivat täynnä.",
  "Palaveri alkoi ajoissa. Se olikin päivän villein user story.",
  "Miksi hissi ei mennyt demoihin? Se jäi aina välikerrokseen.",
  "Tulostin sanoi: paper jam. Minä sanoin: soita bändille.",
  "Miksi bugi viihtyi toimistolla? Sillä oli hyvä repro-ympäristö.",
  "Kaksi ticketiä meni baariin. Toinen oli blocker, joten kukaan ei päässyt eteenpäin.",
  "Miksi retro kesti kolme tuntia? Koska action itemit olivat WIP-limitti 9000.",
  "Mikä on Scrumin lempieläin? Kanban-kani joka hyppii takaisin Doingiin.",
  "Sprint review: \"99 % valmis\" — kuten mun lounastunti.",
  "Miksi backlog ei koskaan palele? Sillä on aina monta kerrosta prioriteetteja.",
  "Dailyssä kysyttiin blockerit. Hiljaisuus oli ainoa joka valmistui ajallaan.",
  "Definition of done: se kohta jossa vitsi on valmis mutta kukaan ei uskalla deployata.",
  "Miksi story pointit menivät kuntosalille? Ne halusivat kasvaa arvioinnissa.",
  "Sprintti lupasi olla lyhyt. Sitten scope venytteli.",
  "Product Owner sanoi 'pieni muutos'. Tiimi kuuli boss musicin.",
  "Miksi C++ dev itki? unique_ptr meni shared_ptr:n kanssa treffeille.",
  "auto x = 42; — kääntäjä sanoi: selvä juttu. Minä sanoin: MIKÄ juttu?",
  "auto x = \"Tesla\"; — vihdoin auto, joka kulkee ilman includea.",
  "Miksi perintöriita kesti kauan? Luokalla oli multiple inheritance.",
  "C++-koodaaja meni kahville: ensin konstruktorissa, sitten destruktorissa.",
  "Miksi template ei kertonut vitsiä? Se instansioitiin väärässä kontekstissa.",
  "Segfault käveli huoneeseen. Kukaan ei muistanut omistajuutta.",
  "Miksi const lupasi olla muuttumatta? Sillä oli mutable poikkeus.",
  "RAII vei roskat ulos. Garbage collector tuli paikalle myöhässä.",
  "Miksi pointeri oli yksinäinen? Se osoitti koko ajan väärään suuntaan.",
  "C++ sanoi: tämä on yksinkertaista. Sitten tuli overload resolution.",
  "systemd: se toimii. Paitsi kun ei toimi. Silloin se on feature.",
  "Docker-kontti ja minä ollaan parhaat kaverit — kunnes se exit 0.",
  "Miksi ping lähti lomalle? Se sai liikaa echo-vastauksia.",
  "chmod 777 kuulostaa onnenluvulta, kunnes security tulee kylään.",
  "Kernel panic ei ole tunne — paitsi perjantaina tuotannossa.",
  "Miksi loki oli hiljainen? Se oli rotateattu pois keskustelusta.",
  "sudo tee — kun haluat sekä luvan että teetä.",
  "Miksi cron heräsi yöllä? Se oli kirjattu tehtäväksi.",
  "Miksi kontti on tyhjä? Koska se on distroless — ja henkinen tila.",
  "docker network ls — verkko on se joka yhdistää meidät. Tai ei.",
  "Miksi image laihdutti? Se vaihtoi multi-stage buildiin.",
  "Kontti sanoi: minulla on kaikki mukana. Volume kysyi: entä muistot?",
  "Dockerfile meni treffeille. Ensimmäinen rivi oli FROM.",
  "Miksi compose oli hyvä kuoro? Kaikki palvelut tulivat samaan sävellajiin.",
  "latest-tag lupasi olla tuore. Se oli kierrätetty vitsi.",
  "Miksi healthcheck oli optimisti? Se yritti uudelleen kolmen sekunnin päästä.",
  "connect(sender, &Sender::signal, …) — ja sitten mietit miksi slot ei koskaan laukea.",
  "QObject::findChild — löysin bugin. Se oli parentin parentin parent.",
  "Miksi widget punastui? Se sai focuksen.",
  "Qt-kehittäjä kysyi suunnan. Layout vastasi: riippuu parentista.",
  "Miksi signal ei ollut yksinäinen? Sillä oli monta slottia kuuntelemassa.",
  "QTimer lupasi tulla heti. Event loop sanoi: jonoon vain.",
  "Miksi dialogi ei lähtenyt pois? Se oli modalisti kiintynyt.",
  "typeof null === 'object' — JavaScript sanoo terveisiä logiikasta.",
  "async function standup() { await coffee; return undefined; }",
  "0 == false on small talkia. 0 === false on vakava keskustelu.",
  "Promise meni lääkäriin. Se oli pending liian pitkään.",
  "Miksi callback ei päässyt kotiin? Se jäi helvettiin.",
  "NaN meni peilin eteen ja kysyi: olenko minä minä?",
  "JavaScriptin lempiruoka on hoisting — kaikki nousee pöydälle ennen aikojaan.",
  "Miksi event loop oli kohtelias? Se antoi aina vuoron seuraavalle.",
  "npm install vei minuutin. node_modules muutti pysyvästi asumaan.",
  "EXPLAIN ANALYZE — kun SELECT * oli 'väliaikainen' ratkaisu vuonna 2019.",
  "Autovacuum: se tekee taustalla hommat. Paitsi kun ei tee.",
  "Miksi indeksi meni kuntosalille? Se halusi parantaa hakukuntoa.",
  "SELECT * meni juhliin ja toi mukanaan koko suvun.",
  "Transaktio sanoi commit. DBA kysyi: oletko aivan varma?",
  "Miksi query oli hidas? Se teki table scanin maailmankiertueen.",
  "VACUUM ei siivoa työpöytää, vaikka kuinka toivoisi.",
  "Miksi JOIN oli suosittu? Se toi kaikki taulut samaan pöytään.",
];
const KIDS_JOKES = [
  "Miksi banaani meni lääkäriin? Siltä kuoriutui huono olo.",
  "Mikä on lumiukon lempiruoka? Jää-salaatti.",
  "Miksi kissa istui tietokoneen päällä? Se jahtasi hiirtä.",
  "Mitä kala sanoi törmätessään seinään? Dam!",
  "Miksi kirja meni kouluun? Se halusi avata uuden luvun.",
  "Mikä on koiran lempisoitin? Hau-lu.",
  "Miksi porkkana punastui? Se näki salaattikastikkeen.",
  "Miksi kana ylitti tien? Se halusi toiselle puolelle.",
  "Mitä yksi seinä sanoi toiselle? Tavataan kulmassa.",
  "Miksi robotti meni kouluun? Se halusi oppia bittikielellä.",
  "Mikä on avaruusolion lempikarkki? Mars-patukka.",
  "Miksi luuranko ei valehdellut? Kaikki näkyi läpi.",
  "Miksi leipä meni lääkäriin? Sillä oli murheita.",
  "Mitä sateenvarjo sanoi sateelle? Tippaakaan en pelkää.",
  "Miksi nalle ei syönyt jälkiruokaa? Se oli jo täynnä pehmeyttä.",
  "Mikä on pieni ja vihreä ja hyppii? Sammakko, jolla on kiire.",
  "Miksi kynä oli iloinen? Sillä oli hyvä pointti.",
  "Mitä numero nolla sanoi kahdeksalle? Hieno vyö!",
  "Miksi tähti ei eksynyt? Se seurasi omaa loistoaan.",
  "Mikä on tietokoneen lempivälipala? Mikrosipsit.",
];

function jokesForQuestion(question) {
  const domain = question?.domain || "";
  const chapter = question?.chapter || "";
  if (domain === "kids" || question?.bankId === "kids-easy" || String(chapter).startsWith("kids")) {
    return KIDS_JOKES;
  }
  return ADULT_JOKES;
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
