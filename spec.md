# Generation 1 Pokémon Battle Engine – Detailed Technical Specification

This document describes a **TypeScript-based** Generation 1 Pokémon Battle Engine, handling many of the unique mechanics and quirks from Pokémon Red, Blue, and Yellow (RBY). The codebase includes a **battle system** (turn handling, damage calculation, status effects, etc.), a **data layer** (species data, moves, type charts), and a **web-based** demonstration with a React frontend and an Express/WS backend.

---

## Table of Contents

1. **Overview & Goals**
2. **Project Structure**
3. **Core Data & Types**
4. **Pokémon Class**
5. **Move Class**
6. **Battle Class**
7. **Gen 1 Mechanics & Quirks**
8. **How to Run**
9. **References**

---

## 1. Overview & Goals

The primary goal is an **accurate** Gen 1 Pokémon battle engine, replicating RBY mechanics, including:
- **Stat calculations** using IVs, EVs, and level.
- **Damage formula** (critical hits, random factor, STAB, type effectiveness).
- **Status ailments** (burn, poison, paralysis, sleep, freeze).
- **Volatile statuses** (Reflect, Light Screen, Confusion, Wrap, Leech Seed).
- **Turn order** with reordering logic (switches first, Speed-based, speed ties).
- **Distinct Gen 1 bugs/quirks**:
  - 1/256 miss bug
  - Special-based critical hits (Speed-based probability)
  - Hyper Beam not requiring recharge if it KOs
  - Move-based unique mechanics (e.g. binding moves, partial trapping)

A demonstration web app is provided, featuring:
- **Express** server for bundling battles.
- **WebSocket** connections for real-time updates.
- **React** front-end that displays the battle, logs, and simple user actions.

---

## 2. Project Structure

```
pokemon/
├── data/
│   ├── species.ts        # Pokémon species definitions (stats, types)
│   ├── moves.ts          # All move definitions & enumerations
│   ├── types.ts          # Type chart logic, type enum, etc.
│   └── sets/
│       ├── data.json     # Hard-coded sets & levels for random generation
│       └── teams.ts      # RandomTeamGenerator that reads from data.json
├── src/
│   ├── action.ts         # Action type (move or switch)
│   ├── battle.ts         # Core Battle class controlling the entire fight
│   ├── move.ts           # Move class with side effects
│   ├── pokemon.ts        # Pokémon class with stats & status
│   ├── types.ts          # Shared TS types (Stats, Status, VolatileStatus, etc.)
│   └── index.ts          # Example usage / CLI test
├── server/
│   ├── src/
│   │   ├── index.ts      # Express server, config, WebSocket setup
│   │   └── wsServer.ts   # WebSocket code bridging the front-end and the battle
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/   # React components for battle display
│       ├── main.tsx      # Entry point
│       └── App.tsx
└── spec.md               # This specification

```

---

## 3. Core Data & Types

**`src/types.ts`** defines the fundamental data contracts:

- **BaseStats**, **IVs**, **EVs**: Represent a Pokémon's stats or genetic values (Gen 1 uses 0–15 IV range).
- **Status**: `'burn' | 'poison' | 'paralysis' | 'sleep' | 'freeze' | null`.
- **VolatileStatus**: `'substitute' | 'confusion' | 'leechSeed' | 'wrap' | 'reflect' | 'lightscreen' | null`.
- **MoveData**: Basic info about a move (power, accuracy, type, effect).
- **Action**: Describes what a combatant does in a turn: either `{ type: 'move'; move: Move }` or `{ type: 'switch'; pokemon: Pokemon }`.

**`data/types.ts`** has the **Type** enum and a 2D **TYPE_CHART** matrix for computing damage multipliers, plus utilities for combining dual types.

---

## 4. Pokémon Class

Located in **`src/pokemon.ts`**. Key highlights:

- **Stats Calculation**:
  ```ts
  private calculateStats(): BaseStats {
    // (Base + IV + floor(sqrt(EV)/8)) * Level / 100 + ...
  }
  ```
- **Methods**:
  - `applyDamage(damage: number)`: subtract HP, min 0.
  - `heal(amount: number)`: add HP up to max.
  - `setStatus(status: Status)`: apply a main status if none is present.
  - `addVolatileStatus(...)`: apply a short-term effect (Reflect, Confusion, etc.).
  - `isFainted()`: checks if `currentHp <= 0`.

Internally, it stores **baseStats**, **IVs**, **EVs**, **level**, and an array of **Move** objects. In Gen 1, many details are simpler than later gens (no separation of Attack/Special Attack, etc.).

