import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { sessionMap } from "../shared/sessionMap.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "../..");

const require = createRequire(import.meta.url);
const {
  KoodisampoAppRoot,
  GameSession,
  ProcessRuntime,
} = require(resolve(projectRoot, "generated/es6/koodisampo.cjs"));

export { sessionMap } from "../shared/sessionMap.mjs";

export function createGameSession(save) {
  const root = new KoodisampoAppRoot();
  ProcessRuntime.startInstance(root);
  const session = root.createSession();

  if (save?.features?.ids && save?.features?.amounts) {
    session.applySave(save.features.ids, save.features.amounts, save.deaths ?? 0);
  }

  if (save?.progress) {
    session.applyGuruProgress(
      !!save.progress.guruIntroPassed,
      !!save.progress.guruStoryAttempted,
      save.progress.guruQuizCorrect ?? 0,
    );
  }

  return { root, session };
}

export function stopGameSession(root, session) {
  if (session && session.__rangerId !== 0) {
    ProcessRuntime.stopInstance(session);
  }
  if (root && root.__rangerId !== 0) {
    ProcessRuntime.stopInstance(root);
  }
}

export function dispatch(session, work) {
  const turnRoot = session.__rangerFindRoot();
  ProcessRuntime.beginDispatchTurn(turnRoot);
  try {
    work();
  } finally {
    ProcessRuntime.endDispatchTurn(turnRoot);
  }
}

export function sendMapKey(session, keyName) {
  dispatch(session, () => {
    session.onMapKey(keyName);
  });
}

export function sendMenuPick(session, raw) {
  dispatch(session, () => {
    session.onMenuPick(raw);
  });
}

export function beginStory(session, storyJson) {
  let ok = false;
  dispatch(session, () => {
    ok = session.beginStory(storyJson);
  });
  return ok;
}

export function sendStoryNarrative(session) {
  dispatch(session, () => {
    session.onStoryNarrativeAdvance();
  });
}

export function sendStoryChoice(session, index) {
  dispatch(session, () => {
    session.onStoryChoice(index);
  });
}

export function sendStoryCode(session, answer, matches) {
  dispatch(session, () => {
    session.onStoryCodeResult(answer, matches);
  });
}

export function sendStoryDismissFeedback(session) {
  dispatch(session, () => {
    session.onStoryDismissFeedback();
  });
}

export function sendEncounterChoice(session, choice) {
  dispatch(session, () => {
    session.onEncounterChoice(choice);
  });
}

export function requestQuit(session) {
  dispatch(session, () => {
    session.shouldQuit = true;
  });
}

export function backToMap(session) {
  dispatch(session, () => {
    session.backToMap();
  });
}
