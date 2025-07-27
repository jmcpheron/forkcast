import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import eipsData from '../../data/eips.json';
import { EIPComparison } from '../../types/comparison';
import ComparisonRenderer from './ComparisonRenderer';
import ComparisonBuilder from './ComparisonBuilder';
import { loadExampleComparison } from './ExampleLoader';

export default function ComparisonCreator() {
  const navigate = useNavigate();
  const [selectedEips, setSelectedEips] = useState<number[]>([]);
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<EIPComparison | null>(null);
  const [step, setStep] = useState<'select' | 'build' | 'paste' | 'preview'>('select');

  const generateTemplate = () => {
    const templateStructure = `{
  "meta": {
    "title": "[Your comparison title - be specific]",
    "author": "[Your Name] ([ENS/handle] @twitter)",
    "created": "${new Date().toISOString().split('T')[0]}",
    "description": "[One sentence explaining what you're comparing and why it matters]"
  },
  "eips": [${selectedEips.join(', ')}],
  "sections": [
    {
      "type": "author-preference",
      "preferredEip": [YOUR_PREFERRED_EIP_NUMBER],
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
          { "icon": "🔧", "label": "Complexity", "value": "[Low/Medium/High]", "color": "[green/yellow/red]" }
        ],
        ${selectedEips.slice(1).map(eip => `"${eip}": [
          { "icon": "🎯", "label": "Key Benefit", "value": "[Main advantage]" },
          { "icon": "⚠️", "label": "Key Risk", "value": "[Main concern]", "color": "yellow" },
          { "icon": "🔧", "label": "Complexity", "value": "[Low/Medium/High]", "color": "[green/yellow/red]" }
        ]`).join(',\n        ')}
      }
    },
    {
      "type": "northstar-comparison",
      "northStars": ["Scale L1", "Scale blobs", "Improve UX"],
      "alignment": {
        ${selectedEips.map(eip => `"${eip}": {
          "Scale L1": {
            "impact": "[High/Medium/Low]",
            "icon": "[🟢/🟡/🔴]",
            "description": "[How does EIP-${eip} impact L1 scaling?]"
          },
          "Scale blobs": {
            "impact": "[High/Medium/Low]",
            "icon": "[🟢/🟡/🔴]",
            "description": "[How does EIP-${eip} impact blob scaling?]"
          },
          "Improve UX": {
            "impact": "[High/Medium/Low]",
            "icon": "[🟢/🟡/🔴]",
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
            "impact": "[High/Medium/Low]",
            "icon": "[😍/😐/😟]",
            "description": "[How are end users affected?]"
          },
          "appDevs": {
            "impact": "[High/Medium/Low]",
            "icon": "[🔧/🔄/⚠️]",
            "description": "[How are app developers affected?]"
          },
          "layer2s": {
            "impact": "[High/Medium/Low]",
            "icon": "[🚀/📈/😐]",
            "description": "[How are L2s affected?]"
          },
          "clClients": {
            "impact": "[High/Medium/Low]",
            "icon": "[🚨/🔧/😐]",
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
            { "text": "[Tradeoff or risk 1]", "severity": "[low/medium/high]", "icon": "⚠️" },
            { "text": "[Tradeoff or risk 2]", "severity": "[low/medium/high]", "icon": "⚠️" }
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
            ${selectedEips.map(eip => `"${eip}": { "score": [1-10], "icon": "[🟢/🟡/🔴]" }`).join(',\n            ')}
          }
        },
        {
          "name": "[Key dimension 2 - e.g., Implementation Risk]",
          "description": "[What this dimension measures]",
          "scores": {
            ${selectedEips.map(eip => `"${eip}": { "score": [1-10], "icon": "[🟢/🟡/🔴]" }`).join(',\n            ')}
          }
        }
      ]
    },
    {
      "type": "summary",
      "content": "[Final thoughts summarizing the key decision points and your overall assessment. End with a clear statement about which EIP you believe should be prioritized and why.]"
    }
  ]
}

