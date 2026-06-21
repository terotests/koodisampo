import { getFeatureDef } from '../features/catalog';
import type { StoryProgress, StorySummary } from '../types/story';
import { FeatureGarden } from './FeatureGarden';
import type { PlayerFeature } from '../types/features';

type Props = {
  stories: StorySummary[];
  progressMap: Map<string, StoryProgress>;
  playerFeatures: PlayerFeature[];
  onSelect: (id: string) => void;
  storySource: 'static' | 'server';
  onToggleSource: () => void;
  stats: { totalKarma: number; storiesCompleted: number } | null;
};

export function StoryList({
  stories,
  progressMap,
  playerFeatures,
  onSelect,
  storySource,
  onToggleSource,
  stats,
}: Props) {
  const learnedIds = new Set(playerFeatures.map((f) => f.featureId));
  const sorted = [...stories].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.title.localeCompare(b.title, 'fi'),
  );

  return (
    <div className="story-list">
      <header className="hero">
        <h1>Koodisampo</h1>
        <p className="tagline">
          Corporate NetHack — selviydy toimistosta, opi C++:ää
        </p>
        {stats && stats.totalKarma > 0 && (
          <div className="player-stats">
            <span>✨ {stats.totalKarma} karmaa yhteensä</span>
            {stats.storiesCompleted > 0 && (
              <span>📜 {stats.storiesCompleted} tarinaa päätökseen</span>
            )}
          </div>
        )}
      </header>

      <FeatureGarden features={playerFeatures} />

      <div className="source-toggle">
        <span>Lähde: {storySource === 'static' ? 'Staattiset tarinat' : 'Paikallinen palvelin'}</span>
        <button type="button" className="btn btn-secondary btn-sm" onClick={onToggleSource}>
          Vaihda
        </button>
      </div>

      <ul className="story-cards">
        {sorted.map((s) => {
          const prog = progressMap.get(s.id);
          const status = prog?.completed
            ? prog.outcome === 'victory'
              ? '✓ Valmis'
              : '—'
            : prog
              ? '⏸ Kesken'
              : null;

          return (
            <li key={s.id}>
              <button type="button" className="story-card" onClick={() => onSelect(s.id)}>
                <div className="story-card-header">
                  {s.isFinale && <span className="story-badge">CTO</span>}
                  <span className="story-topic">{s.topic.toUpperCase()}</span>
                </div>
                <h2>{s.title}</h2>
                <p>{s.description}</p>
                {s.teaches && s.teaches.length > 0 && (
                  <ul className="story-teaches" aria-label="Tarina voi opettaa">
                    {s.teaches.map((fid) => {
                      const def = getFeatureDef(fid);
                      const learned = learnedIds.has(fid);
                      return (
                        <li
                          key={fid}
                          className={learned ? 'teach-chip learned' : 'teach-chip'}
                          title={def.description}
                        >
                          {def.label}
                        </li>
                      );
                    })}
                  </ul>
                )}
                {s.estimatedMinutes && (
                  <span className="story-duration">~{s.estimatedMinutes} min</span>
                )}
                {status && <span className="story-status">{status}</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
