import type { ReactNode } from 'react';

/** Simple markdown-ish rendering: **bold**, `code`, ``` blocks, newlines */
export function renderStoryText(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const blocks = text.split(/(```[\s\S]*?```)/g);

  blocks.forEach((block, bi) => {
    if (block.startsWith('```')) {
      const code = block.replace(/^```\w*\n?/, '').replace(/```$/, '');
      parts.push(
        <pre key={`code-${bi}`} className="story-code-block">
          <code>{code.trim()}</code>
        </pre>,
      );
      return;
    }

    const lines = block.split('\n');
    lines.forEach((line, li) => {
      if (li > 0) parts.push(<br key={`br-${bi}-${li}`} />);
      renderInline(line, `inline-${bi}-${li}`, parts);
    });
  });

  return parts;
}

function renderInline(line: string, key: string, out: ReactNode[]) {
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > last) {
      out.push(<span key={`${key}-t${i++}`}>{line.slice(last, match.index)}</span>);
    }
    const token = match[0];
    if (token.startsWith('**')) {
      out.push(
        <strong key={`${key}-b${i++}`}>{token.slice(2, -2)}</strong>,
      );
    } else if (token.startsWith('`')) {
      out.push(
        <code key={`${key}-c${i++}`} className="story-inline-code">
          {token.slice(1, -1)}
        </code>,
      );
    }
    last = match.index + token.length;
  }
  if (last < line.length) {
    out.push(<span key={`${key}-end`}>{line.slice(last)}</span>);
  }
}
