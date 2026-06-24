/** Hissivalitsimen UI-tila — jaettu web + createGameController. */

export function createElevatorUiState() {
  let pickerCollapsed = false;
  let wasOnElevator = false;

  return {
    get pickerCollapsed() {
      return pickerCollapsed;
    },
    syncOnElevator(onElevator) {
      if (!onElevator) {
        pickerCollapsed = false;
        wasOnElevator = false;
        return;
      }
      if (!wasOnElevator) {
        pickerCollapsed = false;
      }
      wasOnElevator = onElevator;
    },
    collapseAfterFloorChange(key, beforeFloor, afterFloor, onElevator) {
      this.collapseAfterElevatorKey(key, onElevator);
    },
    collapseAfterElevatorKey(key, onElevator) {
      if (/^[0-9]$/.test(key) && onElevator) {
        pickerCollapsed = true;
      }
    },
    expand() {
      pickerCollapsed = false;
    },
    reset() {
      pickerCollapsed = false;
      wasOnElevator = false;
    },
  };
}
