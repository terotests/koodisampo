/** Pseudo-isometric (2:1 dimetric) grid → screen projection. See Pikuma isometric article. */

export const TILE_WIDTH = 64;
export const TILE_HEIGHT = 32;
export const SOURCE_TILE_WIDTH = 256;
export const SOURCE_TILE_HEIGHT = 512;
export const SOURCE_FOOTPRINT_HEIGHT = 128;

export type IsoDirection = "N" | "S" | "E" | "W";

export function gridToScreen(
  gridX: number,
  gridY: number,
  originX: number,
  originY: number,
): { x: number; y: number } {
  return {
    x: originX + (gridX - gridY) * (TILE_WIDTH / 2),
    y: originY + (gridX + gridY) * (TILE_HEIGHT / 2),
  };
}

/** Place player diamond at viewport center (Pikuma x_start / y_start). */
export function playerCenteredOrigin(
  playerVx: number,
  playerVy: number,
  canvasWidth: number,
  canvasHeight: number,
): { x: number; y: number } {
  const cx = canvasWidth / 2;
  const cy = canvasHeight / 2;
  return {
    x: cx - (playerVx - playerVy) * (TILE_WIDTH / 2) - TILE_WIDTH / 2,
    y: cy - (playerVx + playerVy) * (TILE_HEIGHT / 2) - TILE_HEIGHT / 2,
  };
}

export function tileDrawYOffset(imageHeight: number): number {
  const scale = TILE_WIDTH / SOURCE_TILE_WIDTH;
  const footprint = SOURCE_FOOTPRINT_HEIGHT * scale;
  return imageHeight - footprint;
}
