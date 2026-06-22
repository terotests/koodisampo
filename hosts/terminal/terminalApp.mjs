import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { BOLD, FG, RESET, BG, colorize, colorizeMapLine, colorizePolice, colorizeRecommended, styled } from "./ansi.mjs";
import { drawFrame, drawFrameClear, drawLines, drawLinesClear, enterGameScreen, leaveGameScreen } from "./screen.mjs";
import { createKeyReader, getStdinHub } from "./rawKeys.mjs";
import { isQuitKeyName, isQuitLine, isTerminalClosedKey, readKey, readLine, QUIT_HINT } from "./promptInput.mjs";
import {
  applyPlayerSave,
  defaultSaveFile,
  loadPlayerSave,
  savePlayerSave,
} from "./playerSave.mjs";
import {
  emptyQuizHistory,
  normalizeQuizHistory,
  recordQuizAnswer,
  recordQuizShown,
} from "./quizHistory.mjs";
import {
  emptyStudyBacklog,
  normalizeStudyBacklog,
  markWantMoreStudy,
  recordWrongAnswer,
  questionMetaFromQuiz,
  studyBacklogCounts,
  formatStudyList,
} from "./studyBacklog.mjs";
import {
  beginStory,
  createGameSession,
  dispatch,
  sendEncounterChoice,
  sendMapKey,
  sendMenuPick,
  requestQuit,
  sendStoryChoice,
  sendStoryCode,
  sendStoryDismissFeedback,
  sendStoryNarrative,
  stopGameSession,
  sessionMap,
} from "./gameHost.mjs";
import {
  getEncounterQuiz,
  needsEncounterQuiz,
  buildQuizReaction,
  buildAiStudyText,
  AI_STUDY_KARMA_COST,
  buildQuizSideMenu,
  pickOfficeJoke,
  buildNpcMehReply,
  buildAskColleagueReply,
  clearEncounterQuizCache,
} from "./encounterQuestions.mjs";
import { castListEnabledForTerminal } from "./debugFlags.mjs";
import { collectAllCastFromSession, formatCastRosterText } from "./staffRoster.mjs";
import {
  emptyPersonRegistry,
  normalizePersonRegistry,
  recordPersonEncounter,
  applyMapPersonDisplay,
  checkFloorRecommendationAccess,
  elevatorKeyToFloorIndex,
  getFloorRecommendationStatus,
} from "./personStatus.mjs";
import {
  buildMenuItems,
  menuItemByNumber,
  partitionMenuStories,
} from "./storyMenu.mjs";

let quizHistoryState = emptyQuizHistory();
let studyBacklogState = emptyStudyBacklog();
let personRegistryState = emptyPersonRegistry();
let castListOpen = false;
let interviewPickNonce = 0;
let guruPickNonce = 0;

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "../..");
const storiesDir = resolve(projectRoot, "content/stories");
const SAVE_FILE = defaultSaveFile();

const require = createRequire(import.meta.url);
const { StoryCatalog } = require(resolve(projectRoot, "generated/es6/koodisampo.cjs"));

const BANNER = styled(`
╔══════════════════════════════════════════════════╗
║  KOODISAMPO — Corporate NetHack (terminaali)   ║
║  Selviydy toimistosta. Opiskele C++:ää.        ║
╚══════════════════════════════════════════════════╝
`, FG.cyan, BOLD);

function policeTileSet(session) {
  const map = sessionMap(session);
  if (!map?.policeChaseActive) return null;
  const floor = map.activeFloor();
  const set = new Set();
  for (let i = 0; i < floor.entities.length; i += 1) {
    const e = floor.entities[i];
    if (e.kind === "police") set.add(`${e.x},${e.y}`);
  }
  return set;
}

function colorizeMapLineAt(line, cameraX, cameraY, policeSet, recommendedSet, viewRow) {
  if (!policeSet?.size && !recommendedSet?.size) return colorizeMapLine(line);
  let out = "";
  for (let i = 0; i < line.length; i += 1) {
    const mx = cameraX + i;
    const my = cameraY;
    const ch = line[i];
    if (policeSet?.has(`${mx},${my}`)) {
      out += colorizePolice(ch);
    } else if (recommendedSet?.has(`${viewRow},${i}`)) {
      out += colorizeRecommended(ch);
    } else {
      out += colorize(ch);
    }
  }
  return out;
}

