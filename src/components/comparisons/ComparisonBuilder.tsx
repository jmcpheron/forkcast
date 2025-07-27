import { useState } from 'react';
import { EIPComparison } from '../../types/comparison';
import ComparisonRenderer from './ComparisonRenderer';
import { eipDataService } from '../../services/eipDataService';

// Icon components
const ChevronDown = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ChevronUp = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
);

const Trash2 = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

interface ComparisonBuilderProps {
  selectedEips: number[];
  onComplete: (comparison: EIPComparison) => void;
  onBack: () => void;
}

export default function ComparisonBuilder({ selectedEips, onComplete, onBack }: ComparisonBuilderProps) {
  const [activeSection, setActiveSection] = useState<string>('meta');
  const [showPreview, setShowPreview] = useState(false);
  
  // Initialize comparison with required fields
  const [comparison, setComparison] = useState<EIPComparison>(() => {
    const sections: any[] = [
      {
        type: 'author-preference',
        preferredEip: selectedEips[0],
        strength: 'strong',
        reasoning: ''
      }
    ];

    return {
      meta: {
        title: '',
        author: '',
        created: new Date().toISOString().split('T')[0],
        description: ''
      },
      eips: selectedEips,
      sections
    };
  });

  // Update meta fields
  const updateMeta = (field: string, value: string) => {
    setComparison(prev => ({
      ...prev,
      meta: { ...prev.meta, [field]: value }
    }));
  };

  // Update author preference
  const updateAuthorPreference = (field: string, value: any) => {
    setComparison(prev => ({
      ...prev,
      sections: prev.sections.map((section, idx) => 
        idx === 0 && section.type === 'author-preference'
          ? { ...section, [field]: value }
          : section
      )
    }));
  };

  // Add a new section
  const addSection = (type: string) => {
    const newSection: any = { type };
    
    // Initialize section with default values based on type
    switch (type) {
      case 'header':
        newSection.content = 'New Section';
        break;
      case 'text':
        newSection.content = '';
        break;
      case 'quick-stats':
        newSection.stats = {};
        selectedEips.forEach(eip => {
          newSection.stats[eip] = [
            { icon: '🎯', label: 'Key Benefit', value: '' },
            { icon: '⚠️', label: 'Key Risk', value: '', color: 'yellow' }
          ];
        });
        break;
      case 'northstar-comparison':
        newSection.northStars = ['Scale L1', 'Scale blobs', 'Improve UX'];
        newSection.alignment = {};
        selectedEips.forEach(eip => {
          newSection.alignment[eip] = {
            'Scale L1': { impact: 'Medium', icon: '🟡', description: '' },
            'Scale blobs': { impact: 'Medium', icon: '🟡', description: '' },
            'Improve UX': { impact: 'Medium', icon: '🟡', description: '' }
          };
        });
        break;
      case 'benefits-tradeoffs':
        newSection.data = {};
        selectedEips.forEach(eip => {
          newSection.data[eip] = {
            benefits: [{ text: '', icon: '✅' }],
            tradeoffs: [{ text: '', severity: 'medium', icon: '⚠️' }]
          };
        });
        break;
      case 'debate':
        newSection.topic = '';
        newSection.perspectives = [
          { label: '', author: '', argument: '', evidence: [] },
          { label: '', author: '', argument: '', evidence: [] }
        ];
        break;
      case 'summary':
        newSection.content = '';
        break;
    }
    
    setComparison(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  // Remove a section
  const removeSection = (index: number) => {
    if (index === 0) return; // Don't remove author preference
    setComparison(prev => ({
      ...prev,
      sections: prev.sections.filter((_, idx) => idx !== index)
    }));
  };

  // Update section content
  const updateSection = (index: number, updates: any) => {
    setComparison(prev => ({
      ...prev,
      sections: prev.sections.map((section, idx) => 
        idx === index ? { ...section, ...updates } : section
      )
    }));
  };

  const sectionTypes = [
    { type: 'header', label: 'Section Header', icon: '📝' },
    { type: 'text', label: 'Text Paragraph', icon: '📄' },
    { type: 'quick-stats', label: 'Quick Stats (Your Analysis)', icon: '📊' },
    { type: 'northstar-comparison', label: 'North Star Alignment (Your View)', icon: '⭐' },
    { type: 'benefits-tradeoffs', label: 'Benefits & Tradeoffs (Your Take)', icon: '⚖️' },
    { type: 'stakeholder-impacts', label: 'Stakeholder Impacts (Your Analysis)', icon: '👥' },
    { type: 'debate', label: 'Debate Section', icon: '🗣️' },
    { type: 'argument', label: 'Argument', icon: '💭' },
    { type: 'risk-analysis', label: 'Risk Analysis', icon: '🎲' },
    { type: 'timeline-comparison', label: 'Timeline Comparison', icon: '⏱️' },
    { type: 'tradeoff-matrix', label: 'Tradeoff Matrix', icon: '📈' },
    { type: 'callout', label: 'Callout Box', icon: 'ℹ️' },
    { type: 'summary', label: 'Summary', icon: '📋' }
  ];

  if (showPreview) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Preview Your Comparison
          </h2>
          <div className="flex gap-4">
            <button
              onClick={() => setShowPreview(false)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Back to Editor
            </button>
            <button
              onClick={() => {
                // Build final comparison with Forkcast data inserted after executive summary
                const finalSections = [...comparison.sections];
                
                // Find where to insert Forkcast data (after quick-stats/executive summary)
                let insertIndex = 1; // Default after author preference
                for (let i = 1; i < finalSections.length; i++) {
                  if (finalSections[i].type === 'quick-stats' || 
                      (finalSections[i].type === 'header' && (finalSections[i] as any).content?.includes('Executive Summary'))) {
                    insertIndex = i + 1;
                    // Look for the next non-quick-stats section
                    while (insertIndex < finalSections.length && 
                           (finalSections[insertIndex].type === 'quick-stats' || 
                            finalSections[insertIndex].type === 'text')) {
                      insertIndex++;
                    }
                    break;
                  }
                }
                
                // Build Forkcast sections
                const forkcastSections: any[] = [];
                let hasData = false;
                selectedEips.forEach((eipId) => {
                  const forkcastData = eipDataService.getForkcastData(eipId);
                  if (forkcastData && eipDataService.hasForkcastData(eipId)) {
                    if (!hasData) {
                      forkcastSections.push({
                        type: 'header',
                        content: 'Forkcast Data',
                        level: 2
                      });
                      hasData = true;
                    }
                    forkcastSections.push({
                      type: 'forkcast-facts',
                      source: 'forkcast',
                      eipId: eipId,
                      data: {
                        laymanDescription: forkcastData.laymanDescription,
                        benefits: forkcastData.benefits,
                        tradeoffs: forkcastData.tradeoffs,
                        northStarAlignment: forkcastData.northStarAlignment,
                        stakeholderImpacts: forkcastData.stakeholderImpacts
                      }
                    });
                  }
                });
                
                // Insert Forkcast sections at the appropriate position
                finalSections.splice(insertIndex, 0, ...forkcastSections);
                
                onComplete({
                  ...comparison,
                  sections: finalSections
                });
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Finish & Share
            </button>
          </div>
        </div>
        
        <ComparisonRenderer comparison={comparison} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Build Your Comparison
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-3">
          Fill out each section to create your EIP comparison. Your preference is already at the top!
        </p>
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg">
          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <span>📊</span> About Forkcast Data
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Gray sections labeled "Forkcast Data" contain compiled information from our EIP repository. 
            These provide factual baselines about each EIP. You can't edit these, but you should add your 
            own analysis sections (benefits, tradeoffs, etc.) to share YOUR perspective on top of these facts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Sections */}
        <div className="lg:col-span-2 space-y-4">
          {/* Meta Information */}
          <div className={`border rounded-lg p-4 ${activeSection === 'meta' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
            <button
              onClick={() => setActiveSection(activeSection === 'meta' ? '' : 'meta')}
              className="w-full flex items-center justify-between text-left"
            >
              <h3 className="font-medium text-slate-900 dark:text-slate-100">
                📋 Comparison Details
              </h3>
              {activeSection === 'meta' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            {activeSection === 'meta' && (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={comparison.meta.title}
                    onChange={(e) => updateMeta('title', e.target.value)}
                    placeholder="e.g., ePBS vs 6-Second Slots: Glamsterdam's Fork Choice"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Author (include Twitter)
                  </label>
                  <input
                    type="text"
                    value={comparison.meta.author}
                    onChange={(e) => updateMeta('author', e.target.value)}
                    placeholder="Your Name (yourname.eth @twitter)"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={comparison.meta.description}
                    onChange={(e) => updateMeta('description', e.target.value)}
                    placeholder="One sentence explaining what you're comparing and why"
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Author Preference (always first) */}
          <div className={`border rounded-lg p-4 bg-green-50 dark:bg-green-900/20 border-green-500`}>
            <button
              onClick={() => setActiveSection(activeSection === 'preference' ? '' : 'preference')}
              className="w-full flex items-center justify-between text-left"
            >
              <h3 className="font-medium text-green-800 dark:text-green-200">
                🎯 Your Preference (Required)
              </h3>
              {activeSection === 'preference' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            {activeSection === 'preference' && (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Which EIP do you prefer?
                  </label>
                  <select
                    value={(comparison.sections[0] as any).preferredEip}
                    onChange={(e) => updateAuthorPreference('preferredEip', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
                  >
                    {selectedEips.map(eip => (
                      <option key={eip} value={eip}>EIP-{eip}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    How strongly?
                  </label>
                  <select
                    value={(comparison.sections[0] as any).strength}
                    onChange={(e) => updateAuthorPreference('strength', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
                  >
                    <option value="strong">Strongly Prefer</option>
                    <option value="moderate">Moderately Prefer</option>
                    <option value="slight">Slightly Prefer</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Why do you prefer this EIP?
                  </label>
                  <textarea
                    value={(comparison.sections[0] as any).reasoning}
                    onChange={(e) => updateAuthorPreference('reasoning', e.target.value)}
                    placeholder="Explain your preference - be specific about tradeoffs and why this aligns with your values"
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Additional Sections */}
          {comparison.sections.slice(1).map((section, idx) => (
              <SectionEditor
                key={idx + 1}
                section={section}
                index={idx + 1}
                selectedEips={selectedEips}
                isActive={activeSection === `section-${idx + 1}`}
                onToggle={() => setActiveSection(activeSection === `section-${idx + 1}` ? '' : `section-${idx + 1}`)}
                onUpdate={(updates: any) => updateSection(idx + 1, updates)}
                onRemove={() => removeSection(idx + 1)}
              />
          ))}
        </div>

        {/* Right Panel: Add Sections & Actions */}
        <div className="space-y-4">
          <div className="sticky top-6">
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-4">
                Add Section
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {sectionTypes.map(({ type, label, icon }) => (
                  <button
                    key={type}
                    onClick={() => addSection(type)}
                    className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <span>{icon}</span>
                    <span className="text-sm">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <button
                onClick={() => setShowPreview(true)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Preview Comparison
              </button>
              
              <button
                onClick={onBack}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Back to EIP Selection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Section Editor Component
function SectionEditor({ 
  section, 
  selectedEips, 
  isActive, 
  onToggle, 
  onUpdate, 
  onRemove 
}: any) {
  const getSectionIcon = (type: string) => {
    const icons: Record<string, string> = {
      header: '📝',
      text: '📄',
      'quick-stats': '📊',
      'northstar-comparison': '⭐',
      'benefits-tradeoffs': '⚖️',
      'stakeholder-impacts': '👥',
      'forkcast-facts': '📊',
      debate: '🗣️',
      argument: '💭',
      'risk-analysis': '🎲',
      'timeline-comparison': '⏱️',
      'tradeoff-matrix': '📈',
      callout: 'ℹ️',
      summary: '📋'
    };
    return icons[type] || '📄';
  };

  const getSectionLabel = (type: string) => {
    const labels: Record<string, string> = {
      header: 'Section Header',
      text: 'Text Paragraph',
      'quick-stats': 'Quick Stats',
      'northstar-comparison': 'North Star Alignment',
      'benefits-tradeoffs': 'Benefits & Tradeoffs',
      'stakeholder-impacts': 'Stakeholder Impacts',
      debate: 'Debate',
      argument: 'Argument',
      'risk-analysis': 'Risk Analysis',
      'timeline-comparison': 'Timeline Comparison',
      'tradeoff-matrix': 'Tradeoff Matrix',
      callout: 'Callout',
      summary: 'Summary'
    };
    return labels[type] || type;
  };

  return (
    <div className={`border rounded-lg p-4 ${isActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
      <div className="flex items-center justify-between">
        <button
          onClick={onToggle}
          className="flex-1 flex items-center gap-2 text-left"
        >
          <span>{getSectionIcon(section.type)}</span>
          <h3 className="font-medium text-slate-900 dark:text-slate-100">
            {getSectionLabel(section.type)}
          </h3>
          {isActive ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        <button
          onClick={onRemove}
          className="ml-2 p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {isActive && (
        <div className="mt-4">
          {section.type === 'header' && (
            <input
              type="text"
              value={section.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              placeholder="Section title"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
            />
          )}

          {section.type === 'text' && (
            <textarea
              value={section.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              placeholder="Write your analysis here..."
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
            />
          )}

          {section.type === 'quick-stats' && (
            <div className="space-y-4">
              {selectedEips.map((eip: number) => (
                <div key={eip} className="border border-slate-200 dark:border-slate-600 rounded p-3">
                  <h4 className="font-medium mb-2">EIP-{eip}</h4>
                  {section.stats[eip]?.map((stat: any, idx: number) => (
                    <div key={idx} className="grid grid-cols-3 gap-2 mb-2">
                      <input
                        type="text"
                        value={stat.icon}
                        onChange={(e) => {
                          const newStats = [...section.stats[eip]];
                          newStats[idx] = { ...newStats[idx], icon: e.target.value };
                          onUpdate({ stats: { ...section.stats, [eip]: newStats } });
                        }}
                        placeholder="Icon"
                        className="px-2 py-1 border rounded"
                      />
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const newStats = [...section.stats[eip]];
                          newStats[idx] = { ...newStats[idx], label: e.target.value };
                          onUpdate({ stats: { ...section.stats, [eip]: newStats } });
                        }}
                        placeholder="Label"
                        className="px-2 py-1 border rounded"
                      />
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => {
                          const newStats = [...section.stats[eip]];
                          newStats[idx] = { ...newStats[idx], value: e.target.value };
                          onUpdate({ stats: { ...section.stats, [eip]: newStats } });
                        }}
                        placeholder="Value"
                        className="px-2 py-1 border rounded"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newStats = [...section.stats[eip], { icon: '📊', label: '', value: '' }];
                      onUpdate({ stats: { ...section.stats, [eip]: newStats } });
                    }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    + Add stat
                  </button>
                </div>
              ))}
            </div>
          )}

          {section.type === 'summary' && (
            <textarea
              value={section.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              placeholder="Summarize your comparison and restate your preference..."
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
            />
          )}

          {/* Add more section type editors as needed */}
        </div>
      )}
    </div>
  );
}