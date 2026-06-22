/**
 * Shared Corporate NetHack web game controller — Node (play:web) and static browser build.
 */
import {
  getEncounterQuiz,
  needsEncounterQuiz,
  buildQuizSideMenu,
  buildQuizReaction,
  buildAskColleagueReply,
  buildAiStudyText,
  buildNpcMehReply,
  pickOfficeJoke,
  AI_STUDY_KARMA_COST,
  clearEncounterQuizCache,
} from "../terminal/encounterQuestions.mjs";
import {
  normalizeQuizHistory,
  recordQuizAnswer,
  recordQuizShown,
} from "../terminal/quizHistory.mjs";
import {
  normalizeStudyBacklog,
  markWantMoreStudy,
  recordWrongAnswer,
  questionMetaFromQuiz,
  studyBacklogCounts,
  formatStudyList,
} from "../terminal/studyBacklog.mjs";
import {
  collectAllCastFromSession,
  collectStaffFromSession,
  formatCastRosterText,
} from "../terminal/staffRoster.mjs";
import {
  normalizePersonRegistry,
  emptyPersonRegistry,
  recordPersonEncounter,
  applyMapPersonDisplay,
  checkFloorRecommendationAccess,
  elevatorKeyToFloorIndex,
  getFloorRecommendationStatus,
} from "../terminal/personStatus.mjs";
import { findPendingEntity } from "../terminal/encounterQuestions.mjs";

/**
 * @param {{
 *   mapJson: string,
 *   storyCatalog: { findById: (id: string) => { id?: string, filename?: string } | null },
 *   gameHost: {
 *     createGameSession: Function,
 *     dispatch: Function,
 *     stopGameSession: Function,
 *     sessionMap: Function,
 *     beginStory: Function,
 *     sendStoryNarrative: Function,
 *     sendStoryChoice: Function,
 *     sendStoryCode: Function,
 *     sendStoryDismissFeedback: Function,
 *   },
 *   loadSave: () => Record<string, unknown> | null,
 *   persistSave: (karma: unknown, deaths: number, quizHistory: unknown, studyBacklog: unknown, progress: unknown, personRegistry: unknown) => void,
 *   loadStoryJson: (summary: { id?: string, filename?: string } | null) => string | null,
 *   castListEnabled?: () => boolean,
 * }} deps
 */
