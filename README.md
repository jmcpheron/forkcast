# Forkcast - Ethereum Network Upgrades

An experiment by the Protocol & Application Support team to provide public-facing information about Ethereum network upgrades.

## Live Site

Visit the deployed site at: https://wolovim.github.io/forkcast

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

The site automatically deploys to GitHub Pages when changes are pushed to the main branch.

To manually deploy:
```bash
npm run deploy
```

## Setup Notes

This is a React + TypeScript + Vite application using:
- React Router for navigation
- Tailwind CSS for styling
- GitHub Pages for hosting

The site provides accessible explanations of Ethereum Improvement Proposals (EIPs) for the upcoming Fusaka network upgrade.

## Overview

This is a standalone client-side application that provides public access to information about Ethereum network upgrades. It displays EIPs (Ethereum Improvement Proposals) in a user-friendly format, showing their inclusion status, impact on different stakeholders, and alignment with Ethereum's strategic goals.

## Features

- **Network Upgrade Overview**: View upcoming, scheduled, and completed Ethereum network upgrades
- **EIP Details**: Detailed information about each EIP including:
  - Layman-friendly explanations
  - Inclusion stage (Proposed, Considered, Scheduled, Declined)
  - Impact on different stakeholders (developers, users, validators, etc.)
  - Alignment with Ethereum's North Star goals (Scale L1, Scale L2, Improve UX)
  - Benefits and timeline information
- **Responsive Design**: Modern, clean interface built with Tailwind CSS
- **Navigation**: Easy navigation between different network upgrades

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository and navigate to the forkcast-public directory:
   ```bash
   cd forkcast-public
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build

## Project Structure

```
forkcast-public/
├── src/
│   ├── components/
│   │   ├── HomePage.tsx           # Landing page with upgrade list
│   │   └── PublicNetworkUpgradePage.tsx  # Main upgrade detail page
│   ├── data/
│   │   └── eips.json             # EIP data
│   ├── App.tsx                   # Main app component with routing
│   ├── main.tsx                  # App entry point
│   ├── index.css                 # Global styles
│   └── vite-env.d.ts            # Vite type definitions
├── public/                       # Static assets
├── package.json
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
└── README.md
```

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **ESLint** - Code linting

## Data Structure

The application uses a JSON file (`src/data/eips.json`) containing EIP information. Each EIP includes:

- Basic metadata (ID, title, status, author, etc.)
- Fork relationships (which network upgrades include this EIP)
- Public-facing explanations and impact assessments

## Contributing

This is a standalone application extracted from the main Forkcast project. For contributions or issues, please refer to the main project repository.

## License

This project is part of the Forkcast ecosystem for tracking Ethereum network upgrades. 