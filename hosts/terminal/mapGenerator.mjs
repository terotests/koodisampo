/**
 * Toimistogeneraattori: käytävät ensin, sitten huonetyypit bay-koloihin.
 * Kerroksen koko vaihtelee (ei aina 100×100).
 */

const FLOOR_COUNT = 10;
const MIN_FLOOR_W = 86;
const MAX_FLOOR_W = 102;
const MIN_FLOOR_H = 72;
const MAX_FLOOR_H = 98;

const STORY_NPCS = [
  { id: "mentor", char: "G", name: "Senior-guru", kind: "guru", storyId: "modern-cpp-intro" },
  { id: "secretary", char: "S", name: "Sihteeri", kind: "role", storyId: "cpp-safety-const" },
  { id: "project-lead", char: "P", name: "Projektipäällikkö", kind: "role", storyId: "cpp-safety-memory" },
  { id: "wandering-ork", char: "o", name: "Kierroksella oleva orkki", kind: "hostile", storyId: "cpp-safety-casts-exceptions" },
  { id: "cto", char: "M", name: "CTO", kind: "hostile", storyId: "vainamoinen-challenge" },
  { id: "vp-engineering", char: "O", name: "VP Engineering", kind: "hostile", storyId: "cpp-safety-variadic" },
];

const COWORKER_FIRST = [
  "Anna", "Mikko", "Laura", "Jussi", "Sari", "Petri", "Emilia", "Antti",
  "Hanna", "Olli", "Tiina", "Markus", "Riikka", "Ville", "Nina", "Kari",
];

const COWORKER_LAST = [
  "Virtanen", "Korhonen", "Mäkinen", "Nieminen", "Laine", "Heikkinen",
  "Koskinen", "Järvinen", "Lehtonen", "Saarinen",
];

const COWORKER_CHARS = "abcdefghijklmnop";

const TOOL_DEFS = [
  { tool: "crowbar", char: "(", name: "Sorkkarauta" },
  { tool: "shovel", char: "/", name: "Lapio" },
  { tool: "sledgehammer", char: "T", name: "Moukarivasara" },
];

const FLOOR_NAMES = [
  "Aula ja vastaanotto",
  "Avokonttori A",
  "Avokonttori B",
  "Kehitysosasto",
  "Testaus ja QA",
  "DevOps-kerros",
  "Tuotehallinta",
  "HR ja compliance",
  "Johtoryhmä",
  "Katto ja datakeskus",
];

/** @typedef {{ x: number, y: number, w: number, h: number }} Bay */
/** @typedef {{ next: () => number }} Rng */

const ROOM_TYPES = {
  cubicle: {
    minW: 6,
    minH: 5,
    agentRange: [1, 1],
    desks(innerW, innerH) {
      return [{ x: 1, y: 1, w: Math.min(3, innerW - 2), h: 1 }];
    },
  },
  pair: {
    minW: 8,
    minH: 6,
    agentRange: [2, 2],
    desks(innerW) {
      return [
        { x: 1, y: 1, w: 2, h: 1 },
        { x: innerW - 4, y: 1, w: 2, h: 1 },
      ];
    },
  },
  team: {
    minW: 10,
    minH: 8,
    agentRange: [3, 5],
    desks(innerW, innerH) {
      const out = [];
      const cols = innerW >= 12 ? 3 : 2;
      const rows = innerH >= 7 ? 2 : 1;
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          out.push({ x: 1 + col * 3, y: 1 + row * 3, w: 2, h: 1 });
        }
      }
      return out;
    },
  },
  meeting: {
    minW: 9,
    minH: 7,
    agentRange: [0, 1],
    table: true,
    desks() {
      return [];
    },
  },
  executive: {
    minW: 12,
    minH: 9,
    agentRange: [1, 1],
    boss: true,
    desks(innerW, innerH) {
      return [{ x: Math.floor(innerW / 2) - 2, y: Math.floor(innerH / 2) - 1, w: 4, h: 2 }];
    },
  },
  utility: {
    minW: 6,
    minH: 5,
    agentRange: [0, 0],
    sealed: true,
    desks() {
      return [];
    },
  },
  nook: {
    minW: 5,
    minH: 5,
    agentRange: [1, 1],
    desks() {
      return [{ x: 1, y: 2, w: 2, h: 1 }];
    },
  },
  open: {
    minW: 12,
    minH: 8,
    agentRange: [2, 4],
    partialWalls: true,
    desks(innerW, innerH) {
      const out = [];
      const cols = Math.max(2, Math.floor(innerW / 4));
      for (let col = 0; col < cols; col += 1) {
        out.push({ x: 1 + col * 3, y: 1 + (col % 2) * 2, w: 2, h: 1 });
        if (innerH >= 6) {
          out.push({ x: 1 + col * 3, y: innerH - 3, w: 2, h: 1 });
        }
      }
      return out;
    },
  },
};