export function createWebGameController(deps) {
  const {
    mapJson,
    storyCatalog,
    gameHost,
    loadSave,
    persistSave,
    loadStoryJson,
    castListEnabled = () => true,
  } = deps;
  const {
    createGameSession,
    dispatch,
    stopGameSession,
    sessionMap,
    beginStory,
    sendStoryNarrative,
    sendStoryChoice,
    sendStoryCode,
    sendStoryDismissFeedback,
  } = gameHost;

  let save = loadSave() ?? {};
  const { root, session } = createGameSession(save);
  let quizHistoryState = normalizeQuizHistory(save?.quizHistory);
  let studyBacklogState = normalizeStudyBacklog(save?.studyBacklog);
  let personRegistryState = normalizePersonRegistry(save?.personRegistry);
  let interviewPickNonce = save?.progress?.interviewPickNonce ?? 0;
  let guruPickNonce = save?.progress?.guruPickNonce ?? 0;
  /** @type {null | { type: string, [key: string]: unknown }} */
  let overlay = null;
  let quizRecordedKey = "";
  /** @type {null | Record<string, unknown>} */
  let activeStory = null;
  let castListOpen = false;

  dispatch(session, () => {
    session.loadMapFromText(mapJson);
    if (save?.features?.ids) {
      session.applySave(save.features.ids, save.features.amounts ?? [], save.deaths ?? 0);
    } else {
      session.karma.add("debug:boot", 50);
    }
    sessionMap(session).ensurePlayerOnWalkable();
  });

  function resetWebSession(keepProgress = true) {
  overlay = null;
  activeStory = null;
  castListOpen = false;
  resetQuizSession();
    if (keepProgress) {
      const disk = loadSave();
    if (disk) {
      save = disk;
      quizHistoryState = normalizeQuizHistory(save.quizHistory);
      studyBacklogState = normalizeStudyBacklog(save.studyBacklog);
      personRegistryState = normalizePersonRegistry(save.personRegistry);
      interviewPickNonce = save.progress?.interviewPickNonce ?? 0;
      guruPickNonce = save.progress?.guruPickNonce ?? 0;
    }
  }
  dispatch(session, () => {
    session.loadMapFromText(mapJson);
    if (keepProgress && save?.features?.ids) {
      session.applySave(save.features.ids, save.features.amounts ?? [], save.deaths ?? 0);
      session.applyGuruProgress(
        !!save.progress?.guruIntroPassed,
        !!save.progress?.guruStoryAttempted,
        save.progress?.guruQuizCorrect ?? 0,
      );
    } else {
      session.karma.add("debug:boot", 50);
    }
    session.interviewPassed = false;
    session.interviewFailed = false;
    sessionMap(session).lastStatus = "Peli aloitettu alusta — pihamaalta.";
    sessionMap(session).ensurePlayerOnWalkable();
  });
}

function updateLocalSave() {
  save = save && typeof save === "object" ? save : {};
  save.deaths = session.exportDeaths();
  save.features = {
    ids: [...(session.karma.ids ?? [])],
    amounts: [...(session.karma.amounts ?? [])],
  };
  save.progress = {
    guruIntroPassed: !!session.guruIntroPassed,
    guruStoryAttempted: !!session.guruStoryAttempted,
    guruQuizCorrect: session.guruQuizCorrect ?? 0,
    interviewPickNonce,
    guruPickNonce,
  };
  save.quizHistory = quizHistoryState;
  save.studyBacklog = studyBacklogState;
  save.personRegistry = personRegistryState;
}

  function persistWeb() {
    updateLocalSave();
    persistSave(
      session.karma,
      session.exportDeaths(),
      quizHistoryState,
      studyBacklogState,
      save.progress,
      personRegistryState,
    );
  }

function pendingEncounterEntity() {
  return findPendingEntity(session) || {
    id: session.pendingEntityId,
    name: session.pendingEntityName,
    kind: session.pendingEntityKind,
    char: session.pendingEntityChar,
  };
}

function makeQuizPickOptions() {
  return {
    nextPickNonce(entityId) {
      if (entityId === "receptionist") {
        interviewPickNonce += 1;
      } else if (entityId === "mentor" || session.pendingEntityKind === "guru") {
        guruPickNonce += 1;
      }
      persistWeb();
      return entityId === "receptionist" ? interviewPickNonce : guruPickNonce;
    },
  };
}

  function loadStoryJsonLocal(summary) {
    return loadStoryJson(summary);
  }

  function codeAnswerMatches(story, nodeId, answer) {
  const node = story?.nodes?.[nodeId];
  if (!node || node.type !== "code") return false;
  const trimmed = answer.trim();
  const minLen = node.minLength ?? 1;
  const maxLen = node.maxLength ?? 200;
  if (trimmed.length < minLen || trimmed.length > maxLen) return false;
  return (node.answers || []).some((expected) => {
    if (node.ignoreCase) {
      return expected.toLowerCase() === trimmed.toLowerCase();
    }
    return expected === trimmed;
  });
}

function startStoryFromId(storyId) {
  if (!storyId) return false;
  const summary = storyCatalog.findById(storyId);
    const storyJson = loadStoryJsonLocal(summary);
  if (!storyJson) {
    dispatch(session, () => {
      sessionMap(session).lastStatus = `Tarinan "${storyId}" lataus epäonnistui.`;
      session.backToMap();
    });
    return false;
  }
  activeStory = JSON.parse(storyJson);
  const ok = beginStory(session, storyJson);
  if (!ok) {
    activeStory = null;
    return false;
  }
  resetQuizSession();
  persistWeb();
  return true;
}

function handleMenuKey(key) {
  if (key === "q") {
    dispatch(session, () => session.onMenuPick("q"));
    return;
  }
  if (key === "enter" || key === "m") {
    dispatch(session, () => session.onMenuPick("m"));
    return;
  }

  const idx = Number.parseInt(key, 10) - 1;
  if (Number.isNaN(idx) || idx < 0) {
    return;
  }

  let summary = null;
  dispatch(session, () => {
    summary = session.findStoryByIndex(idx);
  });
  if (!summary?.id) {
    dispatch(session, () => session.onMenuPick("???"));
    persistWeb();
    return;
  }
  startStoryFromId(summary.id);
}

function processEncounterAfterChoice() {
  const result = session.encounterResult;
  if (result === "card_return") {
    overlay = {
      type: "cardReturn",
      entityName: session.pendingEntityName || "Työkaveri",
    };
    return;
  }
  if (result === "quiz") {
    resetQuizSession();
    return;
  }
  if (result === "talk") {
    const storyId = session.pendingStoryId;
    if (storyId) {
      startStoryFromId(storyId);
    }
  }
}

function resetQuizSession() {
  quizRecordedKey = "";
  clearEncounterQuizCache();
}

function ensureQuizRecorded(quiz) {
  if (!quiz?.entity?.id || !quiz?.question?.id) return;
  const key = `${quiz.entity.id}:${quiz.question.id}`;
  if (quizRecordedKey === key) return;
  quizRecordedKey = key;
  quizHistoryState = recordQuizShown(quizHistoryState, quiz.entity.id, quiz.question.id);
  recordPersonEncounter(personRegistryState, quiz.entity, { tone: "meet" });
  persistWeb();
}

function buildEncounterSnapshot(base) {
  const view = session.getEncounterView();
  const isQuiz = needsEncounterQuiz(session);
  const payload = {
    ...base,
    encounter: {
      mode: isQuiz ? "quiz" : "dialog",
      char: view.entityChar,
      name: view.entityName,
      greeting: view.greeting,
      attackWarning: view.attackWarning,
      hintLine: view.hintLine,
      isHostile: view.isHostile,
    },
  };

  if (overlay) {
    payload.overlay = serializeOverlay(overlay);
    return payload;
  }

  if (isQuiz) {
    const quiz = getEncounterQuiz(session, quizHistoryState, makeQuizPickOptions());
    if (quiz) {
      ensureQuizRecorded(quiz);
      const side = buildQuizSideMenu(quiz.entity, session);
      payload.quiz = {
        greeting: quiz.greeting,
        choices: quiz.question.choices.map((c, i) => ({
          n: i + 1,
          text: c.text,
        })),
        sideMenu: {
          aiCost: AI_STUDY_KARMA_COST,
          jokeLabel: side.jokeLabel,
          mehLabel: side.mehLabel,
          leaveLabel: side.leaveLabel,
          askColleagueLabel: side.askColleagueLabel || "",
        },
      };
    }
  } else {
    payload.dialogOptions = [
      { key: "1", label: "Juttele", style: "normal" },
      { key: "2", label: "Hyökkää kimppuun", style: "danger" },
      { key: "3", label: "Kerro vitsi", style: "normal" },
      { key: "4", label: "Poistu kohtaamisesta", style: "muted" },
    ];
  }

  return payload;
}

function serializeOverlay(ov) {
  if (ov.type === "outcome") {
    return {
      type: "outcome",
      correct: ov.correct,
      reaction: ov.reaction,
      teaching: ov.teaching,
      karmaHint: ov.correct
        ? `+${ov.points} karma`
        : "-3 karma",
      marked: ov.marked === true,
    };
  }
  if (ov.type === "aiStudy") {
    return {
      type: "aiStudy",
      cost: AI_STUDY_KARMA_COST,
      entityName: ov.entityName,
      text: ov.text,
    };
  }
  if (ov.type === "banter") {
    return {
      type: "banter",
      kind: ov.kind,
      title: ov.kind === "joke" ? "Vitsi" : "Vetäytyminen",
      playerLine: ov.playerLine,
      npcLine: ov.npcLine,
      entityName: ov.entityName,
    };
  }
  if (ov.type === "cardReturn") {
    return {
      type: "cardReturn",
      entityName: ov.entityName,
    };
  }
  return { type: ov.type };
}

function elevatorFloorKey(index) {
  return index === 9 ? "0" : String(index + 1);
}

function buildElevatorSnapshot(map) {
  if (!map?.isOnElevator?.()) {
    return { onElevator: false, floors: [] };
  }
  const count = Math.min(map.floorCount?.() ?? 0, 10);
  const floors = [];
  for (let i = 0; i < count; i += 1) {
    const floor = map.floors?.[i];
    floors.push({
      key: elevatorFloorKey(i),
      index: i,
      title: floor?.title || `Kerros ${i + 1}`,
      current: i === map.currentFloor,
      hasElevator: map.findElevatorOnFloor?.(i) ?? false,
    });
  }
  return { onElevator: true, floors };
}

function snapshot() {
  const map = sessionMap(session);
  const cast = collectAllCastFromSession(session);
  const base = {
    screen: session.screen,
    shouldQuit: session.shouldQuit,
    deaths: session.exportDeaths(),
    karma: session.karma.total(),
    generation: session.__rangerStateGeneration,
    encounterCooldown: session.encounterCooldown ?? 0,
    policeChase: map?.policeChaseActive ?? false,
    agentCount: map?.activeFloor()?.entities?.filter((e) => e.isAgent)?.length ?? 0,
    entityCount: map?.activeFloor()?.entities?.length ?? 0,
    floor: map?.currentFloor ?? 0,
    player: { x: map?.playerX, y: map?.playerY, hidden: map?.playerHidden },
    status: map?.lastStatus ?? "",
    studyCounts: studyBacklogCounts(studyBacklogState),
    staffRoster: collectStaffFromSession(session).map((s) => ({
      id: s.id,
      name: s.name,
      firstName: s.firstName,
      kind: s.kind,
      floor: s.floor,
      floorTitle: s.floorTitle,
    })),
    debugCastList: castListEnabled(),
    castListOpen,
    castList: cast,
    castListText: formatCastRosterText(cast),
  };

  if (session.screen === "map" || session.screen === "prison" || session.screen === "gameover") {
    const view = session.getMapView();
    const elevator = buildElevatorSnapshot(map);
    const floorRec = getFloorRecommendationStatus(session, personRegistryState, map?.currentFloor ?? 0);
    const lines = applyMapPersonDisplay(view.lines, map, personRegistryState, {
      x: view.cameraX,
      y: view.cameraY,
    });
    return {
      ...base,
      mapTitle: view.mapTitle,
      floorTitle: view.floorTitle,
      status: view.statusLine || base.status,
      ambient: view.ambientLine,
      time: view.timeLine,
      hint: view.hintLine,
      lines,
      camera: { x: view.cameraX, y: view.cameraY },
      onElevator: elevator.onElevator,
      elevatorFloors: elevator.floors,
      floorRecommendation: floorRec,
    };
  }

  if (session.screen === "encounter") {
    return buildEncounterSnapshot(base);
  }

  if (session.screen === "studylist") {
    return {
      ...base,
      studyListText: formatStudyList(studyBacklogState),
      studyBacklog: studyBacklogState,
    };
  }

  if (session.screen === "inventory") {
    const view = session.getInventoryView();
    return {
      ...base,
      inventoryLines: [...(view.lines || [])],
    };
  }

  if (session.screen === "menu") {
    const items = session.catalogList();
    return {
      ...base,
      menuMessage: session.menuMessage,
      menuItems: items.map((s, i) => ({
        n: i + 1,
        title: s.title,
        description: s.description,
      })),
    };
  }

  if (session.screen === "story") {
    const view = session.getStoryView();
    return {
      ...base,
      story: {
        title: view.storyTitle,
        nodeTitle: view.nodeTitle,
        screen: view.screen,
        nodeKind: view.nodeKind,
        body: view.bodyText?.slice(0, 4000),
        choiceTexts: [...(view.choiceTexts || [])],
        codeTemplate: view.codeTemplate,
        codeHint: view.codeHint,
        feedbackMessage: view.feedbackMessage,
        feedbackCorrect: view.feedbackCorrect,
        pointsEarned: view.pointsEarned,
        outcome: view.outcome,
        totalPoints: view.totalPoints,
      },
    };
  }

  return base;
}

function dismissOverlay() {
  if (!overlay) return;

  if (overlay.type === "outcome") {
    const entity = pendingEncounterEntity();
    recordPersonEncounter(personRegistryState, entity, { correct: overlay.correct });
    dispatch(session, () => {
      session.finishEncounterQuiz(
        overlay.correct,
        overlay.featureId,
        overlay.points,
        overlay.reaction,
      );
    });
    quizHistoryState = recordQuizAnswer(
      quizHistoryState,
      overlay.entityId,
      overlay.questionId,
      overlay.correct,
    );
    persistWeb();
  } else if (overlay.type === "banter") {
    const entity = pendingEncounterEntity();
    if (overlay.kind === "meh") {
      recordPersonEncounter(personRegistryState, entity, { tone: "meh" });
      dispatch(session, () => {
        session.dismissEncounterQuiz("meh", overlay.npcReply);
      });
    } else if (overlay.kind === "colleague") {
      recordPersonEncounter(personRegistryState, entity, { tone: "talk" });
      dispatch(session, () => {
        session.dismissEncounterQuiz("leave", overlay.npcReply);
      });
    } else if (overlay.kind === "joke") {
      recordPersonEncounter(personRegistryState, entity, { tone: "joke" });
      dispatch(session, () => {
        session.onEncounterChoice("joke");
      });
    }
  }
  overlay = null;
  resetQuizSession();
}

function handleOverlayKey(key) {
  if (overlay?.type === "cardReturn") {
    if (key === "1") {
      dispatch(session, () => session.returnCoworkerCard());
      overlay = null;
      resetQuizSession();
      persistWeb();
      return true;
    }
    if (key === "2") {
      dispatch(session, () => session.keepCoworkerCardLie());
      overlay = null;
      resetQuizSession();
      persistWeb();
      return true;
    }
    if (key === "3" || key === "4") {
      dispatch(session, () => {
        sessionMap(session).lastStatus = "Vetäydyt takaisin.";
        session.clearEncounter();
        session.screen = "map";
      });
      overlay = null;
      resetQuizSession();
      persistWeb();
      return true;
    }
    return true;
  }
  if (overlay?.type === "outcome" && (key === "m" || key === "merkitse")) {
    if (!overlay.marked && overlay.quizMeta) {
      studyBacklogState = markWantMoreStudy(studyBacklogState, overlay.quizMeta);
      overlay.marked = true;
    }
    return true;
  }
  if (key === "enter" || key === " ") {
    dismissOverlay();
    return true;
  }
  if (key === "q") {
    dispatch(session, () => {
      session.shouldQuit = true;
    });
    return true;
  }
  return false;
}

function handleQuizKey(key) {
  const quiz = getEncounterQuiz(session, quizHistoryState, makeQuizPickOptions());
  if (!quiz) {
    dispatch(session, () => {
      sessionMap(session).lastStatus = "Kohtaamisen kysymystä ei löytynyt.";
      session.backToMap();
    });
    return;
  }
  ensureQuizRecorded(quiz);

  if (key === "p" || key === "poistu") {
    dispatch(session, () => {
      session.dismissEncounterQuiz("leave", "Vetäydyt takaisin hiljaa.");
    });
    resetQuizSession();
    return;
  }

  if (key === "h" || key === "hyökkää") {
    dispatch(session, () => {
      session.onEncounterChoice("attack");
    });
    resetQuizSession();
    return;
  }

  if (key === "n" || key === "kollega") {
    const side = buildQuizSideMenu(quiz.entity, session);
    if (!side.askColleagueLabel) {
      dispatch(session, () => {
        sessionMap(session).lastStatus = "Tämä ei ole kollega-kohtaaminen.";
      });
      return;
    }
    const npcReply = buildAskColleagueReply(quiz.entity, session);
    overlay = {
      type: "banter",
      kind: "colleague",
      entityName: quiz.entity.name,
      playerLine: side.askColleagueLabel,
      npcLine: npcReply,
      npcReply,
    };
    return;
  }

  if (key === "i" || key === "sama" || key === "meh") {
    const side = buildQuizSideMenu(quiz.entity, session);
    overlay = {
      type: "banter",
      kind: "meh",
      entityName: quiz.entity.name,
      playerLine: side.mehLabel,
      npcLine: buildNpcMehReply(quiz.entity),
      npcReply: buildNpcMehReply(quiz.entity),
    };
    return;
  }

  if (key === "j" || key === "vitsi") {
    const name = quiz.entity.name || "Kollega";
    overlay = {
      type: "banter",
      kind: "joke",
      entityName: name,
      playerLine: pickOfficeJoke(quiz.entity, quiz.question),
      npcLine: `${name} hymähtää — tai ei.`,
    };
    return;
  }

  if (key === "a" || key === "ai" || key === "kysy") {
    const cost = AI_STUDY_KARMA_COST;
    if (session.karma.total() < cost) {
      dispatch(session, () => {
        sessionMap(session).lastStatus = `Tarvitset vähintään ${cost} karmaa AI-opetukseen.`;
      });
      return;
    }
    let charged = false;
    dispatch(session, () => {
      charged = session.askEncounterAiStudy(cost);
    });
    if (!charged) return;
    overlay = {
      type: "aiStudy",
      entityName: quiz.entity?.name || session.pendingEntityName,
      text: buildAiStudyText(quiz.question),
    };
    return;
  }

  const idx = Number(key) - 1;
  if (Number.isNaN(idx) || idx < 0 || idx >= quiz.question.choices.length) {
    dispatch(session, () => {
      sessionMap(session).lastStatus = "Valitse 1–4, n, a, j, i, p tai h.";
    });
    return;
  }

  const choice = quiz.question.choices[idx];
  const correct = choice.correct;
  const teaching = correct ? quiz.question.correctFeedback : quiz.question.wrongFeedback;
  if (!correct) {
    studyBacklogState = recordWrongAnswer(
      studyBacklogState,
      questionMetaFromQuiz(quiz, false, teaching),
    );
  }
  overlay = {
    type: "outcome",
    correct,
    reaction: buildQuizReaction(quiz.entity, correct, session),
    teaching,
    featureId: quiz.question.featureId || "",
    points: quiz.question.featurePoints || 0,
    entityId: quiz.entity.id,
    questionId: quiz.question.id,
    quizMeta: questionMetaFromQuiz(quiz, correct, teaching),
    marked: false,
  };
}

function handleStoryCode(answer) {
  const nodeId = session.engine?.currentNodeId;
  const matches = codeAnswerMatches(activeStory, nodeId, answer);
  sendStoryCode(session, answer, matches);
  persistWeb();
}

function handleStoryKey(key) {
  const view = session.getStoryView();

  if (view.screen === "playing") {
    if (view.nodeKind === "narrative") {
      if (key === "enter" || key === " ") {
        sendStoryNarrative(session);
        persistWeb();
      }
      return;
    }
    if (view.nodeKind === "choice") {
      const idx = Number(key) - 1;
      const choices = view.choiceTexts || [];
      if (!Number.isNaN(idx) && idx >= 0 && idx < choices.length) {
        sendStoryChoice(session, idx);
        persistWeb();
      }
      return;
    }
    return;
  }

  if (view.screen === "feedback") {
    if (key === "enter" || key === " ") {
      sendStoryDismissFeedback(session);
      persistWeb();
    }
    return;
  }

  if (view.screen === "ended") {
    if (key === "enter" || key === " ") {
      dispatch(session, () => session.backToMap());
      activeStory = null;
      persistWeb();
    }
  }
}

function handleKey(key) {
  if (castListOpen) {
    if (key === "q") {
      dispatch(session, () => {
        session.shouldQuit = true;
      });
    }
    castListOpen = false;
    return;
  }

  if (castListEnabled() && key === "o" && session.screen === "map") {
    castListOpen = true;
    return;
  }

  if (overlay) {
    handleOverlayKey(key);
    return;
  }

  if (session.screen === "encounter") {
    if (needsEncounterQuiz(session)) {
      handleQuizKey(key);
      return;
    }
    const choiceMap = {
      "1": "talk",
      "2": "attack",
      "3": "joke",
      "4": "leave",
    };
    const choice = choiceMap[key];
    if (choice) {
      if (choice === "talk" || choice === "joke") {
        recordPersonEncounter(personRegistryState, pendingEncounterEntity(), { tone: choice });
      }
      dispatch(session, () => session.onEncounterChoice(choice));
      processEncounterAfterChoice();
      persistWeb();
      return;
    }
    return;
  }

  if (session.screen === "story") {
    handleStoryKey(key);
    return;
  }

  if (session.screen === "menu") {
    handleMenuKey(key);
    return;
  }

  if (key === "enter") {
    if (
      session.screen === "prison" ||
      session.screen === "gameover" ||
      session.screen === "studylist" ||
      session.screen === "inventory"
    ) {
      dispatch(session, () => session.onMapKey("enter"));
    }
    return;
  }

  if (session.screen === "map" && /^[0-9]$/.test(key)) {
    const map = sessionMap(session);
    if (map?.isOnElevator?.()) {
      const target = elevatorKeyToFloorIndex(key);
      if (target >= 0 && target > (map.currentFloor ?? 0)) {
        let allowed = true;
        dispatch(session, () => {
          allowed = session.canAccessFloor(target);
        });
        if (allowed) {
          const recCheck = checkFloorRecommendationAccess(session, personRegistryState, target);
          if (!recCheck.ok) {
            dispatch(session, () => {
              map.lastStatus = recCheck.message;
            });
            return;
          }
        }
      }
    }
  }

  dispatch(session, () => session.onMapKey(key));
  }

  return {
    root,
    session,
    snapshot,
    handleKey,
    handleStoryCode,
    reset: resetWebSession,
    stop: () => stopGameSession(root, session),
  };
}
