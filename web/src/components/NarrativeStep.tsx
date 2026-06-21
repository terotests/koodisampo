import { renderStoryText } from '../utils/renderStoryText';
import type { NarrativeNode } from '../types/story';

type Props = {
  node: NarrativeNode;
  onContinue: () => void;
};

export function NarrativeStep({ node, onContinue }: Props) {
  return (
    <div className="step narrative-step">
      {node.title && <h2 className="step-title">{node.title}</h2>}
      <div className="step-body">{renderStoryText(node.text)}</div>
      <button type="button" className="btn btn-primary" onClick={onContinue}>
        Jatka matkaa →
      </button>
    </div>
  );
}
