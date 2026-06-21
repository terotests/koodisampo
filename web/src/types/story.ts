/** Story node types */

import type { FeatureGrant } from './features';

export type StoryMeta = {
  id: string;
  title: string;
  topic: string;
  description: string;
  /** Hidden sort key for story list — not shown in UI */
  sortOrder?: number;
  /** Feature ids this story may teach (shown as hints on card) */
  teaches?: string[];
  sourceRef?: string;
  estimatedMinutes?: number;
  isFinale?: boolean;
  startNode: string;
  nodes: Record<string, StoryNode>;
};

export type NarrativeNode = {
  type: 'narrative';
  title?: string;
  text: string;
  next: string;
};

export type ChoiceOption = {
  id: string;
  text: string;
  feedback: string;
  next: string;
  correct?: boolean;
  points?: number;
  /** Karma granted to features on correct answer */
  features?: FeatureGrant[];
};

export type ChoiceNode = {
  type: 'choice';
  title?: string;
  text: string;
  choices: ChoiceOption[];
};

export type CodeNode = {
  type: 'code';
  title?: string;
  text: string;
  template: string;
  answers: string[];
  minLength?: number;
  maxLength?: number;
  ignoreCase?: boolean;
  hint?: string;
  feedbackCorrect: string;
  feedbackWrong: string;
  next: string;
  wrongNext?: string;
  features?: FeatureGrant[];
};

export type EndNode = {
  type: 'end';
  title?: string;
  text: string;
  outcome: 'victory' | 'death' | 'neutral';
};

export type StoryNode = NarrativeNode | ChoiceNode | CodeNode | EndNode;

export type StorySummary = {
  id: string;
  title: string;
  topic: string;
  description: string;
  sortOrder?: number;
  teaches?: string[];
  sourceRef?: string;
  estimatedMinutes?: number;
  isFinale?: boolean;
};

export type StorySource = 'static' | 'server';

export type GameConfig = {
  storySource: StorySource;
  serverBaseUrl?: string;
};

export type StoryProgress = {
  storyId: string;
  currentNodeId: string;
  visitedNodeIds: string[];
  completed: boolean;
  outcome?: EndNode['outcome'];
  startedAt: number;
  updatedAt: number;
  totalPoints: number;
};

export type StepResult = {
  id?: number;
  storyId: string;
  nodeId: string;
  stepType: StoryNode['type'];
  response: string;
  correct: boolean;
  points: number;
  timestamp: number;
  durationMs: number;
  featuresGained?: FeatureGrant[];
};

export type PlayerStats = {
  id: 'player';
  storiesStarted: number;
  storiesCompleted: number;
  totalKarma: number;
  deaths: number;
  lastPlayedAt: number;
};
