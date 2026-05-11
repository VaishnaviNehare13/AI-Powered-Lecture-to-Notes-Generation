import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none w-full">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({node, ...props}) => <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-8 border-b border-slate-100 dark:border-slate-800 pb-6" {...props} />,
          h2: ({node, ...props}) => {
            const id = props.children[0]?.toString().toLowerCase().replace(/\s+/g, '-');
            return <h2 id={id} className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-12 mb-6 scroll-mt-24" {...props} />
          },
          h3: ({node, ...props}) => <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mt-8 mb-4" {...props} />,
          p: ({node, ...props}) => <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-5" {...props} />,
          ul: ({node, ...props}) => <ul className="space-y-3 mb-8" {...props} />,
          li: ({node, ...props}) => (
            <li className="flex items-start gap-3 text-slate-600 dark:text-slate-300 group">
              <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 mt-2.5 group-hover:bg-blue-500 transition-colors shrink-0" />
              <span className="leading-relaxed flex-1">{props.children}</span>
            </li>
          ),
          strong: ({node, ...props}) => <strong className="font-semibold text-blue-700 dark:text-blue-400" {...props} />,
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <div className="rounded-xl overflow-hidden my-8 shadow-sm">
                <SyntaxHighlighter
                  children={String(children).replace(/\n$/, '')}
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  className="!m-0 !p-6"
                  {...props}
                />
              </div>
            ) : (
              <code className="bg-slate-100 dark:bg-slate-800 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded-md text-sm font-mono border border-slate-200 dark:border-slate-700" {...props}>
                {children}
              </code>
            )
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
