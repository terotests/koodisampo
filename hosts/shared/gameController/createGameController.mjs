/**
 * UI-agnostic game controller — pelilogiikka simuloitavissa ilman näkymää.
 * Web (`webGameController`) ja testit käyttävät samaa snapshot-skeemaa.
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { sessionMap } from "../sessionMap.mjs";
import { normalizePersonRegistry, emptyPersonRegistry } from "../../terminal/personStatus.mjs";
import { buildElevatorSnapshot } from "./elevatorSnapshot.mjs";
import { checkElevatorKeyGate } from "./elevatorKeyGate.mjs";
import { wrapVirtualClock } from "./virtualClock.mjs";
import { createElevatorUiState } from "./elevatorUiState.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dialoguePackJson = readFileSync(
  resolve(__dirname, "../../../content/dialogues/pack.json"),
  "utf8",
);
const npcBehaviorPackJson = readFileSync(
  resolve(__dirname, "../../../content/npc-behaviors/pack.json"),
  "utf8",
);

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
    session.loadEmotionalDialoguesFromText(dialoguePackJson);
    session.loadNpcBehaviorsFromText(npcBehaviorPackJson);
    if (save?.features?.ids) {
      session.applySave(save.features.ids, save.features.amounts ?? [], save.deaths ?? 0);
    } else if (bootKarma > 0) {
      session.karma.add("debug:boot", bootKarma);
    }
    if (save?.playerDisplayName) {
      session.applyPlayerProfile(save.playerDisplayName, save.playerSpecialty ?? "cpp");
    } else if (save?.profileComplete !== false) {
      session.applyPlayerProfile("Larry", "cpp");
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
      needs: {
        satiety: session.playerNeeds?.satiety ?? 0,
        thirst: session.playerNeeds?.thirst ?? 0,
        alertness: session.playerNeeds?.alertness ?? 0,
        gas: session.playerNeeds?.gas ?? 0,
      },
    };

    if (session.screen === "map" || session.screen === "prison" || session.screen === "gameover" || session.screen === "epilogue") {
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
        needsLine: view.needsLine,
        hint: view.hintLine,
        lines: view.lines,
        camera: { x: view.cameraX, y: view.cameraY },
        onElevator: elevator.onElevator,
        elevatorFloors: elevator.floors,
        elevatorPickerCollapsed: elevatorUi.pickerCollapsed,
      };
    }

    if (session.screen === "encounter") {
      const view = session.getEncounterView();
      return {
        ...base,
        encounter: {
          entityName: session.pendingEntityName,
          entityChar: session.pendingEntityChar,
          needsQuiz: session.needsEncounterQuiz?.() ?? false,
          isEmotional: view.isEmotional ?? false,
          emotionalQuestion: view.emotionalQuestion ?? "",
          emotionalAnswers: [...(view.emotionalAnswers || [])],
          hintLine: view.hintLine ?? "",
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
    if (session.screen === "encounter") {
      if (session.encounterResult === "emotional") {
        const emotionalKey = key === "p" ? "leave" : key;
        dispatch(session, () => {
          session.onEncounterChoice(emotionalKey);
        });
        return snapshot();
      }
      const choiceMap = {
        "1": "talk",
        "2": "joke",
        "3": "leave",
      };
      const choice = choiceMap[key];
      if (choice) {
        dispatch(session, () => {
          session.onEncounterChoice(choice);
        });
      }
      return snapshot();
    }

    if (session.screen === "blocked" || session.screen === "action") {
      dispatch(session, () => {
        session.onMapKey(key);
      });
      return snapshot();
    }

    if (session.screen === "menu") {
      if (key === "q" || key === "esc" || key === "ctrl-x" || key === "ctrl-c" || key === "ctrl-d") {
        dispatch(session, () => {
          session.onMenuPick("q");
        });
      } else if (key === "enter" || key === "m") {
        dispatch(session, () => {
          session.onMenuPick("m");
        });
      } else {
        dispatch(session, () => {
          session.onMenuPick("???");
        });
      }
      return snapshot();
    }

    if (session.screen === "inventory" || session.screen === "studylist") {
      dispatch(session, () => {
        session.onMapKey(key);
      });
      return snapshot();
    }

    if (key === "enter") {
      if (
        session.screen === "prison"
        || session.screen === "gameover"
        || session.screen === "epilogue"
        || session.screen === "studylist"
        || session.screen === "inventory"
      ) {
        dispatch(session, () => {
          session.onMapKey("enter");
        });
        return snapshot();
      }
    }

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
    session.loadEmotionalDialoguesFromText(dialoguePackJson);
    session.loadNpcBehaviorsFromText(npcBehaviorPackJson);
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
