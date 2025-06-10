import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicNetworkUpgradePage from './components/PublicNetworkUpgradePage';
import HomePage from './components/HomePage';
import SensePage from './components/SensePage';
import { getUpgradeById } from './data/upgrades';

function App() {
  const isGitHubPages = window.location.hostname === 'wolovim.github.io';
  const basename = isGitHubPages ? '/forkcast' : '';
  
  const fusakaUpgrade = getUpgradeById('fusaka')!;
  const glamsterdamUpgrade = getUpgradeById('glamsterdam')!;
  const pectraUpgrade = getUpgradeById('pectra')!;

  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sense" element={<SensePage />} />
        <Route path="/upgrade/fusaka" element={
          <PublicNetworkUpgradePage 
            forkName="Fusaka"
            displayName={fusakaUpgrade.name}
            description={fusakaUpgrade.description}
            activationDate={fusakaUpgrade.activationDate}
            status={fusakaUpgrade.status}
          />
        } />
        <Route path="/upgrade/glamsterdam" element={
          <PublicNetworkUpgradePage 
            forkName="Glamsterdam"
            displayName={glamsterdamUpgrade.name}
            description={glamsterdamUpgrade.description}
            activationDate={glamsterdamUpgrade.activationDate}
            status={glamsterdamUpgrade.status}
          />
        } />
        <Route path="/upgrade/pectra" element={
          <PublicNetworkUpgradePage 
            forkName="Pectra"
            displayName={pectraUpgrade.name}
            description={pectraUpgrade.description}
            activationDate={pectraUpgrade.activationDate}
            status={pectraUpgrade.status}
          />
        } />
      </Routes>
    </Router>
  );
}

export default App; 