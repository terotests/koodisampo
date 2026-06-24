/**
 * Virtuaalikello pelisession ympärille — UI-vapaa simulointi ja testit.
 * Kelloa voi kelata eteen- ja taaksepäin setMinutes:lla.
 */

export function wrapVirtualClock(session, dispatch) {
  const clock = () => session.worldClock;

  return {
    get minutes() {
      return clock()?.gameMinutes ?? 0;
    },

    formatLine() {
      return clock()?.formatLine?.() ?? "";
    },

    phaseLabel() {
      return clock()?.phaseLabel?.() ?? "";
    },

    /** Aseta peliminuutit suoraan (myös taaksepäin). */
    setMinutes(minutes) {
      dispatch(session, () => {
        clock()?.setGameMinutes?.(minutes);
      });
    },

    /** Edistä kelloa; päivittää myös NPC-aikataulut. */
    advance(delta) {
      dispatch(session, () => {
        const wc = clock();
        const map = session._map;
        if (!wc) return;
        wc.advance(delta);
        map?.tickSchedules?.(wc.gameMinutes);
      });
    },

    /** Hyppää tiettyyn vaiheeseen (aamu, lounas, …) testejä varten. */
    jumpToPhase(phase) {
      const targets = {
        aamu: 480,
        lounas: 660,
        iltapäivä: 780,
        lähtöaika: 900,
        tyhjä: 1020,
      };
      const m = targets[phase];
      if (m == null) throw new Error(`Unknown phase: ${phase}`);
      this.setMinutes(m);
      dispatch(session, () => {
        session._map?.tickSchedules?.(clock().gameMinutes);
      });
    },
  };
}