function makeRng(seed) {
  let s = seed >>> 0;
  return {
    next() {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      return s / 0x100000000;
    },
    int(min, max) {
      return min + Math.floor(this.next() * (max - min + 1));
    },
    pick(arr) {
      return arr[Math.floor(this.next() * arr.length)];
    },
  };
}

function makeGrid(w, h, fill = "#") {
  return Array.from({ length: h }, () => Array(w).fill(fill));
}

function carveRect(grid, w, h, x, y, rw, rh, ch = ".") {
  for (let dy = 0; dy < rh; dy += 1) {
    for (let dx = 0; dx < rw; dx += 1) {
      const px = x + dx;
      const py = y + dy;
      if (px > 0 && px < w - 1 && py > 0 && py < h - 1) {
        grid[py][px] = ch;
      }
    }
  }
}

function floorSize(floorIndex, rng) {
  const baseW = MIN_FLOOR_W + (floorIndex * 11) % (MAX_FLOOR_W - MIN_FLOOR_W + 1);
  const baseH = MIN_FLOOR_H + (floorIndex * 9) % (MAX_FLOOR_H - MIN_FLOOR_H + 1);
  return {
    w: Math.min(MAX_FLOOR_W, Math.max(MIN_FLOOR_W, baseW + rng.int(-3, 3))),
    h: Math.min(MAX_FLOOR_H, Math.max(MIN_FLOOR_H, baseH + rng.int(-2, 2))),
  };
}

function carveBuildingShell(grid, w, h, rng) {
  carveRect(grid, w, h, 1, 1, w - 2, h - 2, ".");
  if (rng.next() < 0.35) {
    const cutW = rng.int(8, 16);
    const cutH = rng.int(6, 12);
    const side = rng.int(0, 2);
    if (side === 0) {
      carveRect(grid, w, h, w - cutW - 2, h - cutH - 2, cutW, cutH, "#");
    } else if (side === 1) {
      carveRect(grid, w, h, 2, h - cutH - 2, cutW, cutH, "#");
    } else {
      carveRect(grid, w, h, w - cutW - 2, 2, cutW, cutH, "#");
    }
  }
}

/** Pääkäytävät: kaksi vaakasuuntaista + pystysuuntaiset poikittaiset. */
function carveCorridors(grid, w, h, rng) {
  const spineA = Math.max(4, Math.floor(h * (0.30 + rng.next() * 0.06)));
  const spineB = Math.max(spineA + 8, Math.floor(h * (0.62 + rng.next() * 0.06)));
  const spineYs = [spineA, spineB];
  for (const sy of spineYs) {
    carveRect(grid, w, h, 2, sy - 1, w - 4, 3, ".");
  }

  const vertXs = [];
  let cx = rng.int(14, 22);
  while (cx < w - 16) {
    vertXs.push(cx);
    carveRect(grid, w, h, cx - 1, 2, 3, h - 4, ".");
    cx += rng.int(12, 20);
  }

  const midY = Math.floor((spineA + spineB) / 2);
  const elevX = 5;
  for (let y = 2; y < h - 2; y += 1) {
    grid[y][elevX] = ".";
  }

  return { spineYs, vertXs, midY, elevX };
}

