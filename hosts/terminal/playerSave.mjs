import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { emptyQuizHistory, normalizeQuizHistory } from "./quizHistory.mjs";
import { emptyStudyBacklog, normalizeStudyBacklog } from "./studyBacklog.mjs";

export function defaultSaveFile() {
  return join(homedir(), ".koodisampo", "player.json");
}

export function loadPlayerSave(filePath = defaultSaveFile()) {
  try {
    const raw = readFileSync(filePath, "utf8");
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") return null;
    if (data.quizHistory) {
      data.quizHistory = normalizeQuizHistory(data.quizHistory);
    }
    if (data.studyBacklog) {
      data.studyBacklog = normalizeStudyBacklog(data.studyBacklog);
    }
    return data;
  } catch {
    return null;
  }
}

export function savePlayerSave(karma, deaths, quizHistory, studyBacklog, progress, filePath = defaultSaveFile()) {
  mkdirSync(dirname(filePath), { recursive: true });
  const payload = {
    version: 4,
    updatedAt: Date.now(),
    deaths: deaths ?? 0,
    features: {
      ids: [...(karma.ids ?? [])],
      amounts: [...(karma.amounts ?? [])],
    },
    quizHistory: normalizeQuizHistory(quizHistory ?? emptyQuizHistory()),
    studyBacklog: normalizeStudyBacklog(studyBacklog ?? emptyStudyBacklog()),
    progress: {
      guruIntroPassed: !!progress?.guruIntroPassed,
      guruStoryAttempted: !!progress?.guruStoryAttempted,
      guruQuizCorrect: progress?.guruQuizCorrect ?? 0,
      interviewPickNonce: progress?.interviewPickNonce ?? 0,
      guruPickNonce: progress?.guruPickNonce ?? 0,
    },
  };
  writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

export function applyPlayerSave(karma, engine, save) {
  if (!save) return;
  const ids = save.features?.ids;
  const amounts = save.features?.amounts;
  if (Array.isArray(ids) && Array.isArray(amounts) && ids.length === amounts.length) {
    karma.ids = [...ids];
    karma.amounts = [...amounts];
  }
  if (typeof save.deaths === "number" && save.deaths >= 0) {
    engine.deaths = save.deaths;
  }
}
