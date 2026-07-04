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
  tileWidth = TILE_WIDTH,
  tileHeight = TILE_HEIGHT,
): { x: number; y: number } {
  return {
    x: originX + (gridX - gridY) * (tileWidth / 2),
    y: originY + (gridX + gridY) * (tileHeight / 2),
  };
}

/** Place player diamond at viewport center (Pikuma x_start / y_start). */
export function playerCenteredOrigin(
  playerGridX: number,
  playerGridY: number,
  canvasWidth: number,
  canvasHeight: number,
  tileWidth = TILE_WIDTH,
  tileHeight = TILE_HEIGHT,
): { x: number; y: number } {
  const cx = canvasWidth / 2;
  const cy = canvasHeight / 2;
  return {
    x: cx - (playerGridX - playerGridY) * (tileWidth / 2) - tileWidth / 2,
    y: cy - (playerGridX + playerGridY) * (tileHeight / 2) - tileHeight / 2,
  };
}

export function tileDrawYOffset(imageHeight: number, tileWidth = TILE_WIDTH): number {
  const scale = tileWidth / SOURCE_TILE_WIDTH;
  const footprint = SOURCE_FOOTPRINT_HEIGHT * scale;
  return imageHeight - footprint;
}

/** Screen-space bounds of a cols×rows diamond map at scale 1. */
export function mapScreenBounds(
  cols: number,
  rows: number,
  tileWidth = TILE_WIDTH,
  tileHeight = TILE_HEIGHT,
): { width: number; height: number } {
  const width = (cols + rows) * (tileWidth / 2);
  const spriteHeadroom =
    SOURCE_TILE_HEIGHT * (tileWidth / SOURCE_TILE_WIDTH) -
    SOURCE_FOOTPRINT_HEIGHT * (tileWidth / SOURCE_TILE_WIDTH);
  const height = (cols + rows) * (tileHeight / 2) + spriteHeadroom;
  return { width, height };
}

/** Scale tile size so the full map fits inside the canvas with padding. */
export function fitTileScale(
  cols: number,
  rows: number,
  canvasWidth: number,
  canvasHeight: number,
  padding = 0.9,
): number {
  const bounds = mapScreenBounds(cols, rows);
  if (bounds.width <= 0 || bounds.height <= 0) return 1;
  const scaleX = (canvasWidth * padding) / bounds.width;
  const scaleY = (canvasHeight * padding) / bounds.height;
  return Math.min(scaleX, scaleY);
}

/** Zoom around the player instead of fitting the entire engine viewport. */
export function playerFocusedScale(
  canvasWidth: number,
  canvasHeight: number,
  focusCols = 10,
  focusRows = 7,
  padding = 0.92,
): number {
  return fitTileScale(focusCols, focusRows, canvasWidth, canvasHeight, padding);
}
