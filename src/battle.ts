import { Pokemon } from "./pokemon";
import { Move } from "./move";
import { Action } from "./action";
import { Type, getEffectiveness, calculateEffectiveness } from "../data/types";
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

    // Make sure we're dealing with a move action
    if (action.type !== "move") return;

    // Handle null move (skip turn)
    if (!action.move) return;

    // Handle paralysis (25% chance to skip turn in Gen 1)
    if (attacker.status === "paralysis" && Math.random() < 0.25) {
      this.addToLog(`${attacker.species} is paralyzed and can't move!`);
      return; // Skip turn
    }

    // Handle sleep
    if (attacker.status === "sleep") {
      // For simplicity, 1/3 chance to wake up each turn
      if (Math.random() < 0.33) {
        attacker.cureStatus();
        this.addToLog(`${attacker.species} woke up!`);
      } else {
        this.addToLog(`${attacker.species} is fast asleep.`);
        return; // Skip turn
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
        return; // Skip turn
      }
    }

    // Log the move being used
    this.addToLog(`${attacker.species} used ${action.move.name}!`);

    // Check accuracy with 1/256 miss bug
    const accuracyCheck = Math.random() * 100;
    const moveAccuracy = action.move.accuracy;

    // 1/256 bug
    const hit = accuracyCheck < moveAccuracy && Math.random() >= 1 / 256;

    if (!hit) {
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

    // Now apply side-effects (like recoil, explosion, healing).
    const effectResult = action.move.applyEffect(attacker, defender, damage);
    if (effectResult) {
      this.addToLog(effectResult);
    }

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

    // Handle recharging moves (Hyper Beam)
    if (action.move.effect === 64) {
      // If the defender was not fainted, we must recharge
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
    // Special damage moves
    // Seismic Toss/Night Shade => damage = attacker.level
    // Dragon Rage => 40, Sonic Boom => 20, Super Fang => half current HP, etc.
    if (move.effect === 41) {
      if (move.moveId === 69 || move.moveId === 101) {
        // Seismic Toss or Night Shade
        return attacker.level;
      }
      if (move.moveId === 82) {
        // Dragon Rage
        return 40;
      }
      if (move.moveId === 49) {
        // Sonic Boom
        return 20;
      }
      if (move.moveId === 162) {
        // Super Fang
        return Math.floor(defender.currentHp / 2);
      }
      if (move.moveId === 149) {
        // Psywave
        // "random from 1..(1.5 * level)" approx
        return Math.floor(Math.random() * attacker.level * 1.5);
      }
    }

    // If move has 0 power (like status moves), do no direct damage
    if (move.power === 0) return 0;

    const isPhysical = move.category === "physical";
    const attack = isPhysical
      ? attacker.getEffectiveStat("atk")
      : attacker.getEffectiveStat("spc");
    const defense = isPhysical
      ? defender.getEffectiveStat("def")
      : defender.getEffectiveStat("spc");

    // Base damage
    let baseDamage =
      Math.floor(
        Math.floor(
          (((2 * attacker.level) / 5 + 2) * attack * move.power) / defense / 50
        )
      ) + 2;

    // Gen 1 crit uses base Speed, not stat stages
    const critChance = attacker.baseStats.spe / 512;
    const isCrit = Math.random() < critChance;
    if (isCrit) {
      // In Gen 1, crit doubles final
      baseDamage *= 2;
    }

    // STAB if move type matches one of user's types
    const stab =
      attacker.types.type1 === move.type || attacker.types.type2 === move.type
        ? 1.5
        : 1;

    // Type effectiveness
    const typeMultiplier = calculateEffectiveness(defender.types, move.type);

    // Random factor 217-255
    const randomFactor = Math.floor(Math.random() * 39) + 217;

    let damage = Math.floor(
      baseDamage * stab * typeMultiplier * (randomFactor / 255)
    );

    // If immune, damage = 0, otherwise at least 1
    return typeMultiplier === 0 ? 0 : Math.max(1, damage);
  }

  private getTypeEffectiveness(defender: Pokemon, move: Move): number {
    return calculateEffectiveness(defender.types, move.type);
  }

  private applyEndOfTurn(): void {
    this.addToLog("--- End of turn effects ---");

    // Burn damage
    if (this.active1.status === "burn" && !this.active1.isFainted()) {
      const damage = Math.floor(this.active1.stats.hp / 8);
      this.active1.applyDamage(damage);
      this.addToLog(
        `${this.active1.species} was hurt by its burn! (${damage} damage)`
      );
    }
    if (this.active2.status === "burn" && !this.active2.isFainted()) {
      const damage = Math.floor(this.active2.stats.hp / 8);
      this.active2.applyDamage(damage);
      this.addToLog(
        `${this.active2.species} was hurt by its burn! (${damage} damage)`
      );
    }

    // Poison damage
    if (this.active1.status === "poison" && !this.active1.isFainted()) {
      const damage = Math.floor(this.active1.stats.hp / 16);
      this.active1.applyDamage(damage);
      this.addToLog(
        `${this.active1.species} was hurt by poison! (${damage} damage)`
      );
    }
    if (this.active2.status === "poison" && !this.active2.isFainted()) {
      const damage = Math.floor(this.active2.stats.hp / 16);
      this.active2.applyDamage(damage);
      this.addToLog(
        `${this.active2.species} was hurt by poison! (${damage} damage)`
      );
    }

    // Leech Seed
    if (this.active1.volatileStatus.includes("leechSeed") && !this.active1.isFainted()) {
      const damage = Math.floor(this.active1.stats.hp / 16);
      this.active1.applyDamage(damage);
      if (!this.active2.isFainted()) {
        this.active2.heal(damage);
      }
      this.addToLog(
        `${this.active1.species} had its health sapped by Leech Seed! (${damage} damage)`
      );
      this.addToLog(`${this.active2.species} restored ${damage} HP!`);
    }
    if (this.active2.volatileStatus.includes("leechSeed") && !this.active2.isFainted()) {
      const damage = Math.floor(this.active2.stats.hp / 16);
      this.active2.applyDamage(damage);
      if (!this.active1.isFainted()) {
        this.active1.heal(damage);
      }
      this.addToLog(
        `${this.active2.species} had its health sapped by Leech Seed! (${damage} damage)`
      );
      this.addToLog(`${this.active1.species} restored ${damage} HP!`);
    }

    // Binding moves do some end-of-turn chip
    if (this.isBound1 && !this.active1.isFainted()) {
      const damage = Math.floor(this.active1.stats.hp / 16);
      this.active1.applyDamage(damage);
      this.addToLog(
        `${this.active1.species} is hurt by the binding move! (${damage} damage)`
      );
    }
    if (this.isBound2 && !this.active2.isFainted()) {
      const damage = Math.floor(this.active2.stats.hp / 16);
      this.active2.applyDamage(damage);
      this.addToLog(
        `${this.active2.species} is hurt by the binding move! (${damage} damage)`
      );
    }

    // Check if fainted
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