/** Palauta suorakulmiot käytävien välistä tilasta. */
function computeBays(w, h, spineYs, vertXs) {
  const xEdges = [2];
  for (const vx of vertXs) {
    xEdges.push(vx - 2, vx + 2);
  }
  xEdges.push(w - 2);

  const yEdges = [2];
  for (const sy of spineYs) {
    yEdges.push(sy - 2, sy + 2);
  }
  yEdges.push(h - 2);

  /** @type {Bay[]} */
  const bays = [];
  for (let yi = 0; yi + 1 < yEdges.length; yi += 2) {
    for (let xi = 0; xi + 1 < xEdges.length; xi += 2) {
      const x = xEdges[xi] + 1;
      const y = yEdges[yi] + 1;
      const bw = xEdges[xi + 1] - xEdges[xi] - 1;
      const bh = yEdges[yi + 1] - yEdges[yi] - 1;
      if (bw >= 5 && bh >= 4) {
        bays.push({ x, y, w: bw, h: bh });
      }
    }
  }
  return bays;
}

/** Jaa iso bay kahteen pienempään huoneeseen. */
function maybeSplitBay(bay, rng) {
  if (bay.w >= 16 && bay.h >= 8 && rng.next() < 0.38) {
    const splitX = bay.x + Math.floor(bay.w / 2) + rng.int(-1, 1);
    const gap = 2;
    return [
      { x: bay.x, y: bay.y, w: splitX - bay.x - 1, h: bay.h },
      { x: splitX + gap, y: bay.y, w: bay.x + bay.w - splitX - gap, h: bay.h },
    ].filter((b) => b.w >= 5 && b.h >= 4);
  }
  if (bay.h >= 14 && bay.w >= 8 && rng.next() < 0.32) {
    const splitY = bay.y + Math.floor(bay.h / 2) + rng.int(-1, 1);
    const gap = 2;
    return [
      { x: bay.x, y: bay.y, w: bay.w, h: splitY - bay.y - 1 },
      { x: bay.x, y: splitY + gap, w: bay.w, h: bay.y + bay.h - splitY - gap },
    ].filter((b) => b.w >= 5 && b.h >= 4);
  }
  return [bay];
}

function pickRoomType(bay, floorIndex, rng) {
  const area = bay.w * bay.h;
  const types = [];
  for (const [name, spec] of Object.entries(ROOM_TYPES)) {
    if (bay.w >= spec.minW && bay.h >= spec.minH) {
      types.push(name);
    }
  }
  if (types.length === 0) {
    return null;
  }
  if (area >= 130 && floorIndex >= 4 && types.includes("executive") && rng.next() < 0.22) {
    return "executive";
  }
  if (area >= 95 && types.includes("team") && rng.next() < 0.45) {
    return "team";
  }
  if (area >= 70 && types.includes("meeting") && rng.next() < 0.3) {
    return "meeting";
  }
  if (area >= 90 && types.includes("open") && rng.next() < 0.35) {
    return "open";
  }
  if (area >= 28 && area < 55 && types.includes("nook") && rng.next() < 0.4) {
    return "nook";
  }
  if (area >= 48 && types.includes("pair") && rng.next() < 0.5) {
    return "pair";
  }
  if (types.includes("cubicle")) {
    return "cubicle";
  }
  return rng.pick(types);
}

function touchesCorridor(grid, w, h, px, py) {
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
  for (const [dx, dy] of dirs) {
    const nx = px + dx;
    const ny = py + dy;
    if (nx < 0 || ny < 0 || nx >= w || ny >= h) {
      continue;
    }
    if (grid[ny][nx] === ".") {
      return true;
    }
  }
  return false;
}

function carveDoor(grid, w, h, rx, ry, rw, rh, rng) {
  const candidates = [];
  for (let dx = 1; dx < rw - 1; dx += 1) {
    if (touchesCorridor(grid, w, h, rx + dx, ry)) {
      candidates.push({ x: rx + dx, y: ry });
    }
    if (touchesCorridor(grid, w, h, rx + dx, ry + rh - 1)) {
      candidates.push({ x: rx + dx, y: ry + rh - 1 });
    }
  }
  for (let dy = 1; dy < rh - 1; dy += 1) {
    if (touchesCorridor(grid, w, h, rx, ry + dy)) {
      candidates.push({ x: rx, y: ry + dy });
    }
    if (touchesCorridor(grid, w, h, rx + rw - 1, ry + dy)) {
      candidates.push({ x: rx + rw - 1, y: ry + dy });
    }
  }
  if (candidates.length < 1) {
    return;
  }
  const door = candidates[rng.int(0, candidates.length - 1)];
  grid[door.y][door.x] = ".";
}

