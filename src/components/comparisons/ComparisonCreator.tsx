import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import eipsData from '../../data/eips.json';
import { EIPComparison } from '../../types/comparison';
import { EIP } from '../../types/eip';
import ComparisonRenderer from './ComparisonRenderer';
import ComparisonBuilder from './ComparisonBuilder';
import { loadExampleComparison } from './ExampleLoader';
import { eipDataService } from '../../services/eipDataService';
import Navigation from '../Navigation';

export default function ComparisonCreator() {
  const navigate = useNavigate();
  const [selectedEips, setSelectedEips] = useState<number[]>([]);
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<EIPComparison | null>(null);
  const [step, setStep] = useState<'select' | 'build' | 'paste' | 'preview'>('select');
  const [showGistModal, setShowGistModal] = useState(false);
  
  // Cast eipsData to the correct type
  const typedEips = eipsData as EIP[];
  
  // Filter for Glamsterdam headliner EIPs
  const glamsterdamEips = typedEips.filter(eip => 
    eip.forkRelationships?.some(rel => 
      rel.forkName === 'Glamsterdam' && 
      rel.isHeadliner === true &&
      rel.status === 'Proposed'
    )
  );
  
  // Group by layer
  const clEips = glamsterdamEips.filter(eip => 
    eip.forkRelationships?.find(rel => rel.forkName === 'Glamsterdam')?.layer === 'CL'
  );
  const elEips = glamsterdamEips.filter(eip => 
    eip.forkRelationships?.find(rel => rel.forkName === 'Glamsterdam')?.layer === 'EL'
  );

  const generateTemplate = () => {
    // Check which EIPs have Forkcast data
    const eipsWithData = selectedEips.filter(eip => eipDataService.hasForkcastData(eip));
    
    // Build Forkcast facts sections
    let forkcastSections = '';
    if (eipsWithData.length > 0) {
      forkcastSections = `
    {
      "type": "header",
      "content": "Forkcast Data",
      "level": 2
    },`;
      
      eipsWithData.forEach(eip => {
        forkcastSections += `
    {
      "type": "forkcast-facts",
      "source": "forkcast",
      "eipId": ${eip},
      "data": "AUTO-POPULATED FROM FORKCAST REPOSITORY"
    },`;
      });
    }
    
    const templateStructure = `{
  "meta": {
    "title": "[Your comparison title - be specific]",
    "author": "[Your Name] ([ENS/handle] @x_handle)",
    "created": "${new Date().toISOString().split('T')[0]}",
    "description": "[One sentence explaining what you're comparing and why it matters]"
  },
  "eips": [${selectedEips.join(', ')}],
  "sections": [
    {
      "type": "author-preference",
      "preferredEip": ${selectedEips[0]},
      "strength": "strong",
      "reasoning": "[Explain why you prefer this EIP - be specific about the tradeoffs and why this choice aligns with your values/priorities for Ethereum]"
    },
    {
      "type": "header",
      "content": "Executive Summary"
    },
    {
      "type": "quick-stats",
      "stats": {
        "${selectedEips[0]}": [
          { "icon": "🎯", "label": "Key Benefit", "value": "[Main advantage]" },
          { "icon": "⚠️", "label": "Key Risk", "value": "[Main concern]", "color": "yellow" },
          { "icon": "🔧", "label": "Complexity", "value": "Medium", "color": "yellow" }
        ],
        ${selectedEips.slice(1).map(eip => `"${eip}": [
          { "icon": "🎯", "label": "Key Benefit", "value": "[Main advantage]" },
          { "icon": "⚠️", "label": "Key Risk", "value": "[Main concern]", "color": "yellow" },
          { "icon": "🔧", "label": "Complexity", "value": "Medium", "color": "yellow" }
        ]`).join(',\n        ')}
      }
    },${forkcastSections}
    {
      "type": "northstar-comparison",
      "northStars": ["Scale L1", "Scale blobs", "Improve UX"],
      "alignment": {
        ${selectedEips.map(eip => `"${eip}": {
          "Scale L1": {
            "impact": "Medium",
            "icon": "🟡",
            "description": "[How does EIP-${eip} impact L1 scaling?]"
          },
          "Scale blobs": {
            "impact": "Medium",
            "icon": "🟡",
            "description": "[How does EIP-${eip} impact blob scaling?]"
          },
          "Improve UX": {
            "impact": "Medium",
            "icon": "🟡",
            "description": "[How does EIP-${eip} improve user experience?]"
          }
        }`).join(',\n        ')}
      }
    },
    {
      "type": "stakeholder-impacts",
      "stakeholders": ["endUsers", "appDevs", "walletDevs", "toolingInfra", "layer2s", "stakersNodes", "clClients", "elClients"],
      "impacts": {
        ${selectedEips.map(eip => `"${eip}": {
          "endUsers": {
            "impact": "Medium",
            "icon": "😐",
            "description": "[How are end users affected?]"
          },
          "appDevs": {
            "impact": "Medium",
            "icon": "🔄",
            "description": "[How are app developers affected?]"
          },
          "layer2s": {
            "impact": "Medium",
            "icon": "📈",
            "description": "[How are L2s affected?]"
          },
          "clClients": {
            "impact": "Medium",
            "icon": "🔧",
            "description": "[Implementation complexity for consensus clients]"
          }
        }`).join(',\n        ')}
      }
    },
    {
      "type": "benefits-tradeoffs",
      "data": {
        ${selectedEips.map(eip => `"${eip}": {
          "benefits": [
            { "text": "[Key benefit 1]", "icon": "✅" },
            { "text": "[Key benefit 2]", "icon": "✅" }
          ],
          "tradeoffs": [
            { "text": "[Tradeoff or risk 1]", "severity": "medium", "icon": "⚠️" },
            { "text": "[Tradeoff or risk 2]", "severity": "medium", "icon": "⚠️" }
          ]
        }`).join(',\n        ')}
      }
    },
    {
      "type": "debate",
      "topic": "[Contentious topic - e.g., 'Is the free option problem significant?']",
      "perspectives": [
        {
          "label": "[Position 1]",
          "author": "[Optional: who holds this view]",
          "argument": "[Detailed argument]",
          "evidence": ["[Link or reference]"]
        },
        {
          "label": "[Position 2]",
          "author": "[Optional: who holds this view]",
          "argument": "[Counter-argument]",
          "evidence": ["[Link or reference]"]
        }
      ]
    },
    {
      "type": "argument",
      "position": "[Your nuanced take on a specific issue]",
      "points": [
        "[Supporting point 1]",
        "[Supporting point 2]"
      ],
      "counterpoints": [
        "[Acknowledged weakness or counter-argument]"
      ],
      "evidence": [
        "[Link to research, discussion, or data]"
      ]
    },
    {
      "type": "callout",
      "style": "info",
      "title": "[Important consideration]",
      "content": "[Explanation of a key factor that affects the comparison]"
    },
    {
      "type": "tradeoff-matrix",
      "dimensions": [
        {
          "name": "[Key dimension 1 - e.g., Decentralization Impact]",
          "description": "[What this dimension measures]",
          "scores": {
            ${selectedEips.map(eip => `"${eip}": { "score": 5, "icon": "🟡" }`).join(',\n            ')}
          }
        },
        {
          "name": "[Key dimension 2 - e.g., Implementation Risk]",
          "description": "[What this dimension measures]",
          "scores": {
            ${selectedEips.map(eip => `"${eip}": { "score": 5, "icon": "🟡" }`).join(',\n            ')}
          }
        }
      ]
    },
    {
      "type": "summary",
      "content": "[Final thoughts summarizing the key decision points and your overall assessment. End with a clear statement about which EIP you believe should be prioritized and why.]"
    }
  ]
}`;

    return templateStructure;
  };

  const handleEipToggle = (eipId: number) => {
    setSelectedEips(prev => 
      prev.includes(eipId) 
        ? prev.filter(id => id !== eipId)
        : [...prev, eipId]
    );
  };

  const validateAndPreview = () => {
    try {
      const parsed = JSON.parse(jsonInput) as EIPComparison;
      
      // Basic validation
      if (!parsed.meta || !parsed.eips || !parsed.sections) {
        throw new Error('Invalid comparison structure');
      }
      
      // Process forkcast-facts sections - populate with actual data
      parsed.sections = parsed.sections.map(section => {
        if (section.type === 'forkcast-facts' && 'eipId' in section) {
          const eipId = (section as any).eipId;
          const forkcastData = eipDataService.getForkcastData(eipId);
          if (forkcastData) {
            return {
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
            } as any;
          }
        }
        return section;
      });
      
      setError('');
      setPreview(parsed);
      setStep('preview');
    } catch (e) {
      setError(`Invalid JSON: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  };

  // TODO: Implement persistent storage before enabling share functionality
  // const generateShareableUrl = () => {
  //   if (!preview) return;
  //   
  //   // Store in localStorage with a hash
  //   const hash = btoa(Math.random().toString(36).substring(7));
  //   localStorage.setItem(`comparison-${hash}`, JSON.stringify(preview));
  //   
  //   // Navigate to the comparison page
  //   navigate(`/compare/${hash}`);
  // };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (step === 'select') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navigation />
        <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          Create Glamsterdam EIP Comparison
        </h1>
        
        <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg">
          <h3 className="font-medium text-purple-800 dark:text-purple-200 mb-2">
            🏗️ About Glamsterdam
          </h3>
          <p className="text-sm text-purple-700 dark:text-purple-300 mb-2">
            Glamsterdam will include one consensus layer (CL) headliner and one execution layer (EL) headliner. 
            Multiple proposals are competing for each slot, and this tool helps you create thoughtful comparisons 
            between competing proposals.
          </p>
          <p className="text-xs text-purple-600 dark:text-purple-400">
            <strong>Best practice:</strong> Compare EIPs competing for the same layer slot (e.g., ePBS vs 6-second slots for CL).
          </p>
        </div>
        
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
            New to EIP comparisons? Check out our example comparison to see all available features:
          </p>
          <button
            onClick={() => {
              const url = loadExampleComparison();
              navigate(url);
            }}
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
          >
            View Example: ePBS vs 6-Second Slots →
          </button>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-2 italic">
            Don't like someone's take? Fork yourself and make your own comparison! 🍴
          </p>
        </div>
        
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
          <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">
            🎯 Your Comparison, Your Voice
          </h3>
          <p className="text-sm text-green-700 dark:text-green-300 mb-2">
            This is YOUR take on these EIPs. Start with your preference at the top - which EIP do you 
            think should win and why? Don't just analyze, advocate! Your comparison should reflect your 
            values and priorities for Ethereum's future.
          </p>
          <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded">
            <p className="text-xs text-gray-600 dark:text-gray-300">
              <strong>📊 Forkcast Integration:</strong> We automatically include compiled data from Forkcast's 
              EIP repository. These gray sections provide EIP information. Add YOUR analysis and opinions 
              in additional sections to build on these facts.
            </p>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
            Step 1: Select 2 EIPs to Compare
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Choose exactly 2 competing Glamsterdam proposals to compare. For the most meaningful comparison, select EIPs competing for the same layer slot.
          </p>
          
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-6">
            {/* Consensus Layer EIPs */}
            {clEips.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded">CL</span>
                  Consensus Layer Candidates
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {clEips.map(eip => {
                    const glamRel = eip.forkRelationships?.find(rel => rel.forkName === 'Glamsterdam');
                    return (
                      <label 
                        key={eip.id} 
                        className="flex items-start space-x-2 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded cursor-pointer border border-slate-200 dark:border-slate-700"
                      >
                        <input
                          type="checkbox"
                          checked={selectedEips.includes(eip.id)}
                          onChange={() => handleEipToggle(eip.id)}
                          disabled={selectedEips.length >= 2 && !selectedEips.includes(eip.id)}
                          className="rounded border-slate-300 dark:border-slate-600 mt-1"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm text-slate-900 dark:text-slate-100">
                            EIP-{eip.id}: {eip.title}
                          </div>
                          {glamRel?.headlinerDiscussionLink && (
                            <a 
                              href={glamRel.headlinerDiscussionLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View proposal →
                            </a>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Execution Layer EIPs */}
            {elEips.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                  <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs rounded">EL</span>
                  Execution Layer Candidates
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {elEips.map(eip => {
                    const glamRel = eip.forkRelationships?.find(rel => rel.forkName === 'Glamsterdam');
                    return (
                      <label 
                        key={eip.id} 
                        className="flex items-start space-x-2 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded cursor-pointer border border-slate-200 dark:border-slate-700"
                      >
                        <input
                          type="checkbox"
                          checked={selectedEips.includes(eip.id)}
                          onChange={() => handleEipToggle(eip.id)}
                          disabled={selectedEips.length >= 2 && !selectedEips.includes(eip.id)}
                          className="rounded border-slate-300 dark:border-slate-600 mt-1"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm text-slate-900 dark:text-slate-100">
                            EIP-{eip.id}: {eip.title}
                          </div>
                          {glamRel?.headlinerDiscussionLink && (
                            <a 
                              href={glamRel.headlinerDiscussionLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View proposal →
                            </a>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Selected: {selectedEips.length} of 2 EIPs
            </div>
            {selectedEips.length === 2 && (() => {
              const eip1 = glamsterdamEips.find(e => e.id === selectedEips[0]);
              const eip2 = glamsterdamEips.find(e => e.id === selectedEips[1]);
              const layer1 = eip1?.forkRelationships?.find(rel => rel.forkName === 'Glamsterdam')?.layer;
              const layer2 = eip2?.forkRelationships?.find(rel => rel.forkName === 'Glamsterdam')?.layer;
              
              if (layer1 !== layer2) {
                return (
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      <strong>Note:</strong> You've selected EIPs from different layers (CL and EL). 
                      While valid, comparisons are most meaningful between EIPs competing for the same slot.
                    </p>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={() => setStep('build')}
            disabled={selectedEips.length !== 2}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Build Visually →
          </button>
          <button
            onClick={() => setStep('paste')}
            disabled={selectedEips.length !== 2}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Paste JSON →
          </button>
        </div>
        </div>
      </div>
    );
  }

  if (step === 'build') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navigation />
        <ComparisonBuilder
          selectedEips={selectedEips}
          onComplete={(comparison) => {
            setPreview(comparison);
            setStep('preview');
          }}
          onBack={() => setStep('select')}
        />
      </div>
    );
  }

  if (step === 'paste') {
    const template = generateTemplate();
    
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navigation />
        <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          Create Glamsterdam EIP Comparison
        </h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
            Option B: Paste JSON Directly
          </h2>
          
          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Prefer a visual editor?</strong> Go back and click "Build Visually" for a guided interface.
            </p>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-slate-700 dark:text-slate-300">
                Comparison Structure:
              </h3>
              <button
                onClick={() => copyToClipboard(template)}
                className="text-sm px-3 py-1 bg-slate-200 dark:bg-slate-600 rounded hover:bg-slate-300 dark:hover:bg-slate-500"
              >
                Copy Structure
              </button>
            </div>
            <pre className="text-xs overflow-x-auto bg-white dark:bg-slate-800 p-4 rounded border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100">
              {template}
            </pre>
            <div className="mt-2 p-3 bg-slate-100 dark:bg-slate-800 rounded text-xs text-slate-700 dark:text-slate-200">
              <strong>Instructions:</strong>
              <ol className="list-decimal list-inside space-y-1 mt-1">
                <li>Copy this template to your text editor</li>
                <li>Replace [bracketed] placeholders with your content</li>
                <li><strong>Note:</strong> Forkcast facts sections are auto-populated - don't edit these</li>
                <li>Add YOUR analysis in new sections (quick-stats, benefits-tradeoffs, etc.)</li>
                <li>For impact levels: use "High", "Medium", or "Low"</li>
                <li>For colors: use "green", "yellow", or "red"</li>
                <li>For severity: use "low", "medium", or "high"</li>
                <li>Paste the completed JSON below</li>
              </ol>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
              Use this structure to build your comparison of 2 Glamsterdam proposals. Start with YOUR preference at the top - 
              this is your take on which EIP should win and why. Forkcast facts are included automatically 
              to provide repository data.
            </p>
            <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
              <p className="text-xs text-gray-600 dark:text-gray-300">
                <strong>How it works:</strong> Forkcast sections (gray) contain compiled data from our repository. 
                Add YOUR analysis in new sections. This separation ensures readers know what's repository data vs. personal analysis.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
            Step 3: Paste Your Completed Comparison
          </h2>
          
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste your completed JSON comparison here..."
            className="w-full h-64 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-sm"
          />
          
          {error && (
            <div className="mt-2 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={() => setStep('select')}
            className="px-6 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-200"
          >
            Back
          </button>
          <button
            onClick={validateAndPreview}
            disabled={!jsonInput.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Preview Comparison
          </button>
        </div>
        </div>
      </div>
    );
  }

  if (step === 'preview' && preview) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navigation />
        <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Preview Your Comparison
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => setStep('paste')}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              Edit
            </button>
            <button
              onClick={() => setShowGistModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Export to GitHub Gist
            </button>
          </div>
        </div>
        
        <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-6 bg-white dark:bg-slate-900">
          <ComparisonRenderer comparison={preview} />
        </div>

        {showGistModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Export to GitHub Gist</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">Step 1: Copy Your Battle Card JSON</h3>
                  <div className="relative">
                    <textarea
                      readOnly
                      value={JSON.stringify(preview, null, 2)}
                      className="w-full h-64 p-3 border border-slate-300 dark:border-slate-600 rounded-lg font-mono text-sm bg-slate-50 dark:bg-slate-900"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(preview, null, 2));
                      }}
                      className="absolute top-2 right-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">Step 2: Create a GitHub Gist</h3>
                  <ol className="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300">
                    <li>Click the button below to open GitHub Gist</li>
                    <li>Paste your JSON in the large text area</li>
                    <li>Name your file (e.g., "epbs-vs-6s-slots.json")</li>
                    <li>Add a description (optional)</li>
                    <li>Click "Create public gist"</li>
                    <li>Copy the Gist URL to share your battle card</li>
                  </ol>
                  
                  <button
                    onClick={() => {
                      window.open('https://gist.github.com/', '_blank');
                    }}
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    Open GitHub Gist
                  </button>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Tip:</strong> Once you create a Gist, you can share it with a clean URL like:
                    <code className="bg-blue-100 dark:bg-blue-800 px-1 py-0.5 rounded text-xs ml-1">
                      {window.location.origin}/gist/username/gistid
                    </code>
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowGistModal(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    );
  }

  return null;
}