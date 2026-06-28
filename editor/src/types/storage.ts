import type { WorldSummary } from "../types";

export type WorldFileEntry = {
  path: string;
  name: string;
  size: number;
  modifiedAt: string;
  isDefault: boolean;
};

export type WorldFilesResponse = {
  activeFile: string;
  files: WorldFileEntry[];
};

export type BackupEntry = {
  id: string;
  name: string;
  note: string;
  createdAt: string;
  sourceFile: string;
  file: string;
  floorCount: number;
};

export type WorldSummaryResponse = WorldSummary & {
  activeFile: string;
  defaultFile: string;
};

export type GameSyncInfo = {
  synced: boolean;
  source?: string;
  dest?: string;
  reason?: string;
};
