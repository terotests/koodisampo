import assert from "node:assert/strict";

const TILE_WIDTH = 64;
const TILE_HEIGHT = 32;
const SOURCE_TILE_HEIGHT = 512;
const SOURCE_TILE_WIDTH = 256;
const SOURCE_FOOTPRINT_HEIGHT = 128;

function mapScreenBounds(cols, rows) {
  const width = (cols + rows) * (TILE_WIDTH / 2);
  const spriteHeadroom =
    SOURCE_TILE_HEIGHT * (TILE_WIDTH / SOURCE_TILE_WIDTH) -
    SOURCE_FOOTPRINT_HEIGHT * (TILE_WIDTH / SOURCE_TILE_WIDTH);
  const height = (cols + rows) * (TILE_HEIGHT / 2) + spriteHeadroom;
  return { width, height };
}

function fitTileScale(cols, rows, canvasWidth, canvasHeight, padding = 0.9) {
  const bounds = mapScreenBounds(cols, rows);
  const scaleX = (canvasWidth * padding) / bounds.width;
  const scaleY = (canvasHeight * padding) / bounds.height;
  return Math.min(scaleX, scaleY);
}

function gridToScreen(gridX, gridY, originX, originY) {
  return {
    x: originX + (gridX - gridY) * (TILE_WIDTH / 2),
    y: originY + (gridX + gridY) * (TILE_HEIGHT / 2),
  };
}

function playerCenteredOrigin(playerGridX, playerGridY, canvasWidth, canvasHeight) {
  const cx = canvasWidth / 2;
  const cy = canvasHeight / 2;
  return {
    x: cx - (playerGridX - playerGridY) * (TILE_WIDTH / 2) - TILE_WIDTH / 2,
    y: cy - (playerGridX + playerGridY) * (TILE_HEIGHT / 2) - TILE_HEIGHT / 2,
  };
}

const desktopScale = fitTileScale(30, 18, 390, 300);
assert(desktopScale < 1, "viewport map should scale down on small canvas");
assert(desktopScale > 0.15, "scale should remain readable");

const bounds = mapScreenBounds(30, 18);
assert(bounds.width === (30 + 18) * (TILE_WIDTH / 2), "map width");
assert(bounds.height > (30 + 18) * (TILE_HEIGHT / 2), "map height includes sprite headroom");

const origin = playerCenteredOrigin(15, 9, 720, 400);
const playerScreen = gridToScreen(15, 9, origin.x, origin.y);
assert(Math.abs(playerScreen.x + TILE_WIDTH / 2 - 360) < 1, "player centered horizontally");
assert(Math.abs(playerScreen.y + TILE_HEIGHT / 2 - 200) < 1, "player centered vertically");

console.log("isometric_projection.test.mjs OK");
