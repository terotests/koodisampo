/**
 * Uniikit kerrospohjat intro-maailmaan.
 * Jokaisella kerroksella eri arkkitehtuuri, käytäväverkko ja huoneiden muodot.
 */

export const INTRO_W = 88;
export const INTRO_H = 32;

const STAFF_POOL = [
  ["Anna", "Virtanen"], ["Mikko", "Korhonen"], ["Laura", "Mäkinen"], ["Jussi", "Nieminen"],
  ["Sari", "Laine"], ["Petri", "Heikkinen"], ["Emilia", "Koskinen"], ["Antti", "Järvinen"],
  ["Hanna", "Lehtonen"], ["Olli", "Saarinen"], ["Tiina", "Rantanen"], ["Markus", "Salonen"],
  ["Riikka", "Tuominen"], ["Ville", "Ahonen"], ["Nina", "Kallio"], ["Kari", "Mattila"],
];

const LEAD_CHARS = ["P", "S", "O", "M", "T", "H", "I", "D"];

const TOPICS = {
  dev: ["tools", "style", "safety", "maintainability", "cpp-production"],
  qa: ["correctness", "threadability", "performance", "git-ci"],
  ops: ["systemd", "docker", "docker-network", "journald", "ops-incident"],
  product: ["scrum-sprint", "scrum-dor", "scrum-estimation", "backend-api"],
  hr: ["web-security", "git-workflow", "scrum-team"],
  finance: ["pg-config", "pg-explain", "backend-data"],
  it: ["linux-network", "avahi", "pg-vacuum"],
};

function inBounds(x, y) {
  return x > 0 && x < INTRO_W - 1 && y > 0 && y < INTRO_H - 1;
}

function mkGrid(fill = ".") {
  return Array.from({ length: INTRO_H }, () => Array(INTRO_W).fill(fill));
}

function border(grid) {
  for (let y = 0; y < INTRO_H; y += 1) {
    for (let x = 0; x < INTRO_W; x += 1) {
      if (y === 0 || y === INTRO_H - 1 || x === 0 || x === INTRO_W - 1) grid[y][x] = "#";
    }
  }
}

function rect(grid, x, y, w, h, ch) {
  for (let dy = 0; dy < h; dy += 1) {
    for (let dx = 0; dx < w; dx += 1) {
      const px = x + dx;
      const py = y + dy;
      if (inBounds(px, py)) grid[py][px] = ch;
    }
  }
}

function carveOpen(grid, x, y, w, h) {
  rect(grid, x, y, w, h, ".");
}

/** Suorakulmiohuone oviaukolla. */
function wallRoom(grid, x, y, w, h, doorSide = "south", doorOffset = 0) {
  for (let dy = 0; dy < h; dy += 1) {
    for (let dx = 0; dx < w; dx += 1) {
      const px = x + dx;
      const py = y + dy;
      const edge = dx === 0 || dy === 0 || dx === w - 1 || dy === h - 1;
      grid[py][px] = edge ? "#" : ".";
    }
  }
  const midX = x + Math.floor(w / 2) + doorOffset;
  const midY = y + Math.floor(h / 2) + doorOffset;
  if (doorSide === "none") return;
  if (doorSide === "south") grid[y + h - 1][midX] = ".";
  if (doorSide === "north") grid[y][midX] = ".";
  if (doorSide === "east") grid[midY][x + w - 1] = ".";
  if (doorSide === "west") grid[midY][x] = ".";
}

/** L-muotoinen huone (kaksi siipeä). */
function wallLRoom(grid, ox, oy, mainW, mainH, legW, legH, doorSide = "south") {
  wallRoom(grid, ox, oy, mainW, mainH, "none");
  wallRoom(grid, ox + mainW - 1, oy + mainH - 2, legW, legH, "none");
  carveOpen(grid, ox + 1, oy + 1, mainW - 2, mainH - 2);
  carveOpen(grid, ox + mainW, oy + mainH - 1, legW - 1, legH - 2);
  const doorX = ox + Math.floor(mainW / 2);
  const doorY = oy + mainH + legH - 3;
  if (doorSide === "south" && inBounds(doorX, doorY)) grid[doorY][doorX] = ".";
  if (doorSide === "west" && inBounds(ox, oy + Math.floor(mainH / 2))) grid[oy + Math.floor(mainH / 2)][ox] = ".";
}

