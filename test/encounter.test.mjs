import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { generateCorporateHq } from "../hosts/terminal/mapGenerator.mjs";
import { getEncounterQuiz, pickQuestion, listAllQuestions, buildQuizReaction, buildAiStudyText, AI_STUDY_KARMA_COST, buildDismissiveLine, needsEncounterQuiz, clearEncounterQuizCache } from "../hosts/terminal/encounterQuestions.mjs";
import { getMasteredQuestionIds, emptyQuizHistory, recordQuizAnswer } from "../hosts/terminal/quizHistory.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const require = createRequire(import.meta.url);

const {
  FeatureKarma,
  GameSession,
  KoodisampoAppRoot,
  ProcessRuntime,
  WorldMap,
} = require(resolve(projectRoot, "generated/es6/koodisampo.cjs"));

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function dispatch(session, work) {
  const turnRoot = session.__rangerFindRoot();
  ProcessRuntime.beginDispatchTurn(turnRoot);
  try {
    work();
  } finally {
    ProcessRuntime.endDispatchTurn(turnRoot);
  }
}

function createSession() {
  const root = new KoodisampoAppRoot();
  ProcessRuntime.startInstance(root);
  const session = root.createSession();
  return { root, session };
}

function stopSession(root, session) {
  if (session?.__rangerId !== 0) ProcessRuntime.stopInstance(session);
  if (root?.__rangerId !== 0) ProcessRuntime.stopInstance(root);
}

function findHostileEntity(map) {
  for (let f = 0; f < map.floorCount(); f += 1) {
    map.currentFloor = f;
    const ents = map.activeFloor().entities;
    for (let i = 0; i < ents.length; i += 1) {
      const e = ents[i];
      if (e.kind === "hostile" && e.storyId) return e;
    }
  }
  return null;
}

function findCeoEntity(map) {
  for (let f = 0; f < map.floorCount(); f += 1) {
    map.currentFloor = f;
    const ents = map.activeFloor().entities;
    for (let i = 0; i < ents.length; i += 1) {
      const e = ents[i];
      if (e.id?.startsWith("ceo-")) return e;
    }
  }
  return null;
}

function findCoworkerEntity(map) {
  for (let f = 0; f < map.floorCount(); f += 1) {
    map.currentFloor = f;
    const ents = map.activeFloor().entities;
    for (let i = 0; i < ents.length; i += 1) {
      const e = ents[i];
      if (e.kind === "coworker") return e;
    }
  }
  return null;
}

