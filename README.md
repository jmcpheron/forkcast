# EIP Battle Cards - Compare Ethereum Improvement Proposals

An experiment by jmcpheron, adjacent to [forecast.org](https://forecast.org), for creating and sharing detailed comparisons of Ethereum Improvement Proposals (EIPs).

## Live Site

Visit the deployed site at: https://jmcpheron.github.io/eip-battle-cards/

## Overview

EIP Battle Cards is a platform that enables the Ethereum community to create, share, and explore detailed comparisons between competing EIPs. It combines neutral data from forecast.org with community perspectives to help stakeholders understand the tradeoffs between different proposals.

## Features

- **Create Battle Cards**: Build comprehensive comparisons between 2 or more EIPs
- **Neutral Data Foundation**: Pulls official EIP information from forecast.org including:
  - Layman-friendly explanations
  - Stakeholder impacts
  - North Star alignment (Scale L1, Scale blobs, Improve UX)
  - Benefits and tradeoffs
- **Author Analysis Layer**: Add your own perspectives on top of the neutral data:
  - Personal preferences and reasoning
  - Risk analysis
  - Timeline comparisons
  - Custom visualizations
- **GitHub Gist Integration**: Export and import battle cards via GitHub Gists
- **Community Sharing**: Share battle cards using clean URLs like `/gist/username/gistid`

## Example Battle Card

Check out our featured example: [ePBS vs 6-Second Slots](https://jmcpheron.github.io/eip-battle-cards/#/compare/example) - Comparing EIP-7732 (Enshrined PBS) and EIP-7782 (6-Second Slots) for Glamsterdam's consensus layer fork choice.

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

## Creating a Battle Card

1. Visit the [Create Battle Card](https://jmcpheron.github.io/eip-battle-cards/#/compare/new) page
2. Select the EIPs you want to compare
3. Add your analysis sections (author preference, risk analysis, etc.)
4. Preview your battle card
5. Export to GitHub Gist for sharing

## Importing from GitHub Gist

1. Click "Import from Gist" on the homepage
2. Paste your Gist URL (e.g., `https://gist.github.com/jmcpheron/e91f4fc20a65e61a367b804a15f0cdf9`)
3. The battle card will load and display immediately
4. Share using the clean URL format: `https://jmcpheron.github.io/eip-battle-cards/#/gist/jmcpheron/e91f4fc20a65e61a367b804a15f0cdf9`

## Data Structure

Battle cards combine two data sources:

1. **Forecast.org Data** (`src/data/eips.json`): Official, neutral EIP information
2. **Author Comparisons**: Personal analysis and perspectives layered on top

Example comparison structure:
```json
{
  "meta": {
    "title": "Your Comparison Title",
    "author": "Your Name",
    "created": "2025-01-28",
    "description": "Brief description"
  },
  "eips": [7732, 7782],
  "sections": [
    {
      "type": "author-preference",
      "preferredEip": 7732,
      "reasoning": "Your analysis..."
    }
  ]
}
```

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **ESLint** - Code linting

## Contributing

We welcome contributions! Please feel free to submit issues or pull requests.

## Deployment

The site automatically deploys to GitHub Pages when changes are merged into the `main` branch.

## Project Structure

```
eip-battle-cards/
├── src/
│   ├── components/
│   │   ├── HomePage.tsx                    # Landing page with featured cards
│   │   ├── comparisons/
│   │   │   ├── ComparisonCreator.tsx      # Create new battle cards
│   │   │   ├── ComparisonViewer.tsx       # View battle cards
│   │   │   └── ComparisonRenderer.tsx     # Render comparison sections
│   │   └── ...
│   ├── data/
│   │   ├── eips.json                      # Forecast.org EIP data
│   │   └── comparisons/                   # Example comparisons
│   ├── App.tsx                            # Main app component with routing
│   └── ...
├── package.json
├── vite.config.ts
└── README.md
```

## Contact

Have feedback? Contact [jmcpheron](mailto:jmcpheron@ethereum.org) or [@jmcpheron](https://x.com/jmcpheron)