/** Vain osa seinistä — avokonttori-/pod-alue. */
function partialWalls(grid, x, y, w, h, sides = { north: true, south: false, east: true, west: false }) {
  carveOpen(grid, x, y, w, h);
  if (sides.north) for (let dx = 0; dx < w; dx += 1) grid[y][x + dx] = "#";
  if (sides.south) for (let dx = 0; dx < w; dx += 1) grid[y + h - 1][x + dx] = "#";
  if (sides.west) for (let dy = 0; dy < h; dy += 1) grid[y + dy][x] = "#";
  if (sides.east) for (let dy = 0; dy < h; dy += 1) grid[y + dy][x + w - 1] = "#";
  const gapX = x + Math.floor(w / 2);
  if (sides.south) grid[y + h - 1][gapX] = ".";
  if (sides.north) grid[y][gapX] = ".";
}

/** Vaakasuuntainen käytävä. */
function hCorridor(grid, y, x1, x2, width = 3) {
  rect(grid, x1, y - Math.floor(width / 2), x2 - x1 + 1, width, ".");
}

/** Pystysuuntainen käytävä. */
function vCorridor(grid, x, y1, y2, width = 3) {
  rect(grid, x - Math.floor(width / 2), y1, width, y2 - y1 + 1, ".");
}

/** Yhdistää kaksi pistettä L-muotoisella käytävällä. */
function linkPath(grid, x1, y1, x2, y2, width = 3) {
  hCorridor(grid, y1, Math.min(x1, x2), Math.max(x1, x2), width);
  vCorridor(grid, x2, Math.min(y1, y2), Math.max(y1, y2), width);
}

function placeElevator(grid, x, y) {
  for (let sy = y - 10; sy < y; sy += 1) {
    if (inBounds(x, sy)) grid[sy][x] = ".";
  }
  grid[y][x - 1] = "#";
  grid[y][x] = "E";
  grid[y][x + 1] = "#";
  return { x, y };
}

function desks(grid, x, y, cols, rows, gapX = 4, gapY = 3) {
  const positions = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const px = x + col * gapX;
      const py = y + row * gapY;
      if (px < INTRO_W - 2 && py < INTRO_H - 2) {
        grid[py][px] = "=";
        grid[py][px + 1] = "=";
        positions.push({ x: px, y: py });
      }
    }
  }
  return positions;
}

function diningTables(grid, x, y, cols, rows, gapX = 5, gapY = 4) {
  const positions = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const px = x + col * gapX;
      const py = y + row * gapY;
      if (px + 2 < INTRO_W - 1 && py + 1 < INTRO_H - 1) {
        grid[py][px] = "=";
        grid[py][px + 1] = "=";
        grid[py + 1][px] = "=";
        grid[py + 1][px + 1] = "=";
        positions.push({ x: px, y: py });
      }
    }
  }
  return positions;
}

function meetingTable(grid, cx, cy) {
  if (!inBounds(cx, cy)) return { x: cx, y: cy };
  grid[cy][cx] = "+";
  for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const px = cx + dx;
    const py = cy + dy;
    if (grid[py]?.[px] === ".") grid[py][px] = "=";
  }
  return { x: cx, y: cy };
}

function pillars(grid, x, y, cols, rows, gapX = 8, gapY = 5) {
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const px = x + col * gapX;
      const py = y + row * gapY;
      if (inBounds(px, py)) grid[py][px] = "#";
    }
  }
}

function staffEntity(id, name, x, y, scheduleRole = "staff", topic = "tools") {
  return {
    id, char: "c", name, kind: "coworker", x, y, homeX: x, homeY: y, scheduleRole, topic,
  };
}