HOW TO USE THIS STRUCTURE:
1. Fill in all [bracketed] placeholders with your content
2. Start with your author-preference - this is YOUR take, own it!
3. Include your Twitter handle for attribution (format: "Name (ens.eth @twitter)")
4. Add/remove rows in comparison tables as needed
5. Use "debate" sections for contentious topics with multiple viewpoints
6. Use "argument" sections to present nuanced positions with evidence
7. Add more sections as needed - you can repeat section types
8. For severity in values, use: "low", "medium", or "high"
9. For callout styles, use: "info", "warning", "success", or "error"
10. Keep values concise in tables, use text/argument sections for detail

Remember: This is YOUR comparison. Take a stand!`;

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
      
      setError('');
      setPreview(parsed);
      setStep('preview');
    } catch (e) {
      setError(`Invalid JSON: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  };

  const generateShareableUrl = () => {
    if (!preview) return;
    
    // Store in localStorage with a hash
    const hash = btoa(Math.random().toString(36).substring(7));
    localStorage.setItem(`comparison-${hash}`, JSON.stringify(preview));
    
    // Navigate to the comparison page
    navigate(`/compare/${hash}`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (step === 'select') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          Create EIP Comparison
        </h1>
        
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
            New to EIP comparisons? Check out our example comparison to see all available features:
          </p>
          <button
            onClick={() => {
              const url = loadExampleComparison();
              window.open(url, '_blank');
            }}
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
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
          <p className="text-sm text-green-700 dark:text-green-300">
            This is YOUR take on these EIPs. Start with your preference at the top - which EIP do you 
            think should win and why? Don't just analyze, advocate! Your comparison should reflect your 
            values and priorities for Ethereum's future.
          </p>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
            Step 1: Select EIPs to Compare
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Choose 2-4 EIPs you want to compare side-by-side
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-96 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            {eipsData.map(eip => (
              <label 
                key={eip.id} 
                className="flex items-center space-x-2 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedEips.includes(eip.id)}
                  onChange={() => handleEipToggle(eip.id)}
                  className="rounded border-slate-300 dark:border-slate-600"
                />
                <span className="text-sm">
                  <span className="font-medium">EIP-{eip.id}</span>: {eip.title}
                </span>
              </label>
            ))}
          </div>
          
          <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            Selected: {selectedEips.length} EIP{selectedEips.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={() => setStep('build')}
            disabled={selectedEips.length < 2}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Build Visually →
          </button>
          <button
            onClick={() => setStep('paste')}
            disabled={selectedEips.length < 2}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Paste JSON →
          </button>
        </div>
      </div>
    );
  }

  if (step === 'build') {
    return (
      <ComparisonBuilder
        selectedEips={selectedEips}
        onComplete={(comparison) => {
          setPreview(comparison);
          setStep('preview');
        }}
        onBack={() => setStep('select')}
      />
    );
  }

  if (step === 'paste') {
    const template = generateTemplate();
    
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          Create EIP Comparison
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
                className="text-sm px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600"
              >
                Copy Structure
              </button>
            </div>
            <pre className="text-xs overflow-x-auto bg-white dark:bg-slate-900 p-4 rounded border border-slate-200 dark:border-slate-700">
              {template}
            </pre>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
              Use this structure to build your comparison. Start with YOUR preference at the top - 
              this is your take on which EIP should win and why. Fill in the sections with your research 
              and analysis, following the format shown.
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300 italic">
              Pro tip: Your author preference at the top is what makes this YOUR comparison. Don't be shy!
            </p>
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
            className="w-full h-64 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono text-sm"
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
            className="px-6 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
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
    );
  }

  if (step === 'preview' && preview) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Preview Your Comparison
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => setStep('paste')}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Edit
            </button>
            <button
              onClick={generateShareableUrl}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Generate Shareable Link
            </button>
          </div>
        </div>
        
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 bg-white dark:bg-slate-900">
          <ComparisonRenderer comparison={preview} />
        </div>
      </div>
    );
  }

  return null;
}