import { elevatorKeyToFloorIndex, checkFloorRecommendationAccess } from "../../terminal/personStatus.mjs";

/**
 * Hissin numeronäppäimen esitarkistus ennen onMapKey-dispatchia.
 * @returns {{ proceed: true } | { proceed: false, message: string }}
 */
export function checkElevatorKeyGate(session, map, personRegistry, key) {
  if (!/^[0-9]$/.test(key)) {
    return { proceed: true };
  }
  if (!map?.isOnElevator?.()) {
    return { proceed: true };
  }
  const target = elevatorKeyToFloorIndex(key);
  if (target < 0 || target <= (map.currentFloor ?? 0)) {
    return { proceed: true };
  }
  let allowed = true;
  if (typeof session.canAccessFloor === "function") {
    allowed = session.canAccessFloor(target);
  }
  if (allowed) {
    const recCheck = checkFloorRecommendationAccess(session, personRegistry, target);
    if (!recCheck.ok) {
      return { proceed: false, message: recCheck.message };
    }
  }
  return { proceed: true };
}