function itemEntity(id, char, name, tool, x, y) {
  return { id, char, name, kind: "item", itemTool: tool, x, y };
}

function leadEntity(floorNum, name, x, y, extra = {}) {
  return {
    id: `lead-f${floorNum}`,
    char: LEAD_CHARS[floorNum - 3] ?? "P",
    name,
    kind: "role",
    x, y, homeX: x, homeY: y,
    scheduleRole: "staff",
    ...extra,
  };
}

function securityEntity(floorNum, x, y) {
  return {
    id: `security-f${floorNum}`,
    char: "!",
    name: "Turvallisuus",
    kind: "security",
    x, y, homeX: x, homeY: y,
    scheduleRole: "staff",
    behavior: "seek_player",
    isAgent: 1,
  };
}

function pickStaff(base, i) {
  const [first, last] = STAFF_POOL[(base + i) % STAFF_POOL.length];
  return `${first} ${last}`;
}

function spawnCoworkers(deskPositions, floorNum, base, topicPool, startId = 1) {
  return deskPositions.slice(0, 8).map((pos, i) => staffEntity(
    `staff-f${floorNum}-${startId + i}`,
    pickStaff(base, i),
    pos.x, pos.y,
    i === 1 ? "desk_lunch" : "staff",
    topicPool[i % topicPool.length],
  ));
}

function finalizeFloor(id, title, grid, entities, elev, extra = {}) {
  border(grid);
  placeElevator(grid, elev.x, elev.y);
  return {
    id,
    title,
    rows: grid.map((row) => ({ line: row.join("") })),
    entities,
    spawn: { x: elev.x, y: elev.y },
    ...extra,
  };
}

// ─── Kerros 2: jaettu laatta — avokonttori | ruokala ───────────────────────

export function buildOfficeCafeteriaFloor() {
  const grid = mkGrid();
  const elev = { x: 8, y: INTRO_H - 5 };

  carveOpen(grid, 3, 3, 48, 20);
  wallRoom(grid, 3, 3, 48, 20, "none");
  grid[22][27] = ".";

  carveOpen(grid, 53, 3, 32, 24);
  wallRoom(grid, 53, 3, 32, 24, "west");
  grid[14][53] = ".";

  hCorridor(grid, 22, 3, 84, 3);
  linkPath(grid, elev.x, elev.y, 27, 22);

  const officeDesks = desks(grid, 8, 6, 5, 3, 5, 4);
  meetingTable(grid, 26, 11);
  diningTables(grid, 58, 6, 4, 4, 5, 4);
  rect(grid, 58, 22, 22, 2, "=");
  grid[23][66] = "K";
  grid[23][70] = "K";
  grid[23][74] = "K";

  const entities = [
    {
      id: "hr-greeter",
      char: "H",
      name: "HR — Liisa",
      kind: "role",
      x: 12,
      y: 24,
      behavior: "seek_player",
      agenda: "welcome_hr",
      sociability: 90,
      isAgent: 1,
      offDuty: 1,
    },
    {
      id: "mentor", char: "G", name: "Senior-guru", kind: "guru",
      x: 12, y: 5, homeX: 12, homeY: 5, scheduleRole: "mentor",
    },
    staffEntity("staff-f2-1", "Maija", officeDesks[0]?.x ?? 8, officeDesks[0]?.y ?? 6, "staff", "tools"),
    staffEntity("staff-f2-2", "Pekka", officeDesks[1]?.x ?? 13, officeDesks[1]?.y ?? 6, "desk_lunch", "cpp-auto"),
    staffEntity("staff-f2-3", "Jarmo", officeDesks[2]?.x ?? 18, officeDesks[2]?.y ?? 6, "staff", "style"),
    ...spawnCoworkers(officeDesks.slice(3), 2, 3, ["maintainability", "performance", "safety", "style", "tools"]),
  ];

  return finalizeFloor("offices", "2. kerros — Avokonttori", grid, entities, elev, {
    cafeteria: { x: 68, y: 14 },
  });
}

