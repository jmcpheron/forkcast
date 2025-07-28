import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import exampleComparison from '../../data/comparisons/epbs-vs-6s-slots.json';

// Full example comparison data with author preference at top
const EXAMPLE_COMPARISON = exampleComparison;

export function loadExampleComparison() {
  const hash = 'example-epbs-6s';
  localStorage.setItem(`comparison-${hash}`, JSON.stringify(EXAMPLE_COMPARISON));
  // Return just the path without base - Router handles the base path
  return `/compare/${hash}`;
}

export default function ExampleLoader() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const url = loadExampleComparison();
    // Add a small delay to ensure localStorage is written
    setTimeout(() => {
      navigate(url, { replace: true });
    }, 100);
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="text-lg text-slate-600 dark:text-slate-400">Loading example...</div>
    </div>
  );
}