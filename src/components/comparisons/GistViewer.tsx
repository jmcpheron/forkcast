import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ComparisonRenderer from './ComparisonRenderer';
import { EIPComparison } from '../../types/comparison';
import Navigation from '../Navigation';

interface GistFile {
  filename: string;
  type: string;
  language: string;
  raw_url: string;
  size: number;
  content: string;
}

interface GistResponse {
  id: string;
  description: string;
  public: boolean;
  files: Record<string, GistFile>;
  owner?: {
    login: string;
  };
}

export default function GistViewer() {
  const [searchParams] = useSearchParams();
  const gistUrl = searchParams.get('url');
  
  const [comparison, setComparison] = useState<EIPComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!gistUrl) {
      setError('No Gist URL provided');
      setLoading(false);
      return;
    }

    loadGist(gistUrl);
  }, [gistUrl]);

  const extractGistId = (url: string): string | null => {
    // Support various Gist URL formats
    const patterns = [
      /gist\.github\.com\/[^\/]+\/([a-f0-9]+)/i,  // https://gist.github.com/user/id
      /gist\.github\.com\/([a-f0-9]+)/i,          // https://gist.github.com/id
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    
    // If it's already just an ID
    if (/^[a-f0-9]+$/i.test(url)) {
      return url;
    }

    return null;
  };

  const loadGist = async (url: string) => {
    try {
      const gistId = extractGistId(url);
      if (!gistId) {
        setError('Invalid Gist URL format');
        setLoading(false);
        return;
      }

      // Check cache first
      const cacheKey = `gist-cache-${gistId}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached);
          // Cache for 15 minutes
          if (Date.now() - timestamp < 15 * 60 * 1000) {
            setComparison(data);
            setLoading(false);
            return;
          }
        } catch {
          // Invalid cache, continue to fetch
        }
      }

      // Fetch from GitHub API
      const response = await fetch(`https://api.github.com/gists/${gistId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Gist not found. Make sure it\'s public.');
        } else {
          setError(`Failed to load Gist: ${response.statusText}`);
        }
        setLoading(false);
        return;
      }

      const gistData: GistResponse = await response.json();
      
      // Find JSON file in the Gist
      let jsonContent: string | null = null;
      
      for (const [filename, file] of Object.entries(gistData.files)) {
        if (filename.endsWith('.json')) {
          jsonContent = file.content;
          break;
        }
      }

      if (!jsonContent) {
        setError('No JSON file found in the Gist');
        setLoading(false);
        return;
      }

      // Parse and validate JSON
      let comparisonData: EIPComparison;
      try {
        comparisonData = JSON.parse(jsonContent);
      } catch {
        setError('Invalid JSON in the Gist file');
        setLoading(false);
        return;
      }

      // Basic validation
      if (!comparisonData.meta || !comparisonData.eips || !comparisonData.sections) {
        setError('Invalid comparison format. Missing required fields.');
        setLoading(false);
        return;
      }

      // Cache the result
      localStorage.setItem(cacheKey, JSON.stringify({
        data: comparisonData,
        timestamp: Date.now()
      }));

      setComparison(comparisonData);
      setLoading(false);
    } catch (err) {
      setError(`Error loading Gist: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navigation />
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navigation />
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
              {error}
            </h2>
            <div className="mt-4 space-x-4">
              <Link
                to="/compare/new"
                className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Create New Comparison
              </Link>
              <Link
                to="/"
                className="inline-block px-4 py-2 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!comparison) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navigation />
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Loaded from GitHub Gist
          </div>
          <button
            onClick={() => {
              const gistId = extractGistId(gistUrl!);
              if (gistId) {
                localStorage.removeItem(`gist-cache-${gistId}`);
                loadGist(gistUrl!);
              }
            }}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Refresh
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
          <ComparisonRenderer comparison={comparison} />
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/compare/new"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Create your own comparison →
          </Link>
        </div>
      </div>
    </div>
  );
}