import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getProgress,
  grantFeatureKarma,
  markStoryCompleted,
  markStoryStarted,
  recordStepResult,
  saveProgress,
} from '../db/indexedDb';
import type { FeatureGrant } from '../types/features';
import type {
  ChoiceNode,
  CodeNode,
  EndNode,
  StoryMeta,
  StoryNode,
  StoryProgress,
} from '../types/story';
import type { GameHistoryEntry } from '../utils/gameHistory';
import { getFeatureDef } from '../features/catalog';

const DEFAULT_CODE_KARMA = 5;

export type GamePhase = 'loading' | 'playing' | 'feedback' | 'ended';

export type FeedbackState = {
  message: string;
  correct: boolean;
  points: number;
  nextNodeId: string;
  featuresGained?: { featureId: string; karma: number; label: string }[];
};

type GameEngineOptions = {
  historyEntry: GameHistoryEntry;
  onHistoryPush: (
    nodeId: string,
    phase: GamePhase,
    totalPoints: number,
    feedback: FeedbackState | null,
  ) => void;
  onHistoryReplace: (
    nodeId: string,
    phase: GamePhase,
    totalPoints: number,
    feedback: FeedbackState | null,
  ) => void;
  onFeaturesChanged?: () => void;
};

export function useGameEngine(story: StoryMeta | null, options: GameEngineOptions) {
  const { historyEntry, onHistoryPush, onHistoryReplace, onFeaturesChanged } = options;
  const historyEntryRef = useRef(historyEntry);
  historyEntryRef.current = historyEntry;

  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [phase, setPhase] = useState<GamePhase>('loading');
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [progress, setProgress] = useState<StoryProgress | null>(null);
  const [visited, setVisited] = useState<string[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const stepStartedAt = useRef<number>(Date.now());
  const lastAppliedHistoryKey = useRef('');

  const currentNode: StoryNode | null =
    story && currentNodeId ? story.nodes[currentNodeId] ?? null : null;

  const historyKey = `${historyEntry.nodeId ?? ''}:${historyEntry.phase ?? ''}:${historyEntry.totalPoints ?? ''}:${historyEntry.feedback?.message ?? ''}`;

  const applySnapshot = useCallback(
    (nodeId: string, snapPhase: GamePhase, snapPoints: number, snapFeedback: FeedbackState | null) => {
      setCurrentNodeId(nodeId);
      setPhase(snapPhase);
      setTotalPoints(snapPoints);
      setFeedback(snapFeedback);
      if (snapPhase === 'playing' || snapPhase === 'feedback') {
        stepStartedAt.current = Date.now();
      }
    },
    [],
  );

  const syncHistory = useCallback(
    (
      nodeId: string,
      snapPhase: GamePhase,
      snapPoints: number,
      snapFeedback: FeedbackState | null,
      mode: 'push' | 'replace',
    ) => {
      if (snapPhase === 'loading') return;
      const key = `${nodeId}:${snapPhase}:${snapPoints}:${snapFeedback?.message ?? ''}`;
      lastAppliedHistoryKey.current = key;
      if (mode === 'push') {
        onHistoryPush(nodeId, snapPhase, snapPoints, snapFeedback);
      } else {
        onHistoryReplace(nodeId, snapPhase, snapPoints, snapFeedback);
      }
    },
    [onHistoryPush, onHistoryReplace],
  );

  /** Run once when story loads */
  useEffect(() => {
    if (!story) return;

    let cancelled = false;

    (async () => {
      setPhase('loading');
      const saved = await getProgress(story.id);
      if (cancelled) return;

      let startNode = story.startNode;
      let startPoints = 0;
      let startVisited = [story.startNode];

      if (saved && !saved.completed) {
        startNode = saved.currentNodeId;
        startVisited = saved.visitedNodeIds;
        startPoints = saved.totalPoints;
      } else {
        await markStoryStarted(story.id);
        const now = Date.now();
        const fresh: StoryProgress = {
          storyId: story.id,
          currentNodeId: story.startNode,
          visitedNodeIds: [story.startNode],
          completed: false,
          startedAt: now,
          updatedAt: now,
          totalPoints: 0,
        };
        await saveProgress(fresh);
        if (!cancelled) setProgress(fresh);
      }
      if (saved && !cancelled) setProgress(saved);
      if (!cancelled) setVisited(startVisited);

      const entry = historyEntryRef.current;
      const urlNode = entry.nodeId;
      const urlPhase = entry.phase;
      const canUseUrl =
        urlNode &&
        story.nodes[urlNode] &&
        urlPhase &&
        urlPhase !== 'loading' &&
        (urlPhase !== 'feedback' || entry.feedback);

      if (canUseUrl && urlNode && urlPhase) {
        applySnapshot(
          urlNode,
          urlPhase,
          entry.totalPoints ?? startPoints,
          entry.feedback ?? null,
        );
        lastAppliedHistoryKey.current = `${urlNode}:${urlPhase}:${entry.totalPoints ?? startPoints}:${entry.feedback?.message ?? ''}`;
      } else {
        applySnapshot(startNode, 'playing', startPoints, null);
        syncHistory(startNode, 'playing', startPoints, null, 'replace');
      }

      stepStartedAt.current = Date.now();
    })();

    return () => {
      cancelled = true;
    };
  }, [story, applySnapshot, syncHistory]);

  /** Browser back/forward */
  useEffect(() => {
    if (!story || phase === 'loading') return;
    if (historyKey === lastAppliedHistoryKey.current) return;

    const nodeId = historyEntry.nodeId;
    const snapPhase = historyEntry.phase;
    if (!nodeId || !snapPhase || snapPhase === 'loading') return;
    if (!story.nodes[nodeId]) return;

    lastAppliedHistoryKey.current = historyKey;
    applySnapshot(
      nodeId,
      snapPhase,
      historyEntry.totalPoints ?? 0,
      historyEntry.feedback ?? null,
    );
  }, [historyKey, historyEntry, story, phase, applySnapshot]);

  const persist = useCallback(
    async (nodeId: string, pts: number, completed: boolean, outcome?: EndNode['outcome']) => {
      if (!story) return;
      const now = Date.now();
      setVisited((prev) => (prev.includes(nodeId) ? prev : [...prev, nodeId]));
      const nextVisited = visited.includes(nodeId) ? visited : [...visited, nodeId];
      const next: StoryProgress = {
        storyId: story.id,
        currentNodeId: nodeId,
        visitedNodeIds: nextVisited,
        completed,
        outcome,
        startedAt: progress?.startedAt ?? now,
        updatedAt: now,
        totalPoints: pts,
      };
      await saveProgress(next);
      setProgress(next);
      if (completed) await markStoryCompleted(story.id, outcome ?? 'neutral');
    },
    [story, visited, progress],
  );

  const goToNode = useCallback(
    async (nodeId: string, pointsEarned = 0) => {
      if (!story) return;
      const node = story.nodes[nodeId];
      if (!node) return;

      const newPoints = totalPoints + pointsEarned;
      setTotalPoints(newPoints);
      setFeedback(null);

      if (node.type === 'end') {
        setCurrentNodeId(nodeId);
        setPhase('ended');
        syncHistory(nodeId, 'ended', newPoints, null, 'push');
        await persist(nodeId, newPoints, true, node.outcome);
        return;
      }

      setCurrentNodeId(nodeId);
      setPhase('playing');
      stepStartedAt.current = Date.now();
      syncHistory(nodeId, 'playing', newPoints, null, 'push');
      await persist(nodeId, newPoints, false);
    },
    [story, totalPoints, persist, syncHistory],
  );

  const advanceNarrative = useCallback(() => {
    if (!currentNode || currentNode.type !== 'narrative') return;
    void goToNode(currentNode.next);
  }, [currentNode, goToNode]);

  const awardFeatures = useCallback(
    async (grants: FeatureGrant[] | undefined, defaultKarma: number) => {
      if (!grants?.length) return undefined;
      const normalized = grants.map((g) => ({
        id: g.id,
        karma: g.karma ?? defaultKarma,
      }));
      const gained = await grantFeatureKarma(normalized);
      onFeaturesChanged?.();
      return gained.map((g) => ({
        ...g,
        label: getFeatureDef(g.featureId).label,
      }));
    },
    [onFeaturesChanged],
  );

  const submitChoice = useCallback(
    async (choiceId: string) => {
      if (!story || !currentNode || currentNode.type !== 'choice' || !currentNodeId) return;
      const choice = currentNode.choices.find((c) => c.id === choiceId);
      if (!choice) return;

      const durationMs = Date.now() - stepStartedAt.current;
      const correct = choice.correct ?? false;
      const points = correct ? (choice.points ?? 0) : 0;
      const featuresGained = correct
        ? await awardFeatures(choice.features, 3)
        : undefined;

      await recordStepResult({
        storyId: story.id,
        nodeId: currentNodeId,
        stepType: 'choice',
        response: choiceId,
        correct,
        points,
        timestamp: Date.now(),
        durationMs,
        featuresGained: choice.features,
      });

      const fb: FeedbackState = {
        message: choice.feedback,
        correct,
        points,
        nextNodeId: choice.next,
        featuresGained,
      };
      setFeedback(fb);
      setPhase('feedback');
      syncHistory(currentNodeId, 'feedback', totalPoints, fb, 'push');
    },
    [story, currentNode, currentNodeId, totalPoints, syncHistory, awardFeatures],
  );

  const submitCode = useCallback(
    async (answer: string) => {
      if (!story || !currentNode || currentNode.type !== 'code' || !currentNodeId) return;
      const node = currentNode as CodeNode;
      const trimmed = answer.trim();
      const minLen = node.minLength ?? 1;
      const maxLen = node.maxLength ?? 200;

      if (trimmed.length < minLen || trimmed.length > maxLen) return;

      const matches = node.answers.some((a) =>
        node.ignoreCase ? a.toLowerCase() === trimmed.toLowerCase() : a === trimmed,
      );

      const durationMs = Date.now() - stepStartedAt.current;
      const points = matches ? 20 : 0;
      const featuresGained = matches
        ? await awardFeatures(node.features, DEFAULT_CODE_KARMA)
        : undefined;

      await recordStepResult({
        storyId: story.id,
        nodeId: currentNodeId,
        stepType: 'code',
        response: trimmed,
        correct: matches,
        points,
        timestamp: Date.now(),
        durationMs,
        featuresGained: matches ? node.features : undefined,
      });

      const fb: FeedbackState = {
        message: matches ? node.feedbackCorrect : node.feedbackWrong,
        correct: matches,
        points,
        nextNodeId: matches ? node.next : (node.wrongNext ?? node.next),
        featuresGained,
      };
      setFeedback(fb);
      setPhase('feedback');
      syncHistory(currentNodeId, 'feedback', totalPoints, fb, 'push');
    },
    [story, currentNode, currentNodeId, totalPoints, syncHistory, awardFeatures],
  );

  const continueAfterFeedback = useCallback(() => {
    if (!feedback) return;
    const { nextNodeId, points } = feedback;
    void goToNode(nextNodeId, points);
  }, [feedback, goToNode]);

  const restart = useCallback(async () => {
    if (!story) return;
    const now = Date.now();
    const fresh: StoryProgress = {
      storyId: story.id,
      currentNodeId: story.startNode,
      visitedNodeIds: [story.startNode],
      completed: false,
      startedAt: now,
      updatedAt: now,
      totalPoints: 0,
    };
    await saveProgress(fresh);
    setProgress(fresh);
    setVisited([story.startNode]);
    applySnapshot(story.startNode, 'playing', 0, null);
    syncHistory(story.startNode, 'playing', 0, null, 'push');
    stepStartedAt.current = Date.now();
  }, [story, applySnapshot, syncHistory]);

  return {
    currentNode,
    currentNodeId,
    phase,
    feedback,
    progress,
    totalPoints,
    visited,
    advanceNarrative,
    submitChoice,
    submitCode,
    continueAfterFeedback,
    restart,
  };
}

export function isChoiceNode(node: StoryNode): node is ChoiceNode {
  return node.type === 'choice';
}

export function isCodeNode(node: StoryNode): node is CodeNode {
  return node.type === 'code';
}

export function isEndNode(node: StoryNode): node is EndNode {
  return node.type === 'end';
}
