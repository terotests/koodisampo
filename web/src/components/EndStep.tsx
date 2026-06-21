import type { EndNode } from '../types/story';

type Props = {
  node: EndNode;
  totalPoints: number;
  onRestart: () => void;
  onExit: () => void;
};

export function EndStep({ node, totalPoints, onRestart, onExit }: Props) {
  const outcomeClass =
    node.outcome === 'victory'
      ? 'outcome-victory'
      : node.outcome === 'death'
        ? 'outcome-death'
        : 'outcome-neutral';

  return (
    <div className={`step end-step ${outcomeClass}`}>
      {node.title && <h2 className="step-title">{node.title}</h2>}
      <p className="end-text">{node.text}</p>
      <p className="points-summary">Kokonaispisteet: {totalPoints}</p>
      <div className="end-actions">
        {node.outcome === 'death' && (
          <button type="button" className="btn btn-primary" onClick={onRestart}>
            Uusi syntyminen — aloita alusta
          </button>
        )}
        {node.outcome === 'victory' && (
          <button type="button" className="btn btn-primary" onClick={onExit}>
            Palaa tarinoiden listaan
          </button>
        )}
        <button type="button" className="btn btn-secondary" onClick={onExit}>
          Poistu
        </button>
      </div>
    </div>
  );
}
