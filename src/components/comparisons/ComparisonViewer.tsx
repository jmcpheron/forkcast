import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ComparisonRenderer from './ComparisonRenderer';
import { EIPComparison } from '../../types/comparison';

export default function ComparisonViewer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [comparison, setComparison] = useState<EIPComparison | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    
    const stored = localStorage.getItem(`comparison-${id}`);
    if (stored) {
      try {
        setComparison(JSON.parse(stored));
      } catch {
        setError('Invalid comparison data');
      }
    } else {
      setError('Comparison not found');
    }
  }, [id]);

  const shareOnTwitter = () => {
    const url = window.location.href;
    const text = comparison 
      ? `Check out this EIP comparison: ${comparison.meta.title}`
      : 'Check out this EIP comparison on Forkcast';
    
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank'
    );
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
            {error}
          </h2>
          <button
            onClick={() => {
              const basePath = import.meta.env.DEV ? '' : '/forkcast';
              navigate(`${basePath}/compare/new`);
            }}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Create New Comparison
          </button>
        </div>
      </div>
    );
  }

  if (!comparison) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              const basePath = import.meta.env.DEV ? '' : '/forkcast';
              navigate(`${basePath}/`);
            }}
            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          >
            ← Back to Forkcast
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyLink}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
          >
            <span>📋</span> Copy Link
          </button>
          <button
            onClick={shareOnTwitter}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <span>𝕏</span> Share
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <ComparisonRenderer comparison={comparison} />
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => {
            const basePath = import.meta.env.DEV ? '' : '/forkcast';
            navigate(`${basePath}/compare/new`);
          }}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Create your own comparison →
        </button>
      </div>
    </div>
  );
}