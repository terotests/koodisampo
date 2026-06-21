import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { FeatureGrant } from '../types/features';
import type { PlayerFeature } from '../types/features';
import type { PlayerStats, StepResult, StoryProgress } from '../types/story';

const DB_NAME = 'koodisampo';
const DB_VERSION = 2;

interface KoodisampoDB extends DBSchema {
  progress: {
    key: string;
    value: StoryProgress;
    indexes: { 'by-updated': number };
  };
  results: {
    key: number;
    value: StepResult;
    indexes: {
      'by-story': string;
      'by-timestamp': number;
    };
  };
  stats: {
    key: string;
    value: PlayerStats;
  };
  features: {
    key: string;
    value: PlayerFeature;
    indexes: { 'by-karma': number };
  };
}

let dbPromise: Promise<IDBPDatabase<KoodisampoDB>> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<KoodisampoDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          const progress = db.createObjectStore('progress', { keyPath: 'storyId' });
          progress.createIndex('by-updated', 'updatedAt');

          const results = db.createObjectStore('results', {
            keyPath: 'id',
            autoIncrement: true,
          });
          results.createIndex('by-story', 'storyId');
          results.createIndex('by-timestamp', 'timestamp');

          db.createObjectStore('stats', { keyPath: 'id' });
        }

        if (oldVersion < 2) {
          const features = db.createObjectStore('features', { keyPath: 'featureId' });
          features.createIndex('by-karma', 'karma');
        }
      },
    });
  }
  return dbPromise;
}

const DEFAULT_STATS: PlayerStats = {
  id: 'player',
  storiesStarted: 0,
  storiesCompleted: 0,
  totalKarma: 0,
  deaths: 0,
  lastPlayedAt: 0,
};

export async function getProgress(storyId: string): Promise<StoryProgress | undefined> {
  return (await getDb()).get('progress', storyId);
}

export async function getAllProgress(): Promise<StoryProgress[]> {
  return (await getDb()).getAll('progress');
}

export async function saveProgress(progress: StoryProgress): Promise<void> {
  await (await getDb()).put('progress', progress);
}

export async function deleteProgress(storyId: string): Promise<void> {
  await (await getDb()).delete('progress', storyId);
}

export async function getAllPlayerFeatures(): Promise<PlayerFeature[]> {
  const all = await (await getDb()).getAll('features');
  return all.sort((a, b) => b.karma - a.karma);
}

export async function getPlayerFeature(featureId: string): Promise<PlayerFeature | undefined> {
  return (await getDb()).get('features', featureId);
}

export async function grantFeatureKarma(
  grants: FeatureGrant[],
): Promise<{ featureId: string; karma: number; label: string }[]> {
  if (grants.length === 0) return [];

  const db = await getDb();
  const now = Date.now();
  const gained: { featureId: string; karma: number; label: string }[] = [];
  let totalAdded = 0;

  for (const grant of grants) {
    const amount = grant.karma ?? 3;
    const existing = await db.get('features', grant.id);
    const next: PlayerFeature = existing
      ? {
          ...existing,
          karma: existing.karma + amount,
          practiceCount: existing.practiceCount + 1,
          lastPracticedAt: now,
        }
      : {
          featureId: grant.id,
          karma: amount,
          practiceCount: 1,
          firstLearnedAt: now,
          lastPracticedAt: now,
        };
    await db.put('features', next);
    totalAdded += amount;
    gained.push({ featureId: grant.id, karma: amount, label: grant.id });
  }

  const stats = (await db.get('stats', 'player')) ?? { ...DEFAULT_STATS };
  stats.totalKarma = (stats.totalKarma ?? 0) + totalAdded;
  stats.lastPlayedAt = now;
  await db.put('stats', stats);

  return gained;
}

export async function recordStepResult(result: Omit<StepResult, 'id'>): Promise<void> {
  const db = await getDb();
  await db.add('results', result as StepResult);
  statsTouch(db, result.timestamp);
}

async function statsTouch(db: IDBPDatabase<KoodisampoDB>, timestamp: number) {
  const stats = (await db.get('stats', 'player')) ?? { ...DEFAULT_STATS };
  stats.lastPlayedAt = timestamp;
  await db.put('stats', stats);
}

export async function getResultsForStory(storyId: string): Promise<StepResult[]> {
  return (await getDb()).getAllFromIndex('results', 'by-story', storyId);
}

export async function getPlayerStats(): Promise<PlayerStats> {
  const stats = (await getDb()).get('stats', 'player');
  if (!stats) return { ...DEFAULT_STATS };
  return {
    ...DEFAULT_STATS,
    ...stats,
    totalKarma: stats.totalKarma ?? 0,
  };
}

export async function markStoryStarted(storyId: string): Promise<void> {
  const db = await getDb();
  const existing = await db.get('progress', storyId);
  if (existing) return;

  const stats = (await db.get('stats', 'player')) ?? { ...DEFAULT_STATS };
  stats.storiesStarted += 1;
  stats.lastPlayedAt = Date.now();
  await db.put('stats', stats);
}

export async function markStoryCompleted(
  storyId: string,
  outcome: StoryProgress['outcome'],
): Promise<void> {
  const db = await getDb();
  const stats = (await db.get('stats', 'player')) ?? { ...DEFAULT_STATS };
  if (outcome === 'victory') {
    stats.storiesCompleted += 1;
  }
  if (outcome === 'death') {
    stats.deaths += 1;
  }
  stats.lastPlayedAt = Date.now();
  await db.put('stats', stats);
}

export async function exportAllData(): Promise<{
  progress: StoryProgress[];
  results: StepResult[];
  stats: PlayerStats;
  features: PlayerFeature[];
}> {
  const db = await getDb();
  return {
    progress: await db.getAll('progress'),
    results: await db.getAll('results'),
    stats: (await getPlayerStats()),
    features: await db.getAll('features'),
  };
}

export async function clearAllData(): Promise<void> {
  const db = await getDb();
  await db.clear('progress');
  await db.clear('results');
  await db.clear('features');
  await db.put('stats', { ...DEFAULT_STATS });
}
