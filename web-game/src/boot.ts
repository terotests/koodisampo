import { setQuestionLoader } from "../../hosts/terminal/encounterQuestions.mjs";
import { createWebGameController } from "../../hosts/shared/webGameController.mjs";
// @ts-expect-error Ranger CJS bundle
import { StoryCatalog } from "koodisampo-runtime";
import * as gameHost from "./gameHost";
import { loadPlayerSave, savePlayerSave } from "./playerSave";
import { loadAllQuestionsFromBundle } from "./questions";

export type WebGame = ReturnType<typeof createWebGameController>;

export async function createBrowserGame(): Promise<WebGame> {
  setQuestionLoader(() => loadAllQuestionsFromBundle());

  const base = import.meta.env.BASE_URL;
  const [mapRes] = await Promise.all([
    fetch(`${base}content/worlds/corporate-hq-intro.json`),
  ]);
  if (!mapRes.ok) {
    throw new Error("Maailman lataus epäonnistui");
  }
  const mapJson = await mapRes.text();
  let cachedSave = (await loadPlayerSave()) ?? {};
  const storyCatalog = new StoryCatalog();

  const storyTextByFile = new Map<string, string>();
  const summaries = storyCatalog.catalogList();
  await Promise.all(
    summaries.map(async (summary: { filename?: string }) => {
      if (!summary.filename) return;
      const res = await fetch(`${base}content/stories/${summary.filename}`);
      if (res.ok) storyTextByFile.set(summary.filename, await res.text());
    }),
  );

  return createWebGameController({
    mapJson,
    storyCatalog,
    gameHost,
    loadSave: () => cachedSave,
    persistSave: (karma, deaths, quizHistory, studyBacklog, progress) => {
      void (async () => {
        await savePlayerSave(karma, deaths, quizHistory, studyBacklog, progress);
        cachedSave = (await loadPlayerSave()) ?? cachedSave;
      })();
    },
    loadStoryJson: (summary) => {
      if (!summary?.filename) return null;
      return storyTextByFile.get(summary.filename) ?? null;
    },
    castListEnabled: () => true,
  });
}
