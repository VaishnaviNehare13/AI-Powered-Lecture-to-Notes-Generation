import React from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import TableOfContents from './TableOfContents';

const NotesRenderer = ({ content }) => {
  if (!content) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full mx-auto items-start">
      {/* Sidebar TOC - Hidden on smaller screens */}
      <div className="hidden lg:block w-64 shrink-0">
        <TableOfContents content={content} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-sm min-w-0 w-full relative">
        <MarkdownRenderer content={content} />
      </div>
    </div>
  );
};

export default NotesRenderer;
