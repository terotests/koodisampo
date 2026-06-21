import type { FeedbackState } from '../hooks/useGameEngine';

type Props = {
  feedback: FeedbackState;
  onContinue: () => void;
};

export function FeedbackPanel({ feedback, onContinue }: Props) {
  return (
    <div
      className={`feedback-panel ${feedback.correct ? 'feedback-correct' : 'feedback-wrong'}`}
      role="alert"
    >
      <p>{feedback.message}</p>
      {feedback.featuresGained && feedback.featuresGained.length > 0 && (
        <ul className="feedback-features">
          {feedback.featuresGained.map((f) => (
            <li key={f.featureId}>
              +{f.karma} karma · <strong>{f.label}</strong>
            </li>
          ))}
        </ul>
      )}
      <button type="button" className="btn btn-primary" onClick={onContinue}>
        Jatka
      </button>
    </div>
  );
}
