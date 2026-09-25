// GENERATED from terminal/KoodisampoTerminal.rgr by terminal/build.mjs — do not edit.
// Contains the EVG layout engine (Ranger lib/evg, MIT).
(function () {
class EVGUnitDefaults  {
  constructor() {
    if (EVGUnitDefaults.__singleton_instance != null) {
      return EVGUnitDefaults.__singleton_instance;
    }
    this.unset = new EVGUnit();
    EVGUnitDefaults.__singleton_instance = this;
  }
}
EVGUnitDefaults.__singleton_instance = null;
EVGUnitDefaults.__singleton = function() {
  if (EVGUnitDefaults.__singleton_instance == null) {
    EVGUnitDefaults.__singleton_instance = new EVGUnitDefaults();
  }
  return EVGUnitDefaults.__singleton_instance;
};
class EVGUnit  {
  constructor() {
    this.value = 0.0;
    this.unitType = 0;
    this.isSet = false;
    this.pixels = 0.0;
    this.rootFontSize = 14.0;
    this.viewportW = 0.0;
    this.viewportH = 0.0;
    this.value = 0.0;
    this.unitType = 0;
    this.isSet = false;
    this.pixels = 0.0;
  }
  setContext (rfs, vw, vh) {
    if ( this.isSet == false ) {
      return;
    }
    this.rootFontSize = rfs;
    this.viewportW = vw;
    this.viewportH = vh;
  };
  resolve (parentSize, fontSize) {
    if ( this.isSet == false ) {
      if ( this.pixels != 0.0 ) {
        this.pixels = 0.0;
      }
      return;
    }
    if ( this.unitType == 0 ) {
      this.pixels = this.value;
      return;
    }
    if ( this.unitType == 1 ) {
      this.pixels = (parentSize * this.value) / 100.0;
      return;
    }
    if ( this.unitType == 2 ) {
      this.pixels = fontSize * this.value;
      return;
    }
    if ( this.unitType == 5 ) {
      this.pixels = this.rootFontSize * this.value;
      return;
    }
    if ( this.unitType == 3 ) {
      this.pixels = (parentSize * this.value) / 100.0;
      return;
    }
    if ( this.unitType == 7 ) {
      this.pixels = (this.viewportW * this.value) / 100.0;
      return;
    }
    if ( this.unitType == 8 ) {
      this.pixels = (this.viewportH * this.value) / 100.0;
      return;
    }
    if ( this.unitType == 4 ) {
      this.pixels = parentSize;
      return;
    }
    this.pixels = this.value;
  };
  resolveForHeight (parentWidth, parentHeight, fontSize) {
    if ( this.isSet == false ) {
      if ( this.pixels != 0.0 ) {
        this.pixels = 0.0;
      }
      return;
    }
    if ( this.unitType == 3 ) {
      this.pixels = (parentHeight * this.value) / 100.0;
      return;
    }
    if ( this.unitType == 1 ) {
      this.pixels = (parentHeight * this.value) / 100.0;
      return;
    }
    this.resolve(parentWidth, fontSize);
  };
  resolveWithHeight (parentWidth, parentHeight, fontSize) {
    if ( this.isSet == false ) {
      if ( this.pixels != 0.0 ) {
        this.pixels = 0.0;
      }
      return;
    }
    if ( this.unitType == 3 ) {
      this.pixels = (parentHeight * this.value) / 100.0;
      return;
    }
    this.resolve(parentWidth, fontSize);
  };
  isPixels () {
    return this.unitType == 0;
  };
  isPercent () {
    return this.unitType == 1;
  };
  isEm () {
    return this.unitType == 2;
  };
  isRem () {
    return this.unitType == 5;
  };
  isHeightPercent () {
    return this.unitType == 3;
  };
  isFill () {
    return this.unitType == 4;
  };
  isViewport () {
    if ( this.unitType == 7 ) {
      return true;
    }
    return this.unitType == 8;
  };
  toString () {
    if ( this.isSet == false ) {
      return "unset";
    }
    if ( this.unitType == 0 ) {
      return (this.value.toString()) + "px";
    }
    if ( this.unitType == 1 ) {
      return (this.value.toString()) + "%";
    }
    if ( this.unitType == 2 ) {
      return (this.value.toString()) + "em";
    }
    if ( this.unitType == 3 ) {
      return (this.value.toString()) + "hp";
    }
    if ( this.unitType == 4 ) {
      return "fill";
    }
    if ( this.unitType == 5 ) {
      return (this.value.toString()) + "rem";
    }
    if ( this.unitType == 7 ) {
      return (this.value.toString()) + "vw";
    }
    if ( this.unitType == 8 ) {
      return (this.value.toString()) + "vh";
    }
    return (this.value.toString());
  };
}
EVGUnit.isNumeric = function(str) {
  const n = str.length;
  if ( n == 0 ) {
    return false;
  }
  let i = 0;
  let digits = 0;
  while (i < n) {
    const c = str.charCodeAt(i );
    const isDigit = c >= 48 && c <= 57;
    if ( isDigit ) {
      digits = digits + 1;
    } else {
      if ( c == 46 ) {
      } else {
        if ( c == 43 || c == 45 ) {
          if ( i > 0 ) {
            return false;
          }
        } else {
          return false;
        }
      }
    }
    i = i + 1;
  };
  return digits > 0;
};
EVGUnit.isAlpha = function(c) {
  if ( c >= 65 && c <= 90 ) {
    return true;
  }
  return c >= 97 && c <= 122;
};
EVGUnit.pxPerUnit = function(suffix) {
  if ( suffix == "pt" ) {
    return 96.0 / 72.0;
  }
  if ( suffix == "pc" ) {
    return 16.0;
  }
  if ( suffix == "in" ) {
    return 96.0;
  }
  if ( suffix == "mm" ) {
    return 96.0 / 25.4;
  }
  if ( suffix == "cm" ) {
    return 96.0 / 2.54;
  }
  return 0.0;
};
EVGUnit.create = function(val, uType) {
  const unit = new EVGUnit();
  unit.value = val;
  unit.unitType = uType;
  unit.isSet = true;
  return unit;
};
EVGUnit.px = function(val) {
  const unit = EVGUnit.create(val, 0);
  unit.pixels = val;
  return unit;
};
EVGUnit.percent = function(val) {
  return EVGUnit.create(val, 1);
};
EVGUnit.em = function(val) {
  return EVGUnit.create(val, 2);
};
EVGUnit.rem = function(val) {
  return EVGUnit.create(val, 5);
};
EVGUnit.heightPercent = function(val) {
  return EVGUnit.create(val, 3);
};
EVGUnit.fill = function() {
  return EVGUnit.create(100.0, 4);
};
EVGUnit.unset = function() {
  return EVGUnitDefaults.__singleton().unset;
};
EVGUnit.parse = function(str) {
  const unit = new EVGUnit();
  const trimmed = str.trim();
  const __len = trimmed.length;
  if ( __len == 0 ) {
    return unit;
  }
  if ( trimmed == "fill" ) {
    unit.value = 100.0;
    unit.unitType = 4;
    unit.isSet = true;
    return unit;
  }
  if ( trimmed == "auto" ) {
    return unit;
  }
  if ( trimmed == "fit-content" ) {
    unit.value = 0.0;
    unit.unitType = 6;
    unit.isSet = false;
    return unit;
  }
  const lastChar = trimmed.charCodeAt(__len - 1 );
  if ( lastChar == 37 ) {
    const numStr = trimmed.substring(0, __len - 1 );
    if ( EVGUnit.isNumeric(numStr) == false ) {
      return unit;
    }
    const numVal = isNaN( parseFloat(numStr) ) ? undefined : parseFloat(numStr);
    if ( typeof(numVal) != "undefined" ) {
      unit.value = numVal;
      unit.unitType = 1;
      unit.isSet = true;
    }
    return unit;
  }
  if ( __len >= 3 ) {
    const suffix3 = trimmed.substring(__len - 3, __len );
    if ( suffix3 == "rem" ) {
      const numStr3 = trimmed.substring(0, __len - 3 );
      if ( EVGUnit.isNumeric(numStr3) == false ) {
        return unit;
      }
      const numVal3 = isNaN( parseFloat(numStr3) ) ? undefined : parseFloat(numStr3);
      if ( typeof(numVal3) != "undefined" ) {
        unit.value = numVal3;
        unit.unitType = 5;
        unit.isSet = true;
      }
      return unit;
    }
  }
  if ( __len >= 2 ) {
    const suffix = trimmed.substring(__len - 2, __len );
    const perUnit = EVGUnit.pxPerUnit(suffix);
    if ( perUnit > 0.0 ) {
      const numStrA = trimmed.substring(0, __len - 2 );
      if ( EVGUnit.isNumeric(numStrA) == false ) {
        return unit;
      }
      const numValA = isNaN( parseFloat(numStrA) ) ? undefined : parseFloat(numStrA);
      if ( typeof(numValA) != "undefined" ) {
        unit.value = numValA * perUnit;
        unit.pixels = unit.value;
        unit.unitType = 0;
        unit.isSet = true;
      }
      return unit;
    }
    if ( suffix == "em" ) {
      const numStr_1 = trimmed.substring(0, __len - 2 );
      if ( EVGUnit.isNumeric(numStr_1) == false ) {
        return unit;
      }
      const numVal_1 = isNaN( parseFloat(numStr_1) ) ? undefined : parseFloat(numStr_1);
      if ( typeof(numVal_1) != "undefined" ) {
        unit.value = numVal_1;
        unit.unitType = 2;
        unit.isSet = true;
      }
      return unit;
    }
    if ( suffix == "px" ) {
      const numStr_2 = trimmed.substring(0, __len - 2 );
      if ( EVGUnit.isNumeric(numStr_2) == false ) {
        return unit;
      }
      const numVal_2 = isNaN( parseFloat(numStr_2) ) ? undefined : parseFloat(numStr_2);
      if ( typeof(numVal_2) != "undefined" ) {
        unit.value = numVal_2;
        unit.pixels = unit.value;
        unit.unitType = 0;
        unit.isSet = true;
      }
      return unit;
    }
    if ( suffix == "hp" ) {
      const numStr_3 = trimmed.substring(0, __len - 2 );
      if ( EVGUnit.isNumeric(numStr_3) == false ) {
        return unit;
      }
      const numVal_3 = isNaN( parseFloat(numStr_3) ) ? undefined : parseFloat(numStr_3);
      if ( typeof(numVal_3) != "undefined" ) {
        unit.value = numVal_3;
        unit.unitType = 3;
        unit.isSet = true;
      }
      return unit;
    }
    if ( suffix == "vw" ) {
      const numStrVW = trimmed.substring(0, __len - 2 );
      if ( EVGUnit.isNumeric(numStrVW) == false ) {
        return unit;
      }
      const numValVW = isNaN( parseFloat(numStrVW) ) ? undefined : parseFloat(numStrVW);
      if ( typeof(numValVW) != "undefined" ) {
        unit.value = numValVW;
        unit.unitType = 7;
        unit.isSet = true;
      }
      return unit;
    }
    if ( suffix == "vh" ) {
      const numStrVH = trimmed.substring(0, __len - 2 );
      if ( EVGUnit.isNumeric(numStrVH) == false ) {
        return unit;
      }
      const numValVH = isNaN( parseFloat(numStrVH) ) ? undefined : parseFloat(numStrVH);
      if ( typeof(numValVH) != "undefined" ) {
        unit.value = numValVH;
        unit.unitType = 8;
        unit.isSet = true;
      }
      return unit;
    }
  }
  if ( EVGUnit.isAlpha(lastChar) || lastChar == 41 ) {
    return unit;
  }
  const numVal_4 = isNaN( parseFloat(trimmed) ) ? undefined : parseFloat(trimmed);
  if ( typeof(numVal_4) != "undefined" ) {
    unit.value = numVal_4;
    unit.pixels = unit.value;
    unit.unitType = 0;
    unit.isSet = true;
  }
  return unit;
};
class EVGRejectStore  {
  constructor() {
    if (EVGRejectStore.__singleton_instance != null) {
      return EVGRejectStore.__singleton_instance;
    }
    this.kinds = [];
    this.names = [];
    this.values = [];
    this.total = 0;
    this.cap = 64;
    EVGRejectStore.__singleton_instance = this;
  }
}
EVGRejectStore.__singleton_instance = null;
EVGRejectStore.__singleton = function() {
  if (EVGRejectStore.__singleton_instance == null) {
    EVGRejectStore.__singleton_instance = new EVGRejectStore();
  }
  return EVGRejectStore.__singleton_instance;
};
class EVGReject  {
  constructor() {
  }
}
EVGReject.store = function() {
  return EVGRejectStore.__singleton();
};
EVGReject.note = function(kind, name, value) {
  const s = EVGReject.store();
  s.total = s.total + 1;
  const n = s.names.length;
  if ( n >= s.cap ) {
    return;
  }
  let i = 0;
  while (i < n) {
    const kn = s.kinds[i];
    const nm = s.names[i];
    const vl = s.values[i];
    if ( (kn == kind && nm == name) && vl == value ) {
      return;
    }
    i = i + 1;
  };
  s.kinds.push(kind);
  s.names.push(name);
  s.values.push(value);
};
EVGReject.noteCount = function() {
  const s = EVGReject.store();
  return s.names.length;
};
EVGReject.noteTotal = function() {
  const s = EVGReject.store();
  return s.total;
};
EVGReject.noteAt = function(i) {
  const s = EVGReject.store();
  const kn = s.kinds[i];
  const nm = s.names[i];
  const vl = s.values[i];
  return (((kn + ": ") + nm) + ": ") + vl;
};
EVGReject.clearNotes = function() {
  const s = EVGReject.store();
  let empty1 = [];
  let empty2 = [];
  let empty3 = [];
  s.kinds = empty1;
  s.names = empty2;
  s.values = empty3;
  s.total = 0;
};
EVGReject.isAbsent = function(value) {
  if ( value.length == 0 ) {
    return true;
  }
  if ( value == "auto" ) {
    return true;
  }
  if ( value == "none" ) {
    return true;
  }
  if ( value == "normal" ) {
    return true;
  }
  if ( value == "initial" ) {
    return true;
  }
  if ( value == "inherit" ) {
    return true;
  }
  if ( value == "unset" ) {
    return true;
  }
  return false;
};
class EVGColorDefaults  {
  constructor() {
    if (EVGColorDefaults.__singleton_instance != null) {
      return EVGColorDefaults.__singleton_instance;
    }
    this.noColor = new EVGColor();
    this.black = new EVGColor();
    this.noColor.isSet = false;
    EVGColorDefaults.__singleton_instance = this;
  }
}
EVGColorDefaults.__singleton_instance = null;
EVGColorDefaults.__singleton = function() {
  if (EVGColorDefaults.__singleton_instance == null) {
    EVGColorDefaults.__singleton_instance = new EVGColorDefaults();
  }
  return EVGColorDefaults.__singleton_instance;
};
class EVGColor  {
  constructor() {
    this.r = 0.0;
    this.g = 0.0;
    this.b = 0.0;
    this.a = 1.0;
    this.isSet = true;
    this.r = 0.0;
    this.g = 0.0;
    this.b = 0.0;
    this.a = 1.0;
    this.isSet = true;
  }
  red () {
    if ( this.r > 255.0 ) {
      return 255;
    }
    if ( this.r < 0.0 ) {
      return 0;
    }
    return Math.floor( this.r + 0.5);
  };
  green () {
    if ( this.g > 255.0 ) {
      return 255;
    }
    if ( this.g < 0.0 ) {
      return 0;
    }
    return Math.floor( this.g + 0.5);
  };
  blue () {
    if ( this.b > 255.0 ) {
      return 255;
    }
    if ( this.b < 0.0 ) {
      return 0;
    }
    return Math.floor( this.b + 0.5);
  };
  alpha () {
    if ( this.a < 0.0 ) {
      return 0.0;
    }
    if ( this.a > 1.0 ) {
      return 1.0;
    }
    return this.a;
  };
  toCSSString () {
    if ( this.isSet == false ) {
      return "none";
    }
    if ( this.a < 1.0 ) {
      return ((((((("rgba(" + (this.red().toString())) + ",") + (this.green().toString())) + ",") + (this.blue().toString())) + ",") + (this.alpha().toString())) + ")";
    }
    return ((((("rgb(" + (this.red().toString())) + ",") + (this.green().toString())) + ",") + (this.blue().toString())) + ")";
  };
  toHexString () {
    if ( this.isSet == false ) {
      return "none";
    }
    const hexChars = "0123456789ABCDEF";
    const rH = this.red();
    const gH = this.green();
    const bH = this.blue();
    const r1D = rH / 16.0;
    const r1 = Math.floor( r1D);
    const r2 = rH % 16;
    const g1D = gH / 16.0;
    const g1 = Math.floor( g1D);
    const g2 = gH % 16;
    const b1D = bH / 16.0;
    const b1 = Math.floor( b1D);
    const b2 = bH % 16;
    return ((((("#" + String.fromCharCode(hexChars.charCodeAt(r1 ))) + String.fromCharCode(hexChars.charCodeAt(r2 ))) + String.fromCharCode(hexChars.charCodeAt(g1 ))) + String.fromCharCode(hexChars.charCodeAt(g2 ))) + String.fromCharCode(hexChars.charCodeAt(b1 ))) + String.fromCharCode(hexChars.charCodeAt(b2 ));
  };
  toPDFColorString () {
    if ( this.isSet == false ) {
      return "";
    }
    const rN = this.r / 255.0;
    const gN = this.g / 255.0;
    const bN = this.b / 255.0;
    return ((((rN.toString()) + " ") + (gN.toString())) + " ") + (bN.toString());
  };
  withAlpha (newAlpha) {
    return EVGColor.create(this.r, this.g, this.b, newAlpha);
  };
  lighten (amount) {
    const newR = this.r + (255.0 - this.r) * amount;
    const newG = this.g + (255.0 - this.g) * amount;
    const newB = this.b + (255.0 - this.b) * amount;
    return EVGColor.create(newR, newG, newB, this.a);
  };
  darken (amount) {
    const newR = this.r * (1.0 - amount);
    const newG = this.g * (1.0 - amount);
    const newB = this.b * (1.0 - amount);
    return EVGColor.create(newR, newG, newB, this.a);
  };
}
EVGColor.create = function(red, green, blue, alpha) {
  const c = new EVGColor();
  c.r = red;
  c.g = green;
  c.b = blue;
  c.a = alpha;
  c.isSet = true;
  return c;
};
EVGColor.rgb = function(red, green, blue) {
  return EVGColor.create(red, green, blue, 1.0);
};
EVGColor.rgba = function(red, green, blue, alpha) {
  return EVGColor.create(red, green, blue, alpha);
};
EVGColor.noColor = function() {
  return EVGColorDefaults.__singleton().noColor;
};
EVGColor.black = function() {
  return EVGColorDefaults.__singleton().black;
};
EVGColor.white = function() {
  return EVGColor.rgb(255, 255, 255);
};
EVGColor.transparent = function() {
  return EVGColor.rgba(0, 0, 0, 0.0);
};
EVGColor.hexDigit = function(ch) {
  if ( ch >= 48 && ch <= 57 ) {
    return ch - 48;
  }
  if ( ch >= 65 && ch <= 70 ) {
    return (ch - 65) + 10;
  }
  if ( ch >= 97 && ch <= 102 ) {
    return (ch - 97) + 10;
  }
  return 0;
};
EVGColor.parseHex = function(hex) {
  const c = new EVGColor();
  let __len = hex.length;
  let start = 0;
  if ( __len > 0 ) {
    const firstChar = hex.charCodeAt(0 );
    if ( firstChar == 35 ) {
      start = 1;
      __len = __len - 1;
    }
  }
  if ( __len == 3 ) {
    const r1 = EVGColor.hexDigit(hex.charCodeAt(start ));
    const g1 = EVGColor.hexDigit(hex.charCodeAt(start + 1 ));
    const b1 = EVGColor.hexDigit(hex.charCodeAt(start + 2 ));
    c.r = (r1 * 16 + r1);
    c.g = (g1 * 16 + g1);
    c.b = (b1 * 16 + b1);
    c.a = 1.0;
    c.isSet = true;
    return c;
  }
  if ( __len == 4 ) {
    const r4 = EVGColor.hexDigit(hex.charCodeAt(start ));
    const g4 = EVGColor.hexDigit(hex.charCodeAt(start + 1 ));
    const b4 = EVGColor.hexDigit(hex.charCodeAt(start + 2 ));
    const a4 = EVGColor.hexDigit(hex.charCodeAt(start + 3 ));
    c.r = (r4 * 16 + r4);
    c.g = (g4 * 16 + g4);
    c.b = (b4 * 16 + b4);
    c.a = (a4 * 16 + a4) / 255.0;
    c.isSet = true;
    return c;
  }
  if ( __len == 6 ) {
    const r1_1 = EVGColor.hexDigit(hex.charCodeAt(start ));
    const r2 = EVGColor.hexDigit(hex.charCodeAt(start + 1 ));
    const g1_1 = EVGColor.hexDigit(hex.charCodeAt(start + 2 ));
    const g2 = EVGColor.hexDigit(hex.charCodeAt(start + 3 ));
    const b1_1 = EVGColor.hexDigit(hex.charCodeAt(start + 4 ));
    const b2 = EVGColor.hexDigit(hex.charCodeAt(start + 5 ));
    c.r = (r1_1 * 16 + r2);
    c.g = (g1_1 * 16 + g2);
    c.b = (b1_1 * 16 + b2);
    c.a = 1.0;
    c.isSet = true;
    return c;
  }
  if ( __len == 8 ) {
    const r1_2 = EVGColor.hexDigit(hex.charCodeAt(start ));
    const r2_1 = EVGColor.hexDigit(hex.charCodeAt(start + 1 ));
    const g1_2 = EVGColor.hexDigit(hex.charCodeAt(start + 2 ));
    const g2_1 = EVGColor.hexDigit(hex.charCodeAt(start + 3 ));
    const b1_2 = EVGColor.hexDigit(hex.charCodeAt(start + 4 ));
    const b2_1 = EVGColor.hexDigit(hex.charCodeAt(start + 5 ));
    const a1 = EVGColor.hexDigit(hex.charCodeAt(start + 6 ));
    const a2 = EVGColor.hexDigit(hex.charCodeAt(start + 7 ));
    c.r = (r1_2 * 16 + r2_1);
    c.g = (g1_2 * 16 + g2_1);
    c.b = (b1_2 * 16 + b2_1);
    c.a = (a1 * 16 + a2) / 255.0;
    c.isSet = true;
    return c;
  }
  c.isSet = false;
  return c;
};
EVGColor.hue6 = function(p, q, t6in) {
  let t6 = t6in;
  while (t6 < 0.0) {
    t6 = t6 + 6.0;
  };
  while (t6 >= 6.0) {
    t6 = t6 - 6.0;
  };
  if ( t6 < 1.0 ) {
    return p + (q - p) * t6;
  }
  if ( t6 < 3.0 ) {
    return q;
  }
  if ( t6 < 4.0 ) {
    return p + (q - p) * (4.0 - t6);
  }
  return p;
};
EVGColor.hue2rgb = function(p, q, tt) {
  let t = tt;
  if ( t < 0.0 ) {
    t = t + 1.0;
  }
  if ( t > 1.0 ) {
    t = t - 1.0;
  }
  const t6 = t * 6.0;
  if ( t6 < 1.0 ) {
    return p + (q - p) * t6;
  }
  if ( t6 < 3.0 ) {
    return q;
  }
  if ( t6 < 4.0 ) {
    return p + (q - p) * (4.0 - t6);
  }
  return p;
};
EVGColor.hslToRgb = function(h, s, l) {
  const c = new EVGColor();
  const hNorm = h / 360.0;
  const sNorm = s / 100.0;
  const lNorm = l / 100.0;
  if ( sNorm == 0.0 ) {
    const gray = lNorm * 255.0;
    c.r = gray;
    c.g = gray;
    c.b = gray;
  } else {
    let q = 0.0;
    if ( lNorm < 0.5 ) {
      q = lNorm * (1.0 + sNorm);
    } else {
      q = (lNorm + sNorm) - lNorm * sNorm;
    }
    const p = 2.0 * lNorm - q;
    const h6 = h / 60.0;
    c.r = EVGColor.hue6(p, q, (h6 + 2.0)) * 255.0;
    c.g = EVGColor.hue6(p, q, h6) * 255.0;
    c.b = EVGColor.hue6(p, q, (h6 - 2.0)) * 255.0;
  }
  c.a = 1.0;
  c.isSet = true;
  return c;
};
EVGColor.parseNumber = function(str) {
  const val = isNaN( parseFloat(str.trim()) ) ? undefined : parseFloat(str.trim());
  return val;
};
EVGColor.parse = function(str) {
  const trimmed = str.trim();
  const __len = trimmed.length;
  if ( __len == 0 ) {
    return EVGColor.noColor();
  }
  const firstChar = trimmed.charCodeAt(0 );
  if ( firstChar == 35 ) {
    return EVGColor.parseHex(trimmed);
  }
  if ( __len >= 4 ) {
    const prefix = trimmed.substring(0, 4 );
    if ( prefix == "rgba" ) {
      return EVGColor.parseRgba(trimmed);
    }
    const prefix3 = trimmed.substring(0, 3 );
    if ( prefix3 == "rgb" ) {
      return EVGColor.parseRgb(trimmed);
    }
    if ( prefix3 == "hsl" ) {
      return EVGColor.parseHsl(trimmed);
    }
  }
  return EVGColor.parseNamed(trimmed);
};
EVGColor.parseRgb = function(str) {
  const c = new EVGColor();
  const __len = str.length;
  let start = 0;
  let i = 0;
  while (i < __len) {
    const ch = str.charCodeAt(i );
    if ( ch == 40 ) {
      start = i + 1;
    }
    i = i + 1;
  };
  let end = __len - 1;
  i = __len - 1;
  while (i >= 0) {
    const ch_1 = str.charCodeAt(i );
    if ( ch_1 == 41 ) {
      end = i;
    }
    i = i - 1;
  };
  const content = str.substring(start, end );
  let parts = [];
  let current = "";
  i = 0;
  const contentLen = content.length;
  while (i < contentLen) {
    const ch_2 = content.charCodeAt(i );
    if ( ch_2 == 44 || ch_2 == 32 ) {
      const trimPart = current.trim();
      if ( trimPart.length > 0 ) {
        parts.push(trimPart);
      }
      current = "";
    } else {
      current = current + String.fromCharCode(ch_2);
    }
    i = i + 1;
  };
  const trimPart_1 = current.trim();
  if ( trimPart_1.length > 0 ) {
    parts.push(trimPart_1);
  }
  if ( parts.length >= 3 ) {
    c.r = EVGColor.parseNumber(parts[0]);
    c.g = EVGColor.parseNumber(parts[1]);
    c.b = EVGColor.parseNumber(parts[2]);
    c.a = 1.0;
    c.isSet = true;
  }
  return c;
};
EVGColor.parseRgba = function(str) {
  const c = EVGColor.parseRgb(str);
  const __len = str.length;
  let start = 0;
  let end = __len - 1;
  let i = 0;
  while (i < __len) {
    const ch = str.charCodeAt(i );
    if ( ch == 40 ) {
      start = i + 1;
    }
    if ( ch == 41 ) {
      end = i;
    }
    i = i + 1;
  };
  const content = str.substring(start, end );
  let parts = [];
  let current = "";
  i = 0;
  const contentLen = content.length;
  while (i < contentLen) {
    const ch_1 = content.charCodeAt(i );
    if ( ch_1 == 44 || ch_1 == 32 ) {
      const trimPart = current.trim();
      if ( trimPart.length > 0 ) {
        parts.push(trimPart);
      }
      current = "";
    } else {
      current = current + String.fromCharCode(ch_1);
    }
    i = i + 1;
  };
  const trimPart_1 = current.trim();
  if ( trimPart_1.length > 0 ) {
    parts.push(trimPart_1);
  }
  if ( parts.length >= 4 ) {
    c.r = EVGColor.parseNumber(parts[0]);
    c.g = EVGColor.parseNumber(parts[1]);
    c.b = EVGColor.parseNumber(parts[2]);
    c.a = EVGColor.parseNumber(parts[3]);
    c.isSet = true;
  }
  return c;
};
EVGColor.parseHsl = function(str) {
  const __len = str.length;
  let start = 0;
  let end = __len - 1;
  let i = 0;
  while (i < __len) {
    const ch = str.charCodeAt(i );
    if ( ch == 40 ) {
      start = i + 1;
    }
    if ( ch == 41 ) {
      end = i;
    }
    i = i + 1;
  };
  const content = str.substring(start, end );
  let parts = [];
  let current = "";
  i = 0;
  const contentLen = content.length;
  while (i < contentLen) {
    const ch_1 = content.charCodeAt(i );
    if ( ch_1 == 44 || ch_1 == 32 ) {
      const trimPart = current.trim();
      if ( trimPart.length > 0 ) {
        parts.push(trimPart);
      }
      current = "";
    } else {
      current = current + String.fromCharCode(ch_1);
    }
    i = i + 1;
  };
  const trimPart_1 = current.trim();
  if ( trimPart_1.length > 0 ) {
    parts.push(trimPart_1);
  }
  if ( parts.length >= 3 ) {
    const h = EVGColor.parseNumber(parts[0]);
    const s = EVGColor.parseNumber(parts[1]);
    const l = EVGColor.parseNumber(parts[2]);
    const c = EVGColor.hslToRgb(h, s, l);
    if ( parts.length >= 4 ) {
      c.a = EVGColor.parseNumber(parts[3]);
    }
    return c;
  }
  return EVGColor.noColor();
};
EVGColor.parseNamed = function(name) {
  let lower = "";
  const __len = name.length;
  let i = 0;
  while (i < __len) {
    const ch = name.charCodeAt(i );
    if ( ch >= 65 && ch <= 90 ) {
      lower = lower + String.fromCharCode(ch + 32);
    } else {
      lower = lower + String.fromCharCode(ch);
    }
    i = i + 1;
  };
  if ( lower == "black" ) {
    return EVGColor.rgb(0, 0, 0);
  }
  if ( lower == "white" ) {
    return EVGColor.rgb(255, 255, 255);
  }
  if ( lower == "red" ) {
    return EVGColor.rgb(255, 0, 0);
  }
  if ( lower == "green" ) {
    return EVGColor.rgb(0, 128, 0);
  }
  if ( lower == "blue" ) {
    return EVGColor.rgb(0, 0, 255);
  }
  if ( lower == "yellow" ) {
    return EVGColor.rgb(255, 255, 0);
  }
  if ( lower == "cyan" ) {
    return EVGColor.rgb(0, 255, 255);
  }
  if ( lower == "magenta" ) {
    return EVGColor.rgb(255, 0, 255);
  }
  if ( lower == "gray" ) {
    return EVGColor.rgb(128, 128, 128);
  }
  if ( lower == "grey" ) {
    return EVGColor.rgb(128, 128, 128);
  }
  if ( lower == "orange" ) {
    return EVGColor.rgb(255, 165, 0);
  }
  if ( lower == "purple" ) {
    return EVGColor.rgb(128, 0, 128);
  }
  if ( lower == "pink" ) {
    return EVGColor.rgb(255, 192, 203);
  }
  if ( lower == "brown" ) {
    return EVGColor.rgb(165, 42, 42);
  }
  if ( lower == "navy" ) {
    return EVGColor.rgb(0, 0, 128);
  }
  if ( lower == "teal" ) {
    return EVGColor.rgb(0, 128, 128);
  }
  if ( lower == "olive" ) {
    return EVGColor.rgb(128, 128, 0);
  }
  if ( lower == "maroon" ) {
    return EVGColor.rgb(128, 0, 0);
  }
  if ( lower == "silver" ) {
    return EVGColor.rgb(192, 192, 192);
  }
  if ( lower == "lime" ) {
    return EVGColor.rgb(0, 255, 0);
  }
  if ( lower == "aqua" ) {
    return EVGColor.rgb(0, 255, 255);
  }
  if ( lower == "fuchsia" ) {
    return EVGColor.rgb(255, 0, 255);
  }
  if ( lower == "transparent" ) {
    return EVGColor.transparent();
  }
  if ( lower == "none" ) {
    return EVGColor.noColor();
  }
  return EVGColor.noColor();
};
class EVGEasing  {
  constructor() {
    this.kind = 0;
    this.x1 = 0.0;
    this.y1 = 0.0;
    this.x2 = 1.0;
    this.y2 = 1.0;
    this.stepCount = 1;
    this.jumpStart = false;
    this.ok = true;
  }
  ease (t) {
    let x = t;
    if ( x < 0.0 ) {
      x = 0.0;
    }
    if ( x > 1.0 ) {
      x = 1.0;
    }
    if ( this.kind == 1 ) {
      return this.stepAt(x);
    }
    if ( ((this.x1 == 0.0 && this.y1 == 0.0) && this.x2 == 1.0) && this.y2 == 1.0 ) {
      return x;
    }
    return this.sampleY(this.solveT(x));
  };
  stepAt (x) {
    const n = this.stepCount;
    const raw = x * n;
    let k = Math.floor(raw);
    if ( this.jumpStart ) {
      k = k + 1;
    }
    const v = k / n;
    if ( v < 0.0 ) {
      return 0.0;
    }
    if ( v > 1.0 ) {
      return 1.0;
    }
    return v;
  };
  sampleX (t) {
    const cx = 3.0 * this.x1;
    const bx = 3.0 * (this.x2 - this.x1) - cx;
    const a = (1.0 - cx) - bx;
    return ((a * t + bx) * t + cx) * t;
  };
  sampleY (t) {
    const cy = 3.0 * this.y1;
    const by = 3.0 * (this.y2 - this.y1) - cy;
    const a = (1.0 - cy) - by;
    return ((a * t + by) * t + cy) * t;
  };
  slopeX (t) {
    const cx = 3.0 * this.x1;
    const bx = 3.0 * (this.x2 - this.x1) - cx;
    const a = (1.0 - cx) - bx;
    return ((3.0 * a) * t + 2.0 * bx) * t + cx;
  };
  solveT (x) {
    let t = x;
    let i = 0;
    while (i < 8) {
      const err = this.sampleX(t) - x;
      if ( Math.abs(err) < 1e-7 ) {
        return t;
      }
      const d = this.slopeX(t);
      if ( Math.abs(d) < 0.000001 ) {
        i = 8;
      } else {
        t = t - err / d;
        if ( t < 0.0 || t > 1.0 ) {
          i = 8;
        }
        i = i + 1;
      }
    };
    let lo = 0.0;
    let hi = 1.0;
    let m = x;
    if ( m < lo || m > hi ) {
      m = 0.5;
    }
    let j = 0;
    while (j < 64) {
      const v = this.sampleX(m);
      if ( Math.abs(v - x) < 1e-7 ) {
        return m;
      }
      if ( v < x ) {
        lo = m;
      } else {
        hi = m;
      }
      m = (lo + hi) / 2.0;
      j = j + 1;
    };
    return m;
  };
}
EVGEasing.cubic = function(x1, y1, x2, y2) {
  const e = new EVGEasing();
  e.kind = 0;
  e.x1 = x1;
  e.y1 = y1;
  e.x2 = x2;
  e.y2 = y2;
  return e;
};
EVGEasing.linear = function() {
  return EVGEasing.cubic(0.0, 0.0, 1.0, 1.0);
};
EVGEasing.steps = function(count, atStart) {
  const e = new EVGEasing();
  e.kind = 1;
  e.stepCount = count;
  if ( count < 1 ) {
    e.stepCount = 1;
  }
  e.jumpStart = atStart;
  return e;
};
EVGEasing.parse = function(text) {
  const t = text.trim();
  if ( t.length == 0 ) {
    return EVGEasing.linear();
  }
  if ( t == "linear" ) {
    return EVGEasing.cubic(0.0, 0.0, 1.0, 1.0);
  }
  if ( t == "ease" ) {
    return EVGEasing.cubic(0.25, 0.1, 0.25, 1.0);
  }
  if ( t == "ease-in" ) {
    return EVGEasing.cubic(0.42, 0.0, 1.0, 1.0);
  }
  if ( t == "ease-out" ) {
    return EVGEasing.cubic(0.0, 0.0, 0.58, 1.0);
  }
  if ( t == "ease-in-out" ) {
    return EVGEasing.cubic(0.42, 0.0, 0.58, 1.0);
  }
  if ( t == "step-start" ) {
    return EVGEasing.steps(1, true);
  }
  if ( t == "step-end" ) {
    return EVGEasing.steps(1, false);
  }
  const args = EVGEasing.argsOf(t, "cubic-bezier");
  if ( args.length > 0 ) {
    const nums = EVGEasing.numbers(args);
    if ( nums.length == 4 ) {
      const cx1 = EVGEasing.clamp01(nums[0]);
      const cx2 = EVGEasing.clamp01(nums[2]);
      return EVGEasing.cubic(cx1, nums[1], cx2, nums[3]);
    }
    const bad = EVGEasing.linear();
    bad.ok = false;
    return bad;
  }
  const sargs = EVGEasing.argsOf(t, "steps");
  if ( sargs.length > 0 ) {
    const parts = EVGEasing.splitTop(sargs, 44);
    const countTxt = parts[0].trim();
    const n = isNaN( parseFloat(countTxt) ) ? undefined : parseFloat(countTxt);
    if ( typeof(n) != "undefined" ) {
      let atStart = false;
      if ( parts.length > 1 ) {
        const word = parts[1].trim();
        if ( word == "start" || word == "jump-start" ) {
          atStart = true;
        }
      }
      return EVGEasing.steps(Math.floor( n), atStart);
    }
  }
  const unknown = EVGEasing.linear();
  unknown.ok = false;
  return unknown;
};
EVGEasing.looksLikeFunction = function(text) {
  const t = text.trim();
  if ( t == "linear" ) {
    return true;
  }
  if ( t == "ease" ) {
    return true;
  }
  if ( t == "ease-in" ) {
    return true;
  }
  if ( t == "ease-out" ) {
    return true;
  }
  if ( t == "ease-in-out" ) {
    return true;
  }
  if ( t == "step-start" ) {
    return true;
  }
  if ( t == "step-end" ) {
    return true;
  }
  if ( EVGEasing.argsOf(t, "cubic-bezier").length > 0 ) {
    return true;
  }
  if ( EVGEasing.argsOf(t, "steps").length > 0 ) {
    return true;
  }
  const n = t.length;
  if ( n > 2 ) {
    if ( t.charCodeAt(n - 1 ) == 41 ) {
      let i = 0;
      while (i < n) {
        if ( t.charCodeAt(i ) == 40 ) {
          return true;
        }
        i = i + 1;
      };
    }
  }
  return false;
};
EVGEasing.argsOf = function(t, name) {
  const nl = name.length;
  const tl = t.length;
  if ( tl < nl + 3 ) {
    return "";
  }
  if ( t.substring(0, nl ) != name ) {
    return "";
  }
  if ( t.charCodeAt(nl ) != 40 ) {
    return "";
  }
  if ( t.charCodeAt(tl - 1 ) != 41 ) {
    return "";
  }
  return t.substring(nl + 1, tl - 1 );
};
EVGEasing.numbers = function(s) {
  let out = [];
  const parts = EVGEasing.splitTop(s, 44);
  let i = 0;
  while (i < parts.length) {
    const v = isNaN( parseFloat(parts[i].trim()) ) ? undefined : parseFloat(parts[i].trim());
    if ( typeof(v) != "undefined" ) {
      out.push(v);
    }
    i = i + 1;
  };
  return out;
};
EVGEasing.splitTop = function(s, ch) {
  let out = [];
  let depth = 0;
  let start = 0;
  let i = 0;
  const n = s.length;
  while (i < n) {
    const c = s.charCodeAt(i );
    if ( c == 40 ) {
      depth = depth + 1;
    }
    if ( c == 41 ) {
      depth = depth - 1;
    }
    if ( c == ch && depth == 0 ) {
      out.push(s.substring(start, i ));
      start = i + 1;
    }
    i = i + 1;
  };
  out.push(s.substring(start, n ));
  return out;
};
EVGEasing.splitWordsTop = function(s) {
  let out = [];
  let depth = 0;
  let start = 0;
  let i = 0;
  const n = s.length;
  while (i < n) {
    const c = s.charCodeAt(i );
    if ( c == 40 ) {
      depth = depth + 1;
    }
    if ( c == 41 ) {
      depth = depth - 1;
    }
    const isSpace = (c == 32 || c == 9) || c == 10;
    if ( isSpace && depth == 0 ) {
      if ( i > start ) {
        out.push(s.substring(start, i ));
      }
      start = i + 1;
    }
    i = i + 1;
  };
  if ( n > start ) {
    out.push(s.substring(start, n ));
  }
  return out;
};
EVGEasing.clamp01 = function(v) {
  if ( v < 0.0 ) {
    return 0.0;
  }
  if ( v > 1.0 ) {
    return 1.0;
  }
  return v;
};
class EVGBox  {
  constructor() {
    this.marginTop = undefined;
    this.marginRight = undefined;
    this.marginBottom = undefined;
    this.marginLeft = undefined;
    this.paddingTop = undefined;
    this.paddingRight = undefined;
    this.paddingBottom = undefined;
    this.paddingLeft = undefined;
    this.borderWidth = undefined;
    this.borderColor = undefined;
    this.borderRadius = undefined;
    this.borderRadiusTL = undefined;
    this.borderRadiusTR = undefined;
    this.borderRadiusBR = undefined;
    this.borderRadiusBL = undefined;
    this.marginTopPx = 0.0;
    this.marginRightPx = 0.0;
    this.marginBottomPx = 0.0;
    this.marginLeftPx = 0.0;
    this.paddingTopPx = 0.0;
    this.paddingRightPx = 0.0;
    this.paddingBottomPx = 0.0;
    this.paddingLeftPx = 0.0;
    this.borderWidthPx = 0.0;
    this.borderRadiusPx = 0.0;
    this.borderRadiusTLPx = 0.0;
    this.borderRadiusTRPx = 0.0;
    this.borderRadiusBRPx = 0.0;
    this.borderRadiusBLPx = 0.0;
    this.marginTop = EVGUnit.unset();
    this.marginRight = EVGUnit.unset();
    this.marginBottom = EVGUnit.unset();
    this.marginLeft = EVGUnit.unset();
    this.paddingTop = EVGUnit.unset();
    this.paddingRight = EVGUnit.unset();
    this.paddingBottom = EVGUnit.unset();
    this.paddingLeft = EVGUnit.unset();
    this.borderWidth = EVGUnit.unset();
    this.borderColor = EVGColor.noColor();
    this.borderRadius = EVGUnit.unset();
    this.borderRadiusTL = EVGUnit.unset();
    this.borderRadiusTR = EVGUnit.unset();
    this.borderRadiusBR = EVGUnit.unset();
    this.borderRadiusBL = EVGUnit.unset();
  }
  setMargin (all) {
    this.marginTop = all;
    this.marginRight = all;
    this.marginBottom = all;
    this.marginLeft = all;
  };
  setMarginValues (top, right, bottom, left) {
    this.marginTop = top;
    this.marginRight = right;
    this.marginBottom = bottom;
    this.marginLeft = left;
  };
  setPadding (all) {
    this.paddingTop = all;
    this.paddingRight = all;
    this.paddingBottom = all;
    this.paddingLeft = all;
  };
  setPaddingValues (top, right, bottom, left) {
    this.paddingTop = top;
    this.paddingRight = right;
    this.paddingBottom = bottom;
    this.paddingLeft = left;
  };
  resolveUnits (parentWidth, parentHeight, fontSize, rootFontSize, viewportW, viewportH) {
    this.marginTop.setContext(rootFontSize, viewportW, viewportH);
    this.marginRight.setContext(rootFontSize, viewportW, viewportH);
    this.marginBottom.setContext(rootFontSize, viewportW, viewportH);
    this.marginLeft.setContext(rootFontSize, viewportW, viewportH);
    this.paddingTop.setContext(rootFontSize, viewportW, viewportH);
    this.paddingRight.setContext(rootFontSize, viewportW, viewportH);
    this.paddingBottom.setContext(rootFontSize, viewportW, viewportH);
    this.paddingLeft.setContext(rootFontSize, viewportW, viewportH);
    this.borderWidth.setContext(rootFontSize, viewportW, viewportH);
    this.borderRadius.setContext(rootFontSize, viewportW, viewportH);
    this.borderRadiusTL.setContext(rootFontSize, viewportW, viewportH);
    this.borderRadiusTR.setContext(rootFontSize, viewportW, viewportH);
    this.borderRadiusBR.setContext(rootFontSize, viewportW, viewportH);
    this.borderRadiusBL.setContext(rootFontSize, viewportW, viewportH);
    this.marginTop.resolve(parentWidth, fontSize);
    this.marginTopPx = this.marginTop.pixels;
    this.marginRight.resolve(parentWidth, fontSize);
    this.marginRightPx = this.marginRight.pixels;
    this.marginBottom.resolve(parentWidth, fontSize);
    this.marginBottomPx = this.marginBottom.pixels;
    this.marginLeft.resolve(parentWidth, fontSize);
    this.marginLeftPx = this.marginLeft.pixels;
    this.paddingTop.resolve(parentWidth, fontSize);
    this.paddingTopPx = this.paddingTop.pixels;
    this.paddingRight.resolve(parentWidth, fontSize);
    this.paddingRightPx = this.paddingRight.pixels;
    this.paddingBottom.resolve(parentWidth, fontSize);
    this.paddingBottomPx = this.paddingBottom.pixels;
    this.paddingLeft.resolve(parentWidth, fontSize);
    this.paddingLeftPx = this.paddingLeft.pixels;
    this.borderWidth.resolve(parentWidth, fontSize);
    this.borderWidthPx = this.borderWidth.pixels;
    let smallerDim = parentWidth;
    if ( parentHeight < parentWidth ) {
      smallerDim = parentHeight;
    }
    this.borderRadius.resolve(smallerDim, fontSize);
    this.borderRadiusPx = this.borderRadius.pixels;
    this.borderRadiusTL.resolve(smallerDim, fontSize);
    this.borderRadiusTR.resolve(smallerDim, fontSize);
    this.borderRadiusBR.resolve(smallerDim, fontSize);
    this.borderRadiusBL.resolve(smallerDim, fontSize);
    this.borderRadiusTLPx = this.borderRadiusPx;
    this.borderRadiusTRPx = this.borderRadiusPx;
    this.borderRadiusBRPx = this.borderRadiusPx;
    this.borderRadiusBLPx = this.borderRadiusPx;
    if ( this.borderRadiusTL.isSet ) {
      this.borderRadiusTLPx = this.borderRadiusTL.pixels;
    }
    if ( this.borderRadiusTR.isSet ) {
      this.borderRadiusTRPx = this.borderRadiusTR.pixels;
    }
    if ( this.borderRadiusBR.isSet ) {
      this.borderRadiusBRPx = this.borderRadiusBR.pixels;
    }
    if ( this.borderRadiusBL.isSet ) {
      this.borderRadiusBLPx = this.borderRadiusBL.pixels;
    }
  };
  hasPerCornerRadius () {
    if ( this.borderRadiusTLPx != this.borderRadiusTRPx ) {
      return true;
    }
    if ( this.borderRadiusTLPx != this.borderRadiusBRPx ) {
      return true;
    }
    if ( this.borderRadiusTLPx != this.borderRadiusBLPx ) {
      return true;
    }
    return false;
  };
  getHorizontalChrome () {
    return (this.paddingLeftPx + this.paddingRightPx) + this.borderWidthPx * 2.0;
  };
  getVerticalChrome () {
    return (this.paddingTopPx + this.paddingBottomPx) + this.borderWidthPx * 2.0;
  };
  getInnerWidth (outerWidth) {
    const inner = outerWidth - this.getHorizontalChrome();
    if ( inner < 0.0 ) {
      return 0.0;
    }
    return inner;
  };
  getInnerHeight (outerHeight) {
    const inner = outerHeight - this.getVerticalChrome();
    if ( inner < 0.0 ) {
      return 0.0;
    }
    return inner;
  };
  getTotalWidth (contentWidth) {
    return ((((contentWidth + this.marginLeftPx) + this.marginRightPx) + this.paddingLeftPx) + this.paddingRightPx) + this.borderWidthPx * 2.0;
  };
  getTotalHeight (contentHeight) {
    return ((((contentHeight + this.marginTopPx) + this.marginBottomPx) + this.paddingTopPx) + this.paddingBottomPx) + this.borderWidthPx * 2.0;
  };
  getContentX (elementX) {
    return ((elementX + this.marginLeftPx) + this.borderWidthPx) + this.paddingLeftPx;
  };
  getContentY (elementY) {
    return ((elementY + this.marginTopPx) + this.borderWidthPx) + this.paddingTopPx;
  };
  getHorizontalSpace () {
    return (((this.marginLeftPx + this.marginRightPx) + this.paddingLeftPx) + this.paddingRightPx) + this.borderWidthPx * 2.0;
  };
  getVerticalSpace () {
    return (((this.marginTopPx + this.marginBottomPx) + this.paddingTopPx) + this.paddingBottomPx) + this.borderWidthPx * 2.0;
  };
  getMarginHorizontal () {
    return this.marginLeftPx + this.marginRightPx;
  };
  getMarginVertical () {
    return this.marginTopPx + this.marginBottomPx;
  };
  getPaddingHorizontal () {
    return this.paddingLeftPx + this.paddingRightPx;
  };
  getPaddingVertical () {
    return this.paddingTopPx + this.paddingBottomPx;
  };
  toString () {
    return ((((((((((((((((("Box[margin:" + (this.marginTopPx.toString())) + "/") + (this.marginRightPx.toString())) + "/") + (this.marginBottomPx.toString())) + "/") + (this.marginLeftPx.toString())) + " padding:") + (this.paddingTopPx.toString())) + "/") + (this.paddingRightPx.toString())) + "/") + (this.paddingBottomPx.toString())) + "/") + (this.paddingLeftPx.toString())) + " border:") + (this.borderWidthPx.toString())) + "]";
  };
}
class EVGGradientStop  {
  constructor() {
    this.percentage = 0.0;
    this.color = new EVGColor();
  }
}
EVGGradientStop.create = function(pct, col) {
  const stop = new EVGGradientStop();
  stop.percentage = pct;
  stop.color = col;
  return stop;
};
class EVGGradient  {
  constructor() {
    this.isSet = false;
    this.isLinear = true;
    this.angle = 0.0;
    this.stops = [];
    let s = [];
    this.stops = s;
  }
  getStartColor () {
    if ( this.stops.length > 0 ) {
      const stop = this.stops[0];
      return stop.color;
    }
    return EVGColor.noColor();
  };
  getEndColor () {
    const __len = this.stops.length;
    if ( __len > 0 ) {
      const stop = this.stops[(__len - 1)];
      return stop.color;
    }
    return EVGColor.noColor();
  };
  getStopCount () {
    return this.stops.length;
  };
  getStop (index) {
    return this.stops[index];
  };
  addStop (percentage, color) {
    const stop = EVGGradientStop.create(percentage, color);
    this.stops.push(stop);
  };
  toCSSString () {
    if ( this.isSet == false ) {
      return "";
    }
    let result = "";
    if ( this.isLinear ) {
      result = ("linear-gradient(" + (this.angle.toString())) + "deg";
    } else {
      result = "radial-gradient(circle";
    }
    const numStops = this.stops.length;
    let i = 0;
    while (i < numStops) {
      const stop = this.stops[i];
      result = (result + ", ") + stop.color.toCSSString();
      i = i + 1;
    };
    result = result + ")";
    return result;
  };
}
EVGGradient.parse = function(gradStr) {
  const grad = new EVGGradient();
  const __len = gradStr.length;
  if ( __len == 0 ) {
    return grad;
  }
  const linearIdx = gradStr.indexOf("linear-gradient");
  const radialIdx = gradStr.indexOf("radial-gradient");
  if ( linearIdx >= 0 ) {
    grad.isLinear = true;
    grad.isSet = true;
    grad.angle = 180.0;
  }
  if ( radialIdx >= 0 ) {
    grad.isLinear = false;
    grad.isSet = true;
  }
  if ( grad.isSet == false ) {
    return grad;
  }
  let args = [];
  EVGGradient.splitArgs(gradStr, args);
  const n = args.length;
  if ( n == 0 ) {
    return grad;
  }
  let first = 0;
  const head = args[0].trim();
  if ( EVGGradient.colorOf(head).isSet ) {
  } else {
    first = 1;
    if ( grad.isLinear ) {
      grad.angle = EVGGradient.angleOf(head, grad.angle);
    }
  }
  let colors = [];
  let stopsAt = [];
  let i = first;
  while (i < n) {
    const arg = args[i].trim();
    const col = EVGGradient.colorOf(arg);
    if ( col.isSet ) {
      colors.push(col);
      stopsAt.push(EVGGradient.positionOf(arg));
    }
    i = i + 1;
  };
  const numColors = colors.length;
  if ( numColors > 0 ) {
    let colorIdx = 0;
    while (colorIdx < numColors) {
      let pct = stopsAt[colorIdx];
      if ( pct < 0.0 ) {
        pct = 0.0;
        if ( numColors > 1 ) {
          pct = colorIdx / (numColors - 1);
        }
      }
      const col_1 = colors[colorIdx];
      grad.addStop(pct, col_1);
      colorIdx = colorIdx + 1;
    };
  }
  return grad;
};
EVGGradient.splitArgs = function(src, out) {
  const __len = src.length;
  const open = src.indexOf("(");
  if ( open < 0 ) {
    return;
  }
  let depth = 0;
  let cur = "";
  let i = open;
  while (i < __len) {
    const c = src.charCodeAt(i );
    if ( c == 40 ) {
      depth = depth + 1;
      if ( depth > 1 ) {
        cur = cur + "(";
      }
    } else {
      if ( c == 41 ) {
        depth = depth - 1;
        if ( depth == 0 ) {
          if ( cur.trim().length > 0 ) {
            out.push(cur);
          }
          return;
        }
        cur = cur + ")";
      } else {
        if ( c == 44 && depth == 1 ) {
          if ( cur.trim().length > 0 ) {
            out.push(cur);
          }
          cur = "";
        } else {
          cur = cur + src.substring(i, i + 1 );
        }
      }
    }
    i = i + 1;
  };
  if ( cur.trim().length > 0 ) {
    out.push(cur);
  }
};
EVGGradient.colorOf = function(arg) {
  const text = arg.trim();
  const n = text.length;
  if ( n == 0 ) {
    return EVGColor.noColor();
  }
  const close = text.indexOf(")");
  if ( close >= 0 ) {
    return EVGColor.parse(text.substring(0, close + 1 ));
  }
  const sp = text.indexOf(" ");
  if ( sp > 0 ) {
    return EVGColor.parse(text.substring(0, sp ));
  }
  return EVGColor.parse(text);
};
EVGGradient.positionOf = function(arg) {
  const text = arg.trim();
  const pct = text.indexOf("%");
  if ( pct <= 0 ) {
    return 0.0 - 1.0;
  }
  let start = pct;
  while (start > 0) {
    const c = text.charCodeAt(start - 1 );
    const isNum = c >= 48 && c <= 57 || (c == 46 || c == 45);
    if ( isNum == false ) {
      break;
    }
    start = start - 1;
  };
  if ( start == pct ) {
    return 0.0 - 1.0;
  }
  const v = isNaN( parseFloat(text.substring(start, pct )) ) ? undefined : parseFloat(text.substring(start, pct ));
  if ( typeof(v) === "undefined" ) {
    return 0.0 - 1.0;
  }
  return v / 100.0;
};
EVGGradient.angleOf = function(spec, fallback) {
  const text = spec.trim();
  const deg = text.indexOf("deg");
  if ( deg > 0 ) {
    const v = isNaN( parseFloat(text.substring(0, deg ).trim()) ) ? undefined : parseFloat(text.substring(0, deg ).trim());
    if ( typeof(v) === "undefined" ) {
      return fallback;
    }
    return v;
  }
  if ( text.indexOf("to ") == 0 ) {
    const toTop = text.indexOf("top") > 0;
    const toBottom = text.indexOf("bottom") > 0;
    const toLeft = text.indexOf("left") > 0;
    const toRight = text.indexOf("right") > 0;
    if ( toTop && toRight ) {
      return 45.0;
    }
    if ( toBottom && toRight ) {
      return 135.0;
    }
    if ( toBottom && toLeft ) {
      return 225.0;
    }
    if ( toTop && toLeft ) {
      return 315.0;
    }
    if ( toTop ) {
      return 0.0;
    }
    if ( toRight ) {
      return 90.0;
    }
    if ( toBottom ) {
      return 180.0;
    }
    if ( toLeft ) {
      return 270.0;
    }
  }
  return fallback;
};
class PathCommand  {
  constructor() {
    this.type = "";
    this.x = 0.0;
    this.y = 0.0;
    this.x1 = 0.0;
    this.y1 = 0.0;
    this.x2 = 0.0;
    this.y2 = 0.0;
    this.rx = 0.0;     /* note: unused */
    this.ry = 0.0;     /* note: unused */
    this.rotation = 0.0;     /* note: unused */
    this.largeArc = false;     /* note: unused */
    this.sweep = false;     /* note: unused */
  }
}
class PathRing  {
  constructor() {
    this.pts = [];
    this.closed = false;
    let p = [];
    this.pts = p;
  }
  pointCount () {
    return ((this.pts.length / 2) | 0);
  };
}
class PathBounds  {
  constructor() {
    this.minX = 0.0;
    this.minY = 0.0;
    this.maxX = 0.0;
    this.maxY = 0.0;
    this.width = 0.0;
    this.height = 0.0;
  }
}
class SVGPathParser  {
  constructor() {
    this.pathData = "";
    this.i = 0;
    this.__len = 0;
    this.currentX = 0.0;
    this.currentY = 0.0;
    this.startX = 0.0;
    this.startY = 0.0;
    this.commands = [];
    this.bounds = undefined;
    this.lastCtrlX = 0.0;
    this.lastCtrlY = 0.0;
    this.lastCtrlKind = "";
    this.errors = [];
    this.truncated = false;
    this.numFail = false;
    this.plain = false;
    let emptyCommands = [];
    this.commands = emptyCommands;
    let emptyErrors = [];
    this.errors = emptyErrors;
    this.bounds = new PathBounds();
  }
  getErrors () {
    return this.errors;
  };
  hasErrors () {
    return this.errors.length > 0;
  };
  errorSummary () {
    const n = this.errors.length;
    if ( n == 0 ) {
      return "";
    }
    let out = this.errors[0];
    let k = 1;
    while (k < n) {
      out = (out + "; ") + this.errors[k];
      k = k + 1;
    };
    return out;
  };
  addError (msg) {
    this.errors.push((msg + " at offset ") + (this.i.toString()));
  };
  parse (data) {
    this.pathData = data;
    this.i = 0;
    this.__len = data.length;
    this.currentX = 0.0;
    this.currentY = 0.0;
    this.startX = 0.0;
    this.startY = 0.0;
    let emptyCommands = [];
    this.commands = emptyCommands;
    let emptyErrors = [];
    this.errors = emptyErrors;
    this.truncated = false;
    this.lastCtrlKind = "";
    let pending = 0;
    while (this.i < this.__len) {
      this.skipWhitespace();
      if ( this.i >= this.__len ) {
        break;
      }
      const ch = this.pathData.charCodeAt(this.i );
      const chInt = ch;
      let isLetter = false;
      if ( chInt >= 65 && chInt <= 90 ) {
        isLetter = true;
      }
      if ( chInt >= 97 && chInt <= 122 ) {
        isLetter = true;
      }
      if ( isLetter ) {
        pending = chInt;
        this.i = this.i + 1;
      } else {
        if ( pending == 0 ) {
          this.addError("path data must begin with a command letter");
          this.truncated = true;
          break;
        }
        if ( pending == 77 ) {
          pending = 76;
        }
        if ( pending == 109 ) {
          pending = 108;
        }
        if ( pending == 90 ) {
          this.addError("unexpected number after closepath");
          this.truncated = true;
          break;
        }
        if ( pending == 122 ) {
          this.addError("unexpected number after closepath");
          this.truncated = true;
          break;
        }
      }
      const ok = this.parseCommand(pending);
      if ( ok == false ) {
        this.truncated = true;
        break;
      }
    };
    this.calculateBounds();
  };
  hasNumberAhead () {
    this.skipWhitespace();
    if ( this.i >= this.__len ) {
      return false;
    }
    const ch = this.pathData.charCodeAt(this.i );
    const chInt = ch;
    if ( chInt >= 48 && chInt <= 57 ) {
      return true;
    }
    if ( chInt == 46 ) {
      return true;
    }
    if ( chInt == 45 ) {
      return true;
    }
    if ( chInt == 43 ) {
      return true;
    }
    return false;
  };
  parseFlag () {
    this.skipWhitespace();
    if ( this.i >= this.__len ) {
      this.numFail = true;
      this.addError("arc flag expected");
      return false;
    }
    const ch = this.pathData.charCodeAt(this.i );
    const chInt = ch;
    if ( chInt == 48 ) {
      this.i = this.i + 1;
      return false;
    }
    if ( chInt == 49 ) {
      this.i = this.i + 1;
      return true;
    }
    this.numFail = true;
    this.addError("arc flag must be 0 or 1");
    return false;
  };
  skipWhitespace () {
    while (this.i < this.__len) {
      const ch = this.pathData.charCodeAt(this.i );
      const chInt = ch;
      if ( (((chInt == 32 || chInt == 9) || chInt == 10) || chInt == 13) || chInt == 44 ) {
        this.i = this.i + 1;
      } else {
        break;
      }
    };
  };
  parseNumber () {
    this.skipWhitespace();
    const start = this.i;
    const ch = this.pathData.charCodeAt(this.i );
    const chInt = ch;
    if ( chInt == 45 || chInt == 43 ) {
      this.i = this.i + 1;
    }
    while (this.i < this.__len) {
      const ch2 = this.pathData.charCodeAt(this.i );
      const chInt2 = ch2;
      if ( chInt2 >= 48 && chInt2 <= 57 ) {
        this.i = this.i + 1;
      } else {
        break;
      }
    };
    if ( this.i < this.__len ) {
      const ch3 = this.pathData.charCodeAt(this.i );
      const chInt3 = ch3;
      if ( chInt3 == 46 ) {
        this.i = this.i + 1;
        while (this.i < this.__len) {
          const ch4 = this.pathData.charCodeAt(this.i );
          const chInt4 = ch4;
          if ( chInt4 >= 48 && chInt4 <= 57 ) {
            this.i = this.i + 1;
          } else {
            break;
          }
        };
      }
    }
    if ( this.i < this.__len ) {
      const ch5 = this.pathData.charCodeAt(this.i );
      const chInt5 = ch5;
      if ( chInt5 == 101 || chInt5 == 69 ) {
        this.i = this.i + 1;
        if ( this.i < this.__len ) {
          const ch6 = this.pathData.charCodeAt(this.i );
          const chInt6 = ch6;
          if ( chInt6 == 45 || chInt6 == 43 ) {
            this.i = this.i + 1;
          }
        }
        while (this.i < this.__len) {
          const ch7 = this.pathData.charCodeAt(this.i );
          const chInt7 = ch7;
          if ( chInt7 >= 48 && chInt7 <= 57 ) {
            this.i = this.i + 1;
          } else {
            break;
          }
        };
      }
    }
    const numStr = this.pathData.substring(start, this.i );
    const parsed = isNaN( parseFloat(numStr) ) ? undefined : parseFloat(numStr);
    if ( typeof(parsed) != "undefined" ) {
      return parsed;
    }
    this.numFail = true;
    this.addError("expected a number");
    return 0.0;
  };
  parseCommand (cmdInt) {
    this.numFail = false;
    if ( cmdInt == 77 || cmdInt == 109 ) {
      let x = this.parseNumber();
      let y = this.parseNumber();
      if ( this.numFail ) {
        return false;
      }
      if ( cmdInt == 109 ) {
        x = this.currentX + x;
        y = this.currentY + y;
      }
      const pathCmd = new PathCommand();
      pathCmd.type = "M";
      pathCmd.x = x;
      pathCmd.y = y;
      this.commands.push(pathCmd);
      this.currentX = x;
      this.currentY = y;
      this.startX = x;
      this.startY = y;
      this.lastCtrlKind = "";
      return true;
    }
    if ( cmdInt == 76 || cmdInt == 108 ) {
      let x_1 = this.parseNumber();
      let y_1 = this.parseNumber();
      if ( this.numFail ) {
        return false;
      }
      if ( cmdInt == 108 ) {
        x_1 = this.currentX + x_1;
        y_1 = this.currentY + y_1;
      }
      this.emitLine(x_1, y_1);
      return true;
    }
    if ( cmdInt == 72 || cmdInt == 104 ) {
      let x_2 = this.parseNumber();
      if ( this.numFail ) {
        return false;
      }
      if ( cmdInt == 104 ) {
        x_2 = this.currentX + x_2;
      }
      this.emitLine(x_2, this.currentY);
      return true;
    }
    if ( cmdInt == 86 || cmdInt == 118 ) {
      let y_2 = this.parseNumber();
      if ( this.numFail ) {
        return false;
      }
      if ( cmdInt == 118 ) {
        y_2 = this.currentY + y_2;
      }
      this.emitLine(this.currentX, y_2);
      return true;
    }
    if ( cmdInt == 67 || cmdInt == 99 ) {
      let x1 = this.parseNumber();
      let y1 = this.parseNumber();
      let x2 = this.parseNumber();
      let y2 = this.parseNumber();
      let x_3 = this.parseNumber();
      let y_3 = this.parseNumber();
      if ( this.numFail ) {
        return false;
      }
      if ( cmdInt == 99 ) {
        x1 = this.currentX + x1;
        y1 = this.currentY + y1;
        x2 = this.currentX + x2;
        y2 = this.currentY + y2;
        x_3 = this.currentX + x_3;
        y_3 = this.currentY + y_3;
      }
      this.emitCubic(x1, y1, x2, y2, x_3, y_3);
      return true;
    }
    if ( cmdInt == 83 || cmdInt == 115 ) {
      let x2_1 = this.parseNumber();
      let y2_1 = this.parseNumber();
      let x_4 = this.parseNumber();
      let y_4 = this.parseNumber();
      if ( this.numFail ) {
        return false;
      }
      if ( cmdInt == 115 ) {
        x2_1 = this.currentX + x2_1;
        y2_1 = this.currentY + y2_1;
        x_4 = this.currentX + x_4;
        y_4 = this.currentY + y_4;
      }
      let x1_1 = this.currentX;
      let y1_1 = this.currentY;
      if ( this.lastCtrlKind == "C" ) {
        x1_1 = 2.0 * this.currentX - this.lastCtrlX;
        y1_1 = 2.0 * this.currentY - this.lastCtrlY;
      }
      this.emitCubic(x1_1, y1_1, x2_1, y2_1, x_4, y_4);
      return true;
    }
    if ( cmdInt == 81 || cmdInt == 113 ) {
      let x1_2 = this.parseNumber();
      let y1_2 = this.parseNumber();
      let x_5 = this.parseNumber();
      let y_5 = this.parseNumber();
      if ( this.numFail ) {
        return false;
      }
      if ( cmdInt == 113 ) {
        x1_2 = this.currentX + x1_2;
        y1_2 = this.currentY + y1_2;
        x_5 = this.currentX + x_5;
        y_5 = this.currentY + y_5;
      }
      this.emitQuad(x1_2, y1_2, x_5, y_5);
      return true;
    }
    if ( cmdInt == 84 || cmdInt == 116 ) {
      let x_6 = this.parseNumber();
      let y_6 = this.parseNumber();
      if ( this.numFail ) {
        return false;
      }
      if ( cmdInt == 116 ) {
        x_6 = this.currentX + x_6;
        y_6 = this.currentY + y_6;
      }
      let x1_3 = this.currentX;
      let y1_3 = this.currentY;
      if ( this.lastCtrlKind == "Q" ) {
        x1_3 = 2.0 * this.currentX - this.lastCtrlX;
        y1_3 = 2.0 * this.currentY - this.lastCtrlY;
      }
      this.emitQuad(x1_3, y1_3, x_6, y_6);
      return true;
    }
    if ( cmdInt == 65 || cmdInt == 97 ) {
      const rx = this.parseNumber();
      const ry = this.parseNumber();
      const rot = this.parseNumber();
      const largeArc = this.parseFlag();
      const sweep = this.parseFlag();
      let x_7 = this.parseNumber();
      let y_7 = this.parseNumber();
      if ( this.numFail ) {
        return false;
      }
      if ( cmdInt == 97 ) {
        x_7 = this.currentX + x_7;
        y_7 = this.currentY + y_7;
      }
      this.emitArc(rx, ry, rot, largeArc, sweep, x_7, y_7);
      return true;
    }
    if ( cmdInt == 90 || cmdInt == 122 ) {
      const pathCmd_1 = new PathCommand();
      pathCmd_1.type = "Z";
      this.commands.push(pathCmd_1);
      this.currentX = this.startX;
      this.currentY = this.startY;
      this.lastCtrlKind = "";
      return true;
    }
    this.addError(("unsupported path command '" + String.fromCharCode(cmdInt)) + "'");
    return false;
  };
  emitLine (x, y) {
    const pathCmd = new PathCommand();
    pathCmd.type = "L";
    pathCmd.x = x;
    pathCmd.y = y;
    this.commands.push(pathCmd);
    this.currentX = x;
    this.currentY = y;
    this.lastCtrlKind = "";
  };
  emitCubic (x1, y1, x2, y2, x, y) {
    const pathCmd = new PathCommand();
    pathCmd.type = "C";
    pathCmd.x1 = x1;
    pathCmd.y1 = y1;
    pathCmd.x2 = x2;
    pathCmd.y2 = y2;
    pathCmd.x = x;
    pathCmd.y = y;
    this.commands.push(pathCmd);
    this.currentX = x;
    this.currentY = y;
    this.lastCtrlX = x2;
    this.lastCtrlY = y2;
    this.lastCtrlKind = "C";
  };
  emitQuad (x1, y1, x, y) {
    const pathCmd = new PathCommand();
    pathCmd.type = "Q";
    pathCmd.x1 = x1;
    pathCmd.y1 = y1;
    pathCmd.x = x;
    pathCmd.y = y;
    this.commands.push(pathCmd);
    this.currentX = x;
    this.currentY = y;
    this.lastCtrlX = x1;
    this.lastCtrlY = y1;
    this.lastCtrlKind = "Q";
  };
  emitArc (rxIn, ryIn, rotDeg, largeArc, sweep, x, y) {
    const x1 = this.currentX;
    const y1 = this.currentY;
    const x2 = x;
    const y2 = y;
    let rx = Math.abs(rxIn);
    let ry = Math.abs(ryIn);
    const dx = x1 - x2;
    const dy = y1 - y2;
    const d = Math.sqrt(dx * dx + dy * dy);
    if ( d < 0.00001 ) {
      this.emitLine(x2, y2);
      return;
    }
    if ( rx < 0.00001 ) {
      this.emitLine(x2, y2);
      return;
    }
    if ( ry < 0.00001 ) {
      this.emitLine(x2, y2);
      return;
    }
    const PI = Math.PI;
    const rot = (rotDeg / 180.0) * PI;
    const sinrot = Math.sin(rot);
    const cosrot = Math.cos(rot);
    const x1p = (cosrot * dx) / 2.0 + (sinrot * dy) / 2.0;
    const y1p = ((0.0 - sinrot) * dx) / 2.0 + (cosrot * dy) / 2.0;
    const lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
    if ( lambda > 1.0 ) {
      const k = Math.sqrt(lambda);
      rx = rx * k;
      ry = ry * k;
    }
    let sa = ((rx * rx) * (ry * ry) - (rx * rx) * (y1p * y1p)) - (ry * ry) * (x1p * x1p);
    const sb = (rx * rx) * (y1p * y1p) + (ry * ry) * (x1p * x1p);
    if ( sa < 0.0 ) {
      sa = 0.0;
    }
    let s = 0.0;
    if ( sb > 0.0 ) {
      s = Math.sqrt(sa / sb);
    }
    if ( largeArc == sweep ) {
      s = 0.0 - s;
    }
    const cxp = ((s * rx) * y1p) / ry;
    const cyp = (((0.0 - s) * ry) * x1p) / rx;
    const cx = (x1 + x2) / 2.0 + (cosrot * cxp - sinrot * cyp);
    const cy = (y1 + y2) / 2.0 + (sinrot * cxp + cosrot * cyp);
    const ux = (x1p - cxp) / rx;
    const uy = (y1p - cyp) / ry;
    const vx = ((0.0 - x1p) - cxp) / rx;
    const vy = ((0.0 - y1p) - cyp) / ry;
    const a1 = this.vecAngle(1.0, 0.0, ux, uy);
    let da = this.vecAngle(ux, uy, vx, vy);
    if ( sweep == false ) {
      if ( da > 0.0 ) {
        da = da - 2.0 * PI;
      }
    } else {
      if ( da < 0.0 ) {
        da = 2.0 * PI + da;
      }
    }
    const ndivs = Math.floor( Math.abs(da) / (PI * 0.5) + 1.0);
    const hda = (da / ndivs) / 2.0;
    let kappa = Math.abs(((4.0 / 3.0) * (1.0 - Math.cos(hda))) / Math.sin(hda));
    if ( da < 0.0 ) {
      kappa = 0.0 - kappa;
    }
    let px = 0.0;
    let py = 0.0;
    let ptanx = 0.0;
    let ptany = 0.0;
    let k_1 = 0;
    while (k_1 <= ndivs) {
      const a = a1 + (da * k_1) / ndivs;
      const cosa = Math.cos(a);
      const sina = Math.sin(a);
      const ex = (cosrot * (cosa * rx) - sinrot * (sina * ry)) + cx;
      const ey = (sinrot * (cosa * rx) + cosrot * (sina * ry)) + cy;
      const tvx = (0.0 - sina) * (rx * kappa);
      const tvy = cosa * (ry * kappa);
      const tanx = cosrot * tvx - sinrot * tvy;
      const tany = sinrot * tvx + cosrot * tvy;
      if ( k_1 > 0 ) {
        this.emitCubic(px + ptanx, py + ptany, ex - tanx, ey - tany, ex, ey);
      }
      px = ex;
      py = ey;
      ptanx = tanx;
      ptany = tany;
      k_1 = k_1 + 1;
    };
    this.currentX = x2;
    this.currentY = y2;
    this.lastCtrlKind = "";
  };
  vecAngle (ux, uy, vx, vy) {
    const magU = Math.sqrt(ux * ux + uy * uy);
    const magV = Math.sqrt(vx * vx + vy * vy);
    const denom = magU * magV;
    if ( denom < 1e-10 ) {
      return 0.0;
    }
    let r = (ux * vx + uy * vy) / denom;
    if ( r < 0.0 - 1.0 ) {
      r = 0.0 - 1.0;
    }
    if ( r > 1.0 ) {
      r = 1.0;
    }
    let sign = 1.0;
    if ( ux * vy < uy * vx ) {
      sign = 0.0 - 1.0;
    }
    return sign * Math.acos(r);
  };
  calculateBounds () {
    if ( this.commands.length == 0 ) {
      return;
    }
    let minX = 999999.0;
    let minY = 999999.0;
    let maxX = -999999.0;
    let maxY = -999999.0;
    let i_1 = 0;
    while (i_1 < this.commands.length) {
      const cmd = this.commands[i_1];
      if ( cmd.type == "M" || cmd.type == "L" ) {
        if ( cmd.x < minX ) {
          minX = cmd.x;
        }
        if ( cmd.x > maxX ) {
          maxX = cmd.x;
        }
        if ( cmd.y < minY ) {
          minY = cmd.y;
        }
        if ( cmd.y > maxY ) {
          maxY = cmd.y;
        }
      }
      if ( cmd.type == "C" ) {
        if ( cmd.x1 < minX ) {
          minX = cmd.x1;
        }
        if ( cmd.x1 > maxX ) {
          maxX = cmd.x1;
        }
        if ( cmd.y1 < minY ) {
          minY = cmd.y1;
        }
        if ( cmd.y1 > maxY ) {
          maxY = cmd.y1;
        }
        if ( cmd.x2 < minX ) {
          minX = cmd.x2;
        }
        if ( cmd.x2 > maxX ) {
          maxX = cmd.x2;
        }
        if ( cmd.y2 < minY ) {
          minY = cmd.y2;
        }
        if ( cmd.y2 > maxY ) {
          maxY = cmd.y2;
        }
        if ( cmd.x < minX ) {
          minX = cmd.x;
        }
        if ( cmd.x > maxX ) {
          maxX = cmd.x;
        }
        if ( cmd.y < minY ) {
          minY = cmd.y;
        }
        if ( cmd.y > maxY ) {
          maxY = cmd.y;
        }
      }
      if ( cmd.type == "Q" ) {
        if ( cmd.x1 < minX ) {
          minX = cmd.x1;
        }
        if ( cmd.x1 > maxX ) {
          maxX = cmd.x1;
        }
        if ( cmd.y1 < minY ) {
          minY = cmd.y1;
        }
        if ( cmd.y1 > maxY ) {
          maxY = cmd.y1;
        }
        if ( cmd.x < minX ) {
          minX = cmd.x;
        }
        if ( cmd.x > maxX ) {
          maxX = cmd.x;
        }
        if ( cmd.y < minY ) {
          minY = cmd.y;
        }
        if ( cmd.y > maxY ) {
          maxY = cmd.y;
        }
      }
      i_1 = i_1 + 1;
    };
    this.bounds.minX = minX;
    this.bounds.minY = minY;
    this.bounds.maxX = maxX;
    this.bounds.maxY = maxY;
    this.bounds.width = maxX - minX;
    this.bounds.height = maxY - minY;
  };
  getBounds () {
    const result = this.bounds;
    return result;
  };
  getCommands () {
    return this.commands;
  };
  getScaledCommands (targetWidth, targetHeight) {
    let scaleX = 1.0;
    let scaleY = 1.0;
    if ( this.bounds.width > 0.0 ) {
      scaleX = targetWidth / this.bounds.width;
    }
    if ( this.bounds.height > 0.0 ) {
      scaleY = targetHeight / this.bounds.height;
    }
    let scaled = [];
    let i_1 = 0;
    while (i_1 < this.commands.length) {
      const cmd = this.commands[i_1];
      const newCmd = new PathCommand();
      newCmd.type = cmd.type;
      if ( cmd.type == "M" || cmd.type == "L" ) {
        newCmd.x = (cmd.x - this.bounds.minX) * scaleX;
        newCmd.y = (cmd.y - this.bounds.minY) * scaleY;
      }
      if ( cmd.type == "C" ) {
        newCmd.x1 = (cmd.x1 - this.bounds.minX) * scaleX;
        newCmd.y1 = (cmd.y1 - this.bounds.minY) * scaleY;
        newCmd.x2 = (cmd.x2 - this.bounds.minX) * scaleX;
        newCmd.y2 = (cmd.y2 - this.bounds.minY) * scaleY;
        newCmd.x = (cmd.x - this.bounds.minX) * scaleX;
        newCmd.y = (cmd.y - this.bounds.minY) * scaleY;
      }
      if ( cmd.type == "Q" ) {
        newCmd.x1 = (cmd.x1 - this.bounds.minX) * scaleX;
        newCmd.y1 = (cmd.y1 - this.bounds.minY) * scaleY;
        newCmd.x = (cmd.x - this.bounds.minX) * scaleX;
        newCmd.y = (cmd.y - this.bounds.minY) * scaleY;
      }
      scaled.push(newCmd);
      i_1 = i_1 + 1;
    };
    return scaled;
  };
  stepsFor (cap, __len) {
    if ( this.plain ) {
      return cap;
    }
    return SVGPathParser.curveSteps(cap, __len);
  };
  flattenRings (steps, ma, mb, mc, md, me, mf) {
    let rings = [];
    let current = new PathRing();
    let started = false;
    let cx = 0.0;
    let cy = 0.0;
    let sx = 0.0;
    let sy = 0.0;
    const n = this.commands.length;
    let k = 0;
    while (k < n) {
      const cmd = this.commands[k];
      if ( cmd.type == "M" ) {
        if ( started ) {
          if ( current.pointCount() >= 2 ) {
            rings.push(current);
          }
        }
        current = new PathRing();
        started = true;
        cx = cmd.x;
        cy = cmd.y;
        sx = cmd.x;
        sy = cmd.y;
        current.pts.push(ma * cx + (mc * cy + me));
        current.pts.push(mb * cx + (md * cy + mf));
      }
      if ( cmd.type == "L" ) {
        cx = cmd.x;
        cy = cmd.y;
        current.pts.push(ma * cx + (mc * cy + me));
        current.pts.push(mb * cx + (md * cy + mf));
      }
      if ( cmd.type == "C" ) {
        const d1 = SVGPathParser.devLen(cx, cy, cmd.x1, cmd.y1, ma, mb, mc, md);
        const d2 = SVGPathParser.devLen(
          cmd.x1,
          cmd.y1,
          cmd.x2,
          cmd.y2,
          ma,
          mb,
          mc,
          md
        );
        const d3 = SVGPathParser.devLen(
          cmd.x2,
          cmd.y2,
          cmd.x,
          cmd.y,
          ma,
          mb,
          mc,
          md
        );
        const cs = this.stepsFor(steps, ((d1 + d2) + d3));
        let s = 1;
        while (s <= cs) {
          const tt = s / cs;
          const u = 1.0 - tt;
          const b0 = (u * u) * u;
          const b1 = ((3.0 * u) * u) * tt;
          const b2 = ((3.0 * u) * tt) * tt;
          const b3 = (tt * tt) * tt;
          const px = ((b0 * cx + b1 * cmd.x1) + b2 * cmd.x2) + b3 * cmd.x;
          const py = ((b0 * cy + b1 * cmd.y1) + b2 * cmd.y2) + b3 * cmd.y;
          current.pts.push(ma * px + (mc * py + me));
          current.pts.push(mb * px + (md * py + mf));
          s = s + 1;
        };
        cx = cmd.x;
        cy = cmd.y;
      }
      if ( cmd.type == "Q" ) {
        const q1 = SVGPathParser.devLen(cx, cy, cmd.x1, cmd.y1, ma, mb, mc, md);
        const q2 = SVGPathParser.devLen(
          cmd.x1,
          cmd.y1,
          cmd.x,
          cmd.y,
          ma,
          mb,
          mc,
          md
        );
        const qs = this.stepsFor(steps, (q1 + q2));
        let s_1 = 1;
        while (s_1 <= qs) {
          const tt_1 = s_1 / qs;
          const u_1 = 1.0 - tt_1;
          const b0_1 = u_1 * u_1;
          const b1_1 = (2.0 * u_1) * tt_1;
          const b2_1 = tt_1 * tt_1;
          const px_1 = (b0_1 * cx + b1_1 * cmd.x1) + b2_1 * cmd.x;
          const py_1 = (b0_1 * cy + b1_1 * cmd.y1) + b2_1 * cmd.y;
          current.pts.push(ma * px_1 + (mc * py_1 + me));
          current.pts.push(mb * px_1 + (md * py_1 + mf));
          s_1 = s_1 + 1;
        };
        cx = cmd.x;
        cy = cmd.y;
      }
      if ( cmd.type == "Z" ) {
        if ( started ) {
          current.closed = true;
          if ( current.pointCount() >= 2 ) {
            rings.push(current);
          }
        }
        current = new PathRing();
        started = false;
        cx = sx;
        cy = sy;
      }
      k = k + 1;
    };
    if ( started ) {
      if ( current.pointCount() >= 2 ) {
        rings.push(current);
      }
    }
    return rings;
  };
  flattenRingsPlain (steps) {
    this.plain = true;
    const rings = this.flattenRings(steps, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
    this.plain = false;
    return rings;
  };
  flatten (steps) {
    let pts = [];
    let cx = 0.0;
    let cy = 0.0;
    const n = this.commands.length;
    let i_1 = 0;
    while (i_1 < n) {
      const cmd = this.commands[i_1];
      if ( cmd.type == "M" ) {
        cx = cmd.x;
        cy = cmd.y;
        pts.push(cx);
        pts.push(cy);
      }
      if ( cmd.type == "L" ) {
        cx = cmd.x;
        cy = cmd.y;
        pts.push(cx);
        pts.push(cy);
      }
      if ( cmd.type == "C" ) {
        let s = 1;
        while (s <= steps) {
          const tt = s / steps;
          const u = 1.0 - tt;
          const b0 = (u * u) * u;
          const b1 = ((3.0 * u) * u) * tt;
          const b2 = ((3.0 * u) * tt) * tt;
          const b3 = (tt * tt) * tt;
          const px = ((b0 * cx + b1 * cmd.x1) + b2 * cmd.x2) + b3 * cmd.x;
          const py = ((b0 * cy + b1 * cmd.y1) + b2 * cmd.y2) + b3 * cmd.y;
          pts.push(px);
          pts.push(py);
          s = s + 1;
        };
        cx = cmd.x;
        cy = cmd.y;
      }
      if ( cmd.type == "Q" ) {
        let s_1 = 1;
        while (s_1 <= steps) {
          const tt_1 = s_1 / steps;
          const u_1 = 1.0 - tt_1;
          const b0_1 = u_1 * u_1;
          const b1_1 = (2.0 * u_1) * tt_1;
          const b2_1 = tt_1 * tt_1;
          const px_1 = (b0_1 * cx + b1_1 * cmd.x1) + b2_1 * cmd.x;
          const py_1 = (b0_1 * cy + b1_1 * cmd.y1) + b2_1 * cmd.y;
          pts.push(px_1);
          pts.push(py_1);
          s_1 = s_1 + 1;
        };
        cx = cmd.x;
        cy = cmd.y;
      }
      if ( cmd.type == "A" ) {
        cx = cmd.x;
        cy = cmd.y;
        pts.push(cx);
        pts.push(cy);
      }
      i_1 = i_1 + 1;
    };
    return pts;
  };
}
SVGPathParser.fromCommands = function(cmds) {
  const p = new SVGPathParser();
  p.commands = cmds;
  p.calculateBounds();
  return p;
};
SVGPathParser.curveSteps = function(cap, __len) {
  let want = Math.floor( __len / 2.0 + 0.999);
  if ( want < 2 ) {
    want = 2;
  }
  if ( want > cap ) {
    want = cap;
  }
  return want;
};
SVGPathParser.devLen = function(x0, y0, x1, y1, ma, mb, mc, md) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const ax = ma * dx + mc * dy;
  const ay = mb * dx + md * dy;
  return Math.sqrt(ax * ax + ay * ay);
};
class VectorShapes  {
  constructor() {
  }
}
VectorShapes.kappa = function() {
  return 0.5522847498307936;
};
VectorShapes.moveTo = function(x, y) {
  const c = new PathCommand();
  c.type = "M";
  c.x = x;
  c.y = y;
  return c;
};
VectorShapes.lineTo = function(x, y) {
  const c = new PathCommand();
  c.type = "L";
  c.x = x;
  c.y = y;
  return c;
};
VectorShapes.cubicTo = function(x1, y1, x2, y2, x, y) {
  const c = new PathCommand();
  c.type = "C";
  c.x1 = x1;
  c.y1 = y1;
  c.x2 = x2;
  c.y2 = y2;
  c.x = x;
  c.y = y;
  return c;
};
VectorShapes.closePath = function() {
  const c = new PathCommand();
  c.type = "Z";
  return c;
};
VectorShapes.line = function(x1, y1, x2, y2) {
  let out = [];
  out.push(VectorShapes.moveTo(x1, y1));
  out.push(VectorShapes.lineTo(x2, y2));
  return out;
};
VectorShapes.polyline = function(pts) {
  return VectorShapes.pointsToPath(pts, false);
};
VectorShapes.polygon = function(pts) {
  return VectorShapes.pointsToPath(pts, true);
};
VectorShapes.pointsToPath = function(pts, closed) {
  let out = [];
  const n = ((pts.length / 2) | 0);
  if ( n < 2 ) {
    return out;
  }
  out.push(VectorShapes.moveTo(pts[0], pts[1]));
  let k = 1;
  while (k < n) {
    out.push(VectorShapes.lineTo(pts[(k * 2)], pts[(k * 2 + 1)]));
    k = k + 1;
  };
  if ( closed ) {
    out.push(VectorShapes.closePath());
  }
  return out;
};
VectorShapes.ellipse = function(cx, cy, rx, ry) {
  let out = [];
  if ( rx <= 0.0 ) {
    return out;
  }
  if ( ry <= 0.0 ) {
    return out;
  }
  const k = VectorShapes.kappa();
  const ox = rx * k;
  const oy = ry * k;
  out.push(VectorShapes.moveTo(cx + rx, cy));
  out.push(VectorShapes.cubicTo(
    cx + rx,
    (cy + oy),
    (cx + ox),
    (cy + ry),
    cx,
    (cy + ry)
  ));
  out.push(VectorShapes.cubicTo(
    cx - ox,
    (cy + ry),
    (cx - rx),
    (cy + oy),
    (cx - rx),
    cy
  ));
  out.push(VectorShapes.cubicTo(
    cx - rx,
    (cy - oy),
    (cx - ox),
    (cy - ry),
    cx,
    (cy - ry)
  ));
  out.push(VectorShapes.cubicTo(
    cx + ox,
    (cy - ry),
    (cx + rx),
    (cy - oy),
    (cx + rx),
    cy
  ));
  out.push(VectorShapes.closePath());
  return out;
};
VectorShapes.circle = function(cx, cy, r) {
  return VectorShapes.ellipse(cx, cy, r, r);
};
VectorShapes.rect = function(x, y, w, h, rxIn, ryIn) {
  let out = [];
  if ( w <= 0.0 ) {
    return out;
  }
  if ( h <= 0.0 ) {
    return out;
  }
  let rx = rxIn;
  let ry = ryIn;
  if ( rx < 0.0 ) {
    rx = ry;
  }
  if ( ry < 0.0 ) {
    ry = rx;
  }
  if ( rx < 0.0 ) {
    rx = 0.0;
  }
  if ( ry < 0.0 ) {
    ry = 0.0;
  }
  if ( rx > w / 2.0 ) {
    rx = w / 2.0;
  }
  if ( ry > h / 2.0 ) {
    ry = h / 2.0;
  }
  let rounded = true;
  if ( rx <= 0.0 ) {
    rounded = false;
  }
  if ( ry <= 0.0 ) {
    rounded = false;
  }
  if ( rounded == false ) {
    out.push(VectorShapes.moveTo(x, y));
    out.push(VectorShapes.lineTo(x + w, y));
    out.push(VectorShapes.lineTo(x + w, (y + h)));
    out.push(VectorShapes.lineTo(x, y + h));
    out.push(VectorShapes.closePath());
    return out;
  }
  const k = VectorShapes.kappa();
  const ox = rx * k;
  const oy = ry * k;
  const x1 = x + w;
  const y1 = y + h;
  out.push(VectorShapes.moveTo(x + rx, y));
  out.push(VectorShapes.lineTo(x1 - rx, y));
  out.push(VectorShapes.cubicTo(
    (x1 - rx) + ox,
    y,
    x1,
    ((y + ry) - oy),
    x1,
    (y + ry)
  ));
  out.push(VectorShapes.lineTo(x1, y1 - ry));
  out.push(VectorShapes.cubicTo(
    x1,
    (y1 - ry) + oy,
    ((x1 - rx) + ox),
    y1,
    (x1 - rx),
    y1
  ));
  out.push(VectorShapes.lineTo(x + rx, y1));
  out.push(VectorShapes.cubicTo(
    (x + rx) - ox,
    y1,
    x,
    ((y1 - ry) + oy),
    x,
    (y1 - ry)
  ));
  out.push(VectorShapes.lineTo(x, y + ry));
  out.push(VectorShapes.cubicTo(
    x,
    (y + ry) - oy,
    ((x + rx) - ox),
    y,
    (x + rx),
    y
  ));
  out.push(VectorShapes.closePath());
  return out;
};
VectorShapes.asPathData = function(cmds) {
  let out = "";
  const n = cmds.length;
  let k = 0;
  while (k < n) {
    const c = cmds[k];
    if ( k > 0 ) {
      out = out + " ";
    }
    if ( c.type == "M" ) {
      out = (((out + "M") + VectorShapes.num(c.x)) + ",") + VectorShapes.num(c.y);
    }
    if ( c.type == "L" ) {
      out = (((out + "L") + VectorShapes.num(c.x)) + ",") + VectorShapes.num(c.y);
    }
    if ( c.type == "C" ) {
      out = (((out + "C") + VectorShapes.num(c.x1)) + ",") + VectorShapes.num(c.y1);
      out = (((out + " ") + VectorShapes.num(c.x2)) + ",") + VectorShapes.num(c.y2);
      out = (((out + " ") + VectorShapes.num(c.x)) + ",") + VectorShapes.num(c.y);
    }
    if ( c.type == "Q" ) {
      out = (((out + "Q") + VectorShapes.num(c.x1)) + ",") + VectorShapes.num(c.y1);
      out = (((out + " ") + VectorShapes.num(c.x)) + ",") + VectorShapes.num(c.y);
    }
    if ( c.type == "Z" ) {
      out = out + "Z";
    }
    k = k + 1;
  };
  return out;
};
VectorShapes.num = function(v) {
  let neg = false;
  let a = v;
  if ( a < 0.0 ) {
    neg = true;
    a = 0.0 - a;
  }
  const scaled = Math.floor( a * 10000.0 + 0.5);
  const whole = ((scaled / 10000) | 0);
  let fracPart = scaled - whole * 10000;
  let out = (whole.toString());
  if ( fracPart > 0 ) {
    let digits = 4;
    while (fracPart - ((fracPart / 10) | 0) * 10 == 0) {
      fracPart = ((fracPart / 10) | 0);
      digits = digits - 1;
    };
    let frac = (fracPart.toString());
    let pad = digits - frac.length;
    while (pad > 0) {
      frac = "0" + frac;
      pad = pad - 1;
    };
    out = (out + ".") + frac;
  }
  if ( neg ) {
    if ( scaled > 0 ) {
      out = "-" + out;
    }
  }
  return out;
};
class Matrix2D  {
  constructor() {
    this.a = 1.0;
    this.b = 0.0;
    this.c = 0.0;
    this.d = 1.0;
    this.e = 0.0;
    this.f = 0.0;
  }
  applyX (x, y) {
    const v = (this.a * x + this.c * y) + this.e;
    return v;
  };
  applyY (x, y) {
    const v = (this.b * x + this.d * y) + this.f;
    return v;
  };
  multiply (o) {
    const na = this.a * o.a + this.c * o.b;
    const nb = this.b * o.a + this.d * o.b;
    const nc = this.a * o.c + this.c * o.d;
    const nd = this.b * o.c + this.d * o.d;
    const ne = (this.a * o.e + this.c * o.f) + this.e;
    const nf = (this.b * o.e + this.d * o.f) + this.f;
    return Matrix2D.create(na, nb, nc, nd, ne, nf);
  };
  isIdentity () {
    let flat = true;
    if ( (this.a == 1.0) == false ) {
      flat = false;
    }
    if ( (this.b == 0.0) == false ) {
      flat = false;
    }
    if ( (this.c == 0.0) == false ) {
      flat = false;
    }
    if ( (this.d == 1.0) == false ) {
      flat = false;
    }
    if ( (this.e == 0.0) == false ) {
      flat = false;
    }
    if ( (this.f == 0.0) == false ) {
      flat = false;
    }
    return flat;
  };
}
Matrix2D.identity = function() {
  const m = new Matrix2D();
  return m;
};
Matrix2D.create = function(ma, mb, mc, md, me, mf) {
  const m = new Matrix2D();
  m.a = ma;
  m.b = mb;
  m.c = mc;
  m.d = md;
  m.e = me;
  m.f = mf;
  return m;
};
Matrix2D.translate = function(tx, ty) {
  return Matrix2D.create(1.0, 0.0, 0.0, 1.0, tx, ty);
};
Matrix2D.scale = function(sx, sy) {
  return Matrix2D.create(sx, 0.0, 0.0, sy, 0.0, 0.0);
};
class ViewBoxRect  {
  constructor() {
    this.minX = 0.0;
    this.minY = 0.0;
    this.width = 0.0;
    this.height = 0.0;
    this.isSet = false;
  }
  asAttribute () {
    let s = ((this.minX.toString()) + " ") + (this.minY.toString());
    s = (((s + " ") + (this.width.toString())) + " ") + (this.height.toString());
    return s;
  };
}
ViewBoxRect.create = function(x, y, w, h) {
  const r = new ViewBoxRect();
  r.minX = x;
  r.minY = y;
  r.width = w;
  r.height = h;
  r.isSet = true;
  return r;
};
class VectorViewBox  {
  constructor() {
  }
}
VectorViewBox.splitTokens = function(s) {
  let parts = [];
  let current = "";
  let i = 0;
  const n = s.length;
  while (i < n) {
    const ch = s.charCodeAt(i );
    let isSep = false;
    if ( ch == 32 ) {
      isSep = true;
    }
    if ( ch == 9 ) {
      isSep = true;
    }
    if ( ch == 10 ) {
      isSep = true;
    }
    if ( ch == 13 ) {
      isSep = true;
    }
    if ( ch == 44 ) {
      isSep = true;
    }
    if ( isSep ) {
      if ( current.length > 0 ) {
        parts.push(current);
        current = "";
      }
    } else {
      current = current + String.fromCharCode(ch);
    }
    i = i + 1;
  };
  if ( current.length > 0 ) {
    parts.push(current);
  }
  return parts;
};
VectorViewBox.parseViewBox = function(s) {
  const out = new ViewBoxRect();
  const parts = VectorViewBox.splitTokens(s);
  if ( parts.length != 4 ) {
    return out;
  }
  let vals = [];
  let i = 0;
  while (i < 4) {
    const tok = parts[i];
    const num = isNaN( parseFloat(tok) ) ? undefined : parseFloat(tok);
    if ( typeof(num) != "undefined" ) {
      vals.push(num);
    } else {
      return out;
    }
    i = i + 1;
  };
  const w = vals[2];
  const h = vals[3];
  if ( w <= 0.0 ) {
    return out;
  }
  if ( h <= 0.0 ) {
    return out;
  }
  out.minX = vals[0];
  out.minY = vals[1];
  out.width = w;
  out.height = h;
  out.isSet = true;
  return out;
};
VectorViewBox.alignX = function(par) {
  const parts = VectorViewBox.splitTokens(par);
  let i = 0;
  while (i < parts.length) {
    const tok = parts[i];
    if ( tok.indexOf("xMin") == 0 ) {
      return 0;
    }
    if ( tok.indexOf("xMid") == 0 ) {
      return 1;
    }
    if ( tok.indexOf("xMax") == 0 ) {
      return 2;
    }
    i = i + 1;
  };
  return 1;
};
VectorViewBox.alignY = function(par) {
  const parts = VectorViewBox.splitTokens(par);
  let i = 0;
  while (i < parts.length) {
    const tok = parts[i];
    if ( tok.indexOf("YMin") > 0 ) {
      return 0;
    }
    if ( tok.indexOf("YMid") > 0 ) {
      return 1;
    }
    if ( tok.indexOf("YMax") > 0 ) {
      return 2;
    }
    i = i + 1;
  };
  return 1;
};
VectorViewBox.isNone = function(par) {
  const parts = VectorViewBox.splitTokens(par);
  let i = 0;
  while (i < parts.length) {
    const tok = parts[i];
    if ( tok == "none" ) {
      return true;
    }
    i = i + 1;
  };
  return false;
};
VectorViewBox.isSlice = function(par) {
  const parts = VectorViewBox.splitTokens(par);
  let i = 0;
  while (i < parts.length) {
    const tok = parts[i];
    if ( tok == "slice" ) {
      return true;
    }
    i = i + 1;
  };
  return false;
};
VectorViewBox.resolve = function(vb, viewW, viewH, par) {
  if ( vb.isSet == false ) {
    return Matrix2D.identity();
  }
  if ( viewW <= 0.0 ) {
    return Matrix2D.identity();
  }
  if ( viewH <= 0.0 ) {
    return Matrix2D.identity();
  }
  let scaleX = viewW / vb.width;
  let scaleY = viewH / vb.height;
  if ( VectorViewBox.isNone(par) == false ) {
    let uniform = scaleX;
    if ( VectorViewBox.isSlice(par) ) {
      if ( scaleY > uniform ) {
        uniform = scaleY;
      }
    } else {
      if ( scaleY < uniform ) {
        uniform = scaleY;
      }
    }
    scaleX = uniform;
    scaleY = uniform;
  }
  let tx = 0.0 - vb.minX * scaleX;
  let ty = 0.0 - vb.minY * scaleY;
  const slackX = viewW - vb.width * scaleX;
  const slackY = viewH - vb.height * scaleY;
  const ax = VectorViewBox.alignX(par);
  const ay = VectorViewBox.alignY(par);
  if ( ax == 1 ) {
    tx = tx + slackX / 2.0;
  }
  if ( ax == 2 ) {
    tx = tx + slackX;
  }
  if ( ay == 1 ) {
    ty = ty + slackY / 2.0;
  }
  if ( ay == 2 ) {
    ty = ty + slackY;
  }
  return Matrix2D.create(scaleX, 0.0, 0.0, scaleY, tx, ty);
};
VectorViewBox.effectiveViewBox = function(declared, boundsX, boundsY, boundsW, boundsH) {
  const explicit = VectorViewBox.parseViewBox(declared);
  if ( explicit.isSet ) {
    return explicit;
  }
  const synth = new ViewBoxRect();
  if ( boundsW <= 0.0 ) {
    return synth;
  }
  if ( boundsH <= 0.0 ) {
    return synth;
  }
  return ViewBoxRect.create(boundsX, boundsY, boundsW, boundsH);
};
VectorViewBox.resolveString = function(viewBox, viewW, viewH, par) {
  let effective = par;
  if ( effective.length == 0 ) {
    effective = "xMidYMid meet";
  }
  const vb = VectorViewBox.parseViewBox(viewBox);
  return VectorViewBox.resolve(vb, viewW, viewH, effective);
};
class SvgVectorItem  {
  constructor() {
    this.commands = [];
    this.fillColor = undefined;
    this.strokeColor = undefined;
    this.strokeWidth = 1.0;
    this.fillRule = "nonzero";
    this.dashArray = "";
    this.dashOffset = 0.0;
    let c = [];
    this.commands = c;
    this.fillColor = EVGColor.noColor();
    this.strokeColor = EVGColor.noColor();
    this.strokeWidth = 1.0;
    this.fillRule = "nonzero";
    this.dashArray = "";
    this.dashOffset = 0.0;
  }
  hasFill () {
    return this.fillColor.isSet;
  };
  hasStroke () {
    if ( this.strokeColor.isSet == false ) {
      return false;
    }
    return this.strokeWidth > 0.0;
  };
  pathData () {
    return VectorShapes.asPathData(this.commands);
  };
}
class SvgStyleState  {
  constructor() {
    this.ctm = undefined;
    this.fill = undefined;
    this.stroke = undefined;
    this.strokeWidth = 1.0;
    this.fillRule = "nonzero";
    this.dashArray = "";
    this.dashOffset = 0.0;
    this.fillOpacity = 1.0;
    this.strokeOpacity = 1.0;
    this.groupOpacity = 1.0;
    this.ctm = Matrix2D.identity();
    this.fill = EVGColor.black();
    this.stroke = EVGColor.noColor();
    this.strokeWidth = 1.0;
    this.fillRule = "nonzero";
    this.dashArray = "";
    this.dashOffset = 0.0;
    this.fillOpacity = 1.0;
    this.strokeOpacity = 1.0;
    this.groupOpacity = 1.0;
  }
  copy () {
    const s = new SvgStyleState();
    s.ctm = this.ctm;
    s.fill = this.fill;
    s.stroke = this.stroke;
    s.strokeWidth = this.strokeWidth;
    s.fillRule = this.fillRule;
    s.dashArray = this.dashArray;
    s.dashOffset = this.dashOffset;
    s.fillOpacity = this.fillOpacity;
    s.strokeOpacity = this.strokeOpacity;
    s.groupOpacity = this.groupOpacity;
    return s;
  };
}
class SvgDocument  {
  constructor() {
    this.items = [];
    this.viewBox = undefined;
    this.width = 0.0;
    this.height = 0.0;
    this.warnings = [];
    this.errors = [];
    this.truncated = false;
    let it = [];
    this.items = it;
    let w = [];
    this.warnings = w;
    let e = [];
    this.errors = e;
    this.viewBox = new ViewBoxRect();
    this.width = 0.0;
    this.height = 0.0;
    this.truncated = false;
  }
  itemCount () {
    return this.items.length;
  };
  hasErrors () {
    return this.errors.length > 0;
  };
  hasWarnings () {
    return this.warnings.length > 0;
  };
  commandCount () {
    let total = 0;
    let k = 0;
    while (k < this.items.length) {
      const it = this.items[k];
      total = total + it.commands.length;
      k = k + 1;
    };
    return total;
  };
  joinLines (lines) {
    const n = lines.length;
    if ( n == 0 ) {
      return "";
    }
    let out = lines[0];
    let k = 1;
    while (k < n) {
      out = (out + "; ") + lines[k];
      k = k + 1;
    };
    return out;
  };
  errorSummary () {
    return this.joinLines(this.errors);
  };
  warningSummary () {
    return this.joinLines(this.warnings);
  };
  bounds () {
    const b = new PathBounds();
    let minX = 999999.0;
    let minY = 999999.0;
    let maxX = -999999.0;
    let maxY = -999999.0;
    let any = false;
    let k = 0;
    while (k < this.items.length) {
      const it = this.items[k];
      let j = 0;
      while (j < it.commands.length) {
        const c = it.commands[j];
        if ( (c.type == "Z") == false ) {
          any = true;
          if ( c.x < minX ) {
            minX = c.x;
          }
          if ( c.x > maxX ) {
            maxX = c.x;
          }
          if ( c.y < minY ) {
            minY = c.y;
          }
          if ( c.y > maxY ) {
            maxY = c.y;
          }
        }
        if ( c.type == "C" || c.type == "Q" ) {
          if ( c.x1 < minX ) {
            minX = c.x1;
          }
          if ( c.x1 > maxX ) {
            maxX = c.x1;
          }
          if ( c.y1 < minY ) {
            minY = c.y1;
          }
          if ( c.y1 > maxY ) {
            maxY = c.y1;
          }
        }
        if ( c.type == "C" ) {
          if ( c.x2 < minX ) {
            minX = c.x2;
          }
          if ( c.x2 > maxX ) {
            maxX = c.x2;
          }
          if ( c.y2 < minY ) {
            minY = c.y2;
          }
          if ( c.y2 > maxY ) {
            maxY = c.y2;
          }
        }
        j = j + 1;
      };
      k = k + 1;
    };
    if ( any == false ) {
      return b;
    }
    b.minX = minX;
    b.minY = minY;
    b.maxX = maxX;
    b.maxY = maxY;
    b.width = maxX - minX;
    b.height = maxY - minY;
    return b;
  };
  effectiveViewBox () {
    if ( this.viewBox.isSet ) {
      return this.viewBox;
    }
    if ( this.width > 0.0 && this.height > 0.0 ) {
      return ViewBoxRect.create(0.0, 0.0, this.width, this.height);
    }
    const b = this.bounds();
    return VectorViewBox.effectiveViewBox(
      "",
      b.minX,
      b.minY,
      b.width,
      b.height
    );
  };
}
class SvgAttr  {
  constructor() {
    this.name = "";
    this.value = "";
  }
}
class SvgTag  {
  constructor() {
    this.name = "";
    this.isEnd = false;
    this.selfClose = false;
    this.attrs = [];
    this.valid = false;
    let a = [];
    this.attrs = a;
    this.name = "";
    this.isEnd = false;
    this.selfClose = false;
    this.valid = false;
  }
  has (n) {
    let k = 0;
    while (k < this.attrs.length) {
      const a = this.attrs[k];
      if ( a.name == n ) {
        return true;
      }
      k = k + 1;
    };
    return false;
  };
  attr (n) {
    let k = 0;
    while (k < this.attrs.length) {
      const a = this.attrs[k];
      if ( a.name == n ) {
        return a.value;
      }
      k = k + 1;
    };
    return "";
  };
}
class SvgParser  {
  constructor() {
    this.src = "";
    this.pos = 0;
    this.__len = 0;
    this.doc = undefined;
    this.maxNodes = 50000;
    this.maxDepth = 64;
    this.maxCommands = 500000;
    this.maxUseDepth = 8;
    this.initialFill = undefined;
    this.nodeCount = 0;
    this.emittedCommands = 0;
    this.useDepth = 0;
    this.aborted = false;
    this.spans = {};
    this.warnedKeys = {};
    this.doc = new SvgDocument();
    this.initialFill = EVGColor.black();
  }
  setInitialFill (c) {
    this.initialFill = c;
  };
  warn (key, msg) {
    const seen = ( Object.prototype.hasOwnProperty.call(this.warnedKeys, key) ? this.warnedKeys[key] : undefined );
    if ( (typeof(seen) !== "undefined" && seen != null )  ) {
      return;
    }
    this.warnedKeys[key] = true;
    this.doc.warnings.push(msg);
  };
  fail (msg) {
    this.doc.errors.push(msg);
    this.doc.truncated = true;
    this.aborted = true;
  };
  parse (source) {
    this.doc = new SvgDocument();
    let emptySpans = {};
    this.spans = emptySpans;
    let emptyWarned = {};
    this.warnedKeys = emptyWarned;
    this.nodeCount = 0;
    this.emittedCommands = 0;
    this.useDepth = 0;
    this.aborted = false;
    this.src = source;
    this.__len = source.length;
    this.pos = 0;
    this.indexIds();
    if ( this.aborted ) {
      return this.doc;
    }
    this.src = source;
    this.__len = source.length;
    this.pos = 0;
    const root = new SvgStyleState();
    root.fill = this.initialFill;
    this.parseChildren(root, 0, "");
    return this.doc;
  };
  indexIds () {
    let openNames = [];
    let openIds = [];
    let openStarts = [];
    while (this.aborted == false) {
      const tagStart = this.findTagStart();
      if ( tagStart < 0 ) {
        return;
      }
      const tag = this.readTag();
      if ( tag.valid == false ) {
        return;
      }
      if ( tag.isEnd ) {
        const depth = openNames.length;
        if ( depth > 0 ) {
          const openName = openNames[(depth - 1)];
          if ( openName == tag.name ) {
            const id = openIds[(depth - 1)];
            if ( id.length > 0 ) {
              const from = openStarts[(depth - 1)];
              this.spans[id] = this.src.substring(from, this.pos );
            }
            openNames.pop();
            openIds.pop();
            openStarts.pop();
          }
        }
      } else {
        const id2 = tag.attr("id");
        if ( tag.selfClose ) {
          if ( id2.length > 0 ) {
            this.spans[id2] = this.src.substring(tagStart, this.pos );
          }
        } else {
          openNames.push(tag.name);
          openIds.push(id2);
          openStarts.push(tagStart);
          if ( openNames.length > this.maxDepth ) {
            this.fail(("nesting deeper than " + (this.maxDepth.toString())) + " levels");
            return;
          }
        }
      }
    };
  };
  parseChildren (inherited, depth, endName) {
    if ( depth > this.maxDepth ) {
      this.fail(("nesting deeper than " + (this.maxDepth.toString())) + " levels");
      return;
    }
    while (this.aborted == false) {
      const tagStart = this.findTagStart();
      if ( tagStart < 0 ) {
        return;
      }
      const tag = this.readTag();
      if ( tag.valid == false ) {
        return;
      }
      if ( tag.isEnd ) {
        return;
      }
      this.nodeCount = this.nodeCount + 1;
      if ( this.nodeCount > this.maxNodes ) {
        this.fail(("more than " + (this.maxNodes.toString())) + " elements");
        return;
      }
      this.handleElement(tag, inherited, depth);
    };
  };
  handleElement (tag, inherited, depth) {
    const name = tag.name;
    if ( this.isRefused(name) ) {
      this.refuse(name);
      if ( tag.selfClose == false ) {
        this.skipSubtree(name);
      }
      return;
    }
    if ( (name == "title" || name == "desc") || name == "metadata" ) {
      if ( tag.selfClose == false ) {
        this.skipSubtree(name);
      }
      return;
    }
    if ( name == "defs" ) {
      if ( tag.selfClose == false ) {
        this.skipSubtree(name);
      }
      return;
    }
    if ( name == "svg" ) {
      if ( depth == 0 ) {
        this.readRootAttributes(tag);
        const rootState = this.applyPresentation(inherited, tag, depth);
        if ( tag.selfClose == false ) {
          this.parseChildren(rootState, depth + 1, name);
        }
        return;
      }
      this.warn("nested-svg", "a nested <svg> element establishes its own viewport and is not supported; its contents are not drawn");
      if ( tag.selfClose == false ) {
        this.skipSubtree(name);
      }
      return;
    }
    if ( name == "g" || name == "a" ) {
      const groupState = this.applyPresentation(inherited, tag, depth);
      if ( tag.selfClose == false ) {
        this.parseChildren(groupState, depth + 1, name);
      }
      return;
    }
    if ( name == "switch" ) {
      this.warn("switch", "<switch> conditional processing is not supported; its contents are not drawn");
      if ( tag.selfClose == false ) {
        this.skipSubtree(name);
      }
      return;
    }
    if ( name == "use" ) {
      this.handleUse(tag, inherited, depth);
      if ( tag.selfClose == false ) {
        this.skipSubtree(name);
      }
      return;
    }
    if ( this.isShape(name) ) {
      const shapeState = this.applyPresentation(inherited, tag, depth);
      this.emitShape(tag, shapeState);
      if ( tag.selfClose == false ) {
        this.skipSubtree(name);
      }
      return;
    }
    this.warn("unknown-" + name, ("<" + name) + "> is not part of the supported SVG profile and was skipped");
    if ( tag.selfClose == false ) {
      this.skipSubtree(name);
    }
  };
  isRefused (name) {
    if ( name == "script" ) {
      return true;
    }
    if ( name == "foreignObject" ) {
      return true;
    }
    if ( name == "filter" ) {
      return true;
    }
    if ( name == "mask" ) {
      return true;
    }
    if ( name == "clipPath" ) {
      return true;
    }
    if ( name == "pattern" ) {
      return true;
    }
    if ( name == "marker" ) {
      return true;
    }
    if ( name == "symbol" ) {
      return true;
    }
    if ( name == "style" ) {
      return true;
    }
    if ( name == "text" ) {
      return true;
    }
    if ( name == "image" ) {
      return true;
    }
    if ( name == "linearGradient" ) {
      return true;
    }
    if ( name == "radialGradient" ) {
      return true;
    }
    if ( name == "animate" ) {
      return true;
    }
    if ( name == "animateTransform" ) {
      return true;
    }
    if ( name == "animateMotion" ) {
      return true;
    }
    if ( name == "set" ) {
      return true;
    }
    return false;
  };
  refuse (name) {
    if ( name == "text" ) {
      this.warn("text", "<text> is not supported; convert text to outlines before export, or the wordmark will be missing");
      return;
    }
    if ( name == "image" ) {
      this.warn("image", "<image> references an external resource, which the importer does not fetch; it was skipped");
      return;
    }
    if ( name == "style" ) {
      this.warn("style", "a <style> element is not applied; CSS in the document is outside the profile, so use presentation attributes instead");
      return;
    }
    if ( name == "linearGradient" || name == "radialGradient" ) {
      this.warn("gradient", "gradient paint is deferred (PLAN_VECTOR_IR.md §6): the three renderers do not agree on gradients yet, so a gradient fill is dropped rather than rendered differently in each output");
      return;
    }
    if ( name == "clipPath" || name == "mask" ) {
      this.warn("clip-" + name, ("<" + name) + "> is not supported; the shapes it would have cut are drawn whole");
      return;
    }
    this.warn("refused-" + name, ("<" + name) + "> is outside the supported SVG profile and was skipped");
  };
  isShape (name) {
    if ( name == "path" ) {
      return true;
    }
    if ( name == "rect" ) {
      return true;
    }
    if ( name == "circle" ) {
      return true;
    }
    if ( name == "ellipse" ) {
      return true;
    }
    if ( name == "line" ) {
      return true;
    }
    if ( name == "polyline" ) {
      return true;
    }
    if ( name == "polygon" ) {
      return true;
    }
    return false;
  };
  handleUse (tag, inherited, depth) {
    let href = tag.attr("href");
    if ( href.length == 0 ) {
      href = tag.attr("xlink:href");
    }
    if ( href.length == 0 ) {
      this.warn("use-nohref", "<use> without an href draws nothing");
      return;
    }
    if ( href.charCodeAt(0 ) != 35 ) {
      this.warn("use-external", "<use> may only reference a fragment in the same document; an external reference was dropped");
      return;
    }
    const id = href.substring(1, href.length );
    const target = ( Object.prototype.hasOwnProperty.call(this.spans, id) ? this.spans[id] : undefined );
    let fragment = "";
    if ( (typeof(target) !== "undefined" && target != null )  ) {
      fragment = target;
    } else {
      this.warn("use-missing-" + id, ("<use href=\"#" + id) + "\"> refers to an id that is not in this document");
      return;
    }
    if ( this.useDepth >= this.maxUseDepth ) {
      this.warn("use-depth", ("<use> references nested more than " + (this.maxUseDepth.toString())) + " deep, which is either a cycle or deeper than this profile expands");
      return;
    }
    const state = this.applyPresentation(inherited, tag, depth);
    const ux = this.numAttr(tag, "x", 0.0);
    const uy = this.numAttr(tag, "y", 0.0);
    if ( (ux == 0.0 && uy == 0.0) == false ) {
      state.ctm = state.ctm.multiply(Matrix2D.translate(ux, uy));
    }
    const savedSrc = this.src;
    const savedPos = this.pos;
    const savedLen = this.__len;
    this.src = fragment;
    this.__len = this.src.length;
    this.pos = 0;
    this.useDepth = this.useDepth + 1;
    this.parseChildren(state, depth + 1, "");
    this.useDepth = this.useDepth - 1;
    this.src = savedSrc;
    this.pos = savedPos;
    this.__len = savedLen;
  };
  applyPresentation (inherited, tag, depth) {
    const s = inherited.copy();
    let k = 0;
    while (k < tag.attrs.length) {
      const a = tag.attrs[k];
      this.applyProperty(s, a.name, a.value);
      k = k + 1;
    };
    const styleAttr = tag.attr("style");
    if ( styleAttr.length > 0 ) {
      this.applyStyleAttribute(s, styleAttr);
    }
    const tf = tag.attr("transform");
    if ( tf.length > 0 ) {
      const m = this.parseTransform(tf);
      s.ctm = s.ctm.multiply(m);
    }
    return s;
  };
  applyStyleAttribute (s, style) {
    const decls = this.splitOn(style, 59);
    let k = 0;
    while (k < decls.length) {
      const decl = decls[k];
      const colon = decl.indexOf(":");
      if ( colon > 0 ) {
        const n = decl.substring(0, colon ).trim();
        const v = decl.substring(colon + 1, decl.length ).trim();
        this.applyProperty(s, n, v);
      }
      k = k + 1;
    };
  };
  applyProperty (s, name, value) {
    const v = value.trim();
    if ( name == "fill" ) {
      s.fill = this.parsePaint(v, s.fill);
      return;
    }
    if ( name == "stroke" ) {
      s.stroke = this.parsePaint(v, s.stroke);
      return;
    }
    if ( name == "stroke-width" ) {
      const w = isNaN( parseFloat(v) ) ? undefined : parseFloat(v);
      if ( typeof(w) != "undefined" ) {
        s.strokeWidth = w;
      }
      return;
    }
    if ( name == "fill-rule" ) {
      if ( v == "evenodd" ) {
        s.fillRule = "evenodd";
      }
      if ( v == "nonzero" ) {
        s.fillRule = "nonzero";
      }
      return;
    }
    if ( name == "stroke-dasharray" ) {
      if ( v == "none" ) {
        s.dashArray = "";
      } else {
        s.dashArray = v;
      }
      return;
    }
    if ( name == "stroke-dashoffset" ) {
      const o = isNaN( parseFloat(v) ) ? undefined : parseFloat(v);
      if ( typeof(o) != "undefined" ) {
        s.dashOffset = o;
      }
      return;
    }
    if ( name == "fill-opacity" ) {
      s.fillOpacity = this.parseOpacity(v, s.fillOpacity);
      return;
    }
    if ( name == "stroke-opacity" ) {
      s.strokeOpacity = this.parseOpacity(v, s.strokeOpacity);
      return;
    }
    if ( name == "opacity" ) {
      const o2 = this.parseOpacity(v, 1.0);
      s.groupOpacity = s.groupOpacity * o2;
      return;
    }
    if ( (name == "stroke-linecap" || name == "stroke-linejoin") || name == "stroke-miterlimit" ) {
      this.warn("stroke-joins", "stroke-linecap/linejoin/miterlimit are not represented; strokes are drawn with butt caps and round joins");
      return;
    }
    if ( name == "class" ) {
      this.warn("class", "class attributes have no effect because the profile applies no CSS");
      return;
    }
  };
  parsePaint (v, inheritedPaint) {
    if ( v == "none" ) {
      return EVGColor.noColor();
    }
    if ( v == "inherit" ) {
      return inheritedPaint;
    }
    if ( v == "currentColor" ) {
      return this.initialFill;
    }
    if ( v.indexOf("url(") == 0 ) {
      this.warn("gradient", "gradient paint is deferred (PLAN_VECTOR_IR.md §6): the three renderers do not agree on gradients yet, so a gradient fill is dropped rather than rendered differently in each output");
      return EVGColor.noColor();
    }
    const c = EVGColor.parse(v);
    if ( c.isSet == false ) {
      this.warn("color-" + v, ("could not read the colour \"" + v) + "\"; the inherited paint was used instead");
      return inheritedPaint;
    }
    return c;
  };
  parseOpacity (v, fallback) {
    let pct = false;
    let s = v;
    if ( s.length > 0 ) {
      if ( s.charCodeAt(s.length - 1 ) == 37 ) {
        pct = true;
        s = s.substring(0, s.length - 1 );
      }
    }
    const d = isNaN( parseFloat(s) ) ? undefined : parseFloat(s);
    let out = fallback;
    if ( typeof(d) != "undefined" ) {
      out = d;
    } else {
      return fallback;
    }
    if ( pct ) {
      out = out / 100.0;
    }
    if ( out < 0.0 ) {
      out = 0.0;
    }
    if ( out > 1.0 ) {
      out = 1.0;
    }
    return out;
  };
  parseTransform (s) {
    let m = Matrix2D.identity();
    let i = 0;
    const n = s.length;
    while (i < n) {
      const open = this.findFrom(s, i, 40);
      if ( open < 0 ) {
        return m;
      }
      const fname = s.substring(i, open ).trim();
      const close = this.findFrom(s, (open + 1), 41);
      if ( close < 0 ) {
        this.warn("transform-unclosed", "a transform is missing its closing parenthesis: " + s);
        return m;
      }
      const args = this.parseNumberList(s.substring(open + 1, close ));
      const na = args.length;
      i = close + 1;
      let part = Matrix2D.identity();
      let known = true;
      if ( fname == "matrix" ) {
        if ( na == 6 ) {
          part = Matrix2D.create(
            args[0],
            args[1],
            args[2],
            args[3],
            args[4],
            args[5]
          );
        } else {
          known = false;
        }
      } else {
        if ( fname == "translate" ) {
          if ( na == 1 ) {
            part = Matrix2D.translate(args[0], 0.0);
          } else {
            if ( na == 2 ) {
              part = Matrix2D.translate(args[0], args[1]);
            } else {
              known = false;
            }
          }
        } else {
          if ( fname == "scale" ) {
            if ( na == 1 ) {
              part = Matrix2D.scale(args[0], args[0]);
            } else {
              if ( na == 2 ) {
                part = Matrix2D.scale(args[0], args[1]);
              } else {
                known = false;
              }
            }
          } else {
            if ( fname == "rotate" ) {
              if ( na == 1 ) {
                part = this.rotation(args[0]);
              } else {
                if ( na == 3 ) {
                  const cx = args[1];
                  const cy = args[2];
                  const r = this.rotation(args[0]);
                  part = Matrix2D.translate(cx, cy);
                  part = part.multiply(r);
                  part = part.multiply(Matrix2D.translate((0.0 - cx), (0.0 - cy)));
                } else {
                  known = false;
                }
              }
            } else {
              if ( fname == "skewX" ) {
                if ( na == 1 ) {
                  part = Matrix2D.create(
                    1.0,
                    0.0,
                    this.tanDeg(args[0]),
                    1.0,
                    0.0,
                    0.0
                  );
                } else {
                  known = false;
                }
              } else {
                if ( fname == "skewY" ) {
                  if ( na == 1 ) {
                    part = Matrix2D.create(
                      1.0,
                      this.tanDeg(args[0]),
                      0.0,
                      1.0,
                      0.0,
                      0.0
                    );
                  } else {
                    known = false;
                  }
                } else {
                  known = false;
                }
              }
            }
          }
        }
      }
      if ( known == false ) {
        this.warn("transform-" + fname, ("the transform \"" + fname) + "\" was not applied: unknown, or given the wrong number of arguments");
      } else {
        m = m.multiply(part);
      }
    };
    return m;
  };
  rotation (deg) {
    const rad = (deg * 3.141592653589793) / 180.0;
    const cs = Math.cos(rad);
    const sn = Math.sin(rad);
    return Matrix2D.create(cs, sn, (0.0 - sn), cs, 0.0, 0.0);
  };
  tanDeg (deg) {
    const rad = (deg * 3.141592653589793) / 180.0;
    return Math.sin(rad) / Math.cos(rad);
  };
  emitShape (tag, s) {
    const name = tag.name;
    let cmds = [];
    if ( name == "path" ) {
      const d = tag.attr("d");
      if ( d.length == 0 ) {
        return;
      }
      const p = new SVGPathParser();
      p.parse(d);
      if ( p.hasErrors() ) {
        this.warn("pathdata-" + p.errorSummary(), "path data was not fully read: " + p.errorSummary());
      }
      cmds = p.getCommands();
    } else {
      if ( name == "rect" ) {
        const rx = this.numAttr(tag, "rx", -1.0);
        const ry = this.numAttr(tag, "ry", -1.0);
        cmds = VectorShapes.rect(
          this.numAttr(tag, "x", 0.0),
          this.numAttr(tag, "y", 0.0),
          this.numAttr(tag, "width", 0.0),
          this.numAttr(tag, "height", 0.0),
          rx,
          ry
        );
      } else {
        if ( name == "circle" ) {
          cmds = VectorShapes.circle(
            this.numAttr(tag, "cx", 0.0),
            this.numAttr(tag, "cy", 0.0),
            this.numAttr(tag, "r", 0.0)
          );
        } else {
          if ( name == "ellipse" ) {
            cmds = VectorShapes.ellipse(
              this.numAttr(tag, "cx", 0.0),
              this.numAttr(tag, "cy", 0.0),
              this.numAttr(tag, "rx", 0.0),
              this.numAttr(tag, "ry", 0.0)
            );
          } else {
            if ( name == "line" ) {
              cmds = VectorShapes.line(
                this.numAttr(tag, "x1", 0.0),
                this.numAttr(tag, "y1", 0.0),
                this.numAttr(tag, "x2", 0.0),
                this.numAttr(tag, "y2", 0.0)
              );
            } else {
              if ( name == "polyline" ) {
                cmds = VectorShapes.polyline(this.parseNumberList(tag.attr("points")));
              } else {
                if ( name == "polygon" ) {
                  cmds = VectorShapes.polygon(this.parseNumberList(tag.attr("points")));
                }
              }
            }
          }
        }
      }
    }
    const count = cmds.length;
    if ( count == 0 ) {
      return;
    }
    this.emittedCommands = this.emittedCommands + count;
    if ( this.emittedCommands > this.maxCommands ) {
      this.fail(("more than " + (this.maxCommands.toString())) + " path commands");
      return;
    }
    const item = new SvgVectorItem();
    item.commands = this.transformCommands(cmds, s.ctm);
    item.fillRule = s.fillRule;
    item.dashArray = s.dashArray;
    item.dashOffset = s.dashOffset;
    if ( s.fill.isSet ) {
      item.fillColor = this.withAlpha(s.fill, (s.fillOpacity * s.groupOpacity));
    }
    if ( s.stroke.isSet ) {
      item.strokeColor = this.withAlpha(s.stroke, (s.strokeOpacity * s.groupOpacity));
      item.strokeWidth = s.strokeWidth * this.scaleOf(s.ctm);
    }
    if ( item.hasFill() == false && item.hasStroke() == false ) {
      return;
    }
    this.doc.items.push(item);
  };
  withAlpha (c, mul) {
    if ( mul >= 1.0 ) {
      return c;
    }
    return EVGColor.create(c.r, c.g, c.b, (c.a * mul));
  };
  scaleOf (m) {
    let det = m.a * m.d - m.b * m.c;
    if ( det < 0.0 ) {
      det = 0.0 - det;
    }
    if ( det == 0.0 ) {
      return 0.0;
    }
    return Math.sqrt(det);
  };
  transformCommands (cmds, m) {
    let out = [];
    if ( m.isIdentity() ) {
      return cmds;
    }
    let k = 0;
    while (k < cmds.length) {
      const c = cmds[k];
      const n = new PathCommand();
      n.type = c.type;
      n.x = m.applyX(c.x, c.y);
      n.y = m.applyY(c.x, c.y);
      n.x1 = m.applyX(c.x1, c.y1);
      n.y1 = m.applyY(c.x1, c.y1);
      n.x2 = m.applyX(c.x2, c.y2);
      n.y2 = m.applyY(c.x2, c.y2);
      out.push(n);
      k = k + 1;
    };
    return out;
  };
  readRootAttributes (tag) {
    const vb = tag.attr("viewBox");
    if ( vb.length > 0 ) {
      const parsed = VectorViewBox.parseViewBox(vb);
      if ( parsed.isSet ) {
        this.doc.viewBox = parsed;
      } else {
        this.warn("viewbox", ("the root viewBox \"" + vb) + "\" is not four numbers with a positive width and height, and was ignored");
      }
    }
    this.doc.width = this.lengthAttr(tag, "width");
    this.doc.height = this.lengthAttr(tag, "height");
    const par = tag.attr("preserveAspectRatio");
    if ( par.length > 0 ) {
      this.warn("par", "preserveAspectRatio on the imported root is ignored; the element that hosts the drawing decides how it is fitted");
    }
  };
  lengthAttr (tag, name) {
    const raw = tag.attr(name).trim();
    if ( raw.length == 0 ) {
      return 0.0;
    }
    let s = raw;
    if ( s.indexOf("px") > 0 ) {
      s = s.substring(0, s.indexOf("px") );
    }
    if ( this.isPlainNumber(s.trim()) == false ) {
      return 0.0;
    }
    const d = isNaN( parseFloat(s.trim()) ) ? undefined : parseFloat(s.trim());
    let out = 0.0;
    if ( typeof(d) != "undefined" ) {
      out = d;
    } else {
      return 0.0;
    }
    if ( out < 0.0 ) {
      return 0.0;
    }
    return out;
  };
  isPlainNumber (s) {
    const n = s.length;
    if ( n == 0 ) {
      return false;
    }
    let k = 0;
    while (k < n) {
      const c = s.charCodeAt(k );
      let ok = false;
      if ( c >= 48 && c <= 57 ) {
        ok = true;
      }
      if ( c == 46 ) {
        ok = true;
      }
      if ( c == 45 ) {
        ok = true;
      }
      if ( c == 43 ) {
        ok = true;
      }
      if ( c == 101 ) {
        ok = true;
      }
      if ( c == 69 ) {
        ok = true;
      }
      if ( ok == false ) {
        return false;
      }
      k = k + 1;
    };
    return true;
  };
  numAttr (tag, name, fallback) {
    const raw = tag.attr(name).trim();
    if ( raw.length == 0 ) {
      return fallback;
    }
    let s = raw;
    if ( s.indexOf("px") > 0 ) {
      s = s.substring(0, s.indexOf("px") );
    }
    if ( this.isPlainNumber(s.trim()) ) {
      const d = isNaN( parseFloat(s.trim()) ) ? undefined : parseFloat(s.trim());
      if ( typeof(d) != "undefined" ) {
        return d;
      }
    }
    this.warn("num-" + name, ((("the value \"" + raw) + "\" on ") + name) + " is not a plain number, and this profile resolves no units; it was treated as unspecified");
    return fallback;
  };
  findTagStart () {
    while (this.pos < this.__len) {
      const c = this.src.charCodeAt(this.pos );
      if ( c != 60 ) {
        this.pos = this.pos + 1;
      } else {
        if ( this.matchesAt(this.pos + 1, "!--") ) {
          const end = this.findString((this.pos + 4), "-->");
          if ( end < 0 ) {
            this.pos = this.__len;
            return -1;
          }
          this.pos = end + 3;
        } else {
          if ( this.matchesAt(this.pos + 1, "![CDATA[") ) {
            const cend = this.findString((this.pos + 9), "]]>");
            if ( cend < 0 ) {
              this.pos = this.__len;
              return -1;
            }
            this.pos = cend + 3;
          } else {
            if ( this.matchesAt(this.pos + 1, "?") ) {
              const pend = this.findString((this.pos + 2), "?>");
              if ( pend < 0 ) {
                this.pos = this.__len;
                return -1;
              }
              this.pos = pend + 2;
            } else {
              if ( this.matchesAt(this.pos + 1, "!") ) {
                this.skipDeclaration();
                if ( this.aborted ) {
                  return -1;
                }
              } else {
                return this.pos;
              }
            }
          }
        }
      }
    };
    return -1;
  };
  skipDeclaration () {
    let i = this.pos + 2;
    while (i < this.__len) {
      const c = this.src.charCodeAt(i );
      if ( c == 91 ) {
        this.fail("this document has a DOCTYPE internal subset, which is where entity declarations live; the importer implements no entities and will not guess at one");
        this.pos = this.__len;
        return;
      }
      if ( c == 62 ) {
        this.pos = i + 1;
        return;
      }
      i = i + 1;
    };
    this.pos = this.__len;
  };
  readTag () {
    const tag = new SvgTag();
    if ( this.pos >= this.__len ) {
      return tag;
    }
    let i = this.pos + 1;
    if ( i < this.__len ) {
      if ( this.src.charCodeAt(i ) == 47 ) {
        tag.isEnd = true;
        i = i + 1;
      }
    }
    const nameStart = i;
    while (i < this.__len) {
      const c = this.src.charCodeAt(i );
      if ( this.isNameChar(c) ) {
        i = i + 1;
      } else {
        break;
      }
    };
    tag.name = this.localName(this.src.substring(nameStart, i ));
    if ( tag.name.length == 0 ) {
      this.pos = this.pos + 1;
      return tag;
    }
    while (i < this.__len) {
      i = this.skipSpaceFrom(i);
      if ( i >= this.__len ) {
        break;
      }
      const c2 = this.src.charCodeAt(i );
      if ( c2 == 62 ) {
        i = i + 1;
        tag.valid = true;
        this.pos = i;
        return tag;
      }
      if ( c2 == 47 ) {
        tag.selfClose = true;
        i = i + 1;
        if ( i < this.__len ) {
          if ( this.src.charCodeAt(i ) == 62 ) {
            i = i + 1;
          }
        }
        tag.valid = true;
        this.pos = i;
        return tag;
      }
      const attrStart = i;
      while (i < this.__len) {
        const c3 = this.src.charCodeAt(i );
        if ( this.isNameChar(c3) ) {
          i = i + 1;
        } else {
          break;
        }
      };
      if ( i == attrStart ) {
        i = i + 1;
      } else {
        const attrName = this.src.substring(attrStart, i );
        i = this.skipSpaceFrom(i);
        let value = "";
        if ( i < this.__len ) {
          if ( this.src.charCodeAt(i ) == 61 ) {
            i = i + 1;
            i = this.skipSpaceFrom(i);
            if ( i < this.__len ) {
              const q = this.src.charCodeAt(i );
              if ( q == 34 || q == 39 ) {
                const vstart = i + 1;
                const vend = this.findFrom(this.src, vstart, q);
                if ( vend < 0 ) {
                  this.warn("unquoted", ("an attribute value on <" + tag.name) + "> is missing its closing quote");
                  this.pos = this.__len;
                  return tag;
                }
                value = this.decodeEntities(this.src.substring(vstart, vend ));
                i = vend + 1;
              } else {
                this.warn("unquoted", ("an attribute value on <" + tag.name) + "> is not quoted; XML requires quotes, so it was skipped");
                while (i < this.__len) {
                  const c4 = this.src.charCodeAt(i );
                  if ( c4 == 62 || this.isSpace(c4) ) {
                    break;
                  }
                  i = i + 1;
                };
              }
            }
          }
        }
        const a = new SvgAttr();
        a.name = this.attrName(attrName);
        a.value = value;
        tag.attrs.push(a);
      }
    };
    this.pos = this.__len;
    return tag;
  };
  skipSubtree (name) {
    let depth = 1;
    while (depth > 0 && this.aborted == false) {
      const start = this.findTagStart();
      if ( start < 0 ) {
        return;
      }
      const tag = this.readTag();
      if ( tag.valid == false ) {
        return;
      }
      if ( tag.selfClose == false ) {
        if ( tag.name == name ) {
          if ( tag.isEnd ) {
            depth = depth - 1;
          } else {
            depth = depth + 1;
          }
        }
      }
    };
  };
  decodeEntities (s) {
    if ( s.indexOf("&") < 0 ) {
      return s;
    }
    let out = "";
    let i = 0;
    const n = s.length;
    while (i < n) {
      const c = s.charCodeAt(i );
      if ( c != 38 ) {
        out = out + String.fromCharCode(c);
        i = i + 1;
      } else {
        const semi = this.findFrom(s, i, 59);
        let handled = false;
        if ( semi > i ) {
          const ent = s.substring(i, semi + 1 );
          if ( ent == "&amp;" ) {
            out = out + "&";
            handled = true;
          }
          if ( ent == "&lt;" ) {
            out = out + "<";
            handled = true;
          }
          if ( ent == "&gt;" ) {
            out = out + ">";
            handled = true;
          }
          if ( ent == "&quot;" ) {
            out = out + "\"";
            handled = true;
          }
          if ( ent == "&apos;" ) {
            out = out + "'";
            handled = true;
          }
          if ( handled ) {
            i = semi + 1;
          } else {
            this.warn("entity", "only the five predefined XML entities are expanded; any other reference is left as written");
            out = out + "&";
            i = i + 1;
          }
        } else {
          out = out + "&";
          i = i + 1;
        }
      }
    };
    return out;
  };
  localName (raw) {
    const colon = raw.indexOf(":");
    if ( colon < 0 ) {
      return raw;
    }
    return raw.substring(colon + 1, raw.length );
  };
  attrName (raw) {
    if ( raw.indexOf("xlink:") == 0 ) {
      return raw;
    }
    const colon = raw.indexOf(":");
    if ( colon < 0 ) {
      return raw;
    }
    return raw.substring(colon + 1, raw.length );
  };
  isSpace (c) {
    if ( c == 32 ) {
      return true;
    }
    if ( c == 9 ) {
      return true;
    }
    if ( c == 10 ) {
      return true;
    }
    if ( c == 13 ) {
      return true;
    }
    return false;
  };
  isNameChar (c) {
    if ( c >= 65 && c <= 90 ) {
      return true;
    }
    if ( c >= 97 && c <= 122 ) {
      return true;
    }
    if ( c >= 48 && c <= 57 ) {
      return true;
    }
    if ( c == 58 ) {
      return true;
    }
    if ( c == 45 ) {
      return true;
    }
    if ( c == 95 ) {
      return true;
    }
    if ( c == 46 ) {
      return true;
    }
    return false;
  };
  skipSpaceFrom (from) {
    let i = from;
    while (i < this.__len) {
      if ( this.isSpace(this.src.charCodeAt(i )) ) {
        i = i + 1;
      } else {
        break;
      }
    };
    return i;
  };
  findFrom (s, from, ch) {
    let i = from;
    const n = s.length;
    while (i < n) {
      if ( s.charCodeAt(i ) == ch ) {
        return i;
      }
      i = i + 1;
    };
    return -1;
  };
  findString (from, needle) {
    const nl = needle.length;
    let i = from;
    while (i + nl <= this.__len) {
      if ( this.matchesAt(i, needle) ) {
        return i;
      }
      i = i + 1;
    };
    return -1;
  };
  matchesAt (at, needle) {
    const nl = needle.length;
    if ( at + nl > this.__len ) {
      return false;
    }
    return this.src.substring(at, at + nl ) == needle;
  };
  splitOn (s, sep) {
    let out = [];
    const n = s.length;
    let start = 0;
    let i = 0;
    while (i < n) {
      if ( s.charCodeAt(i ) == sep ) {
        out.push(s.substring(start, i ));
        start = i + 1;
      }
      i = i + 1;
    };
    out.push(s.substring(start, n ));
    return out;
  };
  parseNumberList (s) {
    let out = [];
    const toks = VectorViewBox.splitTokens(s);
    let k = 0;
    while (k < toks.length) {
      const d = isNaN( parseFloat(toks[k]) ) ? undefined : parseFloat(toks[k]);
      if ( typeof(d) != "undefined" ) {
        out.push(d);
      } else {
        this.warn("numlist-" + toks[k], ("\"" + toks[k]) + "\" is not a number; the rest of that list was not read");
        return out;
      }
      k = k + 1;
    };
    return out;
  };
}
class EVGFlight  {
  constructor() {
    this.property = "";     /* note: unused */
    this.durationMs = 0.0;
    this.delayMs = 0.0;
    this.elapsedMs = 0.0;
    this.easing = new EVGEasing();
    this.fromColor = undefined;     /* note: unused */
    this.toColor = undefined;     /* note: unused */
    this.fromNumber = 0.0;     /* note: unused */
    this.toNumber = 0.0;     /* note: unused */
    this.isColor = false;     /* note: unused */
    this.unitCode = 0;     /* note: unused */
    this.reversingStartColor = undefined;     /* note: unused */
    this.reversingStartNumber = 0.0;     /* note: unused */
    this.reversingFactor = 1.0;     /* note: unused */
    this.wroteNumber = 0.0;     /* note: unused */
    this.wroteColor = undefined;     /* note: unused */
    this.hasWrote = false;     /* note: unused */
  }
  progress () {
    if ( this.durationMs <= 0.0 ) {
      return 1.0;
    }
    const t = (this.elapsedMs - this.delayMs) / this.durationMs;
    if ( t < 0.0 ) {
      return 0.0;
    }
    if ( t > 1.0 ) {
      return 1.0;
    }
    return t;
  };
  eased () {
    return this.easing.ease(this.progress());
  };
  done () {
    return this.elapsedMs >= this.delayMs + this.durationMs;
  };
}
class EVGElement  {
  constructor() {
    this.id = "";
    this.key = "";
    this.href = "";
    this.tagName = "div";
    this.elementType = 0;
    this.format = "";
    this.orientation = "";
    this.pageWidth = 0.0;
    this.pageHeight = 0.0;
    this.parent = undefined;
    this.children = [];
    this.width = undefined;
    this.height = undefined;
    this.minWidth = undefined;
    this.minHeight = undefined;
    this.maxWidth = undefined;
    this.maxHeight = undefined;
    this.left = undefined;
    this.top = undefined;
    this.right = undefined;
    this.bottom = undefined;
    this.x = undefined;
    this.y = undefined;
    this.box = undefined;
    this.backgroundColor = undefined;
    this.opacity = 1.0;
    this.backdropBlur = 0.0;
    this.gradientSet = false;
    this.gradientFrom = undefined;
    this.gradientTo = undefined;
    this.gradientDir = 0;
    this.absPosSet = false;
    this.absX = 0.0;
    this.absY = 0.0;
    this.glowIntensity = 0.0;
    this.bgImageSet = false;
    this.bgImagePath = "";
    this.textDir = "";
    this.resolvedRtl = false;
    this.direction = "row";
    this.align = "left";
    this.verticalAlign = "top";
    this.isInline = false;
    this.lineBreak = false;
    this.overflow = "visible";
    this.cursor = "";
    this.scrollbarWidth = "";
    this.scrollbarThumb = undefined;
    this.scrollbarTrack = undefined;
    this.scrollbarLabel = "";
    this.surfaceEffect = "";
    this.rippleSpeed = 220.0;
    this.rippleWidth = 28.0;
    this.rippleStrength = 7.0;
    this.rippleDecay = 1.8;
    this.rippleHighlight = 0.08;
    this.rippleRings = 3.0;
    this.rippleStagger = 0.09;
    this.rippleFalloff = 0.62;
    this.rippleShine = 0.45;
    this.rippleGloss = 120.0;
    this.rippleBump = 70.0;
    this.rippleLightX = -0.45;
    this.rippleLightY = -0.65;
    this.rippleLightZ = 0.62;
    this.rippleXs = [];
    this.rippleYs = [];
    this.rippleAges = [];
    this.effectTrigger = "";
    this.documentCss = "";
    this.fxNames = [];
    this.fxValues = [];
    this.scrollTop = 0.0;
    this.scrollLeft = 0.0;
    this.scrollWidth = 0.0;
    this.scrollHeight = 0.0;
    this.appliedScrollTop = 0.0;
    this.appliedScrollLeft = 0.0;
    this.paintLeft = 0.0;
    this.paintTop = 0.0;
    this.paintRight = 0.0;
    this.paintBottom = 0.0;
    this.paintUnbounded = false;
    this.shiftDx = 0.0;
    this.shiftDy = 0.0;
    this.keepLayout = false;
    this.hasLayout = false;
    this.layoutClean = false;
    this.layoutSkipped = false;
    this.kidOffX = 0.0;
    this.kidOffY = 0.0;
    this.boundsFresh = false;
    this.hasOverlayBelow = false;
    this.overlayScanned = false;
    this.lastParentW = 0.0;
    this.lastParentH = 0.0;
    this.lastFlex = false;
    this.lastFlexW = 0.0;
    this.hasIntrinsicMin = false;
    this.hasIntrinsicMax = false;
    this.intrinsicMin = 0.0;
    this.intrinsicMax = 0.0;
    this.paintClean = false;
    this.paintStamp = 0;
    this.paintHasEffect = false;
    this.effectRuntimeId = "";
    this.textShiftY = 0.0;
    this.fontSize = undefined;
    this.fontSizeInherited = false;
    this.fontSizeBase = 14.0;
    this.rootFontSize = 14.0;
    this.viewportW = 0.0;
    this.viewportH = 0.0;
    this.viewportRoot = false;
    this.viewportX = 0.0;
    this.viewportY = 0.0;
    this.fontFamily = "Noto Sans";
    this.fontWeight = "normal";
    this.letterSpacing = 0.0;
    this.paragraphSpacing = 0.0;
    this.strokeLineCap = "butt";
    this.strokeLineJoin = "miter";
    this.lineHeight = 0.0;
    this.lineHeightUnit = undefined;
    this.textAlign = "left";
    this.whiteSpace = "normal";
    this.color = undefined;
    this.emojiColor = undefined;
    this.textContent = "";
    this.display = "block";
    this.flex = 0.0;
    this.flexShrink = 1.0;
    this.flexBasis = undefined;
    this.flexDirection = "column";
    this.justifyContent = "flex-start";
    this.alignItems = "flex-start";
    this.alignSelf = "";
    this.alignContent = "flex-start";
    this.flexWrap = "wrap";
    this.gap = undefined;
    this.rowGap = undefined;
    this.columnGap = undefined;
    this.gridTemplateColumns = "";
    this.gridTemplateRows = "";
    this.subgridColumnSizes = [];
    this.subgridRowSizes = [];
    this.computedRowSizes = [];
    this.subgridPending = false;
    this.gridTemplateAreas = "";
    this.gridAutoFlow = "row";
    this.fullBleed = false;
    this.gridArea = "";
    this.gridColumn = "";
    this.gridRow = "";
    this.position = "relative";
    this.marginTop = undefined;
    this.marginRight = undefined;
    this.marginBottom = undefined;
    this.marginLeft = undefined;
    this.paddingTop = undefined;
    this.paddingRight = undefined;
    this.paddingBottom = undefined;
    this.paddingLeft = undefined;
    this.borderWidth = undefined;
    this.borderTopWidth = undefined;
    this.borderRightWidth = undefined;
    this.borderBottomWidth = undefined;
    this.borderLeftWidth = undefined;
    this.borderColor = undefined;
    this.src = "";
    this.alt = "";
    this.imageViewBox = "";
    this.imageViewBoxX = 0.0;
    this.imageViewBoxY = 0.0;
    this.imageViewBoxW = 1.0;
    this.imageViewBoxH = 1.0;
    this.imageViewBoxSet = false;
    this.imageOffsetX = undefined;
    this.imageOffsetY = undefined;
    this.objectFit = "cover";
    this.sourceWidth = 0.0;
    this.sourceHeight = 0.0;
    this.svgPath = "";
    this.preserveAspectRatio = "xMidYMid meet";
    this.ringsCache = [];
    this.ringsHave = false;
    this.ringsPath = "";
    this.ringsX = 0.0;
    this.ringsY = 0.0;
    this.ringsW = 0.0;
    this.ringsH = 0.0;
    this.ringsSteps = 0;
    this.ringsScale = 1.0;
    this.ringsViewBox = "";
    this.ringsFit = "";
    this.svgSource = "";
    this.svgDoc = undefined;
    this.svgDocKey = "";
    this.viewBox = "";
    this.fillColor = undefined;
    this.strokeColor = undefined;
    this.strokeWidth = 0.0;
    this.fillRule = "nonzero";
    this.strokeDashArray = "";
    this.strokeDashOffset = 0.0;
    this.anchorName = "";
    this.connectorFrom = "";
    this.connectorTo = "";
    this.connectorFromSide = "auto";
    this.connectorToSide = "auto";
    this.connectorRouting = "straight";
    this.connectorFromOffset = 0.0;
    this.connectorToOffset = 0.0;
    this.arrowStart = "none";
    this.arrowEnd = "none";
    this.arrowSize = 10.0;
    this.arrowPath = "";
    this.connectorResolved = false;
    this.clipPath = "";
    this.className = "";
    this.theme = "";
    this.inlineProps = [];
    this.cssProps = [];
    this.imageQuality = 0;
    this.maxImageSize = 0;
    this.rotate = 0.0;
    this.scale = 1.0;
    this.flipY = false;
    this.translateX = 0.0;
    this.translateY = 0.0;
    this.transformSpec = "";
    this.transformOriginX = EVGUnit.unset();
    this.transformOriginY = EVGUnit.unset();
    this.transformOriginSpec = "";
    this.shadowRadius = undefined;
    this.shadowColor = undefined;
    this.shadowOffsetX = undefined;
    this.shadowOffsetY = undefined;
    this.backgroundGradient = "";
    this.gradient = new EVGGradient();
    this.calculatedX = 0.0;
    this.calculatedY = 0.0;
    this.calculatedWidth = 0.0;
    this.calculatedHeight = 0.0;
    this.calculatedInnerWidth = 0.0;
    this.calculatedInnerHeight = 0.0;
    this.calculatedFlexWidth = 0.0;
    this.hasFlexWidth = false;
    this.calculatedFlexHeight = 0.0;
    this.calculatedBaseline = 0.0;
    this.calculatedDescent = 0.0;
    this.hasBaseline = false;
    this.hasDefiniteHeight = false;
    this.calculatedPage = 0;
    this.isAbsolute = false;
    this.isOverlay = false;
    this.overlayAnchor = undefined;
    this.isOverlayAnchor = false;
    this.overlaySide = "bottom";
    this.overlayAlign = "start";
    this.overlayGap = 4.0;
    this.overlayX = 0.0;
    this.overlayY = 0.0;
    this.overlayPlacedSide = "";
    this.overlayPlacedAlign = "";
    this.overlayPlacedPresentation = "";
    this.overlayClamped = false;
    this.positionAnchor = "";
    this.positionTryFallbacks = "";
    this.positionTryOrder = "";
    this.presentation = "";
    this.sheetBelow = 0.0;
    this.fitViewport = false;
    this.anchorLeftSide = "";
    this.anchorLeftOffset = 0.0;
    this.anchorTopSide = "";
    this.anchorTopOffset = 0.0;
    this.anchorRightSide = "";
    this.anchorRightOffset = 0.0;
    this.anchorBottomSide = "";
    this.anchorBottomOffset = 0.0;
    this.isHovered = false;
    this.isFocused = false;
    this.isPressed = false;
    this.transitionSpec = "";
    this.transitions = [];     /* note: unused */
    this.role = "";
    this.a11yLabel = "";
    this.a11yValue = "";
    this.a11yRequired = "";
    this.a11yInvalid = "";
    this.a11yReadOnly = "";
    this.a11yRoleDescription = "";
    this.a11yDescription = "";
    this.a11yHasPopup = "";
    this.a11yRowCount = 0;
    this.a11yRowIndex = 0;
    this.a11yHidden = false;
    this.a11yModal = false;
    this.a11ySorted = 0;
    this.a11yOrientation = "";
    this.a11yCurrent = "";
    this.a11yHasValue = false;
    this.a11yValueNow = 0;
    this.a11yHasRange = false;
    this.a11yValueMin = 0;
    this.a11yValueMax = 0;
    this.a11yChecked = 0;
    this.a11yPressed = 0;
    this.a11yExpanded = 0;
    this.a11ySelected = 0;
    this.a11yDisabled = false;
    this.a11yFocusable = false;
    this.a11yPosInSet = 0;
    this.a11ySetSize = 0;
    this.a11yLevel = 0;
    this.styleClass = "";
    this.styleTheme = "";
    this.styleBits = 0;
    this.styleGen = 0;
    this.styleSlot = 0 - 1;
    this.styleKids = 0 - 1;
    this.inspectSlot = 0 - 1;
    this.isLayoutComplete = false;
    this.unitsResolved = false;
    this.hasReturn = false;
    this.hasBreak = false;
    this.hasContinue = false;
    this.inheritedFontSize = 14.0;
    this.tagName = "div";
    this.elementType = 0;
    this.width = EVGUnit.unset();
    this.height = EVGUnit.unset();
    this.minWidth = EVGUnit.unset();
    this.minHeight = EVGUnit.unset();
    this.maxWidth = EVGUnit.unset();
    this.maxHeight = EVGUnit.unset();
    this.left = EVGUnit.unset();
    this.top = EVGUnit.unset();
    this.right = EVGUnit.unset();
    this.bottom = EVGUnit.unset();
    this.x = EVGUnit.unset();
    this.y = EVGUnit.unset();
    this.gap = EVGUnit.unset();
    this.flexBasis = EVGUnit.unset();
    this.rowGap = EVGUnit.unset();
    this.columnGap = EVGUnit.unset();
    const newBox = new EVGBox();
    this.box = newBox;
    this.backgroundColor = EVGColor.noColor();
    this.color = EVGColor.black();
    this.emojiColor = EVGColor.noColor();
    this.fontSize = EVGUnit.unset();
    this.lineHeightUnit = EVGUnit.unset();
    this.shadowRadius = EVGUnit.unset();
    this.shadowColor = EVGColor.noColor();
    this.shadowOffsetX = EVGUnit.unset();
    this.shadowOffsetY = EVGUnit.unset();
    this.imageOffsetX = EVGUnit.unset();
    this.imageOffsetY = EVGUnit.unset();
    this.fillColor = EVGColor.noColor();
    this.scrollbarThumb = EVGColor.noColor();
    this.scrollbarTrack = EVGColor.noColor();
    this.strokeColor = EVGColor.noColor();
    this.marginTop = EVGUnit.unset();
    this.marginRight = EVGUnit.unset();
    this.marginBottom = EVGUnit.unset();
    this.marginLeft = EVGUnit.unset();
    this.paddingTop = EVGUnit.unset();
    this.paddingRight = EVGUnit.unset();
    this.paddingBottom = EVGUnit.unset();
    this.paddingLeft = EVGUnit.unset();
    this.borderWidth = EVGUnit.unset();
    this.borderTopWidth = EVGUnit.unset();
    this.borderRightWidth = EVGUnit.unset();
    this.borderBottomWidth = EVGUnit.unset();
    this.borderLeftWidth = EVGUnit.unset();
    this.borderColor = EVGColor.noColor();
    this.gradientFrom = EVGColor.noColor();
    this.gradientTo = EVGColor.noColor();
  }
  addChild (child) {
    this.children.push(child);
  };
  resetLayoutState () {
    if ( this.keepLayout && (this.hasLayout && this.layoutClean) ) {
      return;
    }
    this.resetLayoutNow();
  };
  resetLayoutNow () {
    this.unitsResolved = false;
    this.shiftDx = 0.0;
    this.shiftDy = 0.0;
    this.hasIntrinsicMin = false;
    this.hasIntrinsicMax = false;
    this.layoutSkipped = false;
    this.boundsFresh = false;
    this.overlayScanned = false;
    this.calculatedX = 0.0;
    this.calculatedY = 0.0;
    this.calculatedWidth = 0.0;
    this.calculatedHeight = 0.0;
    this.calculatedFlexWidth = 0.0;
    this.hasFlexWidth = false;
    this.hasDefiniteHeight = false;
    this.calculatedBaseline = 0.0;
    this.calculatedDescent = 0.0;
    this.hasBaseline = false;
    let i = 0;
    while (i < this.children.length) {
      const child = this.children[i];
      child.resetLayoutState();
      i = i + 1;
    };
  };
  getChildCount () {
    return this.children.length;
  };
  moveSelf (dx, dy) {
    this.calculatedX = this.calculatedX + dx;
    this.calculatedY = this.calculatedY + dy;
    this.paintLeft = this.paintLeft + dx;
    this.paintRight = this.paintRight + dx;
    this.paintTop = this.paintTop + dy;
    this.paintBottom = this.paintBottom + dy;
  };
  moveSubtree (dx, dy) {
    this.moveSelf(dx, dy);
    let i = 0;
    const n = this.children.length;
    while (i < n) {
      const kid = this.children[i];
      kid.moveSubtree(dx, dy);
      i = i + 1;
    };
  };
  settleShift () {
    if ( this.shiftDx == 0.0 && this.shiftDy == 0.0 ) {
      return;
    }
    const dx = this.shiftDx;
    const dy = this.shiftDy;
    this.shiftDx = 0.0;
    this.shiftDy = 0.0;
    let i = 0;
    const n = this.children.length;
    while (i < n) {
      const kid = this.children[i];
      kid.moveSubtree(dx, dy);
      i = i + 1;
    };
  };
  settleAll () {
    this.settleShift();
    let i = 0;
    const n = this.children.length;
    while (i < n) {
      const kid = this.children[i];
      kid.settleAll();
      i = i + 1;
    };
  };
  clipsContent () {
    return this.overflow != "visible";
  };
  clientHeight () {
    return this.calculatedHeight - this.box.borderWidthPx * 2.0;
  };
  clientWidth () {
    return this.calculatedWidth - this.box.borderWidthPx * 2.0;
  };
  maxScrollTop () {
    const m = this.scrollHeight - this.clientHeight();
    if ( m < 0.0 ) {
      return 0.0;
    }
    return m;
  };
  maxScrollLeft () {
    const m = this.scrollWidth - this.clientWidth();
    if ( m < 0.0 ) {
      return 0.0;
    }
    return m;
  };
  getChild (index) {
    return this.children[index];
  };
  hasParent () {
    if ( typeof(this.parent) != "undefined" ) {
      return true;
    }
    return false;
  };
  isContainer () {
    return this.elementType == 0;
  };
  isText () {
    return this.elementType == 1;
  };
  isImage () {
    return this.elementType == 2;
  };
  isPath () {
    return this.elementType == 3;
  };
  isHidden () {
    return this.display == "none";
  };
  lineBoxFor (fontSize, normalPx) {
    if ( this.lineHeightUnit.isSet ) {
      const u = this.lineHeightUnit;
      u.setContext(this.rootFontSize, this.viewportW, this.viewportH);
      u.resolve(fontSize, fontSize);
      if ( u.pixels > 0.0 ) {
        return u.pixels;
      }
      return 0.0;
    }
    if ( this.lineHeight > 0.0 ) {
      return fontSize * this.lineHeight;
    }
    return normalPx;
  };
  wrapWidth (contentWidth) {
    if ( this.whiteSpace == "nowrap" ) {
      return 0.0;
    }
    if ( this.whiteSpace == "pre" ) {
      return 0.0;
    }
    return contentWidth;
  };
  hasTransform () {
    if ( this.rotate != 0.0 ) {
      return true;
    }
    if ( this.flipY ) {
      return true;
    }
    if ( Math.abs(this.scale - 1.0) > 0.000001 ) {
      return true;
    }
    if ( this.translateX != 0.0 ) {
      return true;
    }
    if ( this.translateY != 0.0 ) {
      return true;
    }
    return false;
  };
  isFixedPosition () {
    return this.position == "fixed";
  };
  moveSubtreeUnfixed (dx, dy) {
    this.moveSelf(dx, dy);
    let i = 0;
    const n = this.children.length;
    while (i < n) {
      const kid = this.children[i];
      if ( kid.isFixedPosition() ) {
      } else {
        kid.moveSubtreeUnfixed(dx, dy);
      }
      i = i + 1;
    };
  };
  hasAnchorInsets () {
    if ( this.anchorLeftSide.length > 0 ) {
      return true;
    }
    if ( this.anchorTopSide.length > 0 ) {
      return true;
    }
    if ( this.anchorRightSide.length > 0 ) {
      return true;
    }
    if ( this.anchorBottomSide.length > 0 ) {
      return true;
    }
    return false;
  };
  isSurface () {
    if ( this.isOverlay ) {
      return true;
    }
    if ( this.tagName == "popover" ) {
      return true;
    }
    return false;
  };
  arrowFillColor () {
    let out = EVGColor.noColor();
    if ( this.fillColor.isSet ) {
      const f = this.fillColor;
      out = f;
      return out;
    }
    if ( this.strokeColor.isSet ) {
      const st = this.strokeColor;
      out = st;
    }
    return out;
  };
  drawsPath () {
    if ( this.tagName == "path" ) {
      return true;
    }
    if ( this.tagName == "Path" ) {
      return true;
    }
    if ( this.tagName == "connector" ) {
      return true;
    }
    if ( this.tagName == "svg" ) {
      return true;
    }
    if ( this.tagName == "Svg" ) {
      return true;
    }
    return false;
  };
  hasAbsolutePosition () {
    if ( this.position == "fixed" ) {
      return true;
    }
    if ( this.isSurface() ) {
      return true;
    }
    if ( this.display == "none" ) {
      return true;
    }
    if ( this.tagName == "layer" || this.tagName == "Layer" ) {
      return true;
    }
    if ( this.tagName == "connector" ) {
      return true;
    }
    if ( this.hasAnchorInsets() ) {
      return true;
    }
    if ( this.left.isSet ) {
      return true;
    }
    if ( this.top.isSet ) {
      return true;
    }
    if ( this.right.isSet ) {
      return true;
    }
    if ( this.bottom.isSet ) {
      return true;
    }
    if ( this.x.isSet ) {
      return true;
    }
    if ( this.y.isSet ) {
      return true;
    }
    return false;
  };
  resolveBookFormat () {
    let w = 595.0;
    let h = 842.0;
    if ( this.format == "a4" ) {
      w = 595.0;
      h = 842.0;
    }
    if ( this.format == "letter" ) {
      w = 612.0;
      h = 792.0;
    }
    if ( this.format == "trade-5x8" ) {
      w = 360.0;
      h = 576.0;
    }
    if ( this.format == "trade-6x9" ) {
      w = 432.0;
      h = 648.0;
    }
    if ( this.format == "trade-8x10" ) {
      w = 576.0;
      h = 720.0;
    }
    if ( this.format == "mini-square" ) {
      w = 360.0;
      h = 360.0;
    }
    if ( this.format == "small-square" ) {
      w = 504.0;
      h = 504.0;
    }
    if ( this.format == "standard-portrait" ) {
      w = 576.0;
      h = 720.0;
    }
    if ( this.format == "standard-landscape" ) {
      w = 720.0;
      h = 576.0;
    }
    if ( this.format == "large-landscape" ) {
      w = 936.0;
      h = 792.0;
    }
    if ( this.format == "large-square" ) {
      w = 864.0;
      h = 864.0;
    }
    if ( this.format == "magazine" ) {
      w = 612.0;
      h = 792.0;
    }
    if ( this.orientation == "landscape" ) {
      if ( w < h ) {
        const temp = w;
        w = h;
        h = temp;
      }
    }
    if ( this.orientation == "portrait" ) {
      if ( w > h ) {
        const temp_1 = w;
        w = h;
        h = temp_1;
      }
    }
    if ( this.pageWidth > 0.0 ) {
      w = this.pageWidth;
    }
    if ( this.pageHeight > 0.0 ) {
      h = this.pageHeight;
    }
    this.pageWidth = w;
    this.pageHeight = h;
  };
  effectiveHref () {
    if ( this.href.length > 0 ) {
      return this.href;
    }
    let p = this.parent;
    let guard = 0;
    while (((typeof(p) !== "undefined" && p != null ) ) && guard < 4096) {
      const up = p;
      if ( up.href.length > 0 ) {
        return up.href;
      }
      p = up.parent;
      guard = guard + 1;
    };
    return "";
  };
  effectiveFontFamily () {
    if ( this.fontWeight == "bold" ) {
      return this.fontFamily + "-Bold";
    }
    return this.fontFamily;
  };
  effectiveBorderWidthPx () {
    if ( this.box.borderWidthPx > 0.0 ) {
      return this.box.borderWidthPx;
    }
    if ( typeof(this.borderWidth) != "undefined" ) {
      if ( this.borderWidth.isSet ) {
        return this.borderWidth.pixels;
      }
    }
    return 0.0;
  };
  effectiveBorderColor () {
    if ( typeof(this.box.borderColor) != "undefined" ) {
      const bc = this.box.borderColor;
      if ( bc.isSet ) {
        return bc;
      }
    }
    if ( typeof(this.borderColor) != "undefined" ) {
      const ec = this.borderColor;
      if ( ec.isSet ) {
        return ec;
      }
    }
    return EVGColor.black();
  };
  hasBorder () {
    if ( this.effectiveBorderWidthPx() <= 0.0 ) {
      return false;
    }
    return true;
  };
  effectiveEmojiColor () {
    if ( this.emojiColor.isSet ) {
      return this.emojiColor;
    }
    return this.color;
  };
  inheritProperties (parentEl) {
    if ( this.fontFamily == "Noto Sans" ) {
      this.fontFamily = parentEl.fontFamily;
    }
    if ( this.color.isSet == false ) {
      this.color = parentEl.color;
    }
    if ( this.emojiColor.isSet == false ) {
      this.emojiColor = parentEl.emojiColor;
    }
    if ( this.cursor.length == 0 ) {
      this.cursor = parentEl.cursor;
    }
    if ( this.whiteSpace == "normal" ) {
      this.whiteSpace = parentEl.whiteSpace;
    }
    this.fontSizeBase = parentEl.inheritedFontSize;
    this.rootFontSize = parentEl.rootFontSize;
    if ( this.viewportRoot == false ) {
      this.viewportW = parentEl.viewportW;
      this.viewportH = parentEl.viewportH;
      this.viewportX = parentEl.viewportX;
      this.viewportY = parentEl.viewportY;
    }
    this.applyOwnFontSize();
    this.applyOwnDirection(parentEl.resolvedRtl);
  };
  applyOwnDirection (inherited) {
    this.resolvedRtl = inherited;
    if ( this.textDir == "rtl" ) {
      this.resolvedRtl = true;
    }
    if ( this.textDir == "ltr" ) {
      this.resolvedRtl = false;
    }
  };
  applyOwnFontSize () {
    let authored = this.fontSize.isSet;
    if ( this.fontSizeInherited ) {
      authored = false;
    }
    if ( authored ) {
      this.fontSize.setContext(
        this.rootFontSize,
        this.viewportW,
        this.viewportH
      );
      this.fontSize.resolve(this.fontSizeBase, this.fontSizeBase);
      this.inheritedFontSize = this.fontSize.pixels;
    } else {
      this.inheritedFontSize = this.fontSizeBase;
      this.fontSize = EVGUnit.px(this.fontSizeBase);
      this.fontSizeInherited = true;
    }
  };
  resolveUnits (parentWidth, parentHeight) {
    if ( this.unitsResolved ) {
      return;
    }
    this.unitsResolved = true;
    const fs = this.inheritedFontSize;
    const rfs = this.rootFontSize;
    const vpw = this.viewportW;
    const vph = this.viewportH;
    this.width.setContext(rfs, vpw, vph);
    this.height.setContext(rfs, vpw, vph);
    this.flexBasis.setContext(rfs, vpw, vph);
    this.minWidth.setContext(rfs, vpw, vph);
    this.minHeight.setContext(rfs, vpw, vph);
    this.maxWidth.setContext(rfs, vpw, vph);
    this.maxHeight.setContext(rfs, vpw, vph);
    this.left.setContext(rfs, vpw, vph);
    this.top.setContext(rfs, vpw, vph);
    this.right.setContext(rfs, vpw, vph);
    this.bottom.setContext(rfs, vpw, vph);
    this.x.setContext(rfs, vpw, vph);
    this.y.setContext(rfs, vpw, vph);
    this.shadowRadius.setContext(rfs, vpw, vph);
    this.shadowOffsetX.setContext(rfs, vpw, vph);
    this.shadowOffsetY.setContext(rfs, vpw, vph);
    this.width.resolveWithHeight(parentWidth, parentHeight, fs);
    this.height.resolveForHeight(parentWidth, parentHeight, fs);
    this.flexBasis.resolve(parentWidth, fs);
    this.minWidth.resolve(parentWidth, fs);
    this.minHeight.resolve(parentHeight, fs);
    this.maxWidth.resolve(parentWidth, fs);
    this.maxHeight.resolve(parentHeight, fs);
    this.left.resolve(parentWidth, fs);
    this.top.resolve(parentHeight, fs);
    this.right.resolve(parentWidth, fs);
    this.bottom.resolve(parentHeight, fs);
    this.x.resolve(parentWidth, fs);
    this.y.resolve(parentHeight, fs);
    this.box.resolveUnits(parentWidth, parentHeight, fs, rfs, vpw, vph);
    this.shadowRadius.resolve(parentWidth, fs);
    this.shadowOffsetX.resolve(parentWidth, fs);
    this.shadowOffsetY.resolve(parentHeight, fs);
    this.isAbsolute = this.hasAbsolutePosition();
  };
  applyTransform (value) {
    this.transformSpec = value.trim();
    this.rotate = 0.0;
    this.scale = 1.0;
    this.flipY = false;
    this.translateX = 0.0;
    this.translateY = 0.0;
    if ( this.transformSpec == "none" || this.transformSpec.length == 0 ) {
      return;
    }
    const parts = EVGElement.splitWords(this.transformSpec);
    let a = 0.0;
    let sc = 1.0;
    let flip = false;
    let tx = 0.0;
    let ty = 0.0;
    let i = 0;
    while (i < parts.length) {
      const one = parts[i].trim();
      let b = 0.0;
      let s2 = 1.0;
      let f2 = false;
      let ux = 0.0;
      let uy = 0.0;
      const args = EVGElement.callArgs(one, "rotate");
      if ( args.length > 0 ) {
        b = EVGElement.parseAngleDeg(args);
      } else {
        const sargs = EVGElement.callArgs(one, "scale");
        if ( sargs.length > 0 ) {
          const nums = EVGElement.numberList(sargs);
          if ( nums.length > 0 ) {
            s2 = nums[0];
          }
          if ( nums.length > 1 ) {
            if ( nums[0] * nums[1] < 0.0 ) {
              f2 = true;
            }
          }
        } else {
          const targs = EVGElement.callArgs(one, "translate");
          if ( targs.length > 0 ) {
            const tn = EVGElement.numberList(targs);
            if ( tn.length > 0 ) {
              ux = tn[0];
            }
            if ( tn.length > 1 ) {
              uy = tn[1];
            }
          } else {
            const xargs = EVGElement.callArgs(one, "translateX");
            if ( xargs.length > 0 ) {
              const xn = EVGElement.numberList(xargs);
              if ( xn.length > 0 ) {
                ux = xn[0];
              }
            } else {
              const yargs = EVGElement.callArgs(one, "translateY");
              if ( yargs.length > 0 ) {
                const yn = EVGElement.numberList(yargs);
                if ( yn.length > 0 ) {
                  uy = yn[0];
                }
              }
            }
          }
        }
      }
      const rad = (a * 3.14159265358979) / 180.0;
      const cs = Math.cos(rad);
      const sn = Math.sin(rad);
      let uyf = uy;
      let bf = b;
      if ( flip ) {
        uyf = 0.0 - uy;
        bf = 0.0 - b;
      }
      tx = tx + sc * (ux * cs - uyf * sn);
      ty = ty + sc * (ux * sn + uyf * cs);
      a = a + bf;
      sc = sc * s2;
      if ( f2 ) {
        flip = flip == false;
      }
      i = i + 1;
    };
    this.rotate = a;
    this.scale = sc;
    this.flipY = flip;
    this.translateX = tx;
    this.translateY = ty;
  };
  applyTransformOrigin (value) {
    this.transformOriginSpec = value.trim();
    const words = EVGElement.splitWords(this.transformOriginSpec);
    const n = words.length;
    if ( n == 0 ) {
      this.transformOriginX = new EVGUnit();
      this.transformOriginY = new EVGUnit();
      return;
    }
    const first = words[0].trim();
    if ( n == 1 ) {
      if ( EVGElement.isYKeyword(first) ) {
        this.transformOriginX = EVGUnit.percent(50.0);
        this.transformOriginY = EVGElement.originUnit(first);
      } else {
        this.transformOriginX = EVGElement.originUnit(first);
        this.transformOriginY = EVGUnit.percent(50.0);
      }
      return;
    }
    const second = words[1].trim();
    let swap = false;
    if ( EVGElement.isYKeyword(first) ) {
      swap = true;
    }
    if ( EVGElement.isXKeyword(second) ) {
      swap = true;
    }
    if ( swap ) {
      this.transformOriginX = EVGElement.originUnit(second);
      this.transformOriginY = EVGElement.originUnit(first);
    } else {
      this.transformOriginX = EVGElement.originUnit(first);
      this.transformOriginY = EVGElement.originUnit(second);
    }
  };
  markCss (name) {
    const prop = EVGElement.toKebab(name);
    if ( this.fromCss(prop) == false ) {
      this.cssProps.push(prop);
    }
  };
  fromCss (name) {
    if ( this.cssProps.length == 0 ) {
      return false;
    }
    const prop = EVGElement.toKebab(name);
    let i = 0;
    while (i < this.cssProps.length) {
      if ( this.cssProps[i] == prop ) {
        return true;
      }
      i = i + 1;
    };
    return false;
  };
  clearCssMarks () {
    let empty = [];
    this.cssProps = empty;
  };
  markInline (name) {
    const prop = EVGElement.toKebab(name);
    if ( this.hasInline(prop) == false ) {
      this.inlineProps.push(prop);
    }
  };
  unmarkInline (name) {
    const prop = EVGElement.toKebab(name);
    let kept = [];
    let i = 0;
    while (i < this.inlineProps.length) {
      const cur = this.inlineProps[i];
      if ( cur != prop ) {
        kept.push(cur);
      }
      i = i + 1;
    };
    this.inlineProps = kept;
  };
  hasInline (name) {
    if ( this.inlineProps.length == 0 ) {
      return false;
    }
    const prop = EVGElement.toKebab(name);
    let i = 0;
    while (i < this.inlineProps.length) {
      if ( this.inlineProps[i] == prop ) {
        return true;
      }
      i = i + 1;
    };
    return false;
  };
  setFlexShorthand (value) {
    const parts = EVGElement.splitSpaces(value);
    const n = parts.length;
    if ( n == 0 ) {
      return;
    }
    const first = parts[0];
    const growVal = isNaN( parseFloat(first) ) ? undefined : parseFloat(first);
    if ( EVGElement.isPlainNumber(first) ) {
      this.flex = growVal;
      this.flexBasis = EVGUnit.px(0.0);
      if ( n >= 2 ) {
        const shrinkVal = isNaN( parseFloat(parts[1]) ) ? undefined : parseFloat(parts[1]);
        if ( typeof(shrinkVal) != "undefined" ) {
          this.flexShrink = shrinkVal;
        }
      }
      if ( n >= 3 ) {
        this.flexBasis = EVGUnit.parse(parts[2]);
      }
    } else {
      this.flexBasis = EVGUnit.parse(first);
      this.flex = 1.0;
    }
  };
  adoptFrom (other) {
    this.id = other.id;
    this.key = other.key;
    this.href = other.href;
    this.tagName = other.tagName;
    this.elementType = other.elementType;
    this.format = other.format;
    this.orientation = other.orientation;
    this.pageWidth = other.pageWidth;
    this.pageHeight = other.pageHeight;
    this.width = other.width;
    this.height = other.height;
    this.minWidth = other.minWidth;
    this.minHeight = other.minHeight;
    this.maxWidth = other.maxWidth;
    this.maxHeight = other.maxHeight;
    this.left = other.left;
    this.top = other.top;
    this.right = other.right;
    this.bottom = other.bottom;
    this.x = other.x;
    this.y = other.y;
    this.box = other.box;
    this.backgroundColor = other.backgroundColor;
    this.opacity = other.opacity;
    this.backdropBlur = other.backdropBlur;
    this.gradientSet = other.gradientSet;
    this.gradientFrom = other.gradientFrom;
    this.gradientTo = other.gradientTo;
    this.gradientDir = other.gradientDir;
    this.absPosSet = other.absPosSet;
    this.absX = other.absX;
    this.absY = other.absY;
    this.glowIntensity = other.glowIntensity;
    this.bgImageSet = other.bgImageSet;
    this.bgImagePath = other.bgImagePath;
    this.textDir = other.textDir;
    this.resolvedRtl = other.resolvedRtl;
    this.direction = other.direction;
    this.align = other.align;
    this.verticalAlign = other.verticalAlign;
    this.isInline = other.isInline;
    this.lineBreak = other.lineBreak;
    this.overflow = other.overflow;
    this.cursor = other.cursor;
    this.surfaceEffect = other.surfaceEffect;
    this.rippleSpeed = other.rippleSpeed;
    this.rippleWidth = other.rippleWidth;
    this.rippleStrength = other.rippleStrength;
    this.rippleDecay = other.rippleDecay;
    this.rippleHighlight = other.rippleHighlight;
    this.rippleRings = other.rippleRings;
    this.rippleStagger = other.rippleStagger;
    this.rippleFalloff = other.rippleFalloff;
    this.rippleShine = other.rippleShine;
    this.rippleGloss = other.rippleGloss;
    this.rippleBump = other.rippleBump;
    this.rippleLightX = other.rippleLightX;
    this.rippleLightY = other.rippleLightY;
    this.rippleLightZ = other.rippleLightZ;
    this.rippleXs = other.rippleXs;
    this.rippleYs = other.rippleYs;
    this.rippleAges = other.rippleAges;
    this.effectTrigger = other.effectTrigger;
    this.fxNames = other.fxNames;
    this.fxValues = other.fxValues;
    this.documentCss = other.documentCss;
    this.cssProps = other.cssProps;
    this.scrollTop = other.scrollTop;
    this.scrollLeft = other.scrollLeft;
    this.scrollWidth = other.scrollWidth;
    this.scrollHeight = other.scrollHeight;
    this.fontSize = other.fontSize;
    this.fontSizeInherited = other.fontSizeInherited;
    this.fontSizeBase = other.fontSizeBase;
    this.rootFontSize = other.rootFontSize;
    this.viewportW = other.viewportW;
    this.viewportH = other.viewportH;
    this.viewportRoot = other.viewportRoot;
    this.viewportX = other.viewportX;
    this.viewportY = other.viewportY;
    this.fontFamily = other.fontFamily;
    this.fontWeight = other.fontWeight;
    this.letterSpacing = other.letterSpacing;
    this.paragraphSpacing = other.paragraphSpacing;
    this.strokeLineCap = other.strokeLineCap;
    this.strokeLineJoin = other.strokeLineJoin;
    this.lineHeight = other.lineHeight;
    this.lineHeightUnit = other.lineHeightUnit;
    this.textAlign = other.textAlign;
    this.textShiftY = other.textShiftY;
    this.whiteSpace = other.whiteSpace;
    this.color = other.color;
    this.emojiColor = other.emojiColor;
    this.textContent = other.textContent;
    this.display = other.display;
    this.flex = other.flex;
    this.flexShrink = other.flexShrink;
    this.flexBasis = other.flexBasis;
    this.flexDirection = other.flexDirection;
    this.justifyContent = other.justifyContent;
    this.alignItems = other.alignItems;
    this.alignSelf = other.alignSelf;
    this.alignContent = other.alignContent;
    this.flexWrap = other.flexWrap;
    this.gap = other.gap;
    this.rowGap = other.rowGap;
    this.columnGap = other.columnGap;
    this.gridTemplateColumns = other.gridTemplateColumns;
    this.gridTemplateRows = other.gridTemplateRows;
    this.subgridColumnSizes = other.subgridColumnSizes;
    this.subgridRowSizes = other.subgridRowSizes;
    this.computedRowSizes = other.computedRowSizes;
    this.subgridPending = other.subgridPending;
    this.gridTemplateAreas = other.gridTemplateAreas;
    this.gridAutoFlow = other.gridAutoFlow;
    this.fullBleed = other.fullBleed;
    this.gridArea = other.gridArea;
    this.gridColumn = other.gridColumn;
    this.gridRow = other.gridRow;
    this.position = other.position;
    this.marginTop = other.marginTop;
    this.marginRight = other.marginRight;
    this.marginBottom = other.marginBottom;
    this.marginLeft = other.marginLeft;
    this.paddingTop = other.paddingTop;
    this.paddingRight = other.paddingRight;
    this.paddingBottom = other.paddingBottom;
    this.paddingLeft = other.paddingLeft;
    this.borderWidth = other.borderWidth;
    this.borderTopWidth = other.borderTopWidth;
    this.borderRightWidth = other.borderRightWidth;
    this.borderBottomWidth = other.borderBottomWidth;
    this.borderLeftWidth = other.borderLeftWidth;
    this.borderColor = other.borderColor;
    this.src = other.src;
    this.alt = other.alt;
    this.preserveAspectRatio = other.preserveAspectRatio;
    this.imageViewBox = other.imageViewBox;
    this.imageViewBoxX = other.imageViewBoxX;
    this.imageViewBoxY = other.imageViewBoxY;
    this.imageViewBoxW = other.imageViewBoxW;
    this.imageViewBoxH = other.imageViewBoxH;
    this.imageViewBoxSet = other.imageViewBoxSet;
    this.imageOffsetX = other.imageOffsetX;
    this.imageOffsetY = other.imageOffsetY;
    this.objectFit = other.objectFit;
    this.sourceWidth = other.sourceWidth;
    this.sourceHeight = other.sourceHeight;
    this.svgPath = other.svgPath;
    this.svgSource = other.svgSource;
    this.svgDoc = other.svgDoc;
    this.svgDocKey = other.svgDocKey;
    this.appliedScrollTop = other.appliedScrollTop;
    this.appliedScrollLeft = other.appliedScrollLeft;
    this.paintLeft = other.paintLeft;
    this.paintTop = other.paintTop;
    this.paintRight = other.paintRight;
    this.paintBottom = other.paintBottom;
    this.paintUnbounded = other.paintUnbounded;
    this.paintHasEffect = other.paintHasEffect;
    this.shiftDx = other.shiftDx;
    this.shiftDy = other.shiftDy;
    this.keepLayout = other.keepLayout;
    this.hasOverlayBelow = other.hasOverlayBelow;
    this.overlayScanned = other.overlayScanned;
    this.hasLayout = other.hasLayout;
    this.layoutClean = other.layoutClean;
    this.layoutSkipped = other.layoutSkipped;
    this.kidOffX = other.kidOffX;
    this.kidOffY = other.kidOffY;
    this.boundsFresh = other.boundsFresh;
    this.lastParentW = other.lastParentW;
    this.lastParentH = other.lastParentH;
    this.lastFlex = other.lastFlex;
    this.lastFlexW = other.lastFlexW;
    this.hasIntrinsicMin = other.hasIntrinsicMin;
    this.hasIntrinsicMax = other.hasIntrinsicMax;
    this.intrinsicMin = other.intrinsicMin;
    this.intrinsicMax = other.intrinsicMax;
    this.paintClean = other.paintClean;
    this.paintStamp = this.paintStamp + 1;
    this.scrollbarWidth = other.scrollbarWidth;
    this.scrollbarThumb = other.scrollbarThumb;
    this.scrollbarTrack = other.scrollbarTrack;
    this.scrollbarLabel = other.scrollbarLabel;
    this.viewBox = other.viewBox;
    this.fillColor = other.fillColor;
    this.strokeColor = other.strokeColor;
    this.strokeWidth = other.strokeWidth;
    this.fillRule = other.fillRule;
    this.strokeDashArray = other.strokeDashArray;
    this.strokeDashOffset = other.strokeDashOffset;
    this.anchorName = other.anchorName;
    this.connectorFrom = other.connectorFrom;
    this.connectorTo = other.connectorTo;
    this.connectorFromSide = other.connectorFromSide;
    this.connectorToSide = other.connectorToSide;
    this.connectorRouting = other.connectorRouting;
    this.connectorFromOffset = other.connectorFromOffset;
    this.connectorToOffset = other.connectorToOffset;
    this.arrowStart = other.arrowStart;
    this.arrowEnd = other.arrowEnd;
    this.arrowSize = other.arrowSize;
    this.arrowPath = other.arrowPath;
    this.connectorResolved = other.connectorResolved;
    this.clipPath = other.clipPath;
    this.className = other.className;
    this.theme = other.theme;
    this.inlineProps = other.inlineProps;
    this.imageQuality = other.imageQuality;
    this.maxImageSize = other.maxImageSize;
    this.rotate = other.rotate;
    this.scale = other.scale;
    this.flipY = other.flipY;
    this.translateX = other.translateX;
    this.translateY = other.translateY;
    this.transformSpec = other.transformSpec;
    this.transformOriginX = other.transformOriginX;
    this.transformOriginY = other.transformOriginY;
    this.transformOriginSpec = other.transformOriginSpec;
    this.shadowRadius = other.shadowRadius;
    this.shadowColor = other.shadowColor;
    this.shadowOffsetX = other.shadowOffsetX;
    this.shadowOffsetY = other.shadowOffsetY;
    this.backgroundGradient = other.backgroundGradient;
    this.gradient = other.gradient;
    this.calculatedX = other.calculatedX;
    this.calculatedY = other.calculatedY;
    this.calculatedWidth = other.calculatedWidth;
    this.calculatedHeight = other.calculatedHeight;
    this.calculatedInnerWidth = other.calculatedInnerWidth;
    this.calculatedInnerHeight = other.calculatedInnerHeight;
    this.calculatedFlexWidth = other.calculatedFlexWidth;
    this.hasFlexWidth = other.hasFlexWidth;
    this.calculatedFlexHeight = other.calculatedFlexHeight;
    this.calculatedBaseline = other.calculatedBaseline;
    this.calculatedDescent = other.calculatedDescent;
    this.hasBaseline = other.hasBaseline;
    this.hasDefiniteHeight = other.hasDefiniteHeight;
    this.calculatedPage = other.calculatedPage;
    this.isAbsolute = other.isAbsolute;
    this.isOverlay = other.isOverlay;
    this.positionAnchor = other.positionAnchor;
    this.positionTryFallbacks = other.positionTryFallbacks;
    this.positionTryOrder = other.positionTryOrder;
    this.presentation = other.presentation;
    this.sheetBelow = other.sheetBelow;
    this.fitViewport = other.fitViewport;
    this.anchorLeftSide = other.anchorLeftSide;
    this.anchorLeftOffset = other.anchorLeftOffset;
    this.anchorTopSide = other.anchorTopSide;
    this.anchorTopOffset = other.anchorTopOffset;
    this.anchorRightSide = other.anchorRightSide;
    this.anchorRightOffset = other.anchorRightOffset;
    this.anchorBottomSide = other.anchorBottomSide;
    this.anchorBottomOffset = other.anchorBottomOffset;
    this.overlayPlacedAlign = other.overlayPlacedAlign;
    this.overlayPlacedPresentation = other.overlayPlacedPresentation;
    this.overlayClamped = other.overlayClamped;
    this.overlayAnchor = other.overlayAnchor;
    this.isOverlayAnchor = other.isOverlayAnchor;
    this.overlaySide = other.overlaySide;
    this.overlayAlign = other.overlayAlign;
    this.overlayGap = other.overlayGap;
    this.overlayX = other.overlayX;
    this.overlayY = other.overlayY;
    this.overlayPlacedSide = other.overlayPlacedSide;
    this.isHovered = other.isHovered;
    this.isFocused = other.isFocused;
    this.isPressed = other.isPressed;
    this.transitionSpec = other.transitionSpec;
    this.role = other.role;
    this.a11yLabel = other.a11yLabel;
    this.a11yValue = other.a11yValue;
    this.a11yRequired = other.a11yRequired;
    this.a11yInvalid = other.a11yInvalid;
    this.a11yReadOnly = other.a11yReadOnly;
    this.a11yRoleDescription = other.a11yRoleDescription;
    this.a11yDescription = other.a11yDescription;
    this.a11yHasPopup = other.a11yHasPopup;
    this.a11yRowCount = other.a11yRowCount;
    this.a11yRowIndex = other.a11yRowIndex;
    this.a11yHidden = other.a11yHidden;
    this.a11yModal = other.a11yModal;
    this.a11ySorted = other.a11ySorted;
    this.a11yOrientation = other.a11yOrientation;
    this.a11yCurrent = other.a11yCurrent;
    this.a11yHasValue = other.a11yHasValue;
    this.a11yValueNow = other.a11yValueNow;
    this.a11yHasRange = other.a11yHasRange;
    this.a11yValueMin = other.a11yValueMin;
    this.a11yValueMax = other.a11yValueMax;
    this.a11yChecked = other.a11yChecked;
    this.a11yPressed = other.a11yPressed;
    this.a11yExpanded = other.a11yExpanded;
    this.a11ySelected = other.a11ySelected;
    this.a11yDisabled = other.a11yDisabled;
    this.a11yFocusable = other.a11yFocusable;
    this.a11yPosInSet = other.a11yPosInSet;
    this.a11ySetSize = other.a11ySetSize;
    this.a11yLevel = other.a11yLevel;
    this.styleClass = other.styleClass;
    this.styleTheme = other.styleTheme;
    this.styleBits = other.styleBits;
    this.styleGen = other.styleGen;
    this.styleSlot = other.styleSlot;
    this.styleKids = other.styleKids;
    this.inspectSlot = other.inspectSlot;
    this.isLayoutComplete = other.isLayoutComplete;
    this.unitsResolved = other.unitsResolved;
    this.hasReturn = other.hasReturn;
    this.hasBreak = other.hasBreak;
    this.hasContinue = other.hasContinue;
    this.inheritedFontSize = other.inheritedFontSize;
  };
  setScrollbarColor (value) {
    let parts = [];
    let cur = "";
    let depth = 0;
    let i = 0;
    const n = value.length;
    while (i < n) {
      const ch = value.substring(i, i + 1 );
      if ( ch == "(" ) {
        depth = depth + 1;
      }
      if ( ch == ")" ) {
        depth = depth - 1;
      }
      if ( (ch == " " || ch == "\t") && depth == 0 ) {
        if ( cur.length > 0 ) {
          parts.push(cur);
          cur = "";
        }
      } else {
        cur = cur + ch;
      }
      i = i + 1;
    };
    if ( cur.length > 0 ) {
      parts.push(cur);
    }
    this.scrollbarThumb = EVGColor.noColor();
    this.scrollbarTrack = EVGColor.noColor();
    if ( parts.length > 0 ) {
      const t = parts[0];
      if ( t != "auto" ) {
        this.scrollbarThumb = EVGColor.parse(t);
      }
    }
    if ( parts.length > 1 ) {
      const tr = parts[1];
      if ( tr != "auto" ) {
        this.scrollbarTrack = EVGColor.parse(tr);
      }
    }
  };
  unitOf (name, value) {
    const u = EVGUnit.parse(value);
    if ( u.isSet == false && u.unitType != 6 ) {
      if ( EVGReject.isAbsent(value) == false ) {
        EVGReject.note("unsupported length", name, value);
      }
    }
    return u;
  };
  setFx (key, value) {
    let i = 0;
    while (i < this.fxNames.length) {
      if ( this.fxNames[i] == key ) {
        this.fxValues[i] = value;
        return;
      }
      i = i + 1;
    };
    this.fxNames.push(key);
    this.fxValues.push(value);
  };
  fxValue (key, fallback) {
    let i = 0;
    while (i < this.fxNames.length) {
      if ( this.fxNames[i] == key ) {
        return this.fxValues[i];
      }
      i = i + 1;
    };
    return fallback;
  };
  setAttribute (name, value) {
    if ( name == "className" || name == "class-name" ) {
      this.className = value;
      return;
    }
    if ( name == "theme" ) {
      this.theme = value;
      return;
    }
    if ( name == "id" ) {
      this.id = value;
      return;
    }
    if ( name == "src" ) {
      this.src = value;
      return;
    }
    if ( name == "alt" ) {
      this.alt = value;
      return;
    }
    if ( name == "href" ) {
      this.href = value;
      return;
    }
    if ( name == "key" ) {
      this.key = value;
      return;
    }
    if ( name == "format" ) {
      this.format = value.toLowerCase();
      return;
    }
    if ( name == "orientation" ) {
      this.orientation = value.toLowerCase();
      return;
    }
    if ( name == "pageWidth" ) {
      const pw = isNaN( parseFloat(value) ) ? undefined : parseFloat(value);
      if ( typeof(pw) != "undefined" ) {
        this.pageWidth = pw;
      }
      return;
    }
    if ( name == "pageHeight" ) {
      const ph = isNaN( parseFloat(value) ) ? undefined : parseFloat(value);
      if ( typeof(ph) != "undefined" ) {
        this.pageHeight = ph;
      }
      return;
    }
    if ( name == "width" ) {
      this.width = this.unitOf(name, value);
      return;
    }
    if ( name == "height" ) {
      this.height = this.unitOf(name, value);
      return;
    }
    if ( name == "min-width" || name == "minWidth" ) {
      this.minWidth = this.unitOf(name, value);
      return;
    }
    if ( name == "min-height" || name == "minHeight" ) {
      this.minHeight = this.unitOf(name, value);
      return;
    }
    if ( name == "max-width" || name == "maxWidth" ) {
      this.maxWidth = this.unitOf(name, value);
      return;
    }
    if ( name == "max-height" || name == "maxHeight" ) {
      this.maxHeight = this.unitOf(name, value);
      return;
    }
    if ( name == "overlay" || name == "isOverlay" ) {
      this.isOverlay = EVGElement.truthy(value);
      return;
    }
    if ( name == "overlay-anchor-role" || name == "overlayAnchorRole" ) {
      this.isOverlayAnchor = EVGElement.truthy(value);
      return;
    }
    if ( name == "overlay-side" || name == "overlaySide" ) {
      this.overlaySide = value.trim();
      return;
    }
    if ( name == "overlay-align" || name == "overlayAlign" ) {
      this.overlayAlign = value.trim();
      return;
    }
    if ( name == "position-area" || name == "positionArea" ) {
      const pa = value.trim();
      const paSide = EVGElement.areaSide(pa);
      if ( paSide.length == 0 ) {
        EVGReject.note("unsupported value", "position-area", pa);
        return;
      }
      this.overlaySide = paSide;
      this.overlayAlign = EVGElement.areaAlign(pa);
      return;
    }
    if ( name == "position-anchor" || name == "positionAnchor" ) {
      this.positionAnchor = value.trim();
      if ( this.positionAnchor.length > 0 ) {
        this.isOverlay = true;
      }
      return;
    }
    if ( (name == "position-try-fallbacks" || name == "positionTryFallbacks") || name == "position-try" ) {
      this.positionTryFallbacks = value.trim();
      return;
    }
    if ( name == "position-try-order" || name == "positionTryOrder" ) {
      this.positionTryOrder = value.trim();
      return;
    }
    if ( name == "presentation" ) {
      const pr = value.trim();
      if ( ((pr == "anchored" || pr == "sheet") || pr == "fullscreen") == false ) {
        EVGReject.note("unsupported value", "presentation", pr);
        return;
      }
      this.presentation = pr;
      return;
    }
    if ( name == "sheet-below" || name == "sheetBelow" ) {
      const sb = this.unitOf(name, value);
      if ( sb.isSet ) {
        this.sheetBelow = sb.pixels;
      }
      return;
    }
    if ( name == "fit-viewport" || name == "fitViewport" ) {
      this.fitViewport = EVGElement.truthy(value);
      return;
    }
    if ( name == "overlay-gap" || name == "overlayGap" ) {
      const g = isNaN( parseFloat(value) ) ? undefined : parseFloat(value);
      if ( typeof(g) != "undefined" ) {
        this.overlayGap = g;
      }
      return;
    }
    if ( name == "transition" ) {
      this.transitionSpec = value.trim();
      return;
    }
    if ( name == "role" || name == "a11yRole" ) {
      this.role = value.trim();
      return;
    }
    if ( name == "a11yRequired" || name == "aria-required" ) {
      this.a11yRequired = value;
      return;
    }
    if ( name == "a11yInvalid" || name == "aria-invalid" ) {
      this.a11yInvalid = value;
      return;
    }
    if ( name == "a11yReadOnly" || name == "aria-readonly" ) {
      this.a11yReadOnly = value;
      return;
    }
    if ( name == "a11yValue" || name == "aria-valuetext" ) {
      this.a11yValue = value;
      return;
    }
    if ( name == "aria-label" || name == "a11yLabel" ) {
      this.a11yLabel = value;
      return;
    }
    if ( name == "aria-current" || name == "a11yCurrent" ) {
      this.a11yCurrent = value;
      return;
    }
    if ( name == "aria-orientation" || name == "a11yOrientation" ) {
      this.a11yOrientation = value.toLowerCase();
      return;
    }
    if ( name == "aria-sort" || name == "a11ySorted" ) {
      if ( value == "none" ) {
        this.a11ySorted = 1;
      }
      if ( value == "ascending" ) {
        this.a11ySorted = 2;
      }
      if ( value == "descending" ) {
        this.a11ySorted = 3;
      }
      return;
    }
    if ( name == "aria-hidden" || name == "a11yHidden" ) {
      this.a11yHidden = EVGElement.truthy(value);
      return;
    }
    if ( name == "aria-rowcount" || name == "a11yRowCount" ) {
      const rc = isNaN( parseInt(value) ) ? undefined : parseInt(value);
      this.a11yRowCount = 0;
      if ( typeof(rc) != "undefined" ) {
        this.a11yRowCount = rc;
      }
      return;
    }
    if ( name == "aria-rowindex" || name == "a11yRowIndex" ) {
      const ri = isNaN( parseInt(value) ) ? undefined : parseInt(value);
      this.a11yRowIndex = 0;
      if ( typeof(ri) != "undefined" ) {
        this.a11yRowIndex = ri;
      }
      return;
    }
    if ( name == "aria-haspopup" || name == "a11yHasPopup" ) {
      this.a11yHasPopup = value;
      return;
    }
    if ( name == "aria-describedby" || name == "a11yDescription" ) {
      this.a11yDescription = value;
      return;
    }
    if ( name == "aria-roledescription" || name == "a11yRoleDescription" ) {
      this.a11yRoleDescription = value;
      return;
    }
    if ( name == "aria-pressed" || name == "a11yPressed" ) {
      this.a11yPressed = EVGElement.triState(value);
      return;
    }
    if ( name == "aria-checked" || name == "a11yChecked" ) {
      this.a11yChecked = EVGElement.triState(value);
      return;
    }
    if ( name == "aria-expanded" || name == "a11yExpanded" ) {
      this.a11yExpanded = EVGElement.triState(value);
      return;
    }
    if ( name == "aria-selected" || name == "a11ySelected" ) {
      this.a11ySelected = EVGElement.triState(value);
      return;
    }
    if ( name == "aria-disabled" || name == "a11yDisabled" ) {
      this.a11yDisabled = EVGElement.truthy(value);
      return;
    }
    if ( name == "aria-focusable" || name == "a11yFocusable" ) {
      this.a11yFocusable = EVGElement.truthy(value);
      return;
    }
    if ( name == "left" ) {
      if ( EVGElement.mentionsAnchor(value) ) {
        this.anchorLeftSide = EVGElement.anchorFnSide(name, value);
        this.anchorLeftOffset = EVGElement.anchorFnOffset(value);
        return;
      }
      this.left = this.unitOf(name, value);
      return;
    }
    if ( name == "top" ) {
      if ( EVGElement.mentionsAnchor(value) ) {
        this.anchorTopSide = EVGElement.anchorFnSide(name, value);
        this.anchorTopOffset = EVGElement.anchorFnOffset(value);
        return;
      }
      this.top = this.unitOf(name, value);
      return;
    }
    if ( name == "right" ) {
      if ( EVGElement.mentionsAnchor(value) ) {
        this.anchorRightSide = EVGElement.anchorFnSide(name, value);
        this.anchorRightOffset = EVGElement.anchorFnOffset(value);
        return;
      }
      this.right = this.unitOf(name, value);
      return;
    }
    if ( name == "bottom" ) {
      if ( EVGElement.mentionsAnchor(value) ) {
        this.anchorBottomSide = EVGElement.anchorFnSide(name, value);
        this.anchorBottomOffset = EVGElement.anchorFnOffset(value);
        return;
      }
      this.bottom = this.unitOf(name, value);
      return;
    }
    if ( name == "x" ) {
      this.x = this.unitOf(name, value);
      return;
    }
    if ( name == "y" ) {
      this.y = this.unitOf(name, value);
      return;
    }
    if ( name == "margin" ) {
      const ms = EVGElement.boxSides(value, true);
      if ( ms.length == 4 ) {
        this.box.setMarginValues(ms[0], ms[1], ms[2], ms[3]);
      }
      return;
    }
    if ( name == "margin-left" || name == "marginLeft" ) {
      this.box.marginLeft = this.unitOf(name, value);
      return;
    }
    if ( name == "margin-right" || name == "marginRight" ) {
      this.box.marginRight = this.unitOf(name, value);
      return;
    }
    if ( name == "margin-top" || name == "marginTop" ) {
      this.box.marginTop = this.unitOf(name, value);
      return;
    }
    if ( name == "margin-bottom" || name == "marginBottom" ) {
      this.box.marginBottom = this.unitOf(name, value);
      return;
    }
    if ( name == "padding" ) {
      const ps = EVGElement.boxSides(value, false);
      if ( ps.length == 4 ) {
        this.box.setPaddingValues(ps[0], ps[1], ps[2], ps[3]);
      }
      return;
    }
    if ( name == "padding-left" || name == "paddingLeft" ) {
      this.box.paddingLeft = this.unitOf(name, value);
      return;
    }
    if ( name == "padding-right" || name == "paddingRight" ) {
      this.box.paddingRight = this.unitOf(name, value);
      return;
    }
    if ( name == "padding-top" || name == "paddingTop" ) {
      this.box.paddingTop = this.unitOf(name, value);
      return;
    }
    if ( name == "padding-bottom" || name == "paddingBottom" ) {
      this.box.paddingBottom = this.unitOf(name, value);
      return;
    }
    if ( name == "border" ) {
      const parts = EVGElement.splitWords(value);
      let i = 0;
      while (i < parts.length) {
        const tok = parts[i];
        if ( EVGElement.isBorderStyleWord(tok) ) {
          if ( tok == "none" ) {
            this.box.borderWidth = EVGUnit.px(0.0);
          }
        } else {
          if ( EVGElement.looksLikeColor(tok) ) {
            this.box.borderColor = EVGColor.parse(tok);
          } else {
            this.box.borderWidth = EVGUnit.parse(tok);
          }
        }
        i = i + 1;
      };
      return;
    }
    if ( name == "border-width" || name == "borderWidth" ) {
      this.box.borderWidth = this.unitOf(name, value);
      return;
    }
    if ( name == "border-color" || name == "borderColor" ) {
      this.box.borderColor = EVGColor.parse(value);
      return;
    }
    if ( name == "border-radius" || name == "borderRadius" ) {
      const parts_1 = EVGElement.splitWords(value);
      const n = parts_1.length;
      if ( n < 2 ) {
        this.box.borderRadius = this.unitOf(name, value);
        this.box.borderRadiusTL = EVGUnit.unset();
        this.box.borderRadiusTR = EVGUnit.unset();
        this.box.borderRadiusBR = EVGUnit.unset();
        this.box.borderRadiusBL = EVGUnit.unset();
        return;
      }
      const tl = parts_1[0];
      const tr = parts_1[1];
      let br = tl;
      let bl = tr;
      if ( n > 2 ) {
        br = parts_1[2];
      }
      if ( n > 3 ) {
        bl = parts_1[3];
      }
      this.box.borderRadiusTL = EVGUnit.parse(tl);
      this.box.borderRadiusTR = EVGUnit.parse(tr);
      this.box.borderRadiusBR = EVGUnit.parse(br);
      this.box.borderRadiusBL = EVGUnit.parse(bl);
      this.box.borderRadius = EVGUnit.parse(tl);
      return;
    }
    if ( name == "glow" ) {
      const gv = isNaN( parseFloat(value) ) ? undefined : parseFloat(value);
      this.glowIntensity = gv;
      return;
    }
    if ( name == "background-image" || name == "backgroundImage" ) {
      this.bgImageSet = true;
      this.bgImagePath = value;
      return;
    }
    if ( name == "gradient-from" || name == "gradientFrom" ) {
      this.gradientFrom = EVGColor.parse(value);
      this.gradientSet = true;
      return;
    }
    if ( name == "gradient-to" || name == "gradientTo" ) {
      this.gradientTo = EVGColor.parse(value);
      this.gradientSet = true;
      return;
    }
    if ( name == "gradient-dir" || name == "gradientDir" ) {
      const dv = isNaN( parseInt(value) ) ? undefined : parseInt(value);
      this.gradientDir = dv;
      return;
    }
    if ( name == "background-color" || name == "backgroundColor" ) {
      this.backgroundColor = EVGColor.parse(value);
      return;
    }
    if ( name == "background-gradient" || name == "backgroundGradient" ) {
      this.backgroundGradient = value;
      this.gradient = EVGGradient.parse(value);
      return;
    }
    if ( name == "background" ) {
      if ( value.includes("linear-gradient") || value.includes("radial-gradient") ) {
        this.backgroundGradient = value;
        this.gradient = EVGGradient.parse(value);
      } else {
        this.backgroundColor = EVGColor.parse(value);
      }
      return;
    }
    if ( name == "color" ) {
      this.color = EVGColor.parse(value);
      return;
    }
    if ( name == "emoji-color" ) {
      this.emojiColor = EVGColor.parse(value);
      return;
    }
    if ( name == "opacity" ) {
      const val = isNaN( parseFloat(value) ) ? undefined : parseFloat(value);
      this.opacity = val;
      return;
    }
    if ( name == "backdrop-filter" || name == "backdropFilter" ) {
      this.backdropBlur = EVGElement.blurRadiusOf(value);
      return;
    }
    if ( name == "object-fit" || name == "objectFit" ) {
      this.objectFit = value;
      return;
    }
    if ( name == "preserve-aspect-ratio" || name == "preserveAspectRatio" ) {
      this.preserveAspectRatio = value;
      return;
    }
    if ( name == "image-view-box" || name == "imageViewBox" ) {
      this.imageViewBox = value;
      this.imageViewBoxSet = EVGElement.parseViewBox(value, this);
      return;
    }
    if ( name == "image-offset-x" || name == "imageOffsetX" ) {
      this.imageOffsetX = this.unitOf(name, value);
      return;
    }
    if ( name == "image-offset-y" || name == "imageOffsetY" ) {
      this.imageOffsetY = this.unitOf(name, value);
      return;
    }
    if ( name == "direction" ) {
      if ( value == "rtl" || value == "ltr" ) {
        this.textDir = value;
        return;
      }
      this.direction = value;
      return;
    }
    if ( name == "align" ) {
      this.align = value;
      return;
    }
    if ( name == "vertical-align" || name == "verticalAlign" ) {
      this.verticalAlign = value;
      return;
    }
    if ( name == "inline" ) {
      this.isInline = value == "true";
      return;
    }
    if ( name == "line-break" || name == "lineBreak" ) {
      this.lineBreak = value == "true";
      return;
    }
    if ( name == "letter-spacing" || name == "letterSpacing" ) {
      if ( value == "normal" ) {
        this.letterSpacing = 0.0;
        return;
      }
      const lsu = this.unitOf(name, value);
      if ( lsu.isSet ) {
        this.letterSpacing = lsu.pixels;
      }
      return;
    }
    if ( name == "paragraph-spacing" || name == "paragraphSpacing" ) {
      const psu = this.unitOf(name, value);
      if ( psu.isSet ) {
        this.paragraphSpacing = psu.pixels;
      }
      return;
    }
    if ( name == "stroke-linecap" || name == "strokeLinecap" ) {
      this.strokeLineCap = value;
      return;
    }
    if ( name == "stroke-linejoin" || name == "strokeLinejoin" ) {
      this.strokeLineJoin = value;
      return;
    }
    if ( name == "overflow" ) {
      this.overflow = value;
      return;
    }
    if ( (name == "overflow-y" || name == "overflowY") || name == "overflow-x" ) {
      this.overflow = value.trim();
      return;
    }
    if ( name == "overflowX" ) {
      this.overflow = value.trim();
      return;
    }
    if ( name == "cursor" ) {
      this.cursor = value;
      return;
    }
    if ( name == "scrollbar-width" || name == "scrollbarWidth" ) {
      this.scrollbarWidth = value;
      return;
    }
    if ( name == "scrollbar-color" || name == "scrollbarColor" ) {
      this.setScrollbarColor(value);
      return;
    }
    if ( name == "evg-scrollbar-label" ) {
      this.scrollbarLabel = value;
      return;
    }
    if ( name == "evg-surface-effect" ) {
      this.surfaceEffect = value;
      return;
    }
    if ( name == "evg-effect-on" ) {
      this.effectTrigger = value;
      return;
    }
    if ( name.length > 7 ) {
      const head = name.substring(0, 7 );
      if ( head == "evg-fx-" ) {
        const key_1 = name.substring(7, name.length );
        this.setFx(key_1, EVGElement.numberOr(value, 0.0));
        return;
      }
    }
    if ( name == "evg-ripple-speed" ) {
      this.rippleSpeed = EVGElement.numberOr(value, this.rippleSpeed);
      return;
    }
    if ( name == "evg-ripple-width" ) {
      this.rippleWidth = EVGElement.numberOr(value, this.rippleWidth);
      return;
    }
    if ( name == "evg-ripple-strength" ) {
      this.rippleStrength = EVGElement.numberOr(value, this.rippleStrength);
      return;
    }
    if ( name == "evg-ripple-decay" ) {
      this.rippleDecay = EVGElement.numberOr(value, this.rippleDecay);
      return;
    }
    if ( name == "evg-ripple-highlight" ) {
      this.rippleHighlight = EVGElement.numberOr(value, this.rippleHighlight);
      return;
    }
    if ( name == "evg-ripple-rings" ) {
      this.rippleRings = EVGElement.numberOr(value, this.rippleRings);
      return;
    }
    if ( name == "evg-ripple-stagger" ) {
      this.rippleStagger = EVGElement.numberOr(value, this.rippleStagger);
      return;
    }
    if ( name == "evg-ripple-ring-falloff" ) {
      this.rippleFalloff = EVGElement.numberOr(value, this.rippleFalloff);
      return;
    }
    if ( name == "evg-ripple-shine" ) {
      this.rippleShine = EVGElement.numberOr(value, this.rippleShine);
      return;
    }
    if ( name == "evg-ripple-gloss" ) {
      this.rippleGloss = EVGElement.numberOr(value, this.rippleGloss);
      return;
    }
    if ( name == "evg-ripple-bump" ) {
      this.rippleBump = EVGElement.numberOr(value, this.rippleBump);
      return;
    }
    if ( name == "evg-ripple-light" ) {
      const lp = EVGElement.splitWords(value);
      if ( lp.length > 0 ) {
        this.rippleLightX = EVGElement.numberOr(lp[0], this.rippleLightX);
      }
      if ( lp.length > 1 ) {
        this.rippleLightY = EVGElement.numberOr(lp[1], this.rippleLightY);
      }
      if ( lp.length > 2 ) {
        this.rippleLightZ = EVGElement.numberOr(lp[2], this.rippleLightZ);
      }
      return;
    }
    if ( name == "scroll-top" || name == "scrollTop" ) {
      const st = isNaN( parseFloat(value) ) ? undefined : parseFloat(value);
      this.scrollTop = st;
      return;
    }
    if ( name == "scroll-left" || name == "scrollLeft" ) {
      const sl = isNaN( parseFloat(value) ) ? undefined : parseFloat(value);
      this.scrollLeft = sl;
      return;
    }
    if ( name == "display" ) {
      this.display = value;
      return;
    }
    if ( name == "flex-direction" || name == "flexDirection" ) {
      this.flexDirection = value;
      if ( value == "row-reverse" || value == "column-reverse" ) {
        EVGReject.note("unsupported value", name, value);
      }
      return;
    }
    if ( name == "flex-wrap" || name == "flexWrap" ) {
      this.flexWrap = value;
      return;
    }
    if ( name == "position" ) {
      const pv = value.trim();
      if ( pv == "fixed" ) {
        this.position = "fixed";
        return;
      }
      if ( pv == "absolute" ) {
        this.position = "absolute";
        return;
      }
      if ( (pv == "static" || pv == "relative") || pv == "sticky" ) {
        this.position = "relative";
        return;
      }
      return;
    }
    if ( name == "flex-grow" || name == "flexGrow" ) {
      const gv_1 = isNaN( parseFloat(value) ) ? undefined : parseFloat(value);
      if ( typeof(gv_1) != "undefined" ) {
        this.flex = gv_1;
      }
      return;
    }
    if ( name == "flex-shrink" || name == "flexShrink" ) {
      const sv = isNaN( parseFloat(value) ) ? undefined : parseFloat(value);
      if ( typeof(sv) != "undefined" ) {
        this.flexShrink = sv;
      }
      return;
    }
    if ( name == "flex-basis" || name == "flexBasis" ) {
      this.flexBasis = this.unitOf(name, value);
      return;
    }
    if ( name == "flex" ) {
      this.setFlexShorthand(value);
      return;
    }
    if ( name == "gap" ) {
      this.gap = this.unitOf(name, value);
      return;
    }
    if ( name == "row-gap" || name == "rowGap" ) {
      this.rowGap = this.unitOf(name, value);
      return;
    }
    if ( name == "column-gap" || name == "columnGap" ) {
      this.columnGap = this.unitOf(name, value);
      return;
    }
    if ( name == "grid-template-columns" || name == "gridTemplateColumns" ) {
      this.gridTemplateColumns = value;
      return;
    }
    if ( name == "grid-template-rows" || name == "gridTemplateRows" ) {
      this.gridTemplateRows = value;
      return;
    }
    if ( name == "grid-template-areas" || name == "gridTemplateAreas" ) {
      this.gridTemplateAreas = value;
      return;
    }
    if ( name == "grid-auto-flow" || name == "gridAutoFlow" ) {
      this.gridAutoFlow = value;
      return;
    }
    if ( name == "full-bleed" || name == "fullBleed" ) {
      this.fullBleed = value == "true" || value == "1";
      return;
    }
    if ( name == "grid-area" || name == "gridArea" ) {
      this.gridArea = value;
      return;
    }
    if ( name == "grid-column" || name == "gridColumn" ) {
      this.gridColumn = value;
      return;
    }
    if ( name == "grid-row" || name == "gridRow" ) {
      this.gridRow = value;
      return;
    }
    if ( name == "justify-content" || name == "justifyContent" ) {
      this.justifyContent = value;
      return;
    }
    if ( name == "align-content" || name == "alignContent" ) {
      this.alignContent = value;
      return;
    }
    if ( name == "align-self" || name == "alignSelf" ) {
      if ( value == "auto" ) {
        this.alignSelf = "";
      } else {
        this.alignSelf = value;
      }
      return;
    }
    if ( name == "align-items" || name == "alignItems" ) {
      this.alignItems = value;
      return;
    }
    if ( name == "font-size" || name == "fontSize" ) {
      this.fontSize = this.unitOf(name, value);
      this.fontSizeInherited = false;
      return;
    }
    if ( name == "font-family" || name == "fontFamily" ) {
      this.fontFamily = value;
      return;
    }
    if ( name == "font-weight" || name == "fontWeight" ) {
      this.fontWeight = value;
      return;
    }
    if ( name == "text-align" || name == "textAlign" ) {
      this.textAlign = value;
      return;
    }
    if ( name == "white-space" || name == "whiteSpace" ) {
      this.whiteSpace = value.trim();
      return;
    }
    if ( name == "line-height" || name == "lineHeight" ) {
      const t = value.trim();
      if ( t == "normal" ) {
        this.lineHeight = 0.0;
        this.lineHeightUnit = EVGUnit.unset();
        return;
      }
      if ( EVGUnit.isNumeric(t) ) {
        const val_1 = isNaN( parseFloat(t) ) ? undefined : parseFloat(t);
        if ( typeof(val_1) != "undefined" ) {
          this.lineHeight = val_1;
          this.lineHeightUnit = EVGUnit.unset();
        }
        return;
      }
      const u = EVGUnit.parse(t);
      if ( u.isSet ) {
        this.lineHeightUnit = u;
        this.lineHeight = 0.0;
      }
      return;
    }
    if ( name == "transform" ) {
      this.applyTransform(value);
      return;
    }
    if ( name == "transform-origin" || name == "transformOrigin" ) {
      this.applyTransformOrigin(value);
      return;
    }
    if ( name == "translate-x" || name == "translateX" ) {
      const tvx = isNaN( parseFloat(value) ) ? undefined : parseFloat(value);
      if ( typeof(tvx) != "undefined" ) {
        this.translateX = tvx;
      }
      return;
    }
    if ( name == "translate-y" || name == "translateY" ) {
      const tvy = isNaN( parseFloat(value) ) ? undefined : parseFloat(value);
      if ( typeof(tvy) != "undefined" ) {
        this.translateY = tvy;
      }
      return;
    }
    if ( name == "rotate" ) {
      const val_2 = isNaN( parseFloat(value) ) ? undefined : parseFloat(value);
      this.rotate = val_2;
      return;
    }
    if ( name == "scale" ) {
      const val_3 = isNaN( parseFloat(value) ) ? undefined : parseFloat(value);
      this.scale = val_3;
      return;
    }
    if ( name == "shadow-radius" || name == "shadowRadius" ) {
      this.shadowRadius = this.unitOf(name, value);
      return;
    }
    if ( name == "shadow-color" || name == "shadowColor" ) {
      this.shadowColor = EVGColor.parse(value);
      return;
    }
    if ( name == "shadow-offset-x" || name == "shadowOffsetX" ) {
      this.shadowOffsetX = this.unitOf(name, value);
      return;
    }
    if ( name == "shadow-offset-y" || name == "shadowOffsetY" ) {
      this.shadowOffsetY = this.unitOf(name, value);
      return;
    }
    if ( name == "clip-path" || name == "clipPath" ) {
      this.clipPath = value;
      return;
    }
    if ( (name == "d" || name == "svgPath") || name == "path" ) {
      this.svgPath = value;
      return;
    }
    if ( name == "imageQuality" ) {
      const val_4 = isNaN( parseInt(value) ) ? undefined : parseInt(value);
      if ( typeof(val_4) != "undefined" ) {
        this.imageQuality = val_4;
      }
      return;
    }
    if ( name == "maxImageSize" ) {
      const val_5 = isNaN( parseInt(value) ) ? undefined : parseInt(value);
      if ( typeof(val_5) != "undefined" ) {
        this.maxImageSize = val_5;
      }
      return;
    }
    if ( name == "anchor-name" || name == "anchorName" ) {
      this.anchorName = value.trim();
      return;
    }
    if ( name == "from" ) {
      this.connectorFrom = value.trim();
      return;
    }
    if ( name == "to" ) {
      this.connectorTo = value.trim();
      return;
    }
    if ( name == "from-side" || name == "fromSide" ) {
      this.connectorFromSide = value.trim();
      return;
    }
    if ( name == "to-side" || name == "toSide" ) {
      this.connectorToSide = value.trim();
      return;
    }
    if ( name == "routing" ) {
      this.connectorRouting = value.trim();
      return;
    }
    if ( name == "from-offset" || name == "fromOffset" ) {
      const fou = this.unitOf(name, value);
      if ( fou.isSet ) {
        this.connectorFromOffset = fou.pixels;
      }
      return;
    }
    if ( name == "to-offset" || name == "toOffset" ) {
      const tou = this.unitOf(name, value);
      if ( tou.isSet ) {
        this.connectorToOffset = tou.pixels;
      }
      return;
    }
    if ( name == "arrow-start" || name == "arrowStart" ) {
      this.arrowStart = value.trim();
      return;
    }
    if ( name == "arrow-end" || name == "arrowEnd" ) {
      this.arrowEnd = value.trim();
      return;
    }
    if ( name == "arrow-size" || name == "arrowSize" ) {
      const asu = this.unitOf(name, value);
      if ( asu.isSet ) {
        this.arrowSize = asu.pixels;
      }
      return;
    }
    if ( name == "d" || name == "svgPath" ) {
      this.svgPath = value;
      return;
    }
    if ( name == "svg" || name == "svgSource" ) {
      this.svgSource = value;
      return;
    }
    if ( name == "viewBox" || name == "view-box" ) {
      this.viewBox = value;
      return;
    }
    if ( name == "fill" ) {
      this.fillColor = EVGColor.parse(value);
      return;
    }
    if ( name == "stroke" ) {
      this.strokeColor = EVGColor.parse(value);
      return;
    }
    if ( name == "stroke-width" || name == "strokeWidth" ) {
      const val_6 = isNaN( parseFloat(value) ) ? undefined : parseFloat(value);
      if ( typeof(val_6) != "undefined" ) {
        this.strokeWidth = val_6;
      }
      return;
    }
    if ( name == "stroke-dasharray" || name == "strokeDasharray" ) {
      this.strokeDashArray = value;
      return;
    }
    if ( name == "stroke-dashoffset" || name == "strokeDashoffset" ) {
      const dv_1 = isNaN( parseFloat(value) ) ? undefined : parseFloat(value);
      if ( typeof(dv_1) != "undefined" ) {
        this.strokeDashOffset = dv_1;
      }
      return;
    }
    if ( name == "fill-rule" || name == "fillRule" ) {
      if ( value == "evenodd" ) {
        this.fillRule = "evenodd";
      } else {
        this.fillRule = "nonzero";
      }
      return;
    }
    if ( EVGElement.isHostProp(name) == false ) {
      EVGReject.note("unknown property", name, value);
    }
  };
  getCalculatedBounds () {
    return (((((("(" + (this.calculatedX.toString())) + ", ") + (this.calculatedY.toString())) + ") ") + (this.calculatedWidth.toString())) + "x") + (this.calculatedHeight.toString());
  };
  toString () {
    return ((((("<" + this.tagName) + " id=\"") + this.id) + "\" ") + this.getCalculatedBounds()) + ">";
  };
}
EVGElement.createDiv = function() {
  const el = new EVGElement();
  el.tagName = "div";
  el.elementType = 0;
  return el;
};
EVGElement.createSpan = function() {
  const el = new EVGElement();
  el.tagName = "span";
  el.elementType = 1;
  return el;
};
EVGElement.createImg = function() {
  const el = new EVGElement();
  el.tagName = "img";
  el.elementType = 2;
  return el;
};
EVGElement.createPath = function() {
  const el = new EVGElement();
  el.tagName = "path";
  el.elementType = 3;
  return el;
};
EVGElement.truthy = function(value) {
  const v = value.trim();
  if ( v == "true" ) {
    return true;
  }
  if ( v == "1" ) {
    return true;
  }
  if ( v == "yes" ) {
    return true;
  }
  return false;
};
EVGElement.triState = function(value) {
  const v = value.trim();
  if ( v == "true" ) {
    return 2;
  }
  if ( v == "false" ) {
    return 1;
  }
  if ( v == "mixed" ) {
    return 3;
  }
  return 0;
};
EVGElement.areaSide = function(area) {
  const first = EVGElement.areaWord(area, 0);
  if ( (first == "top" || first == "bottom") || first == "left" ) {
    return first;
  }
  if ( (first == "right" || first == "center") || first == "cover" ) {
    return first;
  }
  if ( first == "free" ) {
    return first;
  }
  return "";
};
EVGElement.areaAlign = function(area) {
  const side = EVGElement.areaWord(area, 0);
  const word = EVGElement.areaWord(area, 1);
  if ( word.length == 0 ) {
    return "start";
  }
  if ( (word == "start" || word == "center") || word == "end" ) {
    return word;
  }
  if ( side == "top" || side == "bottom" ) {
    if ( word == "left" ) {
      return "start";
    }
    if ( word == "right" ) {
      return "end";
    }
  }
  if ( side == "left" || side == "right" ) {
    if ( word == "top" ) {
      return "start";
    }
    if ( word == "bottom" ) {
      return "end";
    }
  }
  return "start";
};
EVGElement.areaWord = function(area, index) {
  let out = "";
  let seen = 0;
  let cur = "";
  let i = 0;
  const n = area.length;
  while (i <= n) {
    let isBreak = i == n;
    if ( isBreak == false ) {
      const c = area.charCodeAt(i );
      if ( (c == 32 || c == 9) || c == 10 ) {
        isBreak = true;
      }
    }
    if ( isBreak ) {
      if ( cur.length > 0 ) {
        if ( seen == index ) {
          out = cur;
          return out;
        }
        seen = seen + 1;
        cur = "";
      }
    } else {
      cur = cur + area.substring(i, i + 1 );
    }
    i = i + 1;
  };
  return out;
};
EVGElement.mentionsAnchor = function(value) {
  return value.indexOf("anchor(") >= 0;
};
EVGElement.anchorFnSide = function(prop, value) {
  const open = value.indexOf("anchor(");
  const rest = value.substring(open + 7, value.length );
  const close = rest.indexOf(")");
  if ( close < 0 ) {
    EVGReject.note("unsupported value", prop, value);
    return "";
  }
  const side = rest.substring(0, close ).trim();
  const vertical = prop == "top" || prop == "bottom";
  if ( side == "center" ) {
    return "center";
  }
  if ( vertical ) {
    if ( side == "top" || side == "bottom" ) {
      return side;
    }
  } else {
    if ( side == "left" || side == "right" ) {
      return side;
    }
  }
  EVGReject.note("unsupported value", prop, value);
  return "";
};
EVGElement.anchorFnOffset = function(value) {
  const open = value.indexOf("anchor(");
  const rest = value.substring(open + 7, value.length );
  const close = rest.indexOf(")");
  if ( close < 0 ) {
    return 0.0;
  }
  const tail = rest.substring(close + 1, rest.length ).trim();
  if ( tail.length == 0 ) {
    return 0.0;
  }
  let sign = 1.0;
  const first = tail.substring(0, 1 );
  if ( first == "-" ) {
    sign = 0.0 - 1.0;
  } else {
    if ( (first == "+") == false ) {
      return 0.0;
    }
  }
  const num = tail.substring(1, tail.length ).trim();
  let digits = "";
  let i = 0;
  while (i < num.length) {
    const ch = num.charCodeAt(i );
    const ok = ch >= 48 && ch <= 57 || ch == 46;
    if ( ok ) {
      digits = digits + num.substring(i, i + 1 );
    } else {
      i = num.length;
    }
    i = i + 1;
  };
  const v = isNaN( parseFloat(digits.trim()) ) ? undefined : parseFloat(digits.trim());
  if ( typeof(v) != "undefined" ) {
    return sign * v;
  }
  return 0.0;
};
EVGElement.toKebab = function(name) {
  let out = "";
  const __len = name.length;
  let i = 0;
  while (i < __len) {
    const c = name.charCodeAt(i );
    if ( c >= 65 && c <= 90 ) {
      if ( i > 0 ) {
        out = out + "-";
      }
      out = out + String.fromCharCode(c + 32);
    } else {
      out = out + String.fromCharCode(c);
    }
    i = i + 1;
  };
  return out;
};
EVGElement.isXKeyword = function(w) {
  return w == "left" || w == "right";
};
EVGElement.isYKeyword = function(w) {
  return w == "top" || w == "bottom";
};
EVGElement.originUnit = function(w) {
  if ( w == "left" || w == "top" ) {
    return EVGUnit.percent(0.0);
  }
  if ( w == "right" || w == "bottom" ) {
    return EVGUnit.percent(100.0);
  }
  if ( w == "center" ) {
    return EVGUnit.percent(50.0);
  }
  return EVGUnit.parse(w);
};
EVGElement.resolveOrigin = function(u, size) {
  if ( u.isSet == false ) {
    return size / 2.0;
  }
  if ( u.unitType == 1 || u.unitType == 3 ) {
    return (u.value / 100.0) * size;
  }
  return u.value;
};
EVGElement.transformProblem = function(value) {
  const v = value.trim();
  if ( v == "none" || v.length == 0 ) {
    return "";
  }
  const parts = EVGElement.splitWords(v);
  let i = 0;
  while (i < parts.length) {
    const one = parts[i].trim();
    let known = false;
    if ( EVGElement.callArgs(one, "rotate").length > 0 ) {
      known = true;
    }
    if ( EVGElement.callArgs(one, "scale").length > 0 ) {
      known = true;
    }
    if ( EVGElement.callArgs(one, "translate").length > 0 ) {
      known = true;
    }
    if ( EVGElement.callArgs(one, "translateX").length > 0 ) {
      known = true;
    }
    if ( EVGElement.callArgs(one, "translateY").length > 0 ) {
      known = true;
    }
    if ( known == false ) {
      return "Unsupported transform (rotate, scale, translate, translateX, translateY): " + one;
    }
    const sargs = EVGElement.callArgs(one, "scale");
    if ( sargs.length > 0 ) {
      const nums = EVGElement.numberList(sargs);
      if ( nums.length > 1 ) {
        if ( Math.abs(Math.abs(nums[0]) - Math.abs(nums[1])) > 0.0001 ) {
          return "Only a uniform scale is supported: " + one;
        }
      }
    }
    i = i + 1;
  };
  return "";
};
EVGElement.callArgs = function(one, name) {
  const nl2 = name.length;
  const tl = one.length;
  if ( tl < nl2 + 3 ) {
    return "";
  }
  if ( one.substring(0, nl2 ) != name ) {
    return "";
  }
  if ( one.charCodeAt(nl2 ) != 40 ) {
    return "";
  }
  if ( one.charCodeAt(tl - 1 ) != 41 ) {
    return "";
  }
  const inner = one.substring(nl2 + 1, tl - 1 );
  if ( inner.length == 0 ) {
    return "";
  }
  return inner;
};
EVGElement.numberList = function(s) {
  let out = [];
  const parts = EVGElement.splitOnChar(s, 44);
  let i = 0;
  while (i < parts.length) {
    out.push(EVGElement.leadingNumber(parts[i]));
    i = i + 1;
  };
  return out;
};
EVGElement.splitOnChar = function(s, ch) {
  let out = [];
  let start = 0;
  let i = 0;
  const n = s.length;
  while (i < n) {
    if ( s.charCodeAt(i ) == ch ) {
      out.push(s.substring(start, i ));
      start = i + 1;
    }
    i = i + 1;
  };
  out.push(s.substring(start, n ));
  return out;
};
EVGElement.leadingNumber = function(s) {
  const t = s.trim();
  const n = t.length;
  let stop = 0;
  let scanning = true;
  while (scanning && stop < n) {
    const c = t.charCodeAt(stop );
    const digit = c >= 48 && c <= 57;
    const signOrDot = (c == 45 || c == 43) || c == 46;
    if ( digit || signOrDot ) {
      stop = stop + 1;
    } else {
      scanning = false;
    }
  };
  if ( stop == 0 ) {
    return 0.0;
  }
  const v = isNaN( parseFloat(t.substring(0, stop )) ) ? undefined : parseFloat(t.substring(0, stop ));
  if ( typeof(v) != "undefined" ) {
    return v;
  }
  return 0.0;
};
EVGElement.parseAngleDeg = function(text) {
  const t = text.trim();
  const v = EVGElement.leadingNumber(t);
  const n = t.length;
  if ( n > 4 ) {
    const four = t.substring(n - 4, n );
    if ( four == "turn" ) {
      return v * 360.0;
    }
    if ( four == "grad" ) {
      return (v * 360.0) / 400.0;
    }
  }
  if ( n > 3 ) {
    const three = t.substring(n - 3, n );
    if ( three == "rad" ) {
      return (v * 180.0) / 3.14159265358979;
    }
    if ( three == "deg" ) {
      return v;
    }
  }
  return v;
};
EVGElement.boxSides = function(value, isMargin) {
  let out = [];
  const words = EVGElement.splitWords(value);
  const n = words.length;
  if ( n < 1 ) {
    return out;
  }
  if ( n > 4 ) {
    return out;
  }
  let parts = [];
  let i = 0;
  while (i < n) {
    const w = words[i];
    const u = EVGUnit.parse(w);
    if ( u.isSet == false ) {
      if ( isMargin == false ) {
        return out;
      }
      if ( w != "auto" ) {
        return out;
      }
    } else {
      if ( u.value < 0.0 ) {
        if ( isMargin == false ) {
          return out;
        }
      }
    }
    parts.push(u);
    i = i + 1;
  };
  const top = parts[0];
  let right = top;
  let bottom = top;
  let left = top;
  if ( n > 1 ) {
    right = parts[1];
    left = right;
  }
  if ( n > 2 ) {
    bottom = parts[2];
  }
  if ( n > 3 ) {
    left = parts[3];
  }
  out.push(top);
  out.push(right);
  out.push(bottom);
  out.push(left);
  return out;
};
EVGElement.parseViewBox = function(value, el) {
  const v = value.trim();
  if ( v.length == 0 ) {
    return false;
  }
  const words = EVGElement.splitWords(v);
  if ( words.length != 4 ) {
    return false;
  }
  let got = [];
  let i = 0;
  while (i < 4) {
    const w = words[i];
    const u = EVGUnit.parse(w);
    if ( u.isSet == false ) {
      return false;
    }
    let n = u.value;
    if ( u.isPercent() ) {
      n = n / 100.0;
    }
    got.push(n);
    i = i + 1;
  };
  const cw = got[2];
  const ch = got[3];
  if ( Math.abs(cw) < 0.000001 ) {
    return false;
  }
  if ( Math.abs(ch) < 0.000001 ) {
    return false;
  }
  el.imageViewBoxX = got[0];
  el.imageViewBoxY = got[1];
  el.imageViewBoxW = cw;
  el.imageViewBoxH = ch;
  return true;
};
EVGElement.blurRadiusOf = function(value) {
  const v = value.trim();
  if ( v == "none" ) {
    return 0.0;
  }
  if ( v.length == 0 ) {
    return 0.0;
  }
  const words = EVGElement.splitWords(v);
  if ( words.length != 1 ) {
    return 0.0;
  }
  const one = words[0];
  const inner = EVGElement.callArgs(one, "blur");
  if ( inner.length == 0 ) {
    return 0.0;
  }
  const u = EVGUnit.parse(inner);
  if ( u.isSet == false ) {
    return 0.0;
  }
  if ( u.value < 0.0 ) {
    return 0.0;
  }
  if ( u.unitType != 0 ) {
    return 0.0;
  }
  return u.pixels;
};
EVGElement.blurProblem = function(value) {
  const v = value.trim();
  if ( v == "none" ) {
    return "";
  }
  if ( v.length == 0 ) {
    return "";
  }
  const words = EVGElement.splitWords(v);
  if ( words.length != 1 ) {
    return ("backdrop-filter: only a single blur() is supported, got '" + v) + "'";
  }
  const one = words[0];
  const inner = EVGElement.callArgs(one, "blur");
  if ( inner.length == 0 ) {
    return ("backdrop-filter: only blur() is supported, got '" + v) + "'";
  }
  const u = EVGUnit.parse(inner);
  if ( u.isSet == false ) {
    return ("backdrop-filter: '" + inner) + "' is not a length";
  }
  if ( u.value < 0.0 ) {
    return "backdrop-filter: a blur radius cannot be negative";
  }
  if ( u.unitType != 0 ) {
    return ("backdrop-filter: blur() needs an absolute length, got '" + inner) + "'";
  }
  return "";
};
EVGElement.splitWords = function(s) {
  let out = [];
  let cur = "";
  let depth = 0;
  let i = 0;
  const __len = s.length;
  while (i < __len) {
    const c = s.charCodeAt(i );
    if ( c == 40 ) {
      depth = depth + 1;
    }
    if ( c == 41 ) {
      depth = depth - 1;
    }
    let isSpace = false;
    if ( depth == 0 ) {
      if ( c == 32 ) {
        isSpace = true;
      }
      if ( c == 9 ) {
        isSpace = true;
      }
    }
    if ( isSpace ) {
      if ( cur.length > 0 ) {
        out.push(cur);
        cur = "";
      }
    } else {
      cur = cur + String.fromCharCode(c);
    }
    i = i + 1;
  };
  if ( cur.length > 0 ) {
    out.push(cur);
  }
  return out;
};
EVGElement.isBorderStyleWord = function(tok) {
  if ( tok == "solid" ) {
    return true;
  }
  if ( tok == "dashed" ) {
    return true;
  }
  if ( tok == "dotted" ) {
    return true;
  }
  if ( tok == "double" ) {
    return true;
  }
  if ( tok == "none" ) {
    return true;
  }
  if ( tok == "hidden" ) {
    return true;
  }
  return false;
};
EVGElement.numberOr = function(value, fallback) {
  let digits = "";
  let i = 0;
  while (i < value.length) {
    const code = value.charCodeAt(i );
    let keep = code >= 48 && code <= 57;
    if ( code == 46 ) {
      keep = true;
    }
    if ( code == 45 ) {
      keep = true;
    }
    if ( keep ) {
      digits = digits + value.substring(i, i + 1 );
    }
    i = i + 1;
  };
  if ( digits.length == 0 ) {
    return fallback;
  }
  const v = isNaN( parseFloat(digits) ) ? undefined : parseFloat(digits);
  if ( typeof(v) != "undefined" ) {
    return v;
  }
  return fallback;
};
EVGElement.looksLikeColor = function(tok) {
  if ( tok.length == 0 ) {
    return false;
  }
  const c = tok.charCodeAt(0 );
  if ( c >= 48 && c <= 57 ) {
    return false;
  }
  if ( c == 46 ) {
    return false;
  }
  return true;
};
EVGElement.isPlainNumber = function(s) {
  const __len = s.length;
  if ( __len == 0 ) {
    return false;
  }
  let digits = 0;
  let i = 0;
  while (i < __len) {
    const c = s.charCodeAt(i );
    const isDigit = c >= 48 && c <= 57;
    if ( isDigit ) {
      digits = digits + 1;
    } else {
      if ( (c != 46 && c != 45) && c != 43 ) {
        return false;
      }
    }
    i = i + 1;
  };
  return digits > 0;
};
EVGElement.splitSpaces = function(s) {
  let out = [];
  const __len = s.length;
  let start = 0;
  let inTok = false;
  let i = 0;
  while (i < __len) {
    const c = s.charCodeAt(i );
    const isSpace = (c == 32 || c == 9) || (c == 10 || c == 13);
    if ( isSpace ) {
      if ( inTok ) {
        out.push(s.substring(start, i ));
        inTok = false;
      }
    } else {
      if ( inTok == false ) {
        start = i;
        inTok = true;
      }
    }
    i = i + 1;
  };
  if ( inTok ) {
    out.push(s.substring(start, __len ));
  }
  return out;
};
EVGElement.isHostProp = function(name) {
  const n = name.length;
  if ( n == 0 ) {
    return true;
  }
  if ( n > 2 ) {
    const c0 = name.charCodeAt(0 );
    const c1 = name.charCodeAt(1 );
    const c2 = name.charCodeAt(2 );
    if ( (c0 == 111 && c1 == 110) && (c2 >= 65 && c2 <= 90) ) {
      return true;
    }
  }
  if ( n > 5 ) {
    if ( EVGElement.startsWithStr(name, "data-") ) {
      return true;
    }
  }
  if ( name == "children" ) {
    return true;
  }
  if ( name == "style" ) {
    return true;
  }
  if ( name == "ref" ) {
    return true;
  }
  if ( name == "tag" ) {
    return true;
  }
  if ( name == "tagName" ) {
    return true;
  }
  if ( name == "text" ) {
    return true;
  }
  if ( name == "textContent" ) {
    return true;
  }
  if ( name == "elementType" ) {
    return true;
  }
  if ( name == "test-id" ) {
    return true;
  }
  if ( name == "testId" ) {
    return true;
  }
  return false;
};
EVGElement.startsWithStr = function(s, prefix) {
  const n = prefix.length;
  if ( s.length < n ) {
    return false;
  }
  let i = 0;
  while (i < n) {
    if ( s.charCodeAt(i ) != prefix.charCodeAt(i ) ) {
      return false;
    }
    i = i + 1;
  };
  return true;
};
class EVGStyleDecl  {
  constructor() {
    this.name = "";
    this.value = "";
    this.name = "";
    this.value = "";
  }
}
class EVGMediaQuery  {
  constructor() {
    this.minWidth = 0.0 - 1.0;
    this.maxWidth = 0.0 - 1.0;
    this.minHeight = 0.0 - 1.0;
    this.maxHeight = 0.0 - 1.0;
    this.orientation = "";
    this.pointer = 0;
    this.broken = false;
  }
  isEmpty () {
    if ( this.broken ) {
      return false;
    }
    if ( this.minWidth >= 0.0 ) {
      return false;
    }
    if ( this.maxWidth >= 0.0 ) {
      return false;
    }
    if ( this.minHeight >= 0.0 ) {
      return false;
    }
    if ( this.maxHeight >= 0.0 ) {
      return false;
    }
    if ( this.orientation.length > 0 ) {
      return false;
    }
    if ( this.pointer != 0 ) {
      return false;
    }
    return true;
  };
  matches (w, h, coarse) {
    if ( this.broken ) {
      return false;
    }
    if ( this.isEmpty() ) {
      return true;
    }
    if ( w <= 0.0 ) {
      return false;
    }
    if ( this.minWidth >= 0.0 ) {
      if ( w < this.minWidth ) {
        return false;
      }
    }
    if ( this.maxWidth >= 0.0 ) {
      if ( w > this.maxWidth ) {
        return false;
      }
    }
    if ( this.minHeight >= 0.0 ) {
      if ( h < this.minHeight ) {
        return false;
      }
    }
    if ( this.maxHeight >= 0.0 ) {
      if ( h > this.maxHeight ) {
        return false;
      }
    }
    if ( this.orientation.length > 0 ) {
      let want = "landscape";
      if ( h > w ) {
        want = "portrait";
      }
      if ( this.orientation != want ) {
        return false;
      }
    }
    if ( this.pointer == 1 ) {
      if ( coarse == false ) {
        return false;
      }
    }
    if ( this.pointer == 2 ) {
      if ( coarse ) {
        return false;
      }
    }
    return true;
  };
}
class EVGPseudo  {
  constructor() {
  }
}
EVGPseudo.none = function() {
  return 0;
};
EVGPseudo.hover = function() {
  return 1;
};
EVGPseudo.focus = function() {
  return 2;
};
EVGPseudo.active = function() {
  return 3;
};
EVGPseudo.disabled = function() {
  return 4;
};
EVGPseudo.parse = function(name) {
  if ( name == "hover" ) {
    return 1;
  }
  if ( name == "focus" ) {
    return 2;
  }
  if ( name == "active" ) {
    return 3;
  }
  if ( name == "disabled" ) {
    return 4;
  }
  return -1;
};
EVGPseudo.holds = function(code, el) {
  if ( code == 0 ) {
    return true;
  }
  if ( code == 1 ) {
    return el.isHovered;
  }
  if ( code == 2 ) {
    return el.isFocused;
  }
  if ( code == 3 ) {
    return el.isPressed;
  }
  if ( code == 4 ) {
    return el.a11yDisabled;
  }
  return false;
};
class EVGStyleRule  {
  constructor() {
    this.theme = "";
    this.className = "";
    this.pseudo = 0;
    this.decls = [];
    this.order = 0;
    this.media = new EVGMediaQuery();
    this.theme = "";
    this.className = "";
    this.order = 0;
  }
  isThemeScoped () {
    return this.theme.length > 0;
  };
}
class EVGStyleSheet  {
  constructor() {
    this.rules = [];
    this.varThemes = [];
    this.varMedia = [];
    this.varNames = [];
    this.varValues = [];
    this.varChecked = {};
    this.varReported = {};
    this.errors = [];
    this.ruleCounter = 0;
    this.pendingMedia = new EVGMediaQuery();
    this.viewportW = 0.0;
    this.viewportH = 0.0;
    this.coarsePointer = false;
    this.planNames = [];
    this.planValues = [];
    this.planStart = [];
    this.planCount = [];
    this.planIndex = {};
    this.planHits = 0;
    this.planMisses = 0;
    this.generation = 1;
    this.planLayoutSig = [];
    this.planRules = [];
    this.passSkipped = 0;
    this.passStyled = 0;
    this.passLayoutDirty = 0;
    this.passPaintDirty = 0;
    this.ruleCounter = 0;
    this.dropPlans();
  }
  dropPlans () {
    this.generation = this.generation + 1;
    let sig = [];
    this.planLayoutSig = sig;
    let a = [];
    this.planNames = a;
    let b = [];
    this.planValues = b;
    let c = [];
    this.planStart = c;
    let d = [];
    this.planCount = d;
    let e = {};
    this.planIndex = e;
    let r = [];
    this.planRules = r;
  };
  setViewport (w, h, coarse) {
    if ( (w != this.viewportW || h != this.viewportH) || coarse != this.coarsePointer ) {
      this.dropPlans();
    }
    this.viewportW = w;
    this.viewportH = h;
    this.coarsePointer = coarse;
  };
  getRuleCount () {
    return this.rules.length;
  };
  getErrorCount () {
    return this.errors.length;
  };
  getError (i) {
    return this.errors[i];
  };
  parse (css) {
    this.dropPlans();
    const src = this.stripComments(css);
    this.parseBlock(src, new EVGMediaQuery());
  };
  reload (css) {
    let r = [];
    this.rules = r;
    let e = [];
    this.errors = e;
    let vt = [];
    this.varThemes = vt;
    let vm = [];
    this.varMedia = vm;
    let vn = [];
    this.varNames = vn;
    let vv = [];
    this.varValues = vv;
    let vc = {};
    this.varChecked = vc;
    let vr = {};
    this.varReported = vr;
    this.ruleCounter = 0;
    this.parse(css);
  };
  planLength (slot) {
    if ( slot < 0 ) {
      return 0;
    }
    if ( slot >= this.planCount.length ) {
      return 0;
    }
    return this.planCount[slot];
  };
  planNameAt (slot, i) {
    const from = this.planStart[slot];
    return this.planNames[(from + i)];
  };
  planValueAt (slot, i) {
    const from = this.planStart[slot];
    return this.planValues[(from + i)];
  };
  planRuleAt (slot, i) {
    const from = this.planStart[slot];
    if ( from + i >= this.planRules.length ) {
      return 0 - 1;
    }
    return this.planRules[(from + i)];
  };
  selectorOf (ruleIdx) {
    if ( ruleIdx < 0 ) {
      return "(initial)";
    }
    if ( ruleIdx >= this.rules.length ) {
      return "(gone)";
    }
    const rule = this.rules[ruleIdx];
    let out = "." + rule.className;
    if ( rule.pseudo == 1 ) {
      out = out + ":hover";
    }
    if ( rule.pseudo == 2 ) {
      out = out + ":focus";
    }
    if ( rule.pseudo == 3 ) {
      out = out + ":active";
    }
    if ( rule.pseudo == 4 ) {
      out = out + ":disabled";
    }
    if ( rule.isThemeScoped() ) {
      out = ((out + "  [theme ") + rule.theme) + "]";
    }
    return out;
  };
  ruleClassOf (ruleIdx) {
    if ( ruleIdx < 0 ) {
      return "";
    }
    if ( ruleIdx >= this.rules.length ) {
      return "";
    }
    const rule = this.rules[ruleIdx];
    return rule.className;
  };
  ruleMediaOf (ruleIdx) {
    if ( ruleIdx < 0 ) {
      return "";
    }
    if ( ruleIdx >= this.rules.length ) {
      return "";
    }
    const rule = this.rules[ruleIdx];
    const q = rule.media;
    if ( q.isEmpty() ) {
      return "";
    }
    if ( q.broken ) {
      return "(unparseable — the rules inside it never apply)";
    }
    let out = "";
    if ( q.minWidth >= 0.0 ) {
      const v = Math.floor( q.minWidth);
      out = ((out + "min-width: ") + (v.toString())) + "px ";
    }
    if ( q.maxWidth >= 0.0 ) {
      const v2 = Math.floor( q.maxWidth);
      out = ((out + "max-width: ") + (v2.toString())) + "px ";
    }
    if ( q.minHeight >= 0.0 ) {
      const v3 = Math.floor( q.minHeight);
      out = ((out + "min-height: ") + (v3.toString())) + "px ";
    }
    if ( q.maxHeight >= 0.0 ) {
      const v4 = Math.floor( q.maxHeight);
      out = ((out + "max-height: ") + (v4.toString())) + "px ";
    }
    if ( q.orientation.length > 0 ) {
      out = ((out + "orientation: ") + q.orientation) + " ";
    }
    if ( q.pointer == 1 ) {
      out = out + "pointer: coarse ";
    }
    if ( q.pointer == 2 ) {
      out = out + "pointer: fine ";
    }
    return out;
  };
  parseBlock (src, cond) {
    const __len = src.length;
    let i = 0;
    while (i < __len) {
      const braceAt = this.findChar(src, i, 123);
      if ( braceAt < 0 ) {
        const tail = src.substring(i, __len ).trim();
        if ( tail.length > 0 ) {
          this.errors.push("Ignored trailing text with no rule body: " + tail);
        }
        return;
      }
      const selectorText = src.substring(i, braceAt ).trim();
      if ( this.startsWith(selectorText, "@media") ) {
        const endAt = this.matchingBrace(src, braceAt);
        if ( endAt < 0 ) {
          this.errors.push("Unclosed @media block: " + selectorText);
          return;
        }
        const inner = src.substring(braceAt + 1, endAt );
        const q = this.parseMedia(selectorText.substring(6, selectorText.length ).trim());
        this.parseBlock(inner, this.andQuery(cond, q));
        i = endAt + 1;
      } else {
        if ( selectorText.length > 0 ) {
          if ( selectorText.charCodeAt(0 ) == 64 ) {
            const skipTo = this.matchingBrace(src, braceAt);
            if ( skipTo < 0 ) {
              this.errors.push("Unclosed at-rule: " + selectorText);
              return;
            }
            if ( this.startsWith(selectorText, "@vars") ) {
              this.addVars(
                selectorText,
                src.substring(braceAt + 1, skipTo ),
                cond
              );
              i = skipTo + 1;
              continue;
            }
            this.errors.push("Unsupported at-rule ignored: " + selectorText);
            i = skipTo + 1;
            continue;
          }
        }
        const closeAt = this.findChar(src, (braceAt + 1), 125);
        if ( closeAt < 0 ) {
          this.errors.push("Unclosed rule body for selector: " + selectorText);
          return;
        }
        const body = src.substring(braceAt + 1, closeAt );
        this.addRulesIn(selectorText, body, cond);
        i = closeAt + 1;
      }
    };
  };
  matchingBrace (s, open) {
    const __len = s.length;
    let depth = 0;
    let i = open;
    while (i < __len) {
      const c = s.charCodeAt(i );
      if ( c == 123 ) {
        depth = depth + 1;
      }
      if ( c == 125 ) {
        depth = depth - 1;
        if ( depth == 0 ) {
          return i;
        }
      }
      i = i + 1;
    };
    return 0 - 1;
  };
  parseMedia (text) {
    const q = new EVGMediaQuery();
    const body = text.trim();
    if ( body.length == 0 ) {
      this.errors.push("Empty @media condition");
      q.broken = true;
      return q;
    }
    if ( this.findChar(body, 0, 44) >= 0 ) {
      this.errors.push("Comma-separated media queries are not supported: " + body);
      q.broken = true;
      return q;
    }
    const parts = this.splitFeatures(body);
    let i = 0;
    while (i < parts.length) {
      const feat = parts[i].trim();
      if ( feat.length > 0 ) {
        this.applyFeature(q, feat, body);
      }
      i = i + 1;
    };
    return q;
  };
  splitFeatures (body) {
    let out = [];
    const __len = body.length;
    let i = 0;
    while (i < __len) {
      const open = this.findChar(body, i, 40);
      if ( open < 0 ) {
        const tail = body.substring(i, __len ).trim();
        if ( tail.length > 0 ) {
          if ( tail != "and" ) {
            out.push(tail);
          }
        }
        return out;
      }
      const close = this.findChar(body, (open + 1), 41);
      if ( close < 0 ) {
        out.push(body.substring(open + 1, __len ));
        return out;
      }
      out.push(body.substring(open + 1, close ));
      i = close + 1;
    };
    return out;
  };
  applyFeature (q, feat, whole) {
    const colon = this.findChar(feat, 0, 58);
    if ( colon < 0 ) {
      this.errors.push("Media feature without a value: " + feat);
      q.broken = true;
      return;
    }
    const name = feat.substring(0, colon ).trim();
    const value = feat.substring(colon + 1, feat.length ).trim();
    if ( name == "orientation" ) {
      if ( value == "portrait" || value == "landscape" ) {
        q.orientation = value;
        return;
      }
      this.errors.push("Unknown orientation: " + value);
      q.broken = true;
      return;
    }
    if ( name == "pointer" ) {
      if ( value == "coarse" ) {
        q.pointer = 1;
        return;
      }
      if ( value == "fine" ) {
        q.pointer = 2;
        return;
      }
      this.errors.push("Unknown pointer value: " + value);
      q.broken = true;
      return;
    }
    const px = this.parsePx(value);
    if ( typeof(px) === "undefined" ) {
      this.errors.push("Media feature value is not a length: " + feat);
      q.broken = true;
      return;
    }
    const v = px;
    if ( name == "min-width" ) {
      q.minWidth = v;
      return;
    }
    if ( name == "max-width" ) {
      q.maxWidth = v;
      return;
    }
    if ( name == "min-height" ) {
      q.minHeight = v;
      return;
    }
    if ( name == "max-height" ) {
      q.maxHeight = v;
      return;
    }
    this.errors.push("Unsupported media feature: " + name);
    q.broken = true;
  };
  parsePx (value) {
    let __none;
    const v = value.trim();
    const __len = v.length;
    if ( __len == 0 ) {
      return __none;
    }
    let digits = v;
    if ( __len > 2 ) {
      if ( v.substring(__len - 2, __len ) == "px" ) {
        digits = v.substring(0, __len - 2 ).trim();
      }
    }
    if ( digits.length == 0 ) {
      return __none;
    }
    let i = 0;
    let dots = 0;
    while (i < digits.length) {
      const c = digits.charCodeAt(i );
      if ( c == 46 ) {
        dots = dots + 1;
      } else {
        if ( c < 48 || c > 57 ) {
          return __none;
        }
      }
      i = i + 1;
    };
    if ( dots > 1 ) {
      return __none;
    }
    return isNaN( parseFloat(digits) ) ? undefined : parseFloat(digits);
  };
  andQuery (a, b) {
    if ( a.isEmpty() ) {
      return b;
    }
    if ( b.isEmpty() ) {
      return a;
    }
    const q = new EVGMediaQuery();
    q.broken = a.broken || b.broken;
    q.minWidth = EVGStyleSheet.larger(a.minWidth, b.minWidth);
    q.maxWidth = EVGStyleSheet.smaller(a.maxWidth, b.maxWidth);
    q.minHeight = EVGStyleSheet.larger(a.minHeight, b.minHeight);
    q.maxHeight = EVGStyleSheet.smaller(a.maxHeight, b.maxHeight);
    q.orientation = a.orientation;
    if ( b.orientation.length > 0 ) {
      if ( a.orientation.length > 0 ) {
        if ( a.orientation != b.orientation ) {
          q.broken = true;
        }
      }
      q.orientation = b.orientation;
    }
    q.pointer = a.pointer;
    if ( b.pointer != 0 ) {
      if ( a.pointer != 0 ) {
        if ( a.pointer != b.pointer ) {
          q.broken = true;
        }
      }
      q.pointer = b.pointer;
    }
    return q;
  };
  stripComments (css) {
    let out = "";
    const __len = css.length;
    let i = 0;
    let segStart = 0;
    while (i < __len) {
      const c = css.charCodeAt(i );
      let isStart = false;
      if ( c == 47 ) {
        if ( i + 1 < __len ) {
          if ( css.charCodeAt(i + 1 ) == 42 ) {
            isStart = true;
          }
        }
      }
      if ( isStart ) {
        let j = i + 2;
        let closed = false;
        while (j < __len && closed == false) {
          if ( css.charCodeAt(j ) == 42 ) {
            if ( j + 1 < __len ) {
              if ( css.charCodeAt(j + 1 ) == 47 ) {
                closed = true;
              }
            }
          }
          if ( closed == false ) {
            j = j + 1;
          }
        };
        out = (out + css.substring(segStart, i )) + " ";
        i = j + 2;
        segStart = i;
      } else {
        i = i + 1;
      }
    };
    if ( segStart < __len ) {
      out = out + css.substring(segStart, __len );
    }
    return out;
  };
  findChar (s, from, ch) {
    const __len = s.length;
    let i = from;
    while (i < __len) {
      if ( s.charCodeAt(i ) == ch ) {
        return i;
      }
      i = i + 1;
    };
    return 0 - 1;
  };
  addRules (selectorText, body) {
    this.addRulesIn(selectorText, body, new EVGMediaQuery());
  };
  addRulesIn (selectorText, body, cond) {
    const decls = this.parseDeclarations(body);
    const selectors = this.splitOn(selectorText, 44);
    let i = 0;
    while (i < selectors.length) {
      const sel = selectors[i].trim();
      if ( sel.length > 0 ) {
        this.pendingMedia = cond;
        this.addRuleForSelector(sel, decls);
      }
      i = i + 1;
    };
    this.pendingMedia = new EVGMediaQuery();
  };
  addVars (header, body, cond) {
    const parts = this.splitWhitespace(header);
    let theme = "";
    if ( parts.length > 2 ) {
      this.errors.push("@vars takes at most a theme name: " + header);
      return;
    }
    if ( parts.length == 2 ) {
      theme = parts[1];
    }
    const decls = this.parseDeclarations(body);
    let i = 0;
    while (i < decls.length) {
      const d = decls[i];
      if ( this.startsWith(d.name, "--") == false ) {
        this.errors.push("Only custom properties belong in @vars: " + d.name);
      } else {
        this.varThemes.push(theme);
        this.varMedia.push(cond);
        this.varNames.push(d.name);
        this.varValues.push(d.value);
      }
      i = i + 1;
    };
  };
  getVarCount () {
    return this.varNames.length;
  };
  lookupVar (name, theme) {
    let best = "";
    let bestScoped = false;
    let i = 0;
    const n = this.varNames.length;
    while (i < n) {
      if ( this.varNames[i] == name ) {
        const th = this.varThemes[i];
        const scoped = th.length > 0;
        let applies = true;
        if ( scoped ) {
          applies = EVGStyleSheet.themeOn(th, theme);
        }
        if ( applies ) {
          const mq = this.varMedia[i];
          applies = mq.matches(
            this.viewportW,
            this.viewportH,
            this.coarsePointer
          );
        }
        if ( applies ) {
          if ( scoped || bestScoped == false ) {
            best = this.varValues[i];
            bestScoped = scoped;
          }
        }
      }
      i = i + 1;
    };
    return best;
  };
  resolveVars (value, theme, prop) {
    let at = this.findVar(value, 0);
    if ( at < 0 ) {
      return value;
    }
    let out = value;
    let guard = 0;
    while (at >= 0) {
      guard = guard + 1;
      if ( guard > 32 ) {
        this.reportOnce("Custom property nested too deeply (a cycle?): " + prop);
        return "";
      }
      const close = this.matchParen(out, (at + 3));
      if ( close < 0 ) {
        this.reportOnce("Unclosed var(): " + value);
        return "";
      }
      const inner = out.substring(at + 4, close ).trim();
      const comma = this.findChar(inner, 0, 44);
      let name = inner;
      let fallback = "";
      let hasFallback = false;
      if ( comma >= 0 ) {
        name = inner.substring(0, comma ).trim();
        fallback = inner.substring(comma + 1, inner.length ).trim();
        hasFallback = true;
      }
      const got = this.lookupVar(name, theme);
      let repl = got;
      if ( got.length == 0 ) {
        if ( hasFallback == false ) {
          this.reportOnce((("Undefined custom property " + name) + " in: ") + prop);
          return "";
        }
        repl = fallback;
      }
      out = (out.substring(0, at ) + repl) + out.substring(close + 1, out.length );
      at = this.findVar(out, 0);
    };
    if ( prop == "transition" ) {
      const seen = ( Object.prototype.hasOwnProperty.call(this.varChecked, out) ? this.varChecked[out] : undefined );
      if ( typeof(seen) === "undefined" ) {
        this.varChecked[out] = 1;
        this.checkTransition(out);
      }
    }
    return out;
  };
  reportOnce (msg) {
    const seen = ( Object.prototype.hasOwnProperty.call(this.varReported, msg) ? this.varReported[msg] : undefined );
    if ( typeof(seen) === "undefined" ) {
      this.varReported[msg] = 1;
      this.errors.push(msg);
    }
  };
  findVar (s, from) {
    const n = s.length;
    let i = from;
    while (i + 4 <= n) {
      if ( s.charCodeAt(i ) == 118 ) {
        if ( s.charCodeAt(i + 1 ) == 97 ) {
          if ( s.charCodeAt(i + 2 ) == 114 ) {
            if ( s.charCodeAt(i + 3 ) == 40 ) {
              return i;
            }
          }
        }
      }
      i = i + 1;
    };
    return 0 - 1;
  };
  matchParen (s, open) {
    const n = s.length;
    let depth = 0;
    let i = open;
    while (i < n) {
      const c = s.charCodeAt(i );
      if ( c == 40 ) {
        depth = depth + 1;
      }
      if ( c == 41 ) {
        depth = depth - 1;
        if ( depth == 0 ) {
          return i;
        }
      }
      i = i + 1;
    };
    return 0 - 1;
  };
  addRuleForSelector (sel, decls) {
    const parts = this.splitWhitespace(sel);
    const n = parts.length;
    if ( n == 1 ) {
      const whole = parts[0];
      const bits = this.splitPseudo(whole);
      const only = bits[0];
      const pseudoName = bits[1];
      if ( this.isClassToken(only) == false ) {
        this.errors.push("Unsupported selector (only .class and .theme-x .class are supported): " + sel);
        return;
      }
      let code = 0;
      if ( pseudoName.length > 0 ) {
        code = EVGPseudo.parse(pseudoName);
        if ( code < 0 ) {
          this.errors.push("Unsupported pseudo-class (hover, focus, active, disabled): " + sel);
          return;
        }
      }
      const rule = new EVGStyleRule();
      rule.className = only.substring(1, only.length );
      rule.pseudo = code;
      this.pushRule(rule, decls);
      return;
    }
    if ( n == 2 ) {
      const scope = parts[0];
      const target = parts[1];
      const targetBits = this.splitPseudo(target);
      const targetOnly = targetBits[0];
      if ( this.isClassToken(scope) == false || this.isClassToken(targetOnly) == false ) {
        this.errors.push("Unsupported selector (only .class and .theme-x .class are supported): " + sel);
        return;
      }
      const scopeName = scope.substring(1, scope.length );
      if ( this.startsWith(scopeName, "theme-") == false ) {
        this.errors.push("Descendant selectors are only supported as `.theme-<name> .class`: " + sel);
        return;
      }
      const bits2 = this.splitPseudo(target);
      const targetClass = bits2[0];
      const pseudo2 = bits2[1];
      let code2 = 0;
      if ( pseudo2.length > 0 ) {
        code2 = EVGPseudo.parse(pseudo2);
        if ( code2 < 0 ) {
          this.errors.push("Unsupported pseudo-class (hover, focus, active, disabled): " + sel);
          return;
        }
      }
      const rule2 = new EVGStyleRule();
      rule2.theme = scopeName.substring(6, scopeName.length );
      rule2.className = targetClass.substring(1, targetClass.length );
      rule2.pseudo = code2;
      this.pushRule(rule2, decls);
      return;
    }
    this.errors.push("Unsupported selector (too many parts): " + sel);
  };
  pushRule (rule, decls) {
    let keep = [];
    let k = 0;
    while (k < decls.length) {
      const d = decls[k];
      if ( this.startsWith(d.name, "--") ) {
        this.errors.push((("Custom properties are declared in @vars, not on ." + rule.className) + ": ") + d.name);
      } else {
        keep.push(d);
      }
      k = k + 1;
    };
    rule.decls = keep;
    rule.media = this.pendingMedia;
    rule.order = this.ruleCounter;
    this.ruleCounter = this.ruleCounter + 1;
    this.rules.push(rule);
  };
  splitPseudo (tok) {
    let out = [];
    const at = this.findChar(tok, 0, 58);
    if ( at < 0 ) {
      out.push(tok);
      out.push("");
      return out;
    }
    out.push(tok.substring(0, at ));
    out.push(tok.substring(at + 1, tok.length ));
    return out;
  };
  isClassToken (tok) {
    if ( tok.length < 2 ) {
      return false;
    }
    return tok.charCodeAt(0 ) == 46;
  };
  startsWith (s, prefix) {
    const pl = prefix.length;
    if ( s.length < pl ) {
      return false;
    }
    return s.substring(0, pl ) == prefix;
  };
  parseDeclarations (body) {
    let out = [];
    const parts = this.splitOn(body, 59);
    let i = 0;
    while (i < parts.length) {
      const part = parts[i].trim();
      if ( part.length > 0 ) {
        const colon = this.findChar(part, 0, 58);
        if ( colon < 0 ) {
          this.errors.push("Declaration without ':' ignored: " + part);
        } else {
          const d = new EVGStyleDecl();
          d.name = part.substring(0, colon ).trim();
          d.value = this.unquote(part.substring(colon + 1, part.length ).trim());
          if ( d.name.length > 0 && d.value.length > 0 ) {
            if ( d.name == "transition" ) {
              if ( this.findVar(d.value, 0) < 0 ) {
                this.checkTransition(d.value);
              }
            }
            out.push(d);
          } else {
            this.errors.push("Incomplete declaration ignored: " + part);
          }
        }
      }
      i = i + 1;
    };
    return out;
  };
  checkTransition (value) {
    const parts = EVGEasing.splitTop(value, 44);
    let i = 0;
    while (i < parts.length) {
      const words = EVGEasing.splitWordsTop(parts[i].trim());
      let w = 0;
      while (w < words.length) {
        const word = words[w];
        if ( EVGEasing.looksLikeFunction(word) ) {
          const e = EVGEasing.parse(word);
          if ( e.ok == false ) {
            this.errors.push("Unsupported timing function (linear, ease, ease-in, ease-out, ease-in-out, step-start, step-end, cubic-bezier(), steps()): " + word);
          }
        }
        w = w + 1;
      };
      i = i + 1;
    };
  };
  unquote (s) {
    const __len = s.length;
    if ( __len < 2 ) {
      return s;
    }
    const first = s.charCodeAt(0 );
    const last = s.charCodeAt(__len - 1 );
    if ( first == 34 && last == 34 || first == 39 && last == 39 ) {
      let inner = 1;
      while (inner < __len - 1) {
        if ( s.charCodeAt(inner ) == first ) {
          return s;
        }
        inner = inner + 1;
      };
      return s.substring(1, __len - 1 );
    }
    return s;
  };
  splitOn (s, sep) {
    let out = [];
    const __len = s.length;
    let start = 0;
    let i = 0;
    while (i < __len) {
      if ( s.charCodeAt(i ) == sep ) {
        out.push(s.substring(start, i ));
        start = i + 1;
      }
      i = i + 1;
    };
    out.push(s.substring(start, __len ));
    return out;
  };
  splitWhitespace (s) {
    let out = [];
    const __len = s.length;
    let start = 0;
    let inTok = false;
    let i = 0;
    while (i < __len) {
      const c = s.charCodeAt(i );
      const isSpace = (c == 32 || c == 9) || (c == 10 || c == 13);
      if ( isSpace ) {
        if ( inTok ) {
          out.push(s.substring(start, i ));
          inTok = false;
        }
      } else {
        if ( inTok == false ) {
          start = i;
          inTok = true;
        }
      }
      i = i + 1;
    };
    if ( inTok ) {
      out.push(s.substring(start, __len ));
    }
    return out;
  };
  applyTreeIn (root, theme, w, h, coarse) {
    this.setViewport(w, h, coarse);
    this.applyTree(root, theme);
  };
  applyTree (root, theme) {
    this.passSkipped = 0;
    this.passStyled = 0;
    this.passLayoutDirty = 0;
    this.passPaintDirty = 0;
    this.applyIn(root, theme);
  };
  layoutClean () {
    return this.passLayoutDirty == 0;
  };
  nothingChanged () {
    return this.passLayoutDirty + this.passPaintDirty == 0;
  };
  applyIn (root, theme) {
    const before = this.passLayoutDirty;
    const beforePaint = this.passPaintDirty;
    this.applyTo(root, theme);
    const ownClean = this.passLayoutDirty == before;
    const ownPaintClean = this.passPaintDirty == beforePaint && ownClean;
    let kidsClean = true;
    let kidsPaintClean = true;
    let i = 0;
    const n = root.getChildCount();
    while (i < n) {
      const kid = root.getChild(i);
      this.applyIn(kid, theme);
      if ( kid.layoutClean == false ) {
        kidsClean = false;
      }
      if ( kid.paintClean == false ) {
        kidsPaintClean = false;
      }
      i = i + 1;
    };
    root.layoutClean = (ownClean && kidsClean) && root.hasLayout;
    root.paintClean = ownPaintClean && kidsPaintClean;
    if ( root.paintClean == false ) {
      root.paintStamp = root.paintStamp + 1;
    }
  };
  applyTo (el, theme) {
    if ( el.className.length == 0 ) {
      return;
    }
    const bits = EVGStyleSheet.stateBits(el);
    if ( (((el.styleGen == this.generation && el.styleBits == bits) && el.styleKids == el.children.length) && el.styleTheme == theme) && el.styleClass == el.className ) {
      this.passSkipped = this.passSkipped + 1;
      return;
    }
    const key = (((el.className + "|") + theme) + "|") + (bits.toString());
    const at = ( Object.prototype.hasOwnProperty.call(this.planIndex, key) ? this.planIndex[key] : undefined );
    let slot = 0;
    if ( typeof(at) === "undefined" ) {
      slot = this.buildPlan(el, theme, key);
      this.planMisses = this.planMisses + 1;
    } else {
      slot = at;
      this.planHits = this.planHits + 1;
    }
    this.passStyled = this.passStyled + 1;
    let layoutMoved = true;
    if ( (el.styleSlot >= 0 && el.styleGen == this.generation) && el.styleKids == el.children.length ) {
      if ( el.inlineProps.length == 0 ) {
        if ( this.planLayoutSig[el.styleSlot] == this.planLayoutSig[slot] ) {
          layoutMoved = false;
        }
      }
    }
    if ( layoutMoved ) {
      this.passLayoutDirty = this.passLayoutDirty + 1;
    } else {
      this.passPaintDirty = this.passPaintDirty + 1;
    }
    el.styleClass = el.className;
    el.styleTheme = theme;
    el.styleBits = bits;
    el.styleGen = this.generation;
    el.styleSlot = slot;
    el.styleKids = el.children.length;
    const from = this.planStart[slot];
    const n = this.planCount[slot];
    let i = 0;
    while (i < n) {
      const name = this.planNames[(from + i)];
      if ( el.hasInline(name) == false ) {
        el.setAttribute(name, this.planValues[(from + i)]);
      }
      i = i + 1;
    };
  };
  applyToDirect (el, theme) {
    if ( el.className.length == 0 ) {
      return;
    }
    const classes = this.splitWhitespace(el.className);
    this.clearStateProps(el, classes, theme);
    this.applyGroup(el, classes, theme, false, false);
    this.applyGroup(el, classes, theme, true, false);
    this.applyGroup(el, classes, theme, false, true);
    this.applyGroup(el, classes, theme, true, true);
  };
  applyTreeDirect (root, theme) {
    this.applyToDirect(root, theme);
    let i = 0;
    const n = root.getChildCount();
    while (i < n) {
      this.applyTreeDirect(root.getChild(i), theme);
      i = i + 1;
    };
  };
  buildPlan (el, theme, key) {
    const classes = this.splitWhitespace(el.className);
    const from = this.planNames.length;
    this.planStateClears(classes, theme);
    this.planGroup(el, classes, theme, false, false);
    this.planGroup(el, classes, theme, true, false);
    this.planGroup(el, classes, theme, false, true);
    this.planGroup(el, classes, theme, true, true);
    const slot = this.planStart.length;
    this.planStart.push(from);
    const count = this.planNames.length - from;
    this.planCount.push(count);
    let sig = "";
    let k = 0;
    while (k < count) {
      const nm = this.planNames[(from + k)];
      if ( EVGStyleSheet.isLayoutProperty(nm) ) {
        sig = (((sig + nm) + ":") + this.planValues[(from + k)]) + ";";
      }
      k = k + 1;
    };
    this.planLayoutSig.push(sig);
    this.planIndex[key] = slot;
    return slot;
  };
  planStateClears (classes, theme) {
    let i = 0;
    const n = this.rules.length;
    while (i < n) {
      const rule = this.rules[i];
      if ( rule.pseudo != 0 ) {
        let applies = true;
        if ( rule.isThemeScoped() ) {
          applies = EVGStyleSheet.themeOn(rule.theme, theme);
        }
        if ( applies ) {
          applies = rule.media.matches(
            this.viewportW,
            this.viewportH,
            this.coarsePointer
          );
        }
        if ( applies ) {
          applies = this.matchesClass(classes, rule.className);
        }
        if ( applies ) {
          let d = 0;
          while (d < rule.decls.length) {
            const decl = rule.decls[d];
            const init = EVGStyleSheet.initialValue(decl.name);
            if ( init.length > 0 ) {
              this.planNames.push(decl.name);
              this.planValues.push(init);
              this.planRules.push(0 - 1);
            }
            d = d + 1;
          };
        }
      }
      i = i + 1;
    };
  };
  planGroup (el, classes, theme, themeScoped, stateful) {
    let i = 0;
    const n = this.rules.length;
    while (i < n) {
      const rule = this.rules[i];
      const isStateful = rule.pseudo != 0;
      if ( isStateful == stateful && rule.isThemeScoped() == themeScoped ) {
        let applies = true;
        if ( themeScoped ) {
          applies = EVGStyleSheet.themeOn(rule.theme, theme);
        }
        if ( applies ) {
          applies = rule.media.matches(
            this.viewportW,
            this.viewportH,
            this.coarsePointer
          );
        }
        if ( applies ) {
          applies = EVGPseudo.holds(rule.pseudo, el);
        }
        if ( applies ) {
          if ( this.matchesClass(classes, rule.className) ) {
            let d = 0;
            while (d < rule.decls.length) {
              const decl = rule.decls[d];
              const v = this.resolveVars(decl.value, theme, decl.name);
              if ( v.length > 0 ) {
                this.planNames.push(decl.name);
                this.planValues.push(v);
                this.planRules.push(i);
              }
              d = d + 1;
            };
          }
        }
      }
      i = i + 1;
    };
  };
  clearStateProps (el, classes, theme) {
    let i = 0;
    const n = this.rules.length;
    while (i < n) {
      const rule = this.rules[i];
      if ( rule.pseudo != 0 ) {
        let applies = true;
        if ( rule.isThemeScoped() ) {
          applies = EVGStyleSheet.themeOn(rule.theme, theme);
        }
        if ( applies ) {
          applies = rule.media.matches(
            this.viewportW,
            this.viewportH,
            this.coarsePointer
          );
        }
        if ( applies ) {
          applies = this.matchesClass(classes, rule.className);
        }
        if ( applies ) {
          let d = 0;
          while (d < rule.decls.length) {
            const decl = rule.decls[d];
            const init = EVGStyleSheet.initialValue(decl.name);
            if ( init.length > 0 ) {
              if ( el.hasInline(decl.name) == false ) {
                el.setAttribute(decl.name, init);
              }
            }
            d = d + 1;
          };
        }
      }
      i = i + 1;
    };
  };
  applyGroup (el, classes, theme, themeScoped, stateful) {
    let i = 0;
    const n = this.rules.length;
    while (i < n) {
      const rule = this.rules[i];
      const isStateful = rule.pseudo != 0;
      if ( isStateful == stateful && rule.isThemeScoped() == themeScoped ) {
        let applies = true;
        if ( themeScoped ) {
          applies = EVGStyleSheet.themeOn(rule.theme, theme);
        }
        if ( applies ) {
          applies = rule.media.matches(
            this.viewportW,
            this.viewportH,
            this.coarsePointer
          );
        }
        if ( applies ) {
          applies = EVGPseudo.holds(rule.pseudo, el);
        }
        if ( applies ) {
          if ( this.matchesClass(classes, rule.className) ) {
            this.applyDecls(el, rule, theme);
          }
        }
      }
      i = i + 1;
    };
  };
  matchesClass (classes, want) {
    let i = 0;
    while (i < classes.length) {
      if ( classes[i] == want ) {
        return true;
      }
      i = i + 1;
    };
    return false;
  };
  applyDecls (el, rule, theme) {
    let i = 0;
    while (i < rule.decls.length) {
      const d = rule.decls[i];
      if ( el.hasInline(d.name) == false ) {
        const v = this.resolveVars(d.value, theme, d.name);
        if ( v.length > 0 ) {
          el.setAttribute(d.name, v);
          el.markCss(d.name);
        }
      }
      i = i + 1;
    };
  };
  toText () {
    let out = EVGStyleSheet.sheetHeader() + "\n";
    // Loop start
    for ( const r of this.rules) {
      let line = "R\t" + (EVGStyleSheet.escText(r.theme) + "\t");
      line = line + (EVGStyleSheet.escText(r.className) + "\t");
      line = line + ((r.pseudo.toString()) + "\t");
      line = line + ((r.order.toString()) + "\t");
      line = line + EVGStyleSheet.writeMedia(r.media);
      out = out + (line + "\n");
      // Loop start
      for ( const d of r.decls) {
        const dl = ("D\t" + EVGStyleSheet.escText(d.name)) + ("\t" + EVGStyleSheet.escText(d.value));
        out = out + (dl + "\n");
      }
    }
    const vn = this.varNames.length;
    let k = 0;
    while (k < vn) {
      let line_1 = "V\t" + (EVGStyleSheet.escText(this.varThemes[k]) + "\t");
      line_1 = line_1 + (EVGStyleSheet.escText(this.varNames[k]) + "\t");
      line_1 = line_1 + (EVGStyleSheet.escText(this.varValues[k]) + "\t");
      line_1 = line_1 + EVGStyleSheet.writeMedia(this.varMedia[k]);
      out = out + (line_1 + "\n");
      k = k + 1;
    };
    return out;
  };
  loadText (text) {
    if ( EVGStyleSheet.isSheetText(text) == false ) {
      return false;
    }
    this.dropPlans();
    const lines = this.splitOn(text, 10);
    let current;
    // Loop start
    for ( const line of lines) {
      if ( line.length == 0 ) {
        continue;
      }
      const parts = this.splitOn(line, 9);
      const kind = parts[0];
      if ( kind == "R" ) {
        if ( parts.length < 12 ) {
          continue;
        }
        const r = new EVGStyleRule();
        r.theme = EVGStyleSheet.unescText(parts[1]);
        r.className = EVGStyleSheet.unescText(parts[2]);
        r.pseudo = EVGStyleSheet.readInt(parts[3]);
        r.order = EVGStyleSheet.readInt(parts[4]);
        r.media = EVGStyleSheet.readMedia(parts, 5);
        this.rules.push(r);
        current = r;
        if ( r.order >= this.ruleCounter ) {
          this.ruleCounter = r.order + 1;
        }
        continue;
      }
      if ( kind == "D" ) {
        if ( parts.length < 3 ) {
          continue;
        }
        if ( typeof(current) != "undefined" ) {
          const d = new EVGStyleDecl();
          d.name = EVGStyleSheet.unescText(parts[1]);
          d.value = EVGStyleSheet.unescText(parts[2]);
          const owner = current;
          owner.decls.push(d);
        }
        continue;
      }
      if ( kind == "V" ) {
        if ( parts.length < 11 ) {
          continue;
        }
        this.varThemes.push(EVGStyleSheet.unescText(parts[1]));
        this.varNames.push(EVGStyleSheet.unescText(parts[2]));
        this.varValues.push(EVGStyleSheet.unescText(parts[3]));
        this.varMedia.push(EVGStyleSheet.readMedia(parts, 4));
        continue;
      }
    }
    return true;
  };
}
EVGStyleSheet.larger = function(a, b) {
  if ( a < 0.0 ) {
    return b;
  }
  if ( b < 0.0 ) {
    return a;
  }
  if ( a > b ) {
    return a;
  }
  return b;
};
EVGStyleSheet.smaller = function(a, b) {
  if ( a < 0.0 ) {
    return b;
  }
  if ( b < 0.0 ) {
    return a;
  }
  if ( a < b ) {
    return a;
  }
  return b;
};
EVGStyleSheet.themeOn = function(ruleTheme, active) {
  if ( ruleTheme == active ) {
    return true;
  }
  if ( ruleTheme.length == 0 ) {
    return false;
  }
  const n = active.length;
  let start = 0;
  let i = 0;
  while (i <= n) {
    let sep = i == n;
    if ( sep == false ) {
      sep = active.charCodeAt(i ) == 32;
    }
    if ( sep ) {
      if ( i > start ) {
        if ( active.substring(start, i ) == ruleTheme ) {
          return true;
        }
      }
      start = i + 1;
    }
    i = i + 1;
  };
  return false;
};
EVGStyleSheet.stateKey = function(el) {
  let out = "....";
  if ( el.isHovered ) {
    out = "h" + out.substring(1, 4 );
  }
  if ( el.isFocused ) {
    out = (out.substring(0, 1 ) + "f") + out.substring(2, 4 );
  }
  if ( el.isPressed ) {
    out = (out.substring(0, 2 ) + "a") + out.substring(3, 4 );
  }
  if ( el.a11yDisabled ) {
    out = out.substring(0, 3 ) + "d";
  }
  return out;
};
EVGStyleSheet.stateBits = function(el) {
  let b = 0;
  if ( el.isHovered ) {
    b = b + 1;
  }
  if ( el.isFocused ) {
    b = b + 2;
  }
  if ( el.isPressed ) {
    b = b + 4;
  }
  if ( el.a11yDisabled ) {
    b = b + 8;
  }
  return b;
};
EVGStyleSheet.initialValue = function(name) {
  if ( name == "transform" ) {
    return "none";
  }
  if ( name == "transform-origin" ) {
    return "50% 50%";
  }
  if ( name == "transformOrigin" ) {
    return "50% 50%";
  }
  if ( name == "opacity" ) {
    return "1";
  }
  if ( name == "background-color" ) {
    return "transparent";
  }
  if ( name == "backgroundColor" ) {
    return "transparent";
  }
  if ( name == "rotate" ) {
    return "0";
  }
  if ( name == "scale" ) {
    return "1";
  }
  return "";
};
EVGStyleSheet.isLayoutProperty = function(name) {
  if ( name == "color" ) {
    return false;
  }
  if ( name == "background-color" ) {
    return false;
  }
  if ( name == "backgroundColor" ) {
    return false;
  }
  if ( name == "border-color" ) {
    return false;
  }
  if ( name == "borderColor" ) {
    return false;
  }
  if ( name == "fill" ) {
    return false;
  }
  if ( name == "stroke" ) {
    return false;
  }
  if ( name == "opacity" ) {
    return false;
  }
  if ( name == "border-radius" ) {
    return false;
  }
  if ( name == "borderRadius" ) {
    return false;
  }
  if ( name == "transform" ) {
    return false;
  }
  if ( name == "transform-origin" ) {
    return false;
  }
  if ( name == "transformOrigin" ) {
    return false;
  }
  if ( name == "rotate" ) {
    return false;
  }
  if ( name == "scale" ) {
    return false;
  }
  if ( name == "box-shadow" ) {
    return false;
  }
  if ( name == "shadow-color" ) {
    return false;
  }
  if ( name == "background-gradient" ) {
    return false;
  }
  if ( name == "backdrop-filter" ) {
    return false;
  }
  if ( name == "cursor" ) {
    return false;
  }
  if ( name == "transition" ) {
    return false;
  }
  if ( name == "scrollbar-width" ) {
    return false;
  }
  if ( name == "scrollbar-color" ) {
    return false;
  }
  if ( name == "evg-scrollbar-label" ) {
    return false;
  }
  return true;
};
EVGStyleSheet.sheetHeader = function() {
  return "evg-sheet 1";
};
EVGStyleSheet.escChar = function(c, piece) {
  if ( c == 92 ) {
    return "\\\\";
  }
  if ( c == 9 ) {
    return "\\t";
  }
  if ( c == 10 ) {
    return "\\n";
  }
  if ( c == 13 ) {
    return "\\r";
  }
  return piece;
};
EVGStyleSheet.needsEscape = function(s) {
  const __len = s.length;
  let i = 0;
  while (i < __len) {
    const c = s.charCodeAt(i );
    if ( (c == 92 || c == 9) || (c == 10 || c == 13) ) {
      return true;
    }
    i = i + 1;
  };
  return false;
};
EVGStyleSheet.escText = function(s) {
  if ( EVGStyleSheet.needsEscape(s) == false ) {
    return s;
  }
  let out = "";
  const __len = s.length;
  let i = 0;
  while (i < __len) {
    out = out + EVGStyleSheet.escChar(s.charCodeAt(i ), s.substring(i, i + 1 ));
    i = i + 1;
  };
  return out;
};
EVGStyleSheet.hasBackslash = function(s) {
  const __len = s.length;
  let i = 0;
  while (i < __len) {
    if ( s.charCodeAt(i ) == 92 ) {
      return true;
    }
    i = i + 1;
  };
  return false;
};
EVGStyleSheet.unescText = function(s) {
  if ( EVGStyleSheet.hasBackslash(s) == false ) {
    return s;
  }
  let out = "";
  const __len = s.length;
  let i = 0;
  while (i < __len) {
    const c = s.charCodeAt(i );
    if ( c == 92 ) {
      if ( i + 1 < __len ) {
        const n = s.charCodeAt(i + 1 );
        if ( n == 92 ) {
          out = out + "\\";
        }
        if ( n == 116 ) {
          out = out + "\t";
        }
        if ( n == 110 ) {
          out = out + "\n";
        }
        if ( n == 114 ) {
          out = out + "\r";
        }
        i = i + 2;
      } else {
        i = i + 1;
      }
    } else {
      out = out + s.substring(i, i + 1 );
      i = i + 1;
    }
  };
  return out;
};
EVGStyleSheet.readNum = function(s) {
  const t = s.trim();
  if ( t.length == 0 ) {
    return 0.0;
  }
  const neg = t.charCodeAt(0 ) == 45;
  let digits = t;
  if ( neg ) {
    digits = t.substring(1, t.length );
  }
  const v = isNaN( parseFloat(digits) ) ? undefined : parseFloat(digits);
  if ( typeof(v) != "undefined" ) {
    if ( neg ) {
      return 0.0 - v;
    }
    return v;
  }
  return 0.0;
};
EVGStyleSheet.readInt = function(s) {
  return Math.floor( EVGStyleSheet.readNum(s));
};
EVGStyleSheet.writeMedia = function(m) {
  let out = (m.minWidth.toString()) + "\t";
  out = out + ((m.maxWidth.toString()) + "\t");
  out = out + ((m.minHeight.toString()) + "\t");
  out = out + ((m.maxHeight.toString()) + "\t");
  out = out + (EVGStyleSheet.escText(m.orientation) + "\t");
  out = out + ((m.pointer.toString()) + "\t");
  if ( m.broken ) {
    return out + "1";
  }
  return out + "0";
};
EVGStyleSheet.readMedia = function(parts, at) {
  const m = new EVGMediaQuery();
  m.minWidth = EVGStyleSheet.readNum(parts[at]);
  m.maxWidth = EVGStyleSheet.readNum(parts[(at + 1)]);
  m.minHeight = EVGStyleSheet.readNum(parts[(at + 2)]);
  m.maxHeight = EVGStyleSheet.readNum(parts[(at + 3)]);
  m.orientation = EVGStyleSheet.unescText(parts[(at + 4)]);
  m.pointer = EVGStyleSheet.readInt(parts[(at + 5)]);
  m.broken = parts[(at + 6)] == "1";
  return m;
};
EVGStyleSheet.isSheetText = function(text) {
  const h = EVGStyleSheet.sheetHeader();
  const n = h.length;
  if ( text.length < n ) {
    return false;
  }
  return text.substring(0, n ) == h;
};
class EVGCodepoint  {
  constructor() {
  }
}
EVGCodepoint.breaksAfter = function(c) {
  if ( c == 45 || c == 8208 ) {
    return true;
  }
  if ( c == 8211 || c == 8212 ) {
    return true;
  }
  if ( c == 47 ) {
    return true;
  }
  return false;
};
EVGCodepoint.isSpace = function(c) {
  if ( c == 32 ) {
    return true;
  }
  if ( c == 9 ) {
    return true;
  }
  return false;
};
EVGCodepoint.stringIsBytes = function() {
  return ("ä".length) > 1;
};
EVGCodepoint.isHighSurrogate = function(u) {
  return u >= 55296 && u <= 56319;
};
EVGCodepoint.isLowSurrogate = function(u) {
  return u >= 56320 && u <= 57343;
};
EVGCodepoint.codeAt = function(s, i) {
  const u = s.charCodeAt(i );
  if ( EVGCodepoint.stringIsBytes() ) {
    return EVGCodepoint.utf8CodeAt(s, i, u);
  }
  if ( EVGCodepoint.isHighSurrogate(u) ) {
    if ( i + 1 < s.length ) {
      const lo = s.charCodeAt(i + 1 );
      if ( EVGCodepoint.isLowSurrogate(lo) ) {
        return ((u - 55296) * 1024 + (lo - 56320)) + 65536;
      }
    }
  }
  return u;
};
EVGCodepoint.utf8CodeAt = function(s, i, u) {
  const n = s.length;
  if ( u < 128 ) {
    return u;
  }
  if ( u >= 192 && u < 224 ) {
    if ( i + 1 < n ) {
      const b1 = s.charCodeAt(i + 1 );
      if ( EVGCodepoint.isUtf8Cont(b1) ) {
        return (u - 192) * 64 + (b1 - 128);
      }
    }
    return u;
  }
  if ( u >= 224 && u < 240 ) {
    if ( i + 2 < n ) {
      const c1 = s.charCodeAt(i + 1 );
      const c2 = s.charCodeAt(i + 2 );
      if ( EVGCodepoint.isUtf8Cont(c1) && EVGCodepoint.isUtf8Cont(c2) ) {
        return ((u - 224) * 4096 + (c1 - 128) * 64) + (c2 - 128);
      }
    }
    return u;
  }
  if ( u >= 240 && u < 248 ) {
    if ( i + 3 < n ) {
      const d1 = s.charCodeAt(i + 1 );
      const d2 = s.charCodeAt(i + 2 );
      const d3 = s.charCodeAt(i + 3 );
      if ( (EVGCodepoint.isUtf8Cont(d1) && EVGCodepoint.isUtf8Cont(d2)) && EVGCodepoint.isUtf8Cont(d3) ) {
        return (((u - 240) * 262144 + (d1 - 128) * 4096) + (d2 - 128) * 64) + (d3 - 128);
      }
    }
    return u;
  }
  return u;
};
EVGCodepoint.isUtf8Cont = function(b) {
  return b >= 128 && b < 192;
};
EVGCodepoint.utf8UnitsAt = function(s, i) {
  const u = s.charCodeAt(i );
  const n = s.length;
  if ( u < 128 ) {
    return 1;
  }
  if ( u >= 192 && u < 224 ) {
    if ( i + 1 < n ) {
      if ( EVGCodepoint.isUtf8Cont(s.charCodeAt(i + 1 )) ) {
        return 2;
      }
    }
    return 1;
  }
  if ( u >= 224 && u < 240 ) {
    if ( i + 2 < n ) {
      if ( EVGCodepoint.isUtf8Cont(s.charCodeAt(i + 1 )) && EVGCodepoint.isUtf8Cont(s.charCodeAt(i + 2 )) ) {
        return 3;
      }
    }
    return 1;
  }
  if ( u >= 240 && u < 248 ) {
    if ( i + 3 < n ) {
      const e1 = EVGCodepoint.isUtf8Cont(s.charCodeAt(i + 1 ));
      const e2 = EVGCodepoint.isUtf8Cont(s.charCodeAt(i + 2 ));
      const e3 = EVGCodepoint.isUtf8Cont(s.charCodeAt(i + 3 ));
      if ( (e1 && e2) && e3 ) {
        return 4;
      }
    }
    return 1;
  }
  return 1;
};
EVGCodepoint.unitsAt = function(s, i) {
  if ( EVGCodepoint.stringIsBytes() ) {
    return EVGCodepoint.utf8UnitsAt(s, i);
  }
  const u = s.charCodeAt(i );
  if ( EVGCodepoint.isHighSurrogate(u) ) {
    if ( i + 1 < s.length ) {
      if ( EVGCodepoint.isLowSurrogate(s.charCodeAt(i + 1 )) ) {
        return 2;
      }
    }
  }
  return 1;
};
EVGCodepoint.charCount = function(s) {
  return Array.from(s, (rg_c) => rg_c.codePointAt(0)).length;
};
EVGCodepoint.count = function(s) {
  return Array.from(s, (rg_c) => rg_c.codePointAt(0)).length;
};
EVGCodepoint.toArray = function(s) {
  return Array.from(s, (rg_c) => rg_c.codePointAt(0));
};
EVGCodepoint.toStr = function(cp) {
  if ( EVGCodepoint.stringIsBytes() ) {
    return String.fromCharCode(cp);
  }
  if ( cp < 65536 ) {
    return String.fromCharCode(cp);
  }
  const rel = cp - 65536;
  const hi = 55296 + Math.floor( rel / 1024);
  const lo = 56320 + rel % 1024;
  return String.fromCharCode(hi) + String.fromCharCode(lo);
};
EVGCodepoint.encodeUtf8 = function(s) {
  if ( EVGCodepoint.stringIsBytes() ) {
    return s;
  }
  let out = "";
  let i = 0;
  while (i < s.length) {
    const cp = EVGCodepoint.codeAt(s, i);
    i = i + EVGCodepoint.unitsAt(s, i);
    if ( cp < 128 ) {
      out = out + String.fromCharCode(cp);
    } else {
      if ( cp < 2048 ) {
        out = out + String.fromCharCode(192 + Math.floor( cp / 64));
        out = out + String.fromCharCode(128 + cp % 64);
      } else {
        if ( cp < 65536 ) {
          out = out + String.fromCharCode(224 + Math.floor( cp / 4096));
          out = out + String.fromCharCode(128 + Math.floor( cp / 64) % 64);
          out = out + String.fromCharCode(128 + cp % 64);
        } else {
          out = out + String.fromCharCode(240 + Math.floor( cp / 262144));
          out = out + String.fromCharCode(128 + Math.floor( cp / 4096) % 64);
          out = out + String.fromCharCode(128 + Math.floor( cp / 64) % 64);
          out = out + String.fromCharCode(128 + cp % 64);
        }
      }
    }
    continue;
  };
  return out;
};
class EVGTextMetrics  {
  constructor() {
    this.width = 0.0;
    this.height = 0.0;
    this.ascent = 0.0;
    this.descent = 0.0;
    this.lineHeight = 0.0;
    this.width = 0.0;
    this.height = 0.0;
    this.ascent = 0.0;
    this.descent = 0.0;
    this.lineHeight = 0.0;
  }
}
EVGTextMetrics.create = function(w, h) {
  const m = new EVGTextMetrics();
  m.width = w;
  m.height = h;
  return m;
};
class EVGTextMeasurer  {
  constructor() {
    this.advTable = [];
    this.monoTable = [];
    this.latinTable = [];
    this.punctTable = [];
    this.tablesReady = false;
    this.monoFamily = "";
    this.monoKnown = false;
    this.monoCached = false;
    this.boldCached = false;
    this.boldTable = [];
    this.boldLatinTable = [];
    this.boldPunctTable = [];
  }
  isFontAccurate () {
    return false;
  };
  hasFace (fontFamily) {
    return false;
  };
  measureKey () {
    return "";
  };
  measureText (text, fontFamily, fontSize) {
    const avgCharWidth = fontSize * 0.55;
    const textLen = text.length;
    const width = textLen * avgCharWidth;
    const lineHeight = fontSize * EVGTextMeasurer.normalLineHeightEm();
    const metrics = new EVGTextMetrics();
    metrics.width = width;
    metrics.height = lineHeight;
    metrics.ascent = fontSize * EVGTextMeasurer.fallbackAscentEm();
    metrics.descent = fontSize * EVGTextMeasurer.fallbackDescentEm();
    metrics.lineHeight = lineHeight;
    return metrics;
  };
  measureTextWidth (text, fontFamily, fontSize) {
    const metrics = this.measureText(text, fontFamily, fontSize);
    return metrics.width;
  };
  getLineHeight (fontFamily, fontSize) {
    return fontSize * EVGTextMeasurer.normalLineHeightEm();
  };
  monoFor (fontFamily) {
    if ( this.monoKnown ) {
      if ( this.monoFamily == fontFamily ) {
        return this.monoCached;
      }
    }
    this.monoFamily = fontFamily;
    this.monoCached = EVGTextMeasurer.isMono(fontFamily);
    this.boldCached = EVGTextMeasurer.isBold(fontFamily);
    this.monoKnown = true;
    return this.monoCached;
  };
  prepareTables () {
    this.advTable = EVGTextMeasurer.advanceEm();
    this.monoTable = EVGTextMeasurer.monoAdvanceEm();
    this.latinTable = EVGTextMeasurer.latin1Em();
    this.punctTable = EVGTextMeasurer.punctEm();
    this.boldTable = EVGTextMeasurer.boldAdvanceEm();
    this.boldLatinTable = EVGTextMeasurer.boldLatin1Em();
    this.boldPunctTable = EVGTextMeasurer.boldPunctEm();
    this.tablesReady = true;
  };
  measureChar (ch, fontFamily, fontSize) {
    if ( this.tablesReady == false ) {
      this.prepareTables();
    }
    const mono = this.monoFor(fontFamily);
    const bold = this.boldCached;
    if ( ch == 8364 ) {
      if ( mono ) {
        return EVGTextMeasurer.monoEuroEm() * fontSize;
      }
      return EVGTextMeasurer.euroEm() * fontSize;
    }
    if ( ch >= 32 && ch <= 126 ) {
      let t = this.advTable;
      if ( mono ) {
        t = this.monoTable;
      } else {
        if ( bold ) {
          t = this.boldTable;
        }
      }
      return t[(ch - 32)] * fontSize;
    }
    if ( ch == 173 ) {
      return 0.0;
    }
    if ( mono ) {
      if ( ch >= 160 && ch <= 255 || ch >= 8208 && ch <= 8230 ) {
        return EVGTextMeasurer.monoEuroEm() * fontSize;
      }
      if ( EVGTextMeasurer.extraEm(ch) >= 0.0 ) {
        return EVGTextMeasurer.monoEuroEm() * fontSize;
      }
    }
    if ( ch >= 160 && ch <= 255 ) {
      if ( bold ) {
        return this.boldLatinTable[(ch - 160)] * fontSize;
      }
      return this.latinTable[(ch - 160)] * fontSize;
    }
    if ( ch >= 8208 && ch <= 8230 ) {
      if ( bold ) {
        return this.boldPunctTable[(ch - 8208)] * fontSize;
      }
      return this.punctTable[(ch - 8208)] * fontSize;
    }
    const extra = EVGTextMeasurer.extraEm(ch);
    if ( extra >= 0.0 ) {
      return extra * fontSize;
    }
    if ( ch >= 55296 && ch <= 56319 ) {
      if ( ch == 55357 ) {
        return fontSize * 1.25;
      }
      return fontSize * 1.25;
    }
    if ( ch >= 56320 && ch <= 57343 ) {
      return 0.0;
    }
    if ( ch == 8205 ) {
      return 0.0;
    }
    if ( ch == 65039 ) {
      return 0.0;
    }
    return fontSize * 0.5;
  };
  wrapText (text, fontFamily, fontSize, maxWidth) {
    let lines = [];
    let currentLine = "";
    let currentWidth = 0.0;
    let wordStart = 0;
    let joiner = " ";
    const textLen = text.length;
    let i = 0;
    while (i <= textLen) {
      let ch = 0;
      const isEnd = i == textLen;
      if ( isEnd == false ) {
        ch = text.charCodeAt(i );
      }
      let isWordEnd = false;
      if ( isEnd ) {
        isWordEnd = true;
      }
      if ( ch == 32 ) {
        isWordEnd = true;
      }
      if ( ch == 10 ) {
        isWordEnd = true;
      }
      let hyphen = false;
      if ( isEnd == false ) {
        if ( EVGCodepoint.breaksAfter(ch) ) {
          if ( i > wordStart ) {
            isWordEnd = true;
            hyphen = true;
          }
        }
      }
      if ( isWordEnd ) {
        let wordEnd = i;
        if ( hyphen ) {
          wordEnd = i + 1;
        }
        let word = "";
        if ( wordEnd > wordStart ) {
          word = text.substring(wordStart, wordEnd );
        }
        const wordWidth = this.measureTextWidth(word, fontFamily, fontSize);
        let spaceWidth = 0.0;
        if ( currentLine.length > 0 ) {
          if ( joiner.length > 0 ) {
            spaceWidth = this.measureTextWidth(joiner, fontFamily, fontSize);
          }
        }
        if ( (currentWidth + spaceWidth) + wordWidth <= maxWidth ) {
          if ( currentLine.length > 0 ) {
            currentLine = currentLine + joiner;
            currentWidth = currentWidth + spaceWidth;
          }
          currentLine = currentLine + word;
          currentWidth = currentWidth + wordWidth;
        } else {
          if ( currentLine.length > 0 ) {
            lines.push(currentLine);
          }
          currentLine = word;
          currentWidth = wordWidth;
        }
        if ( ch == 10 ) {
          lines.push(currentLine);
          currentLine = "";
          currentWidth = 0.0;
        }
        joiner = " ";
        if ( hyphen ) {
          joiner = "";
        }
        wordStart = i + 1;
      }
      i = i + 1;
    };
    if ( currentLine.length > 0 ) {
      lines.push(currentLine);
    }
    return lines;
  };
}
EVGTextMeasurer.fallbackAscentEm = function() {
  return 0.905;
};
EVGTextMeasurer.fallbackDescentEm = function() {
  return 0.212;
};
EVGTextMeasurer.normalLineHeightEm = function() {
  return 1.15;
};
EVGTextMeasurer.boldAdvanceEm = function() {
  return [0.27783, 0.33301, 0.47412, 0.55615, 0.55615, 0.88916, 0.72217, 0.23779, 0.33301, 0.33301, 0.38916, 0.58398, 0.27783, 0.33301, 0.27783, 0.27783, 0.55615, 0.55615, 0.55615, 0.55615, 0.55615, 0.55615, 0.55615, 0.55615, 0.55615, 0.55615, 0.33301, 0.33301, 0.58398, 0.58398, 0.58398, 0.61084, 0.9751, 0.72217, 0.72217, 0.72217, 0.72217, 0.66699, 0.61084, 0.77783, 0.72217, 0.27783, 0.55615, 0.72217, 0.61084, 0.83301, 0.72217, 0.77783, 0.66699, 0.77783, 0.72217, 0.66699, 0.61084, 0.72217, 0.66699, 0.94385, 0.66699, 0.66699, 0.61084, 0.33301, 0.27783, 0.33301, 0.58398, 0.55615, 0.33301, 0.55615, 0.61084, 0.55615, 0.61084, 0.55615, 0.33301, 0.61084, 0.61084, 0.27783, 0.27783, 0.55615, 0.27783, 0.88916, 0.61084, 0.61084, 0.61084, 0.61084, 0.38916, 0.55615, 0.33301, 0.61084, 0.55615, 0.77783, 0.55615, 0.55615, 0.5, 0.38916, 0.27979, 0.38916, 0.58398];
};
EVGTextMeasurer.boldLatin1Em = function() {
  return [0.27783, 0.33301, 0.55615, 0.55615, 0.55615, 0.55615, 0.27979, 0.55615, 0.33301, 0.73682, 0.37012, 0.55615, 0.58398, 0.0, 0.73682, 0.55225, 0.3999, 0.54883, 0.33301, 0.33301, 0.33301, 0.57617, 0.55615, 0.33301, 0.33301, 0.33301, 0.36523, 0.55615, 0.83398, 0.83398, 0.83398, 0.61084, 0.72217, 0.72217, 0.72217, 0.72217, 0.72217, 0.72217, 1.0, 0.72217, 0.66699, 0.66699, 0.66699, 0.66699, 0.27783, 0.27783, 0.27783, 0.27783, 0.72217, 0.72217, 0.77783, 0.77783, 0.77783, 0.77783, 0.77783, 0.58398, 0.77783, 0.72217, 0.72217, 0.72217, 0.72217, 0.66699, 0.66699, 0.61084, 0.55615, 0.55615, 0.55615, 0.55615, 0.55615, 0.55615, 0.88916, 0.55615, 0.55615, 0.55615, 0.55615, 0.55615, 0.27783, 0.27783, 0.27783, 0.27783, 0.61084, 0.61084, 0.61084, 0.61084, 0.61084, 0.61084, 0.61084, 0.54883, 0.61084, 0.61084, 0.61084, 0.61084, 0.61084, 0.55615, 0.61084, 0.55615];
};
EVGTextMeasurer.boldPunctEm = function() {
  return [0.33301, 0.33301, 0.55615, 0.55615, 1.0, 1.0, 0.49756, 0.55225, 0.27783, 0.27783, 0.27783, 0.27783, 0.5, 0.5, 0.5, 0.5, 0.55615, 0.55615, 0.3501, 0.58984, 0.33447, 0.66748, 1.0];
};
EVGTextMeasurer.advanceEm = function() {
  return [0.27783, 0.27783, 0.35498, 0.55615, 0.55615, 0.88916, 0.66699, 0.19092, 0.33301, 0.33301, 0.38916, 0.58398, 0.27783, 0.33301, 0.27783, 0.27783, 0.55615, 0.55615, 0.55615, 0.55615, 0.55615, 0.55615, 0.55615, 0.55615, 0.55615, 0.55615, 0.27783, 0.27783, 0.58398, 0.58398, 0.58398, 0.55615, 1.01514, 0.66699, 0.66699, 0.72217, 0.72217, 0.66699, 0.61084, 0.77783, 0.72217, 0.27783, 0.5, 0.66699, 0.55615, 0.83301, 0.72217, 0.77783, 0.66699, 0.77783, 0.72217, 0.66699, 0.61084, 0.72217, 0.66699, 0.94385, 0.66699, 0.66699, 0.61084, 0.27783, 0.27783, 0.27783, 0.46924, 0.55615, 0.33301, 0.55615, 0.55615, 0.5, 0.55615, 0.55615, 0.27783, 0.55615, 0.55615, 0.22217, 0.22217, 0.5, 0.22217, 0.83301, 0.55615, 0.55615, 0.55615, 0.55615, 0.33301, 0.5, 0.27783, 0.55615, 0.5, 0.72217, 0.5, 0.5, 0.5, 0.33398, 0.25977, 0.33398, 0.58398];
};
EVGTextMeasurer.monoAdvanceEm = function() {
  return [0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205, 0.60205];
};
EVGTextMeasurer.latin1Em = function() {
  return [0.27783, 0.33301, 0.55615, 0.55615, 0.55615, 0.55615, 0.25977, 0.55615, 0.33301, 0.73682, 0.37012, 0.55615, 0.58398, 0.0, 0.73682, 0.55225, 0.3999, 0.54883, 0.33301, 0.33301, 0.33301, 0.57617, 0.53711, 0.33301, 0.33301, 0.33301, 0.36523, 0.55615, 0.83398, 0.83398, 0.83398, 0.61084, 0.66699, 0.66699, 0.66699, 0.66699, 0.66699, 0.66699, 1.0, 0.72217, 0.66699, 0.66699, 0.66699, 0.66699, 0.27783, 0.27783, 0.27783, 0.27783, 0.72217, 0.72217, 0.77783, 0.77783, 0.77783, 0.77783, 0.77783, 0.58398, 0.77783, 0.72217, 0.72217, 0.72217, 0.72217, 0.66699, 0.66699, 0.61084, 0.55615, 0.55615, 0.55615, 0.55615, 0.55615, 0.55615, 0.88916, 0.5, 0.55615, 0.55615, 0.55615, 0.55615, 0.27783, 0.27783, 0.27783, 0.27783, 0.55615, 0.55615, 0.55615, 0.55615, 0.55615, 0.55615, 0.55615, 0.54883, 0.61084, 0.55615, 0.55615, 0.55615, 0.55615, 0.5, 0.55615, 0.5];
};
EVGTextMeasurer.punctEm = function() {
  return [0.33301, 0.33301, 0.55615, 0.55615, 1.0, 1.0, 0.41309, 0.55225, 0.22217, 0.22217, 0.22217, 0.22217, 0.33301, 0.33301, 0.33301, 0.33301, 0.55615, 0.55615, 0.3501, 0.59, 0.33, 0.67, 1.0];
};
EVGTextMeasurer.extraEm = function(ch) {
  if ( ch == 8249 ) {
    return 0.33301;
  }
  if ( ch == 8250 ) {
    return 0.33301;
  }
  if ( ch == 8482 ) {
    return 1.0;
  }
  if ( ch == 10003 ) {
    return 0.84;
  }
  if ( ch == 10004 ) {
    return 0.84;
  }
  if ( ch == 8242 ) {
    return 0.1875;
  }
  if ( ch == 8243 ) {
    return 0.354;
  }
  return -1.0;
};
EVGTextMeasurer.euroEm = function() {
  return 0.55615;
};
EVGTextMeasurer.monoEuroEm = function() {
  return 0.60205;
};
EVGTextMeasurer.isMono = function(fontFamily) {
  if ( fontFamily.indexOf("mono") >= 0 ) {
    return true;
  }
  if ( fontFamily.indexOf("Mono") >= 0 ) {
    return true;
  }
  if ( fontFamily.indexOf("courier") >= 0 ) {
    return true;
  }
  if ( fontFamily.indexOf("Courier") >= 0 ) {
    return true;
  }
  if ( fontFamily.indexOf("Consol") >= 0 ) {
    return true;
  }
  if ( fontFamily.indexOf("consol") >= 0 ) {
    return true;
  }
  return false;
};
EVGTextMeasurer.isBold = function(fontFamily) {
  return fontFamily.indexOf("-Bold") >= 0;
};
class SimpleTextMeasurer  extends EVGTextMeasurer {
  constructor() {
    super()
    this.charWidthRatio = 0.55;
  }
  setCharWidthRatio (ratio) {
    this.charWidthRatio = ratio;
  };
  measureText (text, fontFamily, fontSize) {
    const textLen = text.length;
    let width = 0.0;
    let i = 0;
    while (i < textLen) {
      const ch = text.charCodeAt(i );
      width = width + this.measureChar(ch, fontFamily, fontSize);
      i = i + 1;
    };
    const lineHeight = fontSize * EVGTextMeasurer.normalLineHeightEm();
    const metrics = new EVGTextMetrics();
    metrics.width = width;
    metrics.height = lineHeight;
    metrics.ascent = fontSize * EVGTextMeasurer.fallbackAscentEm();
    metrics.descent = fontSize * EVGTextMeasurer.fallbackDescentEm();
    metrics.lineHeight = lineHeight;
    return metrics;
  };
}
class EVGDefaultMeasurer  {
  constructor() {
    if (EVGDefaultMeasurer.__singleton_instance != null) {
      return EVGDefaultMeasurer.__singleton_instance;
    }
    this.current = undefined;
    this.installs = 0;
    EVGDefaultMeasurer.__singleton_instance = this;
  }
}
EVGDefaultMeasurer.__singleton_instance = null;
EVGDefaultMeasurer.__singleton = function() {
  if (EVGDefaultMeasurer.__singleton_instance == null) {
    EVGDefaultMeasurer.__singleton_instance = new EVGDefaultMeasurer();
  }
  return EVGDefaultMeasurer.__singleton_instance;
};
EVGDefaultMeasurer.install = function(m) {
  const r = EVGDefaultMeasurer.__singleton();
  r.current = m;
  r.installs = r.installs + 1;
};
EVGDefaultMeasurer.uninstall = function() {
  const r = EVGDefaultMeasurer.__singleton();
  let none;
  r.current = none;
};
EVGDefaultMeasurer.isInstalled = function() {
  const r = EVGDefaultMeasurer.__singleton();
  return (typeof(r.current) !== "undefined" && r.current != null ) ;
};
EVGDefaultMeasurer.measurer = function() {
  const r = EVGDefaultMeasurer.__singleton();
  if ( (typeof(r.current) !== "undefined" && r.current != null )  ) {
    return r.current;
  }
  const m = new SimpleTextMeasurer();
  return m;
};
class EVGImageDimensions  {
  constructor() {
    this.width = 0;
    this.height = 0;
    this.aspectRatio = 1.0;
    this.isValid = false;
    this.width = 0;
    this.height = 0;
    this.aspectRatio = 1.0;
    this.isValid = false;
  }
}
EVGImageDimensions.create = function(w, h) {
  const d = new EVGImageDimensions();
  d.width = w;
  d.height = h;
  if ( h > 0 ) {
    d.aspectRatio = w / h;
  }
  d.isValid = true;
  return d;
};
class EVGImageMeasurer  {
  constructor() {
  }
  getImageDimensions (src) {
    const dims = new EVGImageDimensions();
    return dims;
  };
  calculateHeightForWidth (src, targetWidth) {
    const dims = this.getImageDimensions(src);
    if ( dims.isValid ) {
      return targetWidth / dims.aspectRatio;
    }
    return targetWidth;
  };
  calculateWidthForHeight (src, targetHeight) {
    const dims = this.getImageDimensions(src);
    if ( dims.isValid ) {
      return targetHeight * dims.aspectRatio;
    }
    return targetHeight;
  };
  calculateFitDimensions (src, maxWidth, maxHeight) {
    const dims = this.getImageDimensions(src);
    if ( dims.isValid == false ) {
      return EVGImageDimensions.create(Math.floor( maxWidth), Math.floor( maxHeight));
    }
    const scaleW = maxWidth / dims.width;
    const scaleH = maxHeight / dims.height;
    let scale = scaleW;
    if ( scaleH < scaleW ) {
      scale = scaleH;
    }
    const newW = Math.floor( dims.width * scale);
    const newH = Math.floor( dims.height * scale);
    return EVGImageDimensions.create(newW, newH);
  };
}
class SimpleImageMeasurer  extends EVGImageMeasurer {
  constructor() {
    super()
  }
}
class EVGGridTrack  {
  constructor() {
    this.kind = 0;
    this.value = 0.0;
    this.hasFitLimit = false;
    this.fitLimit = undefined;
    this.sizePx = 0.0;
    this.hasMin = false;
    this.hasMax = false;
    this.minUnit = undefined;
    this.maxUnit = undefined;
    this.frozen = false;
    this.kind = 0;
    this.value = 0.0;
    this.sizePx = 0.0;
    this.hasMin = false;
    this.hasMax = false;
    this.frozen = false;
    this.hasFitLimit = false;
    this.minUnit = EVGUnit.unset();
    this.maxUnit = EVGUnit.unset();
    this.fitLimit = EVGUnit.unset();
  }
}
class EVGGridTemplate  {
  constructor() {
    this.tracks = [];
    this.lineNames = [];
    this.lineNumbers = [];
    this.hadError = false;
    this.errorText = "";
    this.hadError = false;
    this.errorText = "";
  }
  lineNumberNamed (name) {
    let i = 0;
    while (i < this.lineNames.length) {
      if ( this.lineNames[i] == name ) {
        return this.lineNumbers[i];
      }
      i = i + 1;
    };
    return 0;
  };
  addLineNames (tok) {
    const inner = tok.substring(1, tok.length - 1 ).trim();
    const line = this.tracks.length + 1;
    const parts = EVGGridTemplate.tokenize(inner);
    let i = 0;
    while (i < parts.length) {
      const nm = parts[i];
      if ( nm.length > 0 ) {
        if ( this.lineNumberNamed(nm) == 0 ) {
          this.lineNames.push(nm);
          this.lineNumbers.push(line);
        }
      }
      i = i + 1;
    };
  };
  count () {
    return this.tracks.length;
  };
  trackAt (i) {
    return this.tracks[i];
  };
  expandRepeat (tok) {
    const __len = tok.length;
    const close = __len - 1;
    if ( tok.charCodeAt(close ) != 41 ) {
      this.hadError = true;
      this.errorText = "Malformed repeat(): " + tok;
      return;
    }
    const inner = tok.substring(7, close );
    let comma = 0 - 1;
    let j = 0;
    while (j < inner.length) {
      if ( inner.charCodeAt(j ) == 44 ) {
        comma = j;
        j = inner.length;
      } else {
        j = j + 1;
      }
    };
    if ( comma < 0 ) {
      this.hadError = true;
      this.errorText = "repeat() needs a count and a track list: " + tok;
      return;
    }
    const countStr = inner.substring(0, comma ).trim();
    const listStr = inner.substring(comma + 1, inner.length ).trim();
    const countVal = isNaN( parseFloat(countStr) ) ? undefined : parseFloat(countStr);
    let n = 0;
    if ( typeof(countVal) != "undefined" ) {
      n = Math.floor( countVal);
    } else {
      this.hadError = true;
      this.errorText = "repeat() count is not a number: " + tok;
      return;
    }
    if ( n < 1 ) {
      this.hadError = true;
      this.errorText = "repeat() count must be at least 1: " + tok;
      return;
    }
    const inner2 = EVGGridTemplate.tokenize(listStr);
    let r = 0;
    while (r < n) {
      let k = 0;
      while (k < inner2.length) {
        const innerTok = inner2[k];
        if ( EVGGridTemplate.isMinmax(innerTok) ) {
          this.addMinmax(innerTok);
        } else {
          this.addTrack(innerTok);
        }
        k = k + 1;
      };
      r = r + 1;
    };
  };
  addMinmax (tok) {
    const __len = tok.length;
    const close = __len - 1;
    if ( tok.charCodeAt(close ) != 41 ) {
      this.hadError = true;
      this.errorText = "Malformed minmax(): " + tok;
      return;
    }
    const inner = tok.substring(7, close );
    let comma = 0 - 1;
    let j = 0;
    while (j < inner.length) {
      if ( inner.charCodeAt(j ) == 44 ) {
        comma = j;
        j = inner.length;
      } else {
        j = j + 1;
      }
    };
    if ( comma < 0 ) {
      this.hadError = true;
      this.errorText = "minmax() needs two values: " + tok;
      return;
    }
    const minStr = inner.substring(0, comma ).trim();
    const maxStr = inner.substring(comma + 1, inner.length ).trim();
    const before = this.tracks.length;
    this.addTrack(maxStr);
    if ( this.tracks.length == before ) {
      return;
    }
    const track = this.tracks[(this.tracks.length - 1)];
    if ( EVGGridTemplate.isFrToken(minStr) == false ) {
      track.minUnit = EVGUnit.parse(minStr);
      track.hasMin = track.minUnit.isSet;
    }
    if ( EVGGridTemplate.isFrToken(maxStr) == false ) {
      track.maxUnit = EVGUnit.parse(maxStr);
      track.hasMax = track.maxUnit.isSet;
    }
  };
  addTrack (tok) {
    const t = tok.trim();
    const __len = t.length;
    if ( __len == 0 ) {
      return;
    }
    const track = new EVGGridTrack();
    if ( t == "auto" ) {
      track.kind = 3;
      this.tracks.push(track);
      return;
    }
    if ( EVGGridTemplate.isFitContent(t) ) {
      const inner = t.substring(12, __len - 1 ).trim();
      const lim = EVGUnit.parse(inner);
      if ( lim.isSet == false ) {
        this.hadError = true;
        this.errorText = "Unsupported fit-content() limit: " + inner;
        return;
      }
      track.kind = 3;
      track.hasFitLimit = true;
      track.fitLimit = lim;
      this.tracks.push(track);
      return;
    }
    if ( __len > 2 ) {
      if ( t.substring(__len - 2, __len ) == "fr" ) {
        const numStr = t.substring(0, __len - 2 );
        const frVal = isNaN( parseFloat(numStr) ) ? undefined : parseFloat(numStr);
        if ( typeof(frVal) != "undefined" ) {
          track.kind = 2;
          track.value = frVal;
          this.tracks.push(track);
          return;
        }
      }
    }
    if ( t == "fr" ) {
      track.kind = 2;
      track.value = 1.0;
      this.tracks.push(track);
      return;
    }
    const unit = EVGUnit.parse(t);
    if ( unit.isSet == false ) {
      this.hadError = true;
      this.errorText = "Unsupported track size: " + t;
      return;
    }
    if ( unit.unitType == 1 ) {
      track.kind = 1;
      track.value = unit.value;
    } else {
      track.kind = 0;
      track.value = unit.value;
    }
    this.tracks.push(track);
  };
  hasIntrinsicTrack () {
    let i = 0;
    while (i < this.tracks.length) {
      const t = this.tracks[i];
      if ( t.kind == 3 ) {
        return true;
      }
      i = i + 1;
    };
    return false;
  };
  resolve (available) {
    let empty = [];
    let empty2 = [];
    this.resolveWithContent(available, empty, empty2);
  };
  resolveWithContent (available, content, minContent) {
    const n = this.tracks.length;
    let used = 0.0;
    let totalFr = 0.0;
    let i = 0;
    while (i < n) {
      const t = this.tracks[i];
      t.frozen = false;
      if ( t.hasMin ) {
        t.minUnit.resolve(available, 16.0);
      }
      if ( t.hasMax ) {
        t.maxUnit.resolve(available, 16.0);
      }
      if ( t.kind == 0 ) {
        t.sizePx = t.value;
        used = used + t.sizePx;
        t.frozen = true;
      }
      if ( t.kind == 1 ) {
        t.sizePx = (available * t.value) / 100.0;
        used = used + t.sizePx;
        t.frozen = true;
      }
      if ( t.kind == 2 ) {
        totalFr = totalFr + t.value;
      }
      if ( t.kind == 3 ) {
        let c = 0.0;
        if ( i < content.length ) {
          c = content[i];
        }
        if ( t.hasFitLimit ) {
          t.fitLimit.resolve(available, 16.0);
          if ( c > t.fitLimit.pixels ) {
            c = t.fitLimit.pixels;
          }
          if ( i < minContent.length ) {
            const floorPx = minContent[i];
            if ( c < floorPx ) {
              c = floorPx;
            }
          }
        }
        t.sizePx = c;
        used = used + c;
        t.frozen = true;
      }
      i = i + 1;
    };
    let poolSpace = available - used;
    if ( poolSpace < 0.0 ) {
      poolSpace = 0.0;
    }
    let poolFr = totalFr;
    let pass = 0;
    let settled = false;
    while (pass <= n && settled == false) {
      settled = true;
      let j = 0;
      while (j < n) {
        const t2 = this.tracks[j];
        if ( t2.kind == 2 && t2.frozen == false ) {
          let size = 0.0;
          if ( poolFr > 0.0 ) {
            size = (poolSpace * t2.value) / poolFr;
          }
          let clamped = size;
          if ( t2.hasMin ) {
            if ( clamped < t2.minUnit.pixels ) {
              clamped = t2.minUnit.pixels;
            }
          }
          if ( t2.hasMax ) {
            if ( clamped > t2.maxUnit.pixels ) {
              clamped = t2.maxUnit.pixels;
            }
          }
          t2.sizePx = clamped;
          if ( clamped != size ) {
            t2.frozen = true;
            poolSpace = poolSpace - clamped;
            poolFr = poolFr - t2.value;
            if ( poolSpace < 0.0 ) {
              poolSpace = 0.0;
            }
            settled = false;
          }
        }
        j = j + 1;
      };
      pass = pass + 1;
    };
    let k = 0;
    while (k < n) {
      const t3 = this.tracks[k];
      if ( t3.kind != 2 ) {
        if ( t3.hasMin ) {
          if ( t3.sizePx < t3.minUnit.pixels ) {
            t3.sizePx = t3.minUnit.pixels;
          }
        }
        if ( t3.hasMax ) {
          if ( t3.sizePx > t3.maxUnit.pixels ) {
            t3.sizePx = t3.maxUnit.pixels;
          }
        }
      }
      k = k + 1;
    };
  };
  extentOf (from, span, gap) {
    let total = 0.0;
    const n = this.tracks.length;
    let i = from;
    let placed = 0;
    while (i < n && placed < span) {
      const tk = this.tracks[i];
      total = total + tk.sizePx;
      placed = placed + 1;
      i = i + 1;
    };
    if ( placed > 1 ) {
      total = total + (placed - 1) * gap;
    }
    return total;
  };
  offsetOf (index, gap) {
    let total = 0.0;
    let i = 0;
    while (i < index) {
      const tk = this.tracks[i];
      total = total + tk.sizePx;
      total = total + gap;
      i = i + 1;
    };
    return total;
  };
}
EVGGridTemplate.isLineNameToken = function(tok) {
  const __len = tok.length;
  if ( __len < 2 ) {
    return false;
  }
  if ( tok.charCodeAt(0 ) != 91 ) {
    return false;
  }
  return tok.charCodeAt(__len - 1 ) == 93;
};
EVGGridTemplate.parse = function(spec) {
  const tpl = new EVGGridTemplate();
  const tokens = EVGGridTemplate.tokenize(spec);
  let i = 0;
  while (i < tokens.length) {
    const tok = tokens[i];
    if ( EVGGridTemplate.isLineNameToken(tok) ) {
      tpl.addLineNames(tok);
    } else {
      if ( EVGGridTemplate.isRepeat(tok) ) {
        tpl.expandRepeat(tok);
      } else {
        if ( EVGGridTemplate.isMinmax(tok) ) {
          tpl.addMinmax(tok);
        } else {
          tpl.addTrack(tok);
        }
      }
    }
    i = i + 1;
  };
  return tpl;
};
EVGGridTemplate.tokenize = function(spec) {
  let out = [];
  const __len = spec.length;
  let depth = 0;
  let start = 0;
  let inTok = false;
  let i = 0;
  while (i < __len) {
    const c = spec.charCodeAt(i );
    if ( c == 40 || c == 91 ) {
      depth = depth + 1;
    }
    if ( c == 41 || c == 93 ) {
      depth = depth - 1;
    }
    const isSpace = (c == 32 || c == 9) || (c == 10 || c == 13);
    if ( isSpace && depth == 0 ) {
      if ( inTok ) {
        out.push(spec.substring(start, i ));
        inTok = false;
      }
    } else {
      if ( inTok == false ) {
        start = i;
        inTok = true;
      }
    }
    i = i + 1;
  };
  if ( inTok ) {
    out.push(spec.substring(start, __len ));
  }
  return out;
};
EVGGridTemplate.isRepeat = function(tok) {
  if ( tok.length < 8 ) {
    return false;
  }
  return tok.substring(0, 7 ) == "repeat(";
};
EVGGridTemplate.isMinmax = function(tok) {
  if ( tok.length < 8 ) {
    return false;
  }
  return tok.substring(0, 7 ) == "minmax(";
};
EVGGridTemplate.isFrToken = function(tok) {
  const __len = tok.length;
  if ( __len < 2 ) {
    return false;
  }
  return tok.substring(__len - 2, __len ) == "fr";
};
EVGGridTemplate.isFitContent = function(tok) {
  if ( tok.length < 14 ) {
    return false;
  }
  if ( tok.substring(0, 12 ) != "fit-content(" ) {
    return false;
  }
  return tok.charCodeAt(tok.length - 1 ) == 41;
};
class EVGGridAreas  {
  constructor() {
    this.names = [];
    this.rowStart = [];
    this.colStart = [];
    this.rowSpan = [];
    this.colSpan = [];
    this.columns = 0;
    this.rows = 0;
    this.hadError = false;
    this.errorText = "";
    this.columns = 0;
    this.rows = 0;
    this.hadError = false;
    this.errorText = "";
  }
  count () {
    return this.names.length;
  };
  indexOfName (name) {
    let i = 0;
    while (i < this.names.length) {
      if ( this.names[i] == name ) {
        return i;
      }
      i = i + 1;
    };
    return 0 - 1;
  };
  build (rowsOut) {
    this.rows = rowsOut.length;
    let cells = [];
    let r = 0;
    while (r < this.rows) {
      const toks = EVGGridTemplate.tokenize(rowsOut[r]);
      if ( r == 0 ) {
        this.columns = toks.length;
      } else {
        if ( toks.length != this.columns ) {
          this.hadError = true;
          this.errorText = "grid-template-areas rows must all have the same number of columns";
          return;
        }
      }
      let c = 0;
      while (c < toks.length) {
        cells.push(toks[c]);
        c = c + 1;
      };
      r = r + 1;
    };
    if ( this.columns == 0 ) {
      this.hadError = true;
      this.errorText = "grid-template-areas has no columns";
      return;
    }
    let rr = 0;
    while (rr < this.rows) {
      let cc = 0;
      while (cc < this.columns) {
        const name = cells[(rr * this.columns + cc)];
        if ( name != "." ) {
          const at = this.indexOfName(name);
          if ( at < 0 ) {
            this.names.push(name);
            this.rowStart.push(rr);
            this.colStart.push(cc);
            this.rowSpan.push(1);
            this.colSpan.push(1);
          } else {
            const r0 = this.rowStart[at];
            const c0 = this.colStart[at];
            const rs = this.rowSpan[at];
            const cs = this.colSpan[at];
            if ( rr + 1 > r0 + rs ) {
              this.rowSpan[at] = (rr + 1) - r0;
            }
            if ( cc + 1 > c0 + cs ) {
              this.colSpan[at] = (cc + 1) - c0;
            }
          }
        }
        cc = cc + 1;
      };
      rr = rr + 1;
    };
    const n = this.names.length;
    let k = 0;
    while (k < n) {
      const nm = this.names[k];
      const r0_1 = this.rowStart[k];
      const c0_1 = this.colStart[k];
      const rs_1 = this.rowSpan[k];
      const cs_1 = this.colSpan[k];
      let a = 0;
      while (a < rs_1) {
        let b = 0;
        while (b < cs_1) {
          const idx = (r0_1 + a) * this.columns + (c0_1 + b);
          if ( cells[idx] != nm ) {
            this.hadError = true;
            this.errorText = ("Area \"" + nm) + "\" is not a rectangle in grid-template-areas";
            return;
          }
          b = b + 1;
        };
        a = a + 1;
      };
      k = k + 1;
    };
  };
}
EVGGridAreas.parse = function(spec) {
  const areas = new EVGGridAreas();
  let rowsOut = [];
  let cur = "";
  let inQuote = false;
  let quoteCh = 0;
  let i = 0;
  const __len = spec.length;
  while (i < __len) {
    const c = spec.charCodeAt(i );
    if ( inQuote ) {
      if ( c == quoteCh ) {
        rowsOut.push(cur);
        cur = "";
        inQuote = false;
      } else {
        cur = cur + String.fromCharCode(c);
      }
    } else {
      if ( c == 34 || c == 39 ) {
        inQuote = true;
        quoteCh = c;
      }
    }
    i = i + 1;
  };
  if ( inQuote ) {
    areas.hadError = true;
    areas.errorText = "Unterminated row in grid-template-areas: " + spec;
    return areas;
  }
  if ( rowsOut.length == 0 ) {
    areas.hadError = true;
    areas.errorText = "grid-template-areas needs quoted rows: " + spec;
    return areas;
  }
  areas.build(rowsOut);
  return areas;
};
class EVGGridPlacement  {
  constructor() {
    this.start = 0;
    this.span = 1;
    this.hadError = false;
    this.errorText = "";
    this.startName = "";
    this.endName = "";
    this.endLine = 0;
    this.spanExplicit = false;
    this.start = 0;
    this.span = 1;
    this.hadError = false;
    this.errorText = "";
    this.startName = "";
    this.endName = "";
    this.endLine = 0;
    this.spanExplicit = false;
  }
  takeStart (token) {
    if ( EVGGridPlacement.isNumericToken(token) ) {
      this.start = EVGGridPlacement.lineNumber(token);
      if ( this.start == 0 ) {
        this.reject(token);
      }
    } else {
      this.startName = token;
    }
  };
  takeEnd (token) {
    if ( EVGGridPlacement.isNumericToken(token) ) {
      this.endLine = EVGGridPlacement.lineNumber(token);
      if ( this.endLine == 0 ) {
        this.reject(token);
      }
    } else {
      this.endName = token;
    }
  };
  applyEndLine () {
    if ( this.spanExplicit ) {
      return;
    }
    if ( this.start < 1 ) {
      return;
    }
    if ( this.endLine > this.start ) {
      this.span = this.endLine - this.start;
    }
  };
  resolveNames (tpl) {
    if ( this.startName.length > 0 ) {
      const n = tpl.lineNumberNamed(this.startName);
      if ( n > 0 ) {
        this.start = n;
        this.startName = "";
      } else {
        this.rejectName(this.startName);
      }
    }
    if ( this.endName.length > 0 ) {
      const e = tpl.lineNumberNamed(this.endName);
      if ( e > 0 ) {
        this.endLine = e;
        this.endName = "";
      } else {
        this.rejectName(this.endName);
      }
    }
    this.applyEndLine();
  };
  rejectName (name) {
    if ( this.hadError ) {
      return;
    }
    this.hadError = true;
    this.errorText = ("no line named \"" + name) + "\"; the item was auto-placed";
  };
  reject (token) {
    if ( this.hadError ) {
      return;
    }
    this.hadError = true;
    this.errorText = ("unsupported line \"" + token) + "\" (negative line numbers are not supported); the item was auto-placed";
  };
}
EVGGridPlacement.parse = function(spec) {
  const p = new EVGGridPlacement();
  const s = spec.trim();
  if ( s.length == 0 ) {
    return p;
  }
  let slash = 0 - 1;
  let i = 0;
  while (i < s.length) {
    if ( s.charCodeAt(i ) == 47 ) {
      slash = i;
      i = s.length;
    } else {
      i = i + 1;
    }
  };
  if ( slash < 0 ) {
    if ( EVGGridPlacement.isSpan(s) ) {
      p.span = EVGGridPlacement.spanCount(s);
      p.spanExplicit = true;
    } else {
      p.takeStart(s);
    }
    return p;
  }
  const lhs = s.substring(0, slash ).trim();
  const rhs = s.substring(slash + 1, s.length ).trim();
  p.takeStart(lhs);
  if ( EVGGridPlacement.isSpan(rhs) ) {
    p.span = EVGGridPlacement.spanCount(rhs);
    p.spanExplicit = true;
  } else {
    p.takeEnd(rhs);
  }
  p.applyEndLine();
  return p;
};
EVGGridPlacement.isNumericToken = function(s) {
  if ( s.length == 0 ) {
    return false;
  }
  const c = s.charCodeAt(0 );
  if ( c >= 48 && c <= 57 ) {
    return true;
  }
  return c == 45 || c == 43;
};
EVGGridPlacement.isSpan = function(s) {
  if ( s.length < 4 ) {
    return false;
  }
  return s.substring(0, 4 ) == "span";
};
EVGGridPlacement.spanCount = function(s) {
  const rest = s.substring(4, s.length ).trim();
  const v = isNaN( parseFloat(rest) ) ? undefined : parseFloat(rest);
  if ( typeof(v) != "undefined" ) {
    const n = Math.floor( v);
    if ( n >= 1 ) {
      return n;
    }
  }
  return 1;
};
EVGGridPlacement.lineNumber = function(s) {
  const v = isNaN( parseFloat(s) ) ? undefined : parseFloat(s);
  if ( typeof(v) != "undefined" ) {
    const n = Math.floor( v);
    if ( n >= 1 ) {
      return n;
    }
  }
  return 0;
};
class EVGGrapheme  {
  constructor() {
  }
}
EVGGrapheme.isZWJ = function(cp) {
  return cp == 8205;
};
EVGGrapheme.isRegionalIndicator = function(cp) {
  if ( cp < 127462 ) {
    return false;
  }
  return cp <= 127487;
};
EVGGrapheme.isEmojiModifier = function(cp) {
  if ( cp < 127995 ) {
    return false;
  }
  return cp <= 127999;
};
EVGGrapheme.isTag = function(cp) {
  if ( cp < 917536 ) {
    return false;
  }
  return cp <= 917631;
};
EVGGrapheme.isExtend = function(cp) {
  if ( cp >= 768 && cp <= 879 ) {
    return true;
  }
  if ( cp >= 6832 && cp <= 6911 ) {
    return true;
  }
  if ( cp >= 7616 && cp <= 7679 ) {
    return true;
  }
  if ( cp >= 8400 && cp <= 8447 ) {
    return true;
  }
  if ( cp >= 65024 && cp <= 65039 ) {
    return true;
  }
  if ( cp >= 65056 && cp <= 65071 ) {
    return true;
  }
  if ( EVGGrapheme.isEmojiModifier(cp) ) {
    return true;
  }
  return EVGGrapheme.isTag(cp);
};
EVGGrapheme.clusterEnd = function(cps, start) {
  const n = cps.length;
  if ( start >= n ) {
    return n;
  }
  let i = start + 1;
  if ( EVGGrapheme.isRegionalIndicator(cps[start]) ) {
    if ( i < n ) {
      if ( EVGGrapheme.isRegionalIndicator(cps[i]) ) {
        i = i + 1;
      }
    }
    return i;
  }
  let more = true;
  while (more) {
    more = false;
    if ( i < n ) {
      const cp = cps[i];
      if ( EVGGrapheme.isExtend(cp) ) {
        i = i + 1;
        more = true;
      } else {
        if ( EVGGrapheme.isZWJ(cp) ) {
          if ( i + 1 < n ) {
            i = i + 2;
            more = true;
          }
        }
      }
    }
  };
  return i;
};
EVGGrapheme.boundaries = function(cps) {
  let out = [];
  let i = 0;
  const n = cps.length;
  while (i < n) {
    out.push(i);
    i = EVGGrapheme.clusterEnd(cps, i);
  };
  out.push(n);
  return out;
};
EVGGrapheme.clusterCount = function(s) {
  const cps = EVGCodepoint.toArray(s);
  let n = 0;
  let i = 0;
  while (i < cps.length) {
    i = EVGGrapheme.clusterEnd(cps, i);
    n = n + 1;
  };
  return n;
};
EVGGrapheme.clusterAt = function(s, i) {
  const cps = EVGCodepoint.toArray(s);
  let cpIdx = 0;
  let u = 0;
  while (u < i) {
    u = u + EVGCodepoint.unitsAt(s, u);
    cpIdx = cpIdx + 1;
  };
  const end = EVGGrapheme.clusterEnd(cps, cpIdx);
  let out = "";
  let k = cpIdx;
  while (k < end) {
    out = out + EVGCodepoint.toStr(cps[k]);
    k = k + 1;
  };
  return out;
};
class EVGHostTextMeasurer  extends EVGTextMeasurer {
  constructor() {
    super()
    this.metricFn = undefined;
    this.attached = false;
    this.hostName = "";
    this.generation = 0;
    this.resolvesAll = true;
    this.known = [];
    this.faceKeys = [];
    this.faceAsc = [];
    this.faceDesc = [];
    this.faceGap = [];
    this.lastKey = "";
    this.lastIdx = 0 - 1;
    this.widthCalls = 0;
    this.faceCalls = 0;
    this.fallback = new SimpleTextMeasurer();
  }
  attach (f, name) {
    this.metricFn = f;
    this.hostName = name;
    this.attached = true;
    this.invalidate();
  };
  detach () {
    this.attached = false;
    this.invalidate();
  };
  invalidate () {
    this.generation = this.generation + 1;
    let fk = [];
    this.faceKeys = fk;
    let fa = [];
    this.faceAsc = fa;
    let fd = [];
    this.faceDesc = fd;
    let fg = [];
    this.faceGap = fg;
    this.lastKey = "";
    this.lastIdx = 0 - 1;
  };
  setResolvesAll (b) {
    this.resolvesAll = b;
  };
  addKnownFamily (name) {
    if ( name.length == 0 ) {
      return;
    }
    let i = 0;
    while (i < this.known.length) {
      if ( this.known[i] == name ) {
        return;
      }
      i = i + 1;
    };
    this.known.push(name);
  };
  isAttached () {
    return this.attached;
  };
  isFontAccurate () {
    return this.attached;
  };
  hasFace (fontFamily) {
    if ( this.attached == false ) {
      return false;
    }
    if ( this.resolvesAll ) {
      return true;
    }
    const base = EVGHostTextMeasurer.baseFamily(fontFamily);
    let i = 0;
    while (i < this.known.length) {
      if ( this.known[i] == base ) {
        return true;
      }
      i = i + 1;
    };
    return false;
  };
  measureKey () {
    let out = (("host:" + this.hostName) + ":") + (this.generation.toString());
    if ( this.attached == false ) {
      out = out + ":table";
    }
    return out;
  };
  faceIndex (family, size, bold) {
    const key = (((family + "|") + (size.toString())) + "|") + (bold.toString());
    if ( key == this.lastKey ) {
      return this.lastIdx;
    }
    let i = 0;
    while (i < this.faceKeys.length) {
      if ( this.faceKeys[i] == key ) {
        this.lastKey = key;
        this.lastIdx = i;
        return i;
      }
      i = i + 1;
    };
    const f = this.metricFn;
    let asc = f(1, "", family, size, bold, false);
    let desc = f(2, "", family, size, bold, false);
    let gap = f(3, "", family, size, bold, false);
    this.faceCalls = this.faceCalls + 3;
    if ( gap < 0.0 ) {
      gap = 0.0;
    }
    if ( asc + desc <= 0.0 ) {
      asc = size * EVGTextMeasurer.fallbackAscentEm();
      desc = size * EVGTextMeasurer.fallbackDescentEm();
    }
    this.faceKeys.push(key);
    this.faceAsc.push(asc);
    this.faceDesc.push(desc);
    this.faceGap.push(gap);
    this.lastKey = key;
    this.lastIdx = this.faceKeys.length - 1;
    return this.lastIdx;
  };
  measureText (text, fontFamily, fontSize) {
    if ( this.attached == false ) {
      return this.fallback.measureText(text, fontFamily, fontSize);
    }
    const bold = EVGHostTextMeasurer.isBoldFace(fontFamily);
    const family = EVGHostTextMeasurer.baseFamily(fontFamily);
    const fi = this.faceIndex(family, fontSize, bold);
    let w = 0.0;
    if ( text.length > 0 ) {
      const f = this.metricFn;
      w = f(0, text, family, fontSize, bold, false);
      this.widthCalls = this.widthCalls + 1;
    }
    const asc = this.faceAsc[fi];
    const desc = this.faceDesc[fi];
    const gap = this.faceGap[fi];
    const m = new EVGTextMetrics();
    m.width = w;
    m.ascent = asc;
    m.descent = desc;
    m.lineHeight = (asc + desc) + gap;
    m.height = m.lineHeight;
    return m;
  };
  measureTextWidth (text, fontFamily, fontSize) {
    const m = this.measureText(text, fontFamily, fontSize);
    return m.width;
  };
  getLineHeight (fontFamily, fontSize) {
    if ( this.attached == false ) {
      return this.fallback.getLineHeight(fontFamily, fontSize);
    }
    const bold = EVGHostTextMeasurer.isBoldFace(fontFamily);
    const family = EVGHostTextMeasurer.baseFamily(fontFamily);
    const fi = this.faceIndex(family, fontSize, bold);
    const asc = this.faceAsc[fi];
    const desc = this.faceDesc[fi];
    const gap = this.faceGap[fi];
    return (asc + desc) + gap;
  };
}
EVGHostTextMeasurer.KIND_WIDTH = function() {
  return 0;
};
EVGHostTextMeasurer.KIND_ASCENT = function() {
  return 1;
};
EVGHostTextMeasurer.KIND_DESCENT = function() {
  return 2;
};
EVGHostTextMeasurer.KIND_GAP = function() {
  return 3;
};
EVGHostTextMeasurer.isBoldFace = function(face) {
  const n = face.length;
  if ( n < 6 ) {
    return false;
  }
  const tail = face.substring(n - 5, n );
  return tail == "-Bold";
};
EVGHostTextMeasurer.baseFamily = function(face) {
  if ( EVGHostTextMeasurer.isBoldFace(face) ) {
    const n = face.length;
    return face.substring(0, n - 5 );
  }
  return face;
};
class EVGTextLine  {
  constructor() {
    this.text = "";
    this.width = 0.0;
    this.ascent = 0.0;
    this.descent = 0.0;
    this.startsParagraph = false;
    this.text = "";
    this.width = 0.0;
    this.ascent = 0.0;
    this.descent = 0.0;
  }
}
class EVGWrapEntry  {
  constructor() {
    this.lines = [];
  }
}
class EVGTextEngine  {
  constructor() {
    this.measurer = undefined;
    this.strict = false;
    this.reported = [];
    this.warnings = [];
    this.hadFatal = false;
    this.wrapIndex = {};
    this.wrapStore = [];
    this.runIndex = {};
    this.runStore = [];
    this.keyPrefix = "";
    this.keyKind = "";
    this.keyFamily = "";
    this.keySize = -1.0;
    this.keyMax = -1.0;
    this.keyMeasure = "";
    const m = EVGDefaultMeasurer.measurer();
    this.measurer = m;
    this.strict = false;
    this.hadFatal = false;
  }
  setMeasurer (m) {
    this.measurer = m;
    this.clearCache();
  };
  clearCache () {
    let wi = {};
    this.wrapIndex = wi;
    let ws = [];
    this.wrapStore = ws;
    let ri = {};
    this.runIndex = ri;
    let rs = [];
    this.runStore = rs;
  };
  cacheKey (kind, fontFamily, fontSize, maxWidth, text) {
    const mk = this.measurer.measureKey();
    let same = true;
    if ( kind != this.keyKind ) {
      same = false;
    }
    if ( fontFamily != this.keyFamily ) {
      same = false;
    }
    if ( fontSize != this.keySize ) {
      same = false;
    }
    if ( maxWidth != this.keyMax ) {
      same = false;
    }
    if ( mk != this.keyMeasure ) {
      same = false;
    }
    if ( false == same ) {
      this.keyKind = kind;
      this.keyFamily = fontFamily;
      this.keySize = fontSize;
      this.keyMax = maxWidth;
      this.keyMeasure = mk;
      this.keyPrefix = ((((((((kind + "\n") + (fontSize.toString())) + "\n") + (maxWidth.toString())) + "\n") + mk) + "\n") + fontFamily) + "\n";
    }
    return this.keyPrefix + text;
  };
  setStrict (s) {
    this.strict = s;
  };
  warningCount () {
    return this.warnings.length;
  };
  warningAt (i) {
    return this.warnings[i];
  };
  noteFamily (fontFamily) {
    let i = 0;
    while (i < this.reported.length) {
      if ( this.reported[i] == fontFamily ) {
        return;
      }
      i = i + 1;
    };
    this.reported.push(fontFamily);
    if ( this.measurer.isFontAccurate() == false ) {
      this.warnings.push(("No font metrics available for \"" + fontFamily) + "\" - measuring with heuristic widths. Print layout will not match paint.");
      if ( this.strict ) {
        this.hadFatal = true;
      }
      return;
    }
    if ( this.measurer.hasFace(fontFamily) == false ) {
      this.warnings.push(("Font face not loaded: \"" + fontFamily) + "\" - falling back to another face. Widths will not match paint.");
      if ( this.strict ) {
        this.hadFatal = true;
      }
    }
  };
  checkFamily (fontFamily) {
    if ( this.measurer.isFontAccurate() == false ) {
      this.noteFamily(fontFamily);
      return;
    }
    if ( this.measurer.hasFace(fontFamily) == false ) {
      this.noteFamily(fontFamily);
    }
  };
  measureRunSpaced (text, fontFamily, fontSize, spacing) {
    const m = this.measureRun(text, fontFamily, fontSize);
    if ( spacing == 0.0 ) {
      return m;
    }
    const wider = new EVGTextMetrics();
    wider.width = m.width + EVGTextEngine.trackingWidth(text, spacing);
    wider.height = m.height;
    wider.ascent = m.ascent;
    wider.descent = m.descent;
    wider.lineHeight = m.lineHeight;
    return wider;
  };
  measureRun (text, fontFamily, fontSize) {
    this.checkFamily(fontFamily);
    const key = this.cacheKey("m", fontFamily, fontSize, 0.0, text);
    const hit = ( Object.prototype.hasOwnProperty.call(this.runIndex, key) ? this.runIndex[key] : undefined );
    if ( typeof(hit) === "undefined" ) {
      const m = this.measurer.measureText(text, fontFamily, fontSize);
      if ( this.runStore.length >= EVGTextEngine.cacheLimit() ) {
        this.clearCache();
      }
      this.runStore.push(m);
      this.runIndex[key] = this.runStore.length - 1;
      return m;
    }
    return this.runStore[hit];
  };
  lineHeightFor (fontFamily, fontSize) {
    return this.measurer.getLineHeight(fontFamily, fontSize);
  };
  breakLines (text, fontFamily, fontSize, maxWidth) {
    return this.breakLinesSpaced(text, fontFamily, fontSize, maxWidth, 0.0);
  };
  breakLinesSpaced (text, fontFamily, fontSize, maxWidth, spacing) {
    this.checkFamily(fontFamily);
    let key = this.cacheKey("w", fontFamily, fontSize, maxWidth, text);
    if ( spacing != 0.0 ) {
      key = (key + "|ls") + (spacing.toString());
    }
    const hit = ( Object.prototype.hasOwnProperty.call(this.wrapIndex, key) ? this.wrapIndex[key] : undefined );
    if ( typeof(hit) === "undefined" ) {
      const fresh = this.wrapUncached(
        text,
        fontFamily,
        fontSize,
        maxWidth,
        spacing
      );
      if ( this.wrapStore.length >= EVGTextEngine.cacheLimit() ) {
        this.clearCache();
      }
      const entry = new EVGWrapEntry();
      entry.lines = fresh;
      this.wrapStore.push(entry);
      this.wrapIndex[key] = this.wrapStore.length - 1;
      return fresh;
    }
    const kept = this.wrapStore[hit];
    return kept.lines;
  };
  wrapUncached (text, fontFamily, fontSize, maxWidth, spacing) {
    let out = [];
    const paragraphs = text.split("\n");
    let p = 0;
    while (p < paragraphs.length) {
      const para = paragraphs[p];
      const firstOfPara = out.length;
      if ( maxWidth <= 0.0 ) {
        out.push(this.measuredLineSpaced(para, fontFamily, fontSize, spacing));
      } else {
        const words = para.split(" ");
        let currentLine = "";
        let tokensOnLine = 0;
        let w = 0;
        while (w < words.length) {
          const word = words[w];
          let testLine = "";
          if ( tokensOnLine == 0 ) {
            testLine = word;
          } else {
            testLine = (currentLine + " ") + word;
          }
          const testWidth = this.measurer.measureTextWidth(
            testLine,
            fontFamily,
            fontSize
          ) + EVGTextEngine.trackingWidth(testLine, spacing);
          if ( testWidth - maxWidth > EVGTextEngine.fitEpsilon() && tokensOnLine > 0 ) {
            out.push(this.measuredLineSpaced(
              currentLine,
              fontFamily,
              fontSize,
              spacing
            ));
            currentLine = word;
            tokensOnLine = 1;
          } else {
            currentLine = testLine;
            tokensOnLine = tokensOnLine + 1;
          }
          w = w + 1;
        };
        out.push(this.measuredLineSpaced(
          currentLine,
          fontFamily,
          fontSize,
          spacing
        ));
      }
      if ( p > 0 ) {
        if ( firstOfPara < out.length ) {
          const opener = out[firstOfPara];
          opener.startsParagraph = true;
        }
      }
      p = p + 1;
    };
    if ( out.length == 0 ) {
      out.push(this.measuredLineSpaced("", fontFamily, fontSize, spacing));
    }
    return out;
  };
  measuredLine (text, fontFamily, fontSize) {
    return this.measuredLineSpaced(text, fontFamily, fontSize, 0.0);
  };
  measuredLineSpaced (text, fontFamily, fontSize, spacing) {
    const m = this.measurer.measureText(text, fontFamily, fontSize);
    const line = new EVGTextLine();
    line.text = text;
    line.width = m.width + EVGTextEngine.trackingWidth(text, spacing);
    line.ascent = m.ascent;
    line.descent = m.descent;
    return line;
  };
  lineCount (text, fontFamily, fontSize, maxWidth) {
    return this.lineCountSpaced(text, fontFamily, fontSize, maxWidth, 0.0);
  };
  lineCountSpaced (text, fontFamily, fontSize, maxWidth, spacing) {
    const lines = this.breakLinesSpaced(
      text,
      fontFamily,
      fontSize,
      maxWidth,
      spacing
    );
    return lines.length;
  };
  maxLineWidth (text, fontFamily, fontSize) {
    return this.maxLineWidthSpaced(text, fontFamily, fontSize, 0.0);
  };
  maxLineWidthSpaced (text, fontFamily, fontSize, spacing) {
    const lines = this.breakLinesSpaced(
      text,
      fontFamily,
      fontSize,
      0.0,
      spacing
    );
    let maxW = 0.0;
    let i = 0;
    while (i < lines.length) {
      const ln = lines[i];
      if ( ln.width > maxW ) {
        maxW = ln.width;
      }
      i = i + 1;
    };
    return maxW;
  };
  minLineWidth (text, fontFamily, fontSize) {
    return this.minLineWidthSpaced(text, fontFamily, fontSize, 0.0);
  };
  minLineWidthSpaced (text, fontFamily, fontSize, spacing) {
    const lines = this.breakLinesSpaced(
      text,
      fontFamily,
      fontSize,
      0.001,
      spacing
    );
    let maxW = 0.0;
    let i = 0;
    while (i < lines.length) {
      const ln = lines[i];
      if ( ln.width > maxW ) {
        maxW = ln.width;
      }
      i = i + 1;
    };
    return maxW;
  };
  paragraphLeading (text, fontFamily, fontSize, maxWidth, spacing, paragraphSpacing) {
    if ( paragraphSpacing == 0.0 ) {
      return 0.0;
    }
    const lines = this.breakLinesSpaced(
      text,
      fontFamily,
      fontSize,
      maxWidth,
      spacing
    );
    let breaks = 0;
    let i = 0;
    while (i < lines.length) {
      if ( lines[i].startsParagraph ) {
        breaks = breaks + 1;
      }
      i = i + 1;
    };
    return breaks * paragraphSpacing;
  };
  breakToStrings (text, fontFamily, fontSize, maxWidth) {
    return this.breakToStringsSpaced(text, fontFamily, fontSize, maxWidth, 0.0);
  };
  breakToStringsSpaced (text, fontFamily, fontSize, maxWidth, spacing) {
    let out = [];
    const lines = this.breakLinesSpaced(
      text,
      fontFamily,
      fontSize,
      maxWidth,
      spacing
    );
    let i = 0;
    while (i < lines.length) {
      const ln = lines[i];
      out.push(ln.text);
      i = i + 1;
    };
    return out;
  };
}
EVGTextEngine.fitEpsilon = function() {
  return 0.000001;
};
EVGTextEngine.cacheLimit = function() {
  return 4096;
};
EVGTextEngine.trackingWidth = function(text, spacing) {
  if ( spacing == 0.0 ) {
    return 0.0;
  }
  return EVGGrapheme.clusterCount(text) * spacing;
};
class ConnPt  {
  constructor() {
    this.x = 0.0;
    this.y = 0.0;
    this.nx = 0.0;
    this.ny = 0.0;
  }
}
class EVGConnector  {
  constructor() {
  }
}
EVGConnector.resolveAll = function(root) {
  let names = [];
  let nodes = [];
  EVGConnector.collectAnchors(root, names, nodes);
  return EVGConnector.resolveWith(root, names, nodes);
};
EVGConnector.resolveWith = function(root, names, nodes) {
  let warnings = [];
  let conns = [];
  EVGConnector.collect(root, conns);
  if ( conns.length == 0 ) {
    return warnings;
  }
  let i = 0;
  while (i < conns.length) {
    const c = conns[i];
    EVGConnector.solve(c, names, nodes, warnings);
    i = i + 1;
  };
  return warnings;
};
EVGConnector.collect = function(el, out) {
  if ( el.tagName == "connector" ) {
    out.push(el);
  }
  let i = 0;
  const n = el.getChildCount();
  while (i < n) {
    const kid = el.getChild(i);
    EVGConnector.collect(kid, out);
    i = i + 1;
  };
};
EVGConnector.collectAnchors = function(el, names, nodes) {
  if ( el.anchorName.length > 0 ) {
    names.push(el.anchorName);
    nodes.push(el);
  }
  if ( el.id.length > 0 ) {
    names.push("#" + el.id);
    nodes.push(el);
  }
  let i = 0;
  const n = el.getChildCount();
  while (i < n) {
    const kid = el.getChild(i);
    EVGConnector.collectAnchors(kid, names, nodes);
    i = i + 1;
  };
};
EVGConnector.lookup = function(key, names, nodes) {
  let miss;
  const k = key.trim();
  if ( k.length == 0 ) {
    return miss;
  }
  let i = 0;
  const n = names.length;
  while (i < n) {
    const nm = names[i];
    if ( nm == k ) {
      const hit = nodes[i];
      return hit;
    }
    i = i + 1;
  };
  return miss;
};
EVGConnector.pointOn = function(el, side) {
  const p = new ConnPt();
  const x = el.calculatedX;
  const y = el.calculatedY;
  const w = el.calculatedWidth;
  const h = el.calculatedHeight;
  const cx = x + w / 2.0;
  const cy = y + h / 2.0;
  p.x = cx;
  p.y = cy;
  p.nx = 0.0;
  p.ny = 0.0;
  if ( side == "left" ) {
    p.x = x;
    p.nx = 0.0 - 1.0;
  }
  if ( side == "right" ) {
    p.x = x + w;
    p.nx = 1.0;
  }
  if ( side == "top" ) {
    p.y = y;
    p.ny = 0.0 - 1.0;
  }
  if ( side == "bottom" ) {
    p.y = y + h;
    p.ny = 1.0;
  }
  if ( side == "top-left" ) {
    p.x = x;
    p.y = y;
    p.nx = 0.0 - 0.7071;
    p.ny = 0.0 - 0.7071;
  }
  if ( side == "top-right" ) {
    p.x = x + w;
    p.y = y;
    p.nx = 0.7071;
    p.ny = 0.0 - 0.7071;
  }
  if ( side == "bottom-left" ) {
    p.x = x;
    p.y = y + h;
    p.nx = 0.0 - 0.7071;
    p.ny = 0.7071;
  }
  if ( side == "bottom-right" ) {
    p.x = x + w;
    p.y = y + h;
    p.nx = 0.7071;
    p.ny = 0.7071;
  }
  return p;
};
EVGConnector.knownSide = function(side) {
  if ( (side == "left" || side == "right") || side == "top" ) {
    return true;
  }
  if ( (side == "bottom" || side == "center") || side == "top-left" ) {
    return true;
  }
  if ( (side == "top-right" || side == "bottom-left") || side == "bottom-right" ) {
    return true;
  }
  return false;
};
EVGConnector.num = function(v) {
  let x = v;
  let neg = false;
  if ( x < 0.0 ) {
    neg = true;
    x = 0.0 - x;
  }
  const scaled = Math.floor( x * 100.0 + 0.5);
  const whole = ((scaled / 100) | 0);
  const frac = scaled - whole * 100;
  let out = (whole.toString());
  if ( frac > 0 ) {
    let fs = (frac.toString());
    if ( frac < 10 ) {
      fs = "0" + fs;
    }
    if ( frac - ((frac / 10) | 0) * 10 == 0 ) {
      fs = (((frac / 10) | 0).toString());
    }
    out = (out + ".") + fs;
  }
  if ( neg ) {
    out = "-" + out;
  }
  return out;
};
EVGConnector.moveTo = function(x, y) {
  return (("M " + EVGConnector.num(x)) + " ") + EVGConnector.num(y);
};
EVGConnector.lineTo = function(x, y) {
  return ((" L " + EVGConnector.num(x)) + " ") + EVGConnector.num(y);
};
EVGConnector.arrowHead = function(kind, tx, ty, dx, dy, size) {
  const __len = Math.sqrt(dx * dx + dy * dy);
  if ( __len < 0.000001 ) {
    return "";
  }
  const ux = dx / __len;
  const uy = dy / __len;
  const ca = 0.0 - 0.8660254;
  const sa = 0.5;
  const b1x = tx + size * (ux * ca - uy * sa);
  const b1y = ty + size * (ux * sa + uy * ca);
  const b2x = tx + size * (ux * ca + uy * sa);
  const b2y = ty + size * ((0.0 - ux * sa) + uy * ca);
  if ( kind == "triangle" ) {
    let tri = EVGConnector.moveTo(tx, ty);
    tri = tri + EVGConnector.lineTo(b1x, b1y);
    tri = tri + EVGConnector.lineTo(b2x, b2y);
    tri = tri + " Z";
    return tri;
  }
  let open = EVGConnector.moveTo(b1x, b1y);
  open = open + EVGConnector.lineTo(tx, ty);
  open = open + EVGConnector.lineTo(b2x, b2y);
  return open;
};
EVGConnector.wantsArrow = function(kind) {
  if ( kind.length == 0 ) {
    return false;
  }
  if ( kind == "none" ) {
    return false;
  }
  if ( kind == "false" ) {
    return false;
  }
  return true;
};
EVGConnector.headKind = function(kind) {
  if ( kind == "open" ) {
    return "open";
  }
  return "triangle";
};
EVGConnector.solve = function(c, names, nodes, warnings) {
  c.connectorResolved = false;
  if ( c.connectorFrom.length == 0 ) {
    warnings.push("connector: `from` names no element");
    c.svgPath = "";
    c.arrowPath = "";
    return;
  }
  if ( c.connectorTo.length == 0 ) {
    warnings.push("connector: `to` names no element");
    c.svgPath = "";
    c.arrowPath = "";
    return;
  }
  const fromEl = EVGConnector.lookup(c.connectorFrom, names, nodes);
  const toEl = EVGConnector.lookup(c.connectorTo, names, nodes);
  if ( typeof(fromEl) === "undefined" ) {
    warnings.push(("connector: nothing is called \"" + c.connectorFrom) + "\" — give the target an anchor-name or an id");
    c.svgPath = "";
    c.arrowPath = "";
    return;
  }
  if ( typeof(toEl) === "undefined" ) {
    warnings.push(("connector: nothing is called \"" + c.connectorTo) + "\" — give the target an anchor-name or an id");
    c.svgPath = "";
    c.arrowPath = "";
    return;
  }
  const a = fromEl;
  const b = toEl;
  const acx = a.calculatedX + a.calculatedWidth / 2.0;
  const acy = a.calculatedY + a.calculatedHeight / 2.0;
  const bcx = b.calculatedX + b.calculatedWidth / 2.0;
  const bcy = b.calculatedY + b.calculatedHeight / 2.0;
  const dx = bcx - acx;
  const dy = bcy - acy;
  const horizontal = Math.abs(dx) >= Math.abs(dy);
  const fs = EVGConnector.resolveSide(
    c.connectorFromSide,
    horizontal,
    dx,
    dy,
    false,
    warnings
  );
  const ts = EVGConnector.resolveSide(
    c.connectorToSide,
    horizontal,
    dx,
    dy,
    true,
    warnings
  );
  const p0 = EVGConnector.pointOn(a, fs);
  const p1 = EVGConnector.pointOn(b, ts);
  p0.x = p0.x + p0.nx * c.connectorFromOffset;
  p0.y = p0.y + p0.ny * c.connectorFromOffset;
  p1.x = p1.x + p1.nx * c.connectorToOffset;
  p1.y = p1.y + p1.ny * c.connectorToOffset;
  let xs = [];
  let ys = [];
  let routing = c.connectorRouting;
  if ( routing.length == 0 ) {
    routing = "straight";
  }
  const bezier = routing == "bezier";
  let c0x = 0.0;
  let c0y = 0.0;
  let c1x = 0.0;
  let c1y = 0.0;
  xs.push(p0.x);
  ys.push(p0.y);
  if ( routing == "orthogonal" ) {
    let turnsHorizontally = Math.abs(p0.nx) > 0.000001;
    if ( Math.abs(p0.nx) < 0.000001 && Math.abs(p0.ny) < 0.000001 ) {
      turnsHorizontally = horizontal;
    }
    if ( turnsHorizontally ) {
      const midX = (p0.x + p1.x) / 2.0;
      xs.push(midX);
      ys.push(p0.y);
      xs.push(midX);
      ys.push(p1.y);
    } else {
      const midY = (p0.y + p1.y) / 2.0;
      xs.push(p0.x);
      ys.push(midY);
      xs.push(p1.x);
      ys.push(midY);
    }
  }
  if ( bezier ) {
    const span = Math.sqrt(dx * dx + dy * dy);
    let k = span * 0.4;
    if ( k < 40.0 ) {
      k = 40.0;
    }
    c0x = p0.x + p0.nx * k;
    c0y = p0.y + p0.ny * k;
    c1x = p1.x + p1.nx * k;
    c1y = p1.y + p1.ny * k;
  }
  xs.push(p1.x);
  ys.push(p1.y);
  const count = xs.length;
  let endDx = p1.x - xs[(count - 2)];
  let endDy = p1.y - ys[(count - 2)];
  let startDx = p0.x - xs[1];
  let startDy = p0.y - ys[1];
  if ( bezier ) {
    endDx = p1.x - c1x;
    endDy = p1.y - c1y;
    startDx = p0.x - c0x;
    startDy = p0.y - c0y;
  }
  const headEnd = EVGConnector.wantsArrow(c.arrowEnd);
  const headStart = EVGConnector.wantsArrow(c.arrowStart);
  let d = EVGConnector.moveTo(p0.x, p0.y);
  if ( bezier ) {
    d = d + EVGConnector.curveTo(c0x, c0y, c1x, c1y, p1.x, p1.y);
  } else {
    let i = 1;
    while (i < count) {
      d = d + EVGConnector.lineTo(xs[i], ys[i]);
      i = i + 1;
    };
  }
  let size = c.arrowSize;
  if ( size <= 0.0 ) {
    size = 10.0;
  }
  let heads = "";
  if ( headEnd ) {
    const kindE = EVGConnector.headKind(c.arrowEnd);
    const head = EVGConnector.arrowHead(kindE, p1.x, p1.y, endDx, endDy, size);
    if ( head.length > 0 ) {
      if ( kindE == "triangle" ) {
        heads = heads + head;
      } else {
        d = (d + " ") + head;
      }
    }
  }
  if ( headStart ) {
    const kindS = EVGConnector.headKind(c.arrowStart);
    const head2 = EVGConnector.arrowHead(
      kindS,
      p0.x,
      p0.y,
      startDx,
      startDy,
      size
    );
    if ( head2.length > 0 ) {
      if ( kindS == "triangle" ) {
        if ( heads.length > 0 ) {
          heads = heads + " ";
        }
        heads = heads + head2;
      } else {
        d = (d + " ") + head2;
      }
    }
  }
  c.arrowPath = heads;
  let minX = xs[0];
  let maxX = minX;
  let minY = ys[0];
  let maxY = minY;
  let k2 = 0;
  while (k2 < count) {
    const px = xs[k2];
    const py = ys[k2];
    if ( px < minX ) {
      minX = px;
    }
    if ( px > maxX ) {
      maxX = px;
    }
    if ( py < minY ) {
      minY = py;
    }
    if ( py > maxY ) {
      maxY = py;
    }
    k2 = k2 + 1;
  };
  if ( bezier ) {
    if ( c0x < minX ) {
      minX = c0x;
    }
    if ( c0x > maxX ) {
      maxX = c0x;
    }
    if ( c1x < minX ) {
      minX = c1x;
    }
    if ( c1x > maxX ) {
      maxX = c1x;
    }
    if ( c0y < minY ) {
      minY = c0y;
    }
    if ( c0y > maxY ) {
      maxY = c0y;
    }
    if ( c1y < minY ) {
      minY = c1y;
    }
    if ( c1y > maxY ) {
      maxY = c1y;
    }
  }
  let pad = c.strokeWidth / 2.0 + 1.0;
  if ( headEnd || headStart ) {
    pad = pad + size;
  }
  minX = minX - pad;
  minY = minY - pad;
  maxX = maxX + pad;
  maxY = maxY + pad;
  const bw = maxX - minX;
  const bh = maxY - minY;
  c.svgPath = d;
  c.viewBox = (((EVGConnector.num(minX) + " ") + EVGConnector.num(minY)) + " ") + ((EVGConnector.num(bw) + " ") + EVGConnector.num(bh));
  c.calculatedX = minX;
  c.calculatedY = minY;
  c.calculatedWidth = bw;
  c.calculatedHeight = bh;
  c.calculatedInnerWidth = bw;
  c.calculatedInnerHeight = bh;
  c.connectorResolved = true;
};
EVGConnector.curveTo = function(ax, ay, bx, by, ex, ey) {
  let out = " C " + EVGConnector.num(ax);
  out = (out + " ") + EVGConnector.num(ay);
  out = (out + " ") + EVGConnector.num(bx);
  out = (out + " ") + EVGConnector.num(by);
  out = (out + " ") + EVGConnector.num(ex);
  out = (out + " ") + EVGConnector.num(ey);
  return out;
};
EVGConnector.resolveSide = function(declared, horizontal, dx, dy, isTarget, warnings) {
  const s = declared.trim();
  if ( s.length > 0 ) {
    if ( (s == "auto") == false ) {
      if ( EVGConnector.knownSide(s) ) {
        return s;
      }
      warnings.push(("connector: unknown side \"" + s) + "\" — use left, right, top, bottom, center, a corner, or auto");
    }
  }
  let forward = dx;
  if ( horizontal == false ) {
    forward = dy;
  }
  let positive = forward >= 0.0;
  if ( isTarget ) {
    positive = positive == false;
  }
  if ( horizontal ) {
    if ( positive ) {
      return "right";
    }
    return "left";
  }
  if ( positive ) {
    return "bottom";
  }
  return "top";
};
class OverlaySpot  {
  constructor() {
    this.x = 0.0;
    this.y = 0.0;
    this.over = 0.0;
    this.room = 0.0;
  }
}
class EVGLayout  {
  constructor() {
    this.measurer = undefined;
    this.textEngine = new EVGTextEngine();
    this.imageMeasurer = undefined;
    this.pageWidth = 612.0;
    this.pageHeight = 792.0;
    this.currentPage = 0;
    this.debug = false;
    this.overlayErrors = [];
    this.anchorNames = [];
    this.anchorNodes = [];
    this.warnings = [];
    this.docSheet = undefined;
    this.docCssText = "";
    this.layingOutAlongRow = true;
    this.columnCrossShrinks = false;
    this.nearHeights = 3.0;
    const m_1 = EVGDefaultMeasurer.measurer();
    this.measurer = m_1;
    this.textEngine.setMeasurer(m_1);
    const im = new SimpleImageMeasurer();
    this.imageMeasurer = im;
  }
  setMeasurer (m) {
    this.measurer = m;
    this.textEngine.setMeasurer(m);
  };
  getTextEngine () {
    return this.textEngine;
  };
  setStrictFonts (s) {
    this.textEngine.setStrict(s);
  };
  setImageMeasurer (m) {
    this.imageMeasurer = m;
  };
  setPageSize (w, h) {
    this.pageWidth = w;
    this.pageHeight = h;
  };
  setDebug (d) {
    this.debug = d;
  };
  log (msg) {
    if ( this.debug ) {
      console.log(msg);
    }
  };
  warn (msg) {
    let i = 0;
    while (i < this.warnings.length) {
      if ( this.warnings[i] == msg ) {
        return;
      }
      i = i + 1;
    };
    this.warnings.push(msg);
    this.log("  " + msg);
  };
  applyDocumentCss (root) {
    if ( root.documentCss.length == 0 ) {
      return;
    }
    if ( root.documentCss != this.docCssText ) {
      const s = new EVGStyleSheet();
      s.parse(root.documentCss);
      this.docSheet = s;
      this.docCssText = root.documentCss;
    }
    if ( typeof(this.docSheet) === "undefined" ) {
      return;
    }
    const sheet = this.docSheet;
    EVGLayout.clearCssMarks(root);
    sheet.applyTree(root, "");
  };
  warningCount () {
    return this.warnings.length;
  };
  warningAt (i) {
    return this.warnings[i];
  };
  layout (root) {
    this.log("EVGLayout: Starting layout");
    this.currentPage = 0;
    this.applyDocumentCss(root);
    root.resetLayoutState();
    if ( root.width.isSet == false ) {
      root.width = EVGUnit.px(this.pageWidth);
    }
    if ( root.height.isSet == false ) {
      root.height = EVGUnit.px(this.pageHeight);
    }
    root.applyOwnFontSize();
    root.rootFontSize = root.inheritedFontSize;
    root.viewportW = this.pageWidth;
    root.viewportH = this.pageHeight;
    root.viewportX = 0.0;
    root.viewportY = 0.0;
    root.applyOwnDirection(false);
    root.calculatedX = 0.0;
    root.calculatedY = 0.0;
    this.layoutElement(root, 0.0, 0.0, this.pageWidth, this.pageHeight);
    this.anchorNames.length = 0;
    this.anchorNodes.length = 0;
    EVGConnector.collectAnchors(root, this.anchorNames, this.anchorNodes);
    this.overlayErrors.length = 0;
    const anySurface = this.placeOverlaysIn(root);
    const connWarnings = EVGConnector.resolveWith(
      root,
      this.anchorNames,
      this.anchorNodes
    );
    let cwi = 0;
    while (cwi < connWarnings.length) {
      this.warn(connWarnings[cwi]);
      cwi = cwi + 1;
    };
    this.measurePaintBounds(root);
    this.drainRejects();
    this.log("EVGLayout: Layout complete");
  };
  drainRejects () {
    const n = EVGReject.noteCount();
    if ( n == 0 ) {
      return;
    }
    let i = 0;
    while (i < n) {
      this.warn(EVGReject.noteAt(i));
      i = i + 1;
    };
    const total = EVGReject.noteTotal();
    if ( total > n ) {
      this.warn(((("… " + (total.toString())) + " rejected declarations in all, ") + (n.toString())) + " distinct");
    }
  };
  measurePaintBounds (el) {
    if ( el.layoutSkipped && el.boundsFresh ) {
      return;
    }
    el.boundsFresh = true;
    if ( el.getChildCount() > 0 ) {
      const k0 = el.getChild(0);
      el.kidOffX = k0.calculatedX - el.calculatedX;
      el.kidOffY = k0.calculatedY - el.calculatedY;
    }
    const has = el.calculatedWidth > 0.0 && el.calculatedHeight > 0.0;
    let minX = el.calculatedX;
    let minY = el.calculatedY;
    let maxX = el.calculatedX + el.calculatedWidth;
    let maxY = el.calculatedY + el.calculatedHeight;
    let started = has;
    let unbounded = el.hasTransform();
    let effect = el.surfaceEffect.length > 0;
    let i = 0;
    while (i < el.getChildCount()) {
      const kid = el.getChild(i);
      this.measurePaintBounds(kid);
      if ( kid.isHidden() == false ) {
        if ( kid.paintUnbounded ) {
          unbounded = true;
        }
        if ( kid.paintHasEffect ) {
          effect = true;
        }
        if ( started == false ) {
          minX = kid.paintLeft;
          minY = kid.paintTop;
          maxX = kid.paintRight;
          maxY = kid.paintBottom;
          started = true;
        } else {
          if ( kid.paintLeft < minX ) {
            minX = kid.paintLeft;
          }
          if ( kid.paintTop < minY ) {
            minY = kid.paintTop;
          }
          if ( kid.paintRight > maxX ) {
            maxX = kid.paintRight;
          }
          if ( kid.paintBottom > maxY ) {
            maxY = kid.paintBottom;
          }
        }
      }
      i = i + 1;
    };
    el.paintLeft = minX;
    el.paintTop = minY;
    el.paintRight = maxX;
    el.paintBottom = maxY;
    el.paintUnbounded = unbounded;
    el.paintHasEffect = effect;
  };
  layoutElement (element, parentX, parentY, parentWidth, parentHeight) {
    if ( element.keepLayout ) {
      if ( element.hasLayout && element.layoutClean ) {
        if ( ((element.lastParentW == parentWidth && element.lastParentH == parentHeight) && element.lastFlex == element.hasFlexWidth) && element.lastFlexW == element.calculatedFlexWidth ) {
          element.calculatedX = parentX;
          element.calculatedY = parentY;
          const n = element.getChildCount();
          if ( n > 0 ) {
            const k0 = element.getChild(0);
            const dx = (parentX + element.kidOffX) - k0.calculatedX;
            const dy = (parentY + element.kidOffY) - k0.calculatedY;
            if ( dx != 0.0 || dy != 0.0 ) {
              let i = 0;
              while (i < n) {
                const kid = element.getChild(i);
                kid.moveSubtree(dx, dy);
                i = i + 1;
              };
              element.paintLeft = element.paintLeft + dx;
              element.paintRight = element.paintRight + dx;
              element.paintTop = element.paintTop + dy;
              element.paintBottom = element.paintBottom + dy;
            }
          } else {
            element.boundsFresh = false;
          }
          element.layoutSkipped = true;
          return;
        }
      }
      const flex = element.hasFlexWidth;
      const flexW = element.calculatedFlexWidth;
      const bx = element.calculatedX;
      const by = element.calculatedY;
      element.resetLayoutNow();
      element.hasFlexWidth = flex;
      element.calculatedFlexWidth = flexW;
      element.calculatedX = bx;
      element.calculatedY = by;
    }
    element.hasLayout = true;
    element.layoutSkipped = false;
    element.paintStamp = element.paintStamp + 1;
    element.lastParentW = parentWidth;
    element.lastParentH = parentHeight;
    element.lastFlex = element.hasFlexWidth;
    element.lastFlexW = element.calculatedFlexWidth;
    element.resolveUnits(parentWidth, parentHeight);
    if ( element.isHidden() ) {
      element.calculatedX = parentX;
      element.calculatedY = parentY;
      element.calculatedWidth = 0.0;
      element.calculatedHeight = 0.0;
      return;
    }
    let width = parentWidth;
    if ( element.width.isSet ) {
      width = element.width.pixels;
    }
    if ( element.hasFlexWidth ) {
      width = element.calculatedFlexWidth;
    }
    if ( element.width.isSet == false && element.hasFlexWidth == false ) {
      const textContent = element.textContent;
      if ( textContent.length > 0 ) {
        if ( element.getChildCount() == 0 ) {
          let fontSize = element.inheritedFontSize;
          if ( element.fontSize.isSet ) {
            fontSize = element.fontSize.pixels;
          }
          if ( fontSize <= 0.0 ) {
            fontSize = 14.0;
          }
          const contentW = this.textEngine.maxLineWidthSpaced(
            textContent,
            element.effectiveFontFamily(),
            fontSize,
            element.letterSpacing
          );
          const measuredW = ((contentW + element.box.paddingLeftPx) + element.box.paddingRightPx) + element.box.borderWidthPx * 2.0;
          if ( measuredW < parentWidth ) {
            width = measuredW;
          }
        }
      } else {
        if ( element.display == "flex" ) {
          if ( this.crossAxisFits(element) ) {
            const intrinsic = this.intrinsicWidth(element, false);
            if ( intrinsic > 0.0 ) {
              if ( intrinsic < parentWidth ) {
                width = intrinsic;
              }
            }
          }
        }
      }
    }
    let height = 0.0;
    let autoHeight = true;
    if ( element.tagName == "Page" || element.tagName == "page" ) {
      if ( element.width.isSet == false ) {
        width = this.pageWidth;
      }
      if ( element.height.isSet == false ) {
        height = this.pageHeight;
        autoHeight = false;
      }
    }
    if ( element.height.isSet ) {
      height = element.height.pixels;
      autoHeight = false;
    }
    if ( element.height.isSet == false ) {
      if ( element.calculatedFlexHeight > 0.0 ) {
        height = element.calculatedFlexHeight;
        autoHeight = false;
      }
    }
    if ( (element.tagName == "image" || element.tagName == "Image") || element.tagName == "img" ) {
      const imgSrc = element.src;
      if ( imgSrc.length > 0 ) {
        const dims = this.imageMeasurer.getImageDimensions(imgSrc);
        if ( dims.isValid ) {
          element.sourceWidth = dims.width;
          element.sourceHeight = dims.height;
          if ( element.width.isSet && element.height.isSet == false ) {
            if ( parentHeight > 0.0 ) {
              height = parentHeight;
              if ( this.debug ) {
                this.log((("  Image container using parent height: " + (width.toString())) + "x") + (height.toString()));
              }
            } else {
              height = width / dims.aspectRatio;
              if ( this.debug ) {
                this.log((("  Image aspect ratio: " + (dims.aspectRatio.toString())) + " -> height=") + (height.toString()));
              }
            }
            autoHeight = false;
          }
          if ( element.width.isSet == false && element.height.isSet ) {
            if ( parentWidth > 0.0 ) {
              width = parentWidth;
              if ( this.debug ) {
                this.log((("  Image container using parent width: " + (width.toString())) + "x") + (height.toString()));
              }
            } else {
              width = height * dims.aspectRatio;
              if ( this.debug ) {
                this.log((("  Image aspect ratio: " + (dims.aspectRatio.toString())) + " -> width=") + (width.toString()));
              }
            }
          }
          if ( element.width.isSet == false && element.height.isSet == false ) {
            if ( parentWidth > 0.0 && parentHeight > 0.0 ) {
              width = parentWidth;
              height = parentHeight;
              if ( this.debug ) {
                this.log((("  Image filling parent: " + (width.toString())) + "x") + (height.toString()));
              }
            } else {
              width = dims.width;
              height = dims.height;
              if ( width > parentWidth ) {
                if ( parentWidth > 0.0 ) {
                  const scale = parentWidth / width;
                  width = parentWidth;
                  height = height * scale;
                }
              }
              if ( this.debug ) {
                this.log((("  Image natural size: " + (width.toString())) + "x") + (height.toString()));
              }
            }
            autoHeight = false;
          }
        }
      }
    }
    if ( element.maxWidth.isSet ) {
      if ( width > element.maxWidth.pixels ) {
        width = element.maxWidth.pixels;
      }
    }
    if ( element.minWidth.isSet ) {
      if ( width < element.minWidth.pixels ) {
        width = element.minWidth.pixels;
      }
    }
    if ( width < 0.0 ) {
      width = 0.0;
    }
    if ( height < 0.0 ) {
      height = 0.0;
    }
    element.calculatedWidth = width;
    element.calculatedInnerWidth = element.box.getInnerWidth(width);
    element.hasDefiniteHeight = autoHeight == false;
    if ( autoHeight == false ) {
      element.calculatedHeight = height;
      element.calculatedInnerHeight = element.box.getInnerHeight(height);
    }
    if ( element.isAbsolute ) {
      this.layoutAbsolute(element, parentWidth, parentHeight);
    }
    const childCount = element.getChildCount();
    let contentHeight = 0.0;
    if ( childCount > 0 ) {
      contentHeight = this.layoutChildren(element);
      this.mirrorChildren(element);
      if ( element.width.unitType == 6 ) {
        const fitW = this.contentExtent(element);
        if ( fitW > 0.0 && fitW < element.calculatedWidth ) {
          element.calculatedWidth = fitW;
          element.calculatedInnerWidth = element.box.getInnerWidth(fitW);
          let kr = 0;
          while (kr < childCount) {
            const kc = element.getChild(kr);
            kc.resetLayoutState();
            kr = kr + 1;
          };
          contentHeight = this.layoutChildren(element);
          this.mirrorChildren(element);
        }
      }
    } else {
      const textContent_1 = element.textContent;
      if ( textContent_1.length > 0 ) {
        let fontSize_1 = element.inheritedFontSize;
        if ( element.fontSize.isSet ) {
          fontSize_1 = element.fontSize.pixels;
        }
        if ( fontSize_1 <= 0.0 ) {
          fontSize_1 = 14.0;
        }
        const lineSpacing = element.lineBoxFor(fontSize_1, this.textEngine.lineHeightFor(element.effectiveFontFamily(), fontSize_1));
        const availableWidth = element.wrapWidth(element.box.getInnerWidth(width));
        const lineCount = this.textEngine.lineCountSpaced(
          textContent_1,
          element.effectiveFontFamily(),
          fontSize_1,
          availableWidth,
          element.letterSpacing
        );
        contentHeight = lineSpacing * lineCount;
        contentHeight = contentHeight + this.textEngine.paragraphLeading(
          textContent_1,
          element.effectiveFontFamily(),
          fontSize_1,
          availableWidth,
          element.letterSpacing,
          element.paragraphSpacing
        );
        const metrics = this.textEngine.measureRunSpaced(
          textContent_1,
          element.effectiveFontFamily(),
          fontSize_1,
          element.letterSpacing
        );
        const leading = (lineSpacing - (metrics.ascent + metrics.descent)) / 2.0;
        element.calculatedBaseline = ((element.box.paddingTopPx + element.box.borderWidthPx) + leading) + metrics.ascent;
        element.calculatedDescent = metrics.descent;
        element.hasBaseline = true;
      }
    }
    if ( autoHeight ) {
      height = ((contentHeight + element.box.paddingTopPx) + element.box.paddingBottomPx) + element.box.borderWidthPx * 2.0;
    }
    const vChrome = element.box.getVerticalChrome();
    if ( height < vChrome ) {
      height = vChrome;
    }
    const hChrome = element.box.getHorizontalChrome();
    if ( width < hChrome ) {
      width = hChrome;
    }
    if ( element.maxHeight.isSet ) {
      if ( height > element.maxHeight.pixels ) {
        height = element.maxHeight.pixels;
      }
    }
    if ( element.minHeight.isSet ) {
      if ( height < element.minHeight.pixels ) {
        height = element.minHeight.pixels;
      }
    }
    element.calculatedHeight = height;
    element.calculatedInnerHeight = element.box.getInnerHeight(height);
    element.textShiftY = 0.0;
    if ( element.textContent.length > 0 ) {
      if ( element.getChildCount() == 0 ) {
        if ( element.display == "flex" ) {
          const slack = element.calculatedInnerHeight - contentHeight;
          if ( slack > 0.0 ) {
            let how = element.alignItems;
            if ( element.flexDirection == "column" || element.flexDirection == "column-reverse" ) {
              how = element.justifyContent;
            }
            if ( how == "center" || how == "safe center" ) {
              element.textShiftY = slack / 2.0;
            }
            if ( how == "flex-end" || how == "end" ) {
              element.textShiftY = slack;
            }
          }
        }
      }
      if ( element.hasBaseline && element.textShiftY != 0.0 ) {
        element.calculatedBaseline = element.calculatedBaseline + element.textShiftY;
      }
    }
    element.calculatedPage = this.currentPage;
    element.isLayoutComplete = true;
    if ( element.hasBaseline == false && childCount > 0 ) {
      this.inheritBaselineFromFirstChild(element);
    }
    if ( element.clipsContent() ) {
      this.applyScroll(element);
    }
    if ( this.debug ) {
      this.log((((((((((("  Laid out " + element.tagName) + " id=") + element.id) + " at (") + (element.calculatedX.toString())) + ",") + (element.calculatedY.toString())) + ") size=") + (width.toString())) + "x") + (height.toString()));
    }
  };
  measureScrollExtent (el) {
    const innerX = (el.calculatedX + el.box.borderWidthPx) + el.box.paddingLeftPx;
    const innerY = (el.calculatedY + el.box.borderWidthPx) + el.box.paddingTopPx;
    let w = 0.0;
    let h = 0.0;
    let i = 0;
    while (i < el.getChildCount()) {
      const kid = el.getChild(i);
      const right = (kid.calculatedX + kid.calculatedWidth) - innerX;
      const bottom = (kid.calculatedY + kid.calculatedHeight) - innerY;
      if ( right > w ) {
        w = right;
      }
      if ( bottom > h ) {
        h = bottom;
      }
      i = i + 1;
    };
    el.scrollWidth = (w + el.box.paddingLeftPx) + el.box.paddingRightPx;
    el.scrollHeight = (h + el.box.paddingTopPx) + el.box.paddingBottomPx;
  };
  applyScroll (el) {
    this.measureScrollExtent(el);
    const maxY = el.maxScrollTop();
    if ( el.scrollTop > maxY ) {
      el.scrollTop = maxY;
    }
    if ( el.scrollTop < 0.0 ) {
      el.scrollTop = 0.0;
    }
    const maxX = el.maxScrollLeft();
    if ( el.scrollLeft > maxX ) {
      el.scrollLeft = maxX;
    }
    if ( el.scrollLeft < 0.0 ) {
      el.scrollLeft = 0.0;
    }
    el.appliedScrollTop = el.scrollTop;
    el.appliedScrollLeft = el.scrollLeft;
    if ( el.scrollTop == 0.0 && el.scrollLeft == 0.0 ) {
      return;
    }
    let j = 0;
    while (j < el.getChildCount()) {
      const moved = el.getChild(j);
      if ( moved.isFixedPosition() ) {
      } else {
        moved.moveSubtreeUnfixed(0.0 - el.scrollLeft, 0.0 - el.scrollTop);
      }
      j = j + 1;
    };
  };
  scrollOnly (root) {
    this.scrollOnlyWalk(root);
  };
  scrollOnlyFrom (el) {
    if ( el.clipsContent() == false ) {
      return;
    }
    this.clampScroll(el);
    const dy = el.appliedScrollTop - el.scrollTop;
    const dx = el.appliedScrollLeft - el.scrollLeft;
    if ( dx == 0.0 && dy == 0.0 ) {
      return;
    }
    let j = 0;
    while (j < el.getChildCount()) {
      this.shiftNear(el.getChild(j), dx, dy, el);
      j = j + 1;
    };
    el.appliedScrollTop = el.scrollTop;
    el.appliedScrollLeft = el.scrollLeft;
  };
  shiftNear (kid, dx, dy, clip) {
    if ( kid.isFixedPosition() ) {
      return;
    }
    kid.moveSelf(dx, dy);
    if ( this.nearClip(kid, clip) ) {
      const tx = kid.shiftDx + dx;
      const ty = kid.shiftDy + dy;
      kid.shiftDx = 0.0;
      kid.shiftDy = 0.0;
      let i = 0;
      const n = kid.getChildCount();
      while (i < n) {
        this.shiftNear(kid.getChild(i), tx, ty, clip);
        i = i + 1;
      };
      return;
    }
    kid.shiftDx = kid.shiftDx + dx;
    kid.shiftDy = kid.shiftDy + dy;
  };
  nearClip (kid, el) {
    if ( kid.paintUnbounded ) {
      return true;
    }
    const margin = el.calculatedHeight * this.nearHeights;
    if ( kid.paintBottom < el.calculatedY - margin ) {
      return false;
    }
    if ( kid.paintTop > (el.calculatedY + el.calculatedHeight) + margin ) {
      return false;
    }
    const marginX = el.calculatedWidth * this.nearHeights;
    if ( kid.paintRight < el.calculatedX - marginX ) {
      return false;
    }
    if ( kid.paintLeft > (el.calculatedX + el.calculatedWidth) + marginX ) {
      return false;
    }
    return true;
  };
  clampScroll (el) {
    if ( el.clipsContent() == false ) {
      return;
    }
    const maxY = el.maxScrollTop();
    if ( el.scrollTop > maxY ) {
      el.scrollTop = maxY;
    }
    if ( el.scrollTop < 0.0 ) {
      el.scrollTop = 0.0;
    }
    const maxX = el.maxScrollLeft();
    if ( el.scrollLeft > maxX ) {
      el.scrollLeft = maxX;
    }
    if ( el.scrollLeft < 0.0 ) {
      el.scrollLeft = 0.0;
    }
  };
  scrollOnlyWalk (el) {
    if ( el.clipsContent() ) {
      this.scrollOnlyFrom(el);
    }
    let i = 0;
    while (i < el.getChildCount()) {
      const kid = el.getChild(i);
      if ( kid.shiftDx == 0.0 && kid.shiftDy == 0.0 ) {
        this.scrollOnlyWalk(kid);
      }
      i = i + 1;
    };
  };
  hasBaseMain (c) {
    return c.flexBasis.isSet || c.width.isSet;
  };
  baseMain (c) {
    if ( c.flexBasis.isSet ) {
      return c.flexBasis.pixels;
    }
    return c.width.pixels;
  };
  crossAlignOf (child, parentAlign) {
    if ( child.alignSelf.length > 0 ) {
      return child.alignSelf;
    }
    return parentAlign;
  };
  clampMain (c, w) {
    let out = w;
    if ( c.maxWidth.isSet ) {
      if ( out > c.maxWidth.pixels ) {
        out = c.maxWidth.pixels;
      }
    }
    if ( c.minWidth.isSet ) {
      if ( out < c.minWidth.pixels ) {
        out = c.minWidth.pixels;
      }
    } else {
      if ( c.clipsContent() == false ) {
        const autoMin = this.minIntrinsicWidthOf(c);
        if ( out < autoMin ) {
          out = autoMin;
        }
      }
    }
    return out;
  };
  layoutOutOfFlowChild (parent, child, innerWidth, innerHeight, startX, startY, alongRow) {
    if ( child.isFixedPosition() ) {
      child.unitsResolved = false;
      child.resolveUnits(child.viewportW, child.viewportH);
      const wasRowF = this.layingOutAlongRow;
      const wasShrinkF = this.columnCrossShrinks;
      this.layingOutAlongRow = alongRow;
      this.columnCrossShrinks = this.crossShrinksUnder(parent);
      this.layoutElement(child, 0.0, 0.0, child.viewportW, child.viewportH);
      this.layingOutAlongRow = wasRowF;
      this.columnCrossShrinks = wasShrinkF;
      if ( child.viewportX != 0.0 || child.viewportY != 0.0 ) {
        this.translateSubtree(child, child.viewportX, child.viewportY);
      }
      return;
    }
    if ( child.tagName == "layer" || child.tagName == "Layer" ) {
      child.unitsResolved = false;
      child.resolveUnits(parent.calculatedWidth, parent.calculatedHeight);
      child.calculatedWidth = parent.calculatedWidth;
      child.calculatedHeight = parent.calculatedHeight;
      child.calculatedInnerWidth = child.box.getInnerWidth(child.calculatedWidth);
      child.calculatedInnerHeight = child.box.getInnerHeight(child.calculatedHeight);
      if ( child.height.isSet ) {
        child.height.pixels = child.calculatedHeight;
      } else {
        child.height = EVGUnit.px(child.calculatedHeight);
      }
      this.layoutAbsolute(
        child,
        parent.calculatedWidth,
        parent.calculatedHeight
      );
      child.calculatedX = child.calculatedX + parent.calculatedX;
      child.calculatedY = child.calculatedY + parent.calculatedY;
    } else {
      const wasRow0 = this.layingOutAlongRow;
      const wasShrink0 = this.columnCrossShrinks;
      this.layingOutAlongRow = alongRow;
      this.columnCrossShrinks = this.crossShrinksUnder(parent);
      this.layoutElement(child, 0.0, 0.0, innerWidth, innerHeight);
      this.layingOutAlongRow = wasRow0;
      this.columnCrossShrinks = wasShrink0;
      this.translateSubtree(child, startX, startY);
    }
  };
  layoutChildren (parent) {
    const childCount = parent.getChildCount();
    if ( childCount == 0 ) {
      return 0.0;
    }
    if ( parent.display == "grid" ) {
      return this.layoutGrid(parent);
    }
    const innerWidth = parent.calculatedInnerWidth;
    const innerHeight = parent.calculatedInnerHeight;
    const startX = (parent.calculatedX + parent.box.borderWidthPx) + parent.box.paddingLeftPx;
    const startY = (parent.calculatedY + parent.box.borderWidthPx) + parent.box.paddingTopPx;
    let currentX = startX;
    let currentY = startY;
    let rowHeight = 0.0;
    let rowElements = [];
    let totalHeight = 0.0;
    let lineMembers = [];
    let lineCounts = [];
    let lineHeights = [];
    let placedInFlow = 0;
    const isColumn = parent.flexDirection == "column";
    let rowGapUnit = parent.gap;
    if ( parent.rowGap.isSet ) {
      rowGapUnit = parent.rowGap;
    }
    let colGapUnit = parent.gap;
    if ( parent.columnGap.isSet ) {
      colGapUnit = parent.columnGap;
    }
    let mainGapUnit = colGapUnit;
    let crossGapUnit = rowGapUnit;
    if ( isColumn ) {
      mainGapUnit = rowGapUnit;
      crossGapUnit = colGapUnit;
    }
    let gapPx = 0.0;
    if ( mainGapUnit.isSet ) {
      mainGapUnit.rootFontSize = parent.rootFontSize;
      if ( isColumn ) {
        mainGapUnit.resolve(innerHeight, parent.inheritedFontSize);
      } else {
        mainGapUnit.resolve(innerWidth, parent.inheritedFontSize);
      }
      gapPx = mainGapUnit.pixels;
    }
    let crossGapPx = 0.0;
    const canWrap = isColumn == false && parent.flexWrap != "nowrap";
    if ( canWrap && crossGapUnit.isSet ) {
      crossGapUnit.rootFontSize = parent.rootFontSize;
      if ( isColumn ) {
        crossGapUnit.resolve(innerWidth, parent.inheritedFontSize);
      } else {
        crossGapUnit.resolve(innerHeight, parent.inheritedFontSize);
      }
      crossGapPx = crossGapUnit.pixels;
    }
    if ( isColumn == false ) {
      let fixedWidth = 0.0;
      let totalFlex = 0.0;
      let j = 0;
      while (j < childCount) {
        const c = parent.getChild(j);
        c.inheritProperties(parent);
        c.resolveUnits(innerWidth, innerHeight);
        const hasBasis = c.flexBasis.isSet;
        if ( c.isAbsolute ) {
        } else {
          if ( c.flex > 0.0 && hasBasis ) {
            totalFlex = totalFlex + c.flex;
            fixedWidth = ((fixedWidth + c.flexBasis.pixels) + c.box.marginLeftPx) + c.box.marginRightPx;
          } else {
            if ( hasBasis ) {
              const baseW = this.clampMain(c, c.flexBasis.pixels);
              c.calculatedFlexWidth = baseW;
              c.hasFlexWidth = true;
              fixedWidth = ((fixedWidth + baseW) + c.box.marginLeftPx) + c.box.marginRightPx;
            } else {
              if ( c.width.isSet ) {
                fixedWidth = ((fixedWidth + c.width.pixels) + c.box.marginLeftPx) + c.box.marginRightPx;
              } else {
                if ( c.flex > 0.0 ) {
                  totalFlex = totalFlex + c.flex;
                  fixedWidth = (fixedWidth + c.box.marginLeftPx) + c.box.marginRightPx;
                } else {
                  const avail = (innerWidth - c.box.marginLeftPx) - c.box.marginRightPx;
                  const estW = this.estimateChildWidth(c, avail, true);
                  fixedWidth = ((fixedWidth + estW) + c.box.marginLeftPx) + c.box.marginRightPx;
                }
              }
            }
          }
        }
        j = j + 1;
      };
      let totalGap = 0.0;
      if ( childCount > 1 ) {
        totalGap = (childCount - 1) * gapPx;
      }
      let availableForFlex = (innerWidth - fixedWidth) - totalGap;
      if ( availableForFlex < 0.0 ) {
        availableForFlex = 0.0;
      }
      if ( totalFlex > 0.0 ) {
        let frozen = [];
        let jf = 0;
        while (jf < childCount) {
          frozen.push(false);
          jf = jf + 1;
        };
        let poolSpace = availableForFlex;
        let poolFlex = totalFlex;
        let pass = 0;
        let settled = false;
        while (pass < childCount && settled == false) {
          settled = true;
          j = 0;
          while (j < childCount) {
            const c_1 = parent.getChild(j);
            let isFlexItem = false;
            if ( c_1.flex > 0.0 ) {
              if ( c_1.flexBasis.isSet || c_1.width.isSet == false ) {
                isFlexItem = true;
              }
            }
            if ( isFlexItem && frozen[j] == false ) {
              let basisW = 0.0;
              if ( c_1.flexBasis.isSet ) {
                basisW = c_1.flexBasis.pixels;
              }
              let sizeW = basisW;
              if ( poolFlex > 0.0 ) {
                sizeW = basisW + (poolSpace * c_1.flex) / poolFlex;
              }
              const clampedW = this.clampMain(c_1, sizeW);
              if ( clampedW != sizeW ) {
                frozen[j] = true;
                poolSpace = (poolSpace - clampedW) + basisW;
                poolFlex = poolFlex - c_1.flex;
                if ( poolSpace < 0.0 ) {
                  poolSpace = 0.0;
                }
                settled = false;
              }
              c_1.calculatedFlexWidth = clampedW;
              c_1.hasFlexWidth = true;
            }
            j = j + 1;
          };
          pass = pass + 1;
        };
      }
    }
    if ( isColumn && parent.hasDefiniteHeight ) {
      let fixedHeight = 0.0;
      let totalFlexC = 0.0;
      let flowCountC = 0;
      let jc = 0;
      while (jc < childCount) {
        const c_2 = parent.getChild(jc);
        c_2.inheritProperties(parent);
        c_2.resolveUnits(innerWidth, innerHeight);
        if ( c_2.isAbsolute == false ) {
          flowCountC = flowCountC + 1;
          const mAxis = c_2.box.marginTopPx + c_2.box.marginBottomPx;
          if ( c_2.height.isSet ) {
            fixedHeight = (fixedHeight + c_2.height.pixels) + mAxis;
          } else {
            if ( c_2.flex > 0.0 ) {
              totalFlexC = totalFlexC + c_2.flex;
              fixedHeight = fixedHeight + mAxis;
            } else {
              fixedHeight = fixedHeight + mAxis;
            }
          }
        }
        jc = jc + 1;
      };
      let gapTotalC = 0.0;
      if ( flowCountC > 1 ) {
        gapTotalC = (flowCountC - 1) * gapPx;
      }
      if ( totalFlexC > 0.0 ) {
        let availC = (innerHeight - fixedHeight) - gapTotalC;
        if ( availC < 0.0 ) {
          availC = 0.0;
        }
        let jg = 0;
        while (jg < childCount) {
          const c_3 = parent.getChild(jg);
          if ( c_3.isAbsolute == false ) {
            if ( c_3.height.isSet == false && c_3.flex > 0.0 ) {
              c_3.calculatedFlexHeight = (availC * c_3.flex) / totalFlexC;
            }
          }
          jg = jg + 1;
        };
      } else {
        const contentH = fixedHeight + gapTotalC;
        let overflowH = contentH - innerHeight;
        if ( parent.clipsContent() ) {
          overflowH = 0.0;
        }
        if ( overflowH > 0.0 && fixedHeight > 0.0 ) {
          let weightedH = 0.0;
          let jq = 0;
          while (jq < childCount) {
            const c_4 = parent.getChild(jq);
            if ( c_4.isAbsolute == false && c_4.height.isSet ) {
              weightedH = weightedH + c_4.flexShrink * c_4.height.pixels;
            }
            jq = jq + 1;
          };
          if ( weightedH > 0.0 ) {
            let js = 0;
            while (js < childCount) {
              const c_5 = parent.getChild(js);
              if ( c_5.isAbsolute == false && c_5.height.isSet ) {
                const cut = (overflowH * (c_5.flexShrink * c_5.height.pixels)) / weightedH;
                let finalH = c_5.height.pixels - cut;
                if ( finalH < 0.0 ) {
                  finalH = 0.0;
                }
                c_5.calculatedFlexHeight = finalH;
                c_5.height.isSet = false;
              }
              js = js + 1;
            };
          }
        }
      }
    }
    if ( isColumn == false ) {
      if ( parent.flexWrap == "nowrap" ) {
        let fixedW2 = 0.0;
        let totalFlex2 = 0.0;
        let flowCount2 = 0;
        let jr = 0;
        while (jr < childCount) {
          const c_6 = parent.getChild(jr);
          if ( c_6.isAbsolute == false ) {
            flowCount2 = flowCount2 + 1;
            if ( this.hasBaseMain(c_6) ) {
              fixedW2 = ((fixedW2 + this.baseMain(c_6)) + c_6.box.marginLeftPx) + c_6.box.marginRightPx;
            } else {
              if ( c_6.flex > 0.0 ) {
                totalFlex2 = totalFlex2 + c_6.flex;
              }
            }
          }
          jr = jr + 1;
        };
        let gapTotal2 = 0.0;
        if ( flowCount2 > 1 ) {
          gapTotal2 = (flowCount2 - 1) * gapPx;
        }
        const contentW2 = fixedW2 + gapTotal2;
        let overflowW = contentW2 - innerWidth;
        if ( parent.clipsContent() ) {
          overflowW = 0.0;
        }
        if ( (totalFlex2 == 0.0 && overflowW > 0.0) && fixedW2 > 0.0 ) {
          let minsW = [];
          let basesW = [];
          let shrinkable = [];
          let jm = 0;
          while (jm < childCount) {
            const c_7 = parent.getChild(jm);
            const canShrink = c_7.isAbsolute == false && this.hasBaseMain(c_7);
            shrinkable.push(canShrink);
            if ( canShrink ) {
              basesW.push(this.baseMain(c_7));
              if ( c_7.minWidth.isSet ) {
                minsW.push(c_7.minWidth.pixels);
              } else {
                minsW.push(0.0);
              }
            } else {
              basesW.push(0.0);
              minsW.push(0.0);
            }
            jm = jm + 1;
          };
          let frozenS = [];
          let jf2 = 0;
          while (jf2 < childCount) {
            frozenS.push(false);
            jf2 = jf2 + 1;
          };
          let toCut = overflowW;
          let passS = 0;
          let settledS = false;
          while (passS < childCount && settledS == false) {
            settledS = true;
            let weightedW = 0.0;
            let jz = 0;
            while (jz < childCount) {
              const c_8 = parent.getChild(jz);
              if ( shrinkable[jz] && frozenS[jz] == false ) {
                weightedW = weightedW + c_8.flexShrink * basesW[jz];
              }
              jz = jz + 1;
            };
            if ( weightedW > 0.0 ) {
              let jw = 0;
              while (jw < childCount) {
                const c_9 = parent.getChild(jw);
                if ( shrinkable[jw] && frozenS[jw] == false ) {
                  const baseW_1 = basesW[jw];
                  const cutW = (toCut * (c_9.flexShrink * baseW_1)) / weightedW;
                  let wantW = baseW_1 - cutW;
                  if ( wantW < 0.0 ) {
                    wantW = 0.0;
                  }
                  let finalW = wantW;
                  if ( c_9.maxWidth.isSet ) {
                    if ( finalW > c_9.maxWidth.pixels ) {
                      finalW = c_9.maxWidth.pixels;
                    }
                  }
                  const floorW = minsW[jw];
                  if ( finalW < floorW ) {
                    finalW = floorW;
                  }
                  if ( finalW != wantW ) {
                    frozenS[jw] = true;
                    toCut = toCut - (baseW_1 - finalW);
                    if ( toCut < 0.0 ) {
                      toCut = 0.0;
                    }
                    settledS = false;
                  }
                  c_9.calculatedFlexWidth = finalW;
                  c_9.hasFlexWidth = true;
                }
                jw = jw + 1;
              };
            }
            passS = passS + 1;
          };
        }
      }
    }
    let i = 0;
    while (i < childCount) {
      const child = parent.getChild(i);
      child.inheritProperties(parent);
      child.resolveUnits(innerWidth, innerHeight);
      if ( child.isAbsolute ) {
        this.layoutOutOfFlowChild(
          parent,
          child,
          innerWidth,
          innerHeight,
          startX,
          startY,
          isColumn == false
        );
        i = i + 1;
        continue;
      }
      const availableForChild = (innerWidth - child.box.marginLeftPx) - child.box.marginRightPx;
      let childWidth = this.estimateChildWidth(
        child,
        availableForChild,
        (isColumn == false || this.crossShrinksUnder(parent))
      );
      if ( child.hasFlexWidth ) {
        childWidth = child.calculatedFlexWidth;
      } else {
        if ( child.width.isSet ) {
          if ( child.width.pixels >= innerWidth ) {
            childWidth = availableForChild;
          } else {
            childWidth = child.width.pixels;
          }
        }
      }
      if ( isColumn == false ) {
        if ( this.crossAlignOf(child, parent.alignItems) == "stretch" ) {
          if ( child.height.isSet == false ) {
            child.calculatedFlexHeight = innerHeight;
          }
        }
      }
      const childTotalWidth = (childWidth + child.box.marginLeftPx) + child.box.marginRightPx;
      if ( gapPx > 0.0 ) {
        if ( isColumn == false ) {
          if ( rowElements.length > 0 ) {
            currentX = currentX + gapPx;
          }
        } else {
          if ( placedInFlow > 0 ) {
            currentY = currentY + gapPx;
            totalHeight = totalHeight + gapPx;
          }
        }
      }
      if ( isColumn == false ) {
        const availableWidth = ((startX + innerWidth) - currentX) + 0.01;
        if ( (childTotalWidth > availableWidth && rowElements.length > 0) && parent.flexWrap != "nowrap" ) {
          this.alignRow(rowElements, parent, rowHeight, startX, innerWidth);
          this.recordLine(
            lineMembers,
            lineCounts,
            lineHeights,
            rowElements,
            rowHeight
          );
          currentY = (currentY + rowHeight) + crossGapPx;
          totalHeight = (totalHeight + rowHeight) + crossGapPx;
          currentX = startX;
          rowHeight = 0.0;
          rowElements.length = 0;
        }
      }
      child.calculatedX = currentX + child.box.marginLeftPx;
      child.calculatedY = currentY + child.box.marginTopPx;
      const wasRow = this.layingOutAlongRow;
      const wasShrink = this.columnCrossShrinks;
      this.layingOutAlongRow = isColumn == false;
      this.columnCrossShrinks = this.crossShrinksUnder(parent);
      this.layoutElement(
        child,
        child.calculatedX,
        child.calculatedY,
        childWidth,
        innerHeight
      );
      this.layingOutAlongRow = wasRow;
      this.columnCrossShrinks = wasShrink;
      const childHeight = child.calculatedHeight;
      const childTotalHeight = (childHeight + child.box.marginTopPx) + child.box.marginBottomPx;
      const placedWidth = (child.calculatedWidth + child.box.marginLeftPx) + child.box.marginRightPx;
      if ( isColumn ) {
        currentY = currentY + childTotalHeight;
        totalHeight = totalHeight + childTotalHeight;
      } else {
        currentX = currentX + placedWidth;
        rowElements.push(child);
        if ( childTotalHeight > rowHeight ) {
          rowHeight = childTotalHeight;
        }
      }
      placedInFlow = placedInFlow + 1;
      if ( child.lineBreak ) {
        if ( isColumn == false ) {
          this.alignRow(rowElements, parent, rowHeight, startX, innerWidth);
          this.recordLine(
            lineMembers,
            lineCounts,
            lineHeights,
            rowElements,
            rowHeight
          );
          currentY = (currentY + rowHeight) + crossGapPx;
          totalHeight = (totalHeight + rowHeight) + crossGapPx;
          currentX = startX;
          rowHeight = 0.0;
          rowElements.length = 0;
        }
      }
      i = i + 1;
    };
    if ( isColumn == false && rowElements.length > 0 ) {
      this.alignRow(rowElements, parent, rowHeight, startX, innerWidth);
      this.recordLine(
        lineMembers,
        lineCounts,
        lineHeights,
        rowElements,
        rowHeight
      );
      totalHeight = totalHeight + rowHeight;
    }
    if ( isColumn == false ) {
      this.applyWrapReverse(
        parent,
        lineMembers,
        lineCounts,
        lineHeights,
        totalHeight,
        crossGapPx
      );
      this.applyAlignContent(
        parent,
        lineMembers,
        lineCounts,
        lineHeights,
        totalHeight,
        innerHeight
      );
    }
    if ( isColumn ) {
      this.alignColumn(
        parent,
        totalHeight,
        startX,
        startY,
        innerWidth,
        innerHeight
      );
    }
    return totalHeight;
  };
  recordLine (members, counts, heights, rowElements, rowHeight) {
    const n = rowElements.length;
    if ( n == 0 ) {
      return;
    }
    let i = 0;
    while (i < n) {
      members.push(rowElements[i]);
      i = i + 1;
    };
    counts.push(n);
    heights.push(rowHeight);
  };
  applyWrapReverse (parent, members, counts, heights, contentHeight, gapPx) {
    if ( parent.flexWrap != "wrap-reverse" ) {
      return;
    }
    const lineCount = counts.length;
    if ( lineCount < 2 ) {
      return;
    }
    let idx = 0;
    let offset = 0.0;
    let li = 0;
    while (li < lineCount) {
      const h = heights[li];
      const newOffset = (contentHeight - offset) - h;
      const shift = newOffset - offset;
      const n = counts[li];
      let k = 0;
      while (k < n) {
        const el = members[(idx + k)];
        if ( shift != 0.0 ) {
          el.calculatedY = el.calculatedY + shift;
          this.propagateOffsetToChildren(el, 0.0, shift);
        }
        k = k + 1;
      };
      idx = idx + n;
      offset = (offset + h) + gapPx;
      li = li + 1;
    };
  };
  applyAlignContentStretch (parent, members, counts, heights, contentHeight, innerHeight) {
    const lineCount = counts.length;
    const free = innerHeight - contentHeight;
    if ( free <= 0.0 ) {
      return;
    }
    const extra = free / lineCount;
    let idx = 0;
    let li = 0;
    while (li < lineCount) {
      const shift = extra * li;
      const grown = heights[li] + extra;
      const n = counts[li];
      let k = 0;
      while (k < n) {
        const el = members[(idx + k)];
        if ( shift != 0.0 ) {
          el.calculatedY = el.calculatedY + shift;
          this.propagateOffsetToChildren(el, 0.0, shift);
        }
        if ( el.height.isSet == false && el.isAbsolute == false ) {
          const target = (grown - el.box.marginTopPx) - el.box.marginBottomPx;
          if ( target > el.calculatedHeight ) {
            el.calculatedHeight = target;
            el.calculatedInnerHeight = el.box.getInnerHeight(target);
            el.hasDefiniteHeight = true;
            if ( el.getChildCount() > 0 ) {
              this.layoutChildren(el);
            }
          }
        }
        k = k + 1;
      };
      idx = idx + n;
      li = li + 1;
    };
  };
  applyAlignContent (parent, members, counts, heights, contentHeight, innerHeight) {
    const lineCount = counts.length;
    if ( lineCount < 2 ) {
      return;
    }
    if ( parent.hasDefiniteHeight == false ) {
      return;
    }
    const mode = parent.alignContent;
    if ( mode == "flex-start" ) {
      return;
    }
    if ( mode == "start" ) {
      return;
    }
    if ( mode == "stretch" ) {
      this.applyAlignContentStretch(
        parent,
        members,
        counts,
        heights,
        contentHeight,
        innerHeight
      );
      return;
    }
    const free = innerHeight - contentHeight;
    if ( free <= 0.0 ) {
      return;
    }
    let first = 0.0;
    let between = 0.0;
    if ( mode == "flex-end" || mode == "end" ) {
      first = free;
    }
    if ( mode == "center" ) {
      first = free / 2.0;
    }
    if ( mode == "space-between" ) {
      between = free / (lineCount - 1);
    }
    if ( mode == "space-around" ) {
      between = free / lineCount;
      first = between / 2.0;
    }
    if ( mode == "space-evenly" ) {
      between = free / (lineCount + 1);
      first = between;
    }
    let idx = 0;
    let li = 0;
    while (li < lineCount) {
      const shift = first + between * li;
      const n = counts[li];
      let k = 0;
      while (k < n) {
        const el = members[(idx + k)];
        if ( shift != 0.0 ) {
          el.calculatedY = el.calculatedY + shift;
          this.propagateOffsetToChildren(el, 0.0, shift);
        }
        k = k + 1;
      };
      idx = idx + n;
      li = li + 1;
    };
  };
  alignColumn (parent, contentHeight, startX, startY, innerWidth, innerHeight) {
    const childCount = parent.getChildCount();
    if ( childCount == 0 ) {
      return;
    }
    const verticalAlign = parent.justifyContent;
    let horizontalAlign = parent.alignItems;
    if ( parent.align.length > 0 ) {
      if ( parent.align != "left" ) {
        horizontalAlign = parent.align;
      }
    }
    let availableHeight = innerHeight;
    if ( parent.height.isSet ) {
      availableHeight = parent.calculatedInnerHeight;
    }
    let offsetY = 0.0;
    if ( verticalAlign == "center" ) {
      offsetY = (availableHeight - contentHeight) / 2.0;
    }
    if ( verticalAlign == "flex-end" || verticalAlign == "end" ) {
      offsetY = availableHeight - contentHeight;
    }
    let flowCount = 0;
    let fc = 0;
    while (fc < childCount) {
      const fchild = parent.getChild(fc);
      if ( fchild.isAbsolute == false ) {
        flowCount = flowCount + 1;
      }
      fc = fc + 1;
    };
    let freeSpaceY = availableHeight - contentHeight;
    if ( freeSpaceY < 0.0 ) {
      freeSpaceY = 0.0;
    }
    let distributeGapY = 0.0;
    let distributeFirstY = 0.0;
    if ( verticalAlign == "space-between" ) {
      if ( flowCount > 1 ) {
        distributeGapY = freeSpaceY / (flowCount - 1);
      }
    }
    if ( verticalAlign == "space-around" ) {
      if ( flowCount > 0 ) {
        distributeGapY = freeSpaceY / flowCount;
        distributeFirstY = distributeGapY / 2.0;
      }
    }
    if ( verticalAlign == "space-evenly" ) {
      distributeGapY = freeSpaceY / (flowCount + 1);
      distributeFirstY = distributeGapY;
    }
    const usesDistributeY = distributeGapY > 0.0 || distributeFirstY > 0.0;
    let i = 0;
    let flowIndex = 0;
    while (i < childCount) {
      const child = parent.getChild(i);
      if ( child.isAbsolute == false ) {
        let elemOffsetY = offsetY;
        if ( usesDistributeY ) {
          elemOffsetY = distributeFirstY + distributeGapY * flowIndex;
        }
        if ( elemOffsetY != 0.0 ) {
          child.calculatedY = child.calculatedY + elemOffsetY;
          this.propagateOffsetToChildren(child, 0.0, elemOffsetY);
        }
        flowIndex = flowIndex + 1;
        const childAlign = this.crossAlignOf(child, horizontalAlign);
        const childTotalWidth = (child.calculatedWidth + child.box.marginLeftPx) + child.box.marginRightPx;
        let offsetX = 0.0;
        if ( childAlign == "center" ) {
          offsetX = (innerWidth - childTotalWidth) / 2.0;
        }
        if ( childAlign == "flex-end" || childAlign == "end" ) {
          offsetX = innerWidth - childTotalWidth;
        }
        if ( offsetX != 0.0 ) {
          child.calculatedX = child.calculatedX + offsetX;
          this.propagateOffsetToChildren(child, offsetX, 0.0);
        }
      }
      i = i + 1;
    };
  };
  inheritBaselineFromFirstChild (element) {
    let i = 0;
    const n = element.getChildCount();
    while (i < n) {
      const c = element.getChild(i);
      if ( c.isAbsolute == false ) {
        if ( c.hasBaseline ) {
          element.calculatedBaseline = (c.calculatedY - element.calculatedY) + c.calculatedBaseline;
          element.calculatedDescent = c.calculatedDescent;
          element.hasBaseline = true;
          return;
        }
      }
      i = i + 1;
    };
  };
  baselineOffsetOf (el) {
    if ( el.hasBaseline ) {
      return el.box.marginTopPx + el.calculatedBaseline;
    }
    return (el.box.marginTopPx + el.calculatedHeight) + el.box.marginBottomPx;
  };
  alignRow (rowElements, parent, rowHeight, startX, innerWidth) {
    const elementCount = rowElements.length;
    if ( elementCount == 0 ) {
      return;
    }
    let rowWidth = 0.0;
    let i = 0;
    while (i < elementCount) {
      const el = rowElements[i];
      rowWidth = ((rowWidth + el.calculatedWidth) + el.box.marginLeftPx) + el.box.marginRightPx;
      i = i + 1;
    };
    let rowGapPx = 0.0;
    if ( parent.gap.isSet ) {
      rowGapPx = parent.gap.pixels;
    }
    if ( parent.columnGap.isSet ) {
      rowGapPx = parent.columnGap.pixels;
    }
    if ( elementCount > 1 ) {
      rowWidth = rowWidth + (elementCount - 1) * rowGapPx;
    }
    const isColumn = parent.flexDirection == "column";
    const mainAxisAlign = parent.justifyContent;
    const crossAxisAlign = parent.alignItems;
    let horizontalAlign = mainAxisAlign;
    if ( isColumn ) {
      horizontalAlign = crossAxisAlign;
    }
    if ( parent.align.length > 0 ) {
      if ( parent.align != "left" ) {
        horizontalAlign = parent.align;
      }
    }
    let offsetX = 0.0;
    if ( horizontalAlign == "center" ) {
      offsetX = (innerWidth - rowWidth) / 2.0;
    }
    if ( horizontalAlign == "flex-end" || horizontalAlign == "right" ) {
      offsetX = innerWidth - rowWidth;
    }
    let freeSpace = innerWidth - rowWidth;
    if ( freeSpace < 0.0 ) {
      freeSpace = 0.0;
    }
    let distributeGap = 0.0;
    let distributeFirst = 0.0;
    if ( horizontalAlign == "space-between" ) {
      if ( elementCount > 1 ) {
        distributeGap = freeSpace / (elementCount - 1);
      }
    }
    if ( horizontalAlign == "space-around" ) {
      distributeGap = freeSpace / elementCount;
      distributeFirst = distributeGap / 2.0;
    }
    if ( horizontalAlign == "space-evenly" ) {
      distributeGap = freeSpace / (elementCount + 1);
      distributeFirst = distributeGap;
    }
    const usesDistribute = distributeGap > 0.0 || distributeFirst > 0.0;
    let verticalAlignVal = crossAxisAlign;
    if ( isColumn ) {
      verticalAlignVal = mainAxisAlign;
    }
    if ( parent.verticalAlign.length > 0 ) {
      if ( parent.verticalAlign != "top" ) {
        verticalAlignVal = parent.verticalAlign;
      }
    }
    let effectiveRowHeight = rowHeight;
    let crossBox = 0.0;
    if ( parent.flexWrap == "nowrap" ) {
      if ( parent.hasDefiniteHeight ) {
        crossBox = parent.calculatedInnerHeight;
      }
    } else {
      if ( parent.height.isSet ) {
        crossBox = parent.calculatedInnerHeight;
      }
    }
    if ( crossBox > rowHeight ) {
      effectiveRowHeight = crossBox;
    }
    const useBaseline = verticalAlignVal == "baseline";
    let maxBaseline = 0.0;
    if ( useBaseline ) {
      let b = 0;
      while (b < elementCount) {
        const bel = rowElements[b];
        const bo = this.baselineOffsetOf(bel);
        if ( bo > maxBaseline ) {
          maxBaseline = bo;
        }
        b = b + 1;
      };
    }
    i = 0;
    while (i < elementCount) {
      const el_1 = rowElements[i];
      let elemOffsetX = offsetX;
      if ( usesDistribute ) {
        elemOffsetX = distributeFirst + distributeGap * i;
      }
      if ( elemOffsetX != 0.0 ) {
        el_1.calculatedX = el_1.calculatedX + elemOffsetX;
        this.propagateOffsetToChildren(el_1, elemOffsetX, 0.0);
      }
      const childTotalHeight = (el_1.calculatedHeight + el_1.box.marginTopPx) + el_1.box.marginBottomPx;
      let offsetY = 0.0;
      let elAlign = verticalAlignVal;
      if ( isColumn == false ) {
        elAlign = this.crossAlignOf(el_1, verticalAlignVal);
      }
      if ( elAlign == "center" ) {
        offsetY = (effectiveRowHeight - childTotalHeight) / 2.0;
      }
      if ( elAlign == "flex-end" || elAlign == "bottom" ) {
        offsetY = effectiveRowHeight - childTotalHeight;
      }
      if ( elAlign == "baseline" ) {
        if ( useBaseline ) {
          offsetY = maxBaseline - this.baselineOffsetOf(el_1);
        }
      }
      if ( offsetY != 0.0 ) {
        el_1.calculatedY = el_1.calculatedY + offsetY;
        this.propagateOffsetToChildren(el_1, 0.0, offsetY);
      }
      i = i + 1;
    };
  };
  propagateOffsetToChildren (parent, offsetX, offsetY) {
    parent.paintLeft = parent.paintLeft + offsetX;
    parent.paintRight = parent.paintRight + offsetX;
    parent.paintTop = parent.paintTop + offsetY;
    parent.paintBottom = parent.paintBottom + offsetY;
    const childCount = parent.getChildCount();
    let i = 0;
    while (i < childCount) {
      const child = parent.getChild(i);
      if ( offsetX != 0.0 ) {
        child.calculatedX = child.calculatedX + offsetX;
      }
      if ( offsetY != 0.0 ) {
        child.calculatedY = child.calculatedY + offsetY;
      }
      this.propagateOffsetToChildren(child, offsetX, offsetY);
      i = i + 1;
    };
  };
  mirrorChildren (parent) {
    if ( parent.resolvedRtl == false ) {
      return;
    }
    const left = (parent.calculatedX + parent.box.borderWidthPx) + parent.box.paddingLeftPx;
    const right = left + parent.calculatedInnerWidth;
    const span = left + right;
    const n = parent.getChildCount();
    let i = 0;
    while (i < n) {
      const ch = parent.getChild(i);
      if ( ch.isAbsolute == false ) {
        const mL = ch.box.marginLeftPx;
        const mR = ch.box.marginRightPx;
        const marginRightEdge = (ch.calculatedX + ch.calculatedWidth) + mR;
        const nx = (span - marginRightEdge) + mL;
        this.translateSubtree(ch, nx - ch.calculatedX, 0.0);
      }
      i = i + 1;
    };
  };
  translateSubtree (element, dx, dy) {
    element.moveSubtree(dx, dy);
  };
  layoutAbsolute (element, parentWidth, parentHeight) {
    if ( (element.left.isSet && element.right.isSet) && element.width.isSet == false ) {
      const spanW = (((parentWidth - element.left.pixels) - element.right.pixels) - element.box.marginLeftPx) - element.box.marginRightPx;
      if ( spanW > 0.0 ) {
        element.calculatedWidth = spanW;
        element.calculatedInnerWidth = element.box.getInnerWidth(spanW);
      }
    }
    if ( (element.top.isSet && element.bottom.isSet) && element.height.isSet == false ) {
      const spanH = (((parentHeight - element.top.pixels) - element.bottom.pixels) - element.box.marginTopPx) - element.box.marginBottomPx;
      if ( spanH > 0.0 ) {
        element.calculatedHeight = spanH;
        element.calculatedInnerHeight = element.box.getInnerHeight(spanH);
        element.hasDefiniteHeight = true;
      }
    }
    if ( element.left.isSet ) {
      element.calculatedX = element.left.pixels + element.box.marginLeftPx;
    } else {
      if ( element.x.isSet ) {
        element.calculatedX = element.x.pixels + element.box.marginLeftPx;
      } else {
        if ( element.right.isSet ) {
          let width = element.calculatedWidth;
          if ( width == 0.0 ) {
            if ( element.width.isSet ) {
              width = element.width.pixels;
            }
          }
          element.calculatedX = ((parentWidth - element.right.pixels) - width) - element.box.marginRightPx;
        }
      }
    }
    if ( element.top.isSet ) {
      element.calculatedY = element.top.pixels + element.box.marginTopPx;
    } else {
      if ( element.y.isSet ) {
        element.calculatedY = element.y.pixels + element.box.marginTopPx;
      } else {
        if ( element.bottom.isSet ) {
          let height = element.calculatedHeight;
          if ( height == 0.0 ) {
            if ( element.height.isSet ) {
              height = element.height.pixels;
            }
          }
          element.calculatedY = ((parentHeight - element.bottom.pixels) - height) - element.box.marginBottomPx;
        }
      }
    }
  };
  contentExtent (element) {
    let right = 0.0;
    let i = 0;
    const n = element.getChildCount();
    while (i < n) {
      const c = element.getChild(i);
      if ( c.isAbsolute == false ) {
        const r = (c.calculatedX + c.calculatedWidth) + c.box.marginRightPx;
        if ( r > right ) {
          right = r;
        }
      }
      i = i + 1;
    };
    if ( right <= 0.0 ) {
      return 0.0;
    }
    return ((right - element.calculatedX) + element.box.paddingRightPx) + element.box.borderWidthPx;
  };
  placeOverlaysIn (el) {
    if ( el.layoutSkipped && el.overlayScanned ) {
      return el.hasOverlayBelow;
    }
    let any = false;
    let i = 0;
    while (i < el.children.length) {
      const c = el.children[i];
      if ( c.isSurface() ) {
        this.placeOverlay(c, el);
        any = true;
      }
      if ( this.placeOverlaysIn(c) ) {
        any = true;
      }
      i = i + 1;
    };
    el.hasOverlayBelow = any;
    el.overlayScanned = true;
    return any;
  };
  findOverlayAnchor (surface, parent) {
    if ( typeof(surface.overlayAnchor) != "undefined" ) {
      return surface.overlayAnchor;
    }
    if ( surface.positionAnchor.length > 0 ) {
      const named = EVGConnector.lookup(
        surface.positionAnchor,
        this.anchorNames,
        this.anchorNodes
      );
      if ( typeof(named) === "undefined" ) {
      } else {
        return named;
      }
    }
    let i = 0;
    while (i < parent.children.length) {
      const c = parent.children[i];
      if ( c.isOverlayAnchor ) {
        const hit = c;
        return hit;
      }
      i = i + 1;
    };
    let miss;
    return miss;
  };
  overlayRoom (side, ax, ay, aw, ah, w, h, gap) {
    if ( side == "top" ) {
      return (ay - gap) - h;
    }
    if ( side == "bottom" ) {
      return (this.pageHeight - ((ay + ah) + gap)) - h;
    }
    if ( side == "left" ) {
      return (ax - gap) - w;
    }
    if ( side == "right" ) {
      return (this.pageWidth - ((ax + aw) + gap)) - w;
    }
    return 0.0;
  };
  presentationOf (surface) {
    let p = surface.presentation;
    if ( p.length == 0 ) {
      p = "anchored";
    }
    if ( surface.sheetBelow > 0.0 ) {
      if ( this.pageWidth <= surface.sheetBelow ) {
        p = "sheet";
      }
    }
    return p;
  };
  resizeSurface (surface, w, h) {
    surface.calculatedWidth = w;
    surface.calculatedHeight = h;
    surface.calculatedInnerWidth = surface.box.getInnerWidth(w);
    surface.calculatedInnerHeight = surface.box.getInnerHeight(h);
    let kid = 0;
    while (kid < surface.getChildCount()) {
      const kc = surface.getChild(kid);
      kc.resetLayoutState();
      kid = kid + 1;
    };
    if ( surface.getChildCount() == 0 ) {
      return 0.0;
    }
    const content = this.layoutChildren(surface);
    this.mirrorChildren(surface);
    return content;
  };
  setSurfaceHeight (surface, h) {
    surface.calculatedHeight = h;
    surface.calculatedInnerHeight = surface.box.getInnerHeight(h);
  };
  sheetHeight (surface) {
    const chrome = surface.calculatedHeight - surface.calculatedInnerHeight;
    const had = surface.calculatedHeight;
    const content = this.resizeSurface(surface, this.pageWidth, had);
    let h = had;
    if ( surface.getChildCount() > 0 ) {
      h = content + chrome;
    }
    if ( surface.height.isSet ) {
      h = surface.height.pixels;
    }
    if ( h > this.pageHeight ) {
      h = this.pageHeight;
      surface.overlayClamped = true;
    }
    this.setSurfaceHeight(surface, h);
    return h;
  };
  tryCandidates (surface, sides, aligns) {
    sides.push(surface.overlaySide);
    aligns.push(surface.overlayAlign);
    const spec = surface.positionTryFallbacks;
    if ( spec.length > 0 ) {
      const parts = EVGLayout.splitList(spec);
      let i = 0;
      while (i < parts.length) {
        const area = parts[i];
        const sd = EVGElement.areaSide(area);
        if ( sd.length == 0 ) {
          this.warn(("position-try-fallbacks: \"" + area) + "\" is not a position-area");
        } else {
          sides.push(sd);
          aligns.push(EVGElement.areaAlign(area));
        }
        i = i + 1;
      };
    }
    sides.push(EVGLayout.oppositeSide(surface.overlaySide));
    aligns.push(surface.overlayAlign);
  };
  overlaySpot (side, align, ax, ay, aw, ah, w, h, gap) {
    const spot = new OverlaySpot();
    let x = 0.0;
    let y = 0.0;
    if ( side == "top" ) {
      x = this.overlayCross(ax, aw, w, align);
      y = (ay - h) - gap;
    }
    if ( side == "bottom" ) {
      x = this.overlayCross(ax, aw, w, align);
      y = (ay + ah) + gap;
    }
    if ( side == "right" ) {
      x = (ax + aw) + gap;
      y = this.overlayCross(ay, ah, h, align);
    }
    if ( side == "left" ) {
      x = (ax - w) - gap;
      y = this.overlayCross(ay, ah, h, align);
    }
    if ( side == "center" ) {
      x = (this.pageWidth - w) / 2.0;
      y = (this.pageHeight - h) / 2.0;
    }
    spot.x = x;
    spot.y = y;
    spot.room = this.overlayRoom(side, ax, ay, aw, ah, w, h, gap);
    let over = 0.0;
    if ( x < 0.0 ) {
      over = over - x;
    }
    const right = (x + w) - this.pageWidth;
    if ( right > 0.0 ) {
      over = over + right;
    }
    if ( y < 0.0 ) {
      over = over - y;
    }
    const below = (y + h) - this.pageHeight;
    if ( below > 0.0 ) {
      over = over + below;
    }
    spot.over = over;
    return spot;
  };
  placeByAnchorInsets (surface, parent) {
    const maybe = this.findOverlayAnchor(surface, parent);
    if ( typeof(maybe) === "undefined" ) {
      this.overlayErrors.push(surface.id + ": anchor() has no anchor — name one with `position-anchor`");
      return;
    }
    const a = maybe;
    let w = surface.calculatedWidth;
    let h = surface.calculatedHeight;
    let x = surface.calculatedX;
    let y = surface.calculatedY;
    const hasL = surface.anchorLeftSide.length > 0;
    const hasR = surface.anchorRightSide.length > 0;
    const hasT = surface.anchorTopSide.length > 0;
    const hasB = surface.anchorBottomSide.length > 0;
    const lx = EVGLayout.anchorEdgeX(a, surface.anchorLeftSide) + surface.anchorLeftOffset;
    const rx = EVGLayout.anchorEdgeX(a, surface.anchorRightSide) + surface.anchorRightOffset;
    const ty = EVGLayout.anchorEdgeY(a, surface.anchorTopSide) + surface.anchorTopOffset;
    const by = EVGLayout.anchorEdgeY(a, surface.anchorBottomSide) + surface.anchorBottomOffset;
    if ( hasL && hasR ) {
      x = lx;
      const spanW = rx - lx;
      if ( spanW > 0.0 ) {
        this.resizeSurface(surface, spanW, h);
        w = spanW;
      }
    } else {
      if ( hasL ) {
        x = lx;
      }
      if ( hasR ) {
        x = rx - w;
      }
    }
    if ( hasT && hasB ) {
      y = ty;
      const spanH = by - ty;
      if ( spanH > 0.0 ) {
        this.setSurfaceHeight(surface, spanH);
        h = spanH;
      }
    } else {
      if ( hasT ) {
        y = ty;
      }
      if ( hasB ) {
        y = by - h;
      }
    }
    surface.overlayPlacedSide = "anchor";
    surface.overlayPlacedAlign = "";
    surface.overlayPlacedPresentation = "anchored";
    this.finishOverlay(surface, x, y);
  };
  placeOverlay (surface, parent) {
    let w = surface.calculatedWidth;
    let h = surface.calculatedHeight;
    let x = 0.0;
    let y = 0.0;
    surface.overlayClamped = false;
    surface.overlayPlacedAlign = surface.overlayAlign;
    if ( surface.hasAnchorInsets() ) {
      this.placeByAnchorInsets(surface, parent);
      return;
    }
    const pres = this.presentationOf(surface);
    if ( pres == "fullscreen" ) {
      this.resizeSurface(surface, this.pageWidth, this.pageHeight);
      surface.overlayPlacedSide = "cover";
      surface.overlayPlacedPresentation = "fullscreen";
      this.finishOverlay(surface, 0.0, 0.0);
      return;
    }
    if ( pres == "sheet" ) {
      const sheetH = this.sheetHeight(surface);
      surface.overlayPlacedSide = "bottom";
      surface.overlayPlacedAlign = "start";
      surface.overlayPlacedPresentation = "sheet";
      this.finishOverlay(surface, 0.0, this.pageHeight - sheetH);
      return;
    }
    surface.overlayPlacedPresentation = "anchored";
    if ( surface.overlaySide == "cover" ) {
      x = 0.0;
      y = 0.0;
      this.resizeSurface(surface, this.pageWidth, this.pageHeight);
      w = this.pageWidth;
      h = this.pageHeight;
      surface.overlayPlacedSide = "cover";
    } else {
      if ( surface.overlaySide == "center" ) {
        if ( surface.fitViewport ) {
          if ( h > this.pageHeight ) {
            h = this.pageHeight;
            this.setSurfaceHeight(surface, h);
            surface.overlayClamped = true;
          }
        }
        x = (this.pageWidth - w) / 2.0;
        y = (this.pageHeight - h) / 2.0;
        surface.overlayPlacedSide = "center";
      } else {
        if ( surface.overlaySide == "free" ) {
          x = surface.overlayX;
          y = surface.overlayY;
          surface.overlayPlacedSide = "free";
        } else {
          const maybe = this.findOverlayAnchor(surface, parent);
          if ( typeof(maybe) === "undefined" ) {
            this.overlayErrors.push(surface.id + ": overlay has no anchor — give a sibling `overlay-anchor-role`, name one with `position-anchor`, or use `overlay-side: center`");
            return;
          }
          const a = maybe;
          const ax = a.calculatedX;
          const ay = a.calculatedY;
          const aw = a.calculatedWidth;
          const ah = a.calculatedHeight;
          const gap = surface.overlayGap;
          let sides = [];
          let aligns = [];
          this.tryCandidates(surface, sides, aligns);
          const mostSpace = surface.positionTryOrder == "most-space";
          let bestFit = 0 - 1;
          let bestFitRoom = 0.0;
          let bestOver = 0;
          let bestOverVal = 0.0;
          let ci = 0;
          while (ci < sides.length) {
            const cs = sides[ci];
            const ca = aligns[ci];
            const probe = this.overlaySpot(cs, ca, ax, ay, aw, ah, w, h, gap);
            if ( ci == 0 ) {
              bestOverVal = probe.over;
            } else {
              if ( probe.over < bestOverVal ) {
                bestOver = ci;
                bestOverVal = probe.over;
              }
            }
            if ( probe.over <= 0.0 ) {
              if ( bestFit < 0 ) {
                bestFit = ci;
                bestFitRoom = probe.room;
              } else {
                if ( mostSpace ) {
                  if ( probe.room > bestFitRoom ) {
                    bestFit = ci;
                    bestFitRoom = probe.room;
                  }
                }
              }
            }
            ci = ci + 1;
          };
          let pick = bestOver;
          if ( bestFit >= 0 ) {
            pick = bestFit;
          }
          const side = sides[pick];
          const align = aligns[pick];
          let spot = this.overlaySpot(side, align, ax, ay, aw, ah, w, h, gap);
          if ( surface.fitViewport ) {
            let availH = this.pageHeight;
            if ( side == "top" || side == "bottom" ) {
              availH = spot.room + h;
            }
            if ( availH < h ) {
              h = availH;
              if ( h < 0.0 ) {
                h = 0.0;
              }
              this.setSurfaceHeight(surface, h);
              surface.overlayClamped = true;
              spot = this.overlaySpot(side, align, ax, ay, aw, ah, w, h, gap);
            }
          }
          surface.overlayPlacedSide = side;
          surface.overlayPlacedAlign = align;
          x = spot.x;
          y = spot.y;
          x = EVGLayout.clampTo(x, 0.0, (this.pageWidth - w));
          y = EVGLayout.clampTo(y, 0.0, (this.pageHeight - h));
        }
      }
    }
    this.finishOverlay(surface, x, y);
  };
  finishOverlay (surface, x, y) {
    surface.overlayX = x;
    surface.overlayY = y;
    this.translateSubtree(
      surface,
      x - surface.calculatedX,
      y - surface.calculatedY
    );
    if ( surface.clipsContent() ) {
      this.measureScrollExtent(surface);
    }
  };
  overlayCross (anchorStart, anchorSize, size, align) {
    if ( align == "center" ) {
      return anchorStart + (anchorSize - size) / 2.0;
    }
    if ( align == "end" ) {
      return (anchorStart + anchorSize) - size;
    }
    return anchorStart;
  };
  getOverlayErrors () {
    return this.overlayErrors;
  };
  printLayout (element, indent) {
    let indentStr = "";
    let i = 0;
    while (i < indent) {
      indentStr = indentStr + "  ";
      i = i + 1;
    };
    console.log(((((((((((indentStr + element.tagName) + " id=\"") + element.id) + "\" (") + (element.calculatedX.toString())) + ", ") + (element.calculatedY.toString())) + ") ") + (element.calculatedWidth.toString())) + "x") + (element.calculatedHeight.toString()));
    const childCount = element.getChildCount();
    i = 0;
    while (i < childCount) {
      const child = element.getChild(i);
      this.printLayout(child, indent + 1);
      i = i + 1;
    };
  };
  intrinsicWidthOf (el) {
    return this.intrinsicWidth(el, false);
  };
  minIntrinsicWidthOf (el) {
    return this.intrinsicWidth(el, true);
  };
  intrinsicWidth (el, wantMin) {
    if ( el.keepLayout && (el.hasLayout && el.layoutClean) ) {
      if ( wantMin ) {
        if ( el.hasIntrinsicMin ) {
          return el.intrinsicMin;
        }
      } else {
        if ( el.hasIntrinsicMax ) {
          return el.intrinsicMax;
        }
      }
      const measured = this.intrinsicWidthNow(el, wantMin);
      if ( wantMin ) {
        el.intrinsicMin = measured;
        el.hasIntrinsicMin = true;
      } else {
        el.intrinsicMax = measured;
        el.hasIntrinsicMax = true;
      }
      return measured;
    }
    return this.intrinsicWidthNow(el, wantMin);
  };
  intrinsicWidthNow (el, wantMin) {
    let outer = 0.0;
    let definite = el.width.isSet;
    if ( el.width.isPercent() ) {
      definite = false;
    }
    if ( definite ) {
      outer = el.width.pixels;
    } else {
      const textContent = el.textContent;
      if ( textContent.length > 0 ) {
        if ( el.getChildCount() == 0 ) {
          let fs = el.inheritedFontSize;
          if ( el.fontSize.isSet ) {
            fs = el.fontSize.pixels;
          }
          if ( fs <= 0.0 ) {
            fs = 14.0;
          }
          let contentW = 0.0;
          if ( wantMin ) {
            contentW = this.textEngine.minLineWidthSpaced(
              textContent,
              el.effectiveFontFamily(),
              fs,
              el.letterSpacing
            );
          } else {
            contentW = this.textEngine.maxLineWidthSpaced(
              textContent,
              el.effectiveFontFamily(),
              fs,
              el.letterSpacing
            );
          }
          outer = contentW + el.box.getHorizontalChrome();
        }
      } else {
        outer = this.intrinsicOfChildren(el, wantMin);
      }
    }
    if ( outer <= 0.0 ) {
      return 0.0;
    }
    return (outer + el.box.marginLeftPx) + el.box.marginRightPx;
  };
  parentIsRow (el) {
    return this.layingOutAlongRow;
  };
  crossShrinksUnder (parent) {
    if ( parent.flexDirection != "column" ) {
      return false;
    }
    const a = parent.alignItems;
    if ( a == "center" ) {
      return true;
    }
    if ( a == "flex-end" ) {
      return true;
    }
    if ( a == "end" ) {
      return true;
    }
    return false;
  };
  crossAxisFits (el) {
    if ( this.parentIsRow(el) ) {
      return true;
    }
    return this.columnCrossShrinks;
  };
  intrinsicOfChildren (el, wantMin) {
    const n = el.getChildCount();
    if ( n == 0 ) {
      return 0.0;
    }
    const isColumn = el.flexDirection == "column" || el.flexDirection == "column-reverse";
    let gapPx = 0.0;
    if ( el.gap.isSet ) {
      gapPx = el.gap.pixels;
    }
    if ( el.columnGap.isSet ) {
      gapPx = el.columnGap.pixels;
    }
    let total = 0.0;
    let widest = 0.0;
    let counted = 0;
    let i = 0;
    while (i < n) {
      const kid = el.getChild(i);
      if ( kid.isAbsolute || kid.isHidden() ) {
      } else {
        const wasResolved = kid.unitsResolved;
        kid.resolveUnits(el.calculatedInnerWidth, el.calculatedInnerHeight);
        const w = this.intrinsicWidth(kid, wantMin);
        if ( wasResolved == false ) {
          kid.unitsResolved = false;
        }
        if ( w > widest ) {
          widest = w;
        }
        if ( counted > 0 ) {
          total = total + gapPx;
        }
        total = total + w;
        counted = counted + 1;
      }
      i = i + 1;
    };
    let inner = total;
    if ( isColumn ) {
      inner = widest;
    }
    if ( inner <= 0.0 ) {
      return 0.0;
    }
    return inner + el.box.getHorizontalChrome();
  };
  layoutGridOutOfFlow (parent, innerWidth, contentHeight, startX, startY) {
    const n = parent.getChildCount();
    let i = 0;
    while (i < n) {
      const c = parent.getChild(i);
      if ( c.isAbsolute ) {
        c.unitsResolved = false;
        c.resolveUnits(innerWidth, contentHeight);
        this.layoutOutOfFlowChild(
          parent,
          c,
          innerWidth,
          contentHeight,
          startX,
          startY,
          true
        );
      }
      i = i + 1;
    };
  };
  layoutGrid (parent) {
    const innerWidth = parent.calculatedInnerWidth;
    const innerHeight = parent.calculatedInnerHeight;
    const startX = (parent.calculatedX + parent.box.borderWidthPx) + parent.box.paddingLeftPx;
    const startY = (parent.calculatedY + parent.box.borderWidthPx) + parent.box.paddingTopPx;
    let colGapPx = 0.0;
    let rowGapPx = 0.0;
    if ( parent.gap.isSet ) {
      parent.gap.rootFontSize = parent.rootFontSize;
      parent.gap.resolve(innerWidth, parent.inheritedFontSize);
      colGapPx = parent.gap.pixels;
      rowGapPx = parent.gap.pixels;
    }
    if ( parent.columnGap.isSet ) {
      parent.columnGap.rootFontSize = parent.rootFontSize;
      parent.columnGap.resolve(innerWidth, parent.inheritedFontSize);
      colGapPx = parent.columnGap.pixels;
    }
    if ( parent.rowGap.isSet ) {
      parent.rowGap.rootFontSize = parent.rootFontSize;
      parent.rowGap.resolve(innerHeight, parent.inheritedFontSize);
      rowGapPx = parent.rowGap.pixels;
    }
    let colSpec = parent.gridTemplateColumns;
    if ( colSpec.length == 0 ) {
      colSpec = "1fr";
    }
    if ( colSpec == "subgrid" ) {
      if ( parent.subgridColumnSizes.length > 0 ) {
        let sgSpec = "";
        let sg = 0;
        while (sg < parent.subgridColumnSizes.length) {
          if ( sg > 0 ) {
            sgSpec = sgSpec + " ";
          }
          sgSpec = (sgSpec + (parent.subgridColumnSizes[sg].toString())) + "px";
          sg = sg + 1;
        };
        colSpec = sgSpec;
      } else {
        if ( parent.subgridPending == false ) {
          this.warn("grid-template-columns: subgrid has no enclosing grid to inherit tracks from; falling back to 1fr");
        }
        colSpec = "1fr";
      }
    }
    const areas = EVGGridAreas.parse(parent.gridTemplateAreas);
    let hasAreas = false;
    if ( parent.gridTemplateAreas.length > 0 ) {
      if ( areas.hadError ) {
        this.warn("grid-template-areas: " + areas.errorText);
      } else {
        hasAreas = true;
        if ( parent.gridTemplateColumns.length == 0 ) {
          let derived = "";
          let dc = 0;
          while (dc < areas.columns) {
            if ( dc > 0 ) {
              derived = derived + " ";
            }
            derived = derived + "1fr";
            dc = dc + 1;
          };
          colSpec = derived;
        }
      }
    }
    const cols = EVGGridTemplate.parse(colSpec);
    if ( cols.hadError ) {
      this.warn("grid-template-columns: " + cols.errorText);
    }
    const colCount = cols.count();
    if ( colCount < 1 ) {
      return 0.0;
    }
    const colGapTotal = (colCount - 1) * colGapPx;
    let rowTemplateSpec = parent.gridTemplateRows;
    if ( rowTemplateSpec == "subgrid" ) {
      rowTemplateSpec = "";
    }
    const rowTemplate = EVGGridTemplate.parse(rowTemplateSpec);
    let items = [];
    let colStarts = [];
    let colSpans = [];
    let rowStarts = [];
    let rowSpans = [];
    let i = 0;
    const childCount = parent.getChildCount();
    while (i < childCount) {
      const c = parent.getChild(i);
      c.inheritProperties(parent);
      c.resolveUnits(innerWidth, innerHeight);
      if ( c.gridTemplateColumns == "subgrid" || c.gridTemplateRows == "subgrid" ) {
        c.subgridPending = true;
      }
      if ( c.isAbsolute == false ) {
        const cp = EVGGridPlacement.parse(c.gridColumn);
        cp.resolveNames(cols);
        if ( cp.hadError ) {
          this.warn("grid-column: " + cp.errorText);
        }
        const rp = EVGGridPlacement.parse(c.gridRow);
        rp.resolveNames(rowTemplate);
        if ( rp.hadError ) {
          this.warn("grid-row: " + rp.errorText);
        }
        if ( hasAreas ) {
          if ( c.gridArea.length > 0 ) {
            const at = areas.indexOfName(c.gridArea);
            if ( at >= 0 ) {
              cp.start = areas.colStart[at] + 1;
              cp.span = areas.colSpan[at];
              rp.start = areas.rowStart[at] + 1;
              rp.span = areas.rowSpan[at];
            } else {
              this.warn(("grid-area: no area named \"" + c.gridArea) + "\" in grid-template-areas");
            }
          }
        }
        let cspan = cp.span;
        if ( cspan > colCount ) {
          cspan = colCount;
        }
        items.push(c);
        colStarts.push(cp.start);
        colSpans.push(cspan);
        rowStarts.push(rp.start);
        rowSpans.push(rp.span);
      }
      i = i + 1;
    };
    const itemCount = items.length;
    if ( itemCount == 0 ) {
      this.layoutGridOutOfFlow(parent, innerWidth, innerHeight, startX, startY);
      return 0.0;
    }
    const isDense = parent.gridAutoFlow.indexOf("dense") >= 0;
    let occupied = [];
    let rowsUsed = 0;
    let placedRow = [];
    let placedCol = [];
    let cursorRow = 0;
    let cursorCol = 0;
    let k = 0;
    while (k < itemCount) {
      const wantCol = colStarts[k];
      const wantRow = rowStarts[k];
      const span = colSpans[k];
      const rspan = rowSpans[k];
      let col = 0;
      let row = 0;
      if ( wantCol > 0 ) {
        col = wantCol - 1;
        if ( col > colCount - span ) {
          col = colCount - span;
        }
        if ( col < 0 ) {
          col = 0;
        }
      }
      if ( wantRow > 0 ) {
        row = wantRow - 1;
      }
      if ( wantCol > 0 && wantRow > 0 ) {
      } else {
        if ( wantRow > 0 ) {
          cursorRow = row;
          cursorCol = 0;
        }
        if ( wantCol > 0 ) {
          row = cursorRow;
          while (this.gridOccupied(occupied, colCount, row, col, span, rspan)) {
            row = row + 1;
          };
        } else {
          if ( isDense ) {
            row = 0;
            col = 0;
          } else {
            row = cursorRow;
            col = cursorCol;
          }
          let searching = true;
          while (searching) {
            if ( col + span > colCount ) {
              row = row + 1;
              col = 0;
            } else {
              if ( this.gridOccupied(occupied, colCount, row, col, span, rspan) ) {
                col = col + 1;
              } else {
                searching = false;
              }
            }
          };
          if ( isDense == false ) {
            cursorRow = row;
            cursorCol = col + span;
          }
        }
      }
      const needRows = row + rspan;
      while (rowsUsed < needRows) {
        let g = 0;
        while (g < colCount) {
          occupied.push(false);
          g = g + 1;
        };
        rowsUsed = rowsUsed + 1;
      };
      let rr = 0;
      while (rr < rspan) {
        let cc = 0;
        while (cc < span) {
          const idx = ((row + rr) * colCount + col) + cc;
          occupied[idx] = true;
          cc = cc + 1;
        };
        rr = rr + 1;
      };
      placedRow.push(row);
      placedCol.push(col);
      k = k + 1;
    };
    let colContent = [];
    let colMinContent = [];
    let ci = 0;
    while (ci < colCount) {
      colContent.push(0.0);
      colMinContent.push(0.0);
      ci = ci + 1;
    };
    if ( cols.hasIntrinsicTrack() ) {
      let ic = 0;
      while (ic < items.length) {
        if ( colSpans[ic] == 1 ) {
          const col2 = placedCol[ic];
          if ( col2 < colCount ) {
            const it = items[ic];
            const w2 = this.intrinsicWidthOf(it);
            if ( w2 > colContent[col2] ) {
              colContent[col2] = w2;
            }
            const m2 = this.minIntrinsicWidthOf(it);
            if ( m2 > colMinContent[col2] ) {
              colMinContent[col2] = m2;
            }
          }
        }
        ic = ic + 1;
      };
    }
    cols.resolveWithContent(
      innerWidth - colGapTotal,
      colContent,
      colMinContent
    );
    let rowSpec = parent.gridTemplateRows;
    let rowSizes = [];
    let rowGapTotal = 0.0;
    if ( rowsUsed > 1 ) {
      rowGapTotal = (rowsUsed - 1) * rowGapPx;
    }
    let usingRowSubgrid = false;
    if ( rowSpec == "subgrid" ) {
      if ( parent.subgridRowSizes.length > 0 ) {
        usingRowSubgrid = true;
        let sgrSpec = "";
        let sgr = 0;
        while (sgr < parent.subgridRowSizes.length) {
          if ( sgr > 0 ) {
            sgrSpec = sgrSpec + " ";
          }
          sgrSpec = (sgrSpec + (parent.subgridRowSizes[sgr].toString())) + "px";
          sgr = sgr + 1;
        };
        rowSpec = sgrSpec;
      } else {
        if ( parent.subgridPending == false ) {
          this.warn("grid-template-rows: subgrid has no enclosing grid to inherit tracks from; falling back to content-sized rows");
        }
        rowSpec = "";
      }
    }
    let haveTemplateRows = false;
    if ( rowSpec.length > 0 ) {
      if ( parent.hasDefiniteHeight || usingRowSubgrid ) {
        haveTemplateRows = true;
      }
    }
    if ( haveTemplateRows ) {
      const rows = EVGGridTemplate.parse(rowSpec);
      if ( rows.hadError ) {
        this.warn("grid-template-rows: " + rows.errorText);
      }
      rows.resolve(innerHeight - rowGapTotal);
      let r2 = 0;
      while (r2 < rowsUsed) {
        if ( r2 < rows.count() ) {
          const tk = rows.trackAt(r2);
          rowSizes.push(tk.sizePx);
        } else {
          if ( rows.count() > 0 ) {
            const lastTk = rows.trackAt((rows.count() - 1));
            rowSizes.push(lastTk.sizePx);
          } else {
            rowSizes.push(0.0);
          }
        }
        r2 = r2 + 1;
      };
    } else {
      let r3 = 0;
      while (r3 < rowsUsed) {
        rowSizes.push(0.0);
        r3 = r3 + 1;
      };
      let m = 0;
      while (m < itemCount) {
        const it_1 = items[m];
        const rspanM = rowSpans[m];
        const ri = placedRow[m];
        const isRowSubgrid = it_1.gridTemplateRows == "subgrid";
        if ( rspanM == 1 || isRowSubgrid ) {
          const cw = cols.extentOf(placedCol[m], colSpans[m], colGapPx);
          const avail = (cw - it_1.box.marginLeftPx) - it_1.box.marginRightPx;
          it_1.calculatedFlexHeight = 0.0;
          this.layoutElement(it_1, 0.0, 0.0, avail, 0.0);
          if ( isRowSubgrid ) {
            let sub = 0;
            while (sub < rspanM) {
              if ( sub < it_1.computedRowSizes.length ) {
                const sh = it_1.computedRowSizes[sub];
                if ( sh > rowSizes[(ri + sub)] ) {
                  rowSizes[ri + sub] = sh;
                }
              }
              sub = sub + 1;
            };
          } else {
            const h = (it_1.calculatedHeight + it_1.box.marginTopPx) + it_1.box.marginBottomPx;
            if ( h > rowSizes[ri] ) {
              rowSizes[ri] = h;
            }
          }
        }
        m = m + 1;
      };
      if ( rowSpec.length > 0 ) {
        const declared = EVGGridTemplate.parse(rowSpec);
        if ( declared.hadError ) {
          this.warn("grid-template-rows: " + declared.errorText);
        }
        let dr = 0;
        while (dr < rowsUsed) {
          if ( dr < declared.count() ) {
            const dt = declared.trackAt(dr);
            if ( dt.kind == 0 ) {
              rowSizes[dr] = dt.value;
            }
          }
          dr = dr + 1;
        };
      }
    }
    let p = 0;
    while (p < itemCount) {
      const el = items[p];
      const cIdx = placedCol[p];
      const rIdx = placedRow[p];
      const cSpan = colSpans[p];
      const rSpan = rowSpans[p];
      const cellW = cols.extentOf(cIdx, cSpan, colGapPx);
      const cellH = this.gridRowExtent(rowSizes, rIdx, rSpan, rowGapPx);
      const offX = cols.offsetOf(cIdx, colGapPx);
      const offY = this.gridRowOffset(rowSizes, rIdx, rowGapPx);
      el.calculatedX = (startX + offX) + el.box.marginLeftPx;
      el.calculatedY = (startY + offY) + el.box.marginTopPx;
      let boxW = (cellW - el.box.marginLeftPx) - el.box.marginRightPx;
      let boxH = (cellH - el.box.marginTopPx) - el.box.marginBottomPx;
      if ( boxW < 0.0 ) {
        boxW = 0.0;
      }
      if ( boxH < 0.0 ) {
        boxH = 0.0;
      }
      if ( boxH > 0.0 ) {
        el.calculatedFlexHeight = boxH;
      }
      if ( el.gridTemplateColumns == "subgrid" ) {
        el.subgridColumnSizes.length = 0;
        let sgi = 0;
        while (sgi < cSpan) {
          const tk_1 = cols.trackAt((cIdx + sgi));
          el.subgridColumnSizes.push(tk_1.sizePx);
          sgi = sgi + 1;
        };
      }
      if ( el.gridTemplateRows == "subgrid" ) {
        el.subgridRowSizes.length = 0;
        let sgj = 0;
        while (sgj < rSpan) {
          const rIdx2 = rIdx + sgj;
          if ( rIdx2 < rowSizes.length ) {
            el.subgridRowSizes.push(rowSizes[rIdx2]);
          }
          sgj = sgj + 1;
        };
      }
      el.unitsResolved = false;
      el.resolveUnits(boxW, boxH);
      this.layoutElement(el, el.calculatedX, el.calculatedY, boxW, boxH);
      p = p + 1;
    };
    parent.computedRowSizes.length = 0;
    let cr = 0;
    while (cr < rowsUsed) {
      parent.computedRowSizes.push(rowSizes[cr]);
      cr = cr + 1;
    };
    let total = 0.0;
    let s = 0;
    while (s < rowsUsed) {
      total = total + rowSizes[s];
      s = s + 1;
    };
    total = total + rowGapTotal;
    let absH = innerHeight;
    if ( absH <= 0.0 ) {
      absH = total;
    }
    this.layoutGridOutOfFlow(parent, innerWidth, absH, startX, startY);
    return total;
  };
  gridOccupied (occupied, colCount, row, col, span, rspan) {
    const total = occupied.length;
    let rr = 0;
    while (rr < rspan) {
      let cc = 0;
      while (cc < span) {
        const idx = ((row + rr) * colCount + col) + cc;
        if ( idx < total ) {
          if ( occupied[idx] ) {
            return true;
          }
        }
        cc = cc + 1;
      };
      rr = rr + 1;
    };
    return false;
  };
  gridRowExtent (rowSizes, from, span, gap) {
    let total = 0.0;
    const n = rowSizes.length;
    let i = from;
    let placed = 0;
    while (i < n && placed < span) {
      total = total + rowSizes[i];
      placed = placed + 1;
      i = i + 1;
    };
    if ( placed > 1 ) {
      total = total + (placed - 1) * gap;
    }
    return total;
  };
  gridRowOffset (rowSizes, index, gap) {
    let total = 0.0;
    let i = 0;
    while (i < index) {
      total = total + rowSizes[i];
      total = total + gap;
      i = i + 1;
    };
    return total;
  };
  estimateChildWidth (child, maxInnerWidth, alongRow) {
    if ( child.width.isSet ) {
      return child.width.pixels;
    }
    if ( child.hasFlexWidth ) {
      return child.calculatedFlexWidth;
    }
    const textContent = child.textContent;
    if ( textContent.length > 0 ) {
      if ( child.getChildCount() == 0 ) {
        let fontSize = child.inheritedFontSize;
        if ( child.fontSize.isSet ) {
          fontSize = child.fontSize.pixels;
        }
        if ( fontSize <= 0.0 ) {
          fontSize = 14.0;
        }
        const contentW = this.textEngine.maxLineWidthSpaced(
          textContent,
          child.effectiveFontFamily(),
          fontSize,
          child.letterSpacing
        );
        const measuredW = ((contentW + child.box.paddingLeftPx) + child.box.paddingRightPx) + child.box.borderWidthPx * 2.0;
        if ( measuredW < maxInnerWidth ) {
          return measuredW;
        }
      }
    }
    if ( child.display == "flex" && alongRow ) {
      const intrinsic = this.intrinsicWidth(child, false);
      if ( intrinsic > 0.0 ) {
        if ( intrinsic < maxInnerWidth ) {
          return intrinsic;
        }
      }
    }
    return maxInnerWidth;
  };
}
EVGLayout.clearCssMarks = function(el) {
  el.clearCssMarks();
  let i = 0;
  while (i < el.getChildCount()) {
    EVGLayout.clearCssMarks(el.getChild(i));
    i = i + 1;
  };
};
EVGLayout.oppositeSide = function(side) {
  if ( side == "top" ) {
    return "bottom";
  }
  if ( side == "bottom" ) {
    return "top";
  }
  if ( side == "left" ) {
    return "right";
  }
  if ( side == "right" ) {
    return "left";
  }
  return side;
};
EVGLayout.clampTo = function(v, lo, hi) {
  if ( hi < lo ) {
    return lo;
  }
  if ( v < lo ) {
    return lo;
  }
  if ( v > hi ) {
    return hi;
  }
  return v;
};
EVGLayout.splitList = function(spec) {
  let out = [];
  let cur = "";
  let i = 0;
  const n = spec.length;
  while (i <= n) {
    let brk = i == n;
    if ( brk == false ) {
      if ( spec.charCodeAt(i ) == 44 ) {
        brk = true;
      }
    }
    if ( brk ) {
      const t = cur.trim();
      if ( t.length > 0 ) {
        out.push(t);
      }
      cur = "";
    } else {
      cur = cur + spec.substring(i, i + 1 );
    }
    i = i + 1;
  };
  return out;
};
EVGLayout.anchorEdgeX = function(a, side) {
  if ( side == "right" ) {
    return a.calculatedX + a.calculatedWidth;
  }
  if ( side == "center" ) {
    return a.calculatedX + a.calculatedWidth / 2.0;
  }
  return a.calculatedX;
};
EVGLayout.anchorEdgeY = function(a, side) {
  if ( side == "bottom" ) {
    return a.calculatedY + a.calculatedHeight;
  }
  if ( side == "center" ) {
    return a.calculatedY + a.calculatedHeight / 2.0;
  }
  return a.calculatedY;
};
class EVGDrawCmd  {
  constructor() {
    this.kind = 0;
    this.x = 0.0;
    this.y = 0.0;
    this.w = 0.0;
    this.h = 0.0;
    this.radius = 0.0;
    this.perCorner = false;
    this.radiusTR = 0.0;
    this.radiusBR = 0.0;
    this.radiusBL = 0.0;
    this.thickness = 0.0;
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 1.0;
    this.text = "";
    this.fontFamily = "";
    this.fontSize = 0.0;
    this.textAlign = "";
    this.fontWeight = "";
    this.letterSpacing = 0.0;
    this.strokeCap = 0;
    this.strokeJoin = 0;
    this.strokeDash = "";
    this.strokeDashOffset = 0.0;
    this.maxWidth = 0.0;
    this.hasGrad = false;
    this.gradDir = 0;
    this.r2 = 0;
    this.g2 = 0;
    this.b2 = 0;
    this.a2 = 1.0;
    this.backdropBlur = 0.0;
    this.effectId = "";
    this.hasShadow = false;
    this.shadowX = 0.0;
    this.shadowY = 0.0;
    this.shadowBlur = 0.0;
    this.shadowR = 0;
    this.shadowG = 0;
    this.shadowB = 0;
    this.shadowA = 0.35;
    this.src = "";
    this.flipH = false;
    this.flipV = false;
    this.hasCrop = false;
    this.cropX = 0.0;
    this.cropY = 0.0;
    this.cropW = 1.0;
    this.cropH = 1.0;
    this.pts = [];
    this.ringEnds = [];
    this.evenOdd = false;
    this.rotate = 0.0;
    this.node = 0 - 1;
    this.rotOriginX = 0.0;
    this.rotOriginY = 0.0;
    this.hasRotOrigin = false;
    this.layer = 0;
  }
  kindName () {
    if ( this.kind == 0 ) {
      return "RECT";
    }
    if ( this.kind == 1 ) {
      return "BORDER";
    }
    if ( this.kind == 2 ) {
      return "IMAGE";
    }
    if ( this.kind == 3 ) {
      return "TEXT";
    }
    if ( this.kind == 4 ) {
      return "PUSH_CLIP";
    }
    if ( this.kind == 5 ) {
      return "POP_CLIP";
    }
    if ( this.kind == 6 ) {
      return "PATH";
    }
    return "STROKE";
  };
}
class EVGSceneBinary  {
  constructor() {
    this.cmds = new Int32Array(0);
    this.pts = new Int32Array(0);
    this.ends = new Int32Array(0);
    this.strings = [];
    this.count = 0;
    this.width = 0.0;     /* note: unused */
    this.height = 0.0;     /* note: unused */
    this.viewX = 0.0;
    this.viewY = 0.0;
    this.viewScale = 1.0;
    this.hasView = false;
    let s_1 = [];
    this.strings = s_1;
  }
}
class EVGDisplayList  {
  constructor() {
    this.cmds = [];
    this.attribute = false;
    this.curNode = 0 - 1;
    this.deferredOverlays = [];
    this.turnedDepth = 0;
    this.textEngine = new EVGTextEngine();
    this.viewX = 0.0;
    this.viewY = 0.0;
    this.viewScale = 1.0;
    this.hasView = false;
    this.regionLeft = 0.0;
    this.regionTop = 0.0;
    this.regionRight = 0.0;
    this.regionBottom = 0.0;
    this.hasRegion = false;
    this.paintIds = [];
    this.paintStart = [];
    this.paintCount = [];
    this.paintPool = [];
    this.focusRingId = "";
    this.focusRingR = 125;
    this.focusRingG = 211;
    this.focusRingB = 252;
    this.focusRingA = 1.0;
    this.focusRingWidth = 2.0;
    this.focusRingPad = 2.0;
    this.ringCmd = 0 - 1;
    this.ringEl = undefined;
    this.culling = true;
    this.buildSeq = 0;
    this.layerEls = [];
    this.layerTop = [];
    this.layerLeft = [];
    this.layerShiftX = [];
    this.layerShiftY = [];
    this.layerCullL = [];
    this.layerCullT = [];
    this.layerCullR = [];
    this.layerCullB = [];
    this.layerClip = [];
    this.layerFirst = [];
    this.layerLast = [];
    this.layerStack = [];
    this.layerKind = [];
    this.layerScale = [];
    this.fragments = true;
    this.fragHits = 0;
    this.fragMisses = 0;
    this.fragEls = [];
    this.fragLists = [];
    this.fragStamps = [];
    this.fragOffX = [];
    this.fragOffY = [];
    this.scrollbars = false;
    this.barState = 0;
    this.barHover = undefined;
    this.barNear = undefined;
    this.layerPct = [];
    this.layerLabel = [];
    this.frameSeq = 0;
    this.backdropR = 255;
    this.backdropG = 255;
    this.backdropB = 255;
    this.overscanBefore = 0.0 - 1.0;
    this.overscanAfter = 0.0 - 1.0;
    this.drawScale = 1.0;
    this.cullOn = false;
    this.cullLeft = 0.0;
    this.cullTop = 0.0;
    this.cullRight = 0.0;
    this.cullBottom = 0.0;
    this.effectKind = "";
    this.effectXs = [];
    this.effectYs = [];
    this.effectAges = [];
    this.effectSpeed = 0.0;
    this.effectWidth = 0.0;
    this.effectStrength = 0.0;
    this.effectDecay = 0.0;
    this.effectHighlight = 0.0;
    this.effectRings = 1.0;
    this.effectStagger = 0.0;
    this.effectFalloff = 0.0;
    this.effectShine = 0.0;
    this.effectGloss = 1.0;
    this.effectBump = 0.0;
    this.effectLightX = 0.0;
    this.effectLightY = 0.0;
    this.effectLightZ = 1.0;
    this.fxIds = [];
    this.fxKinds = [];
    this.fxTriggers = [];
    this.fxX = [];
    this.fxY = [];
    this.fxW = [];
    this.fxH = [];
    this.fxRadius = [];
    this.fxParamStart = [];
    this.fxParamCount = [];
    this.fxParamNames = [];
    this.fxParamValues = [];
  }
  setView (x, y, scale) {
    this.viewX = x;
    this.viewY = y;
    this.viewScale = scale;
    this.hasView = (x != 0.0 || y != 0.0) || scale != 1.0;
  };
  setRegion (l, t, r, b) {
    this.regionLeft = l;
    this.regionTop = t;
    this.regionRight = r;
    this.regionBottom = b;
    this.hasRegion = true;
  };
  clearRegion () {
    this.hasRegion = false;
  };
  clearView () {
    this.viewX = 0.0;
    this.viewY = 0.0;
    this.viewScale = 1.0;
    this.hasView = false;
  };
  setTextEngine (e) {
    this.textEngine = e;
  };
  addCmd (c) {
    c.node = this.curNode;
    this.cmds.push(c);
  };
  count () {
    return this.cmds.length;
  };
  at (i) {
    return this.cmds[i];
  };
  paintAt (id, from) {
    if ( id.length == 0 ) {
      return;
    }
    this.paintIds.push(id);
    this.paintStart.push(this.paintPool.length);
    const n = from.count();
    let i = 0;
    while (i < n) {
      this.paintPool.push(from.at(i));
      i = i + 1;
    };
    this.paintCount.push(n);
  };
  paintedCount () {
    return this.paintIds.length;
  };
  emitPainted (id) {
    let i = 0;
    const n = this.paintIds.length;
    while (i < n) {
      if ( this.paintIds[i] == id ) {
        const from = this.paintStart[i];
        const count = this.paintCount[i];
        let k = 0;
        while (k < count) {
          this.addCmd(this.paintPool[(from + k)]);
          k = k + 1;
        };
      }
      i = i + 1;
    };
  };
  setFocusRing (id) {
    this.focusRingId = id;
  };
  setFocusRingStyle (r, g, b, alpha, width, pad) {
    this.focusRingR = r;
    this.focusRingG = g;
    this.focusRingB = b;
    this.focusRingA = alpha;
    this.focusRingWidth = width;
    this.focusRingPad = pad;
  };
  paintFocusRing (root) {
    if ( this.focusRingId.length == 0 ) {
      return;
    }
    const found = EVGDisplayList.ringTarget(root, this.focusRingId);
    if ( typeof(found) != "undefined" ) {
      this.ringAround(found);
    }
  };
  ringAround (el) {
    if ( el.calculatedWidth <= 0.0 ) {
      return;
    }
    if ( el.calculatedHeight <= 0.0 ) {
      return;
    }
    const col = EVGColor.rgba(
      this.focusRingR,
      this.focusRingG,
      this.focusRingB,
      this.focusRingA
    );
    const c = new EVGDrawCmd();
    c.kind = 1;
    c.x = el.calculatedX - this.focusRingPad;
    c.y = el.calculatedY - this.focusRingPad;
    c.w = el.calculatedWidth + this.focusRingPad * 2.0;
    c.h = el.calculatedHeight + this.focusRingPad * 2.0;
    c.thickness = this.focusRingWidth;
    const rad = el.box.borderRadiusPx;
    if ( rad > 0.0 ) {
      c.radius = rad + this.focusRingPad;
    }
    c.r = col.red();
    c.g = col.green();
    c.b = col.blue();
    c.a = col.alpha();
    c.layer = this.layerAround(el);
    this.addCmd(c);
    this.ringCmd = this.cmds.length - 1;
    this.ringEl = el;
  };
  layerAround (el) {
    let found = 0;
    let i = 0;
    while (i < this.layerEls.length) {
      if ( this.layerKind[i] == 0 ) {
        if ( EVGDisplayList.holds(this.layerEls[i], el) ) {
          found = i + 1;
        }
      }
      i = i + 1;
    };
    return found;
  };
  refreshRing () {
    if ( this.ringCmd < 0 ) {
      return;
    }
    if ( this.ringCmd >= this.cmds.length ) {
      return;
    }
    if ( typeof(this.ringEl) != "undefined" ) {
      const el = this.ringEl;
      const c = this.cmds[this.ringCmd];
      c.x = el.calculatedX - this.focusRingPad;
      c.y = el.calculatedY - this.focusRingPad;
      c.w = el.calculatedWidth + this.focusRingPad * 2.0;
      c.h = el.calculatedHeight + this.focusRingPad * 2.0;
    }
  };
  addRect (x, y, w, h, col) {
    const c = new EVGDrawCmd();
    c.kind = 0;
    c.x = x;
    c.y = y;
    c.w = w;
    c.h = h;
    c.r = col.red();
    c.g = col.green();
    c.b = col.blue();
    c.a = col.alpha();
    this.addCmd(c);
  };
  addFrame (x, y, w, h, thickness, col) {
    this.addTurnedFrame(x, y, w, h, thickness, col, 0.0, 0.0, 0.0);
  };
  addTurnedFrame (x, y, w, h, thickness, col, deg, ox, oy) {
    const c = new EVGDrawCmd();
    c.kind = 1;
    c.x = x;
    c.y = y;
    c.w = w;
    c.h = h;
    c.thickness = thickness;
    c.r = col.red();
    c.g = col.green();
    c.b = col.blue();
    c.a = col.alpha();
    if ( deg > 0.001 || deg < 0.0 - 0.001 ) {
      c.rotate = deg;
      c.rotOriginX = ox;
      c.rotOriginY = oy;
      c.hasRotOrigin = true;
    }
    this.addCmd(c);
  };
  addImage (src, x, y, w, h, flipH, flipV, rotate) {
    if ( src.length == 0 ) {
      return;
    }
    const c = new EVGDrawCmd();
    c.kind = 2;
    c.x = x;
    c.y = y;
    c.w = w;
    c.h = h;
    c.src = src;
    c.a = 1.0;
    c.flipH = flipH;
    c.flipV = flipV;
    c.rotate = rotate;
    this.addCmd(c);
  };
  addText (text, x, y, size, col, family, bold, italic, width, height) {
    if ( text.length == 0 ) {
      return;
    }
    const c = new EVGDrawCmd();
    c.kind = 3;
    c.x = x;
    c.y = y;
    c.w = width;
    c.h = height;
    c.text = text;
    c.fontFamily = family;
    c.fontSize = size;
    if ( bold ) {
      c.fontWeight = "bold";
    }
    if ( italic ) {
      c.textAlign = "italic";
    }
    c.r = col.red();
    c.g = col.green();
    c.b = col.blue();
    c.a = col.alpha();
    this.addCmd(c);
  };
  addClip (x, y, w, h) {
    const c = new EVGDrawCmd();
    c.kind = 4;
    c.x = x;
    c.y = y;
    c.w = w;
    c.h = h;
    this.addCmd(c);
  };
  addPolyline (pts, thickness, col) {
    if ( pts.length < 4 ) {
      return;
    }
    const c = new EVGDrawCmd();
    c.kind = 7;
    c.thickness = thickness;
    c.r = col.red();
    c.g = col.green();
    c.b = col.blue();
    c.a = col.alpha();
    let i = 0;
    while (i < pts.length) {
      c.pts.push(pts[i]);
      i = i + 1;
    };
    c.ringEnds.push(c.pts.length);
    this.setPolyBounds(c);
    this.addCmd(c);
  };
  addPolyRings (rings, col, evenOddFill) {
    if ( rings.length == 0 ) {
      return;
    }
    const c = new EVGDrawCmd();
    c.kind = 6;
    c.evenOdd = evenOddFill;
    c.r = col.red();
    c.g = col.green();
    c.b = col.blue();
    c.a = col.alpha();
    let i = 0;
    while (i < rings.length) {
      const ring = rings[i];
      let j = 0;
      while (j < ring.pts.length) {
        c.pts.push(ring.pts[j]);
        j = j + 1;
      };
      c.ringEnds.push(c.pts.length);
      i = i + 1;
    };
    if ( c.pts.length < 6 ) {
      return;
    }
    this.setPolyBounds(c);
    this.addCmd(c);
  };
  addPolygon (pts, col) {
    if ( pts.length < 6 ) {
      return;
    }
    const c = new EVGDrawCmd();
    c.kind = 6;
    c.r = col.red();
    c.g = col.green();
    c.b = col.blue();
    c.a = col.alpha();
    let i = 0;
    while (i < pts.length) {
      c.pts.push(pts[i]);
      i = i + 1;
    };
    c.ringEnds.push(c.pts.length);
    this.setPolyBounds(c);
    this.addCmd(c);
  };
  setPolyBounds (c) {
    let minX = 0.0;
    let minY = 0.0;
    let maxX = 0.0;
    let maxY = 0.0;
    const n = ((c.pts.length / 2) | 0);
    let i = 0;
    while (i < n) {
      const x = c.pts[(i * 2)];
      const yat = i * 2 + 1;
      const y = c.pts[yat];
      if ( i == 0 ) {
        minX = x;
        maxX = x;
        minY = y;
        maxY = y;
      } else {
        if ( x < minX ) {
          minX = x;
        }
        if ( x > maxX ) {
          maxX = x;
        }
        if ( y < minY ) {
          minY = y;
        }
        if ( y > maxY ) {
          maxY = y;
        }
      }
      i = i + 1;
    };
    c.x = minX;
    c.y = minY;
    c.w = maxX - minX;
    c.h = maxY - minY;
  };
  addClipEnd () {
    const c = new EVGDrawCmd();
    c.kind = 5;
    this.addCmd(c);
  };
  addLayerClip (el, x, y, w, h) {
    const src = this.contentLayerFor(el);
    const cp = new EVGDrawCmd();
    cp.kind = 4;
    cp.x = x;
    cp.y = y;
    cp.w = w;
    cp.h = h;
    if ( src >= 0 ) {
      cp.layer = this.layerEls.length + 1;
      this.layerStack.push(this.layerEls.length);
      this.layerEls.push(el);
      this.layerTop.push(el.scrollTop);
      this.layerLeft.push(el.scrollLeft);
      this.layerShiftX.push(0.0);
      this.layerShiftY.push(0.0);
      this.layerClip.push(this.cmds.length);
      this.layerFirst.push(this.cmds.length + 1);
      this.layerLast.push(this.cmds.length + 1);
      this.layerCullL.push(this.layerCullL[src]);
      this.layerCullT.push(this.layerCullT[src]);
      this.layerCullR.push(this.layerCullR[src]);
      this.layerCullB.push(this.layerCullB[src]);
      this.layerKind.push(0);
      this.layerScale.push(1.0);
      this.layerPct.push(0);
      this.layerLabel.push(0 - 1);
    }
    this.addCmd(cp);
  };
  addLayerClipEnd () {
    if ( this.layerStack.length > 0 ) {
      const done = this.layerStack[(this.layerStack.length - 1)];
      this.layerLast[done] = this.cmds.length;
      this.layerStack.pop();
    }
    const pp = new EVGDrawCmd();
    pp.kind = 5;
    this.addCmd(pp);
  };
  layerCovers (el, x, y, w, h) {
    const i = this.contentLayerFor(el);
    if ( i < 0 ) {
      if ( y + h < el.calculatedY ) {
        return false;
      }
      if ( y > el.calculatedY + el.calculatedHeight ) {
        return false;
      }
      if ( x + w < el.calculatedX ) {
        return false;
      }
      if ( x > el.calculatedX + el.calculatedWidth ) {
        return false;
      }
      return true;
    }
    if ( y + h < this.layerCullT[i] ) {
      return false;
    }
    if ( y > this.layerCullB[i] ) {
      return false;
    }
    if ( x + w < this.layerCullL[i] ) {
      return false;
    }
    if ( x > this.layerCullR[i] ) {
      return false;
    }
    return true;
  };
  contentLayerFor (el) {
    let i = 0;
    while (i < this.layerEls.length) {
      if ( this.layerKind[i] == 0 ) {
        if ( this.layerEls[i] == el ) {
          return i;
        }
      }
      i = i + 1;
    };
    return 0 - 1;
  };
  svgDocumentOf (el) {
    let key = el.svgSource;
    if ( el.fillColor.isSet ) {
      const fill = el.fillColor;
      key = key + ("|" + ((fill.r.toString()) + ("," + ((fill.g.toString()) + ("," + ((fill.b.toString()) + ("," + (fill.a.toString()))))))));
    }
    if ( typeof(el.svgDoc) != "undefined" ) {
      if ( el.svgDocKey == key ) {
        return el.svgDoc;
      }
    }
    const sp = new SvgParser();
    if ( el.fillColor.isSet ) {
      sp.setInitialFill(el.fillColor);
    }
    const doc = sp.parse(el.svgSource);
    el.svgDoc = doc;
    el.svgDocKey = key;
    return doc;
  };
  walkSvgDocument (el, x, y, w, h) {
    const doc = this.svgDocumentOf(el);
    if ( doc.itemCount() == 0 ) {
      return;
    }
    const vb = doc.effectiveViewBox();
    const m = VectorViewBox.resolve(vb, w, h, "xMidYMid meet");
    const steps = this.flattenSteps(w, h);
    let scale = m.a;
    if ( scale < 0.0 ) {
      scale = 0.0 - scale;
    }
    if ( scale <= 0.0 ) {
      scale = 1.0;
    }
    let k = 0;
    while (k < doc.itemCount()) {
      const item = doc.items[k];
      const parser = SVGPathParser.fromCommands(item.commands);
      const rings = parser.flattenRings(
        steps,
        m.a,
        m.b,
        m.c,
        m.d,
        (m.e + x),
        (m.f + y)
      );
      if ( rings.length > 0 ) {
        if ( item.hasFill() ) {
          const cf = new EVGDrawCmd();
          cf.kind = 6;
          cf.x = x;
          cf.y = y;
          cf.w = w;
          cf.h = h;
          cf.evenOdd = item.fillRule == "evenodd";
          cf.r = item.fillColor.red();
          cf.g = item.fillColor.green();
          cf.b = item.fillColor.blue();
          cf.a = item.fillColor.alpha();
          this.copyRings(cf, rings);
          this.addCmd(cf);
        }
        if ( item.hasStroke() ) {
          const cs = new EVGDrawCmd();
          cs.kind = 7;
          cs.x = x;
          cs.y = y;
          cs.w = w;
          cs.h = h;
          cs.thickness = item.strokeWidth * scale;
          cs.r = item.strokeColor.red();
          cs.g = item.strokeColor.green();
          cs.b = item.strokeColor.blue();
          cs.a = item.strokeColor.alpha();
          this.copyRings(cs, rings);
          this.addCmd(cs);
        }
      }
      k = k + 1;
    };
  };
  flattenSteps (w, h) {
    let span = w * this.drawScale;
    const tall = h * this.drawScale;
    if ( tall > span ) {
      span = tall;
    }
    let steps = Math.floor( span / 6.0);
    if ( steps < 4 ) {
      steps = 4;
    }
    if ( steps > 48 ) {
      steps = 48;
    }
    return steps;
  };
  walkPath (el, x, y, w, h) {
    if ( el.svgSource.length > 0 ) {
      this.walkSvgDocument(el, x, y, w, h);
      return;
    }
    const pathData = el.svgPath;
    if ( pathData.length == 0 ) {
      return;
    }
    const steps = this.flattenSteps(w, h);
    let rings = el.ringsCache;
    const sameBox = ((el.ringsX == x && el.ringsY == y) && el.ringsW == w) && el.ringsH == h;
    const sameGeom = ((el.ringsSteps == steps && el.ringsPath == pathData) && el.ringsViewBox == el.viewBox) && el.ringsFit == el.preserveAspectRatio;
    const fresh = (el.ringsHave && sameBox) && sameGeom;
    if ( fresh ) {
    } else {
      const parser = new SVGPathParser();
      parser.parse(pathData);
      const b = parser.getBounds();
      const vb = VectorViewBox.effectiveViewBox(
        el.viewBox,
        b.minX,
        b.minY,
        b.width,
        b.height
      );
      const m = VectorViewBox.resolve(vb, w, h, el.preserveAspectRatio);
      rings = parser.flattenRings(
        steps,
        m.a,
        m.b,
        m.c,
        m.d,
        (m.e + x),
        (m.f + y)
      );
      el.ringsCache = rings;
      el.ringsHave = true;
      el.ringsPath = pathData;
      el.ringsX = x;
      el.ringsY = y;
      el.ringsW = w;
      el.ringsH = h;
      el.ringsSteps = steps;
      el.ringsScale = m.a;
      el.ringsViewBox = el.viewBox;
      el.ringsFit = el.preserveAspectRatio;
    }
    if ( rings.length == 0 ) {
      return;
    }
    let fillColor = el.fillColor;
    if ( fillColor.isSet == false ) {
      fillColor = el.backgroundColor;
    }
    if ( fillColor.isSet ) {
      const cf = new EVGDrawCmd();
      cf.kind = 6;
      cf.x = x;
      cf.y = y;
      cf.w = w;
      cf.h = h;
      cf.evenOdd = el.fillRule == "evenodd";
      cf.r = fillColor.red();
      cf.g = fillColor.green();
      cf.b = fillColor.blue();
      cf.a = fillColor.alpha();
      if ( EVGDisplayList.hasLinearGradient(el) ) {
        EVGDisplayList.applyGradient(cf, el);
      }
      this.copyRings(cf, rings);
      this.addCmd(cf);
    }
    if ( el.arrowPath.length > 0 ) {
      const hc = el.arrowFillColor();
      if ( hc.isSet ) {
        const hp = new SVGPathParser();
        hp.parse(el.arrowPath);
        const hb = hp.getBounds();
        const hvb = VectorViewBox.effectiveViewBox(
          el.viewBox,
          hb.minX,
          hb.minY,
          hb.width,
          hb.height
        );
        const hm = VectorViewBox.resolve(hvb, w, h, el.preserveAspectRatio);
        const hrings = hp.flattenRings(
          steps,
          hm.a,
          hm.b,
          hm.c,
          hm.d,
          (hm.e + x),
          (hm.f + y)
        );
        if ( hrings.length > 0 ) {
          const ch = new EVGDrawCmd();
          ch.kind = 6;
          ch.x = x;
          ch.y = y;
          ch.w = w;
          ch.h = h;
          ch.r = hc.red();
          ch.g = hc.green();
          ch.b = hc.blue();
          ch.a = hc.alpha();
          this.copyRings(ch, hrings);
          this.addCmd(ch);
        }
      }
    }
    if ( el.strokeColor.isSet ) {
      if ( el.strokeWidth > 0.0 ) {
        const sc = el.strokeColor;
        const cs = new EVGDrawCmd();
        cs.kind = 7;
        cs.x = x;
        cs.y = y;
        cs.w = w;
        cs.h = h;
        let scale = el.ringsScale;
        if ( scale < 0.0 ) {
          scale = 0.0 - scale;
        }
        if ( scale <= 0.0 ) {
          scale = 1.0;
        }
        cs.thickness = el.strokeWidth * scale;
        cs.strokeCap = EVGDisplayList.capCode(el.strokeLineCap);
        cs.strokeJoin = EVGDisplayList.joinCode(el.strokeLineJoin);
        cs.strokeDash = el.strokeDashArray;
        cs.strokeDashOffset = el.strokeDashOffset;
        cs.r = sc.red();
        cs.g = sc.green();
        cs.b = sc.blue();
        cs.a = sc.alpha();
        this.copyRings(cs, rings);
        this.addCmd(cs);
      }
    }
  };
  copyRings (c, rings) {
    let i = 0;
    while (i < rings.length) {
      const ring = rings[i];
      let k = 0;
      while (k < ring.pts.length) {
        c.pts.push(ring.pts[k]);
        k = k + 1;
      };
      if ( c.kind == 7 && ring.closed ) {
        if ( ring.pointCount() >= 2 ) {
          c.pts.push(ring.pts[0]);
          c.pts.push(ring.pts[1]);
        }
      }
      c.ringEnds.push(c.pts.length);
      i = i + 1;
    };
  };
  setFragments (on) {
    this.fragments = on;
  };
  takeFragments (from) {
    this.fragEls = from.fragEls;
    this.fragLists = from.fragLists;
    this.fragStamps = from.fragStamps;
    this.fragOffX = from.fragOffX;
    this.fragOffY = from.fragOffY;
  };
  forgetFragments () {
    this.fragEls.length = 0;
    this.fragLists.length = 0;
    this.fragStamps.length = 0;
    this.fragOffX.length = 0;
    this.fragOffY.length = 0;
  };
  fragmentOf (el) {
    let i = 0;
    while (i < this.fragEls.length) {
      if ( this.fragEls[i] == el ) {
        return i;
      }
      i = i + 1;
    };
    return 0 - 1;
  };
  emitFragment (el) {
    const fi = this.fragmentOf(el);
    if ( fi < 0 ) {
      return false;
    }
    if ( this.fragStamps[fi] != el.paintStamp ) {
      return false;
    }
    const kept = this.fragLists[fi];
    if ( kept.length == 0 ) {
      return false;
    }
    const first = kept[0];
    const dx = el.calculatedX - (first.x + this.fragOffX[fi]);
    const dy = el.calculatedY - (first.y + this.fragOffY[fi]);
    // Loop start
    for ( const c of kept) {
      if ( dx != 0.0 || dy != 0.0 ) {
        c.x = c.x + dx;
        c.y = c.y + dy;
        if ( c.hasRotOrigin ) {
          c.rotOriginX = c.rotOriginX + dx;
          c.rotOriginY = c.rotOriginY + dy;
        }
        const n = c.pts.length;
        let p = 0;
        while (p < n) {
          c.pts[p] = c.pts[p] + dx;
          c.pts[p + 1] = c.pts[(p + 1)] + dy;
          p = p + 2;
        };
      }
      this.addCmd(c);
    }
    return true;
  };
  recordFragment (el, start) {
    let kept = [];
    let i = start;
    const n = this.cmds.length;
    while (i < n) {
      const c = this.cmds[i];
      if ( c.layer > 0 ) {
        return;
      }
      kept.push(c);
      i = i + 1;
    };
    if ( kept.length == 0 ) {
      return;
    }
    const first = kept[0];
    const offX = el.calculatedX - first.x;
    const offY = el.calculatedY - first.y;
    const fi = this.fragmentOf(el);
    if ( fi < 0 ) {
      this.fragEls.push(el);
      this.fragLists.push(kept);
      this.fragStamps.push(el.paintStamp);
      this.fragOffX.push(offX);
      this.fragOffY.push(offY);
      return;
    }
    this.fragLists[fi] = kept;
    this.fragStamps[fi] = el.paintStamp;
    this.fragOffX[fi] = offX;
    this.fragOffY[fi] = offY;
  };
  setScrollbars (on) {
    this.scrollbars = on;
  };
  setScrollbarState (state) {
    this.barState = state;
  };
  setScrollbarHover (el) {
    this.barHover = el;
  };
  setScrollbarNear (el) {
    this.barNear = el;
  };
  addScrollbar (el, x, y, w, h) {
    const maxY = el.maxScrollTop();
    if ( maxY <= 0.0 ) {
      return;
    }
    let state = this.barState;
    if ( typeof(this.barNear) != "undefined" ) {
      if ( this.barNear == el ) {
        if ( state < 1 ) {
          state = 1;
        }
      }
    }
    if ( typeof(this.barHover) != "undefined" ) {
      if ( this.barHover == el ) {
        state = 2;
      }
    }
    if ( el.scrollbarWidth == "none" ) {
      return;
    }
    const width = EVGDisplayList.barWidth(state, (el.scrollbarWidth == "thin"));
    const margin = 3.0;
    const trackX = (x + w) - (width + margin);
    const trackY = y + margin;
    const trackH = h - margin * 2.0;
    if ( trackH <= width * 2.0 ) {
      return;
    }
    let thumbH = (trackH * h) / (h + maxY);
    if ( thumbH < 24.0 ) {
      thumbH = 24.0;
    }
    if ( thumbH > trackH ) {
      thumbH = trackH;
    }
    const travel = trackH - thumbH;
    const scale = travel / maxY;
    const thumbY = trackY + scale * el.scrollTop;
    const lum = (((this.backdropR * 299 + (this.backdropG * 587 + this.backdropB * 114)) / 1000) | 0);
    let base = EVGColor.rgba(30, 30, 30, 1.0);
    if ( lum < 128 ) {
      base = EVGColor.rgba(235, 235, 235, 1.0);
    }
    if ( el.scrollbarThumb.isSet ) {
      base = el.scrollbarThumb;
    }
    const cr = base.red();
    const cg = base.green();
    const cb = base.blue();
    const own = base.alpha();
    let thumbA = own * 0.5;
    if ( state == 1 ) {
      thumbA = own * 0.72;
    }
    if ( state >= 2 ) {
      thumbA = own * 0.92;
    }
    const lit = base.lighten(0.38);
    const pillLum = (((cr * 299 + (cg * 587 + cb * 114)) / 1000) | 0);
    let tr = 20;
    let tg = 20;
    let tb = 24;
    if ( pillLum < 140 ) {
      tr = 250;
      tg = 250;
      tb = 250;
    }
    if ( state > 0 ) {
      const track = new EVGDrawCmd();
      track.kind = 0;
      track.x = trackX;
      track.y = trackY;
      track.w = width;
      track.h = trackH;
      track.radius = width / 2.0;
      if ( el.scrollbarTrack.isSet ) {
        track.r = el.scrollbarTrack.red();
        track.g = el.scrollbarTrack.green();
        track.b = el.scrollbarTrack.blue();
        track.a = el.scrollbarTrack.alpha();
      } else {
        track.r = cr;
        track.g = cg;
        track.b = cb;
        track.a = 0.12;
      }
      this.addCmd(track);
    }
    const cp = new EVGDrawCmd();
    cp.kind = 4;
    cp.x = trackX - 64.0;
    cp.y = trackY;
    cp.w = width + 64.0;
    cp.h = trackH;
    cp.layer = this.layerEls.length + 1;
    this.layerEls.push(el);
    this.layerTop.push(el.scrollTop);
    this.layerLeft.push(el.scrollLeft);
    this.layerShiftX.push(0.0);
    this.layerShiftY.push(0.0);
    this.layerClip.push(this.cmds.length);
    this.layerFirst.push(this.cmds.length + 1);
    this.layerLast.push(this.cmds.length + 2);
    this.layerCullL.push(0.0);
    this.layerCullT.push(0.0);
    this.layerCullR.push(0.0);
    this.layerCullB.push(0.0);
    this.layerKind.push(1);
    this.layerScale.push(scale);
    const pct = Math.floor( (el.scrollTop * 100.0) / maxY + 0.5);
    this.layerPct.push(pct);
    this.layerLabel.push(0 - 1);
    this.addCmd(cp);
    const thumb = new EVGDrawCmd();
    thumb.kind = 0;
    thumb.x = trackX;
    thumb.y = thumbY;
    thumb.w = width;
    thumb.h = thumbH;
    thumb.radius = width / 2.0;
    thumb.hasGrad = true;
    thumb.gradDir = 1;
    thumb.r = lit.red();
    thumb.g = lit.green();
    thumb.b = lit.blue();
    thumb.a = thumbA;
    thumb.r2 = cr;
    thumb.g2 = cg;
    thumb.b2 = cb;
    thumb.a2 = thumbA;
    this.addCmd(thumb);
    if ( state >= 1 && el.scrollbarLabel != "none" ) {
      const pillW = 42.0;
      const pillH = 18.0;
      const pillX = (trackX - pillW) - 6.0;
      const pillY = (thumbY + thumbH / 2.0) - pillH / 2.0;
      const pill = new EVGDrawCmd();
      pill.kind = 0;
      pill.x = pillX;
      pill.y = pillY;
      pill.w = pillW;
      pill.h = pillH;
      pill.radius = pillH / 2.0;
      pill.hasGrad = true;
      pill.gradDir = 0;
      pill.r = lit.red();
      pill.g = lit.green();
      pill.b = lit.blue();
      pill.a = own * 0.94;
      pill.r2 = cr;
      pill.g2 = cg;
      pill.b2 = cb;
      pill.a2 = own * 0.94;
      this.addCmd(pill);
      const label = new EVGDrawCmd();
      label.kind = 3;
      label.x = pillX + 7.0;
      label.y = pillY + 2.0;
      label.w = pillW - 10.0;
      label.h = pillH - 4.0;
      label.text = EVGDisplayList.pctLabel(pct);
      label.fontFamily = "sans-serif";
      label.fontSize = 11.0;
      label.fontWeight = "600";
      label.r = tr;
      label.g = tg;
      label.b = tb;
      label.a = 1.0;
      this.layerLabel[this.layerEls.length - 1] = this.cmds.length;
      this.addCmd(label);
      this.layerLast[this.layerEls.length - 1] = this.cmds.length;
    }
    const pp = new EVGDrawCmd();
    pp.kind = 5;
    this.addCmd(pp);
  };
  trackAt (px, py) {
    let i = 0;
    while (i < this.layerEls.length) {
      if ( this.layerKind[i] == 1 ) {
        const cp = this.cmds[this.layerClip[i]];
        const t = this.cmds[this.layerFirst[i]];
        if ( px >= t.x - 4.0 && px <= (t.x + t.w) + 3.0 ) {
          if ( py >= cp.y && py <= cp.y + cp.h ) {
            return i;
          }
        }
      }
      i = i + 1;
    };
    return 0 - 1;
  };
  trackScrollFor (i, py) {
    const cp = this.cmds[this.layerClip[i]];
    const t = this.cmds[this.layerFirst[i]];
    const scale = this.layerScale[i];
    if ( scale <= 0.0 ) {
      return 0.0;
    }
    return ((py - cp.y) - t.h / 2.0) / scale;
  };
  nearBarAt (px, py) {
    let i = 0;
    while (i < this.layerEls.length) {
      if ( this.layerKind[i] == 0 ) {
        const cp = this.cmds[this.layerClip[i]];
        if ( px >= (cp.x + cp.w) - EVGDisplayList.barNearPx() && px <= cp.x + cp.w ) {
          if ( py >= cp.y && py <= cp.y + cp.h ) {
            return i;
          }
        }
      }
      i = i + 1;
    };
    return 0 - 1;
  };
  thumbAt (px, py) {
    let i = 0;
    while (i < this.layerEls.length) {
      if ( this.layerKind[i] == 1 ) {
        const t = this.cmds[this.layerFirst[i]];
        if ( px >= t.x - 8.0 && px <= (t.x + t.w) + 3.0 ) {
          if ( py >= t.y && py <= t.y + t.h ) {
            return i;
          }
        }
      }
      i = i + 1;
    };
    return 0 - 1;
  };
  layerElement (i) {
    return this.layerEls[i];
  };
  thumbScale (i) {
    return this.layerScale[i];
  };
  thumbsJson () {
    let out = "[";
    let n = 0;
    let i = 0;
    while (i < this.layerEls.length) {
      if ( this.layerKind[i] == 1 ) {
        const t = this.cmds[this.layerFirst[i]];
        if ( n > 0 ) {
          out = out + ",";
        }
        out = (((out + "{\"x\":") + EVGDisplayList.num(t.x)) + ",\"y\":") + EVGDisplayList.num(t.y);
        out = (((((out + ",\"w\":") + EVGDisplayList.num(t.w)) + ",\"h\":") + EVGDisplayList.num(t.h)) + ",\"a\":") + EVGDisplayList.num(t.a);
        out = ((((((out + ",\"c\":[") + (t.r2.toString())) + ",") + (t.g2.toString())) + ",") + (t.b2.toString())) + "]}";
        n = n + 1;
      }
      i = i + 1;
    };
    return out + "]";
  };
  layerCount () {
    return this.layerEls.length;
  };
  layerFor (el) {
    let i = 0;
    while (i < this.layerEls.length) {
      if ( this.layerEls[i] == el ) {
        return i;
      }
      i = i + 1;
    };
    return 0 - 1;
  };
  shiftRange (first, last, dx, dy) {
    let i = first;
    while (i < last) {
      const c = this.cmds[i];
      c.x = c.x + dx;
      c.y = c.y + dy;
      if ( c.hasRotOrigin ) {
        c.rotOriginX = c.rotOriginX + dx;
        c.rotOriginY = c.rotOriginY + dy;
      }
      const n = c.pts.length;
      if ( n > 0 ) {
        let p = 0;
        while (p < n) {
          c.pts[p] = c.pts[p] + dx;
          c.pts[p + 1] = c.pts[(p + 1)] + dy;
          p = p + 2;
        };
      }
      i = i + 1;
    };
  };
  refreshLayers () {
    let i = 0;
    while (i < this.layerEls.length) {
      const el = this.layerEls[i];
      if ( this.layerKind[i] == 1 ) {
        const ty = (el.scrollTop - this.layerTop[i]) * this.layerScale[i];
        const dsy = ty - this.layerShiftY[i];
        if ( dsy != 0.0 ) {
          this.shiftRange(this.layerFirst[i], this.layerLast[i], 0.0, dsy);
          this.layerShiftY[i] = ty;
        }
        if ( this.layerLabel[i] >= 0 ) {
          const maxY = el.maxScrollTop();
          if ( maxY > 0.0 ) {
            const pct = Math.floor( (el.scrollTop * 100.0) / maxY + 0.5);
            if ( pct != this.layerPct[i] ) {
              this.layerPct[i] = pct;
              const label = this.cmds[this.layerLabel[i]];
              label.text = EVGDisplayList.pctLabel(pct);
              this.frameSeq = this.frameSeq + 1;
            }
          }
        }
        i = i + 1;
        continue;
      }
      const dy = this.layerTop[i] - el.scrollTop;
      const dx = this.layerLeft[i] - el.scrollLeft;
      const cp = this.cmds[this.layerClip[i]];
      if ( cp.y < this.layerCullT[i] + dy ) {
        return false;
      }
      if ( cp.y + cp.h > this.layerCullB[i] + dy ) {
        return false;
      }
      if ( cp.x < this.layerCullL[i] + dx ) {
        return false;
      }
      if ( cp.x + cp.w > this.layerCullR[i] + dx ) {
        return false;
      }
      const sx = dx - this.layerShiftX[i];
      const sy = dy - this.layerShiftY[i];
      if ( sx != 0.0 || sy != 0.0 ) {
        this.shiftRange(this.layerFirst[i], this.layerLast[i], sx, sy);
        this.layerShiftX[i] = dx;
        this.layerShiftY[i] = dy;
        let j = i + 1;
        while (j < this.layerEls.length) {
          if ( this.layerClip[j] > this.layerClip[i] ) {
            if ( this.layerClip[j] < this.layerLast[i] ) {
              this.layerCullL[j] = this.layerCullL[j] + sx;
              this.layerCullR[j] = this.layerCullR[j] + sx;
              this.layerCullT[j] = this.layerCullT[j] + sy;
              this.layerCullB[j] = this.layerCullB[j] + sy;
            }
          }
          j = j + 1;
        };
      }
      i = i + 1;
    };
    this.refreshRing();
    return true;
  };
  setCulling (on) {
    this.culling = on;
  };
  setOverscan (before, after) {
    this.overscanBefore = before;
    this.overscanAfter = after;
  };
  cullable (el) {
    if ( this.cullOn == false ) {
      return false;
    }
    if ( el.paintUnbounded ) {
      return false;
    }
    if ( el.paintBottom < this.cullTop ) {
      return true;
    }
    if ( el.paintTop > this.cullBottom ) {
      return true;
    }
    if ( el.paintRight < this.cullLeft ) {
      return true;
    }
    if ( el.paintLeft > this.cullRight ) {
      return true;
    }
    return false;
  };
  build (root) {
    this.cmds.length = 0;
    this.deferredOverlays.length = 0;
    this.layerEls.length = 0;
    this.layerTop.length = 0;
    this.layerLeft.length = 0;
    this.layerShiftX.length = 0;
    this.layerShiftY.length = 0;
    this.layerCullL.length = 0;
    this.layerCullT.length = 0;
    this.layerCullR.length = 0;
    this.layerCullB.length = 0;
    this.layerClip.length = 0;
    this.layerFirst.length = 0;
    this.layerLast.length = 0;
    this.layerStack.length = 0;
    this.layerKind.length = 0;
    this.layerScale.length = 0;
    this.layerPct.length = 0;
    this.layerLabel.length = 0;
    this.fragHits = 0;
    this.fragMisses = 0;
    this.cullOn = false;
    if ( this.hasRegion ) {
      this.cullOn = true;
      this.cullLeft = this.regionLeft;
      this.cullTop = this.regionTop;
      this.cullRight = this.regionRight;
      this.cullBottom = this.regionBottom;
    }
    this.drawScale = 1.0;
    this.effectKind = "";
    let noX = [];
    let noY = [];
    let noT = [];
    this.effectXs = noX;
    this.effectYs = noY;
    this.effectAges = noT;
    this.fxIds.length = 0;
    this.fxKinds.length = 0;
    this.fxTriggers.length = 0;
    this.fxX.length = 0;
    this.fxY.length = 0;
    this.fxW.length = 0;
    this.fxH.length = 0;
    this.fxRadius.length = 0;
    this.fxParamStart.length = 0;
    this.fxParamCount.length = 0;
    this.fxParamNames.length = 0;
    this.fxParamValues.length = 0;
    this.readEffect(root);
    this.collectEffects(root);
    this.walk(root);
    let i = 0;
    while (i < this.deferredOverlays.length) {
      this.cullOn = false;
      this.walk(this.deferredOverlays[i]);
      i = i + 1;
    };
    this.cullOn = false;
    this.ringCmd = 0 - 1;
    let noRing;
    this.ringEl = noRing;
    this.paintFocusRing(root);
  };
  fadeFrom (start, factor) {
    if ( factor >= 1.0 ) {
      return;
    }
    let i = start;
    while (i < this.cmds.length) {
      const c = this.cmds[i];
      c.a = c.a * factor;
      i = i + 1;
    };
  };
  transformFrom (start, el) {
    const deg = el.rotate;
    const sc = el.scale;
    const tx = el.translateX;
    const ty = el.translateY;
    const flips = el.flipY;
    const turns = deg != 0.0;
    const scales = Math.abs(sc - 1.0) > 0.000001 || flips;
    const shifts = tx != 0.0 || ty != 0.0;
    if ( (turns == false && scales == false) && shifts == false ) {
      return;
    }
    let scy = sc;
    if ( flips ) {
      scy = 0.0 - sc;
    }
    const ox = el.calculatedX + EVGElement.resolveOrigin(el.transformOriginX, el.calculatedWidth);
    const oy = el.calculatedY + EVGElement.resolveOrigin(el.transformOriginY, el.calculatedHeight);
    const rad = (deg * 3.14159265358979) / 180.0;
    const cs = Math.cos(rad);
    const sn = Math.sin(rad);
    let i = start;
    const n = this.cmds.length;
    while (i < n) {
      const c = this.cmds[i];
      if ( c.pts.length > 0 ) {
        this.mapPoints(c, ox, oy, sc, scy, cs, sn, tx, ty);
      } else {
        if ( scales ) {
          c.x = ox + (c.x - ox) * sc;
          c.y = oy + (c.y - oy) * scy;
          c.w = c.w * sc;
          c.h = c.h * scy;
          c.radius = Math.abs(c.radius) * Math.abs(sc);
          c.thickness = Math.abs(c.thickness) * Math.abs(sc);
          c.fontSize = Math.abs(c.fontSize) * Math.abs(sc);
          if ( c.h < 0.0 ) {
            c.y = c.y + c.h;
            c.h = 0.0 - c.h;
            if ( c.perCorner ) {
              const swTL = c.radius;
              c.radius = c.radiusBL;
              c.radiusBL = swTL;
              const swTR = c.radiusTR;
              c.radiusTR = c.radiusBR;
              c.radiusBR = swTR;
            }
            c.flipV = c.flipV == false;
          }
          if ( c.w < 0.0 ) {
            c.x = c.x + c.w;
            c.w = 0.0 - c.w;
            if ( c.perCorner ) {
              const swTL2 = c.radius;
              c.radius = c.radiusTR;
              c.radiusTR = swTL2;
              const swBL2 = c.radiusBL;
              c.radiusBL = c.radiusBR;
              c.radiusBR = swBL2;
            }
            c.flipH = c.flipH == false;
          }
        }
        if ( turns ) {
          c.rotate = c.rotate + deg;
          if ( c.hasRotOrigin == false ) {
            c.rotOriginX = ox;
            c.rotOriginY = oy;
            c.hasRotOrigin = true;
          } else {
            const rx = c.rotOriginX - ox;
            const ry = c.rotOriginY - oy;
            c.rotOriginX = ox + (rx * cs - ry * sn);
            c.rotOriginY = oy + (rx * sn + ry * cs);
          }
        }
        if ( shifts ) {
          c.x = c.x + tx;
          c.y = c.y + ty;
          if ( c.hasRotOrigin ) {
            c.rotOriginX = c.rotOriginX + tx;
            c.rotOriginY = c.rotOriginY + ty;
          }
        }
      }
      i = i + 1;
    };
  };
  mapPoints (c, ox, oy, sc, scy, cs, sn, tx, ty) {
    let moved = [];
    let i = 0;
    const n = c.pts.length;
    while (i + 1 < n) {
      const px = c.pts[i] - ox;
      const py = c.pts[(i + 1)] - oy;
      const sx = px * sc;
      const sy = py * scy;
      moved.push((ox + (sx * cs - sy * sn)) + tx);
      moved.push((oy + (sx * sn + sy * cs)) + ty);
      i = i + 2;
    };
    c.pts.length = 0;
    let j = 0;
    while (j < moved.length) {
      c.pts.push(moved[j]);
      j = j + 1;
    };
  };
  walk (el) {
    if ( el.isHidden() ) {
      return;
    }
    if ( this.cullable(el) ) {
      return;
    }
    el.settleShift();
    const emitStart = this.cmds.length;
    const keeping = (this.fragments && el.keepLayout) && this.attribute == false;
    if ( keeping ) {
      if ( this.emitFragment(el) ) {
        this.fragHits = this.fragHits + 1;
        return;
      }
      this.fragMisses = this.fragMisses + 1;
    }
    const prevNode = this.curNode;
    if ( this.attribute ) {
      this.curNode = el.inspectSlot;
    }
    const hadCull = this.cullOn;
    const hadCullL = this.cullLeft;
    const hadCullT = this.cullTop;
    const hadCullR = this.cullRight;
    const hadCullB = this.cullBottom;
    if ( keeping ) {
      this.cullOn = false;
    }
    const hadScale = this.drawScale;
    const hadTurned = this.turnedDepth;
    if ( el.hasTransform() ) {
      let sc = el.scale;
      if ( sc < 0.0 ) {
        sc = 0.0 - sc;
      }
      if ( sc > 0.0 ) {
        this.drawScale = this.drawScale * sc;
      }
      if ( this.cullOn ) {
        this.cullThroughTransform(el);
      }
      if ( el.rotate != 0.0 ) {
        this.turnedDepth = this.turnedDepth + 1;
      }
    }
    this.walkOpaque(el);
    this.turnedDepth = hadTurned;
    this.drawScale = hadScale;
    this.cullOn = hadCull;
    this.cullLeft = hadCullL;
    this.cullTop = hadCullT;
    this.cullRight = hadCullR;
    this.cullBottom = hadCullB;
    this.curNode = prevNode;
    this.fadeFrom(emitStart, el.opacity);
    this.transformFrom(emitStart, el);
    if ( keeping ) {
      this.recordFragment(el, emitStart);
    }
  };
  cullThroughTransform (el) {
    if ( el.rotate != 0.0 ) {
      this.cullOn = false;
      return;
    }
    const sc = el.scale;
    if ( Math.abs(sc) < 0.000001 ) {
      this.cullOn = false;
      return;
    }
    const ox = el.calculatedX + EVGElement.resolveOrigin(el.transformOriginX, el.calculatedWidth);
    const oy = el.calculatedY + EVGElement.resolveOrigin(el.transformOriginY, el.calculatedHeight);
    let l = ox + ((this.cullLeft - el.translateX) - ox) / sc;
    let r = ox + ((this.cullRight - el.translateX) - ox) / sc;
    let t = oy + ((this.cullTop - el.translateY) - oy) / sc;
    let b = oy + ((this.cullBottom - el.translateY) - oy) / sc;
    if ( l > r ) {
      const sw = l;
      l = r;
      r = sw;
    }
    if ( t > b ) {
      const sw2 = t;
      t = b;
      b = sw2;
    }
    this.cullLeft = l;
    this.cullTop = t;
    this.cullRight = r;
    this.cullBottom = b;
  };
  walkOpaque (el) {
    const x = el.calculatedX;
    const y = el.calculatedY;
    const w = el.calculatedWidth;
    const h = el.calculatedHeight;
    let radius = el.box.borderRadiusPx;
    const bx = el.box;
    const uTL = bx.borderRadiusTL;
    const uTR = bx.borderRadiusTR;
    const uBR = bx.borderRadiusBR;
    const uBL = bx.borderRadiusBL;
    const uAll = bx.borderRadius;
    let rTL = EVGDisplayList.radiusPx(
      (uTL.isSet && uTL.isPercent()),
      uTL.value,
      bx.borderRadiusTLPx,
      w
    );
    let rTR = EVGDisplayList.radiusPx(
      (uTR.isSet && uTR.isPercent()),
      uTR.value,
      bx.borderRadiusTRPx,
      w
    );
    let rBR = EVGDisplayList.radiusPx(
      (uBR.isSet && uBR.isPercent()),
      uBR.value,
      bx.borderRadiusBRPx,
      w
    );
    let rBL = EVGDisplayList.radiusPx(
      (uBL.isSet && uBL.isPercent()),
      uBL.value,
      bx.borderRadiusBLPx,
      w
    );
    if ( bx.hasPerCornerRadius() == false ) {
      const uni = EVGDisplayList.radiusPx(
        (uAll.isSet && uAll.isPercent()),
        uAll.value,
        bx.borderRadiusPx,
        w
      );
      rTL = uni;
      rTR = uni;
      rBR = uni;
      rBL = uni;
    }
    let f = 1.0;
    f = EVGDisplayList.sideFactor(f, w, (rTL + rTR));
    f = EVGDisplayList.sideFactor(f, h, (rTR + rBR));
    f = EVGDisplayList.sideFactor(f, w, (rBL + rBR));
    f = EVGDisplayList.sideFactor(f, h, (rTL + rBL));
    if ( f < 1.0 ) {
      rTL = rTL * f;
      rTR = rTR * f;
      rBR = rBR * f;
      rBL = rBL * f;
    }
    radius = rTL;
    const perCorner = el.box.hasPerCornerRadius();
    let painted = false;
    let bgSet = false;
    let bg = new EVGColor();
    if ( typeof(el.backgroundColor) != "undefined" ) {
      const b0 = el.backgroundColor;
      if ( b0.isSet ) {
        bg = b0;
        bgSet = true;
      }
    }
    const gradOk = EVGDisplayList.hasLinearGradient(el);
    const paintsItsBox = el.drawsPath() == false;
    if ( (bgSet || gradOk) && paintsItsBox ) {
      const c = new EVGDrawCmd();
      c.kind = 0;
      c.x = x;
      c.y = y;
      c.w = w;
      c.h = h;
      c.radius = radius;
      c.perCorner = perCorner;
      if ( perCorner ) {
        c.radius = rTL;
        c.radiusTR = rTR;
        c.radiusBR = rBR;
        c.radiusBL = rBL;
      }
      if ( bgSet ) {
        c.r = bg.red();
        c.g = bg.green();
        c.b = bg.blue();
        c.a = bg.alpha();
      }
      if ( gradOk ) {
        EVGDisplayList.applyGradient(c, el);
      }
      c.backdropBlur = el.backdropBlur;
      if ( el.surfaceEffect.length > 0 ) {
        c.effectId = el.effectRuntimeId;
      }
      EVGDisplayList.applyShadow(c, el);
      this.addCmd(c);
      painted = true;
    }
    if ( painted == false ) {
      const probe = new EVGDrawCmd();
      EVGDisplayList.applyShadow(probe, el);
      if ( (probe.hasShadow && el.backdropBlur <= 0.0) && paintsItsBox ) {
        const cs = new EVGDrawCmd();
        cs.kind = 0;
        cs.x = x;
        cs.y = y;
        cs.w = w;
        cs.h = h;
        cs.radius = radius;
        cs.perCorner = perCorner;
        if ( perCorner ) {
          cs.radius = rTL;
          cs.radiusTR = rTR;
          cs.radiusBR = rBR;
          cs.radiusBL = rBL;
        }
        cs.a = 0.0;
        EVGDisplayList.applyShadow(cs, el);
        this.addCmd(cs);
      }
      if ( el.backdropBlur > 0.0 ) {
        const cb = new EVGDrawCmd();
        cb.kind = 0;
        cb.x = x;
        cb.y = y;
        cb.w = w;
        cb.h = h;
        cb.radius = radius;
        cb.perCorner = perCorner;
        if ( perCorner ) {
          cb.radius = rTL;
          cb.radiusTR = rTR;
          cb.radiusBR = rBR;
          cb.radiusBL = rBL;
        }
        cb.a = 0.0;
        cb.backdropBlur = el.backdropBlur;
        EVGDisplayList.applyShadow(cb, el);
        this.addCmd(cb);
      }
      if ( el.surfaceEffect.length > 0 ) {
        const cf = new EVGDrawCmd();
        cf.kind = 0;
        cf.x = x;
        cf.y = y;
        cf.w = w;
        cf.h = h;
        cf.radius = radius;
        cf.perCorner = perCorner;
        if ( perCorner ) {
          cf.radius = rTL;
          cf.radiusTR = rTR;
          cf.radiusBR = rBR;
          cf.radiusBL = rBL;
        }
        cf.a = 0.0;
        cf.effectId = el.effectRuntimeId;
        this.addCmd(cf);
      }
    }
    const bw = el.effectiveBorderWidthPx();
    if ( bw > 0.0 ) {
      const bc = el.effectiveBorderColor();
      const c2 = new EVGDrawCmd();
      c2.kind = 1;
      c2.x = x;
      c2.y = y;
      c2.w = w;
      c2.h = h;
      c2.radius = radius;
      c2.perCorner = perCorner;
      if ( perCorner ) {
        c2.radius = rTL;
        c2.radiusTR = rTR;
        c2.radiusBR = rBR;
        c2.radiusBL = rBL;
      }
      c2.thickness = bw;
      c2.r = bc.red();
      c2.g = bc.green();
      c2.b = bc.blue();
      c2.a = bc.alpha();
      this.addCmd(c2);
    }
    if ( el.drawsPath() ) {
      this.walkPath(el, x, y, w, h);
    }
    if ( el.src.length > 0 ) {
      const c3 = new EVGDrawCmd();
      c3.kind = 2;
      c3.x = x;
      c3.y = y;
      c3.w = w;
      c3.h = h;
      c3.radius = radius;
      c3.perCorner = perCorner;
      if ( perCorner ) {
        c3.radius = rTL;
        c3.radiusTR = rTR;
        c3.radiusBR = rBR;
        c3.radiusBL = rBL;
      }
      c3.src = el.src;
      if ( el.imageViewBoxSet ) {
        c3.hasCrop = true;
        c3.cropX = el.imageViewBoxX;
        c3.cropY = el.imageViewBoxY;
        c3.cropW = el.imageViewBoxW;
        c3.cropH = el.imageViewBoxH;
      }
      this.addCmd(c3);
    }
    if ( el.textContent.length > 0 ) {
      const face = el.effectiveFontFamily();
      let fs = el.inheritedFontSize;
      if ( el.fontSize.isSet ) {
        fs = el.fontSize.pixels;
      }
      if ( fs <= 0.0 ) {
        fs = 14.0;
      }
      let lineBox = el.lineBoxFor(fs, this.textEngine.lineHeightFor(face, fs));
      if ( lineBox <= 0.0 ) {
        lineBox = fs * 1.2;
      }
      const avail = el.box.getInnerWidth(w);
      const broken = this.textEngine.breakLinesSpaced(
        el.textContent,
        face,
        fs,
        el.wrapWidth(avail),
        el.letterSpacing
      );
      let lines = [];
      let bi = 0;
      while (bi < broken.length) {
        const bl = broken[bi];
        lines.push(bl.text);
        bi = bi + 1;
      };
      let tr = 0;
      let tg = 0;
      let tb = 0;
      let ta = 1.0;
      if ( typeof(el.color) != "undefined" ) {
        const tc = el.color;
        tr = tc.red();
        tg = tc.green();
        tb = tc.blue();
        ta = tc.alpha();
      }
      let li = 0;
      let paraShift = 0.0;
      while (li < lines.length) {
        const lnObj = broken[li];
        if ( lnObj.startsParagraph ) {
          paraShift = paraShift + el.paragraphSpacing;
        }
        const c4 = new EVGDrawCmd();
        c4.kind = 3;
        let indent = 0.0;
        if ( el.textAlign == "center" || el.textAlign == "right" ) {
          const m = this.textEngine.measureRunSpaced(
            lines[li],
            face,
            fs,
            el.letterSpacing
          );
          const slack = avail - m.width;
          if ( slack > 0.0 ) {
            if ( el.textAlign == "center" ) {
              indent = slack / 2.0;
            } else {
              indent = slack;
            }
          }
        }
        const bw_2 = el.box.borderWidthPx;
        c4.x = ((x + bw_2) + el.box.paddingLeftPx) + indent;
        c4.y = ((((y + bw_2) + el.box.paddingTopPx) + el.textShiftY) + li * lineBox) + paraShift;
        c4.w = avail;
        c4.h = lineBox;
        c4.text = lines[li];
        c4.fontFamily = face;
        c4.fontSize = fs;
        if ( el.fontWeight.length > 0 ) {
          if ( el.fontWeight != "normal" ) {
            c4.fontWeight = el.fontWeight;
          }
        }
        c4.letterSpacing = el.letterSpacing;
        c4.r = tr;
        c4.g = tg;
        c4.b = tb;
        c4.a = ta;
        this.addCmd(c4);
        li = li + 1;
      };
    }
    const hadBdR = this.backdropR;
    const hadBdG = this.backdropG;
    const hadBdB = this.backdropB;
    const ownBg = el.backgroundColor;
    if ( ownBg.isSet ) {
      if ( ownBg.alpha() > 0.5 ) {
        this.backdropR = ownBg.red();
        this.backdropG = ownBg.green();
        this.backdropB = ownBg.blue();
      }
    }
    let clips = el.clipsContent();
    if ( this.turnedDepth > 0 ) {
      clips = false;
    }
    let scrolls = false;
    if ( (clips && this.culling) && (w > 0.0 && h > 0.0) ) {
      if ( el.maxScrollTop() > 0.0 || el.maxScrollLeft() > 0.0 ) {
        scrolls = true;
      }
    }
    if ( clips ) {
      const cp = new EVGDrawCmd();
      cp.kind = 4;
      cp.x = x;
      cp.y = y;
      cp.w = w;
      cp.h = h;
      if ( scrolls ) {
        cp.layer = this.layerEls.length + 1;
        this.layerStack.push(this.layerEls.length);
        this.layerEls.push(el);
        this.layerTop.push(el.scrollTop);
        this.layerLeft.push(el.scrollLeft);
        this.layerShiftX.push(0.0);
        this.layerShiftY.push(0.0);
        this.layerClip.push(this.cmds.length);
        this.layerFirst.push(this.cmds.length + 1);
        this.layerLast.push(this.cmds.length + 1);
        this.layerCullL.push(0.0);
        this.layerCullT.push(0.0);
        this.layerCullR.push(0.0);
        this.layerCullB.push(0.0);
        this.layerKind.push(0);
        this.layerScale.push(1.0);
        this.layerPct.push(0);
        this.layerLabel.push(0 - 1);
      }
      this.addCmd(cp);
    }
    const hadCull = this.cullOn;
    const hadL = this.cullLeft;
    const hadT = this.cullTop;
    const hadR = this.cullRight;
    const hadB = this.cullBottom;
    if ( clips && this.culling ) {
      let before = this.overscanBefore;
      let after = this.overscanAfter;
      if ( before < 0.0 ) {
        before = h;
      }
      if ( after < 0.0 ) {
        after = h;
      }
      let l = x - w;
      let t = y - before;
      let r = (x + w) + w;
      let b = (y + h) + after;
      if ( this.cullOn ) {
        if ( l < this.cullLeft ) {
          l = this.cullLeft;
        }
        if ( t < this.cullTop ) {
          t = this.cullTop;
        }
        if ( r > this.cullRight ) {
          r = this.cullRight;
        }
        if ( b > this.cullBottom ) {
          b = this.cullBottom;
        }
      }
      this.cullOn = true;
      this.cullLeft = l;
      this.cullTop = t;
      this.cullRight = r;
      this.cullBottom = b;
      if ( scrolls ) {
        const li_1 = this.layerStack[(this.layerStack.length - 1)];
        this.layerCullL[li_1] = l;
        this.layerCullT[li_1] = t;
        this.layerCullR[li_1] = r;
        this.layerCullB[li_1] = b;
      }
    }
    let i = 0;
    while (i < el.getChildCount()) {
      const kid = el.getChild(i);
      if ( kid.isSurface() ) {
        this.deferredOverlays.push(kid);
      } else {
        this.walk(kid);
      }
      i = i + 1;
    };
    if ( this.paintIds.length > 0 ) {
      if ( el.id.length > 0 ) {
        this.emitPainted(el.id);
      }
    }
    this.cullOn = hadCull;
    this.cullLeft = hadL;
    this.cullTop = hadT;
    this.cullRight = hadR;
    this.cullBottom = hadB;
    if ( clips ) {
      if ( scrolls ) {
        const done = this.layerStack[(this.layerStack.length - 1)];
        this.layerLast[done] = this.cmds.length;
        this.layerStack.pop();
      }
      const pp = new EVGDrawCmd();
      pp.kind = 5;
      this.addCmd(pp);
      if ( scrolls && this.scrollbars ) {
        this.addScrollbar(el, x, y, w, h);
      }
    }
    this.backdropR = hadBdR;
    this.backdropG = hadBdG;
    this.backdropB = hadBdB;
  };
  toBinary () {
    const out = new EVGSceneBinary();
    const n = this.cmds.length;
    out.count = n;
    out.viewX = this.viewX;
    out.viewY = this.viewY;
    out.viewScale = this.viewScale;
    out.hasView = this.hasView;
    const stride = EVGDisplayList.stride();
    let totalPts = 0;
    let totalEnds = 0;
    let i = 0;
    while (i < n) {
      const c = this.cmds[i];
      const pc = c.pts.length;
      totalPts = totalPts + pc;
      if ( pc > 0 ) {
        const ec = c.ringEnds.length;
        if ( ec == 0 ) {
          totalEnds = totalEnds + 1;
        } else {
          totalEnds = totalEnds + ec;
        }
      }
      i = i + 1;
    };
    let recs = new Int32Array(n * stride);
    let pbuf = new Int32Array(totalPts);
    let ebuf = new Int32Array(totalEnds);
    let pool = [];
    let poolIndex = {};
    let pAt = 0;
    let eAt = 0;
    let k = 0;
    while (k < n) {
      const c2 = this.cmds[k];
      const base = k * stride;
      recs[base] = c2.kind;
      recs[base + 1] = EVGDisplayList.fixed(c2.x);
      recs[base + 2] = EVGDisplayList.fixed(c2.y);
      recs[base + 3] = EVGDisplayList.fixed(c2.w);
      recs[base + 4] = EVGDisplayList.fixed(c2.h);
      recs[base + 5] = EVGDisplayList.fixed(c2.radius);
      recs[base + 6] = EVGDisplayList.fixed(c2.thickness);
      recs[base + 7] = EVGDisplayList.packRgb(c2.r, c2.g, c2.b);
      recs[base + 8] = EVGDisplayList.fixed(c2.a);
      let flags = 0;
      if ( c2.hasGrad ) {
        flags = flags + 1;
      }
      if ( c2.textAlign == "italic" ) {
        flags = flags + 2;
      }
      if ( c2.flipH ) {
        flags = flags + 4;
      }
      if ( c2.flipV ) {
        flags = flags + 8;
      }
      if ( c2.evenOdd ) {
        flags = flags + 16;
      }
      if ( c2.hasRotOrigin ) {
        flags = flags + 32;
      }
      if ( c2.perCorner ) {
        flags = flags + 64;
      }
      if ( c2.hasShadow ) {
        flags = flags + 128;
      }
      if ( c2.hasCrop ) {
        flags = flags + 256;
      }
      recs[base + 9] = flags;
      recs[base + 10] = c2.gradDir;
      recs[base + 11] = EVGDisplayList.packRgb(c2.r2, c2.g2, c2.b2);
      recs[base + 12] = EVGDisplayList.fixed(c2.a2);
      recs[base + 13] = EVGDisplayList.fixed(c2.fontSize);
      recs[base + 14] = EVGDisplayList.fixed(c2.rotate);
      recs[base + 24] = EVGDisplayList.fixed(c2.rotOriginX);
      recs[base + 25] = EVGDisplayList.fixed(c2.rotOriginY);
      recs[base + 26] = EVGDisplayList.fixed(c2.backdropBlur);
      recs[base + 27] = EVGDisplayList.fixed(c2.radiusTR);
      recs[base + 28] = EVGDisplayList.fixed(c2.radiusBR);
      recs[base + 29] = EVGDisplayList.fixed(c2.radiusBL);
      recs[base + 30] = c2.layer;
      recs[base + 31] = EVGDisplayList.fixed(c2.shadowX);
      recs[base + 32] = EVGDisplayList.fixed(c2.shadowY);
      recs[base + 33] = EVGDisplayList.fixed(c2.shadowBlur);
      recs[base + 34] = EVGDisplayList.packRgb(
        c2.shadowR,
        c2.shadowG,
        c2.shadowB
      );
      recs[base + 35] = EVGDisplayList.fixed(c2.shadowA);
      recs[base + 36] = EVGDisplayList.fixed(c2.letterSpacing);
      recs[base + 37] = c2.strokeCap;
      recs[base + 38] = c2.strokeJoin;
      let dashIdx = 0 - 1;
      if ( c2.strokeDash.length > 0 ) {
        dashIdx = EVGDisplayList.intern(pool, poolIndex, c2.strokeDash);
      }
      recs[base + 39] = dashIdx;
      recs[base + 40] = EVGDisplayList.fixed(c2.strokeDashOffset);
      recs[base + 41] = EVGDisplayList.fixed((c2.cropX * 100.0));
      recs[base + 42] = EVGDisplayList.fixed((c2.cropY * 100.0));
      recs[base + 43] = EVGDisplayList.fixed(((c2.cropX + c2.cropW) * 100.0));
      recs[base + 44] = EVGDisplayList.fixed(((c2.cropY + c2.cropH) * 100.0));
      let textIdx = 0 - 1;
      let fontIdx = 0 - 1;
      let weightIdx = 0 - 1;
      if ( c2.text.length > 0 ) {
        textIdx = EVGDisplayList.intern(pool, poolIndex, c2.text);
        fontIdx = EVGDisplayList.intern(pool, poolIndex, c2.fontFamily);
        if ( c2.fontWeight.length > 0 ) {
          weightIdx = EVGDisplayList.intern(pool, poolIndex, c2.fontWeight);
        }
      }
      recs[base + 15] = textIdx;
      recs[base + 16] = fontIdx;
      recs[base + 17] = weightIdx;
      let srcIdx = 0 - 1;
      if ( c2.src.length > 0 ) {
        srcIdx = EVGDisplayList.intern(pool, poolIndex, c2.src);
      }
      recs[base + 18] = srcIdx;
      const pc2 = c2.pts.length;
      recs[base + 19] = pAt;
      recs[base + 20] = pc2;
      const eStart = eAt;
      if ( pc2 > 0 ) {
        let pi = 0;
        while (pi < pc2) {
          pbuf[pAt + pi] = EVGDisplayList.fixed(c2.pts[pi]);
          pi = pi + 1;
        };
        pAt = pAt + pc2;
        const ec2 = c2.ringEnds.length;
        if ( ec2 == 0 ) {
          ebuf[eAt] = pc2;
          eAt = eAt + 1;
        } else {
          let ei = 0;
          while (ei < ec2) {
            ebuf[eAt + ei] = c2.ringEnds[ei];
            ei = ei + 1;
          };
          eAt = eAt + ec2;
        }
      }
      recs[base + 21] = eStart;
      recs[base + 22] = eAt - eStart;
      k = k + 1;
    };
    out.cmds = recs;
    out.pts = pbuf;
    out.ends = ebuf;
    out.strings = pool;
    return out;
  };
  readEffect (el) {
    if ( this.effectKind.length > 0 ) {
      return;
    }
    if ( el.surfaceEffect.length > 0 ) {
      this.effectKind = el.surfaceEffect;
      this.effectXs = el.rippleXs;
      this.effectYs = el.rippleYs;
      this.effectAges = el.rippleAges;
      this.effectSpeed = el.rippleSpeed;
      this.effectWidth = el.rippleWidth;
      this.effectStrength = el.rippleStrength;
      this.effectDecay = el.rippleDecay;
      this.effectHighlight = el.rippleHighlight;
      this.effectRings = el.rippleRings;
      this.effectStagger = el.rippleStagger;
      this.effectFalloff = el.rippleFalloff;
      this.effectShine = el.rippleShine;
      this.effectGloss = el.rippleGloss;
      this.effectBump = el.rippleBump;
      this.effectLightX = el.rippleLightX;
      this.effectLightY = el.rippleLightY;
      this.effectLightZ = el.rippleLightZ;
    }
    if ( el.paintHasEffect == false && el.surfaceEffect.length == 0 ) {
      return;
    }
    let i = 0;
    while (i < el.getChildCount()) {
      this.readEffect(el.getChild(i));
      i = i + 1;
    };
  };
  collectEffects (el) {
    if ( el.surfaceEffect.length > 0 ) {
      this.addEffect(el);
    }
    if ( el.paintHasEffect == false && el.surfaceEffect.length == 0 ) {
      return;
    }
    let i = 0;
    while (i < el.getChildCount()) {
      this.collectEffects(el.getChild(i));
      i = i + 1;
    };
  };
  pushParam (start, key, value) {
    let i = start;
    while (i < this.fxParamNames.length) {
      if ( this.fxParamNames[i] == key ) {
        return;
      }
      i = i + 1;
    };
    this.fxParamNames.push(key);
    this.fxParamValues.push(value);
  };
  addEffect (el) {
    let id = el.id;
    if ( id.length == 0 ) {
      id = "fx" + (this.fxIds.length.toString());
    }
    el.effectRuntimeId = id;
    this.fxIds.push(id);
    this.fxKinds.push(el.surfaceEffect);
    this.fxTriggers.push(el.effectTrigger);
    this.fxX.push(el.calculatedX);
    this.fxY.push(el.calculatedY);
    this.fxW.push(el.calculatedWidth);
    this.fxH.push(el.calculatedHeight);
    this.fxRadius.push(el.box.borderRadiusPx);
    const start = this.fxParamNames.length;
    this.fxParamStart.push(start);
    let i = 0;
    while (i < el.fxNames.length) {
      this.pushParam(start, el.fxNames[i], el.fxValues[i]);
      i = i + 1;
    };
    if ( el.surfaceEffect == "ripple" ) {
      this.pushParam(start, "speed", el.rippleSpeed);
      this.pushParam(start, "width", el.rippleWidth);
      this.pushParam(start, "strength", el.rippleStrength);
      this.pushParam(start, "decay", el.rippleDecay);
      this.pushParam(start, "highlight", el.rippleHighlight);
      this.pushParam(start, "rings", el.rippleRings);
      this.pushParam(start, "stagger", el.rippleStagger);
      this.pushParam(start, "falloff", el.rippleFalloff);
      this.pushParam(start, "shine", el.rippleShine);
      this.pushParam(start, "gloss", el.rippleGloss);
      this.pushParam(start, "bump", el.rippleBump);
      this.pushParam(start, "lightX", el.rippleLightX);
      this.pushParam(start, "lightY", el.rippleLightY);
      this.pushParam(start, "lightZ", el.rippleLightZ);
    }
    this.fxParamCount.push(this.fxParamNames.length - start);
  };
  toJson () {
    let out = "{";
    if ( this.effectKind.length > 0 ) {
      out = ((out + "\"effect\":{\"kind\":\"") + this.effectKind) + "\"";
      out = out + ",\"drops\":[";
      let di = 0;
      while (di < this.effectAges.length) {
        if ( di > 0 ) {
          out = out + ",";
        }
        out = (out + "[") + EVGDisplayList.num(this.effectXs[di]);
        out = (out + ",") + EVGDisplayList.num(this.effectYs[di]);
        out = ((out + ",") + EVGDisplayList.num(this.effectAges[di])) + "]";
        di = di + 1;
      };
      out = out + "]";
      out = (out + ",\"speed\":") + EVGDisplayList.num(this.effectSpeed);
      out = (out + ",\"width\":") + EVGDisplayList.num(this.effectWidth);
      out = (out + ",\"strength\":") + EVGDisplayList.num(this.effectStrength);
      out = (out + ",\"decay\":") + EVGDisplayList.num(this.effectDecay);
      out = (out + ",\"highlight\":") + EVGDisplayList.num(this.effectHighlight);
      out = (out + ",\"rings\":") + EVGDisplayList.num(this.effectRings);
      out = (out + ",\"stagger\":") + EVGDisplayList.num(this.effectStagger);
      out = (out + ",\"falloff\":") + EVGDisplayList.num(this.effectFalloff);
      out = (out + ",\"shine\":") + EVGDisplayList.num(this.effectShine);
      out = (out + ",\"gloss\":") + EVGDisplayList.num(this.effectGloss);
      out = (out + ",\"bump\":") + EVGDisplayList.num(this.effectBump);
      out = ((((((out + ",\"light\":[") + EVGDisplayList.num(this.effectLightX)) + ",") + EVGDisplayList.num(this.effectLightY)) + ",") + EVGDisplayList.num(this.effectLightZ)) + "]";
      out = out + "},";
    }
    if ( this.fxIds.length > 0 ) {
      out = out + "\"effects\":[";
      let fi = 0;
      while (fi < this.fxIds.length) {
        if ( fi > 0 ) {
          out = out + ",";
        }
        out = (out + "{\"id\":") + EVGDisplayList.jsonString(this.fxIds[fi]);
        out = (out + ",\"kind\":") + EVGDisplayList.jsonString(this.fxKinds[fi]);
        if ( this.fxTriggers[fi].length > 0 ) {
          out = (out + ",\"on\":") + EVGDisplayList.jsonString(this.fxTriggers[fi]);
        }
        out = (out + ",\"box\":[") + EVGDisplayList.num(this.fxX[fi]);
        out = (out + ",") + EVGDisplayList.num(this.fxY[fi]);
        out = (out + ",") + EVGDisplayList.num(this.fxW[fi]);
        out = ((out + ",") + EVGDisplayList.num(this.fxH[fi])) + "]";
        if ( this.fxRadius[fi] > 0.0 ) {
          out = (out + ",\"r\":") + EVGDisplayList.num(this.fxRadius[fi]);
        }
        out = out + ",\"p\":{";
        const ps = this.fxParamStart[fi];
        const pn = this.fxParamCount[fi];
        let pi = 0;
        while (pi < pn) {
          if ( pi > 0 ) {
            out = out + ",";
          }
          out = out + EVGDisplayList.jsonString(this.fxParamNames[(ps + pi)]);
          out = (out + ":") + EVGDisplayList.num(this.fxParamValues[(ps + pi)]);
          pi = pi + 1;
        };
        out = out + "}}";
        fi = fi + 1;
      };
      out = out + "],";
    }
    if ( this.hasView ) {
      out = ((out + "\"view\":[") + EVGDisplayList.fine(this.viewX)) + ",";
      out = (((out + EVGDisplayList.fine(this.viewY)) + ",") + EVGDisplayList.fine(this.viewScale)) + "],";
    }
    out = out + "\"cmds\":[";
    let i = 0;
    while (i < this.cmds.length) {
      const c = this.cmds[i];
      if ( i > 0 ) {
        out = out + ",";
      }
      out = (out + "{\"k\":") + (c.kind.toString());
      if ( c.layer > 0 ) {
        out = (out + ",\"layer\":") + (c.layer.toString());
      }
      if ( this.attribute ) {
        out = (out + ",\"n\":") + (c.node.toString());
      }
      out = (out + ",\"x\":") + EVGDisplayList.num(c.x);
      out = (out + ",\"y\":") + EVGDisplayList.num(c.y);
      out = (out + ",\"w\":") + EVGDisplayList.num(c.w);
      out = (out + ",\"h\":") + EVGDisplayList.num(c.h);
      if ( c.perCorner ) {
        out = ((((((((out + ",\"rc\":[") + EVGDisplayList.num(c.radius)) + ",") + EVGDisplayList.num(c.radiusTR)) + ",") + EVGDisplayList.num(c.radiusBR)) + ",") + EVGDisplayList.num(c.radiusBL)) + "]";
      }
      if ( c.radius > 0.0 ) {
        out = (out + ",\"r\":") + EVGDisplayList.num(c.radius);
      }
      if ( c.thickness > 0.0 ) {
        out = (out + ",\"t\":") + EVGDisplayList.num(c.thickness);
        if ( c.strokeCap != 0 ) {
          out = (out + ",\"cap\":") + (c.strokeCap.toString());
        }
        if ( c.strokeJoin != 0 ) {
          out = (out + ",\"join\":") + (c.strokeJoin.toString());
        }
        if ( c.strokeDash.length > 0 ) {
          out = (out + ",\"dash\":") + EVGDisplayList.jsonString(c.strokeDash);
          if ( c.strokeDashOffset != 0.0 ) {
            out = (out + ",\"dashoff\":") + EVGDisplayList.num(c.strokeDashOffset);
          }
        }
      }
      out = (((out + ",\"c\":[") + (c.r.toString())) + ",") + (c.g.toString());
      out = ((((out + ",") + (c.b.toString())) + ",") + EVGDisplayList.num(c.a)) + "]";
      if ( c.hasGrad ) {
        out = (out + ",\"gd\":") + (c.gradDir.toString());
        out = (((out + ",\"c2\":[") + (c.r2.toString())) + ",") + (c.g2.toString());
        out = ((((out + ",") + (c.b2.toString())) + ",") + EVGDisplayList.num(c.a2)) + "]";
      }
      if ( c.text.length > 0 ) {
        out = (out + ",\"text\":") + EVGDisplayList.jsonString(c.text);
        out = (out + ",\"font\":") + EVGDisplayList.jsonString(c.fontFamily);
        out = (out + ",\"size\":") + EVGDisplayList.num(c.fontSize);
        if ( c.letterSpacing != 0.0 ) {
          out = (out + ",\"ls\":") + EVGDisplayList.num(c.letterSpacing);
        }
        if ( c.fontWeight.length > 0 ) {
          out = (out + ",\"weight\":") + EVGDisplayList.jsonString(c.fontWeight);
        }
        if ( c.textAlign == "italic" ) {
          out = out + ",\"italic\":true";
        }
      }
      if ( c.src.length > 0 ) {
        out = (out + ",\"src\":") + EVGDisplayList.jsonString(c.src);
      }
      if ( c.flipH ) {
        out = out + ",\"fx\":true";
      }
      if ( c.flipV ) {
        out = out + ",\"fy\":true";
      }
      if ( c.hasCrop ) {
        out = (((out + ",\"cu\":[") + EVGDisplayList.frac4(c.cropX)) + ",") + EVGDisplayList.frac4(c.cropY);
        out = ((((out + ",") + EVGDisplayList.frac4((c.cropX + c.cropW))) + ",") + EVGDisplayList.frac4((c.cropY + c.cropH))) + "]";
      }
      if ( c.rotate != 0.0 ) {
        out = (out + ",\"rot\":") + EVGDisplayList.num(c.rotate);
        if ( c.hasRotOrigin ) {
          out = (out + ",\"rox\":") + EVGDisplayList.num(c.rotOriginX);
          out = (out + ",\"roy\":") + EVGDisplayList.num(c.rotOriginY);
        }
      }
      if ( c.effectId.length > 0 ) {
        out = (out + ",\"efx\":") + EVGDisplayList.jsonString(c.effectId);
      }
      if ( c.backdropBlur > 0.0 ) {
        out = (out + ",\"bb\":") + EVGDisplayList.num(c.backdropBlur);
      }
      if ( c.hasShadow ) {
        out = (out + ",\"sh\":{\"x\":") + EVGDisplayList.num(c.shadowX);
        out = (out + ",\"y\":") + EVGDisplayList.num(c.shadowY);
        out = (out + ",\"blur\":") + EVGDisplayList.num(c.shadowBlur);
        out = (((out + ",\"c\":[") + (c.shadowR.toString())) + ",") + (c.shadowG.toString());
        out = ((((out + ",") + (c.shadowB.toString())) + ",") + EVGDisplayList.num(c.shadowA)) + "]}";
      }
      if ( c.pts.length > 0 ) {
        out = out + ",\"pts\":[";
        let pi_1 = 0;
        while (pi_1 < c.pts.length) {
          if ( pi_1 > 0 ) {
            out = out + ",";
          }
          out = out + EVGDisplayList.num(c.pts[pi_1]);
          pi_1 = pi_1 + 1;
        };
        out = out + "],\"ends\":[";
        if ( c.ringEnds.length == 0 ) {
          out = out + (c.pts.length.toString());
        } else {
          let ei = 0;
          while (ei < c.ringEnds.length) {
            if ( ei > 0 ) {
              out = out + ",";
            }
            out = out + (c.ringEnds[ei].toString());
            ei = ei + 1;
          };
        }
        out = out + "]";
        if ( c.evenOdd ) {
          out = out + ",\"eo\":1";
        }
      }
      out = out + "}";
      i = i + 1;
    };
    out = ((out + "],\"seq\":") + (this.buildSeq.toString())) + ",\"shifts\":[";
    let si = 0;
    while (si < this.layerEls.length) {
      if ( si > 0 ) {
        out = out + ",";
      }
      out = ((((out + "[") + EVGDisplayList.num(this.layerShiftX[si])) + ",") + EVGDisplayList.num(this.layerShiftY[si])) + "]";
      si = si + 1;
    };
    out = out + "]}";
    return out;
  };
  offsetBy (dx, dy) {
    let i = 0;
    while (i < this.cmds.length) {
      const c = this.cmds[i];
      if ( c.kind != 5 ) {
        c.x = c.x + dx;
        c.y = c.y + dy;
        let pi = 0;
        while (pi < c.pts.length) {
          const even = pi % 2 == 0;
          if ( even ) {
            c.pts[pi] = c.pts[pi] + dx;
          } else {
            c.pts[pi] = c.pts[pi] + dy;
          }
          pi = pi + 1;
        };
      }
      i = i + 1;
    };
  };
  scaleBy (s) {
    if ( s == 1.0 ) {
      return;
    }
    let i = 0;
    while (i < this.cmds.length) {
      const c = this.cmds[i];
      if ( c.kind != 5 ) {
        c.x = c.x * s;
        c.y = c.y * s;
        c.w = c.w * s;
        c.h = c.h * s;
        c.radius = c.radius * s;
        c.radiusTR = c.radiusTR * s;
        c.radiusBR = c.radiusBR * s;
        c.radiusBL = c.radiusBL * s;
        c.thickness = c.thickness * s;
        c.fontSize = c.fontSize * s;
        c.letterSpacing = c.letterSpacing * s;
        c.maxWidth = c.maxWidth * s;
        c.shadowX = c.shadowX * s;
        c.shadowY = c.shadowY * s;
        c.shadowBlur = c.shadowBlur * s;
        c.strokeDashOffset = c.strokeDashOffset * s;
        c.rotOriginX = c.rotOriginX * s;
        c.rotOriginY = c.rotOriginY * s;
        let pi = 0;
        while (pi < c.pts.length) {
          c.pts[pi] = c.pts[pi] * s;
          pi = pi + 1;
        };
      }
      i = i + 1;
    };
  };
  appendFrom (src) {
    let i = 0;
    while (i < src.cmds.length) {
      this.cmds.push(src.cmds[i]);
      i = i + 1;
    };
  };
  summary () {
    let rects = 0;
    let borders = 0;
    let images = 0;
    let texts = 0;
    let clips = 0;
    let i = 0;
    while (i < this.cmds.length) {
      const c = this.cmds[i];
      if ( c.kind == 0 ) {
        rects = rects + 1;
      }
      if ( c.kind == 1 ) {
        borders = borders + 1;
      }
      if ( c.kind == 2 ) {
        images = images + 1;
      }
      if ( c.kind == 3 ) {
        texts = texts + 1;
      }
      if ( c.kind == 4 ) {
        clips = clips + 1;
      }
      i = i + 1;
    };
    let s = "rects=" + (rects.toString());
    s = (s + " borders=") + (borders.toString());
    s = (s + " images=") + (images.toString());
    s = (s + " text=") + (texts.toString());
    s = (s + " clips=") + (clips.toString());
    return s;
  };
}
EVGDisplayList.holds = function(parent, el) {
  if ( parent == el ) {
    return true;
  }
  let i = 0;
  const n = parent.getChildCount();
  while (i < n) {
    if ( EVGDisplayList.holds(parent.getChild(i), el) ) {
      return true;
    }
    i = i + 1;
  };
  return false;
};
EVGDisplayList.ringTarget = function(el, id) {
  let none;
  if ( el.a11yHidden ) {
    return none;
  }
  if ( el.display == "none" ) {
    return none;
  }
  if ( el.id == id ) {
    if ( el.calculatedWidth > 0.0 ) {
      if ( el.calculatedHeight > 0.0 ) {
        const hit = el;
        return hit;
      }
    }
  }
  let i = 0;
  const n = el.getChildCount();
  while (i < n) {
    const found = EVGDisplayList.ringTarget(el.getChild(i), id);
    if ( typeof(found) != "undefined" ) {
      return found;
    }
    i = i + 1;
  };
  return none;
};
EVGDisplayList.radiusPx = function(isPct, pct, already, own) {
  if ( isPct ) {
    return (pct / 100.0) * own;
  }
  return already;
};
EVGDisplayList.sideFactor = function(soFar, side, sum) {
  if ( sum <= 0.0 ) {
    return soFar;
  }
  const f = side / sum;
  if ( f < soFar ) {
    return f;
  }
  return soFar;
};
EVGDisplayList.barNearPx = function() {
  return 36.0;
};
EVGDisplayList.pctLabel = function(pct) {
  return (pct.toString()) + " %";
};
EVGDisplayList.barWidth = function(state, thin) {
  if ( thin ) {
    if ( state >= 2 ) {
      return 7.0;
    }
    if ( state == 1 ) {
      return 5.0;
    }
    return 3.0;
  }
  if ( state >= 2 ) {
    return 11.0;
  }
  if ( state == 1 ) {
    return 8.0;
  }
  return 4.0;
};
EVGDisplayList.normAngle = function(a) {
  let v = a;
  while (v < 0.0) {
    v = v + 360.0;
  };
  while (v >= 360.0) {
    v = v - 360.0;
  };
  return v;
};
EVGDisplayList.applyShadow = function(c, el) {
  const col = el.shadowColor;
  if ( col.isSet == false ) {
    return;
  }
  if ( col.alpha() <= 0.0 ) {
    return;
  }
  let blur = 0.0;
  if ( el.shadowRadius.isSet ) {
    blur = el.shadowRadius.pixels;
  }
  let dx = 0.0;
  if ( el.shadowOffsetX.isSet ) {
    dx = el.shadowOffsetX.pixels;
  }
  let dy = 0.0;
  if ( el.shadowOffsetY.isSet ) {
    dy = el.shadowOffsetY.pixels;
  }
  if ( blur < 0.0 ) {
    blur = 0.0;
  }
  if ( (blur == 0.0 && dx == 0.0) && dy == 0.0 ) {
    return;
  }
  c.hasShadow = true;
  c.shadowX = dx;
  c.shadowY = dy;
  c.shadowBlur = blur;
  c.shadowR = col.red();
  c.shadowG = col.green();
  c.shadowB = col.blue();
  c.shadowA = col.alpha();
};
EVGDisplayList.rasterAngleOfDir = function(dir) {
  if ( dir == 1 ) {
    return 0.0;
  }
  return 90.0;
};
EVGDisplayList.cssAngleOfDir = function(dir) {
  if ( dir == 1 ) {
    return 90.0;
  }
  return 180.0;
};
EVGDisplayList.hasLinearGradient = function(el) {
  if ( el.gradientSet ) {
    return true;
  }
  const g = el.gradient;
  if ( g.isSet == false ) {
    return false;
  }
  if ( g.isLinear == false ) {
    return false;
  }
  return g.getStopCount() > 1;
};
EVGDisplayList.applyGradient = function(c, el) {
  if ( el.gradientSet ) {
    const a0 = el.gradientFrom;
    const b0 = el.gradientTo;
    c.hasGrad = true;
    c.gradDir = el.gradientDir;
    c.r = a0.red();
    c.g = a0.green();
    c.b = a0.blue();
    c.a = a0.alpha();
    c.r2 = b0.red();
    c.g2 = b0.green();
    c.b2 = b0.blue();
    c.a2 = b0.alpha();
    return;
  }
  const g = el.gradient;
  const ang = EVGDisplayList.normAngle(g.angle);
  let dir = 0;
  let swap = false;
  if ( ang >= 45.0 && ang < 135.0 ) {
    dir = 1;
  }
  if ( ang >= 225.0 && ang < 315.0 ) {
    dir = 1;
    swap = true;
  }
  if ( ang < 45.0 || ang >= 315.0 ) {
    swap = true;
  }
  let from = g.getStartColor();
  let to = g.getEndColor();
  if ( swap ) {
    const tmp = from;
    from = to;
    to = tmp;
  }
  c.hasGrad = true;
  c.gradDir = dir;
  c.r = from.red();
  c.g = from.green();
  c.b = from.blue();
  c.a = from.alpha();
  c.r2 = to.red();
  c.g2 = to.green();
  c.b2 = to.blue();
  c.a2 = to.alpha();
};
EVGDisplayList.capCode = function(name) {
  if ( name == "round" ) {
    return 1;
  }
  if ( name == "square" ) {
    return 2;
  }
  return 0;
};
EVGDisplayList.joinCode = function(name) {
  if ( name == "round" ) {
    return 1;
  }
  if ( name == "bevel" ) {
    return 2;
  }
  return 0;
};
EVGDisplayList.stride = function() {
  return 45;
};
EVGDisplayList.fixed = function(v) {
  if ( v < 0.0 ) {
    return 0 - Math.floor( (0.0 - v) * 100.0 + 0.5);
  }
  return Math.floor( v * 100.0 + 0.5);
};
EVGDisplayList.packRgb = function(r, g, b) {
  return (r * 65536 + g * 256) + b;
};
EVGDisplayList.intern = function(pool, index, value) {
  if ( ( typeof(index[value] ) != "undefined" && Object.prototype.hasOwnProperty.call(index, value) ) ) {
    return ( Object.prototype.hasOwnProperty.call(index, value) ? index[value] : undefined );
  }
  const at = pool.length;
  pool.push(value);
  index[value] = at;
  return at;
};
EVGDisplayList.fine = function(v) {
  const limit = 2000000000.0;
  let x = 0.0;
  if ( v > 0.0 ) {
    x = v;
  }
  if ( v < 0.0 ) {
    x = v;
  }
  if ( x > limit ) {
    x = limit;
  }
  if ( x < 0.0 - limit ) {
    x = 0.0 - limit;
  }
  const neg = x < 0.0;
  let av = x;
  if ( neg ) {
    av = 0.0 - x;
  }
  let whole = Math.floor( av);
  const rest = av - whole;
  let frac = Math.floor( rest * 1000000.0 + 0.5);
  if ( frac >= 1000000 ) {
    whole = whole + 1;
    frac = 0;
  }
  let fs = (frac.toString());
  while (fs.length < 6) {
    fs = "0" + fs;
  };
  let out = ((whole.toString()) + ".") + fs;
  if ( neg ) {
    if ( whole > 0 || frac > 0 ) {
      out = "-" + out;
    }
  }
  return out;
};
EVGDisplayList.num = function(v) {
  const limit = 10000000.0;
  let x = 0.0;
  if ( v > 0.0 ) {
    x = v;
  }
  if ( v < 0.0 ) {
    x = v;
  }
  if ( x > limit ) {
    x = limit;
  }
  if ( x < 0.0 - limit ) {
    x = 0.0 - limit;
  }
  const neg = x < 0.0;
  let av = x;
  if ( neg ) {
    av = 0.0 - x;
  }
  const scaled = Math.floor( av * 100.0 + 0.5);
  const whole = ((scaled / 100) | 0);
  const frac = scaled - whole * 100;
  let fs = (frac.toString());
  if ( frac < 10 ) {
    fs = "0" + fs;
  }
  let out = ((whole.toString()) + ".") + fs;
  if ( neg ) {
    if ( scaled > 0 ) {
      out = "-" + out;
    }
  }
  return out;
};
EVGDisplayList.frac4 = function(v) {
  let x = 0.0;
  if ( v > 0.0 ) {
    x = v;
  }
  if ( v < 0.0 ) {
    x = v;
  }
  if ( x > 1000.0 ) {
    x = 1000.0;
  }
  if ( x < 0.0 - 1000.0 ) {
    x = 0.0 - 1000.0;
  }
  const neg = x < 0.0;
  let av = x;
  if ( neg ) {
    av = 0.0 - x;
  }
  const scaled = Math.floor( av * 10000.0 + 0.5);
  const whole = ((scaled / 10000) | 0);
  const frac = scaled - whole * 10000;
  let fs = (frac.toString());
  while (fs.length < 4) {
    fs = "0" + fs;
  };
  let out = ((whole.toString()) + ".") + fs;
  if ( neg ) {
    if ( scaled > 0 ) {
      out = "-" + out;
    }
  }
  return out;
};
EVGDisplayList.jsonString = function(v) {
  let out = "\"";
  let i = 0;
  while (i < v.length) {
    const c = v.charCodeAt(i );
    if ( c == 34 ) {
      out = out + "\\\"";
    } else {
      if ( c == 92 ) {
        out = out + "\\\\";
      } else {
        if ( c < 32 ) {
          out = out + " ";
        } else {
          out = out + String.fromCharCode(c);
        }
      }
    }
    i = i + 1;
  };
  return out + "\"";
};
class KsTopic  {
  constructor() {
    this.id = "";
    this.title = "";
    this.count = 0;
  }
}
class KsQuestion  {
  constructor() {
    this.topic = 0;
    this.prompt = "";
    this.okText = "";
    this.badText = "";
    this.choices = [];
    this.correct = 0;
    this.lessonUrl = "";
  }
}
class KsLine  {
  constructor() {
    this.cls = "ln";
    this.text = "";
    this.shown = 0;
    this.speed = 30;
    this.jitter = 20;
    this.hold = 0;
    this.hit = -1;
    this.link = "";
  }
  isDone () {
    return this.shown >= this.text.length;
  };
}
class KoodisampoTerminal  {
  constructor() {
    this.pageW = 1200.0;
    this.pageH = 800.0;
    this.coarse = false;
    this.theme = 0;
    this.topics = [];
    this.questions = [];
    this.lines = [];
    this.cur = 0;
    this.wait = 0.0;
    this.inHold = false;
    this.idleMs = 0.0;
    this.blinkMs = 0.0;
    this.cursorOn = true;
    this.typed = 0;
    this.dirty = true;
    this.scrollFrom = 0;
    this.mode = 0;
    this.phase = 0;
    this.booted = false;
    this.menuSel = 0;
    this.numBuf = "";
    this.promptLine = -1;
    this.topicSel = -1;
    this.deck = [];
    this.roundPos = 0;
    this.roundLen = 10;
    this.score = 0;
    this.answered = 0;
    this.qIndex = 0;
    this.order = [];
    this.choiceLines = [];
    this.qLine = -1;
    this.hitY0 = [];
    this.hitY1 = [];
    this.hitV = [];
    this.linkX0 = [];
    this.linkX1 = [];
    this.linkY0 = [];
    this.linkY1 = [];
    this.linkUrl = [];
    this.studyUrl = "";
    this.pendingUrl = "";
    this.lessonNow = "";
    this.seed = 1234567;
    this.footEl = undefined;
    this.footLink = undefined;
  }
  setSeed (s) {
    this.seed = s % 2147483646 + 1;
    if ( this.seed < 1 ) {
      this.seed = (0 - this.seed) + 1;
    }
  };
  setViewport (w, h, c) {
    this.pageW = w;
    this.pageH = h;
    this.coarse = c;
    this.dirty = true;
  };
  addTopic (id, title) {
    const t = new KsTopic();
    t.id = id;
    t.title = title;
    this.topics.push(t);
    return this.topics.length - 1;
  };
  addQuestion (topic, prompt, okText, badText) {
    const q = new KsQuestion();
    q.topic = topic;
    q.prompt = prompt;
    q.okText = okText;
    q.badText = badText;
    this.questions.push(q);
    const t = this.topics[topic];
    t.count = t.count + 1;
    return this.questions.length - 1;
  };
  addChoice (qi, text, isCorrect) {
    const q = this.questions[qi];
    if ( isCorrect ) {
      q.correct = q.choices.length;
    }
    q.choices.push(text);
  };
  setQuestionLink (qi, url) {
    const q = this.questions[qi];
    q.lessonUrl = url;
  };
  setStudyUrl (url) {
    this.studyUrl = url;
    this.dirty = true;
  };
  takeOpenUrl () {
    const u = this.pendingUrl;
    this.pendingUrl = "";
    return u;
  };
  questionCount () {
    return this.questions.length;
  };
  setTheme (t) {
    this.theme = t;
    this.dirty = true;
  };
  themeIndex () {
    return this.theme;
  };
  modeIndex () {
    return this.mode;
  };
  phaseIndex () {
    return this.phase;
  };
  scoreNow () {
    return this.score;
  };
  typingDone () {
    return this.cur >= this.lines.length;
  };
  takeTyped () {
    const n = this.typed;
    this.typed = 0;
    return n;
  };
  rnd (n) {
    this.seed = (this.seed * 16807) % 2147483647;
    if ( n <= 0 ) {
      return 0;
    }
    return this.seed % n;
  };
  shuffle (arr) {
    let i = arr.length - 1;
    while (i > 0) {
      const j = this.rnd((i + 1));
      const a = arr[i];
      const b = arr[j];
      arr[i] = b;
      arr[j] = a;
      i = i - 1;
    };
  };
  clearScreen () {
    this.lines.length = 0;
    this.cur = 0;
    this.wait = 0.0;
    this.inHold = false;
    this.scrollFrom = 0;
    this.promptLine = -1;
    this.dirty = true;
  };
  emit (cls, text, speed, jitter, hold, hit) {
    const l = new KsLine();
    l.cls = cls;
    l.text = text;
    l.speed = speed;
    l.jitter = jitter;
    l.hold = hold;
    l.hit = hit;
    this.lines.push(l);
    this.dirty = true;
    return this.lines.length - 1;
  };
  gap (hold) {
    this.emit("ln", "", 0, 0, hold, -1);
  };
  prompt () {
    this.promptLine = this.emit("ln prompt", "> ", 0, 0, 0, -1);
  };
  charDelay (l, c) {
    const sp = l.speed;
    let d = sp + this.rnd((l.jitter + 1));
    if ( c == 32 ) {
      d = d + sp * 0.5;
    }
    if ( ((((c == 46 || c == 44) || c == 58) || c == 59) || c == 63) || c == 33 ) {
      d = d + sp * 4.0;
    }
    return d;
  };
  finishLine (l) {
    this.cur = this.cur + 1;
    if ( l.hold > 0 ) {
      this.wait = this.wait + l.hold;
      this.inHold = l.hold >= 700;
    }
  };
  tick (dtIn) {
    let dt = dtIn;
    if ( dt > 250.0 ) {
      dt = 250.0;
    }
    let changed = this.dirty;
    this.dirty = false;
    this.idleMs = this.idleMs + dt;
    if ( this.typingDone() == false ) {
      this.wait = this.wait - dt;
      let guard = 0;
      while ((this.wait <= 0.0 && this.cur < this.lines.length) && guard < 4000) {
        guard = guard + 1;
        const l = this.lines[this.cur];
        if ( l.isDone() ) {
          this.finishLine(l);
        } else {
          this.inHold = false;
          if ( l.speed <= 0 ) {
            l.shown = l.text.length;
          } else {
            l.shown = l.shown + 1;
            this.wait = this.wait + this.charDelay(l, l.text.charCodeAt(l.shown - 1 ));
          }
          this.typed = this.typed + 1;
          this.idleMs = 0.0;
          changed = true;
          if ( l.isDone() ) {
            this.finishLine(l);
          }
        }
      };
      if ( this.wait < -250.0 ) {
        this.wait = -250.0;
      }
    }
    if ( this.idleMs < 260.0 ) {
      if ( this.cursorOn == false ) {
        this.cursorOn = true;
        changed = true;
      }
      this.blinkMs = 0.0;
    } else {
      this.blinkMs = this.blinkMs + dt;
      if ( this.blinkMs >= 530.0 ) {
        this.blinkMs = this.blinkMs - 530.0;
        this.cursorOn = this.cursorOn == false;
        changed = true;
      }
    }
    return changed;
  };
  skip () {
    if ( this.typingDone() ) {
      return;
    }
    if ( this.inHold ) {
      this.wait = 0.0;
      this.inHold = false;
      this.dirty = true;
      return;
    }
    this.wait = 0.0;
    while (this.cur < this.lines.length) {
      const l = this.lines[this.cur];
      l.shown = l.text.length;
      this.cur = this.cur + 1;
      if ( l.hold >= 700 ) {
        this.wait = l.hold;
        this.inHold = true;
        this.dirty = true;
        return;
      }
    };
    this.dirty = true;
  };
  skipAll () {
    while (this.cur < this.lines.length) {
      const l = this.lines[this.cur];
      l.shown = l.text.length;
      this.cur = this.cur + 1;
    };
    this.wait = 0.0;
    this.inHold = false;
    this.dirty = true;
  };
  start () {
    this.showMenu();
  };
  pad2 (n) {
    if ( n < 10 ) {
      return "0" + (n.toString());
    }
    return (n.toString());
  };
  showMenu () {
    this.mode = 0;
    this.phase = 0;
    this.numBuf = "";
    this.clearScreen();
    if ( this.booted == false ) {
      this.booted = true;
      this.emit(
        "ln dim",
        "KOODISAMPO OY  PÄÄTE KS-80  ROM 1.07",
        18,
        22,
        250,
        -1
      );
      this.emit("ln dim", "MUISTITESTI ........ 640K OK", 16, 20, 350, -1);
      const total = this.questions.length;
      this.emit(
        "ln dim",
        ((("KYSYMYSPANKIT ...... " + (this.topics.length.toString())) + " KPL, ") + (total.toString())) + " KYSYMYSTÄ",
        16,
        20,
        500,
        -1
      );
      this.gap(150);
    }
    this.emit("ln q", "VALITSE AIHE:", 30, 30, 250, -1);
    this.gap(0);
    this.emit(
      "ln menu",
      ("[00] KAIKKI AIHEET SEKAISIN (" + (this.questions.length.toString())) + ")",
      3,
      4,
      40,
      0
    );
    let i = 0;
    const n = this.topics.length;
    while (i < n) {
      const t = this.topics[i];
      this.emit(
        "ln menu",
        ((((("[" + this.pad2((i + 1))) + "] ") + t.title) + " (") + (t.count.toString())) + ")",
        3,
        4,
        40,
        i + 1
      );
      i = i + 1;
    };
    this.gap(0);
    this.prompt();
    if ( this.menuSel > n ) {
      this.menuSel = 0;
    }
  };
  topicName () {
    if ( this.topicSel < 0 ) {
      return "KAIKKI AIHEET";
    }
    const t = this.topics[this.topicSel];
    return t.title;
  };
  startRound (choice) {
    this.topicSel = choice - 1;
    this.deck.length = 0;
    let i = 0;
    const n = this.questions.length;
    while (i < n) {
      const q = this.questions[i];
      if ( this.topicSel < 0 || q.topic == this.topicSel ) {
        if ( q.choices.length > 1 ) {
          this.deck.push(i);
        }
      }
      i = i + 1;
    };
    if ( this.deck.length == 0 ) {
      return;
    }
    this.shuffle(this.deck);
    this.roundLen = 10;
    if ( this.deck.length < this.roundLen ) {
      this.roundLen = this.deck.length;
    }
    this.roundPos = 0;
    this.score = 0;
    this.answered = 0;
    this.showQuestion();
  };
  readingMs (text) {
    let ms = 1300 + text.length * 30;
    if ( ms < 1800 ) {
      ms = 1800;
    }
    if ( ms > 7000 ) {
      ms = 7000;
    }
    return ms;
  };
  showQuestion () {
    this.mode = 1;
    this.phase = 0;
    this.lessonNow = "";
    this.clearScreen();
    this.qIndex = this.deck[this.roundPos];
    const q = this.questions[this.qIndex];
    const t = this.topics[q.topic];
    this.emit(
      "ln dim",
      (((("KYSYMYS " + this.pad2((this.roundPos + 1))) + "/") + this.pad2(this.roundLen)) + "  ·  ") + t.title,
      0,
      0,
      350,
      -1
    );
    this.gap(200);
    this.qLine = this.emit(
      "ln q",
      q.prompt,
      34,
      46,
      this.readingMs(q.prompt),
      -1
    );
    this.gap(0);
    this.order.length = 0;
    this.choiceLines.length = 0;
    let i = 0;
    const n = q.choices.length;
    while (i < n) {
      this.order.push(i);
      i = i + 1;
    };
    this.shuffle(this.order);
    i = 0;
    while (i < n) {
      const ci = this.order[i];
      const label = (("[" + ((i + 1).toString())) + "] ") + q.choices[ci];
      this.choiceLines.push(this.emit("ln choice", label, 9, 12, 160, i));
      i = i + 1;
    };
    this.gap(0);
    this.prompt();
  };
  answer (slot) {
    const q = this.questions[this.qIndex];
    if ( slot < 0 || slot >= this.order.length ) {
      return;
    }
    this.phase = 2;
    this.answered = this.answered + 1;
    const picked = this.order[slot];
    let rightSlot = 0;
    let i = 0;
    while (i < this.order.length) {
      if ( this.order[i] == q.correct ) {
        rightSlot = i;
      }
      i = i + 1;
    };
    if ( this.promptLine >= 0 ) {
      const p = this.lines[this.promptLine];
      p.text = "> " + ((slot + 1).toString());
      p.shown = p.text.length;
    }
    const right = this.lines[this.choiceLines[rightSlot]];
    right.cls = "ln choice right";
    this.gap(250);
    if ( picked == q.correct ) {
      this.score = this.score + 1;
      this.emit("ln ok", "*** OIKEIN ***", 45, 30, 300, -1);
      if ( q.okText.length > 0 ) {
        this.emit("ln fb", q.okText, 16, 18, 250, -1);
      }
    } else {
      const bad = this.lines[this.choiceLines[slot]];
      bad.cls = "ln choice bad";
      this.emit(
        "ln err",
        ("*** VÄÄRIN ***  OIKEA VASTAUS: [" + ((rightSlot + 1).toString())) + "]",
        40,
        30,
        300,
        -1
      );
      if ( q.badText.length > 0 ) {
        this.emit("ln fb", q.badText, 16, 18, 250, -1);
      }
    }
    this.lessonNow = q.lessonUrl;
    if ( q.lessonUrl.length > 0 ) {
      this.gap(0);
      let label = "LUE OPPITUNTI JA SELITYS  [L]";
      if ( this.coarse ) {
        label = "LUE OPPITUNTI JA SELITYS";
      }
      const li = this.emit("ln", label, 12, 10, 0, -1);
      const ll = this.lines[li];
      ll.link = q.lessonUrl;
    }
    this.gap(0);
    if ( this.roundPos + 1 < this.roundLen ) {
      this.emit("ln dim", "[ENTER] SEURAAVA KYSYMYS", 12, 10, 0, -1);
    } else {
      this.emit("ln dim", "[ENTER] TULOKSET", 12, 10, 0, -1);
    }
    this.prompt();
  };
  nextQuestion () {
    this.roundPos = this.roundPos + 1;
    if ( this.roundPos < this.roundLen ) {
      this.showQuestion();
    } else {
      this.showSummary();
    }
  };
  showSummary () {
    this.mode = 2;
    this.phase = 0;
    this.clearScreen();
    this.emit(
      "ln dim",
      "KIERROS PÄÄTTYI  ·  " + this.topicName(),
      0,
      0,
      300,
      -1
    );
    this.gap(200);
    this.emit(
      "ln q",
      (("OIKEIN " + (this.score.toString())) + " / ") + (this.roundLen.toString()),
      60,
      40,
      300,
      -1
    );
    let bar = "[";
    let i = 0;
    while (i < this.roundLen) {
      if ( i < this.score ) {
        bar = bar + "#";
      } else {
        bar = bar + ".";
      }
      i = i + 1;
    };
    bar = bar + "]";
    this.emit("ln", bar, 40, 10, 300, -1);
    this.gap(100);
    let msg = "HARJOITUS TEKEE MESTARIN. KOKEILE UUDESTAAN.";
    if ( this.score * 10 >= this.roundLen * 5 ) {
      msg = "HYVÄ SUORITUS. PERUSASIAT OVAT HALLUSSA.";
    }
    if ( this.score * 10 >= this.roundLen * 8 ) {
      msg = "ERINOMAISTA. JÄRJESTELMÄ ON VAIKUTTUNUT.";
    }
    if ( this.score == this.roundLen ) {
      msg = "TÄYDET PISTEET. SAMPO JAUHAA SINULLE KULTAA.";
    }
    this.emit("ln fb", msg, 28, 30, 400, -1);
    this.gap(0);
    this.emit("ln dim", "[ENTER] UUSI KIERROS SAMASTA AIHEESTA", 10, 8, 0, -1);
    this.emit("ln dim", "[ESC]   AIHEVALIKKO", 10, 8, 0, -1);
    this.prompt();
  };
  digitOf (k) {
    if ( k.length != 1 ) {
      return -1;
    }
    const c = k.charCodeAt(0 );
    if ( c >= 48 && c <= 57 ) {
      return c - 48;
    }
    return -1;
  };
  setPromptText (t) {
    if ( this.promptLine >= 0 ) {
      const p = this.lines[this.promptLine];
      p.text = "> " + t;
      p.shown = p.text.length;
      this.dirty = true;
    }
  };
  pickMenu (v) {
    if ( v < 0 || v > this.topics.length ) {
      this.numBuf = "";
      this.setPromptText("?");
      return;
    }
    this.menuSel = v;
    this.startRound(v);
  };
  keyDown (k) {
    this.dirty = true;
    this.idleMs = 0.0;
    if ( k == "t" || k == "T" ) {
      this.theme = (this.theme + 1) % 3;
      return true;
    }
    if ( ((k == "l" || k == "L") && this.mode == 1) && this.phase == 2 ) {
      if ( this.lessonNow.length > 0 ) {
        this.pendingUrl = this.lessonNow;
      }
      return true;
    }
    if ( k == "o" || k == "O" ) {
      if ( this.studyUrl.length > 0 ) {
        this.pendingUrl = this.studyUrl;
      }
      return true;
    }
    if ( k == "Escape" ) {
      if ( this.mode != 0 ) {
        this.showMenu();
      }
      return true;
    }
    const isGo = k == "Enter" || k == " ";
    if ( this.mode == 0 ) {
      if ( this.typingDone() == false ) {
        if ( isGo ) {
          this.skipAll();
          return true;
        }
        this.skipAll();
      }
      const d = this.digitOf(k);
      if ( d >= 0 ) {
        this.numBuf = this.numBuf + (d.toString());
        this.setPromptText(this.numBuf);
        if ( this.numBuf.length >= 2 ) {
          const v = ((isNaN( parseInt(this.numBuf) ) ? undefined : parseInt(this.numBuf)) ?? -1);
          this.numBuf = "";
          this.pickMenu(v);
        }
        return true;
      }
      if ( k == "Backspace" ) {
        this.numBuf = "";
        this.setPromptText("");
        return true;
      }
      if ( k == "ArrowDown" ) {
        this.menuSel = (this.menuSel + 1) % (this.topics.length + 1);
        return true;
      }
      if ( k == "ArrowUp" ) {
        this.menuSel = this.menuSel - 1;
        if ( this.menuSel < 0 ) {
          this.menuSel = this.topics.length;
        }
        return true;
      }
      if ( isGo ) {
        if ( this.numBuf.length > 0 ) {
          const v2 = ((isNaN( parseInt(this.numBuf) ) ? undefined : parseInt(this.numBuf)) ?? -1);
          this.numBuf = "";
          this.pickMenu(v2);
        } else {
          this.pickMenu(this.menuSel);
        }
        return true;
      }
      return false;
    }
    if ( this.mode == 1 ) {
      if ( this.phase == 0 ) {
        if ( this.typingDone() == false ) {
          if ( isGo ) {
            this.skip();
            return true;
          }
          const early = this.answerSlot(k);
          if ( early >= 0 ) {
            const wasRead = this.cur > this.qLine;
            this.skipAll();
            if ( wasRead ) {
              this.answer(early);
            }
          }
          return true;
        }
        const slot = this.answerSlot(k);
        if ( slot >= 0 ) {
          this.answer(slot);
          return true;
        }
        return false;
      }
      if ( isGo ) {
        if ( this.typingDone() == false ) {
          this.skipAll();
        } else {
          this.nextQuestion();
        }
        return true;
      }
      return false;
    }
    if ( isGo ) {
      if ( this.typingDone() == false ) {
        this.skipAll();
      } else {
        this.startRound(this.topicSel + 1);
      }
      return true;
    }
    return false;
  };
  answerSlot (k) {
    const n = this.order.length;
    const d = this.digitOf(k);
    if ( d >= 1 && d <= n ) {
      return d - 1;
    }
    if ( k.length == 1 ) {
      const c = k.charCodeAt(0 );
      if ( c >= 97 && c < 97 + n ) {
        return c - 97;
      }
      if ( c >= 65 && c < 65 + n ) {
        return c - 65;
      }
    }
    return -1;
  };
  tap (x, y) {
    let j = 0;
    while (j < this.linkUrl.length) {
      if ( ((x >= this.linkX0[j] && x < this.linkX1[j]) && y >= this.linkY0[j]) && y < this.linkY1[j] ) {
        this.pendingUrl = this.linkUrl[j];
        return true;
      }
      j = j + 1;
    };
    let hit = -1;
    let i = 0;
    while (i < this.hitV.length) {
      if ( y >= this.hitY0[i] && y < this.hitY1[i] ) {
        hit = this.hitV[i];
      }
      i = i + 1;
    };
    if ( this.mode == 0 && hit >= 0 ) {
      if ( this.typingDone() ) {
        this.pickMenu(hit);
        return true;
      }
    }
    if ( (this.mode == 1 && this.phase == 0) && hit >= 0 ) {
      if ( this.typingDone() ) {
        this.answer(hit);
        return true;
      }
    }
    return this.keyDown("Enter");
  };
  fg () {
    if ( this.theme == 1 ) {
      return "#ffb000";
    }
    if ( this.theme == 2 ) {
      return "#e6f0ff";
    }
    return "#41ff70";
  };
  dim () {
    if ( this.theme == 1 ) {
      return "#a86a00";
    }
    if ( this.theme == 2 ) {
      return "#7f8ea8";
    }
    return "#1f9c45";
  };
  bg () {
    if ( this.theme == 1 ) {
      return "#140b02";
    }
    if ( this.theme == 2 ) {
      return "#0a0d14";
    }
    return "#031207";
  };
  glowRgb (ch) {
    if ( this.theme == 1 ) {
      if ( ch == 0 ) {
        return "1.0";
      }
      if ( ch == 1 ) {
        return "0.69";
      }
      return "0.0";
    }
    if ( this.theme == 2 ) {
      if ( ch == 2 ) {
        return "1.0";
      }
      return "0.9";
    }
    if ( ch == 1 ) {
      return "1.0";
    }
    if ( ch == 0 ) {
      return "0.25";
    }
    return "0.44";
  };
  themeName () {
    if ( this.theme == 1 ) {
      return "amber";
    }
    if ( this.theme == 2 ) {
      return "white";
    }
    return "green";
  };
  css () {
    const fg = this.fg();
    const dm = this.dim();
    const bg = this.bg();
    let s = "";
    s = s + ".screen { display: flex; flex-direction: column; align-items: center;";
    s = s + " width: 100vw; height: 100vh; padding: 30px 44px;";
    s = ((s + " font-family: VT323; background-color: ") + bg) + ";";
    s = s + " evg-surface-effect: moire; evg-effect-on: always;";
    s = s + " evg-fx-strength: 0.1; evg-fx-glow: 0.06; evg-fx-period: 3.2;";
    s = s + " evg-fx-skew: 2.2; evg-fx-speed: 0.05;";
    s = ((((((s + " evg-fx-r: ") + this.glowRgb(0)) + "; evg-fx-g: ") + this.glowRgb(1)) + "; evg-fx-b: ") + this.glowRgb(2)) + " }\n";
    s = s + ".col { display: flex; flex-direction: column; width: 100%;";
    s = s + " max-width: 1080px; height: 100%; gap: 12px }\n";
    s = s + ".top { display: flex; flex-direction: row; width: 100%; gap: 16px }\n";
    s = ((s + ".brand { font-size: 24px; color: ") + fg) + " }\n";
    s = s + ".spacer { flex: 1 }\n";
    s = ((s + ".status { font-size: 24px; color: ") + dm) + " }\n";
    s = ((s + ".rule { width: 100%; height: 2px; background-color: ") + dm) + " }\n";
    s = s + ".body { display: flex; flex-direction: column; width: 100%;";
    s = s + " padding-top: 10px; gap: 2px }\n";
    s = ((s + ".ln { width: 100%; font-size: 32px; line-height: 1.12; color: ") + fg) + " }\n";
    s = ((s + ".dim { color: ") + dm) + " }\n";
    s = ((s + ".q { color: ") + fg) + " }\n";
    s = s + ".choice { padding: 2px 8px }\n";
    s = s + ".menu { padding: 0px 8px }\n";
    s = ((((s + ".sel { background-color: ") + fg) + "; color: ") + bg) + " }\n";
    s = ((((s + ".right { background-color: ") + fg) + "; color: ") + bg) + " }\n";
    s = ((s + ".bad { color: ") + dm) + " }\n";
    s = ((s + ".ok { color: ") + fg) + " }\n";
    s = ((s + ".err { color: ") + fg) + " }\n";
    s = ((s + ".fb { color: ") + fg) + " }\n";
    s = ((s + ".foot { font-size: 20px; color: ") + dm) + "; flex: 1 }\n";
    s = s + ".footrow { display: flex; flex-direction: row; width: 100%; gap: 16px;";
    s = s + " align-items: flex-start }\n";
    s = s + ".linkrow { display: flex; flex-direction: row }\n";
    s = s + ".linkbox { display: flex; flex-direction: column }\n";
    s = ((s + ".lnk { font-size: 32px; line-height: 1.12; color: ") + fg) + " }\n";
    s = ((s + ".flnk { font-size: 20px; color: ") + fg) + " }\n";
    s = ((s + ".uline { width: 100%; height: 2px; background-color: ") + fg) + " }\n";
    s = s + "@media (max-width: 760px) {\n";
    s = s + "  .screen { padding: 16px 16px }\n";
    s = s + "  .ln { font-size: 25px }\n";
    s = s + "  .brand { font-size: 19px }\n";
    s = s + "  .status { font-size: 19px }\n";
    s = s + "  .foot { font-size: 17px }\n";
    s = s + "  .flnk { font-size: 17px }\n";
    s = s + "  .lnk { font-size: 25px }\n";
    s = s + "}\n";
    s = s + "@media (max-width: 420px) {\n";
    s = s + "  .ln { font-size: 22px }\n";
    s = s + "  .lnk { font-size: 22px }\n";
    s = s + "}\n";
    s = s + "@media (max-height: 560px) {\n";
    s = s + "  .ln { font-size: 22px }\n";
    s = s + "  .lnk { font-size: 22px }\n";
    s = s + "  .screen { padding: 10px 20px }\n";
    s = s + "}\n";
    return s;
  };
  div (cls) {
    const e = EVGElement.createDiv();
    e.className = cls;
    return e;
  };
  span (cls, text) {
    const e = EVGElement.createSpan();
    e.className = cls;
    e.textContent = text;
    return e;
  };
  cursorLine () {
    const n = this.lines.length;
    if ( n == 0 ) {
      return -1;
    }
    if ( this.cur >= n ) {
      return n - 1;
    }
    const l = this.lines[this.cur];
    if ( l.shown > 0 || this.cur == 0 ) {
      return this.cur;
    }
    return this.cur - 1;
  };
  statusText () {
    if ( this.mode == 1 ) {
      return (((("K " + this.pad2((this.roundPos + 1))) + "/") + this.pad2(this.roundLen)) + "  OIKEIN ") + (this.score.toString());
    }
    if ( this.mode == 2 ) {
      return (("TULOS " + (this.score.toString())) + "/") + (this.roundLen.toString());
    }
    return (this.questions.length.toString()) + " KYSYMYSTÄ";
  };
  footText () {
    if ( this.coarse ) {
      if ( this.mode == 0 ) {
        return "NAPAUTA AIHETTA  ·  T = VÄRI";
      }
      return "NAPAUTA VASTAUSTA TAI JATKA  ·  T = VÄRI";
    }
    if ( this.mode == 0 ) {
      return ("[00-" + this.pad2(this.topics.length)) + "] / NUOLET + ENTER  ·  [O] OPISKELU  ·  [T] VÄRI  ·  [M] ÄÄNI";
    }
    if ( this.mode == 1 ) {
      return "[1-4] VASTAA  ·  [ENTER] OHITA / JATKA  ·  [ESC] VALIKKO  ·  [O] OPISKELU  ·  [T] VÄRI  ·  [M] ÄÄNI";
    }
    return "[ENTER] UUSI KIERROS  ·  [ESC] VALIKKO  ·  [O] OPISKELU  ·  [T] VÄRI";
  };
  linkEl (cls, text) {
    const row = this.div("linkrow");
    const box = this.div("linkbox");
    box.addChild(this.span(cls, text));
    box.addChild(this.div("uline"));
    row.addChild(box);
    return row;
  };
  build (body) {
    const page = this.div("screen");
    const col = this.div("col");
    const top = this.div("top");
    top.addChild(this.span("brand", "KOODISAMPO TERMINAL"));
    top.addChild(this.div("spacer"));
    top.addChild(this.span("status", this.statusText()));
    col.addChild(top);
    col.addChild(this.div("rule"));
    col.addChild(body);
    col.addChild(this.div("rule"));
    const frow = this.div("footrow");
    frow.addChild(this.span("foot", this.footText()));
    if ( this.studyUrl.length > 0 ) {
      const fl = this.linkEl("flnk", "OPISKELUMATERIAALI");
      this.footLink = fl;
      frow.addChild(fl);
    }
    this.footEl = frow;
    col.addChild(frow);
    page.addChild(col);
    return page;
  };
  fillBody (body, shownEls, shownIdx) {
    const cl = this.cursorLine();
    let i = this.scrollFrom;
    const n = this.lines.length;
    while (i < n) {
      const l = this.lines[i];
      if ( i > this.cur || (i == this.cur && l.shown == 0) && i != cl ) {
        return;
      }
      let txt = l.text.substring(0, l.shown );
      if ( i == cl && this.cursorOn ) {
        txt = txt + "█";
      }
      if ( txt.length == 0 ) {
        txt = " ";
      }
      let cls = l.cls;
      if ( ((this.mode == 0 && l.hit >= 0) && l.hit == this.menuSel) && this.typingDone() ) {
        cls = cls + " sel";
      }
      let e = this.span(cls, txt);
      if ( l.link.length > 0 ) {
        e = this.linkEl("lnk", txt);
      }
      body.addChild(e);
      shownEls.push(e);
      shownIdx.push(i);
      i = i + 1;
    };
  };
  render () {
    const sheetText = this.css();
    let guard = 0;
    while (true) {
      const body = this.div("body");
      let els = [];
      let idx = [];
      this.fillBody(body, els, idx);
      const root = this.build(body);
      const sheet = new EVGStyleSheet();
      sheet.parse(sheetText);
      sheet.setViewport(this.pageW, this.pageH, this.coarse);
      sheet.applyTree(root, "");
      const lay = new EVGLayout();
      lay.setPageSize(this.pageW, this.pageH);
      lay.layout(root);
      let overflow = false;
      const ne = els.length;
      if ( ne > 0 && ((typeof(this.footEl) !== "undefined" && this.footEl != null ) ) ) {
        const fe = this.footEl;
        const rbox = root.box;
        const bottom = fe.calculatedY + fe.calculatedHeight;
        const limit = this.pageH - rbox.paddingBottomPx;
        if ( (bottom > limit + 0.5 && this.scrollFrom < this.lines.length - 1) && guard < 60 ) {
          overflow = true;
        }
      }
      if ( overflow ) {
        this.scrollFrom = this.scrollFrom + 1;
        guard = guard + 1;
      } else {
        if ( (typeof(this.footEl) !== "undefined" && this.footEl != null )  ) {
          const fe2 = this.footEl;
          const rbox2 = root.box;
          const free = (this.pageH - rbox2.paddingBottomPx) - (fe2.calculatedY + fe2.calculatedHeight);
          if ( free > 0.5 ) {
            body.height = EVGUnit.px((body.calculatedHeight + free));
            lay.layout(root);
          }
        }
        this.hitY0.length = 0;
        this.hitY1.length = 0;
        this.hitV.length = 0;
        this.linkX0.length = 0;
        this.linkX1.length = 0;
        this.linkY0.length = 0;
        this.linkY1.length = 0;
        this.linkUrl.length = 0;
        if ( (typeof(this.footLink) !== "undefined" && this.footLink != null )  ) {
          const fle = this.footLink;
          this.addLinkRect(fle, this.studyUrl);
        }
        let k = 0;
        while (k < ne) {
          const li = idx[k];
          const l = this.lines[li];
          if ( l.link.length > 0 ) {
            const le = els[k];
            this.addLinkRect(le, l.link);
          }
          if ( l.hit >= 0 ) {
            const e = els[k];
            this.hitY0.push(e.calculatedY);
            this.hitY1.push(e.calculatedY + e.calculatedHeight);
            this.hitV.push(l.hit);
          }
          k = k + 1;
        };
        const dl = new EVGDisplayList();
        dl.setTextEngine(lay.getTextEngine());
        dl.build(root);
        let json = "{\"width\":";
        json = json + EVGDisplayList.num(this.pageW);
        json = (json + ",\"height\":") + EVGDisplayList.num(this.pageH);
        json = ((json + ",\"theme\":\"") + this.themeName()) + "\"";
        json = ((json + ",\"bg\":\"") + this.bg()) + "\"";
        json = (json + ",\"cssErrors\":") + (sheet.errors.length.toString());
        json = ((json + ",\"list\":") + dl.toJson()) + "}";
        return json;
      }
    };
    return "{}";
  };
  linkAt (x, y) {
    let j = 0;
    while (j < this.linkUrl.length) {
      if ( ((x >= this.linkX0[j] && x < this.linkX1[j]) && y >= this.linkY0[j]) && y < this.linkY1[j] ) {
        return true;
      }
      j = j + 1;
    };
    return false;
  };
  currentLesson () {
    return this.lessonNow;
  };
  addLinkRect (row, url) {
    const e = row.getChild(0);
    this.linkX0.push(e.calculatedX - 6.0);
    this.linkX1.push((e.calculatedX + e.calculatedWidth) + 6.0);
    this.linkY0.push(e.calculatedY - 6.0);
    this.linkY1.push((e.calculatedY + e.calculatedHeight) + 6.0);
    this.linkUrl.push(url);
  };
  screenText () {
    let s = "";
    let i = 0;
    const n = this.lines.length;
    while (i < n && i <= this.cur) {
      const l = this.lines[i];
      if ( l.shown > 0 ) {
        s = (s + l.text.substring(0, l.shown )) + "\n";
      }
      i = i + 1;
    };
    return s;
  };
}

;globalThis.KoodisampoTerminal = KoodisampoTerminal;
;globalThis.KoodisampoTerminalModule = { EVGHostTextMeasurer: EVGHostTextMeasurer, EVGDefaultMeasurer: EVGDefaultMeasurer };
})();
