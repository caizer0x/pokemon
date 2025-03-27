# Pokémon Battle Engine (Gen 1)

A TypeScript implementation of a Generation 1 Pokémon battle engine that follows the mechanics of Pokémon Red, Blue, and Yellow, including quirks and bugs. This project includes both a battle engine library and a web-based battle simulator with a React frontend and Express backend.

## Features

- Complete battle system with turn-based mechanics
- Accurate damage calculation based on Gen 1 formulas
- Status effects (burn, poison, paralysis, sleep, freeze)
- Volatile status effects (confusion, leech seed, wrap)
- Type effectiveness chart
- Critical hit mechanics
- Stat stage modifications
- Special moves with unique effects
- Support for switching Pokémon
- Gen 1 quirks like the 1/256 miss bug
- Web-based battle simulator with React frontend
- RESTful API with Express backend
- Random team generation

## Project Structure

- `src/` - Core battle engine source code
  - `types.ts` - Core interfaces and types
  - `action.ts` - Action type for battle turns
  - `pokemon.ts` - Pokémon class implementation
  - `move.ts` - Move class implementation
  - `battle.ts` - Battle class implementation
  - `index.ts` - Example usage
- `data/` - Data files
  - `types.ts` - Type data and effectiveness chart
  - `moves.ts` - Move data
  - `species.ts` - Pokémon species data
  - `sets/` - Pokémon sets and team generation
- `frontend/` - React frontend
  - `src/` - Frontend source code
    - `components/` - React components
    - `App.tsx` - Main application component
    - `App.css` - Global styles
- `server/` - Express backend
  - `src/` - Backend source code
    - `index.ts` - Server entry point

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
cd frontend && npm install
cd server && npm install
```

## Usage

### Running the Example Battle

```bash
npm run dev
```

This will run the example battle in `src/index.ts` using ts-node.

### Running the Web-Based Battle Simulator

To run both the frontend and backend servers:

```bash
npm run dev:all
```

This will start the backend server at http://localhost:3001 and the frontend development server at http://localhost:5173.

To run just the backend server:

```bash
npm run server
```

To run just the frontend development server:

```bash
npm run frontend
```

### Building the Project

```bash
npm run build
cd frontend && npm run build
cd server && npm run build
```

This will compile the TypeScript code to JavaScript in the respective `dist/` directories.

### Running the Built Project

```bash
npm start
```

This will run the compiled JavaScript code in the `dist/src/index.js` file.

## Creating Your Own Battles

You can create your own battles by following the example in `src/index.ts`. Here's a basic outline:

1. Create Pokémon instances with moves
2. Create teams of Pokémon
3. Create a Battle instance with the teams
4. Execute turns with actions (move or switch)

Example:

```typescript
import { Pokemon } from "./pokemon";
import { Move } from "./move";
import { Battle } from "./battle";
import { Species } from "../data/species";
import { Move as MoveEnum } from "../data/moves";

// Create Pokémon
const pikachu = new Pokemon(
  Species.Pikachu,
  { hp: 15, atk: 15, def: 15, spc: 15, spe: 15 }, // IVs
  { hp: 255, atk: 255, def: 255, spc: 255, spe: 255 }, // EVs
  [
    new Move(MoveEnum.Thunderbolt),
    new Move(MoveEnum.QuickAttack),
    new Move(MoveEnum.Thunder),
    new Move(MoveEnum.Surf)
  ],
  50 // Level
);

// Create teams
const team1 = [pikachu];
const team2 = [/* opponent Pokémon */];

// Create battle
const battle = new Battle(team1, team2);

// Execute a turn
battle.turn(
  { type: "move", move: pikachu.moves[0] },
  { type: "move", move: /* opponent move */ }
);
```

## API Documentation

See the [server README](server/README.md) for detailed API documentation.

## Frontend Documentation

See the [frontend README](frontend/README.md) for detailed frontend documentation.

## License

MIT
