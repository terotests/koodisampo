import { setQuestionLoader } from "../../hosts/terminal/encounterQuestions.mjs";
import { createWebGameController } from "../../hosts/shared/webGameController.mjs";
// @ts-expect-error Ranger CJS bundle
import { StoryCatalog } from "koodisampo-runtime";
import * as gameHost from "./gameHost";
import { loadPlayerSave, savePlayerSave } from "./playerSave";
import { loadAllQuestionsFromPublic } from "./questions";

const WORLD_FILE = "corporate-hq-intro.json";

export type WebGame = ReturnType<typeof createWebGameController> & {
  /** Dev: hae tuorein maailma levyltä ennen reset() — ei backend-API:a. */
  reloadWorldFromSource?: () => Promise<void>;
};

function worldAssetUrl(base: string, bust = false): string {
  const path = `${base}content/worlds/${WORLD_FILE}`;
  return bust && import.meta.env.DEV ? `${path}?v=${Date.now()}` : path;
}

async function fetchWorldText(base: string, bust = false): Promise<string> {
  const res = await fetch(worldAssetUrl(base, bust));
  if (!res.ok) {
    throw new Error("Maailman lataus epäonnistui");
  }
  return res.text();
}

export async function createBrowserGame(): Promise<WebGame> {
  const base = import.meta.env.BASE_URL;
  const dialoguePath = `${base}content/dialogues/pack.json`;
  const dialogueUrl = import.meta.env.DEV ? `${dialoguePath}?v=${Date.now()}` : dialoguePath;
  let currentMapJson = await fetchWorldText(base, import.meta.env.DEV);
  const [dialogueRes, npcBehaviorRes, questions] = await Promise.all([
    fetch(dialogueUrl),
    fetch(
      import.meta.env.DEV
        ? `${base}content/npc-behaviors/pack.json?v=${Date.now()}`
        : `${base}content/npc-behaviors/pack.json`,
    ),
    loadAllQuestionsFromPublic(base),
  ]);
  setQuestionLoader(() => questions);
  if (!dialogueRes.ok) {
    throw new Error("Dialogipaketin lataus epäonnistui");
  }
  if (!npcBehaviorRes.ok) {
    throw new Error("NPC-käyttäytymispaketin lataus epäonnistui");
  }
  const dialoguePackJson = await dialogueRes.text();
  const npcBehaviorPackJson = await npcBehaviorRes.text();
  let cachedSave = (await loadPlayerSave()) ?? {};
  const storyCatalog = new StoryCatalog();

  const storyTextByFile = new Map<string, string>();
  const summaries = storyCatalog.list();
  await Promise.all(
    summaries.map(async (summary: { filename?: string }) => {
      if (!summary.filename) return;
      const res = await fetch(`${base}content/stories/${summary.filename}`);
      if (res.ok) storyTextByFile.set(summary.filename, await res.text());
    }),
  );

  const game = createWebGameController({
    mapJson: currentMapJson,
    getMapJson: import.meta.env.DEV ? () => currentMapJson : undefined,
    dialoguePackJson,
    npcBehaviorPackJson,
    storyCatalog,
    gameHost,
    loadSave: () => cachedSave,
    persistSave: (karma, deaths, quizHistory, studyBacklog, progress, personRegistry) => {
      void (async () => {
        await savePlayerSave(karma, deaths, quizHistory, studyBacklog, progress, personRegistry);
        cachedSave = (await loadPlayerSave()) ?? cachedSave;
      })();
    },
    loadStoryJson: (summary) => {
      if (!summary?.filename) return null;
      return storyTextByFile.get(summary.filename) ?? null;
    },
    castListEnabled: () => true,
  });

  if (!import.meta.env.DEV) {
    return game;
  }

  return Object.assign(game, {
    async reloadWorldFromSource() {
      currentMapJson = await fetchWorldText(base, true);
    },
  });
}
