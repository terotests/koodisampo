import { useState } from 'react';
import { renderStoryText } from '../utils/renderStoryText';
import type { CodeNode } from '../types/story';

type Props = {
  node: CodeNode;
  onSubmit: (answer: string) => void;
  disabled?: boolean;
};

export function CodeStep({ node, onSubmit, disabled }: Props) {
  const [answer, setAnswer] = useState('');
  const minLen = node.minLength ?? 1;
  const maxLen = node.maxLength ?? 200;
  const valid = answer.trim().length >= minLen && answer.trim().length <= maxLen;

  const displayTemplate = node.template.replace(
    /_{2,}|{{blank}}/g,
    () => '________',
  );

  return (
    <div className="step code-step">
      {node.title && <h2 className="step-title">{node.title}</h2>}
      <div className="step-body">{renderStoryText(node.text)}</div>
      <pre className="code-template" aria-label="Koodipohja">
        <code>{displayTemplate}</code>
      </pre>
      <label className="code-input-label">
        Täydennä tyhjä kohta ({minLen}–{maxLen} merkkiä)
        <input
          type="text"
          className="code-input"
          value={answer}
          disabled={disabled}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && valid && !disabled) onSubmit(answer);
          }}
          autoComplete="off"
          spellCheck={false}
          maxLength={maxLen}
        />
      </label>
      {node.hint && <p className="hint">💡 {node.hint}</p>}
      <button
        type="button"
        className="btn btn-primary"
        disabled={!valid || disabled}
        onClick={() => onSubmit(answer)}
      >
        Loihdu!
      </button>
    </div>
  );
}
