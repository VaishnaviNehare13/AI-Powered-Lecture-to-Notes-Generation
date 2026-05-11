import React, { useEffect, useState } from 'react';

const TableOfContents = ({ content }) => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    // Extract h2 headings from markdown string
    const matches = content.match(/^##\s+(.+)$/gm);
    if (matches) {
      const extracted = matches.map(m => {
        const title = m.replace('## ', '').trim();
        const id = title.toLowerCase().replace(/\s+/g, '-');
        return { title, id };
      });
      setHeadings(extracted);
      if (extracted.length > 0) setActiveId(extracted[0].id);
    }
  }, [content]);

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean);
      for (const el of headingElements) {
        const rect = el.getBoundingClientRect();
        // If element is near top of viewport
        if (rect.top >= 0 && rect.top <= 200) {
          setActiveId(el.id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="sticky top-24">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Table of Contents</h3>
      <nav className="space-y-1.5 border-l-2 border-slate-100 dark:border-slate-800">
        {headings.map(h => (
          <a 
            key={h.id} 
            href={`#${h.id}`}
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById(h.id);
              if(el) {
                const y = el.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({top: y, behavior: 'smooth'});
              }
              setActiveId(h.id);
            }}
            className={`block pl-4 py-1.5 text-sm transition-all border-l-2 -ml-[2px] ${
              activeId === h.id 
                ? 'border-blue-500 text-blue-600 dark:text-blue-400 font-semibold' 
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            {h.title}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default TableOfContents;
