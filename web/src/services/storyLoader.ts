import type { GameConfig, StoryMeta, StorySummary } from '../types/story';

import modernCppIntro from '../stories/modern-cpp-intro.json';
import cppSafetyConst from '../stories/cpp-safety-const.json';
import cppSafetyMemory from '../stories/cpp-safety-memory.json';
import cppSafetyCasts from '../stories/cpp-safety-casts-exceptions.json';
import cppSafetyVariadic from '../stories/cpp-safety-variadic.json';
import vainamoinenChallenge from '../stories/vainamoinen-challenge.json';

const STATIC_STORIES: StoryMeta[] = [
  modernCppIntro as StoryMeta,
  cppSafetyConst as StoryMeta,
  cppSafetyMemory as StoryMeta,
  cppSafetyCasts as StoryMeta,
  cppSafetyVariadic as StoryMeta,
  vainamoinenChallenge as StoryMeta,
];

function toSummary(s: StoryMeta): StorySummary {
  return {
    id: s.id,
    title: s.title,
    topic: s.topic,
    description: s.description,
    sortOrder: s.sortOrder,
    teaches: s.teaches,
    sourceRef: s.sourceRef,
    estimatedMinutes: s.estimatedMinutes,
    isFinale: s.isFinale,
  };
}

const STATIC_INDEX: StorySummary[] = STATIC_STORIES.map(toSummary);

export function getStaticStoryIndex(): StorySummary[] {
  return STATIC_INDEX;
}

export function getStaticStory(id: string): StoryMeta | undefined {
  return STATIC_STORIES.find((s) => s.id === id);
}

export async function fetchStoryIndex(config: GameConfig): Promise<StorySummary[]> {
  if (config.storySource === 'static') {
    return getStaticStoryIndex();
  }

  const base = config.serverBaseUrl ?? '/api';
  const res = await fetch(`${base}/stories`);
  if (!res.ok) throw new Error(`Story index failed: ${res.status}`);
  return res.json();
}

export async function fetchStory(id: string, config: GameConfig): Promise<StoryMeta> {
  if (config.storySource === 'static') {
    const story = getStaticStory(id);
    if (!story) throw new Error(`Story not found: ${id}`);
    return story;
  }

  const base = config.serverBaseUrl ?? '/api';
  const res = await fetch(`${base}/stories/${id}`);
  if (!res.ok) throw new Error(`Story load failed: ${res.status}`);
  return res.json();
}
