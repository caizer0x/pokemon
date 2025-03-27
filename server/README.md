# Pokémon Battle Engine Backend

This is the backend server for the Pokémon Battle Engine, a Generation 1 Pokémon battle simulator that follows the mechanics of Pokémon Red, Blue, and Yellow, including quirks and bugs.

## Features

- RESTful API for Pokémon battles
- Random team generation
- Turn-based battle system
- Status effects
- Type effectiveness
- Move selection

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

This will start the server at http://localhost:3001.

### Building for Production

To build the application for production:

```bash
npm run build
```

This will create a `dist` directory with the compiled assets.

### Running the Production Build

To run the production build:

```bash
npm start
```

## API Endpoints

### POST /api/battles

Create a new battle with random teams.

**Response:**

```json
{
  "battleId": "string",
  "playerTeam": [
    {
      "id": "number",
      "name": "string",
      "level": "number",
      "hp": "number",
      "maxHp": "number",
      "moves": [
        {
          "id": "number",
          "name": "string",
          "type": "number",
          "power": "number",
          "accuracy": "number"
        }
      ]
    }
  ],
  "activePokemon": {
    "player": {
      "id": "number",
      "name": "string",
      "level": "number",
      "hp": "number",
      "maxHp": "number",
      "status": "string | null"
    },
    "ai": {
      "id": "number",
      "name": "string",
      "level": "number",
      "hp": "number",
      "maxHp": "number",
      "status": "string | null"
    }
  }
}
```

### GET /api/battles/:battleId

Get the current state of a battle.

**Response:**

```json
{
  "battleId": "string",
  "activePokemon": {
    "player": {
      "id": "number",
      "name": "string",
      "level": "number",
      "hp": "number",
      "maxHp": "number",
      "status": "string | null",
      "moves": [
        {
          "id": "number",
          "name": "string",
          "type": "number",
          "power": "number",
          "accuracy": "number"
        }
      ]
    },
    "ai": {
      "id": "number",
      "name": "string",
      "level": "number",
      "hp": "number",
      "maxHp": "number",
      "status": "string | null"
    }
  },
  "battleStatus": {
    "isOver": "boolean",
    "winner": "string | null"
  }
}
```

### POST /api/battles/:battleId/turn

Execute a turn in the battle.

**Request:**

```json
{
  "moveIndex": "number"
}
```

**Response:**

```json
{
  "battleId": "string",
  "turnResult": {
    "playerMove": {
      "name": "string",
      "type": "number"
    },
    "aiMove": {
      "name": "string",
      "type": "number"
    }
  },
  "activePokemon": {
    "player": {
      "id": "number",
      "name": "string",
      "level": "number",
      "hp": "number",
      "maxHp": "number",
      "status": "string | null",
      "fainted": "boolean",
      "switched": "boolean"
    },
    "ai": {
      "id": "number",
      "name": "string",
      "level": "number",
      "hp": "number",
      "maxHp": "number",
      "status": "string | null",
      "fainted": "boolean",
      "switched": "boolean"
    }
  },
  "battleStatus": {
    "isOver": "boolean",
    "winner": "string | null"
  }
}
```

### POST /api/battles/:battleId/switch

Switch the active Pokémon.

**Request:**

```json
{
  "pokemonIndex": "number"
}
```

**Response:**

```json
{
  "battleId": "string",
  "turnResult": {
    "playerSwitch": {
      "from": "string",
      "to": "string"
    },
    "aiMove": {
      "name": "string",
      "type": "number"
    }
  },
  "activePokemon": {
    "player": {
      "id": "number",
      "name": "string",
      "level": "number",
      "hp": "number",
      "maxHp": "number",
      "status": "string | null",
      "moves": [
        {
          "id": "number",
          "name": "string",
          "type": "number",
          "power": "number",
          "accuracy": "number"
        }
      ]
    },
    "ai": {
      "id": "number",
      "name": "string",
      "level": "number",
      "hp": "number",
      "maxHp": "number",
      "status": "string | null",
      "fainted": "boolean",
      "switched": "boolean"
    }
  },
  "battleStatus": {
    "isOver": "boolean",
    "winner": "string | null"
  }
}
```
