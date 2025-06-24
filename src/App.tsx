import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicNetworkUpgradePage from './components/PublicNetworkUpgradePage';
import HomePage from './components/HomePage';
import { getUpgradeById } from './data/upgrades';

function App() {
  const isGitHubPages = window.location.hostname === 'wolovim.github.io';
  const basename = isGitHubPages ? '/forkcast' : '';
  
  const fusakaUpgrade = getUpgradeById('fusaka')!;
  const glamsterdamUpgrade = getUpgradeById('glamsterdam')!;
  // const pectraUpgrade = getUpgradeById('pectra')!;

  return (
    <Router basename={basename}>
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
          />
        } />
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
  );
}

export default App; 