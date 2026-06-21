import { useCallback, useEffect, useState } from 'react';
import { GameView } from './components/GameView';
import { StoryList } from './components/StoryList';
import { useAppNavigation, loadStoryIndex } from './hooks/useAppNavigation';
import { getAllPlayerFeatures, getAllProgress, getPlayerStats } from './db/indexedDb';
import type { GameConfig, StoryProgress, StorySummary } from './types/story';
import type { PlayerFeature } from './types/features';

export default function App() {
  const [config, setConfig] = useState<GameConfig>({ storySource: 'static' });
  const [stories, setStories] = useState<StorySummary[]>([]);
  const [progressMap, setProgressMap] = useState<Map<string, StoryProgress>>(new Map());
  const [playerFeatures, setPlayerFeatures] = useState<PlayerFeature[]>([]);
  const [stats, setStats] = useState<{
    totalKarma: number;
    storiesCompleted: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProgress = useCallback(async () => {
    const all = await getAllProgress();
    setProgressMap(new Map(all.map((p) => [p.storyId, p])));
    const features = await getAllPlayerFeatures();
    setPlayerFeatures(features);
    const s = await getPlayerStats();
    setStats({
      totalKarma: s.totalKarma,
      storiesCompleted: s.storiesCompleted,
    });
  }, []);

  const loadIndex = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const index = await loadStoryIndex(config);
      setStories(index);
      await refreshProgress();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lataus epäonnistui');
    } finally {
      setLoading(false);
    }
  }, [config, refreshProgress]);

  const nav = useAppNavigation({
    config,
    onListReady: () => void refreshProgress(),
  });

  useEffect(() => {
    void loadIndex();
  }, [loadIndex]);

  useEffect(() => {
    if (nav.navError) setError(nav.navError);
  }, [nav.navError]);

  const exitGame = () => {
    nav.goToList('push');
  };

  const toggleSource = () => {
    setConfig((c) => ({
      ...c,
      storySource: c.storySource === 'static' ? 'server' : 'static',
    }));
  };

  const inGame = nav.historyEntry.screen === 'game' && nav.activeStory;

  if (inGame) {
    return (
      <GameView
        story={nav.activeStory}
        historyEntry={nav.historyEntry}
        onHistoryPush={(nodeId, phase, totalPoints, feedback) =>
          nav.pushGameStep(nav.activeStory!.id, nodeId, phase, totalPoints, feedback)
        }
        onHistoryReplace={(nodeId, phase, totalPoints, feedback) =>
          nav.replaceGameStep(nav.activeStory!.id, nodeId, phase, totalPoints, feedback)
        }
        onExit={exitGame}
        onFeaturesChanged={() => void refreshProgress()}
      />
    );
  }

  return (
    <div className="app">
      {error && (
        <div className="error-banner" role="alert">
          {error}
          {config.storySource === 'server' && (
            <span> — Varmista että paikallinen palvelin on käynnissä (npm run server)</span>
          )}
        </div>
      )}
      {loading || nav.storyLoading ? (
        <p className="loading">Ladataan tarinoita…</p>
      ) : (
        <StoryList
          stories={stories}
          progressMap={progressMap}
          playerFeatures={playerFeatures}
          onSelect={(id) => void nav.startStory(id)}
          storySource={config.storySource}
          onToggleSource={toggleSource}
          stats={stats}
        />
      )}
    </div>
  );
}
