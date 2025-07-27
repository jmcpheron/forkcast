import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import exampleComparison from '../../data/comparisons/epbs-vs-6s-slots.json';

// Full example comparison data with author preference at top
const EXAMPLE_COMPARISON = exampleComparison;

export function loadExampleComparison() {
  const hash = 'example-epbs-6s';
  localStorage.setItem(`comparison-${hash}`, JSON.stringify(EXAMPLE_COMPARISON));
  // In development, we don't have the base path
  const basePath = import.meta.env.DEV ? '' : '/json-battlecard';
  return `${basePath}/compare/${hash}`;
}

export default function ExampleLoader() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const url = loadExampleComparison();
    navigate(url);
  }, [navigate]);
  
  return <div>Loading example...</div>;
}