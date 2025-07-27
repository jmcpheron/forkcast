import { EIPComparison, ComparisonSection } from '../../types/comparison';
import { useEffect, useState } from 'react';
import eipsData from '../../data/eips.json';
import { EIP } from '../../types/eip';

interface ComparisonRendererProps {
  comparison: EIPComparison;
}

export default function ComparisonRenderer({ comparison }: ComparisonRendererProps) {
  const [eips, setEips] = useState<Record<string, EIP>>({});

  useEffect(() => {
    const eipMap: Record<string, EIP> = {};
    comparison.eips.forEach(eipId => {
      const eip = eipsData.find(e => e.id === eipId);
      if (eip) {
        eipMap[eipId.toString()] = eip;
      }
    });
    setEips(eipMap);
  }, [comparison.eips]);

  // Find author preference if it exists
  const authorPreference = comparison.sections.find(s => s.type === 'author-preference');
  const preferredEip = authorPreference?.preferredEip;

  const renderSection = (section: ComparisonSection, index: number) => {
    switch (section.type) {
      case 'header':
        const HeaderTag = `h${section.level || 2}` as keyof JSX.IntrinsicElements;
        return (
          <HeaderTag 
            key={index} 
            className={`font-semibold text-slate-900 dark:text-slate-100 ${
              section.level === 1 ? 'text-2xl mb-4' : 
              section.level === 3 ? 'text-lg mb-2' : 'text-xl mb-3'
            }`}
          >
            {section.content}
          </HeaderTag>
        );

      case 'comparison-table':
        return (
          <div key={index} className="overflow-x-auto mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left p-3 font-medium text-slate-700 dark:text-slate-300">
                    Criteria
                  </th>
                  {comparison.eips.map(eipId => (
                    <th key={eipId} className="text-left p-3 font-medium text-slate-700 dark:text-slate-300">
                      <a 
                        href={`https://eips.ethereum.org/EIPS/eip-${eipId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        EIP-{eipId}
                      </a>
                      {eips[eipId] && (
                        <div className="text-xs font-normal text-slate-500 dark:text-slate-400 mt-1">
                          {eips[eipId].title}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="p-3 font-medium text-slate-700 dark:text-slate-300">
                      {row.label}
                    </td>
                    {comparison.eips.map(eipId => {
                      const value = row.values[eipId];
                      const isComplex = typeof value === 'object' && value !== null;
                      
                      return (
                        <td key={eipId} className="p-3 text-slate-600 dark:text-slate-400">
                          {isComplex ? (
                            <div className="space-y-1">
                              <div className="flex items-start gap-2">
                                {value.icon && (
                                  <span className={`mt-0.5 ${
                                    value.severity === 'high' ? 'text-red-600 dark:text-red-400' :
                                    value.severity === 'medium' ? 'text-amber-600 dark:text-amber-400' :
                                    'text-blue-600 dark:text-blue-400'
                                  }`}>
                                    {value.icon === 'warning' ? '⚠️' :
                                     value.icon === 'info' ? 'ℹ️' :
                                     value.icon === 'check' ? '✓' : '✗'}
                                  </span>
                                )}
                                <span>{value.text}</span>
                              </div>
                              {value.severity && (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  value.severity === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                                  value.severity === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                                  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                }`}>
                                  {value.severity}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span>{value || '-'}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'visual':
        return (
          <div key={index} className="mb-6">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-3">
              {section.label}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {comparison.eips.map(eipId => {
                const image = section.images[eipId];
                if (!image) return null;
                
                return (
                  <div key={eipId} className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      EIP-{eipId}
                    </h4>
                    <a 
                      href={image.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img 
                        src={image.thumbnail || image.url}
                        alt={image.alt}
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
                      />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'callout':
        const bgColors = {
          warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700',
          info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700',
          success: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700',
          error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
        };
        
        const textColors = {
          warning: 'text-amber-900 dark:text-amber-100',
          info: 'text-blue-900 dark:text-blue-100',
          success: 'text-emerald-900 dark:text-emerald-100',
          error: 'text-red-900 dark:text-red-100'
        };

        return (
          <div 
            key={index} 
            className={`p-4 mb-6 rounded-lg border ${bgColors[section.style]}`}
          >
            <h4 className={`font-semibold mb-2 ${textColors[section.style]}`}>
              {section.title}
            </h4>
            <p className={`text-sm ${textColors[section.style]} opacity-90`}>
              {section.content}
            </p>
          </div>
        );

      case 'summary':
        return (
          <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg mb-6">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {section.content}
            </p>
          </div>
        );

      case 'text':
        return (
          <p key={index} className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
            {section.content}
          </p>
        );

      case 'argument':
        return (
          <div key={index} className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
              {section.position}
            </h3>
            
            {section.points && section.points.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Supporting Points:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {section.points.map((point, i) => (
                    <li key={i} className="text-slate-600 dark:text-slate-400">{point}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {section.counterpoints && section.counterpoints.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-2">Counterpoints:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {section.counterpoints.map((point, i) => (
                    <li key={i} className="text-amber-600 dark:text-amber-400">{point}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {section.evidence && section.evidence.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Evidence:</h4>
                <ul className="space-y-1">
                  {section.evidence.map((link, i) => (
                    <li key={i}>
                      <a 
                        href={link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 'debate':
        return (
          <div key={index} className="mb-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              {section.topic}
            </h3>
            <div className="space-y-4">
              {section.perspectives.map((perspective, i) => (
                <div key={i} className="border-l-4 border-slate-300 dark:border-slate-600 pl-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    <h4 className="font-medium text-slate-800 dark:text-slate-200">
                      {perspective.label}
                    </h4>
                    {perspective.author && (
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        — {perspective.author}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-2">
                    {perspective.argument}
                  </p>
                  {perspective.evidence && perspective.evidence.length > 0 && (
                    <div className="text-sm">
                      <span className="text-slate-500 dark:text-slate-500">Sources: </span>
                      {perspective.evidence.map((link, j) => (
                        <a 
                          key={j}
                          href={link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline mr-2"
                        >
                          [{j + 1}]
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'timeline':
        return (
          <div key={index} className="mb-6">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
              Timeline
            </h3>
            <div className="space-y-3">
              {section.events.map((event, i) => (
                <div key={i} className="flex gap-4">
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400 w-24 flex-shrink-0">
                    {event.time}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">
                    {event.description}
                    {event.eip && (
                      <a 
                        href={`https://eips.ethereum.org/EIPS/eip-${event.eip}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                      >
                        (EIP-{event.eip})
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'quick-stats':
        return (
          <div key={index} className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {comparison.eips.map(eipId => {
                const isPreferred = eipId === preferredEip;
                return (
                  <div 
                    key={eipId} 
                    className={`rounded-lg p-4 ${
                      isPreferred 
                        ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500 shadow-md' 
                        : 'bg-slate-50 dark:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">
                        EIP-{eipId}
                      </h4>
                      {isPreferred && (
                        <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full font-medium">
                          Author's Choice
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      {section.stats[eipId]?.map((stat, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-2xl">{stat.icon}</span>
                          <div className="flex-1">
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {stat.label}
                            </div>
                            <div className={`text-sm font-medium ${
                              stat.color === 'green' ? 'text-green-700 dark:text-green-400' :
                              stat.color === 'yellow' ? 'text-amber-700 dark:text-amber-400' :
                              stat.color === 'red' ? 'text-red-700 dark:text-red-400' :
                              'text-slate-700 dark:text-slate-300'
                            }`}>
                              {stat.value}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'northstar-comparison':
        return (
          <div key={index} className="mb-6">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
              North Star Alignment
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left p-3 font-medium text-slate-700 dark:text-slate-300">
                      North Star
                    </th>
                    {comparison.eips.map(eipId => (
                      <th key={eipId} className="text-left p-3 font-medium text-slate-700 dark:text-slate-300">
                        EIP-{eipId}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.northStars.map((star, i) => (
                    <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="p-3 font-medium text-slate-700 dark:text-slate-300">
                        {star}
                      </td>
                      {comparison.eips.map(eipId => {
                        const alignment = section.alignment[eipId]?.[star];
                        if (!alignment) return <td key={eipId} className="p-3">-</td>;
                        
                        return (
                          <td key={eipId} className="p-3">
                            <div className="flex items-start gap-2">
                              <span className="text-xl mt-0.5">{alignment.icon}</span>
                              <div>
                                <div className={`font-medium ${
                                  alignment.impact === 'High' ? 'text-green-700 dark:text-green-400' :
                                  alignment.impact === 'Medium' ? 'text-amber-700 dark:text-amber-400' :
                                  'text-red-700 dark:text-red-400'
                                }`}>
                                  {alignment.impact}
                                </div>
                                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                  {alignment.description}
                                </div>
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'stakeholder-impacts':
        const stakeholderLabels: Record<string, string> = {
          endUsers: 'End Users',
          appDevs: 'App Developers',
          walletDevs: 'Wallet Developers',
          toolingInfra: 'Tooling & Infrastructure',
          layer2s: 'Layer 2s',
          stakersNodes: 'Stakers & Node Operators',
          clClients: 'Consensus Layer Clients',
          elClients: 'Execution Layer Clients'
        };

        return (
          <div key={index} className="mb-6">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
              Stakeholder Impacts
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {comparison.eips.map(eipId => (
                <div key={eipId} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-3">
                    EIP-{eipId}
                  </h4>
                  <div className="space-y-3">
                    {section.stakeholders.map(stakeholder => {
                      const impact = section.impacts[eipId]?.[stakeholder];
                      if (!impact) return null;
                      
                      return (
                        <div key={stakeholder} className="flex items-start gap-3">
                          <span className="text-lg mt-0.5">{impact.icon}</span>
                          <div className="flex-1">
                            <div className="font-medium text-sm text-slate-700 dark:text-slate-300">
                              {stakeholderLabels[stakeholder] || stakeholder}
                            </div>
                            <div className={`text-xs font-medium ${
                              impact.impact === 'High' ? 'text-red-600 dark:text-red-400' :
                              impact.impact === 'Medium' ? 'text-amber-600 dark:text-amber-400' :
                              'text-green-600 dark:text-green-400'
                            }`}>
                              {impact.impact} Impact
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                              {impact.description}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'benefits-tradeoffs':
        return (
          <div key={index} className="mb-6">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
              Benefits & Trade-offs
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {comparison.eips.map(eipId => {
                const data = section.data[eipId];
                if (!data) return null;
                
                return (
                  <div key={eipId} className="space-y-4">
                    <h4 className="font-medium text-slate-800 dark:text-slate-200">
                      EIP-{eipId}
                    </h4>
                    
                    {data.benefits.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-green-700 dark:text-green-400 mb-2">
                          Benefits
                        </h5>
                        <ul className="space-y-1">
                          {data.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <span className="mt-0.5">{benefit.icon}</span>
                              <span>{benefit.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {data.tradeoffs.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-red-700 dark:text-red-400 mb-2">
                          Trade-offs
                        </h5>
                        <ul className="space-y-1">
                          {data.tradeoffs.map((tradeoff, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <span className={`mt-0.5 ${
                                tradeoff.severity === 'high' ? 'text-red-600' :
                                tradeoff.severity === 'medium' ? 'text-amber-600' :
                                'text-yellow-600'
                              }`}>
                                {tradeoff.icon}
                              </span>
                              <span className="text-slate-600 dark:text-slate-400">
                                {tradeoff.text}
                                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                                  tradeoff.severity === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                                  tradeoff.severity === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                                  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                                }`}>
                                  {tradeoff.severity}
                                </span>
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'fork-context':
        return (
          <div key={index} className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg">
            <h3 className="font-medium text-purple-900 dark:text-purple-100 mb-3">
              {section.fork} Context
            </h3>
            <div className="space-y-3">
              {comparison.eips.map(eipId => {
                const status = section.headlinerStatus[eipId];
                if (!status) return null;
                
                return (
                  <div key={eipId} className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-purple-800 dark:text-purple-200">
                        EIP-{eipId}:
                      </span>
                      <span className="ml-2 text-purple-700 dark:text-purple-300">
                        {status.status} ({status.layer})
                      </span>
                    </div>
                    {status.discussionLink && (
                      <a 
                        href={status.discussionLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        Discussion →
                      </a>
                    )}
                  </div>
                );
              })}
              {section.constraint && (
                <div className="mt-3 pt-3 border-t border-purple-200 dark:border-purple-700">
                  <p className="text-sm text-purple-700 dark:text-purple-300 italic">
                    ⚠️ {section.constraint}
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 'timeline-comparison':
        return (
          <div key={index} className="mb-6">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
              Slot Timeline Comparison
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(section.timelines).map(([eipId, timeline]) => (
                <div key={eipId} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-3">
                    EIP-{eipId}
                  </h4>
                  <div className="space-y-2">
                    {timeline.map((event, i) => (
                      <div 
                        key={i} 
                        className={`flex items-center gap-3 p-2 rounded ${
                          event.highlight ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700' : ''
                        }`}
                      >
                        <span className="text-xl">{event.icon}</span>
                        <div className="text-sm font-medium text-slate-500 dark:text-slate-400 w-12">
                          {event.time}
                        </div>
                        <div className="text-sm text-slate-700 dark:text-slate-300">
                          {event.event}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'risk-analysis':
        return (
          <div key={index} className="mb-6">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
              Risk Analysis
            </h3>
            <div className="space-y-4">
              {section.risks.map((risk, i) => (
                <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-200">
                        EIP-{risk.eip}: {risk.risk}
                      </h4>
                      {risk.monetaryValue && (
                        <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                          {risk.monetaryValue}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Severity:</span>
                      <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full transition-all ${
                            risk.severity >= 75 ? 'bg-red-500' :
                            risk.severity >= 50 ? 'bg-amber-500' :
                            risk.severity >= 25 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${risk.severity}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400 w-10">
                        {risk.severity}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Mitigation: </span>
                    <span className="text-slate-600 dark:text-slate-400">{risk.mitigation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'tradeoff-matrix':
        return (
          <div key={index} className="mb-6">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
              Trade-off Analysis
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left p-3 font-medium text-slate-700 dark:text-slate-300">
                      Dimension
                    </th>
                    {comparison.eips.map(eipId => (
                      <th key={eipId} className="text-center p-3 font-medium text-slate-700 dark:text-slate-300">
                        EIP-{eipId}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.dimensions.map((dim, i) => (
                    <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="p-3">
                        <div className="font-medium text-slate-700 dark:text-slate-300">
                          {dim.name}
                        </div>
                        {dim.description && (
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {dim.description}
                          </div>
                        )}
                      </td>
                      {comparison.eips.map(eipId => {
                        const score = dim.scores[eipId];
                        if (!score) return <td key={eipId} className="p-3 text-center">-</td>;
                        
                        return (
                          <td key={eipId} className="p-3 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-2xl">{score.icon}</span>
                              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                {score.score}/10
                              </span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'author-preference':
        const authorPreferredEip = section.preferredEip;
        const preferredIndex = comparison.eips.indexOf(authorPreferredEip);
        const isLeftPreferred = preferredIndex === 0;
        
        const strengthColors = {
          strong: 'bg-green-600',
          moderate: 'bg-blue-600',
          slight: 'bg-gray-600'
        };
        const strengthLabels = {
          strong: 'Strongly Prefers',
          moderate: 'Moderately Prefers',
          slight: 'Slightly Prefers'
        };
        
        // Check if this is early in the comparison (top position)
        const isTopPosition = index < 3;
        
        if (isTopPosition) {
          // Extract Twitter handle from author string
          const authorMatch = comparison.meta.author.match(/@(\w+)/);
          const twitterHandle = authorMatch ? authorMatch[1] : null;
          const authorName = comparison.meta.author.split(' (')[0];
          
          return (
            <div key={index} className="mb-8">
              <div className={`relative ${strengthColors[section.strength]} text-white p-6 rounded-lg shadow-lg`}>
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {/* Twitter/X Avatar */}
                      <div className="relative">
                        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
                          <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold">
                          {authorName} {strengthLabels[section.strength]} EIP-{authorPreferredEip}
                        </h3>
                        {twitterHandle && (
                          <a 
                            href={`https://twitter.com/${twitterHandle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm opacity-90 hover:opacity-100 transition-opacity flex items-center gap-1"
                          >
                            @{twitterHandle}
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm opacity-90">Prefers</div>
                      <div className="text-3xl font-bold">
                        EIP-{authorPreferredEip}
                      </div>
                    </div>
                  </div>
                  <p className="text-white/90 leading-relaxed">
                    {section.reasoning}
                  </p>
                </div>
                
                {/* Arrow pointing down to preferred EIP */}
                <div className={`absolute -bottom-6 ${isLeftPreferred ? 'left-1/4' : 'right-1/4'} transform -translate-x-1/2`}>
                  <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[24px] border-t-green-600"></div>
                </div>
              </div>
              
              {/* Highlight bar under preferred EIP in next section */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className={`h-1 rounded-full ${isLeftPreferred ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                <div className={`h-1 rounded-full ${!isLeftPreferred ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
              </div>
            </div>
          );
        }
        
        // Original rendering for when not at top
        return (
          <div key={index} className={`mb-6 p-6 border-2 rounded-lg border-green-600 bg-green-50 dark:bg-green-900/20`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🎯</span>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Author's Preference: EIP-{authorPreferredEip}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {strengthLabels[section.strength]}
                </p>
              </div>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {section.reasoning}
            </p>
          </div>
        );

      case 'forkcast-facts':
        const forkcastSection = section as any; // Type assertion for ForkcastFacts
        const { data } = forkcastSection;
        
        return (
          <div key={index} className="mb-6 p-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <span>📊</span>
                  Forkcast Facts: EIP-{forkcastSection.eipId}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                  From Forkcast Repository
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                The following is neutral, factual data maintained by Forkcast
              </p>
            </div>
            
            {data.laymanDescription && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Overview</h4>
                <p className="text-gray-600 dark:text-gray-400">{data.laymanDescription}</p>
              </div>
            )}
            
            {data.benefits && data.benefits.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Benefits</h4>
                <ul className="list-disc list-inside space-y-1">
                  {data.benefits.map((benefit: string, i: number) => (
                    <li key={i} className="text-gray-600 dark:text-gray-400">{benefit}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {data.tradeoffs && data.tradeoffs.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Tradeoffs</h4>
                <ul className="list-disc list-inside space-y-1">
                  {data.tradeoffs.map((tradeoff: string, i: number) => (
                    <li key={i} className="text-gray-600 dark:text-gray-400">{tradeoff}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {data.northStarAlignment && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">North Star Alignment</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {data.northStarAlignment.scaleL1 && (
                    <div className="p-3 bg-white dark:bg-gray-700 rounded">
                      <div className="font-medium text-sm text-gray-700 dark:text-gray-300">Scale L1</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Impact: {data.northStarAlignment.scaleL1.impact}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {data.northStarAlignment.scaleL1.description}
                      </div>
                    </div>
                  )}
                  {data.northStarAlignment.scaleBlobs && (
                    <div className="p-3 bg-white dark:bg-gray-700 rounded">
                      <div className="font-medium text-sm text-gray-700 dark:text-gray-300">Scale Blobs</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Impact: {data.northStarAlignment.scaleBlobs.impact}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {data.northStarAlignment.scaleBlobs.description}
                      </div>
                    </div>
                  )}
                  {data.northStarAlignment.improveUX && (
                    <div className="p-3 bg-white dark:bg-gray-700 rounded">
                      <div className="font-medium text-sm text-gray-700 dark:text-gray-300">Improve UX</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Impact: {data.northStarAlignment.improveUX.impact}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {data.northStarAlignment.improveUX.description}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          {comparison.meta.title}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {comparison.meta.description}
        </p>
        <div className="mt-2 text-sm text-slate-500 dark:text-slate-500">
          By {comparison.meta.author} • {comparison.meta.created}
        </div>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        {comparison.sections.map((section, index) => renderSection(section, index))}
      </div>
    </div>
  );
}