import React from 'react';
import katex from 'katex';

interface MathTextProps {
  content: string;
  className?: string;
}

export const MathText: React.FC<MathTextProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Render LaTeX math delimiters: $$...$$ for block, $...$ for inline
  // If no math delimiters, check for simple LaTeX expressions like \frac, \sqrt, ^, _
  const renderWithMath = (text: string) => {
    // Regex matching $$...$$ or $...$
    const parts = [];
    const regex = /(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        parts.push({
          type: 'text',
          value: text.substring(lastIndex, matchIndex),
        });
      }

      const matchStr = match[0];
      const isBlock = matchStr.startsWith('$$');
      const formula = isBlock
        ? matchStr.slice(2, -2).trim()
        : matchStr.slice(1, -1).trim();

      try {
        const rendered = katex.renderToString(formula, {
          displayMode: isBlock,
          throwOnError: false,
        });
        parts.push({
          type: 'math',
          html: rendered,
          isBlock,
        });
      } catch {
        parts.push({
          type: 'text',
          value: matchStr,
        });
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        value: text.substring(lastIndex),
      });
    }

    return parts;
  };

  const parts = renderWithMath(content);

  return (
    <span className={`inline-math-container leading-relaxed ${className}`}>
      {parts.map((p, idx) => {
        if (p.type === 'math' && p.html) {
          return (
            <span
              key={idx}
              className={p.isBlock ? 'block my-2 text-center overflow-x-auto' : 'inline-block mx-0.5 align-middle'}
              dangerouslySetInnerHTML={{ __html: p.html }}
            />
          );
        }
        // Split by newlines to respect formatting
        const textLines = (p.value || '').split('\n');
        return (
          <React.Fragment key={idx}>
            {textLines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {line}
                {lIdx < textLines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </React.Fragment>
        );
      })}
    </span>
  );
};
