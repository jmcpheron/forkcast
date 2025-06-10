import { useState, useEffect, useRef } from 'react';
import { getClientForContributor } from '../data/contributors';

interface EipPosition {
  eip: string;
  eipTitle: string;
  position: 'For' | 'Against' | 'Neutral' | 'Mixed';
  details: string;
  startTime?: string;
  endTime?: string;
  highlightText?: string; // The specific text to highlight in the full transcript
}

interface ClientPosition {
  client: string;
  representative: string;
  position?: 'For' | 'Against' | 'Neutral' | 'Mixed'; // For non-EIP decisions
  details?: string; // For non-EIP decisions
  eipPositions?: EipPosition[]; // For EIP-specific decisions
  startTime?: string;
  endTime?: string;
  highlightText?: string;
}

interface Decision {
  id: string;
  topic: string;
  description: string;
  timestamp: string;
  positions: ClientPosition[];
  type: 'eip-specific' | 'general';
}

interface TranscriptModal {
  isOpen: boolean;
  representative: string;
  client: string;
  topic: string;
  highlightText: string;
  startTime: string;
  endTime: string;
}

const SensePage = () => {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullTranscript, setFullTranscript] = useState<string>('');
  const [transcriptModal, setTranscriptModal] = useState<TranscriptModal>({
    isOpen: false,
    representative: '',
    client: '',
    topic: '',
    highlightText: '',
    startTime: '',
    endTime: ''
  });
  const transcriptRef = useRef<HTMLDivElement>(null);

  // Function to load and parse VTT transcript
  const loadTranscript = async () => {
    try {
      // File is in the public directory, need to account for GitHub Pages base path
      const isGitHubPages = window.location.hostname === 'wolovim.github.io';
      const basePath = isGitHubPages ? '/forkcast' : '';
      const transcriptUrl = `${basePath}/TranscriptJun52025.vtt`;
      
      const response = await fetch(transcriptUrl);
      if (!response.ok) {
        throw new Error(`Failed to load transcript: ${response.status} ${response.statusText}`);
      }
      return await response.text();
    } catch (error) {
      console.error('Error loading transcript:', error);
      // Return a placeholder if transcript can't be loaded
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return `WEBVTT

Error loading transcript file: ${errorMessage}

This would contain the full ACD #213 meeting transcript with timestamps and speaker information.`;
    }
  };

  useEffect(() => {
    // Load transcript and parse decisions
    const initializeData = async () => {
      try {
        // Load the full transcript
        const transcript = await loadTranscript();
        setFullTranscript(transcript);

        // Parse the transcript data with the actual file content
        const parsedDecisions: Decision[] = [
          {
            id: 'devnet2-eips',
            topic: 'EIP Prioritization for Devnet 2',
            description: 'Which EIPs should be prioritized for inclusion in Devnet 2 of the Fusaka upgrade',
            timestamp: '00:30:54.220',
            type: 'eip-specific',
            positions: [
              {
                client: getClientForContributor('Ben Adams'),
                representative: 'Ben Adams',
                eipPositions: [
                  {
                    eip: '7212',
                    eipTitle: 'Execution Block Size',
                    position: 'For',
                    details: 'Fine with execution block size increase',
                    startTime: '00:31:28.700',
                    endTime: '00:31:39.059',
                    highlightText: 'Ben Adams: So the 7, 7, 2, 1, 2 replacement.'
                  },
                  {
                    eip: '7934',
                    eipTitle: 'Contract Size Limit',
                    position: 'Against',
                    details: 'Needs more work. Suggests 50% interim increase instead',
                    startTime: '00:31:40.570',
                    endTime: '00:31:56.290',
                    highlightText: 'Ben Adams: The meter contract size still needs work.'
                  },
                  {
                    eip: '7907',
                    eipTitle: 'Database Changes',
                    position: 'Against',
                    details: 'Too close to Fusaka timing for database structure changes',
                    startTime: '00:36:00.450',
                    endTime: '00:36:28.100',
                    highlightText: 'Ben Adams: To to be effective. The 7 9 0, 7 really needs a change in the'
                  }
                ]
              },
              {
                client: getClientForContributor('Andrew Ashikhmin'),
                representative: 'Andrew Ashikhmin',
                eipPositions: [
                  {
                    eip: '7212',
                    eipTitle: 'R1 Precompile & Block Size',
                    position: 'For',
                    details: 'Agrees with Ben on R1 precompile and execution block size limit',
                    startTime: '00:32:47.740',
                    endTime: '00:32:59.029',
                    highlightText: 'Andrew Ashikhmin: So I agree with Ben. It\'s the should be the r 1 precompile and the rop execution block size limit.'
                  },
                  {
                    eip: '5920',
                    eipTitle: 'Pay Opcode',
                    position: 'Against',
                    details: 'Has tooling implications, not trivial. Would prefer early in Glamsterdam',
                    startTime: '00:33:08.990',
                    endTime: '00:33:24.799',
                    highlightText: 'Andrew Ashikhmin: it. It has some implications to the tooling, and it\'s it\'s not trivial.'
                  }
                ]
              },
              {
                client: getClientForContributor('Marius'),
                representative: 'Marius',
                eipPositions: [
                  {
                    eip: '7212',
                    eipTitle: 'Execution Block Size',
                    position: 'For',
                    details: 'Important to ship, has been sitting for so long',
                    startTime: '00:34:39.929',
                    endTime: '00:34:50.979',
                    highlightText: 'Marius: So I do think that, like from my point of view, the 7, 2, 1, 2 is pretty important to ship like this has been sitting for so long, and it\'s kind of a small one. So we should just we should have this'
                  },
                  {
                    eip: '7934',
                    eipTitle: 'Contract Size Limit',
                    position: 'For',
                    details: 'Pretty important for constraining other issues',
                    startTime: '00:34:51.219',
                    endTime: '00:34:58.148',
                    highlightText: 'Marius: and the 7, 9, 3, 4 for me, also pretty important one, just to basically be able to'
                  },
                  {
                    eip: '7907',
                    eipTitle: 'Database Changes',
                    position: 'For',
                    details: 'Important for community if we can pull it off',
                    startTime: '00:34:58.148',
                    endTime: '00:35:13.750',
                    highlightText: 'Marius: constrained the other ones. I have less than a routine. But opinion about but I know that the 7, 7, 9 0, 7'
                  }
                ]
              },
              {
                client: getClientForContributor('Justin Florentine'),
                representative: 'Justin Florentine',
                eipPositions: [
                  {
                    eip: '5920',
                    eipTitle: 'Pay Opcode',
                    position: 'For',
                    details: 'Thinks pay opcode is good and would like to see it included',
                    startTime: '00:34:19.960',
                    endTime: '00:34:26.839',
                    highlightText: 'Justin Florentine (Besu): we don\'t really have a strong opinion. We published our earlier things. I think the pay. OP. Code is good. We\'d like to see that included.'
                  }
                ]
              },
              {
                client: getClientForContributor('Roman'),
                representative: 'Roman',
                eipPositions: [
                  {
                    eip: '7212',
                    eipTitle: 'Execution Block Size',
                    position: 'For',
                    details: 'Supports inclusion',
                    startTime: '00:35:36.170',
                    endTime: '00:35:44.939',
                    highlightText: 'Roman: And I posted the comment earlier in the chat as well, that we\'re for 7, 2, 1, 2, and 7, 9, 3, 4,'
                  },
                  {
                    eip: '7934',
                    eipTitle: 'Contract Size Limit',
                    position: 'For',
                    details: 'Supports inclusion',
                    startTime: '00:35:36.170',
                    endTime: '00:35:44.939',
                    highlightText: 'Roman: And I posted the comment earlier in the chat as well, that we\'re for 7, 2, 1, 2, and 7, 9, 3, 4,'
                  },
                  {
                    eip: '7907',
                    eipTitle: 'Database Changes',
                    position: 'Mixed',
                    details: 'Generally supportive but needs to catch up on extensive discussion',
                    startTime: '00:35:45.160',
                    endTime: '00:35:56.259',
                    highlightText: 'Roman: and we\'re generally supportive of 7, 9 0. 7.'
                  }
                ]
              }
            ]
          },
          {
            id: 'eip7907-database',
            topic: 'EIP 7907 Database Changes',
            description: 'Whether to include EIP 7907 given its database structure requirements',
            timestamp: '00:36:10.139',
            type: 'general',
            positions: [
              {
                client: getClientForContributor('Ben Adams'),
                representative: 'Ben Adams',
                position: 'Against',
                details: 'Concerned about timing - requires EL client database changes too close to Fusaka release.',
                startTime: '00:36:00.450',
                endTime: '00:36:28.100',
                highlightText: 'Ben Adams: To to be effective. The 7 9 0, 7 really needs a change in the'
              },
              {
                client: getClientForContributor('lightclient'),
                representative: 'lightclient',
                position: 'For',
                details: 'Believes database changes are minimal (200 lines) and worth pushing through for community value.',
                startTime: '00:44:20.876',
                endTime: '00:44:32.020',
                highlightText: 'Ultimately, the thing is that this is very important. IP for the community. They\'ve been asking for this type of thing for many years, and we\'re close'
              }
            ]
          },
          {
            id: 'pay-opcode-inclusion',
            topic: 'Pay Opcode (EIP 5920) for Fusaka',
            description: 'Should the pay opcode be included in the Fusaka upgrade',
            timestamp: '01:21:45.730',
            type: 'general',
            positions: [
              {
                client: getClientForContributor('Luis Pinto'),
                representative: 'Luis Pinto',
                position: 'For',
                details: 'Sees it as useful simplification and security improvement for mitigating reentrancy calls.',
                startTime: '01:21:35.630',
                endTime: '01:21:58.890',
                highlightText: 'Luis Pinto | Besu: I see it was still useful as a simplification for, and even security wise, wise for mitigating reentrancing calls.'
              },
              {
                client: getClientForContributor('lightclient'),
                representative: 'lightclient',
                position: 'Against',
                details: 'Argues implementation is simple but implications are complex. Questions long-term EVM design impact.',
                startTime: '01:22:00.080',
                endTime: '01:22:28.629',
                highlightText: 'lightclient: I mean, I feel like I gave arguments against it last all quartz.'
              },
              {
                client: getClientForContributor('Andrew Ashikhmin'),
                representative: 'Andrew Ashikhmin',
                position: 'Against',
                details: 'Concerned about timing and non-trivial downstream consequences despite easy EVM implementation.',
                startTime: '01:23:08.940',
                endTime: '01:23:27.110',
                highlightText: 'Andrew Ashikhmin: Yeah, I I\'d like to add to like like clients. Point is that it changes the tracer.'
              }
            ]
          },
          {
            id: 'eip-versioning',
            topic: 'EIP Versioning Scheme',
            description: 'Implementing a versioning scheme for EIPs to improve testing and implementation alignment',
            timestamp: '01:29:03.540',
            type: 'general',
            positions: [
              {
                client: getClientForContributor('Ahmad Bitar'),
                representative: 'Ahmad Bitar',
                position: 'For',
                details: 'Proposes versioning to solve alignment issues between tests, client implementations, and specs.',
                startTime: '01:26:33.310',
                endTime: '01:29:03.540',
                highlightText: 'Ahmad Bitar | Nethermind: And yeah, like, I\'d like to hear from everyone their opinions and potentially, if if there is like if if no, if people haven\'t even haven\'t haven\'t started looking at the aip, please do. And like, we can decide on it later. Obviously.'
              },
              {
                client: getClientForContributor('Tim Beiko'),
                representative: 'Tim Beiko',
                position: 'Mixed',
                details: 'Supports the goal but concerned about friction. Prefers hash-based approach or comprehensive process redesign.',
                startTime: '01:29:04.690',
                endTime: '01:29:51.810',
                highlightText: 'My counter proposal was like, let\'s just use the hash because we get it for free every time we do a commit to the eip.'
              }
            ]
          }
        ];

        setDecisions(parsedDecisions);
      } catch (error) {
        console.error('Error initializing data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Effect to scroll to highlighted text when modal opens
  useEffect(() => {
    if (transcriptModal.isOpen && transcriptModal.highlightText && transcriptRef.current) {
      // Small delay to ensure modal is rendered
      setTimeout(() => {
        const highlightedElement = transcriptRef.current?.querySelector('.bg-yellow-200');
        if (highlightedElement) {
          highlightedElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 100);
    }
  }, [transcriptModal.isOpen, transcriptModal.highlightText]);

  const getPositionColor = (position: 'For' | 'Against' | 'Neutral' | 'Mixed') => {
    switch (position) {
      case 'For':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Against':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Mixed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Neutral':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const openTranscriptModal = (
    representative: string,
    client: string,
    topic: string,
    highlightText: string,
    startTime: string,
    endTime: string
  ) => {
    setTranscriptModal({
      isOpen: true,
      representative,
      client,
      topic,
      highlightText,
      startTime,
      endTime
    });
  };

  const closeTranscriptModal = () => {
    setTranscriptModal(prev => ({ ...prev, isOpen: false }));
  };

  // Function to render transcript with highlighting
  const renderTranscriptWithHighlight = (text: string, highlightText: string) => {
    if (!highlightText) return text;
    
    // Debug logging
    console.log('Searching for highlight text:', JSON.stringify(highlightText));
    console.log('Text includes highlight:', text.includes(highlightText));
    if (!text.includes(highlightText)) {
      console.log('First 500 chars of transcript:', text.substring(0, 500));
    }
    
    const parts = text.split(highlightText);
    return parts.reduce((acc, part, index) => {
      if (index === 0) return [part];
      return [...acc, 
        <span key={index} className="bg-yellow-200 px-1 rounded font-medium">
          {highlightText}
        </span>, 
        part
      ];
    }, [] as any[]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-pulse text-slate-500">Loading transcript and parsing network signals...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-serif bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent mb-2 tracking-tight">
            SENSE
          </h1>
          <h2 className="text-lg font-light text-slate-700 tracking-tight mb-3">
            Structured Ethereum Network Signal Evaluation
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Analysis of client team positions from core developer discussions.
            <span className="block text-xs text-slate-500 mt-1">Click any position to view the full transcript with context</span>
          </p>
        </div>

        {/* Meeting Section Header */}
        <div className="mb-6">
          <div className="text-center mb-1">
            <h3 className="text-xl font-medium text-slate-900 mb-1">
              All Core Devs - Execution (ACDE) #213
            </h3>
            <div className="text-sm text-slate-500 font-mono">
              June 5, 2025
            </div>
          </div>
        </div>

        {/* Decisions */}
        <div className="space-y-6">
          {decisions.map((decision) => (
            <div key={decision.id} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-slate-900 leading-tight">
                    {decision.topic}
                  </h3>
                  <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded">
                    {decision.timestamp}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {decision.description}
                </p>
              </div>

              {/* Client Positions */}
              <div className="space-y-3">
                <h4 className="text-xs font-medium text-slate-700 uppercase tracking-wide">
                  Client Team Positions
                </h4>
                
                {decision.type === 'eip-specific' ? (
                  // EIP-specific layout - more compact grid
                  <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
                    {decision.positions.map((position, index) => (
                      <div key={index} className="bg-slate-50 border border-slate-200 rounded p-3">
                        <div className="mb-3">
                          <div className="font-medium text-sm text-slate-900">{position.representative}</div>
                          <div className="text-xs text-slate-600">{position.client}</div>
                        </div>
                        
                        <div className="space-y-2">
                          {position.eipPositions?.map((eipPos, eipIndex) => (
                            <div 
                              key={eipIndex} 
                              className="flex items-start justify-between p-2 bg-white rounded border border-slate-100 cursor-pointer hover:border-slate-300 hover:shadow-sm transition-all"
                              onClick={() => eipPos.highlightText && openTranscriptModal(
                                position.representative,
                                position.client,
                                `${eipPos.eip} - ${eipPos.eipTitle}`,
                                eipPos.highlightText,
                                eipPos.startTime || '',
                                eipPos.endTime || ''
                              )}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1 mb-1">
                                  <span className="font-medium text-xs text-slate-900">{eipPos.eip}</span>
                                  <span className="text-xs text-slate-400">•</span>
                                  <span className="text-xs text-slate-600 truncate">{eipPos.eipTitle}</span>
                                </div>
                                <p className="text-xs text-slate-600 leading-tight">
                                  {eipPos.details}
                                </p>
                              </div>
                              <span className={`ml-2 px-1.5 py-0.5 text-xs font-medium rounded border whitespace-nowrap ${getPositionColor(eipPos.position)}`}>
                                {eipPos.position}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // General layout for non-EIP decisions - more compact
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {decision.positions.map((position, index) => (
                      <div 
                        key={index} 
                        className="bg-slate-50 border border-slate-200 rounded p-3 cursor-pointer hover:border-slate-300 hover:shadow-sm transition-all"
                        onClick={() => position.highlightText && openTranscriptModal(
                          position.representative,
                          position.client,
                          decision.topic,
                          position.highlightText,
                          position.startTime || '',
                          position.endTime || ''
                        )}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm text-slate-900">{position.representative}</div>
                            <div className="text-xs text-slate-600">{position.client}</div>
                          </div>
                          <span className={`ml-2 px-1.5 py-0.5 text-xs font-medium rounded border whitespace-nowrap ${getPositionColor(position.position!)}`}>
                            {position.position}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-tight">
                          {position.details}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-slate-500">
          <p className="italic mb-1">
            Signal analysis from All Core Devs - Execution (ACDE) #213
          </p>
          <p className="text-xs mb-2">
            This is an experimental feature. Data parsed from live transcription.
          </p>
          <p className="text-xs">
            Have feedback? Contact{' '}
            <a 
              href="https://x.com/wolovim" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-slate-800 underline decoration-1 underline-offset-2"
            >
              @wolovim
            </a>
          </p>
        </div>
      </div>

      {/* Full Transcript Modal */}
      {transcriptModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-start justify-between mb-4 flex-shrink-0">
              <div>
                <h3 className="text-lg font-medium text-slate-900">
                  {transcriptModal.representative} ({transcriptModal.client})
                </h3>
                <p className="text-sm text-slate-600">{transcriptModal.topic}</p>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  {transcriptModal.startTime} → {transcriptModal.endTime}
                </p>
              </div>
              <button
                onClick={closeTranscriptModal}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold flex-shrink-0"
              >
                ×
              </button>
            </div>
            
            <div className="bg-slate-50 rounded p-4 border border-slate-200 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-slate-700">Full Transcript - ACDE #213</h4>
                <div className="text-xs text-slate-500">
                  <span className="bg-yellow-200 px-1 rounded">Highlighted</span> comment is auto-scrolled to
                </div>
              </div>
              <div 
                ref={transcriptRef}
                className="text-sm text-slate-800 leading-relaxed font-mono whitespace-pre-line"
              >
                {renderTranscriptWithHighlight(fullTranscript, transcriptModal.highlightText)}
              </div>
            </div>
            
            <div className="mt-4 text-center flex-shrink-0">
              <button
                onClick={closeTranscriptModal}
                className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SensePage; 