// src/battle.ts
import { Pokemon } from "./pokemon";
import { Move } from "./move";
import { Action } from "./action";
import { Type, effectiveness } from "../data/types";

export class Battle {
  team1: Pokemon[];
  team2: Pokemon[];
  active1: Pokemon;
  active2: Pokemon;
  turnCount: number = 0;

  // Track additional battle state
  private isRecharging1: boolean = false;
  private isRecharging2: boolean = false;
  private isBound1: boolean = false;
  private isBound2: boolean = false;
  private boundTurns1: number = 0;
  private boundTurns2: number = 0;

  constructor(team1: Pokemon[], team2: Pokemon[]) {
    this.team1 = team1;
    this.team2 = team2;
    this.active1 = team1[0];
    this.active2 = team2[0];
  }

  turn(action1: Action, action2: Action): void {
    this.turnCount++;

    // Handle recharging
    if (this.isRecharging1) {
      action1 = { type: "move", move: null }; // Skip turn
      this.isRecharging1 = false;
    }
    if (this.isRecharging2) {
      action2 = { type: "move", move: null }; // Skip turn
      this.isRecharging2 = false;
    }

    // Handle binding moves
    if (this.isBound1) {
      action1 = { type: "move", move: null }; // Skip turn
      this.boundTurns1--;
      if (this.boundTurns1 <= 0) {
        this.isBound1 = false;
      }
    }
    if (this.isBound2) {
      action2 = { type: "move", move: null }; // Skip turn
      this.boundTurns2--;
      if (this.boundTurns2 <= 0) {
        this.isBound2 = false;
      }
    }

    const order = this.getTurnOrder(action1, action2);

    for (const [side, action] of order) {
      if (this.isBattleOver()) break;
      this.executeAction(side as "team1" | "team2", action);
    }

    this.applyEndOfTurn();
  }

