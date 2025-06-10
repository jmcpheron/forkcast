export interface Contributor {
  name: string;
  client: string;
  role?: string;
  handles?: {
    twitter?: string;
    github?: string;
    discord?: string;
  };
}

export const contributors: Contributor[] = [
  // Nethermind
  {
    name: 'Ben Adams',
    client: 'Nethermind',
  },
  {
    name: 'Ahmad Bitar',
    client: 'Nethermind',
  },
  {
    name: 'Roman',
    client: 'Reth',
  },
  
  // Besu
  {
    name: 'Justin Florentine',
    client: 'Besu',
  },
  {
    name: 'Luis Pinto',
    client: 'Besu',
  },
  {
    name: 'Daniel Lehrner',
    client: 'Besu',
  },
  
  // Geth
  {
    name: 'Marius',
    client: 'Geth',
  },
  {
    name: 'lightclient',
    client: 'Geth',
  },
  
  // Erigon
  {
    name: 'Andrew Ashikhmin',
    client: 'Erigon',
  },
  {
    name: 'Som',
    client: 'Erigon',
  },
  
  // Protocol Support / EF
  {
    name: 'Tim Beiko',
    client: 'Protocol Support',
    role: 'Core Dev Coordinator',
  },
];

// Helper function to get client for a contributor
export const getClientForContributor = (name: string): string => {
  const contributor = contributors.find(c => c.name === name);
  return contributor?.client || 'Unknown';
};

// Helper function to get all contributors for a client
export const getContributorsForClient = (client: string): Contributor[] => {
  return contributors.filter(c => c.client === client);
}; 