/**
 * @returns {{ deskTiles: {x:number,y:number}[], type: string, rx: number, ry: number, rw: number, rh: number } | null}
 */
function placeRoomInBay(grid, w, h, bay, typeName, rng, elevX = -1) {
  const type = ROOM_TYPES[typeName];
  if (!type) {
    return null;
  }
  if (elevX >= 0 && bay.x <= elevX && elevX < bay.x + bay.w) {
    return null;
  }
  const margin = bay.w - type.minW >= 3 && bay.h - type.minH >= 3 ? rng.int(0, 2) : 0;
  const rw = Math.min(bay.w - margin * 2, Math.max(type.minW, bay.w - margin * 2 - rng.int(0, 2)));
  const rh = Math.min(bay.h - margin * 2, Math.max(type.minH, bay.h - margin * 2 - rng.int(0, 2)));
  const anchor = rng.int(0, 3);
  let rx = bay.x + Math.floor((bay.w - rw) / 2);
  let ry = bay.y + Math.floor((bay.h - rh) / 2);
  if (anchor === 0) {
    rx = bay.x + margin;
    ry = bay.y + margin;
  } else if (anchor === 1) {
    rx = bay.x + bay.w - rw - margin;
    ry = bay.y + margin;
  } else if (anchor === 2) {
    rx = bay.x + margin;
    ry = bay.y + bay.h - rh - margin;
  } else {
    rx = bay.x + bay.w - rw - margin;
    ry = bay.y + bay.h - rh - margin;
  }

  for (let dy = 0; dy < rh; dy += 1) {
    for (let dx = 0; dx < rw; dx += 1) {
      const px = rx + dx;
      const py = ry + dy;
      const edge = dx === 0 || dy === 0 || dx === rw - 1 || dy === rh - 1;
      grid[py][px] = edge ? "#" : ".";
    }
  }

  carveDoor(grid, w, h, rx, ry, rw, rh, rng);

  if (type.partialWalls && rw >= 10 && rh >= 7) {
    const px = rx + Math.floor(rw / 2);
    for (let py = ry + 2; py < ry + rh - 2; py += 1) {
      if (rng.next() < 0.55) {
        grid[py][px] = "#";
      }
    }
    if (rng.next() < 0.5) {
      grid[ry + Math.floor(rh / 2)][px] = ".";
    }
  }

  if (typeName === "team" && rng.next() < 0.35) {
    grid[ry + Math.floor(rh / 2)][rx + Math.floor(rw / 2)] = "#";
  }

  const innerW = rw - 2;
  const innerH = rh - 2;
  const deskTiles = [];

  if (type.sealed) {
    const innerX = rx + Math.max(1, Math.floor(rw / 2) - 1);
    const innerY = ry + 1;
    grid[innerY][innerX] = "%";
    return { deskTiles, type: typeName, rx, ry, rw, rh };
  }

  if (type.table) {
    const tx = rx + Math.floor(rw / 2);
    const ty = ry + Math.floor(rh / 2);
    grid[ty][tx] = "+";
    for (let dx = -1; dx <= 1; dx += 1) {
      for (let dy = -1; dy <= 1; dy += 1) {
        if (dx === 0 && dy === 0) {
          continue;
        }
        const px = tx + dx;
        const py = ty + dy;
        if (grid[py][px] === ".") {
          grid[py][px] = "=";
          deskTiles.push({ x: px, y: py });
        }
      }
    }
  } else {
    const deskDefs = type.desks(innerW, innerH);
    for (const d of deskDefs) {
      for (let dy = 0; dy < d.h; dy += 1) {
        for (let dx = 0; dx < d.w; dx += 1) {
          const px = rx + 1 + d.x + dx;
          const py = ry + 1 + d.y + dy;
          if (grid[py][px] === ".") {
            grid[py][px] = "=";
            deskTiles.push({ x: px, y: py });
          }
        }
      }
    }
  }

  return { deskTiles, type: typeName, rx, ry, rw, rh };
}