function buildMapFrame(session) {
  const view = session.getMapView();
  const map = sessionMap(session);
  const policeSet = policeTileSet(session);
  const lines = [];
  lines.push(BANNER);
  lines.push(`\n  ${styled(view.mapTitle, FG.yellow, BOLD)}`);
  if (view.floorTitle) {
    lines.push(`  ${styled(view.floorTitle, FG.cyan)}`);
  }
  lines.push(
    `  ${styled("Kuolemat:", FG.gray)} ${session.exportDeaths()}   |   ${styled("Karma:", FG.gray)} ${styled(String(session.karma.total()), FG.brightGreen)}   |   ${styled(`@${view.playerMapX},${view.playerMapY}`, FG.gray)} / ${view.mapWidth}×${view.mapHeight}`,
  );
  if (view.toolsLine) {
    lines.push(`  ${styled(view.toolsLine, FG.magenta)}`);
  }
  if (view.conductLine) {
    const proprietyMatch = view.conductLine.match(/Asiallisuus: (\d+)/);
    const propriety = proprietyMatch ? Number(proprietyMatch[1]) : 100;
    const conductColor =
      view.conductLine.includes("ETSINTÄ") || propriety <= 85 ? FG.red : FG.gray;
    lines.push(`  ${styled(view.conductLine, conductColor)}`);
  }
  if (view.timeLine) {
    lines.push(`  ${styled(view.timeLine, FG.cyan)}`);
  }
  const studyCounts = studyBacklogCounts(studyBacklogState);
  if (studyCounts.total > 0) {
    lines.push(
      `  ${styled(`Opiskelulista (b): ${studyCounts.wantMore} Kysy AI:lta, ${studyCounts.wrongAnswers} väärin`, FG.magenta)}`,
    );
  }
  if (view.ambientLine) {
    lines.push(`  ${styled(view.ambientLine, FG.cyan)}`);
  }
  if (map?.policeChaseActive) {
    lines.push(`  ${styled("⚠ POLIISIT TAKAA-AJAVAT — P mustalla pohjalla!", FG.red, BOLD)}`);
  }
  const floorRec = getFloorRecommendationStatus(session, personRegistryState, map?.currentFloor ?? 0);
  if (floorRec.total > 0 && !floorRec.complete) {
    lines.push(
      `  ${styled(`Suositukset tältä kerrokselta: ${floorRec.done}/${floorRec.total} (tarvitaan kaikilta ennen ylemmäs)`, FG.magenta)}`,
    );
  }
  lines.push("");
  const mapDisplay = applyMapPersonDisplay(view.lines, map, personRegistryState, {
    x: view.cameraX,
    y: view.cameraY,
  });
  const recommendedSet = new Set(mapDisplay.recommendedCells);
  for (let i = 0; i < mapDisplay.lines.length; i += 1) {
    const mapY = view.cameraY + i;
    lines.push(`  ${colorizeMapLineAt(mapDisplay.lines[i], view.cameraX, mapY, policeSet, recommendedSet, i)}`);
  }
  if (view.statusLine) {
    const status = view.statusLine;
    if (status.startsWith("✗")) {
      lines.push(`\n  ${styled(status, FG.red)}`);
    } else if (status.startsWith("✓")) {
      lines.push(`\n  ${styled(status, FG.brightGreen)}`);
    } else {
      lines.push(`\n  ${styled(status, FG.yellow)}`);
    }
  }
  lines.push(`\n  ${styled(view.hintLine, FG.gray)}`);
  return lines.join("\n");
}

function printMap(session, fullClear = false) {
  const frame = buildMapFrame(session);
  if (fullClear) {
    drawFrameClear(frame);
  } else {
    drawFrame(frame);
  }
}

