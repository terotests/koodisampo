export type WorldSummary = {
  id: string;
  title: string;
  startFloor: number;
  playerAlias: string;
  floorCount: number;
  floors: FloorMeta[];
};

export type FloorMeta = {
  index: number;
  id: string;
  title: string;
  width: number;
  height: number;
  entityCount: number;
};

export type FloorEntity = {
  id: string;
  char: string;
  name: string;
  kind: string;
  x: number;
  y: number;
  topic: string;
  scheduleRole: string;
  storyId: string;
  itemTool: string;
  sociability: number | null;
  persistence: number | null;
  behavior: string;
  homeX: number;
  homeY: number;
  zoneId: string | null;
  zoneKind: string;
  floor: number;
};

export type FloorZone = {
  id: string;
  kind: string;
  label: string;
  area: number;
  bounds: { x: number; y: number; w: number; h: number };
  center: { x: number; y: number };
  entities: FloorEntity[];
};

export type FloorAnalysis = {
  floorIndex: number;
  id: string;
  title: string;
  width: number;
  height: number;
  rows: string[];
  spawn: { x: number; y: number } | null;
  cafeteria: { x: number; y: number } | null;
  door: { x: number; y: number } | null;
  elevator: { x: number; y: number } | null;
  tileCounts: Record<string, number>;
  zones: FloorZone[];
  entities: FloorEntity[];
  unplaced: FloorEntity[];
  entityCount: number;
  roomCount: number;
};

export type FloorPatchResult = FloorAnalysis & {
  savedTo?: string | null;
  gameSync?: {
    synced: boolean;
    source?: string;
    dest?: string;
    reason?: string;
  } | null;
};

export type QuestionItem = {
  id: string;
  chapter: string;
  domain: string;
  difficulty: number;
  audiences?: string[];
  prompt: string;
  featureId: string;
  sourceUrl: string;
};

export type QuestionList = {
  total: number;
  items: QuestionItem[];
};

export type QuestionPreview = {
  topic: string;
  items: { id: string; chapter: string; prompt: string; difficulty: number }[];
};

export type QuestionStats = {
  total: number;
  byChapter: Record<string, number>;
  byDomain: Record<string, number>;
};
