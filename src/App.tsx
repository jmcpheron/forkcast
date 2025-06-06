import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicNetworkUpgradePage from './components/PublicNetworkUpgradePage';
import HomePage from './components/HomePage';

function App() {
  // Use the same logic as vite.config.ts for base path
  const basename = import.meta.env.MODE === 'production' ? '/forkcast' : '';

  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upgrade/fusaka" element={
          <PublicNetworkUpgradePage 
            forkName="Fusaka"
            displayName="Fusaka Upgrade"
            description="Major improvements to Ethereum's scalability and user experience, including PeerDAS for enhanced data availability."
            activationDate="Q4 2025"
            status="Upcoming"
          />
        } />
        <Route path="/upgrade/glamsterdam" element={
          <PublicNetworkUpgradePage 
            forkName="Glamsterdam"
            displayName="Glamsterdam Upgrade"
            description="Next-generation features for Ethereum's future development."
            activationDate="TBD"
            status="Planning"
          />
        } />
        <Route path="/upgrade/pectra" element={
          <PublicNetworkUpgradePage 
            forkName="Pectra"
            displayName="Pectra Upgrade"
            description="Recent improvements to Ethereum's staking and validator capabilities."
            activationDate="Q1 2025"
            status="Scheduled"
          />
        } />
      </Routes>
    </Router>
  );
}

export default App; 