function wrap(text, width = 72) {
  const lines = String(text || "").split("\n");
  const out = [];
  for (const line of lines) {
    if (line.startsWith("```")) {
      out.push(line);
      continue;
    }
    let rest = line;
    while (rest.length > width) {
      let breakAt = rest.lastIndexOf(" ", width);
      if (breakAt < 1) breakAt = width;
      out.push(rest.slice(0, breakAt).trimEnd());
      rest = rest.slice(breakAt).trimStart();
    }
    out.push(rest);
  }
  return out.join("\n");
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

function loadStoryJson(summary) {
  if (!summary?.id) return null;
  try {
    return readFileSync(resolve(storiesDir, summary.filename), "utf8");
  } catch {
    return null;
  }
}

function makeQuizPickOptions(session) {
  return {
    nextPickNonce(entityId) {
      if (entityId === "receptionist") {
        interviewPickNonce += 1;
        if (session) persist(session);
        return interviewPickNonce;
      }
      guruPickNonce += 1;
      if (session) persist(session);
      return guruPickNonce;
    },
  };
}

function persistProgress(session) {
  return {
    guruIntroPassed: session.guruIntroPassed,
    guruStoryAttempted: session.guruStoryAttempted,
    guruQuizCorrect: session.guruQuizCorrect,
    interviewPickNonce,
    guruPickNonce,
  };
}

function persist(session) {
  schedulePersist(session);
}

let persistTimer = null;
let persistPending = null;

function schedulePersist(session) {
  persistPending = session;
  if (persistTimer) return;
  persistTimer = setTimeout(() => {
    persistTimer = null;
    const s = persistPending;
    persistPending = null;
    if (!s) return;
    savePlayerSave(
      s.karma,
      s.exportDeaths(),
      quizHistoryState,
      studyBacklogState,
      persistProgress(s),
      personRegistryState,
    );
  }, 400);
}

function flushPersist(session) {
  if (persistTimer) {
    clearTimeout(persistTimer);
    persistTimer = null;
  }
  persistPending = null;
  savePlayerSave(
    session.karma,
    session.exportDeaths(),
    quizHistoryState,
    studyBacklogState,
    persistProgress(session),
    personRegistryState,
  );
}

function pendingEncounterEntity(session) {
  return {
    id: session.pendingEntityId,
    name: session.pendingEntityName,
    kind: session.pendingEntityKind,
    char: session.pendingEntityChar,
  };
}

function trySendMapKey(session, keyName) {
  if (/^[0-9]$/.test(keyName)) {
    const map = sessionMap(session);
    if (map?.isOnElevator?.()) {
      const target = elevatorKeyToFloorIndex(keyName);
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
  sendMapKey(session, keyName);
}

async function tryStartPendingStory(session) {
  if (session.encounterResult !== "action_story" || !session.pendingStoryId) return false;
  const catalog = new StoryCatalog();
  const summary = catalog.findById(session.pendingStoryId);
  const storyJson = loadStoryJson(summary);
  dispatch(session, () => {
    session.pendingStoryId = "";
    session.encounterResult = "";
  });
  if (!storyJson) {
    dispatch(session, () => {
      sessionMap(session).lastStatus = "Tarinan lataus epäonnistui.";
    });
    return true;
  }
  await runStoryLoop(session, storyJson);
  return true;
}

async function runBlockedLoop(session) {
  while (session.screen === "blocked" && !session.shouldQuit) {
    const view = session.getBlockedView();
    const lines = [
      BANNER,
      `  ${styled("═══ Este edessä ═══", FG.cyan, BOLD)}`,
      "",
    ];
    if (view.targetName) {
      lines.push(`  ${styled("Kohde:", FG.gray)} ${view.targetName}`);
      lines.push("");
    }
    let n = 1;
    if (view.canTalk) {
      lines.push(`  ${styled(`[${n}]`, FG.yellow)} Juttele — ${view.talkName}`);
      n += 1;
    }
    if ((view.toolIds?.length ?? 0) > 0) {
      lines.push(`  ${styled(`[${n}]`, FG.yellow)} Käytä työkalua`);
      n += 1;
    }
    lines.push(`  ${styled(`[${n}]`, FG.gray)} Peruuta`);
    lines.push("");
    lines.push(`  ${styled(view.hintLine, FG.gray)}`);
    lines.push(`  ${styled(QUIT_HINT, FG.gray)}`);
    drawLinesClear(lines);
    const result = await readLine(styled("\n  Valinta: ", FG.cyan));
    if (handleQuitInput(session, result)) return;
    sendMapKey(session, String(result.value || "").trim());
    persist(session);
  }
}

async function runActionLoop(session) {
  while (session.screen === "action" && !session.shouldQuit) {
    const view = session.getActionView();
    if (view.mode === "result") {
      drawLinesClear([
        BANNER,
        `  ${styled("═══ Tulos ═══", FG.cyan, BOLD)}`,
        "",
        wrap(view.resultMessage || ""),
        "",
        `  ${styled("Paina Enter...", FG.gray)}`,
        `  ${styled(QUIT_HINT, FG.gray)}`,
      ]);
      const result = await readKey(styled("\n  ", FG.gray));
      if (handleQuitInput(session, result)) return;
      sendMapKey(session, result.type === "key" ? result.key : "enter");
      persist(session);
      if (session.screen === "map" && session.encounterResult === "action_story") {
        await tryStartPendingStory(session);
        persist(session);
      }
      continue;
    }
    const lines = [
      BANNER,
      `  ${styled("═══ Käytä työkalua ═══", FG.cyan, BOLD)}`,
      "",
      `  ${styled("Kohde:", FG.gray)} ${view.targetName || "Kohde"}`,
      "",
    ];
    const tools = view.toolIds || [];
    const labels = view.toolLabels || [];
    for (let i = 0; i < tools.length; i += 1) {
      lines.push(`  ${styled(`[${i + 1}]`, FG.yellow)} ${labels[i] || tools[i]}`);
    }
    lines.push(`  ${styled("[4]", FG.gray)} Peruuta`);
    lines.push("");
    lines.push(`  ${styled(view.hintLine, FG.gray)}`);
    lines.push(`  ${styled(QUIT_HINT, FG.gray)}`);
    drawLinesClear(lines);
    const result = await readLine(styled("\n  Valinta: ", FG.cyan));
    if (handleQuitInput(session, result)) return;
    sendMapKey(session, String(result.value || "").trim());
    persist(session);
  }
}

function printStory(session) {
  const view = session.getStoryView();
  const lines = [BANNER];
  if (view.storyTitle) {
    lines.push(`\n  ${styled(view.storyTitle, FG.yellow, BOLD)}`);
  }
  if (view.nodeTitle) {
    lines.push(`\n  ${styled(`── ${view.nodeTitle} ──`, FG.cyan)}`);
  }
  if (view.bodyText) {
    lines.push("\n" + wrap(view.bodyText));
  }
  if (view.codeTemplate) {
    lines.push(`\n  ${styled("Tehtävä:", FG.magenta)}`);
    lines.push("  " + styled(view.codeTemplate.replace(/\n/g, `\n${RESET}  `), FG.green));
  }
  if (view.codeHint) {
    lines.push(`\n  ${styled("Vihje:", FG.gray)} ${view.codeHint}`);
  }
  if (view.choiceTexts?.length) {
    lines.push("");
    for (let i = 0; i < view.choiceTexts.length; i += 1) {
      lines.push(`  ${styled(`[${i + 1}]`, FG.yellow)} ${view.choiceTexts[i]}`);
    }
  }
  if (view.screen === "feedback") {
    lines.push(`\n  ${styled("── Palaute ──", FG.cyan)}`);
    const mark = view.feedbackCorrect
      ? styled("✓", FG.brightGreen, BOLD)
      : styled("✗", FG.red, BOLD);
    lines.push(`  ${mark} ${wrap(view.feedbackMessage)}`);
    if (view.pointsEarned > 0) {
      lines.push(`\n  ${styled(`+${view.pointsEarned} pistettä`, FG.brightGreen)}`);
    }
  }
  if (view.screen === "ended") {
    lines.push(`\n  ${styled("── Loppu ──", FG.cyan)}`);
    if (view.outcome === "victory") {
      lines.push(`  ${styled("Voitto!", FG.brightGreen, BOLD)}`);
    } else if (view.outcome === "death") {
      lines.push(`  ${styled("Burnout — mutta opit jotain. Yritä uudelleen.", FG.red)}`);
    } else {
      lines.push("  Kohtaaminen päättyi.");
    }
    lines.push(`\n  ${styled("Pisteet:", FG.gray)} ${view.totalPoints}`);
  }
  drawLinesClear(lines);
}

function printMenu(session) {
  const lines = [BANNER];
  lines.push(
    `  ${styled("Kuolemat:", FG.gray)} ${session.exportDeaths()}   |   ${styled("Karma:", FG.gray)} ${session.karma.total()}\n`,
  );
  const { lessons, social } = partitionMenuStories(session.catalogList());
  if (lessons.length) {
    lines.push(`  ${styled("═══ Oppitunnit ═══", FG.cyan, BOLD)}`);
    let n = 1;
    for (const s of lessons) {
      lines.push(`  ${styled(`[${n}]`, FG.yellow)} ${s.title}`);
      lines.push(`      ${styled(s.description, FG.gray)}`);
      n += 1;
    }
    lines.push("");
  }
  if (social.length) {
    lines.push(`  ${styled("═══ Social chats ═══", FG.magenta, BOLD)}`);
    let n = lessons.length + 1;
    for (const s of social) {
      lines.push(`  ${styled(`[${n}]`, FG.yellow)} ${s.title}`);
      lines.push(`      ${styled(s.description, FG.gray)}`);
      n += 1;
    }
  }
  if (session.menuMessage) {
    lines.push(`\n  ${styled(session.menuMessage, FG.red)}`);
  }
  lines.push(`\n  ${styled("m", FG.cyan)} = takaisin toimistolle   ${styled(QUIT_HINT, FG.gray)}`);
  drawLinesClear(lines);
}

function handleQuitInput(session, result) {
  if (result?.type === "quit" || isQuitLine(result?.value)) {
    requestQuit(session);
    return true;
  }
  return false;
}

async function runStoryLoop(session, storyJson) {
  const story = JSON.parse(storyJson);
  if (!beginStory(session, storyJson)) {
    return;
  }

  while (session.screen === "story" && !session.shouldQuit) {
    printStory(session);
    const view = session.getStoryView();

    if (view.screen === "playing") {
      if (view.nodeKind === "narrative") {
        const result = await readKey(styled("\n  [Enter] ", FG.gray));
        if (handleQuitInput(session, result)) return;
        sendStoryNarrative(session);
        continue;
      }
      if (view.nodeKind === "choice") {
        const result = await readLine(styled("\n  Vastaus: ", FG.cyan));
        if (handleQuitInput(session, result)) return;
        const raw = result.value;
        const n = Number.parseInt(raw, 10);
        if (Number.isNaN(n) || n < 1 || n > view.choiceTexts.length) {
          drawFrameClear(styled("  Virheellinen valinta.", FG.red));
          await readKey(styled("  [Enter] ", FG.gray));
          continue;
        }
        sendStoryChoice(session, n - 1);
        persist(session);
        continue;
      }
      if (view.nodeKind === "code") {
        const result = await readLine(styled("\n  > ", FG.green));
        if (handleQuitInput(session, result)) return;
        const raw = result.value;
        const matches = codeAnswerMatches(story, session.engine.currentNodeId, raw);
        sendStoryCode(session, raw, matches);
        persist(session);
        continue;
      }
    }

    if (view.screen === "feedback") {
      const result = await readKey(styled("\n  [Enter] ", FG.gray));
      if (handleQuitInput(session, result)) return;
      sendStoryDismissFeedback(session);
      persist(session);
      continue;
    }

    if (view.screen === "ended") {
      const result = await readKey(styled("\n  [Enter] palaa kartalle ", FG.gray));
      if (handleQuitInput(session, result)) return;
      break;
    }
  }
}

async function runMenuLoop(session) {
  while (session.screen === "menu" && !session.shouldQuit) {
    printMenu(session);
    const result = await readLine(styled("\n  Valitse oppitunti: ", FG.cyan));
    if (handleQuitInput(session, result)) return;
    const pick = result.value;

    if (pick.toLowerCase() === "m" || pick === "") {
      sendMenuPick(session, "m");
      return;
    }

    const menuItems = buildMenuItems(session.catalogList());
    const item = menuItemByNumber(menuItems, pick);
    if (!item?.storyId) {
      sendMenuPick(session, "???");
      continue;
    }

    let summary = null;
    dispatch(session, () => {
      summary = session.catalog.findById(item.storyId);
    });
    if (!summary?.id) {
      sendMenuPick(session, "???");
      continue;
    }

    const storyJson = loadStoryJson(summary);
    if (!storyJson) {
      sendMenuPick(session, "???");
      continue;
    }

    await runStoryLoop(session, storyJson);
    persist(session);
  }
}

function printPrison(session) {
  drawLinesClear([
    BANNER,
    `\n  ${styled("═══ VANGITTUNA ═══", FG.red, BOLD)}`,
    "\n  Turvallisuus otti sinut kiinni — asiallisuus oli liian matala.",
    `  ${styled("Jäljellä:", FG.yellow)} ${session.conduct.prisonTurns} vuoroa`,
    `\n  ${styled("Paina Enter odottaaksesi...", FG.gray)}`,
    `  ${styled(QUIT_HINT, FG.gray)}`,
  ]);
}

async function runPrisonLoop(session) {
  while (session.screen === "prison" && !session.shouldQuit) {
    printPrison(session);
    const result = await readKey(styled("\n  ", FG.gray));
    if (handleQuitInput(session, result)) return;
    sendMapKey(session, result.type === "key" ? result.key : "enter");
    persist(session);
  }
}

function printGameOver(session) {
  drawLinesClear([
    BANNER,
    `\n  ${styled("═══ POLIISIT SAIVAT KIINNI ═══", FG.red, BOLD)}`,
    "",
    "  Kolme mustapaitaista poliisia (P) saavutti sinut käytävässä.",
    "  HR soitti 112 — toimistotakaa-ajo päättyi.",
    "",
    `  ${styled("Kuolemat:", FG.yellow)} ${session.exportDeaths()}`,
    `\n  ${styled("Paina Enter aloittaaksesi uudelleen...", FG.gray)}`,
    `  ${styled(QUIT_HINT, FG.gray)}`,
  ]);
}

async function runInventoryLoop(session) {
  while (session.screen === "inventory" && !session.shouldQuit) {
    const view = session.getInventoryView();
    const lines = [BANNER];
    lines.push(
      `  ${styled("Kuolemat:", FG.gray)} ${session.exportDeaths()}   |   ${styled("Karma:", FG.gray)} ${styled(String(session.karma.total()), FG.brightGreen)}`,
    );
    lines.push(`\n  ${styled("═══ Inventaario ═══", FG.cyan, BOLD)}`);
    for (let i = 0; i < view.lines.length; i += 1) {
      lines.push(`  ${styled(view.lines[i], FG.white)}`);
    }
    lines.push("");
    lines.push(`  ${styled("Paina Enter palataksesi kartalle...", FG.gray)}`);
    lines.push(`  ${styled(QUIT_HINT, FG.gray)}`);
    drawLinesClear(lines);
    const result = await readKey(styled("\n  ", FG.gray));
    if (handleQuitInput(session, result)) return;
    sendMapKey(session, result.type === "key" ? result.key : "enter");
    persist(session);
  }
}

async function runCardReturnLoop(session) {
  const name = session.pendingEntityName || "Työkaveri";
  while (session.screen === "encounter" && session.encounterResult === "card_return" && !session.shouldQuit) {
    drawLinesClear([
      BANNER,
      `  ${styled("Kulkukortti", FG.yellow, BOLD)}`,
      "",
      `  ${name} etsii kadonnutta korttiaan. Sinulla on se taskussa.`,
      "",
      `  ${styled("[1]", FG.brightGreen)} Palauta kortti (+karma)`,
      `  ${styled("[2]", FG.red)} Väitä ettei ole sinulla (pidät kortin)`,
      `  ${styled("[3]", FG.gray)} Poistu`,
      "",
      `  ${styled(QUIT_HINT, FG.gray)}`,
    ]);
    const result = await readLine(styled("\n  Valinta: ", FG.cyan));
    if (handleQuitInput(session, result)) return;
    const pick = result.value;
    dispatch(session, () => {
      if (pick === "1") {
        session.returnCoworkerCard();
      } else if (pick === "2") {
        session.keepCoworkerCardLie();
      } else {
        sessionMap(session).lastStatus = "Vetäydyt takaisin.";
        session.clearEncounter();
        session.screen = "map";
      }
    });
    persist(session);
    return;
  }
}

async function runStudyListLoop(session) {
  while (session.screen === "studylist" && !session.shouldQuit) {
    drawLinesClear([
      BANNER,
      `  ${styled("Kuolemat:", FG.gray)} ${session.exportDeaths()}   |   ${styled("Karma:", FG.gray)} ${styled(String(session.karma.total()), FG.brightGreen)}`,
      "",
      formatStudyList(studyBacklogState),
      "",
      `  ${styled(QUIT_HINT, FG.gray)}`,
    ]);
    const result = await readKey(styled("\n  ", FG.gray));
    if (handleQuitInput(session, result)) return;
    sendMapKey(session, result.type === "key" ? result.key : "enter");
    persist(session);
  }
}

async function runCastListLoop(session) {
  while (castListOpen && session.screen === "map" && !session.shouldQuit) {
    const body = formatCastRosterText(collectAllCastFromSession(session))
      .split("\n")
      .map((line) => (line ? `  ${line}` : ""));
    drawLinesClear([
      BANNER,
      `  ${styled("Kuolemat:", FG.gray)} ${session.exportDeaths()}   |   ${styled("Karma:", FG.gray)} ${styled(String(session.karma.total()), FG.brightGreen)}`,
      "",
      ...body,
      "",
      `  ${styled("[o / Enter] Sulje hahmolista (DEBUG)", FG.gray)}`,
      `  ${styled(QUIT_HINT, FG.gray)}`,
    ]);
    const result = await readKey(styled("\n  ", FG.gray));
    if (handleQuitInput(session, result)) return;
    castListOpen = false;
  }
}

async function runGameOverLoop(session) {
  while (session.screen === "gameover" && !session.shouldQuit) {
    printGameOver(session);
    const result = await readKey(styled("\n  ", FG.gray));
    if (handleQuitInput(session, result)) return;
    sendMapKey(session, result.type === "key" ? result.key : "enter");
    persist(session);
  }
}

function printEncounter(session) {
  const view = session.getEncounterView();
  const attackWarn = view.attackWarning
    ? styled(view.attackWarning, FG.red)
    : view.isHostile
      ? styled(" — battle-tilanteessa karma voi kadota pahasti!", FG.red)
      : "";
  drawLinesClear([
    BANNER,
    `  ${styled("Kuolemat:", FG.gray)} ${session.exportDeaths()}   |   ${styled("Karma:", FG.gray)} ${styled(String(session.karma.total()), FG.brightGreen)}\n`,
    `  ${styled(`[ ${view.entityChar} ]`, FG.magenta, BOLD)} ${styled(view.entityName, FG.yellow, BOLD)}`,
    "\n" + wrap(view.greeting),
    "",
    `  ${styled("[1]", FG.yellow)} Juttele`,
    `  ${styled("[2]", FG.red, BOLD)} Hyökkää kimppuun${attackWarn}`,
    `  ${styled("[3]", FG.yellow)} Kerro vitsi`,
    `  ${styled("[4]", FG.gray)} Poistu kohtaamisesta`,
    `\n  ${styled(view.hintLine, FG.gray)}`,
    `  ${styled(QUIT_HINT, FG.gray)}`,
  ]);
}

function printQuizEncounter(session, quiz) {
  const view = session.getEncounterView();
  const side = buildQuizSideMenu(quiz.entity, session);
  const lines = [
    BANNER,
    `  ${styled("Kuolemat:", FG.gray)} ${session.exportDeaths()}   |   ${styled("Karma:", FG.gray)} ${styled(String(session.karma.total()), FG.brightGreen)}\n`,
    `  ${styled(`[ ${view.entityChar} ]`, FG.magenta, BOLD)} ${styled(view.entityName, FG.yellow, BOLD)}`,
    `\n${wrap(quiz.greeting)}`,
    "",
  ];
  for (let i = 0; i < quiz.question.choices.length; i += 1) {
    lines.push(`  ${styled(`[${i + 1}]`, FG.yellow)} ${quiz.question.choices[i].text}`);
  }
  lines.push(
    "",
    `  ${styled("── tai ──", FG.gray)}`,
    `  ${styled("[a]", FG.magenta)} Kysy AI:lta ${styled(`(-${AI_STUDY_KARMA_COST} karma)`, FG.red)}`,
    `  ${styled("[j]", FG.cyan)} ${side.jokeLabel}`,
  );
  if (side.askColleagueLabel) {
    lines.push(`  ${styled("[n]", FG.cyan)} ${side.askColleagueLabel}`);
  }
  lines.push(
    `  ${styled("[i]", FG.gray)} ${side.mehLabel}`,
    `  ${styled("[p]", FG.gray)} ${side.leaveLabel}`,
    `  ${styled("[h]", FG.red, BOLD)} Hyökkää kimppuun`,
    `\n  ${styled(view.hintLine, FG.gray)}`,
    `  ${styled(QUIT_HINT, FG.gray)}`,
  );
  drawLinesClear(lines);
}

async function showQuizBanter(session, quiz, kind) {
  const entity = quiz.entity;
  const name = entity.name || "Kollega";
  let playerLine = "";
  let npcLine = "";
  let title = "";

  if (kind === "meh") {
    playerLine = buildQuizSideMenu(entity, session).mehLabel;
    npcLine = buildNpcMehReply(entity);
    title = styled("═══ Vetäytyminen ═══", FG.gray, BOLD);
  } else if (kind === "colleague") {
    playerLine = buildQuizSideMenu(entity, session).askColleagueLabel;
    npcLine = buildAskColleagueReply(entity, session);
    title = styled("═══ Kollega ═══", FG.cyan, BOLD);
  } else if (kind === "joke") {
    playerLine = pickOfficeJoke(entity, quiz.question);
    title = styled("═══ Vitsi ═══", FG.cyan, BOLD);
    npcLine = `${name} hymähtää — tai ei.`;
  }

  drawLinesClear([
    BANNER,
    `  ${title}`,
    "",
    `  ${styled("Sinä:", FG.yellow)} "${playerLine}"`,
    "",
    `  ${styled(name + ":", FG.magenta)} ${npcLine}`,
    "",
    `  ${styled("Paina Enter...", FG.gray)}`,
    `  ${styled(QUIT_HINT, FG.gray)}`,
  ]);

  const result = await readLine(styled("\n  ", FG.gray));
  if (handleQuitInput(session, result)) return false;
  return true;
}

async function showQuizOutcome(session, quiz, correct) {
  const teaching = correct ? quiz.question.correctFeedback : quiz.question.wrongFeedback;
  const reaction = buildQuizReaction(quiz.entity, correct, session);
  const points = quiz.question.featurePoints || 0;
  const mark = correct
    ? styled("✓ OIKEIN", FG.brightGreen, BOLD)
    : styled("✗ VÄÄRIN", FG.red, BOLD);
  const karmaHint = correct
    ? styled(`+${points} karma`, FG.brightGreen)
    : styled("-3 karma", FG.red);
  let marked = false;

  while (true) {
    const extra = marked
      ? [`  ${styled("✓ Merkitty opiskelulistalle — Kysy AI:lta.", FG.brightGreen)}`, ""]
      : [];
    drawLinesClear([
      BANNER,
      `  ${mark}   ${karmaHint}`,
      "",
      wrap(reaction),
      "",
      `  ${styled("── Selitys ──", FG.gray)}`,
      `  ${styled(wrap(teaching), FG.gray)}`,
      "",
      ...extra,
      `  ${styled("Paina Enter jatkaaksesi...", FG.gray)}`,
      `  ${styled("[m]", FG.magenta)} Selitys ei riittänyt — haluan opiskella lisää myöhemmin`,
      `  ${styled(QUIT_HINT, FG.gray)}`,
    ]);

    const result = await readLine(styled("\n  ", FG.gray));
    if (handleQuitInput(session, result)) return false;
    const pick = String(result.value || "").trim().toLowerCase();
    if (pick === "m" || pick === "merkitse" || pick === "lisää" || pick === "oppia") {
      studyBacklogState = markWantMoreStudy(
        studyBacklogState,
        questionMetaFromQuiz(quiz, correct, teaching),
      );
      marked = true;
      persist(session);
      continue;
    }
    break;
  }
  return true;
}

async function showAiStudy(session, quiz) {
  const cost = AI_STUDY_KARMA_COST;
  const text = buildAiStudyText(quiz.question);
  const entityName = quiz.entity?.name || session.pendingEntityName;

  drawLinesClear([
    BANNER,
    `  ${styled("═══ AI-opetus (ChatCorp™) ═══", FG.magenta, BOLD)}`,
    `  ${styled(`-${cost} karma`, FG.red)}   ${styled(`Karma: ${session.karma.total()}`, FG.gray)}`,
    `  ${styled(entityName, FG.yellow)} ${styled("katselee sivuun kun kaivat puhelimen.", FG.gray)}`,
    "",
    wrap(text),
    "",
    `  ${styled("Paina Enter palataksesi kysymykseen...", FG.gray)}`,
    `  ${styled(QUIT_HINT, FG.gray)}`,
  ]);

  const result = await readLine(styled("\n  ", FG.gray));
  if (handleQuitInput(session, result)) return false;
  return true;
}

async function runQuizEncounterLoop(session) {
  const quiz = getEncounterQuiz(session, quizHistoryState, makeQuizPickOptions(session));
  if (!quiz) {
    dispatch(session, () => {
      sessionMap(session).lastStatus = "Kohtaamisen kysymystä ei löytynyt.";
      session.backToMap();
    });
    clearEncounterQuizCache();
    return;
  }

  quizHistoryState = recordQuizShown(quizHistoryState, quiz.entity.id, quiz.question.id);
  recordPersonEncounter(personRegistryState, quiz.entity, { tone: "meet" });
  persist(session);

  while (session.screen === "encounter" && !session.shouldQuit) {
    printQuizEncounter(session, quiz);
    const result = await readLine(styled("\n  Vastaus: ", FG.cyan));
    if (handleQuitInput(session, result)) return;

    const pick = String(result.value || "").trim().toLowerCase();
    if (pick === "p" || pick === "poistu") {
      recordPersonEncounter(personRegistryState, quiz.entity, { tone: "leave" });
      dispatch(session, () => {
        session.dismissEncounterQuiz("leave", "Vetäydyt takaisin hiljaa.");
      });
      clearEncounterQuizCache();
      persist(session);
      return;
    }
    if (pick === "h" || pick === "hyökkää") {
      sendEncounterChoice(session, "attack");
      clearEncounterQuizCache();
      persist(session);
      return;
    }
    if (pick === "n" || pick === "kollega") {
      if (!buildQuizSideMenu(quiz.entity, session).askColleagueLabel) {
        dispatch(session, () => {
          sessionMap(session).lastStatus = "Tämä ei ole kollega-kohtaaminen.";
        });
        continue;
      }
      const npcReply = buildAskColleagueReply(quiz.entity, session);
      const ok = await showQuizBanter(session, quiz, "colleague");
      if (!ok) return;
      recordPersonEncounter(personRegistryState, quiz.entity, { tone: "talk" });
      dispatch(session, () => {
        session.dismissEncounterQuiz("leave", npcReply);
      });
      clearEncounterQuizCache();
      persist(session);
      return;
    }
    if (pick === "i" || pick === "sama" || pick === "meh") {
      const npcReply = buildNpcMehReply(quiz.entity);
      const ok = await showQuizBanter(session, quiz, "meh");
      if (!ok) return;
      recordPersonEncounter(personRegistryState, quiz.entity, { tone: "meh" });
      dispatch(session, () => {
        session.dismissEncounterQuiz("meh", npcReply);
      });
      clearEncounterQuizCache();
      persist(session);
      return;
    }
    if (pick === "j" || pick === "vitsi") {
      const ok = await showQuizBanter(session, quiz, "joke");
      if (!ok) return;
      recordPersonEncounter(personRegistryState, quiz.entity, { tone: "joke" });
      sendEncounterChoice(session, "joke");
      clearEncounterQuizCache();
      persist(session);
      return;
    }
    if (pick === "a" || pick === "ai" || pick === "kysy") {
      const cost = AI_STUDY_KARMA_COST;
      if (session.karma.total() < cost) {
        dispatch(session, () => {
          sessionMap(session).lastStatus = `Tarvitset vähintään ${cost} karmaa AI-opetukseen.`;
        });
        continue;
      }
      let charged = false;
      dispatch(session, () => {
        charged = session.askEncounterAiStudy(cost);
      });
      if (!charged) continue;
      persist(session);
      const ok = await showAiStudy(session, quiz);
      if (!ok) return;
      continue;
    }

    const idx = Number(pick) - 1;
    if (Number.isNaN(idx) || idx < 0 || idx >= quiz.question.choices.length) {
      dispatch(session, () => {
        sessionMap(session).lastStatus = "Valitse 1–4, n, a, j, i, p tai h.";
      });
      continue;
    }

    const choice = quiz.question.choices[idx];
    const correct = choice.correct;
    const teaching = correct ? quiz.question.correctFeedback : quiz.question.wrongFeedback;
    if (!correct) {
      studyBacklogState = recordWrongAnswer(
        studyBacklogState,
        questionMetaFromQuiz(quiz, false, teaching),
      );
      persist(session);
    }
    const reaction = buildQuizReaction(quiz.entity, correct, session);
    const ok = await showQuizOutcome(session, quiz, correct);
    if (!ok) return;

    recordPersonEncounter(personRegistryState, quiz.entity, { correct });
    dispatch(session, () => {
      session.finishEncounterQuiz(
        correct,
        quiz.question.featureId || "",
        quiz.question.featurePoints || 0,
        reaction,
      );
    });
    quizHistoryState = recordQuizAnswer(
      quizHistoryState,
      quiz.entity.id,
      quiz.question.id,
      correct,
    );
    clearEncounterQuizCache();
    persist(session);
    return;
  }
}

async function runEncounterLoop(session) {
  const catalog = new StoryCatalog();

  while (session.screen === "encounter" && !session.shouldQuit) {
    if (needsEncounterQuiz(session)) {
      await runQuizEncounterLoop(session);
      return;
    }

    printEncounter(session);
    const result = await readLine(styled("\n  Valinta: ", FG.cyan));
    if (handleQuitInput(session, result)) return;
    const pick = result.value;

    const choiceByKey = {
      "1": "talk",
      "2": "attack",
      "3": "joke",
      "4": "leave",
    };
    const choice = choiceByKey[pick];
    if (!choice) {
      dispatch(session, () => {
        sessionMap(session).lastStatus = "Valitse 1–4.";
      });
      continue;
    }

    if (choice === "talk" || choice === "joke") {
      recordPersonEncounter(personRegistryState, pendingEncounterEntity(session), { tone: choice });
    }

    sendEncounterChoice(session, choice);
    persist(session);

    if (session.encounterResult === "card_return") {
      await runCardReturnLoop(session);
      persist(session);
      return;
    }

    if (session.encounterResult === "quiz") {
      await runQuizEncounterLoop(session);
      persist(session);
      return;
    }

    if (session.encounterResult === "talk") {
      const storyId = session.pendingStoryId;
      const summary = catalog.findById(storyId);
      const storyJson = loadStoryJson(summary);
      if (!storyJson) {
        dispatch(session, () => {
          sessionMap(session).lastStatus = `Tarinan "${storyId}" lataus epäonnistui.`;
          session.backToMap();
        });
        return;
      }
      await runStoryLoop(session, storyJson);
      persist(session);
      return;
    }
  }
}

export async function runTerminalApp(mapJson) {
  const save = loadPlayerSave();
  quizHistoryState = normalizeQuizHistory(save?.quizHistory);
  studyBacklogState = normalizeStudyBacklog(save?.studyBacklog);
  personRegistryState = normalizePersonRegistry(save?.personRegistry);
  interviewPickNonce = save?.progress?.interviewPickNonce ?? 0;
  guruPickNonce = save?.progress?.guruPickNonce ?? 0;
  const { root, session } = createGameSession(save);

  let mapOk = false;
  dispatch(session, () => {
    mapOk = session.loadMapFromText(mapJson);
  });
  if (!mapOk) {
    console.error(styled("Kartan lataus epäonnistui.", FG.red));
    stopGameSession(root, session);
    process.exit(1);
  }

  if (save) {
    dispatch(session, () => {
      session.applySave(
        save.features?.ids ?? [],
        save.features?.amounts ?? [],
        save.deaths ?? 0,
      );
    });
  }

  let keys = createKeyReader();
  if (!keys.isTTY) {
    console.error(styled("Terminaali ei ole interaktiivinen (TTY). Aja: npm run play", FG.red));
    stopGameSession(root, session);
    process.exit(1);
  }

  enterGameScreen();

  const onSig = () => {
    requestQuit(session);
    flushPersist(session);
    getStdinHub().close();
    stopGameSession(root, session);
    leaveGameScreen();
    process.exit(0);
  };
  process.on("SIGINT", onSig);
  process.on("SIGTERM", onSig);

  try {
    let clearMapNext = false;
    while (!session.shouldQuit) {
      if (session.screen === "menu") {
        await runMenuLoop(session);
        if (session.shouldQuit) break;
        clearMapNext = true;
        continue;
      }

      if (session.screen === "encounter") {
        await runEncounterLoop(session);
        clearMapNext = true;
        continue;
      }

      if (session.screen === "prison") {
        await runPrisonLoop(session);
        clearMapNext = true;
        continue;
      }

      if (session.screen === "gameover") {
        await runGameOverLoop(session);
        clearMapNext = true;
        continue;
      }

      if (session.screen === "studylist") {
        await runStudyListLoop(session);
        clearMapNext = true;
        continue;
      }

      if (session.screen === "inventory") {
        await runInventoryLoop(session);
        clearMapNext = true;
        continue;
      }

      if (session.screen === "blocked") {
        await runBlockedLoop(session);
        clearMapNext = true;
        continue;
      }

      if (session.screen === "action") {
        await runActionLoop(session);
        clearMapNext = true;
        continue;
      }

      if (castListOpen) {
        await runCastListLoop(session);
        clearMapNext = true;
        continue;
      }

      printMap(session, clearMapNext);
      clearMapNext = false;
      const key = await keys.readKey();

      if (
        isTerminalClosedKey(key.name) ||
        key.name === "ctrl-c" ||
        key.name === "ctrl-d" ||
        isQuitKeyName(key.name)
      ) {
        requestQuit(session);
        break;
      }

      if (castListEnabledForTerminal() && key.name === "o") {
        castListOpen = true;
        continue;
      }

      trySendMapKey(session, key.name);
      if (session.screen === "map" && session.encounterResult === "action_story") {
        await tryStartPendingStory(session);
        persist(session);
      }
    }
  } finally {
    flushPersist(session);
    getStdinHub().close();
    stopGameSession(root, session);
    leaveGameScreen();
  }

  if (!session.shouldQuit) return;

  console.log(BANNER);
  console.log(`\n  ${styled("Kiitos pelaamisesta!", FG.yellow)}\n`);
  console.log(`  ${styled("(tallennettu:", FG.gray)} ${SAVE_FILE}${styled(")", FG.gray)}`);
}
