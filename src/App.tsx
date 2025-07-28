import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import PublicNetworkUpgradePage from './components/PublicNetworkUpgradePage';
import HomePage from './components/HomePage';
import RankPage from './components/RankPage';
import { getUpgradeById } from './data/upgrades';
import { useAnalytics } from './hooks/useAnalytics';
import { ThemeProvider } from './contexts/ThemeContext';
import ExternalRedirect from './components/ExternalRedirect';
import ComparisonCreator from './components/comparisons/ComparisonCreator';
import ComparisonViewer from './components/comparisons/ComparisonViewer';
import ExampleViewer from './components/comparisons/ExampleViewer';
import GistViewer from './components/comparisons/GistViewer';

function AnalyticsTracker() {
  const location = useLocation();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    // Track page views when route changes in SPA
    const pageName = location.pathname === '/' ? 'homepage' : location.pathname;
    const pageTitle = document.title;

    trackPageView(pageName, pageTitle);
  }, [location.pathname, trackPageView]);

  return null;
}

function App() {
  const fusakaUpgrade = getUpgradeById('fusaka')!;
  const glamsterdamUpgrade = getUpgradeById('glamsterdam')!;
  // const pectraUpgrade = getUpgradeById('pectra')!;

  return (
    <ThemeProvider>
      <Router>
        <AnalyticsTracker />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upgrade/fusaka" element={
            <PublicNetworkUpgradePage
              forkName="Fusaka"
              displayName={fusakaUpgrade.name}
              description={fusakaUpgrade.description}
              status={fusakaUpgrade.status}
              metaEipLink={fusakaUpgrade.metaEipLink}
            />
          } />
          <Route path="/upgrade/glamsterdam" element={
            <PublicNetworkUpgradePage
              forkName="Glamsterdam"
              displayName={glamsterdamUpgrade.name}
              description={glamsterdamUpgrade.description}
              status={glamsterdamUpgrade.status}
              metaEipLink={glamsterdamUpgrade.metaEipLink}
              clientTeamPerspectives={glamsterdamUpgrade.clientTeamPerspectives}
            />
          } />
          <Route path="/rank" element={<RankPage />} />
          <Route path="/feedback" element={<ExternalRedirect />} />
          <Route path="/compare/new" element={<ComparisonCreator />} />
          <Route path="/compare/example" element={<ExampleViewer />} />
          <Route path="/compare/example-epbs-6s" element={<ExampleViewer />} />
          <Route path="/compare/gist" element={<GistViewer />} />
          <Route path="/gist/:author/:gistId" element={<GistViewer />} />
          <Route path="/gist/:gistId" element={<GistViewer />} />
          <Route path="/compare/:id" element={<ComparisonViewer />} />
          {/* <Route path="/upgrade/pectra" element={
            <PublicNetworkUpgradePage
              forkName="Pectra"
              displayName={pectraUpgrade.name}
              description={pectraUpgrade.description}
              activationDate={pectraUpgrade.activationDate}
              status={pectraUpgrade.status}
            />
          } /> */}
          {/* Catch-all route that redirects to home page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;