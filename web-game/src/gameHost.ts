export function sessionMap(session: { _map: unknown }) {
  return session._map;
}

// @ts-expect-error Ranger CJS bundle
import { KoodisampoAppRoot, ProcessRuntime } from "koodisampo-runtime";

export function createGameSession(save: Record<string, unknown> | null | undefined) {
  const root = new KoodisampoAppRoot();
  ProcessRuntime.startInstance(root);
  const session = root.createSession();

  if (save?.features && typeof save.features === "object") {
    const f = save.features as { ids?: string[]; amounts?: number[] };
    if (f.ids && f.amounts) {
      session.applySave(f.ids, f.amounts, (save.deaths as number) ?? 0);
    }
  }

  if (save?.progress && typeof save.progress === "object") {
    const p = save.progress as {
      guruIntroPassed?: boolean;
      guruStoryAttempted?: boolean;
      guruQuizCorrect?: number;
    };
    session.applyGuruProgress(
      !!p.guruIntroPassed,
      !!p.guruStoryAttempted,
      p.guruQuizCorrect ?? 0,
    );
  }

  return { root, session };
}

export function stopGameSession(root: { __rangerId: number }, session: { __rangerId: number }) {
  if (session && session.__rangerId !== 0) {
    ProcessRuntime.stopInstance(session);
  }
  if (root && root.__rangerId !== 0) {
    ProcessRuntime.stopInstance(root);
  }
}

export function dispatch(session: { __rangerFindRoot: () => unknown }, work: () => void) {
  const turnRoot = session.__rangerFindRoot();
  ProcessRuntime.beginDispatchTurn(turnRoot);
  try {
    work();
  } finally {
    ProcessRuntime.endDispatchTurn(turnRoot);
  }
}

export function beginStory(session: { beginStory: (json: string) => boolean }, storyJson: string) {
  let ok = false;
  dispatch(session, () => {
    ok = session.beginStory(storyJson);
  });
  return ok;
}

export function sendStoryNarrative(session: { onStoryNarrativeAdvance: () => void }) {
  dispatch(session, () => session.onStoryNarrativeAdvance());
}

export function sendStoryChoice(session: { onStoryChoice: (i: number) => void }, index: number) {
  dispatch(session, () => session.onStoryChoice(index));
}

export function sendStoryCode(
  session: { onStoryCodeResult: (answer: string, matches: boolean) => void },
  answer: string,
  matches: boolean,
) {
  dispatch(session, () => session.onStoryCodeResult(answer, matches));
}

export function sendStoryDismissFeedback(session: { onStoryDismissFeedback: () => void }) {
  dispatch(session, () => session.onStoryDismissFeedback());
}
