import { useMemo } from 'react';
import { renderStoryText } from '../utils/renderStoryText';
import { shuffleArray } from '../utils/shuffleArray';
import type { ChoiceNode } from '../types/story';

type Props = {
  node: ChoiceNode;
  /** Vakaa avain (esim. nodeId) — uusi sekoitus kun kysymys vaihtuu */
  shuffleKey: string;
  onChoose: (choiceId: string) => void;
  disabled?: boolean;
};

export function ChoiceStep({ node, shuffleKey, onChoose, disabled }: Props) {
  const choices = useMemo(
    () => shuffleArray(node.choices),
    [node.choices, shuffleKey],
  );

  return (
    <div className="step choice-step">
      {node.title && <h2 className="step-title">{node.title}</h2>}
      <div className="step-body">{renderStoryText(node.text)}</div>
      <ul className="choice-list" role="listbox" aria-label="Vastausvaihtoehdot">
        {choices.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              className="btn btn-choice"
              disabled={disabled}
              onClick={() => onChoose(c.id)}
            >
              {c.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