---

## 5. Move Class

Defined in **`src/move.ts`**. Each Move:

- **Fields**: `moveId`, `name`, `power`, `accuracy`, `type`, `category` ("physical" or "special"), `effect` (a special effect code).
- **applyEffect(...)**: after dealing damage, we check for side effects (poison, burn, recoil, etc.).

We use an enumerated approach in **`data/moves.ts`**, each move has an ID (e.g. `Move.Thunderbolt`), effect codes, base power, etc.

---

## 6. Battle Class

Central logic in **`src/battle.ts`**. Key responsibilities:

1. **Team & Pokémon Tracking**:
   - Two arrays of `Pokemon` (`team1`, `team2`).
   - Each side’s current active Pokémon (`active1`, `active2`).
   - Turn count, battle log, states like `isRecharging1` (Hyper Beam), `isBound1` (Wrap), etc.

2. **turn(action1, action2)**:
   - Calls sub-steps for switching, recharging, binding, then determines the speed order for move resolution.
   - Executes each side’s action in order. If a side tries to move but is paralyzed/asleep/frozen, skip.

3. **Damage Calculation**:
   - `calculateDamage(...)` uses the Gen 1 formula:
     \[
       \text{BaseDamage} = \left\lfloor \left\lfloor\frac{((2 \times L)/5 + 2) \times \text{Atk} \times \text{Power}}{\text{Def}} / 50\right\rfloor \right\rfloor + 2
     \]
   - Then we apply:
     - Critical hits (speed-based).
     - STAB (1.5 if move type = user's type).
     - Type effectiveness from `calculateEffectiveness`.
     - Random factor (217–255 range).
     - Reflect/Light Screen halves final physical/special damage.

4. **applyEndOfTurn()**:
   - Burns (1/8 max HP), poison (1/16), leech seed (1/16).
   - Binding damage if user is locked by Wrap or similar.
   - Checking if either Pokémon fainted.

5. **Switching**:
   - Typically done prior to moves. If user switches out, Reflect/Light Screen vanish from that user in Gen 1.

6. **Logging**:
   - The `battleLog` array accumulates all relevant text events.

7. **Finish Condition**:
   - `isBattleOver()` checks if all Pokémon on one team are fainted.
   - `getWinner()` returns `"team1"`, `"team2"`, or `null` if ongoing.

**Binding Moves** (Wrap, Fire Spin) cause forced skip for the victim for 2–5 turns. The class sets a boolean flag + turn counter.

**Hyper Beam** recharges next turn if the defender does not faint.

---

## 7. Gen 1 Mechanics & Quirks

1. **1/256 Miss Bug**: Even 100% accurate moves have a 1/256 chance to miss. Implemented as:
   ```ts
   const hits = accuracyRoll < moveAccuracy && Math.random() >= 1 / 256;
   ```
2. **Paralysis**: Speed is quartered, 25% chance to be "fully paralyzed."
3. **Critical Hits**: Based on user’s base Speed, not stage changes. Formula is `Speed / 512`.
4. **Freeze**: Pokémon never thaws unless a fire-type move is used, or in this code, we include a 10% chance each turn for demonstration.
5. **Hyper Beam**: Only recharges if the target didn't faint. If the attack KOs, no recharge.

---

## 8. How to Run

### 1. **Install** dependencies:
```bash
npm install
cd frontend && npm install
cd ../server && npm install
```

### 2. **Development**:

- Run the server:
  ```bash
  npm run server
  ```
  This starts `ts-node src/index.ts` in `/server`.

- Run the frontend:
  ```bash
  npm run frontend
  ```
  This starts the Vite dev server at `http://localhost:5173`.

- **Combined**:
  ```bash
  npm run dev:all
  ```
  Runs both servers together via `concurrently`.

### 3. **Production**:
- Build everything:
  ```bash
  npm run build
  cd frontend && npm run build
  cd ../server && npm run build
  ```
- Start the compiled server:
  ```bash
  cd server
  npm start
  ```
- Optionally serve `frontend/dist` as static content or connect them behind a proxy.

---

## 9. References

- [Pokémon Showdown] for partial data references
- [Bulbapedia – RBY Mechanics](https://bulbapedia.bulbagarden.net/wiki/Game_mechanics)
- [Smogon – RBY Competitive Mechanics](https://www.smogon.com/forums/forums/ruins-of-alph.64/)

This battle engine aims for a faithful Gen 1 simulation. Some details (e.g., freeze chance to thaw each turn) are simplified to make it less punishing.