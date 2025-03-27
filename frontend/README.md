# Pokémon Battle Engine Frontend

This is the frontend for the Pokémon Battle Engine, a Generation 1 Pokémon battle simulator that follows the mechanics of Pokémon Red, Blue, and Yellow, including quirks and bugs.

## Features

- Battle with random teams of 6 Pokémon
- Turn-based battle system
- Status effects
- Type effectiveness
- Move selection
- Battle log

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Install dependencies:

```bash
npm install
```

### Development

To run the development server:

```bash
npm run dev
```

This will start the Vite development server at http://localhost:5173.

### Building for Production

To build the application for production:

```bash
npm run build
```

This will create a `dist` directory with the compiled assets.

### Running the Production Build

To preview the production build:

```bash
npm run preview
```

## Project Structure

- `src/` - Source code
  - `components/` - React components
    - `BattleScreen.tsx` - Main battle screen component
    - `PokemonCard.tsx` - Pokémon card component
    - `MovesList.tsx` - Moves list component
    - `StartScreen.tsx` - Start screen component
  - `App.tsx` - Main application component
  - `App.css` - Global styles
  - `main.tsx` - Entry point

## Backend

The frontend communicates with the backend server running at http://localhost:3001. Make sure the backend server is running before using the frontend.