function collectTiles(grid, w, h, ch) {
  const out = [];
  for (let y = 1; y < h - 1; y += 1) {
    for (let x = 1; x < w - 1; x += 1) {
      if (grid[y][x] === ch) {
        out.push({ x, y });
      }
    }
  }
  return out;
}

function pickTile(tiles, used, rng) {
  for (let t = 0; t < 50; t += 1) {
    const p = rng.pick(tiles);
    const key = `${p.x},${p.y}`;
    if (!used.has(key)) {
      used.add(key);
      return p;
    }
  }
  return tiles[0] ?? { x: 8, y: 8 };
}

const CPP_TOPICS = [
  "tools", "style", "safety", "maintainability", "performance", "correctness", "threadability", "portability",
];
const OPS_TOPICS = [
  "scrum-dod", "scrum-dor", "scrum-estimation", "scrum-sprint",
  "systemd", "journald", "linux-network", "avahi", "docker", "docker-network", "docker-volumes",
  "docker-production", "git-workflow", "git-ci", "ops-incident",
];
const DEV_TOPICS = [
  "qt-widgets", "qt-signals", "qt-threading", "qt-models", "qt-opengl", "qt-shaders",
  "js-async", "js-types", "js-modules", "js-runtime", "js-typescript",
  "pg-indexes", "pg-explain", "pg-vacuum", "pg-config",
  "cpp-production", "backend-data", "backend-api", "web-security",
];
const ROOM_TOPIC_BIAS = {
  cubicle: [...CPP_TOPICS, "cpp-production"],
  pair: ["safety", "style", "qt-signals", "js-async", "cpp-production"],
  team: ["maintainability", "safety", "qt-widgets", "pg-indexes", "backend-data"],
  meeting: ["scrum-sprint", "scrum-dor", "scrum-estimation", "git-workflow"],
  executive: ["portability", "pg-explain", "pg-config", "ops-incident"],
  utility: ["systemd", "docker", "docker-volumes", "pg-vacuum", "docker-production", "git-ci"],
  nook: ["tools", "qt-shaders", "qt-opengl", "js-modules", "js-typescript"],
  open: ["maintainability", "performance", "js-types", "qt-threading", "backend-api"],
};

function pickCoworkerTopic(floorIndex, roomType, rng) {
  if (floorIndex === 5 && rng.next() < 0.3) {
    return rng.pick(["systemd", "docker", "docker-network", "journald", "pg-explain"]);
  }
  if (roomType && ROOM_TOPIC_BIAS[roomType] && rng.next() < 0.88) {
    return rng.pick(ROOM_TOPIC_BIAS[roomType]);
  }
  if (rng.next() < 0.65) {
    return rng.pick(CPP_TOPICS);
  }
  if (rng.next() < 0.55) {
    return rng.pick(DEV_TOPICS);
  }
  return rng.pick(OPS_TOPICS);
}

function makeCoworker(id, floorIndex, x, y, rng, opts = {}) {
  return {
    id,
    char: COWORKER_CHARS[rng.int(0, COWORKER_CHARS.length - 1)],
    name: `${rng.pick(COWORKER_FIRST)} ${rng.pick(COWORKER_LAST)}`,
    kind: "coworker",
    topic: opts.topic ?? pickCoworkerTopic(floorIndex, opts.roomType, rng),
    behavior: opts.behavior ?? rng.pick(["wander", "wander", "stationary", "patrol"]),
    sociability: opts.sociability ?? rng.int(25, 95),
    persistence: opts.persistence ?? rng.int(15, 75),
    agenda: opts.agenda ?? (rng.next() < 0.25 ? "socialize" : ""),
    x,
    y,
    isAgent: true,
  };
}

function spawnAgentsAtDesks(entities, floorIndex, deskTiles, count, rng, used, roomType) {
  const shuffled = [...deskTiles];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = rng.int(0, i);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const n = Math.min(count, shuffled.length);
  for (let i = 0; i < n; i += 1) {
    const pos = shuffled[i];
    entities.push(makeCoworker(`coworker-${floorIndex}-${entities.length}`, floorIndex, pos.x, pos.y, rng, { roomType }));
    used.add(`${pos.x},${pos.y}`);
  }
}

