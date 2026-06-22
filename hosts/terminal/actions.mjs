import { sessionMap } from "../shared/sessionMap.mjs";

const USB_CONTENTS = [
  {
    id: "fluff",
    weight: 3,
    message: "USB-tikulla on vain kissavideo ja vanha palkkalista.",
    karma: 0,
  },
  {
    id: "tip",
    weight: 2,
    message: "Tikulla on tiimin C++-tyyliohje — hyödyllinen muistilista (+karma).",
    karma: 4,
  },
  {
    id: "lesson",
    weight: 2,
    message: "Tikulla on linkki lyhyeen modern-cpp-intro -oppituntiin.",
    karma: 2,
    storyId: "modern-cpp-intro",
  },
  {
    id: "virus",
    weight: 1,
    message: "Tikulla on troijalainen — kone kaatuu ja IT hermostuu!",
    karma: -15,
    breakTarget: true,
  },
];

function hashPick(seed, max) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % max;
}

function facingDelta(map) {
  let fx = map.facingX ?? 0;
  let fy = map.facingY ?? 0;
  if (fx === 0 && fy === 0) fy = 1;
  return { fx, fy };
}

export function getActionTargetInFront(session) {
  const map = sessionMap(session);
  if (!map) return null;
  const { fx, fy } = facingDelta(map);
  const tx = map.playerX + fx;
  const ty = map.playerY + fy;
  const entity = map.entityAt(tx, ty);
  if (entity?.id) {
    if (entity.kind === "action" || entity.actionId) {
      return {
        type: "entity",
        id: entity.actionId || entity.id,
        name: entity.name || "Kohde",
        x: tx,
        y: ty,
        char: entity.char,
      };
    }
    if (entity.kind !== "item") return null;
  }
  const tile = map.tileAt(tx, ty);
  if (tile === "K") {
    return { type: "tile", id: "workstation", name: "Työasema", x: tx, y: ty, char: "K" };
  }
  if (tile === "L") {
    return { type: "tile", id: "door", name: "Ovi", x: tx, y: ty, char: "L" };
  }
  if (tile === "+") {
    return { type: "tile", id: "shed_door", name: "Vajan ovi", x: tx, y: ty, char: "+" };
  }
  return null;
}

export function listUsableItems(session) {
  const t = session.tools;
  if (!t) return [];
  const out = [];
  if (t.hasCrowbar) out.push({ id: "crowbar", label: "Vasara (sorkkarauta)" });
  if (t.hasShovel) out.push({ id: "shovel", label: "Lapio" });
  if (t.hasSledgehammer) out.push({ id: "sledgehammer", label: "Kivivasara" });
  if (t.hasUsbDrive) out.push({ id: "usb_drive", label: "USB-tikku" });
  if (t.hasShedKey) out.push({ id: "shed_key", label: "Vajan avain" });
  return out;
}

function hasNearbyWitness(session, radius = 8) {
  const map = sessionMap(session);
  if (!map) return false;
  const ents = map.activeFloor?.()?.entities ?? [];
  for (const e of ents) {
    if (e.offDuty) continue;
    if (
      e.kind === "coworker"
      || e.kind === "role"
      || e.kind === "security"
      || e.kind === "guru"
    ) {
      const dist = Math.abs((e.x ?? 0) - map.playerX) + Math.abs((e.y ?? 0) - map.playerY);
      if (dist > 0 && dist <= radius) return true;
    }
  }
  return false;
}

function pickUsbContent(seed) {
  const total = USB_CONTENTS.reduce((n, x) => n + x.weight, 0);
  let roll = hashPick(seed, total);
  for (const entry of USB_CONTENTS) {
    if (roll < entry.weight) return entry;
    roll -= entry.weight;
  }
  return USB_CONTENTS[0];
}

export function resolveActionApply(session, target, itemId) {
  const map = sessionMap(session);
  const witness = hasNearbyWitness(session);
  const targetId = target?.id || "";

  if (targetId === "workstation") {
    if (itemId === "usb_drive") {
      if (!session.tools?.hasUsbDrive) {
        return { ok: false, message: "Sinulla ei ole USB-tikkua." };
      }
      const content = pickUsbContent(`${target.x},${target.y}:${session.exportDeaths?.() ?? 0}`);
      if (content.breakTarget) {
        map.setTileAt(target.x, target.y, "x");
      }
      let message = content.message;
      if (witness && content.karma < 0) {
        message += " Kollega näkee ruudun — turvallisuus hälytetään!";
        return {
          ok: true,
          message,
          karmaDelta: content.karma,
          misconduct: 18,
          police: true,
        };
      }
      if (witness && content.karma > 0) {
        message += " Kollega nyökkää hyväksyvästi.";
      }
      return {
        ok: true,
        message,
        karmaDelta: content.karma,
        storyId: content.storyId || null,
      };
    }
    if (itemId === "crowbar" || itemId === "sledgehammer" || itemId === "shovel") {
      map.setTileAt(target.x, target.y, "x");
      let message = "Työkalu + työasema = huono idea. Näyttö meni ja karma laskee.";
      let misconduct = itemId === "sledgehammer" ? 22 : 12;
      let karmaDelta = itemId === "sledgehammer" ? -18 : -10;
      if (witness) {
        message += " Joku näki tämän!";
        return { ok: true, message, karmaDelta, misconduct, police: true };
      }
      return { ok: true, message, karmaDelta, misconduct };
    }
    return { ok: false, message: "Tähän työasemaan ei voi käyttää tuota esinettä." };
  }

  if (targetId === "door" || targetId === "shed_door") {
    if (itemId === "shed_key" && targetId === "shed_door") {
      if (!session.tools?.hasShedKey) {
        return { ok: false, message: "Sinulla ei ole vajan avainta." };
      }
      map.openTileAt(target.x, target.y);
      return { ok: true, message: "Avain sopii — vajan ovi aukeaa." };
    }
    if (itemId === "crowbar" || itemId === "sledgehammer") {
      map.openTileAt(target.x, target.y);
      return {
        ok: true,
        message: "Murrat oven auki — melkoinen karma-tappio.",
        karmaDelta: -8,
        misconduct: 10,
        police: witness,
      };
    }
    return { ok: false, message: "Oveen ei saa tuota esinettä kiinnitettyä järkevästi." };
  }

  return { ok: false, message: "Et keksi miten yhdistää esineen ja kohteen." };
}

export function applyActionResult(session, result) {
  if (!result?.ok) return;
  const map = session._map ?? session.map ?? sessionMap(session);
  if (result.karmaDelta > 0) {
    session.karma.add(`action:${Date.now()}`, result.karmaDelta);
  } else if (result.karmaDelta < 0) {
    session.karma.loseKarma(-result.karmaDelta);
  }
  if (result.misconduct) {
    session.conduct.addMisconduct(result.misconduct);
  }
  if (result.police && map?.startPoliceChase) {
    map.startPoliceChase();
  }
  if (result.message && map) {
    map.lastStatus = result.message;
  }
}
