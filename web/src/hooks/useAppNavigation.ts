import { useCallback, useEffect, useRef, useState } from 'react';
import type { GameConfig, StoryMeta, StorySummary } from '../types/story';
import { fetchStory, fetchStoryIndex } from '../services/storyLoader';
import {
  entryToPath,
  gameEntry,
  isGameHistoryEntry,
  listEntry,
  parseLocation,
  pushEntry,
  replaceEntry,
  type GameHistoryEntry,
} from '../utils/gameHistory';

type UseAppNavigationOptions = {
  config: GameConfig;
  onListReady: () => void;
};

export function useAppNavigation({ config, onListReady }: UseAppNavigationOptions) {
  const [historyEntry, setHistoryEntry] = useState<GameHistoryEntry>(() =>
    parseLocation(window.location.pathname, window.location.search, window.history.state),
  );
  const [activeStory, setActiveStory] = useState<StoryMeta | null>(null);
  const [storyLoading, setStoryLoading] = useState(false);
  const [navError, setNavError] = useState<string | null>(null);
  const isPopstateRef = useRef(false);
  const configRef = useRef(config);
  configRef.current = config;

  const loadStory = useCallback(async (storyId: string): Promise<StoryMeta | null> => {
    setStoryLoading(true);
    setNavError(null);
    try {
      const story = await fetchStory(storyId, configRef.current);
      setActiveStory(story);
      return story;
    } catch (e) {
      setNavError(e instanceof Error ? e.message : 'Tarinan lataus epäonnistui');
      setActiveStory(null);
      return null;
    } finally {
      setStoryLoading(false);
    }
  }, []);

  const applyEntry = useCallback(
    async (entry: GameHistoryEntry, mode: 'push' | 'replace' | 'pop') => {
      setHistoryEntry(entry);

      if (entry.screen === 'list') {
        setActiveStory(null);
        if (mode !== 'pop') onListReady();
        return;
      }

      if (!entry.storyId) return;

      if (!activeStory || activeStory.id !== entry.storyId) {
        await loadStory(entry.storyId);
      }
    },
    [activeStory, loadStory, onListReady],
  );

  /** Called by game engine when player advances — adds browser history step */
  const pushGameStep = useCallback(
    (storyId: string, nodeId: string, phase: GameHistoryEntry['phase'], totalPoints: number, feedback: GameHistoryEntry['feedback']) => {
      if (isPopstateRef.current) return;
      const entry = gameEntry(storyId, nodeId, phase ?? 'playing', totalPoints, feedback);
      pushEntry(entry);
      setHistoryEntry(entry);
    },
    [],
  );

  /** Replace URL when game first settles on a node (avoid duplicate history on open) */
  const replaceGameStep = useCallback(
    (storyId: string, nodeId: string, phase: GameHistoryEntry['phase'], totalPoints: number, feedback: GameHistoryEntry['feedback']) => {
      const entry = gameEntry(storyId, nodeId, phase ?? 'playing', totalPoints, feedback);
      replaceEntry(entry);
      setHistoryEntry(entry);
    },
    [],
  );

  const goToList = useCallback(
    (mode: 'push' | 'replace' = 'push') => {
      const entry = listEntry();
      if (mode === 'replace') {
        replaceEntry(entry);
      } else {
        pushEntry(entry);
      }
      setHistoryEntry(entry);
      setActiveStory(null);
      onListReady();
    },
    [onListReady],
  );

  const startStory = useCallback(
    async (storyId: string) => {
      const story = await loadStory(storyId);
      if (!story) return;

      const entry: GameHistoryEntry = {
        v: 1,
        screen: 'game',
        storyId,
        phase: 'loading',
      };
      pushEntry(entry);
      setHistoryEntry(entry);
    },
    [loadStory],
  );

  useEffect(() => {
    const onPopstate = (event: PopStateEvent) => {
      isPopstateRef.current = true;
      const entry = isGameHistoryEntry(event.state)
        ? event.state
        : parseLocation(window.location.pathname, window.location.search, event.state);

      void applyEntry(entry, 'pop').finally(() => {
        requestAnimationFrame(() => {
          isPopstateRef.current = false;
        });
      });
    };

    window.addEventListener('popstate', onPopstate);
    return () => window.removeEventListener('popstate', onPopstate);
  }, [applyEntry]);

  /** Initial URL sync on mount */
  useEffect(() => {
    const entry = parseLocation(
      window.location.pathname,
      window.location.search,
      window.history.state,
    );
    if (entry.screen === 'game' && entry.storyId) {
      replaceEntry(entry);
      void applyEntry(entry, 'replace');
    } else {
      replaceEntry(listEntry());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only
  }, []);

  return {
    historyEntry,
    activeStory,
    storyLoading,
    navError,
    setNavError,
    startStory,
    goToList,
    pushGameStep,
    replaceGameStep,
    isHistoryNavigation: () => isPopstateRef.current,
  };
}

export async function loadStoryIndex(config: GameConfig): Promise<StorySummary[]> {
  return fetchStoryIndex(config);
}

export function getShareableUrl(entry: GameHistoryEntry): string {
  return `${window.location.origin}${entryToPath(entry)}`;
}