export function runEncounterTests() {
  const karma = new FeatureKarma();
  karma.add("cpp:auto", 40);
  karma.loseKarma(15);
  assert(karma.total() === 25, "loseKarma subtracts from pool");

  const mapJson = JSON.stringify(generateCorporateHq());
  const caughtStoryJson = readFileSync(
    resolve(projectRoot, "content/stories/stolen-card-caught.json"),
    "utf8",
  );
  const map = new WorldMap();
  assert(map.loadFromText(mapJson), "map load");

  const hostile = findHostileEntity(map);
  assert(hostile?.id, "procedural map has hostile NPC");

  map.currentFloor = hostile.y >= 0 ? map.currentFloor : 0;
  for (let f = 0; f < map.floorCount(); f += 1) {
    map.currentFloor = f;
    const ents = map.activeFloor().entities;
    if (ents.some((e) => e.id === hostile.id)) break;
  }

  const bump = hostile;
  assert(bump.kind === "hostile", "hostile kind");

  const { root, session } = createSession();
  try {
    dispatch(session, () => {
      session.loadMapFromText(mapJson);
      session.karma.add("cpp:test", 50);
      session.startEncounter(bump);
    });
    assert(session.screen === "encounter", "encounter screen");
    const view = session.getEncounterView();
    assert(view.isHostile === true, "hostile encounter view");

    dispatch(session, () => {
      session.startEncounter(bump);
    });
    dispatch(session, () => {
      session.onEncounterChoice("talk");
    });
    assert(session.encounterResult === "talk", "talk sets result");
    assert(session.pendingStoryId === bump.storyId, "story id kept for talk");
  } finally {
    stopSession(root, session);
  }

  const ceo = findCeoEntity(map);
  assert(ceo?.id, "procedural map has CEO on upper floors");

  const { root: root2, session: session2 } = createSession();
  try {
    dispatch(session2, () => {
      session2.loadMapFromText(mapJson);
      session2.karma.add("cpp:low", 24);
      session2.startEncounter(ceo);
    });
    const ceoView = session2.getEncounterView();
    assert(ceoView.greeting.includes("Strateginen") || ceoView.greeting.includes("KPI"), "CEO role greeting");
    assert(ceoView.attackWarning === "", "attack option hidden from encounter view");
  } finally {
    stopSession(root2, session2);
  }

  const coworker = findCoworkerEntity(map);
  assert(coworker?.id, "procedural map has coworkers");
  assert(coworker.topic, "coworker has question topic bias");

  const picked = pickQuestion(coworker, 40);
  assert(picked.question?.prompt, "question picked for coworker");
  assert(picked.question.audiences.includes("coworker"), "question audience matches");
  assert(picked.question.difficulty >= 2, "questions skew difficult");

  const allQ = listAllQuestions();
  assert(allQ.length >= 30, "multiple question banks loaded");
  assert(allQ.some((q) => q.domain === "scrum"), "scrum bank present");
  assert(allQ.some((q) => q.domain === "linux"), "linux bank present");
  assert(allQ.some((q) => q.domain === "cpp"), "cpp bank present");
  const cppCount = allQ.filter((q) => q.domain === "cpp").length;
  assert(cppCount >= 20, "many cpp questions");

  const hist = recordQuizAnswer(emptyQuizHistory(), coworker.id, "tools-auto", true);
  const mastered = getMasteredQuestionIds(hist, coworker.id);
  assert(mastered.includes("tools-auto"), "mastered question tracked globally");
  const otherCoworker = { ...coworker, id: "coworker-0-77" };
  const noRepeat = pickQuestion(otherCoworker, 40, hist);
  assert(noRepeat.question.id !== "tools-auto", "mastered question not repeated for other NPC");

  const dockerCoworker = { ...coworker, topic: "docker-network" };
  const dockerPick = pickQuestion(dockerCoworker, 60);
  assert(
    dockerPick.question.domain === "docker" || dockerPick.question.chapter === "docker-network",
    "topic-biased coworker gets docker question",
  );

  const scrumPick = pickQuestion({ ...coworker, topic: "scrum-estimation", kind: "coworker" }, 60);
  assert(scrumPick.question.domain === "scrum", "scrum topic coworker gets scrum question");

  assert(allQ.some((q) => q.domain === "docker"), "docker bank present");

  const qtCoworker = { ...coworker, topic: "qt-shaders", kind: "coworker" };
  const qtPick = pickQuestion(qtCoworker, 60);
  assert(qtPick.question.domain === "qt", "qt topic coworker gets qt question");

  const pgCoworker = { ...coworker, topic: "pg-explain", kind: "coworker" };
  const pgPick = pickQuestion(pgCoworker, 60);
  assert(pgPick.question.domain === "postgres", "postgres topic coworker gets postgres question");

  assert(allQ.some((q) => q.domain === "qt"), "qt bank present");
  assert(allQ.some((q) => q.domain === "javascript"), "javascript bank present");
  assert(allQ.some((q) => q.domain === "postgres"), "postgres bank present");

  const { root: root3, session: session3 } = createSession();
  try {
    dispatch(session3, () => {
      session3.loadMapFromText(mapJson);
      session3.startEncounter(coworker);
    });
    assert(session3.needsEncounterQuiz() === true, "coworker needs quiz");
    const quiz = getEncounterQuiz(session3);
    assert(quiz?.greeting?.includes(quiz.question.prompt), "greeting frames the question");
    assert(quiz.question.choices.length >= 2, "question has choices");

    const karmaBefore = session3.karma.total();
    const correctIdx = quiz.question.choices.findIndex((c) => c.correct);
    const reaction = buildQuizReaction(quiz.entity, true);
    assert(reaction.includes("Kiitos") || reaction.includes("kiitos"), "coworker thanks on correct");
    dispatch(session3, () => {
      session3.finishEncounterQuiz(
        true,
        quiz.question.featureId || "",
        quiz.question.featurePoints || 0,
        reaction,
      );
    });
    assert(session3.screen === "map", "quiz returns to map");
    assert(session3.karma.total() > karmaBefore, "correct answer grants karma");

    const wrongReaction = buildQuizReaction(quiz.entity, false, session3);
    assert(
      wrongReaction.includes("lt") || wrongReaction.includes("ltä"),
      "coworker wrong reaction redirects to colleague",
    );

    const avahiQ = allQ.find((q) => q.id === "avahi-mdns");
    assert(avahiQ, "avahi question exists");
    const study = buildAiStudyText(avahiQ);
    assert(study.includes("mDNS"), "AI study text explains mDNS");
    assert(study.includes("Perustelu"), "AI study has rationale section");
    assert(study.includes("Oikea valinta"), "AI study lists correct answer");

    dispatch(session3, () => {
      session3.loadMapFromText(mapJson);
      session3.karma.add("test:ai", 20);
      session3.startEncounter(coworker);
    });
    const karmaAi = session3.karma.total();
    let aiOk = false;
    dispatch(session3, () => {
      aiOk = session3.askEncounterAiStudy(AI_STUDY_KARMA_COST);
    });
    assert(aiOk === true, "AI study charges karma");
    assert(session3.karma.total() === karmaAi - AI_STUDY_KARMA_COST, "AI study karma cost");
    assert(session3.screen === "encounter", "AI study keeps encounter open");

    const meh = buildDismissiveLine(coworker);
    assert(meh.length > 8, "dismissive line exists");

    dispatch(session3, () => {
      session3.loadMapFromText(mapJson);
      session3.startEncounter(coworker);
    });
    assert(session3.getEncounterView().attackWarning === "", "attack option hidden from quiz encounter");
  } finally {
    stopSession(root3, session3);
  }

  const guru = {
    id: "mentor",
    char: "G",
    kind: "guru",
    name: "Senior-guru",
  };

  const { root: root4, session: session4 } = createSession();
  try {
    dispatch(session4, () => {
      session4.loadMapFromText(mapJson);
      session4.startEncounter(guru);
    });
    assert(session4.needsEncounterQuiz() === true, "guru uses quiz bank");
    assert(needsEncounterQuiz(session4) === true, "JS needsEncounterQuiz matches guru");

    dispatch(session4, () => {
      session4.onEncounterChoice("talk");
    });
    assert(session4.encounterResult === "quiz", "guru talk routes to quiz");

    const guruQuiz = getEncounterQuiz(session4, emptyQuizHistory(), { nextPickNonce: () => 1 });
    assert(guruQuiz?.question?.prompt, "guru quiz question picked");
    assert(guruQuiz.question.audiences.includes("guru"), "guru quiz audience");
    assert(!guruQuiz.greeting.includes("auto loitsu = 42"), "guru quiz is not fixed intro story");

    const hist = recordQuizAnswer(emptyQuizHistory(), guru.id, guruQuiz.question.id, true);
    clearEncounterQuizCache();
    const guruQuiz2 = getEncounterQuiz(session4, hist, { nextPickNonce: () => 2 });
    assert(guruQuiz2.question.id !== guruQuiz.question.id, "second guru quiz differs after history");
  } finally {
    stopSession(root4, session4);
  }

  const police = {
    id: "police-0-1",
    char: "P",
    kind: "police",
    name: "Pääovien poliisi",
  };

  const { root: root5, session: session5 } = createSession();
  try {
    dispatch(session5, () => {
      session5.loadMapFromText(mapJson);
      session5.startEncounter(police);
    });
    assert(session5.screen === "ending", "police encounter ends immediately");
    assert(session5.conduct.arrested === true, "police encounter arrests player");
    const ending = session5.getEndingView();
    assert(ending.lines.some((line) => line.includes("Inventaario")), "ending shows inventory");
    assert(ending.lines.some((line) => line.includes("Osasit")), "ending shows strengths");
    assert(ending.lines.some((line) => line.includes("Parannettavaa")), "ending shows improvements");
    dispatch(session5, () => {
      session5.onMapKey("enter");
    });
    assert(session5.screen === "prison", "ending continues to prison view");
  } finally {
    stopSession(root5, session5);
  }

  const { root: root6, session: session6 } = createSession();
  try {
    dispatch(session6, () => {
      session6.loadMapFromText(mapJson);
      session6.beginStory(caughtStoryJson);
    });
    assert(session6.screen === "story", "caught story starts");
    dispatch(session6, () => {
      session6.onStoryNarrativeAdvance();
    });
    assert(session6.screen === "ending", "caught story ends in jail summary");
  } finally {
    stopSession(root6, session6);
  }

  return true;
}

const isMain =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  runEncounterTests();
  console.log("encounter tests OK");
}
