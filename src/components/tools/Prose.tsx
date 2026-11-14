import React from 'react';

interface ProseProps {
  content?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Clean inline markdown formatting:
 * - Bold: **text** -> <strong>text</strong>
 * - Code: `code` -> <code>code</code>
 * - LaTeX: $formula$ or $$formula$$ -> <code>formula</code> (removes raw delimiters)
 * - Links: [label](url) -> <a href="url">label</a>
 */
function formatInline(text: string): string {
  let res = text;

  // Clean out any raw LaTeX delimiters ($...$ and $$...$$) and render as styled code
  res = res.replace(/\$\$(.+?)\$\$/g, '<code>$1</code>');
  res = res.replace(/\$([^\$\n]+?)\$/g, '<code>$1</code>');

  // Inline code: `code`
  res = res.replace(/`([^`]+?)`/g, '<code>$1</code>');

  // Bold: **text**
  res = res.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');

  // Links: [label](url)
  res = res.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  return res;
}

/**
 * Accessible Markdown / Prose renderer for Tool educational descriptions
 */
export const Prose: React.FC<ProseProps> = ({ content, className = '', children }) => {
  if (children) {
    return <div className={`prose ${className}`}>{children}</div>;
  }

  if (!content) return null;

  // Split into structural blocks separated by two or more newlines
  const blocks = content.split(/\n\n+/);

  return (
    <div className={`prose ${className}`}>
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Check for H2: ## Heading
        if (trimmed.startsWith('## ')) {
          const text = trimmed.replace(/^##\s+/, '');
          return (
            <h2
              key={i}
              dangerouslySetInnerHTML={{ __html: formatInline(text) }}
            />
          );
        }

        // Check for H3: ### Heading
        if (trimmed.startsWith('### ')) {
          const text = trimmed.replace(/^###\s+/, '');
          return (
            <h3
              key={i}
              dangerouslySetInnerHTML={{ __html: formatInline(text) }}
            />
          );
        }

        // Check for Callouts / Blockquotes: > [!NOTE] or > text
        if (trimmed.startsWith('>')) {
          const lines = trimmed.split('\n').map((l) => l.replace(/^>\s?/, ''));
          const joined = lines.join(' ');
          let calloutType = 'note';
          let body = joined;

          if (joined.startsWith('[!NOTE]')) {
            calloutType = 'note';
            body = joined.replace(/^\[!NOTE\]\s*/i, '');
          } else if (joined.startsWith('[!TIP]')) {
            calloutType = 'tip';
            body = joined.replace(/^\[!TIP\]\s*/i, '');
          } else if (joined.startsWith('[!WARNING]') || joined.startsWith('[!CAUTION]')) {
            calloutType = 'warning';
            body = joined.replace(/^\[!(WARNING|CAUTION)\]\s*/i, '');
          }

          return (
            <div
              key={i}
              className={`prose-callout ${calloutType}`}
              dangerouslySetInnerHTML={{ __html: formatInline(body) }}
            />
          );
        }

        // Check for Markdown table: starts and contains pipe |
        if (trimmed.includes('|') && trimmed.includes('\n')) {
          const lines = trimmed.split('\n').filter((l) => l.includes('|'));
          if (lines.length >= 2) {
            const headerCells = lines[0]
              .split('|')
              .map((c) => c.trim())
              .filter((c, idx, arr) => (idx > 0 && idx < arr.length - 1) || c.length > 0);
            
            // Row 1 is divider (|---|---|)
            const bodyRows = lines.slice(2).map((row) =>
              row
                .split('|')
                .map((c) => c.trim())
                .filter((c, idx, arr) => (idx > 0 && idx < arr.length - 1) || c.length > 0)
            );

            return (
              <div key={i} className="prose-table-container">
                <table>
                  <thead>
                    <tr>
                      {headerCells.map((cell, cIdx) => (
                        <th
                          key={cIdx}
                          dangerouslySetInnerHTML={{ __html: formatInline(cell) }}
                        />
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bodyRows.map((r, rIdx) => (
                      <tr key={rIdx}>
                        {r.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            dangerouslySetInnerHTML={{ __html: formatInline(cell) }}
                          />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
        }

        // Check for numbered list or unordered list items
        if (/^(\d+\.|\-|\*)\s/.test(trimmed)) {
          const lines = trimmed.split('\n');
          const isOrdered = /^\d+\.\s/.test(trimmed);

          if (isOrdered) {
            return (
              <ol key={i}>
                {lines.map((line, idx) => {
                  const cleaned = line.replace(/^\d+\.\s+/, '');
                  return (
                    <li
                      key={idx}
                      dangerouslySetInnerHTML={{ __html: formatInline(cleaned) }}
                    />
                  );
                })}
              </ol>
            );
          }

          return (
            <ul key={i}>
              {lines.map((line, idx) => {
                const cleaned = line.replace(/^[-*]\s+/, '');
                return (
                  <li
                    key={idx}
                    dangerouslySetInnerHTML={{ __html: formatInline(cleaned) }}
                  />
                );
              })}
            </ul>
          );
        }

        // Standard Paragraph
        return (
          <p
            key={i}
            dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }}
          />
        );
      })}
    </div>
  );
};

export default Prose;