// ─── Kerros 3: avostudio — saarekkeet, vähän seinää ────────────────────────

function buildDevFloor(floorNum, title) {
  const grid = mkGrid();
  const elev = { x: 78, y: INTRO_H - 5 };

  carveOpen(grid, 3, 3, 82, 22);
  partialWalls(grid, 8, 5, 18, 10, { north: true, east: true, south: false, west: false });
  partialWalls(grid, 30, 5, 16, 12, { north: false, east: true, south: true, west: true });
  partialWalls(grid, 50, 6, 20, 9, { north: true, south: true, east: false, west: false });
  wallLRoom(grid, 62, 14, 14, 8, 10, 6, "west");

  vCorridor(grid, 42, 3, 22, 2);
  linkPath(grid, elev.x, elev.y, 42, 22);

  const podDesks = [
    ...desks(grid, 10, 7, 3, 2, 4, 3),
    ...desks(grid, 33, 8, 2, 2, 5, 3),
    ...desks(grid, 54, 8, 3, 1, 5, 1),
  ];
  grid[18][68] = "%";

  const entities = [
    ...spawnCoworkers(podDesks, floorNum, floorNum * 2, TOPICS.dev),
    leadEntity(floorNum, "Projektipäällikkö", 33, 6),
    itemEntity(`tool-f${floorNum}-crowbar`, "(", "Sorkkarauta", "crowbar", 68, 18),
  ];
  return finalizeFloor(`floor-${floorNum}`, title, grid, entities, elev);
}

// ─── Kerros 4: soluverkko — pienet testikopit + pitkä lab-käytävä ──────────

function buildQaFloor(floorNum, title) {
  const grid = mkGrid();
  const elev = { x: 8, y: INTRO_H - 5 };

  const cellW = 10;
  const cellH = 7;
  for (let row = 0; row < 2; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      const cx = 6 + col * (cellW + 3);
      const cy = 4 + row * (cellH + 3);
      wallRoom(grid, cx, cy, cellW, cellH, row === 1 ? "north" : "south");
      if (row === 0 && col === 1) {
        grid[cy + 3][cx + 4] = "J";
        grid[cy + 3][cx + 6] = "J";
      }
    }
  }

  hCorridor(grid, 20, 4, 80, 2);
  carveOpen(grid, 4, 22, 78, 6);
  wallRoom(grid, 60, 22, 22, 6, "west");
  meetingTable(grid, 30, 24);

  linkPath(grid, elev.x, elev.y, 30, 20);
  vCorridor(grid, 30, 20, 24, 2);

  const labDesks = desks(grid, 64, 23, 3, 2, 5, 2);
  const entities = [
    ...spawnCoworkers(labDesks, floorNum, floorNum * 3, TOPICS.qa),
    leadEntity(floorNum, "QA-päällikkö", 30, 5),
  ];
  return finalizeFloor(`floor-${floorNum}`, title, grid, entities, elev);
}

// ─── Kerros 5: L-siipi — vaaka NOC + pysty palvelinholvi ───────────────────

function buildDevOpsFloor(floorNum, title) {
  const grid = mkGrid();
  const elev = { x: 10, y: INTRO_H - 5 };

  carveOpen(grid, 4, 4, 52, 10);
  wallRoom(grid, 4, 4, 52, 10, "south");
  grid[13][30] = ".";

  wallRoom(grid, 58, 4, 26, 22, "west");
  grid[14][58] = ".";
  for (let y = 6; y < 24; y += 3) {
    for (let x = 62; x < 80; x += 5) grid[y][x] = "%";
  }
  grid[15][70] = "K";

  vCorridor(grid, 30, 14, 24, 2);
  linkPath(grid, elev.x, elev.y, 30, 14);

  const nocDesks = desks(grid, 10, 6, 6, 2, 5, 3);
  const entities = [
    ...spawnCoworkers(nocDesks, floorNum, floorNum * 4, TOPICS.ops),
    leadEntity(floorNum, "DevOps-lead", 30, 6),
    securityEntity(floorNum, 72, 20),
    itemEntity(`tool-f${floorNum}-shovel`, "/", "Lapio", "shovel", 70, 14),
  ];
  return finalizeFloor(`floor-${floorNum}`, title, grid, entities, elev);
}

