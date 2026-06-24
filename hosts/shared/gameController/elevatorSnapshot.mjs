/** Hissi-UI snapshot — jaettu web + GameController + testit. */

export function elevatorFloorKey(index) {
  return index === 9 ? "0" : String(index + 1);
}

/**
 * @param {object | null | undefined} map — WorldMap / session._map
 */
export function buildElevatorSnapshot(map) {
  if (!map?.isOnElevator?.()) {
    return { onElevator: false, floors: [] };
  }
  const count = Math.min(map.floorCount?.() ?? 0, 10);
  const floors = [];
  for (let i = 0; i < count; i += 1) {
    const floor = map.floors?.[i];
    floors.push({
      key: elevatorFloorKey(i),
      index: i,
      title: floor?.title || `Kerros ${i + 1}`,
      current: i === map.currentFloor,
      hasElevator: map.findElevatorOnFloor?.(i) ?? false,
    });
  }
  return { onElevator: true, floors };
}
