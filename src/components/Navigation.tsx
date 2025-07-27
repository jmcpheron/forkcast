import { Link } from 'react-router-dom';
import ThemeToggle from './ui/ThemeToggle';

export default function Navigation() {
  return (
    <header className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-2xl font-serif bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent hover:from-purple-700 hover:via-blue-700 hover:to-purple-900 transition-all duration-200 tracking-tight"
          >
            Forkcast
          </Link>
          
          <div className="flex items-center gap-6">
            <Link 
              to="/" 
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/rank" 
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              Rank EIPs
            </Link>
            <Link 
              to="/compare/new" 
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              Compare EIPs
            </Link>
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}