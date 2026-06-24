/**
 * UI-agnostic game controller — pelilogiikka simuloitavissa ilman näkymää.
 * Web (`webGameController`) ja testit käyttävät samaa snapshot-skeemaa.
 */
import { sessionMap } from "../sessionMap.mjs";
import { normalizePersonRegistry, emptyPersonRegistry } from "../../terminal/personStatus.mjs";
import { buildElevatorSnapshot } from "./elevatorSnapshot.mjs";
import { checkElevatorKeyGate } from "./elevatorKeyGate.mjs";
import { wrapVirtualClock } from "./virtualClock.mjs";
import { createElevatorUiState } from "./elevatorUiState.mjs";

/**
 * @param {{
 *   mapJson: string,
 *   gameHost: {
 *     createGameSession: Function,
 *     dispatch: Function,
 *     stopGameSession: Function,
 *   },
 *   save?: Record<string, unknown> | null,
 *   bootKarma?: number,
 * }} deps
 */
export function createGameController(deps) {
  const { mapJson, gameHost, save = null, bootKarma = 50 } = deps;
  const { createGameSession, dispatch, stopGameSession } = gameHost;

  const { root, session } = createGameSession(save ?? {});
  let personRegistryState = normalizePersonRegistry(save?.personRegistry);
  const elevatorUi = createElevatorUiState();

  dispatch(session, () => {
    session.loadMapFromText(mapJson);
    if (save?.features?.ids) {
      session.applySave(save.features.ids, save.features.amounts ?? [], save.deaths ?? 0);
    } else if (bootKarma > 0) {
      session.karma.add("debug:boot", bootKarma);
    }
    sessionMap(session)?.ensurePlayerOnWalkable?.();
  });

  const clock = wrapVirtualClock(session, dispatch);

  function snapshot() {
    const map = sessionMap(session);
    const base = {
      screen: session.screen,
      shouldQuit: session.shouldQuit,
      deaths: session.exportDeaths(),
      karma: session.karma.total(),
      generation: session.__rangerStateGeneration,
      floor: map?.currentFloor ?? 0,
      player: { x: map?.playerX, y: map?.playerY, hidden: map?.playerHidden },
      status: map?.lastStatus ?? "",
      clockMinutes: session.worldClock?.gameMinutes ?? 0,
      clockLine: session.worldClock?.formatLine?.() ?? "",
    };

    if (session.screen === "map" || session.screen === "prison" || session.screen === "gameover") {
      const view = session.getMapView();
      const elevator = buildElevatorSnapshot(map);
      elevatorUi.syncOnElevator(elevator.onElevator);
      return {
        ...base,
        mapTitle: view.mapTitle,
        floorTitle: view.floorTitle,
        status: view.statusLine || base.status,
        ambient: view.ambientLine,
        time: view.timeLine,
        hint: view.hintLine,
        lines: view.lines,
        camera: { x: view.cameraX, y: view.cameraY },
        onElevator: elevator.onElevator,
        elevatorFloors: elevator.floors,
        elevatorPickerCollapsed: elevatorUi.pickerCollapsed,
      };
    }

    if (session.screen === "encounter") {
      return {
        ...base,
        encounter: {
          entityName: session.pendingEntityName,
          entityChar: session.pendingEntityChar,
          needsQuiz: session.needsEncounterQuiz?.() ?? false,
        },
      };
    }

    if (session.screen === "blocked" || session.screen === "action") {
      const view = session.screen === "blocked"
        ? session.getBlockedView()
        : session.getActionView();
      return { ...base, action: view };
    }

    if (session.screen === "story") {
      const view = session.getStoryView();
      return {
        ...base,
        story: {
          title: view.storyTitle,
          screen: view.screen,
          nodeKind: view.nodeKind,
        },
      };
    }

    return base;
  }

  function handleKey(key) {
    const before = snapshot();

    if (session.screen === "map" && /^[0-9]$/.test(key)) {
      const map = sessionMap(session);
      const gate = checkElevatorKeyGate(session, map, personRegistryState, key);
      if (!gate.proceed) {
        dispatch(session, () => {
          map.lastStatus = gate.message;
        });
        collapseAfterElevatorKey(key, Boolean(map?.isOnElevator?.()));
        return snapshot();
      }
    }

    dispatch(session, () => {
      session.onMapKey(key);
    });

    if (session.screen === "map") {
      const after = snapshot();
      collapseAfterElevatorKey(key, after.onElevator);
    }

    return snapshot();
  }

  function collapseAfterElevatorKey(key, onElevator) {
    if (/^[0-9]$/.test(key) && onElevator) {
      elevatorUi.collapseAfterElevatorKey(key, onElevator);
    }
  }

  function expandElevatorPicker() {
    elevatorUi.expand();
    return snapshot();
  }

  function reset(keepProgress = false) {
    elevatorUi.reset();
    personRegistryState = keepProgress
      ? personRegistryState
      : emptyPersonRegistry();
    dispatch(session, () => {
      session.loadMapFromText(mapJson);
      if (keepProgress && save?.features?.ids) {
        session.applySave(save.features.ids, save.features.amounts ?? [], save.deaths ?? 0);
      } else if (bootKarma > 0) {
        session.karma.add("debug:boot", bootKarma);
      }
      sessionMap(session)?.ensurePlayerOnWalkable?.();
    });
    return snapshot();
  }

  return {
    root,
    session,
    personRegistry: personRegistryState,
    clock,
    snapshot,
    handleKey,
    expandElevatorPicker,
    reset,
    stop: () => stopGameSession(root, session),
  };
}
