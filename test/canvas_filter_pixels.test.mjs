import assert from "node:assert/strict";
import { applyRenderThemePixels } from "../hosts/shared/canvasFilterPixels.mjs";

function pixel(r, g, b, a = 255) {
  return new Uint8ClampedArray([r, g, b, a]);
}

function applyTheme(r, g, b, themeId) {
  const data = pixel(r, g, b);
  applyRenderThemePixels(data, themeId);
  return data;
}

const slateOrange = applyTheme(220, 140, 60, "slate");
assert.ok(
  Math.abs(slateOrange[0] - slateOrange[1]) < 35 && Math.abs(slateOrange[1] - slateOrange[2]) < 35,
  "slate theme desaturates orange floor toward gray",
);
assert.ok(slateOrange[0] > slateOrange[1] * 0.7, "slate keeps some brightness");

const emerald = applyTheme(220, 140, 60, "emerald");
assert.ok(emerald[1] > emerald[0] * 0.85, "emerald shifts hue toward green");

const ocean = applyTheme(220, 140, 60, "ocean");
assert.ok(ocean[2] > ocean[0] * 0.75, "ocean shifts hue toward blue");

const transparent = pixel(220, 140, 60, 0);
applyRenderThemePixels(transparent, "slate");
assert.equal(transparent[0], 220, "transparent pixels are untouched");

console.log("canvas_filter_pixels.test.mjs OK");
