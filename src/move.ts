// src/move.ts
import { MoveData, Status } from "./types";
import { Type, special } from "../data/types";
import { Effect, Move as MoveEnum, get, pp, isMulti } from "../data/moves";

export class Move {
  name: string;
  power: number;
  accuracy: number;
  type: Type;
  category: "physical" | "special";
  effect: Effect;
  moveId: MoveEnum;

  constructor(moveId: MoveEnum) {
    this.moveId = moveId;

    // Get move data from the data/moves.ts
    const moveData = get(moveId);

    // Map from the data structure to our class properties
    this.name = MoveEnum[moveId]; // Convert enum value to string name
    this.power = moveData.bp;
    this.accuracy = moveData.accuracy;
    this.type = moveData.type;
    this.effect = moveData.effect;

    // Determine if the move is physical or special based on type
    // In Gen 1, types Fire, Water, Grass, Electric, Psychic, Ice, Dragon are special
    this.category = special(moveData.type) ? "special" : "physical";
  }

  applyEffect(attacker: any, defender: any): void {
    // Implementation will depend on the specific effect
    // This is a simplified version that handles some common effects

    if (!this.effect) return;

    // Handle status effects
    if (this.effect === Effect.Poison) {
      defender.setStatus("poison");
    } else if (
      this.effect === Effect.BurnChance1 ||
      this.effect === Effect.BurnChance2
    ) {
      if (Math.random() < 0.3) {
        // Simplified chance
        defender.setStatus("burn");
      }
    } else if (
      this.effect === Effect.ParalyzeChance1 ||
      this.effect === Effect.ParalyzeChance2
    ) {
      if (Math.random() < 0.3) {
        // Simplified chance
        defender.setStatus("paralysis");
      }
    } else if (this.effect === Effect.Sleep) {
      defender.setStatus("sleep");
    } else if (this.effect === Effect.FreezeChance) {
      if (Math.random() < 0.1) {
        // Simplified chance
        defender.setStatus("freeze");
      }
    } else if (this.effect === Effect.Confusion) {
      defender.addVolatileStatus("confusion");
    } else if (this.effect === Effect.LeechSeed) {
      defender.addVolatileStatus("leechSeed");
    }

    // Handle stat changes
    // These would need to be implemented in the Pokemon class
    if (this.effect === Effect.AttackDown1) {
      defender.modifyStat("atk", -1);
    } else if (this.effect === Effect.DefenseDown1) {
      defender.modifyStat("def", -1);
    } else if (this.effect === Effect.SpeedDown1) {
      defender.modifyStat("spe", -1);
    } else if (this.effect === Effect.AttackUp1) {
      attacker.modifyStat("atk", 1);
    } else if (this.effect === Effect.DefenseUp1) {
      attacker.modifyStat("def", 1);
    } else if (this.effect === Effect.SpecialUp1) {
      attacker.modifyStat("spc", 1);
    }

    // More effects would be implemented here
  }

  // Get the PP of the move
  getPP(): number {
    return pp(this.moveId);
  }

  // Check if the move is a high critical hit ratio move
  hasHighCritical(): boolean {
    return this.effect === Effect.HighCritical;
  }

  // Check if the move is a multi-hit move
  isMultiHit(): boolean {
    return isMulti(this.effect);
  }

  // Get the number of hits for multi-hit moves
  getHitCount(): number {
    if (!this.isMultiHit()) return 1;

    if (this.effect === Effect.DoubleHit) return 2;

    // For other multi-hit moves, Gen 1 uses a specific distribution
    const rand = Math.random();
    if (rand < 0.375) return 2;
    if (rand < 0.75) return 3;
    if (rand < 0.875) return 4;
    return 5;
  }
}