  private getTurnOrder(action1: Action, action2: Action): [string, Action][] {
    // Switches go first
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

    // For moves, compare speed
    const speed1 = this.active1.getEffectiveStat("spe");
    const speed2 = this.active2.getEffectiveStat("spe");

    // If speeds are equal, randomize
    if (speed1 === speed2) {
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

    // Otherwise, faster Pokémon goes first
    return speed1 > speed2
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

    // Handle fainted Pokémon
    if (attacker.isFainted()) return;

    // Handle switching
    if (action.type === "switch") {
      if (side === "team1") {
        const index = this.team1.findIndex((p) => p === action.pokemon);
        if (index !== -1) {
          this.active1 = action.pokemon;
          // Reset volatile status when switching
          this.active1.volatileStatus = [];
        }
      } else {
        const index = this.team2.findIndex((p) => p === action.pokemon);
        if (index !== -1) {
          this.active2 = action.pokemon;
          // Reset volatile status when switching
          this.active2.volatileStatus = [];
        }
      }
      return;
    }

    // Handle null move (skip turn)
    if (!action.move) return;

    // Handle paralysis (25% chance to skip turn in Gen 1)
    if (attacker.status === "paralysis" && Math.random() < 0.25) {
      return; // Skip turn due to paralysis
    }

    // Handle sleep
    if (attacker.status === "sleep") {
      // TODO: Implement sleep counter
      return; // Skip turn due to sleep
    }

    // Handle freeze
    if (attacker.status === "freeze") {
      // 10% chance to thaw
      if (Math.random() < 0.1) {
        attacker.cureStatus();
      } else {
        return; // Skip turn due to freeze
      }
    }

    // Check accuracy with 1/256 miss bug
    const accuracyCheck = Math.random() * 100;
    const moveAccuracy = action.move.accuracy;

    // 1/256 miss bug in Gen 1
    const hit = accuracyCheck < moveAccuracy && Math.random() >= 1 / 256;

    if (!hit) {
      // Move missed
      return;
    }

    // Calculate and apply damage
    const damage = this.calculateDamage(attacker, defender, action.move);
    defender.applyDamage(damage);

    // Apply move effects
    action.move.applyEffect(attacker, defender);

    // Handle binding moves
    if (action.move.effect === 39) {
      // Binding effect
      if (side === "team1") {
        this.isBound2 = true;
        this.boundTurns2 = Math.floor(Math.random() * 3) + 2; // 2-5 turns
      } else {
        this.isBound1 = true;
        this.boundTurns1 = Math.floor(Math.random() * 3) + 2; // 2-5 turns
      }
    }

    // Handle recharging moves (like Hyper Beam)
    if (action.move.effect === 64) {
      // Hyper Beam effect
      // In Gen 1, if the move KOs the target, no recharge is needed
      if (!defender.isFainted()) {
        if (side === "team1") {
          this.isRecharging1 = true;
        } else {
          this.isRecharging2 = true;
        }
      }
    }
  }

  private calculateDamage(
    attacker: Pokemon,
    defender: Pokemon,
    move: Move
  ): number {
    // Handle special damage moves
    if (move.effect === 41) {
      // Special damage effect
      // Handle moves like Seismic Toss, Night Shade, etc.
      if (move.moveId === 69 || move.moveId === 101) {
        // Seismic Toss or Night Shade
        return attacker.level;
      }

      // Handle Dragon Rage
      if (move.moveId === 82) {
        // Dragon Rage
        return 40;
      }

      // Handle Sonic Boom
      if (move.moveId === 49) {
        // Sonic Boom
        return 20;
      }

      // Handle Super Fang
      if (move.moveId === 162) {
        // Super Fang
        return Math.floor(defender.currentHp / 2);
      }

      // Handle Psywave
      if (move.moveId === 149) {
        // Psywave
        return Math.floor(Math.random() * attacker.level * 1.5);
      }
    }

    // If move has 0 power, it doesn't do damage
    if (move.power === 0) return 0;

    // Get the effective attack and defense stats
    const isPhysical = move.category === "physical";
    const attack = isPhysical
      ? attacker.getEffectiveStat("atk")
      : attacker.getEffectiveStat("spc");
    const defense = isPhysical
      ? defender.getEffectiveStat("def")
      : defender.getEffectiveStat("spc");

    // Calculate base damage
    let baseDamage =
      Math.floor(
        Math.floor(
          (((2 * attacker.level) / 5 + 2) * attack * move.power) / defense / 50
        )
      ) + 2;

    // Critical hit calculation
    const critChance = attacker.baseStats.spe / 512; // Gen 1 uses base speed
    const isCrit = Math.random() < critChance;

    if (isCrit) {
      // In Gen 1, crits use base stats instead of modified stats
      baseDamage *= 2;
    }

    // STAB (Same Type Attack Bonus)
    const stab =
      attacker.types.type1 === move.type || attacker.types.type2 === move.type
        ? 1.5
        : 1;

    // Type effectiveness
    let typeMultiplier = 1;

    // Check effectiveness against defender's first type
    const eff1 = effectiveness(defender.types.type1, move.type);
    if (eff1 === 0) typeMultiplier *= 2; // Super effective
    else if (eff1 === 2) typeMultiplier *= 0.5; // Not very effective
    else if (eff1 === 3) typeMultiplier = 0; // Immune

    // Check effectiveness against defender's second type (if different)
    if (defender.types.type1 !== defender.types.type2) {
      const eff2 = effectiveness(defender.types.type2, move.type);
      if (eff2 === 0) typeMultiplier *= 2; // Super effective
      else if (eff2 === 2) typeMultiplier *= 0.5; // Not very effective
      else if (eff2 === 3) typeMultiplier = 0; // Immune
    }

    // Random factor (217-255 in Gen 1)
    const randomFactor = Math.floor(Math.random() * 39) + 217;

    // Final damage calculation
    let damage = Math.floor(
      baseDamage * stab * typeMultiplier * (randomFactor / 255)
    );

    // Damage is at least 1 unless type immunity
    return typeMultiplier === 0 ? 0 : Math.max(1, damage);
  }

  private applyEndOfTurn(): void {
    // Apply end of turn effects like burn, poison, leech seed, etc.

    // Handle burn damage (1/8 of max HP in Gen 1)
    if (this.active1.status === "burn") {
      this.active1.applyDamage(Math.floor(this.active1.stats.hp / 8));
    }
    if (this.active2.status === "burn") {
      this.active2.applyDamage(Math.floor(this.active2.stats.hp / 8));
    }

    // Handle poison damage (1/16 of max HP in Gen 1)
    if (this.active1.status === "poison") {
      this.active1.applyDamage(Math.floor(this.active1.stats.hp / 16));
    }
    if (this.active2.status === "poison") {
      this.active2.applyDamage(Math.floor(this.active2.stats.hp / 16));
    }

    // Handle leech seed
    if (this.active1.volatileStatus.includes("leechSeed")) {
      const damage = Math.floor(this.active1.stats.hp / 16);
      this.active1.applyDamage(damage);
      this.active2.heal(damage);
    }
    if (this.active2.volatileStatus.includes("leechSeed")) {
      const damage = Math.floor(this.active2.stats.hp / 16);
      this.active2.applyDamage(damage);
      this.active1.heal(damage);
    }

    // Handle binding damage
    if (this.isBound1) {
      this.active1.applyDamage(Math.floor(this.active1.stats.hp / 16));
    }
    if (this.isBound2) {
      this.active2.applyDamage(Math.floor(this.active2.stats.hp / 16));
    }
  }

  isBattleOver(): boolean {
    return (
      this.team1.every((p) => p.isFainted()) ||
      this.team2.every((p) => p.isFainted())
    );
  }

  getWinner(): string | null {
    if (this.team1.every((p) => p.isFainted())) return "team2";
    if (this.team2.every((p) => p.isFainted())) return "team1";
    return null;
  }
}
