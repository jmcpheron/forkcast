import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicNetworkUpgradePage from './components/PublicNetworkUpgradePage';
import HomePage from './components/HomePage';
import { getUpgradeById } from './data/upgrades';

function App() {
  // Use the same logic as vite.config.ts for base path
  const basename = import.meta.env.MODE === 'production' ? '/forkcast' : '';

  const fusakaUpgrade = getUpgradeById('fusaka')!;
  const glamsterdamUpgrade = getUpgradeById('glamsterdam')!;
  const pectraUpgrade = getUpgradeById('pectra')!;

  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<HomePage />} />
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