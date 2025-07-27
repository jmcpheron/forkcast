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
    navigate(url);
  }, [navigate]);
  
  return <div>Loading example...</div>;
}