// ─── Kerros 6: tähtikuvio — keskushuone + neljä siipeä ─────────────────────

function buildProductFloor(floorNum, title) {
  const grid = mkGrid();
  const elev = { x: 44, y: INTRO_H - 5 };

  const cx = 44;
  const cy = 12;
  wallRoom(grid, cx - 10, cy - 6, 20, 12, "none");
  carveOpen(grid, cx - 9, cy - 5, 18, 10);
  meetingTable(grid, cx, cy);

  wallRoom(grid, 4, 4, 22, 10, "east");
  wallRoom(grid, 62, 4, 22, 10, "west");
  wallRoom(grid, 28, 20, 32, 8, "north");
  grid[27][cx] = ".";

  vCorridor(grid, cx, cy + 6, 26, 2);
  hCorridor(grid, cy, 26, 62, 2);
  linkPath(grid, elev.x, elev.y, cx, 26);

  const wingDesks = [
    ...desks(grid, 8, 6, 3, 2, 4, 3),
    ...desks(grid, 66, 6, 3, 2, 4, 3),
    ...desks(grid, 34, 22, 4, 1, 5, 1),
  ];

  const entities = [
    ...spawnCoworkers(wingDesks, floorNum, floorNum * 5, TOPICS.product),
    leadEntity(floorNum, "Tuotejohtaja", cx, cy - 3, {
      storyId: floorNum >= 7 ? "cpp-safety-memory" : "",
    }),
    securityEntity(floorNum, 78, 8),
  ];
  return finalizeFloor(`floor-${floorNum}`, title, grid, entities, elev);
}

// ─── Kerros 7: hunajakenno — tiilirivi pieniä huoneita ──────────────────────

function buildHrFloor(floorNum, title) {
  const grid = mkGrid();
  const elev = { x: 8, y: INTRO_H - 5 };

  const roomW = 11;
  const roomH = 8;
  for (let row = 0; row < 2; row += 1) {
    for (let col = 0; col < 5; col += 1) {
      const ox = 5 + col * (roomW + 2) + (row % 2) * 6;
      const oy = 4 + row * (roomH + 2);
      if (ox + roomW < INTRO_W - 2) {
        wallRoom(grid, ox, oy, roomW, roomH, col % 2 === 0 ? "south" : "north");
      }
    }
  }

  carveOpen(grid, 4, 22, 78, 5);
  wallRoom(grid, 62, 22, 18, 5, "west");
  grid[24][62] = "%";
  hCorridor(grid, 21, 4, 80, 2);

  linkPath(grid, elev.x, elev.y, 40, 21);

  const openDesks = desks(grid, 10, 23, 5, 1, 6, 1);
  const entities = [
    ...spawnCoworkers(openDesks, floorNum, floorNum * 6, TOPICS.hr),
    leadEntity(floorNum, "HR-päällikkö", 40, 6, { storyId: "cpp-safety-memory" }),
    securityEntity(floorNum, 70, 23),
  ];
  return finalizeFloor(`floor-${floorNum}`, title, grid, entities, elev);
}

// ─── Kerros 8: pylväshalli — pitkä laiva + holvi ────────────────────────────

