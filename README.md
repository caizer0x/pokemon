# Pokémon Battle Engine (Gen 1)

A TypeScript implementation of a Generation 1 Pokémon battle engine that follows the mechanics of Pokémon Red, Blue, and Yellow, including quirks and bugs.

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

## Project Structure

- `src/` - Source code
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

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

## Usage

### Running the Example

```bash
npm run dev
```

This will run the example battle in `src/index.ts` using ts-node.

### Building the Project

```bash
npm run build
```

This will compile the TypeScript code to JavaScript in the `dist/` directory.

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

## License

MIT
