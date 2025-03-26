Below is a detailed technical specification for implementing a **Generation 1 Pokémon Battle Engine** in TypeScript. This guide provides concrete code structures, interfaces, and key algorithms to build a fully functional battle engine that adheres to the mechanics of Pokémon Red, Blue, and Yellow, including quirks and bugs. Unlike a general overview, this spec focuses on actionable TypeScript implementation details.

---

## Table of Contents

1. [Project Setup](#1-project-setup)
2. [Core Interfaces](#2-core-interfaces)
3. [Pokémon Class](#3-pokémon-class)
4. [Move Class](#4-move-class)
5. [Battle Class](#5-battle-class)
6. [Key Algorithms](#6-key-algorithms)
7. [Handling Gen 1 Quirks](#7-handling-gen-1-quirks)
8. [External Data Integration](#8-external-data-integration)

---

### 1. Project Setup

To start, set up a TypeScript project:

```bash
mkdir pokemon-battle-engine
cd pokemon-battle-engine
npm init -y
npm install typescript --save-dev
npx tsc --init
```

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

Create a directory structure:

```
src/
├── battle.ts
├── move.ts
├── pokemon.ts
├── types.ts
└── data/
    ├── pokemonData.json
    ├── moveData.json
    └── typeChart.json
```

---

### 2. Core Interfaces

Define foundational types and interfaces in `types.ts`:

```typescript
// src/types.ts
export type Stat = "hp" | "atk" | "def" | "spc" | "spe";
export type Status =
  | "burn"
  | "poison"
  | "paralysis"
  | "sleep"
  | "freeze"
  | null;
export type VolatileStatus =
  | "substitute"
  | "confusion"
  | "leechSeed"
  | "wrap"
  | null;

export interface BaseStats {
  hp: number;
  atk: number;
  def: number;
  spc: number;
  spe: number;
}

export interface IVs {
  hp: number;
  atk: number;
  def: number;
  spc: number;
  spe: number;
}

export interface EVs {
  hp: number;
  atk: number;
  def: number;
  spc: number;
  spe: number;
}

export interface TypeEffectiveness {
  [attackingType: string]: {
    [defendingType: string]: number; // 0, 0.5, 1, 2
  };
}

export interface MoveData {
  name: string;
  power: number;
  accuracy: number;
  type: string;
  category: "physical" | "special";
  effect?: string; // e.g., 'burn', 'sleep'
}

export type Action =
  | { type: "move"; move: Move }
  | { type: "switch"; pokemon: Pokemon };
```

---

### 3. Pokémon Class

Implement the `Pokemon` class in `pokemon.ts` to manage individual Pokémon:

```typescript
// src/pokemon.ts
import { BaseStats, IVs, EVs, Stat, Status, VolatileStatus } from "./types";
import { Move } from "./move";

export class Pokemon {
  species: string;
  baseStats: BaseStats;
  ivs: IVs;
  evs: EVs;
  level: number = 100;
  stats: BaseStats;
  currentHp: number;
  status: Status = null;
  volatileStatus: VolatileStatus[] = [];
  statStages: { [stat in Stat]: number } = {
    hp: 0,
    atk: 0,
    def: 0,
    spc: 0,
    spe: 0,
  };
  moves: Move[];

  constructor(
    species: string,
    baseStats: BaseStats,
    ivs: IVs,
    evs: EVs,
    moves: Move[]
  ) {
    this.species = species;
    this.baseStats = baseStats;
    this.ivs = ivs;
    this.evs = evs;
    this.moves = moves;
    this.stats = this.calculateStats();
    this.currentHp = this.stats.hp;
  }

  private calculateStats(): BaseStats {
    const stats: Partial<BaseStats> = {};
    for (const stat of ["hp", "atk", "def", "spc", "spe"] as Stat[]) {
      if (stat === "hp") {
        stats.hp =
          Math.floor(
            ((this.baseStats.hp +
              this.ivs.hp +
              Math.floor(Math.sqrt(this.evs.hp) / 8)) *
              this.level) /
              100
          ) +
          10 +
          this.level;
      } else {
        stats[stat] =
          Math.floor(
            ((this.baseStats[stat] +
              this.ivs[stat] +
              Math.floor(Math.sqrt(this.evs[stat]) / 8)) *
              this.level) /
              100
          ) + 5;
      }
    }
    return stats as BaseStats;
  }

  getEffectiveStat(stat: Stat): number {
    if (stat === "hp") return this.stats.hp;
    let multiplier =
      this.statStages[stat] >= 0
        ? (2 + this.statStages[stat]) / 2
        : 2 / (2 - this.statStages[stat]);
    multiplier = Math.max(0.25, Math.min(4, multiplier));
    let effective = this.stats[stat] * multiplier;
    if (stat === "spe" && this.status === "paralysis") effective *= 0.25; // Gen 1 uses 0.25
    return Math.floor(effective);
  }

  applyDamage(damage: number): void {
    this.currentHp = Math.max(0, this.currentHp - damage);
  }

  setStatus(status: Status): void {
    if (!this.status) this.status = status;
  }

  addVolatileStatus(status: VolatileStatus): void {
    if (!this.volatileStatus.includes(status)) this.volatileStatus.push(status);
  }

  removeVolatileStatus(status: VolatileStatus): void {
    this.volatileStatus = this.volatileStatus.filter((s) => s !== status);
  }
}
```

---

### 4. Move Class

Implement the `Move` class in `move.ts`:

```typescript
// src/move.ts
import { MoveData, Pokemon } from "./types";

export class Move {
  name: string;
  power: number;
  accuracy: number;
  type: string;
  category: "physical" | "special";
  effect?: string;

  constructor(data: MoveData) {
    this.name = data.name;
    this.power = data.power;
    this.accuracy = data.accuracy;
    this.type = data.type;
    this.category = data.category;
    this.effect = data.effect;
  }

  applyEffect(attacker: Pokemon, defender: Pokemon): void {
    if (!this.effect || Math.random() > 0.3) return; // Simplified effect chance
    switch (this.effect) {
      case "burn":
        defender.setStatus("burn");
        break;
      case "poison":
        defender.setStatus("poison");
        break;
      case "sleep":
        defender.setStatus("sleep");
        break;
      // Add more effects as needed
    }
  }
}
```

---

### 5. Battle Class

Implement the `Battle` class in `battle.ts` to manage the battle flow:

```typescript
// src/battle.ts
import { Pokemon } from "./pokemon";
import { Action } from "./types";

export class Battle {
  team1: Pokemon[];
  team2: Pokemon[];
  active1: Pokemon;
  active2: Pokemon;
  turnCount: number = 0;

  constructor(team1: Pokemon[], team2: Pokemon[]) {
    this.team1 = team1;
    this.team2 = team2;
    this.active1 = team1[0];
    this.active2 = team2[0];
  }

  turn(action1: Action, action2: Action): void {
    this.turnCount++;
    const order = this.getTurnOrder(action1, action2);
    for (const [side, action] of order) {
      this.executeAction(side as "team1" | "team2", action);
    }
    this.applyEndOfTurn();
  }

  private getTurnOrder(action1: Action, action2: Action): [string, Action][] {
    if (action1.type === "switch" && action2.type !== "switch")
      return [
        ["team1", action1],
        ["team2", action2],
      ];
    if (action2.type === "switch" && action1.type !== "switch")
      return [
        ["team2", action2],
        ["team1", action1],
      ];
    if (action1.type === "switch" && action2.type === "switch") {
      return Math.random() < 0.5
        ? [
            ["team1", action1],
            ["team2", action2],
          ]
        : [
            ["team2", action2],
            ["team1", action1],
          ];
    }
    const speed1 = this.active1.getEffectiveStat("spe");
    const speed2 = this.active2.getEffectiveStat("spe");
    return speed1 >= speed2
      ? [
          ["team1", action1],
          ["team2", action2],
        ]
      : [
          ["team2", action2],
          ["team1", action1],
        ];
  }

  private executeAction(side: "team1" | "team2", action: Action): void {
    const attacker = side === "team1" ? this.active1 : this.active2;
    const defender = side === "team1" ? this.active2 : this.active1;

    if (action.type === "switch") {
      if (side === "team1") this.active1 = action.pokemon;
      else this.active2 = action.pokemon;
      return;
    }

    // Check accuracy with 1/256 miss bug
    const hit =
      Math.random() * 255 < action.move.accuracy * 2.55 ||
      action.move.accuracy === 100
        ? Math.random() >= 1 / 256
        : false;
    if (!hit) return;

    const damage = this.calculateDamage(attacker, defender, action.move);
    defender.applyDamage(damage);
    action.move.applyEffect(attacker, defender);
  }

  private calculateDamage(
    attacker: Pokemon,
    defender: Pokemon,
    move: Move
  ): number {
    const level = 100;
    const attack =
      move.category === "physical"
        ? attacker.getEffectiveStat("atk")
        : attacker.getEffectiveStat("spc");
    const defense =
      move.category === "physical"
        ? defender.getEffectiveStat("def")
        : defender.getEffectiveStat("spc");
    const baseDamage = Math.floor(
      Math.floor((((2 * level) / 5 + 2) * attack * move.power) / defense / 50)
    );
    const stab = attacker.species === move.type ? 1.5 : 1; // Simplified STAB
    const typeEffectiveness = 1; // Use typeChart.json in practice
    const randomFactor = Math.floor(Math.random() * 39) + 217;
    const critChance = attacker.getEffectiveStat("spe") / 512;
    const isCrit = Math.random() < critChance;
    let damage = Math.floor(
      baseDamage * stab * typeEffectiveness * (randomFactor / 255)
    );
    if (isCrit) damage *= 2; // Use base stats in practice for crit
    return Math.max(1, damage);
  }

  private applyEndOfTurn(): void {
    for (const p of [this.active1, this.active2]) {
      if (p.status === "burn") p.applyDamage(Math.floor(p.stats.hp / 8));
      if (p.status === "poison") p.applyDamage(Math.floor(p.stats.hp / 16));
    }
  }

  isBattleOver(): boolean {
    return (
      this.team1.every((p) => p.currentHp === 0) ||
      this.team2.every((p) => p.currentHp === 0)
    );
  }
}
```

---

### 6. Key Algorithms

#### 6.1. Turn Order

- Switches go first.
- For moves, compare effective Speed (`getEffectiveStat('spe')`).
- Ties are randomized.

#### 6.2. Damage Calculation

- Uses the Gen 1 formula with STAB, type effectiveness (stubbed here), random factor (217–255), and critical hits.

#### 6.3. Status Effects

- Burn: Halves Attack (adjust in `getEffectiveStat`), 1/8 HP per turn.
- Poison: 1/16 HP per turn.
- Paralysis: 25% chance to skip (add to `executeAction`), 0.25x Speed.

---

### 7. Handling Gen 1 Quirks

- **1/256 Miss Bug**: Added in `executeAction`.
- **Hyper Beam**: Skip recharge on KO/miss (add condition in `executeAction`).
- **Critical Hit**: Use base stats for attack/defense (modify `calculateDamage`).

---

### 8. External Data Integration

Load data in a main file (e.g., `index.ts`):

```typescript
// src/index.ts
import { Pokemon } from "./pokemon";
import { Move } from "./move";
import { Battle } from "./battle";
import pokemonData from "./data/pokemonData.json";
import moveData from "./data/moveData.json";

const pikachu = new Pokemon(
  "Pikachu",
  pokemonData["pikachu"].baseStats,
  { hp: 15, atk: 15, def: 15, spc: 15, spe: 15 },
  { hp: 255, atk: 255, def: 255, spc: 255, spe: 255 },
  [new Move(moveData["thunderbolt"])]
);
const charmander = new Pokemon(
  "Charmander",
  pokemonData["charmander"].baseStats,
  { hp: 15, atk: 15, def: 15, spc: 15, spe: 15 },
  { hp: 255, atk: 255, def: 255, spc: 255, spe: 255 },
  [new Move(moveData["ember"])]
);

const battle = new Battle([pikachu], [charmander]);
battle.turn(
  { type: "move", move: pikachu.moves[0] },
  { type: "move", move: charmander.moves[0] }
);
```