function addLobby(grid, w, h, midY) {
  carveRect(grid, w, h, 2, Math.max(2, midY - 10), 14, 8, ".");
  grid[Math.max(3, midY - 8)][10] = "K";
  grid[Math.max(3, midY - 7)][11] = "K";
}

function addPrison(grid, w, h, rng) {
  const px = w - 12;
  const py = rng.int(4, Math.max(5, Math.floor(h / 3)));
  carveRect(grid, w, h, px, py, 8, 6, ".");
  wallRoom(grid, w, h, px, py, 8, 6);
  grid[py + 3][px + 4] = "J";
}

function wallRoom(grid, w, h, x, y, rw, rh) {
  for (let dy = 0; dy < rh; dy += 1) {
    for (let dx = 0; dx < rw; dx += 1) {
      const edge = dx === 0 || dy === 0 || dx === rw - 1 || dy === rh - 1;
      if (edge) {
        const px = x + dx;
        const py = y + dy;
        if (px > 0 && px < w - 1 && py > 0 && py < h - 1) {
          grid[py][px] = "#";
        }
      }
    }
  }
  carveRect(grid, w, h, x + 1, y + 1, rw - 2, rh - 2, ".");
}

function addSealedStorage(grid, w, h, entities, floorIndex, bay, toolIdx, rng) {
  const placed = placeRoomInBay(grid, w, h, bay, "utility", rng, -1);
  if (!placed) {
    return;
  }
  const def = TOOL_DEFS[toolIdx % TOOL_DEFS.length];
  const tx = placed.rx + Math.floor(placed.rw / 2);
  const ty = placed.ry + Math.floor(placed.rh / 2);
  entities.push({
    id: `tool-${floorIndex}-${toolIdx}`,
    char: def.char,
    name: def.name,
    kind: "item",
    itemTool: def.tool,
    x: tx,
    y: ty,
  });
}

