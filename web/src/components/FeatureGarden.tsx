import { getFeatureDef, getTopicLabel, karmaGlow } from '../features/catalog';
import type { CSSProperties } from 'react';
import type { PlayerFeature } from '../types/features';

type Props = {
  features: PlayerFeature[];
  compact?: boolean;
};

export function FeatureGarden({ features, compact }: Props) {
  if (features.length === 0) {
    if (compact) return null;
    return (
      <section className="feature-garden feature-garden-empty" aria-label="Oppimasi">
        <h2 className="feature-garden-title">Oppimasi</h2>
        <p className="feature-garden-hint">
          Matkan varrella keräät loitsuja — ei tasoja, vain kasvavaa ymmärrystä.
        </p>
      </section>
    );
  }

  const byTopic = new Map<string, PlayerFeature[]>();
  for (const f of features) {
    const def = getFeatureDef(f.featureId);
    const topic = def.topic;
    const list = byTopic.get(topic) ?? [];
    list.push(f);
    byTopic.set(topic, list);
  }

  return (
    <section className={`feature-garden${compact ? ' feature-garden-compact' : ''}`} aria-label="Oppimasi">
      {!compact && <h2 className="feature-garden-title">Oppimasi</h2>}
      {Array.from(byTopic.entries()).map(([topic, topicFeatures]) => (
        <div key={topic} className="feature-topic">
          {!compact && <h3 className="feature-topic-label">{getTopicLabel(topic)}</h3>}
          <ul className="feature-chips">
            {topicFeatures.map((f) => {
              const def = getFeatureDef(f.featureId);
              const glow = karmaGlow(f.karma);
              return (
                <li
                  key={f.featureId}
                  className="feature-chip"
                  style={{ '--karma-glow': glow } as CSSProperties}
                  title={def.description ?? def.label}
                >
                  <span className="feature-chip-label">{def.label}</span>
                  <span className="feature-chip-karma">{f.karma}</span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </section>
  );
}
