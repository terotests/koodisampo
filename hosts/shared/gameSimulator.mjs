/**
 * Ohut host-wrapper Ranger GameSession-simulaattorille.
 */
import { createGameSession, dispatch, stopGameSession } from "../../hosts/terminal/gameHost.mjs";

export function createGameSimulator(worldJson) {
  const { root, session } = createGameSession();

  function runDispatch(work) {
    dispatch(session, work);
  }

  return {
    session,
    bootstrap(setup) {
      runDispatch(() => {
        session.simBootstrap(JSON.stringify(setup), worldJson);
      });
    },
    step(action) {
      runDispatch(() => {
        session.simStep(JSON.stringify(action));
      });
    },
    tick(minutes) {
      runDispatch(() => {
        session.simTick(minutes);
      });
    },
    snapshot() {
      return JSON.parse(session.simSnapshotJson());
    },
    report() {
      return JSON.parse(session.simReportJson());
    },
    rngNext(min, max) {
      return session.simRngNext(min, max);
    },
    stop() {
      stopGameSession(root, session);
    },
  };
}
