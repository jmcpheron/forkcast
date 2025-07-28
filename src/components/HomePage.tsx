import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from '../hooks/useAnalytics';
import ThemeToggle from './ui/ThemeToggle';

const HomePage = () => {
  const { trackLinkClick } = useAnalytics();
  const navigate = useNavigate();
  const [showImportModal, setShowImportModal] = useState(false);
  const [gistUrl, setGistUrl] = useState('');

  const handleExternalLinkClick = (linkType: string, url: string) => {
    trackLinkClick(linkType, url);
  };

  const featuredComparison = {
    title: "ePBS vs 6-Second Slots",
    author: "Jason J McPheron",
    description: "Comparing EIP-7732 (Enshrined PBS) and EIP-7782 (6-Second Slots) for Glamsterdam's consensus layer fork choice",
    eips: [7732, 7782],
    path: "/compare/example-epbs-6s"
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center relative">
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          <Link to="/" className="text-4xl font-serif bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent hover:from-purple-700 hover:via-blue-700 hover:to-purple-900 transition-all duration-200 mb-3 tracking-tight inline-block">
            EIP Battle Cards
          </Link>
          <h2 className="text-xl font-light text-slate-700 dark:text-slate-300 tracking-tight mb-2">
            Compare Ethereum Improvement Proposals
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-6">
            Create and share detailed comparisons of EIPs with community perspectives and forecast.org data.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/compare/new"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
            >
              <span className="mr-2">⚔️</span>
              Create Your Battle Card
            </Link>
            <button
              onClick={() => setShowImportModal(true)}
              className="inline-flex items-center px-6 py-3 text-base font-medium text-blue-600 bg-white hover:bg-slate-50 rounded-lg transition-colors border border-slate-200 dark:bg-slate-700 dark:text-blue-400 dark:hover:bg-slate-600 dark:border-slate-600"
            >
              <span className="mr-2">📥</span>
              Import from Gist
            </button>
          </div>
        </div>

        {/* Featured Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">Featured Battle Card</h2>
          <Link
            to={featuredComparison.path}
            className="block bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-8 hover:shadow-xl transition-shadow duration-200 hover:border-slate-300 dark:hover:border-slate-600"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {featuredComparison.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  by {featuredComparison.author}
                </p>
              </div>
              <div className="flex gap-2">
                {featuredComparison.eips.map(eip => (
                  <span key={eip} className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    EIP-{eip}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {featuredComparison.description}
            </p>
            <div className="mt-4 text-blue-600 dark:text-blue-400 font-medium">
              Read Analysis →
            </div>
          </Link>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold mb-2">Neutral EIP Data</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                We pull official EIP information from forecast.org, providing unbiased facts and stakeholder impacts.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💭</div>
              <h3 className="text-lg font-semibold mb-2">Add Your Analysis</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Layer your opinions, preferences, and deeper analysis on top of the neutral data.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="text-lg font-semibold mb-2">Share via GitHub</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Export your battle card as a GitHub Gist and share it with the community.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to Compare EIPs?</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Create your own battle card to share your perspective on competing Ethereum proposals.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/compare/new"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Create Battle Card
            </Link>
            <Link
              to="/compare/example-epbs-6s"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-blue-600 bg-white hover:bg-slate-50 rounded-lg transition-colors border border-slate-200 dark:bg-slate-700 dark:text-blue-400 dark:hover:bg-slate-600 dark:border-slate-600"
            >
              View Example
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-slate-500 dark:text-slate-400">
          <p className="italic mb-2">
            A Forkcast L2 by{' '}
            <a
              href="https://x.com/jmcpheron"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleExternalLinkClick('author_link', 'https://x.com/jmcpheron')}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              jmcpheron.eth
            </a>
            {' '}— Adjacent to{' '}
            <a
              href="https://forecast.org"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleExternalLinkClick('forecast_link', 'https://forecast.org')}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              forecast.org
            </a>
          </p>
          <p className="text-xs mb-2">
            <a
              href="https://github.com/jmcpheron-forkcast/eip-battle-cards"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleExternalLinkClick('source_code', 'https://github.com/jmcpheron-forkcast/eip-battle-cards')}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors duration-200 inline-flex items-center"
              aria-label="View source code on GitHub"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </p>
        </div>

        {/* Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-lg w-full">
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
                Import from GitHub Gist
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Gist URL
                  </label>
                  <input
                    type="text"
                    value={gistUrl}
                    onChange={(e) => setGistUrl(e.target.value)}
                    placeholder="https://gist.github.com/username/gistid"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:text-slate-100"
                  />
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    Enter a public GitHub Gist URL containing your battle card JSON
                  </p>
                </div>
                
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      setShowImportModal(false);
                      setGistUrl('');
                    }}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (gistUrl.trim()) {
                        navigate(`/compare/gist?url=${encodeURIComponent(gistUrl.trim())}`);
                      }
                    }}
                    disabled={!gistUrl.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Import
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;