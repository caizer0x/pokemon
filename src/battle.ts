// src/battle.ts
import { Pokemon } from "./pokemon";
import { Move } from "./move";
import { Action } from "./action";
import { Type, effectiveness } from "../data/types";
import { Species } from "../data/species";

export class Battle {
  team1: Pokemon[];
  team2: Pokemon[];
  active1: Pokemon;
  active2: Pokemon;
  turnCount: number = 0;
  battleLog: string[] = []; // Store battle log messages

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
    this.addToLog("Battle started!");
  }

  // Method to add a message to the battle log
  addToLog(message: string): void {
    // First, handle the "damage to X" pattern
    let formattedMessage = message.replace(/damage to (\d+)/g, (match, id) => {
      const speciesId = parseInt(id);
      if (speciesId >= 1 && speciesId <= 151) {
        return `damage to ${Species[speciesId]}`;
      }
      return match;
    });

    // Then handle other patterns where species IDs might appear
    formattedMessage = formattedMessage.replace(
      /(Team \d switched |switched | for | used | to |^)(\d+)(\s|$| will| used| is| was| had| fainted)/g,
      (match, prefix, id, suffix) => {
        const speciesId = parseInt(id);
        if (speciesId >= 1 && speciesId <= 151) {
          return prefix + Species[speciesId] + suffix;
        }
        return match;
      }
    );

    this.battleLog.push(formattedMessage);
    console.log(formattedMessage); // Also log to console for debugging
  }

  // Get the battle log
  getBattleLog(): string[] {
    return this.battleLog;
  }

  turn(action1: Action, action2: Action): void {
    this.turnCount++;
    this.addToLog(`--- Turn ${this.turnCount} ---`);

    // Handle switching first (doesn't take up a turn)
    if (action1.type === "switch") {
      const oldPokemon = this.active1;
      this.executeSwitch("team1", action1.pokemon);
      this.addToLog(
        `Team 1 switched ${oldPokemon.species} for ${action1.pokemon.species}`
      );
      // Replace with a null move to indicate the player can still make a move
      action1 = { type: "move", move: null };
    }

    if (action2.type === "switch") {
      const oldPokemon = this.active2;
      this.executeSwitch("team2", action2.pokemon);
      this.addToLog(
        `Team 2 switched ${oldPokemon.species} for ${action2.pokemon.species}`
      );
      // Replace with a null move to indicate the player can still make a move
      action2 = { type: "move", move: null };
    }

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

    // Log who goes first
    if (order[0][0] === "team1") {
      this.addToLog(`${this.active1.species} will move first`);
    } else {
      this.addToLog(`${this.active2.species} will move first`);
    }

    for (const [side, action] of order) {
      if (this.isBattleOver()) break;
      this.executeAction(side as "team1" | "team2", action);
    }

    this.applyEndOfTurn();
  }

  // Helper method to handle switching Pokémon
  private executeSwitch(side: "team1" | "team2", pokemon: Pokemon): void {
    if (side === "team1") {
      const index = this.team1.findIndex((p) => p === pokemon);
      if (index !== -1) {
        this.active1 = pokemon;
        // Reset volatile status when switching
        this.active1.volatileStatus = [];
      }
    } else {
      const index = this.team2.findIndex((p) => p === pokemon);
      if (index !== -1) {
        this.active2 = pokemon;
        // Reset volatile status when switching
        this.active2.volatileStatus = [];
      }
    }
  }

  private getTurnOrder(action1: Action, action2: Action): [string, Action][] {
    // Since switches are handled separately, we only need to compare move speeds

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

    // We no longer need to handle switching here as it's done before the turn

    // Make sure we're dealing with a move action
    if (action.type !== "move") return;

    // Handle null move (skip turn)
    if (!action.move) return;

    // Handle paralysis (25% chance to skip turn in Gen 1)
    if (attacker.status === "paralysis" && Math.random() < 0.25) {
      this.addToLog(`${attacker.species} is paralyzed and can't move!`);
      return; // Skip turn due to paralysis
    }

    // Handle sleep
    if (attacker.status === "sleep") {
      // In Gen 1, sleep lasts 1-7 turns
      // For simplicity, we'll use a 1/3 chance to wake up each turn
      if (Math.random() < 0.33) {
        attacker.cureStatus();
        this.addToLog(`${attacker.species} woke up!`);
      } else {
        this.addToLog(`${attacker.species} is fast asleep.`);
        return; // Skip turn due to sleep
      }
    }

    // Handle freeze
    if (attacker.status === "freeze") {
      // 10% chance to thaw
      if (Math.random() < 0.1) {
        attacker.cureStatus();
        this.addToLog(`${attacker.species} thawed out!`);
      } else {
        this.addToLog(`${attacker.species} is frozen solid!`);
        return; // Skip turn due to freeze
      }
    }

    // Log the move being used
    this.addToLog(`${attacker.species} used ${action.move.name}!`);

    // Check accuracy with 1/256 miss bug
    const accuracyCheck = Math.random() * 100;
    const moveAccuracy = action.move.accuracy;

    // 1/256 miss bug in Gen 1
    const hit = accuracyCheck < moveAccuracy && Math.random() >= 1 / 256;

    if (!hit) {
      // Move missed
      this.addToLog(`${attacker.species}'s attack missed!`);
      return;
    }

    // Calculate and apply damage
    const damage = this.calculateDamage(attacker, defender, action.move);
    defender.applyDamage(damage);

    // Log damage dealt
    if (damage > 0) {
      this.addToLog(
        `${action.move.name} dealt ${damage} damage to ${defender.species}!`
      );

      // Log effectiveness
      const typeMultiplier = this.getTypeEffectiveness(defender, action.move);
      if (typeMultiplier > 1) {
        this.addToLog("It's super effective!");
      } else if (typeMultiplier < 1 && typeMultiplier > 0) {
        this.addToLog("It's not very effective...");
      } else if (typeMultiplier === 0) {
        this.addToLog("It had no effect!");
      }
    } else {
      this.addToLog(
        `${action.move.name} had no effect on ${defender.species}.`
      );
    }

    // Apply move effects
    const effectResult = action.move.applyEffect(attacker, defender);
    if (effectResult) {
      this.addToLog(effectResult);
    }

    // Handle binding moves
    if (action.type === "move" && action.move && action.move.effect === 39) {
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
    if (action.type === "move" && action.move && action.move.effect === 64) {
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

  // Helper method to get type effectiveness for logging
  private getTypeEffectiveness(defender: Pokemon, move: Move): number {
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

    return typeMultiplier;
  }

  private applyEndOfTurn(): void {
    this.addToLog("--- End of turn effects ---");

    // Apply end of turn effects like burn, poison, leech seed, etc.

    // Handle burn damage (1/8 of max HP in Gen 1)
    if (this.active1.status === "burn") {
      const damage = Math.floor(this.active1.stats.hp / 8);
      this.active1.applyDamage(damage);
      this.addToLog(
        `${this.active1.species} was hurt by its burn! (${damage} damage)`
      );
    }
    if (this.active2.status === "burn") {
      const damage = Math.floor(this.active2.stats.hp / 8);
      this.active2.applyDamage(damage);
      this.addToLog(
        `${this.active2.species} was hurt by its burn! (${damage} damage)`
      );
    }

    // Handle poison damage (1/16 of max HP in Gen 1)
    if (this.active1.status === "poison") {
      const damage = Math.floor(this.active1.stats.hp / 16);
      this.active1.applyDamage(damage);
      this.addToLog(
        `${this.active1.species} was hurt by poison! (${damage} damage)`
      );
    }
    if (this.active2.status === "poison") {
      const damage = Math.floor(this.active2.stats.hp / 16);
      this.active2.applyDamage(damage);
      this.addToLog(
        `${this.active2.species} was hurt by poison! (${damage} damage)`
      );
    }

    // Handle leech seed
    if (this.active1.volatileStatus.includes("leechSeed")) {
      const damage = Math.floor(this.active1.stats.hp / 16);
      this.active1.applyDamage(damage);
      this.active2.heal(damage);
      this.addToLog(
        `${this.active1.species} had its health sapped by Leech Seed! (${damage} damage)`
      );
      this.addToLog(
        `${this.active2.species} restored ${damage} HP from Leech Seed!`
      );
    }
    if (this.active2.volatileStatus.includes("leechSeed")) {
      const damage = Math.floor(this.active2.stats.hp / 16);
      this.active2.applyDamage(damage);
      this.active1.heal(damage);
      this.addToLog(
        `${this.active2.species} had its health sapped by Leech Seed! (${damage} damage)`
      );
      this.addToLog(
        `${this.active1.species} restored ${damage} HP from Leech Seed!`
      );
    }

    // Handle binding damage
    if (this.isBound1) {
      const damage = Math.floor(this.active1.stats.hp / 16);
      this.active1.applyDamage(damage);
      this.addToLog(
        `${this.active1.species} is hurt by the binding move! (${damage} damage)`
      );
    }
    if (this.isBound2) {
      const damage = Math.floor(this.active2.stats.hp / 16);
      this.active2.applyDamage(damage);
      this.addToLog(
        `${this.active2.species} is hurt by the binding move! (${damage} damage)`
      );
    }

    // Check if any Pokémon fainted
    if (this.active1.isFainted()) {
      this.addToLog(`${this.active1.species} fainted!`);
    }
    if (this.active2.isFainted()) {
      this.addToLog(`${this.active2.species} fainted!`);
    }
  }

  isBattleOver(): boolean {
    const team1Fainted = this.team1.every((p) => p.isFainted());
    const team2Fainted = this.team2.every((p) => p.isFainted());

    if (team1Fainted || team2Fainted) {
      this.addToLog("--- Battle Over ---");
      if (team1Fainted) {
        this.addToLog("Team 2 wins!");
      } else {
        this.addToLog("Team 1 wins!");
      }
      return true;
    }

    return false;
  }

  getWinner(): string | null {
    if (this.team1.every((p) => p.isFainted())) return "team2";
    if (this.team2.every((p) => p.isFainted())) return "team1";
    return null;
  }
}