function buildFinanceFloor(floorNum, title) {
  const grid = mkGrid();
  const elev = { x: 8, y: INTRO_H - 5 };

  carveOpen(grid, 4, 4, 58, 20);
  wallRoom(grid, 4, 4, 58, 20, "none");
  pillars(grid, 12, 7, 5, 3, 9, 5);
  pillars(grid, 16, 8, 4, 2, 9, 8);

  wallRoom(grid, 64, 6, 20, 16, "west");
  wallRoom(grid, 64, 16, 12, 8, "north");
  grid[19][75] = "%";
  meetingTable(grid, 32, 14);

  hCorridor(grid, 23, 4, 62, 2);
  linkPath(grid, elev.x, elev.y, 20, 23);

  const hallDesks = desks(grid, 10, 8, 4, 4, 6, 3);
  const entities = [
    ...spawnCoworkers(hallDesks, floorNum, floorNum * 7, TOPICS.finance),
    leadEntity(floorNum, "Talousjohtaja", 32, 6),
    securityEntity(floorNum, 76, 20),
    itemEntity(`tool-f${floorNum}-sledge`, "T", "Moukarivasara", "sledgehammer", 72, 18),
  ];
  return finalizeFloor(`floor-${floorNum}`, title, grid, entities, elev);
}

// ─── Kerros 9: varasto — kolme rinnakkaista käytävää ────────────────────────

function buildItFloor(floorNum, title) {
  const grid = mkGrid();
  const elev = { x: 80, y: INTRO_H - 5 };

  for (let aisle = 0; aisle < 3; aisle += 1) {
    const ax = 10 + aisle * 24;
    vCorridor(grid, ax, 4, 22, 2);
    for (let bay = 0; bay < 3; bay += 1) {
      const bx = ax + 4 + bay * 6;
      wallRoom(grid, bx, 6, 5, 6, "south");
      if (bay === 1 && aisle === 1) grid[9][bx + 2] = "%";
    }
    rect(grid, ax + 2, 16, 18, 2, "=");
  }
  grid[20][50] = "K";

  hCorridor(grid, 23, 10, 70, 2);
  linkPath(grid, elev.x, elev.y, 70, 23);

  const helpDesks = desks(grid, 12, 18, 2, 1, 8, 1);
  const entities = [
    ...spawnCoworkers(helpDesks, floorNum, floorNum * 8, TOPICS.it),
    leadEntity(floorNum, "IT-päällikkö", 34, 6),
    securityEntity(floorNum, 50, 20),
    itemEntity(`tool-f${floorNum}-crowbar`, "(", "Sorkkarauta", "crowbar", 38, 9),
    itemEntity(`tool-f${floorNum}-shovel`, "/", "Lapio", "shovel", 62, 9),
  ];
  return finalizeFloor(`floor-${floorNum}`, title, grid, entities, elev);
}

// ─── Kerros 10: kulmatoimisto — CEO-sviitti + neuvottelutila ────────────────

export function buildExecutiveFloor() {
  const grid = mkGrid();
  const elev = { x: 44, y: INTRO_H - 5 };

  wallRoom(grid, 4, 4, 28, 16, "east");
  meetingTable(grid, 16, 12);

  wallRoom(grid, 56, 4, 28, 14, "west");
  carveOpen(grid, 57, 5, 26, 12);
  desks(grid, 62, 8, 3, 2, 5, 3);

  carveOpen(grid, 34, 4, 20, 18);
  wallRoom(grid, 34, 4, 20, 18, "none");
  grid[21][44] = ".";

  linkPath(grid, elev.x, elev.y, 44, 21);
  hCorridor(grid, 21, 16, 72, 2);

  const entities = [
    {
      id: "ceo-intro", char: "C", name: "Toimitusjohtaja", kind: "role",
      x: 16, y: 12, homeX: 16, homeY: 12, scheduleRole: "ceo",
    },
    itemEntity("exec-badge", "k", "Johtajan avain", "shed_key", 78, 8),
  ];

  return finalizeFloor("executive", "10. kerros — Johto", grid, entities, elev);
}

export function buildUpperFloor(floorNum) {
  const idx = floorNum - 3;
  const title = `${floorNum}. kerros — ${[
    "Kehitysosasto", "Testaus ja QA", "DevOps-kerros", "Tuotehallinta",
    "HR ja compliance", "Talous ja laskenta", "IT-tuki",
  ][idx]}`;
  const builders = [
    buildDevFloor, buildQaFloor, buildDevOpsFloor, buildProductFloor,
    buildHrFloor, buildFinanceFloor, buildItFloor,
  ];
  return builders[idx](floorNum, title);
}
