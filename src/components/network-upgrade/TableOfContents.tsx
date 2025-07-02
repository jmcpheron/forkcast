import React from 'react';

interface TOCItem {
  id: string;
  label: string;
  type: 'section' | 'eip';
  count: number | null;
}

interface TableOfContentsProps {
  items: TOCItem[];
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  items,
  activeSection,
  onSectionClick
}) => {
  return (
    <div className="hidden lg:block w-64 flex-shrink-0">
      <div className="sticky top-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wide">Contents</h3>
        <nav className="space-y-1">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionClick(item.id)}
              className={`w-full text-left rounded transition-colors ${
                item.type === 'section' 
                  ? `px-3 py-2 text-sm ${
                      activeSection === item.id
                        ? 'bg-purple-100 text-purple-800 font-medium'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  : `px-6 py-1.5 text-xs ${
                      activeSection === item.id
                        ? 'bg-purple-50 text-purple-700 font-medium'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={item.type === 'eip' ? 'truncate' : ''}>{item.label}</span>
                {item.count && (
                  <span className="text-xs text-slate-400 flex-shrink-0 ml-2">{item.count}</span>
                )}
              </div>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}; 