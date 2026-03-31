import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function DocsPage() {
  const { page = 'jarvis' } = useParams();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDoc() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/docs/${page}.md`);
        if (!response.ok) {
          throw new Error(`Failed to load ${page}.md`);
        }
        const text = await response.text();
        setContent(text);
      } catch (err) {
        console.error('Error loading doc:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    loadDoc();
  }, [page]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-jarvis-cyan font-body text-lg">Loading documentation...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-jarvis-bg-surface border border-jarvis-orange/30 rounded-lg p-8">
          <h2 className="text-2xl font-display text-jarvis-orange mb-4">ERROR</h2>
          <p className="text-jarvis-text-secondary font-body">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <article className="prose prose-invert prose-cyan max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-4xl font-display text-jarvis-cyan mb-6 border-b border-jarvis-cyan/30 pb-4">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-3xl font-display text-jarvis-cyan mt-8 mb-4">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-2xl font-display text-jarvis-purple mt-6 mb-3">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-jarvis-text-primary font-body leading-relaxed mb-4">
                {children}
              </p>
            ),
            code: ({ children, className }) =>
              className ? (
                <code className="block bg-jarvis-bg-card text-jarvis-cyan p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  {children}
                </code>
              ) : (
                <code className="bg-jarvis-bg-card text-jarvis-cyan px-2 py-1 rounded font-mono text-sm">
                  {children}
                </code>
              ),
            pre: ({ children }) => (
              <pre className="bg-jarvis-bg-card p-4 rounded-lg overflow-x-auto mb-4">
                {children}
              </pre>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside space-y-2 mb-4 text-jarvis-text-primary font-body">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside space-y-2 mb-4 text-jarvis-text-primary font-body">
                {children}
              </ol>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                className="text-jarvis-cyan hover:text-jarvis-purple transition-colors underline"
                target={href?.startsWith('http') ? '_blank' : undefined}
                rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {children}
              </a>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-jarvis-cyan pl-4 py-2 text-jarvis-text-secondary italic mb-4">
                {children}
              </blockquote>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border border-jarvis-cyan/20">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="bg-jarvis-bg-card border border-jarvis-cyan/20 px-4 py-2 text-left text-jarvis-cyan font-body font-semibold">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-jarvis-cyan/20 px-4 py-2 text-jarvis-text-primary font-body">
                {children}
              </td>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </div>
  );
}
