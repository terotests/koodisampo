/** Manual canvas filter fallback for WebKit/Safari (ctx.filter is often a no-op). */

function clamp8(v) {
  return v < 0 ? 0 : v > 255 ? 255 : v | 0;
}

function rgbToHsl(r, g, b) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return [h, s, l];
}

function hslToRgb(h, s, l) {
  if (s === 0) {
    const v = clamp8(l * 255);
    return [v, v, v];
  }
  const hue2rgb = (p, q, t) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    clamp8(hue2rgb(p, q, h + 1 / 3) * 255),
    clamp8(hue2rgb(p, q, h) * 255),
    clamp8(hue2rgb(p, q, h - 1 / 3) * 255),
  ];
}

function applyBrightness(r, g, b, factor) {
  return [clamp8(r * factor), clamp8(g * factor), clamp8(b * factor)];
}

function applySaturation(r, g, b, factor) {
  const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return [
    clamp8(gray + (r - gray) * factor),
    clamp8(gray + (g - gray) * factor),
    clamp8(gray + (b - gray) * factor),
  ];
}

function applyHueRotate(r, g, b, degrees) {
  const [h, s, l] = rgbToHsl(r, g, b);
  let nh = h + degrees / 360;
  nh %= 1;
  if (nh < 0) nh += 1;
  return hslToRgb(nh, s, l);
}

/** Apply one render-theme palette to RGBA image data (matches CSS filter order per theme). */
export function applyRenderThemePixels(data, themeId) {
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a === 0) continue;
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    switch (themeId) {
      case "emerald": {
        [r, g, b] = applyHueRotate(r, g, b, 88);
        [r, g, b] = applySaturation(r, g, b, 1.05);
        break;
      }
      case "ocean": {
        [r, g, b] = applyHueRotate(r, g, b, 168);
        [r, g, b] = applySaturation(r, g, b, 1.08);
        break;
      }
      case "violet": {
        [r, g, b] = applyHueRotate(r, g, b, 238);
        [r, g, b] = applySaturation(r, g, b, 1.05);
        break;
      }
      case "rose": {
        [r, g, b] = applyHueRotate(r, g, b, 310);
        [r, g, b] = applySaturation(r, g, b, 1.08);
        break;
      }
      case "slate": {
        [r, g, b] = applySaturation(r, g, b, 0.22);
        [r, g, b] = applyBrightness(r, g, b, 1.08);
        break;
      }
      default:
        continue;
    }

    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
  }
}

/** True when native ctx.filter visibly changed a test pixel (Safari often accepts but ignores). */
export function nativeCanvasFilterWorks(ctx) {
  if (!ctx || !("filter" in ctx)) return false;
  const probe = document.createElement("canvas");
  probe.width = 1;
  probe.height = 1;
  const probeCtx = probe.getContext("2d");
  if (!probeCtx) return false;
  probeCtx.fillStyle = "rgb(100, 0, 0)";
  probeCtx.fillRect(0, 0, 1, 1);

  const out = document.createElement("canvas");
  out.width = 1;
  out.height = 1;
  const outCtx = out.getContext("2d");
  if (!outCtx) return false;
  outCtx.filter = "brightness(200%)";
  outCtx.drawImage(probe, 0, 0);
  const after = outCtx.getImageData(0, 0, 1, 1).data;
  return after[0] > 150;
}