function generateFloor(floorIndex, worldSeed = 42) {
  const rng = makeRng(worldSeed + floorIndex * 104729);
  const { w, h } = floorSize(floorIndex, rng);
  const grid = makeGrid(w, h, "#");
  const entities = [];
  const used = new Set();

  carveBuildingShell(grid, w, h, rng);
  const { spineYs, vertXs, midY, elevX } = carveCorridors(grid, w, h, rng);
  addLobby(grid, w, h, midY);
  addPrison(grid, w, h, rng);

  const bays = computeBays(w, h, spineYs, vertXs);
  /** @type {{ deskTiles: {x:number,y:number}[], type: string, rx: number, ry: number, rw: number, rh: number }[]} */
  const rooms = [];
  let executiveRoom = null;

  for (const bay of bays) {
    const subBays = maybeSplitBay(bay, rng);
    for (const sub of subBays) {
      const typeName = pickRoomType(sub, floorIndex, rng);
      if (!typeName) {
        continue;
      }
      const placed = placeRoomInBay(grid, w, h, sub, typeName, rng, elevX);
      if (!placed) {
        continue;
      }
      rooms.push(placed);
      if (typeName === "executive") {
        executiveRoom = placed;
      }
      const spec = ROOM_TYPES[typeName];
      const [minA, maxA] = spec.agentRange;
      const agentCount = minA === maxA ? minA : rng.int(minA, maxA);
      if (agentCount > 0 && placed.deskTiles.length > 0) {
        spawnAgentsAtDesks(entities, floorIndex, placed.deskTiles, agentCount, rng, used, typeName);
      }
    }
  }

  if (floorIndex % 3 === 0 && bays.length > 2) {
    addSealedStorage(grid, w, h, entities, floorIndex, bays[bays.length - 1], floorIndex, rng);
  }

  const openTiles = collectTiles(grid, w, h, ".");
  const deskTiles = collectTiles(grid, w, h, "=");

  const storyNpc = STORY_NPCS[floorIndex % STORY_NPCS.length];
  const storyPos = pickTile(openTiles, used, rng);
  entities.push({
    id: `${storyNpc.id}-${floorIndex}`,
    char: storyNpc.char,
    name: storyNpc.name,
    kind: storyNpc.kind,
    storyId: storyNpc.storyId,
    behavior: "patrol",
    sociability: 60,
    persistence: 50,
    agenda: "",
    x: storyPos.x,
    y: storyPos.y,
    isAgent: true,
  });

  if (floorIndex >= 2) {
    const secPos = pickTile(openTiles, used, rng);
    entities.push({
      id: `security-${floorIndex}`,
      char: "!",
      name: "Turvallisuus",
      kind: "security",
      behavior: "seek_player",
      sociability: 10,
      persistence: 85,
      agenda: "arrest",
      x: secPos.x,
      y: secPos.y,
      isAgent: true,
    });
  }

  if (floorIndex >= 4) {
    let bossPos;
    if (executiveRoom && executiveRoom.deskTiles.length > 0) {
      bossPos = executiveRoom.deskTiles[0];
    } else if (deskTiles.length > 0) {
      bossPos = pickTile(deskTiles, used, rng);
    } else {
      bossPos = pickTile(openTiles, used, rng);
    }
    entities.push({
      id: `ceo-${floorIndex}`,
      char: "C",
      name: "Toimitusjohtaja",
      kind: "role",
      storyId: floorIndex >= 7 ? "vainamoinen-challenge" : "",
      behavior: "seek_player",
      sociability: 85,
      persistence: 92,
      agenda: "seek_larry",
      x: bossPos.x,
      y: bossPos.y,
      isAgent: true,
    });
    used.add(`${bossPos.x},${bossPos.y}`);
  }

  if (floorIndex >= 6) {
    const extra = STORY_NPCS[(floorIndex + 2) % STORY_NPCS.length];
    const ep = pickTile(openTiles, used, rng);
    entities.push({
      id: `${extra.id}-b-${floorIndex}`,
      char: extra.char,
      name: extra.name,
      kind: extra.kind,
      storyId: extra.storyId,
      behavior: "wander",
      sociability: 55,
      persistence: 40,
      agenda: "socialize",
      x: ep.x,
      y: ep.y,
      isAgent: true,
    });
  }

  const targetCoworkers = 12 + (floorIndex % 5) * 2;
  while (entities.filter((e) => e.kind === "coworker").length < targetCoworkers && deskTiles.length > 0) {
    const pos = pickTile(deskTiles, used, rng);
    entities.push(makeCoworker(`coworker-${floorIndex}-${entities.length}`, floorIndex, pos.x, pos.y, rng));
  }

  for (let y = midY - 7; y <= midY + 7; y += 1) {
    if (y > 1 && y < h - 2) {
      grid[y][elevX] = "E";
    }
  }

  const spawnX = elevX + 3;
  const spawnY = midY;
  grid[spawnY][spawnX] = ".";

  const rows = grid.map((row) => ({ line: row.join("") }));
  return {
    id: `floor-${floorIndex}`,
    title: `${floorIndex + 1}. kerros — ${FLOOR_NAMES[floorIndex] ?? "Toimisto"}`,
    width: w,
    height: h,
    rows,
    entities,
    spawn: { x: spawnX, y: spawnY },
  };
}

export function generateCorporateHq(worldSeed = 42) {
  const floors = [];
  let maxW = 0;
  let maxH = 0;
  for (let i = 0; i < FLOOR_COUNT; i += 1) {
    const floor = generateFloor(i, worldSeed);
    floors.push(floor);
    maxW = Math.max(maxW, floor.width);
    maxH = Math.max(maxH, floor.height);
  }
  return {
    id: "corporate-hq-gen",
    title: "Corporate HQ",
    startFloor: 0,
    mapWidth: maxW,
    mapHeight: maxH,
    playerAlias: "Larry",
    floors,
  };
}

export const MAP_DIMENSIONS = {
  minWidth: MIN_FLOOR_W,
  maxWidth: MAX_FLOOR_W,
  minHeight: MIN_FLOOR_H,
  maxHeight: MAX_FLOOR_H,
  width: MAX_FLOOR_W,
  height: MAX_FLOOR_H,
  floors: FLOOR_COUNT,
};
