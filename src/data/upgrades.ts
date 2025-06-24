export interface NetworkUpgrade {
  id: string;
  path: string;
  name: string;
  description: string;
  status: 'Active' | 'Upcoming' | 'Planning' | 'Research';
  activationDate: string;
  disabled: boolean;
  metaEipLink?: string;
}

export const networkUpgrades: NetworkUpgrade[] = [
  {
    id: 'pectra',
    path: '/upgrade/pectra',
    name: 'Pectra Upgrade',
    description: 'Recent improvements to Ethereum\'s staking and validator capabilities.',
    status: 'Active',
    activationDate: 'May 2025',
    disabled: true
  },
  {
    id: 'fusaka',
    path: '/upgrade/fusaka',
    name: 'Fusaka Upgrade',
    description: 'Major improvements to Ethereum\'s scalability and user experience, including PeerDAS for enhanced data availability. Named after the combination of "Fulu" (consensus layer upgrade, named after a star) and "Osaka" (execution layer upgrade, named after a Devcon location).',
    status: 'Upcoming',
    activationDate: 'TBD',
    disabled: false
  },
  {
    id: 'glamsterdam',
    path: '/upgrade/glamsterdam',
    name: 'Glamsterdam Upgrade',
    description: 'Major network upgrade with many competing headliner proposals including ePBS, EVM64, Pureth, Delayed Execution, Block-level Access Lists, and FOCIL. Named after the combination of "Amsterdam" (execution layer upgrade, named after the previous Devconnect location) and "Gloas" (consensus layer upgrade, named after a star).',
    status: 'Planning',
    activationDate: 'TBD',
    disabled: false,
    metaEipLink: 'https://ethereum-magicians.org/t/eip-7773-glamsterdam-network-upgrade-meta-thread/21195'
  }
];

export const getUpgradeById = (id: string): NetworkUpgrade | undefined => {
  return networkUpgrades.find(upgrade => upgrade.id === id);
}; 