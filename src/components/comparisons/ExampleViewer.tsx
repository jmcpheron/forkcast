import { Link } from 'react-router-dom';
import ComparisonRenderer from './ComparisonRenderer';
import exampleComparison from '../../data/comparisons/epbs-vs-6s-slots.json';
import Navigation from '../Navigation';
import { EIPComparison } from '../../types/comparison';

export default function ExampleViewer() {
  const comparison = exampleComparison as EIPComparison;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navigation />
      <div className="max-w-6xl mx-auto p-6">
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