import { Pokemon } from "./pokemon";
import { Move } from "./move";
import { Action } from "./types";
import { Type, calculateEffectiveness } from "../data/types";
import { Species } from "../data/species";

/**
 * Battle
 * ---------
 * Manages a single Generation 1 Pokémon battle instance. It tracks:
 * - Two teams (team1 vs. team2)
 * - Each team's active Pokémon
 * - Turn count, logs, and any special battle states like recharging or binding
 */
export class Battle {
  team1: Pokemon[];
  team2: Pokemon[];
  active1: Pokemon;
  active2: Pokemon;

  turnCount: number = 0;
  battleLog: string[] = [];

  // Additional "Gen 1 quirk" states:
  private isRecharging1: boolean = false;
  private isRecharging2: boolean = false;
  private isBound1: boolean = false;
  private isBound2: boolean = false;
  private boundTurns1: number = 0;
  private boundTurns2: number = 0;

  /**
   * Create a new battle with two teams of Pokémon.
   * By default, the first Pokémon in each team is active.
   */
  constructor(team1: Pokemon[], team2: Pokemon[]) {
    this.team1 = team1;
    this.team2 = team2;
    this.active1 = team1[0];
    this.active2 = team2[0];
    this.addToLog("Battle started!");
  }

  /**
   * Retrieve all messages from the battle log.
   */
  getBattleLog(): string[] {
    return this.battleLog;
  }

  /**
   * Add a formatted message to the battle log.
   * Also logs to console for convenience.
   */
  addToLog(message: string): void {
    // Example: We could do advanced string replacements here if needed
    this.battleLog.push(message);
    console.log(message);
  }

  /**
   * Execute a single turn in the battle.
   * 1. Handle switching (these happen before moves).
   * 2. Handle recharging or binding states to skip moves if needed.
   * 3. Determine move order by comparing Speed.
   * 4. Execute each side's action in order.
   * 5. Apply end-of-turn effects (burn, poison, leech seed, etc.).
   */
  turn(action1: Action, action2: Action): void {
    this.turnCount++;
    this.addToLog(`--- Turn ${this.turnCount} ---`);

    // Switching always resolves before moves
    action1 = this.handleSwitch("team1", action1);
    action2 = this.handleSwitch("team2", action2);

    // If either side was recharging due to Hyper Beam, skip their move
    action1 = this.handleRecharge("team1", action1);
    action2 = this.handleRecharge("team2", action2);

    // Handle "binding" moves (Wrap, Fire Spin, etc.)
    action1 = this.handleBinding("team1", action1);
    action2 = this.handleBinding("team2", action2);

    // Figure out who attacks first
    const order = this.getTurnOrder(action1, action2);

    // Perform each side's action in order
    for (const [side, action] of order) {
      // If the battle ended mid-turn (a side is out of Pokémon), stop
      if (this.isBattleOver()) break;
      this.executeAction(side as "team1" | "team2", action);
    }

    // Conclude with end-of-turn statuses
    this.applyEndOfTurn();
  }

  /**
   * If the given action is a switch, perform the switch and return a no-op move action.
   * Otherwise, return the original action unchanged.
   */
  private handleSwitch(side: "team1" | "team2", action: Action): Action {
    if (action.type !== "switch") return action;

    const oldMon = side === "team1" ? this.active1 : this.active2;
    const newMon = action.pokemon;

    this.executeSwitch(side, newMon);
    this.addToLog(
      `${side === "team1" ? "Team 1" : "Team 2"} switched ${Species[oldMon.species]} for ${Species[newMon.species]}`
    );

    // Return a no-op move so that the user doesn't get an action beyond switching
    return { type: "move", move: null };
  }

  /**
   * If the given side is recharging from Hyper Beam, skip their move this turn.
   * Then clear the recharge flag for next turn.
   */
  private handleRecharge(side: "team1" | "team2", action: Action): Action {
    if (side === "team1" && this.isRecharging1) {
      this.isRecharging1 = false;
      return { type: "move", move: null };
    }
    if (side === "team2" && this.isRecharging2) {
      this.isRecharging2 = false;
      return { type: "move", move: null };
    }
    return action;
  }

  /**
   * If the given side is under a binding move (e.g. Wrap), skip their move this turn.
   * Reduce the remaining "bound" turns, clearing the flag when exhausted.
   */
  private handleBinding(side: "team1" | "team2", action: Action): Action {
    if (side === "team1" && this.isBound1) {
      this.boundTurns1--;
      if (this.boundTurns1 <= 0) this.isBound1 = false;
      return { type: "move", move: null };
    }
    if (side === "team2" && this.isBound2) {
      this.boundTurns2--;
      if (this.boundTurns2 <= 0) this.isBound2 = false;
      return { type: "move", move: null };
    }
    return action;
  }

  /**
   * Determine the order of moves for this turn. Speed ties are broken randomly.
   */
  private getTurnOrder(action1: Action, action2: Action): [string, Action][] {
    const speed1 = this.active1.getEffectiveStat("spe");
    const speed2 = this.active2.getEffectiveStat("spe");

    if (speed1 === speed2) {
      // Speed tie, random
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

  /**
   * Given a side and an action, carry out the move or skip if needed.
   */
  private executeAction(side: "team1" | "team2", action: Action): void {
    // Identify attacker vs. defender
    const attacker = side === "team1" ? this.active1 : this.active2;
    const defender = side === "team1" ? this.active2 : this.active1;

    // If the attacker is fainted or there's no move, do nothing
    if (attacker.isFainted() || action.type !== "move" || !action.move) {
      return;
    }

    // Check for full paralysis
    if (attacker.status === "paralysis" && Math.random() < 0.25) {
      this.addToLog(`${Species[attacker.species]} is paralyzed and can't move!`);
      return;
    }

    // Check sleep
    if (attacker.status === "sleep") {
      // 1/3 chance to wake up
      if (Math.random() < 0.33) {
        attacker.cureStatus();
        this.addToLog(`${Species[attacker.species]} woke up!`);
      } else {
        this.addToLog(`${Species[attacker.species]} is fast asleep.`);
        return;
      }
    }

    // Check freeze
    if (attacker.status === "freeze") {
      // 10% chance to thaw each turn
      if (Math.random() < 0.1) {
        attacker.cureStatus();
        this.addToLog(`${Species[attacker.species]} thawed out!`);
      } else {
        this.addToLog(`${Species[attacker.species]} is frozen solid!`);
        return;
      }
    }

    // Use the move
    this.addToLog(`${Species[attacker.species]} used ${action.move.name}!`);

    // Check accuracy with 1/256 bug
    const accuracyRoll = Math.random() * 100;
    const moveAccuracy = action.move.accuracy;
    const hits = accuracyRoll < moveAccuracy && Math.random() >= 1 / 256;
    if (!hits) {
      this.addToLog(`${Species[attacker.species]}'s attack missed!`);
      return;
    }

    // Calculate damage
    const damage = this.calculateDamage(attacker, defender, action.move);

    // Apply damage
    defender.applyDamage(damage);
    if (damage > 0) {
      this.addToLog(
        `${action.move.name} dealt ${damage} damage to ${Species[defender.species]}!`
      );

      const typeMultiplier = this.getTypeEffectiveness(defender, action.move);
      if (typeMultiplier > 1) {
        this.addToLog("It's super effective!");
      } else if (typeMultiplier < 1 && typeMultiplier > 0) {
        this.addToLog("It's not very effective...");
      } else if (typeMultiplier === 0) {
        this.addToLog("It had no effect!");
      }
    } else {
      this.addToLog(`${action.move.name} had no effect on ${Species[defender.species]}.`);
    }

    // Apply side effects from the move
    const effectLog = action.move.applyEffect(attacker, defender, damage);
    if (effectLog) {
      this.addToLog(effectLog);
    }

    // If it was a binding move (Wrap), set bound status on the defender
    if (action.move.effect === 39) {
      // 39 ~ "Binding"
      if (side === "team1") {
        this.isBound2 = true;
        this.boundTurns2 = Math.floor(Math.random() * 3) + 2;
      } else {
        this.isBound1 = true;
        this.boundTurns1 = Math.floor(Math.random() * 3) + 2;
      }
    }

    // If it was Hyper Beam (effect 64), set recharge if the defender isn't fainted
    if (action.move.effect === 64 && !defender.isFainted()) {
      if (side === "team1") {
        this.isRecharging1 = true;
      } else {
        this.isRecharging2 = true;
      }
    }
  }

  /**
   * Calculate the damage for a given move from attacker to defender.
   * Includes Gen 1 quirks: critical hits, random factor, STAB, type effectiveness, reflect/lightscreen, etc.
   */
  private calculateDamage(attacker: Pokemon, defender: Pokemon, move: Move): number {
    // Some special-damage moves skip the usual formula (Seismic Toss, etc.)
    if (move.effect === 41) {
      // effect 41 ~ "SpecialDamage" in our table
      // We check which move ID it is (like Seismic Toss, Dragon Rage, etc.)
      // but here we handle that in move.applyEffect or with simpler logic:
      if (move.moveId === 69 || move.moveId === 101) {
        // Seismic Toss or Night Shade
        return attacker.level;
      }
      if (move.moveId === 82) {
        // Dragon Rage
        return 40;
      }
      if (move.moveId === 49) {
        // SonicBoom
        return 20;
      }
      if (move.moveId === 162) {
        // Super Fang
        return Math.floor(defender.currentHp / 2);
      }
      if (move.moveId === 149) {
        // Psywave
        return Math.floor(Math.random() * attacker.level * 1.5);
      }
    }

    // If power is 0, no damage
    if (move.power === 0) return 0;

    const isPhysical = move.category === "physical";
    const atk = isPhysical
      ? attacker.getEffectiveStat("atk")
      : attacker.getEffectiveStat("spc");
    const def = isPhysical
      ? defender.getEffectiveStat("def")
      : defender.getEffectiveStat("spc");

    let baseDamage = Math.floor(
      Math.floor((((2 * attacker.level) / 5 + 2) * atk * move.power) / def / 50)
    ) + 2;

    // Critical hit chance
    const critChance = attacker.baseStats.spe / 512;
    const isCrit = Math.random() < critChance;
    if (isCrit) {
      baseDamage *= 2;
    }

    // STAB
    let stab = 1;
    if (
      attacker.types.type1 === move.type ||
      attacker.types.type2 === move.type
    ) {
      stab = 1.5;
    }

    // Type effectiveness
    const typeMultiplier = this.getTypeEffectiveness(defender, move);
    // Random factor: 217 ~ 255
    const randomFactor = Math.floor(Math.random() * 39) + 217;

    let damage = Math.floor(
      baseDamage * stab * typeMultiplier * (randomFactor / 255)
    );
    if (typeMultiplier === 0) {
      damage = 0;
    } else {
      damage = Math.max(1, damage);
    }

    // Reflect/Light Screen if they exist
    if (isPhysical && defender.volatileStatus.includes("reflect") && damage > 0) {
      damage = Math.floor(damage / 2);
    }
    if (!isPhysical && defender.volatileStatus.includes("lightscreen") && damage > 0) {
      damage = Math.floor(damage / 2);
    }

    return damage;
  }

  /**
   * Return a numeric multiplier for the move's type attacking the defender's types.
   */
  private getTypeEffectiveness(defender: Pokemon, move: Move): number {
    return calculateEffectiveness(defender.types, move.type);
  }

  /**
   * Apply end-of-turn effects: burn damage, poison damage, leech seed, binding, etc.
   */
  private applyEndOfTurn(): void {
    this.addToLog("--- End of turn effects ---");

    // Burn damage
    if (this.active1.status === "burn" && !this.active1.isFainted()) {
      const dmg = Math.floor(this.active1.stats.hp / 8);
      this.active1.applyDamage(dmg);
      this.addToLog(`${Species[this.active1.species]} was hurt by its burn! (${dmg} dmg)`);
    }
    if (this.active2.status === "burn" && !this.active2.isFainted()) {
      const dmg = Math.floor(this.active2.stats.hp / 8);
      this.active2.applyDamage(dmg);
      this.addToLog(`${Species[this.active2.species]} was hurt by its burn! (${dmg} dmg)`);
    }

    // Poison damage
    if (this.active1.status === "poison" && !this.active1.isFainted()) {
      const dmg = Math.floor(this.active1.stats.hp / 16);
      this.active1.applyDamage(dmg);
      this.addToLog(`${Species[this.active1.species]} was hurt by poison! (${dmg} dmg)`);
    }
    if (this.active2.status === "poison" && !this.active2.isFainted()) {
      const dmg = Math.floor(this.active2.stats.hp / 16);
      this.active2.applyDamage(dmg);
      this.addToLog(`${Species[this.active2.species]} was hurt by poison! (${dmg} dmg)`);
    }

    // Leech Seed
    if (this.active1.volatileStatus.includes("leechSeed") && !this.active1.isFainted()) {
      const dmg = Math.floor(this.active1.stats.hp / 16);
      this.active1.applyDamage(dmg);
      if (!this.active2.isFainted()) {
        this.active2.heal(dmg);
      }
      this.addToLog(
        `${Species[this.active1.species]} had its health sapped by Leech Seed! (${dmg} dmg)`
      );
      this.addToLog(`${Species[this.active2.species]} restored ${dmg} HP!`);
    }
    if (this.active2.volatileStatus.includes("leechSeed") && !this.active2.isFainted()) {
      const dmg = Math.floor(this.active2.stats.hp / 16);
      this.active2.applyDamage(dmg);
      if (!this.active1.isFainted()) {
        this.active1.heal(dmg);
      }
      this.addToLog(
        `${Species[this.active2.species]} had its health sapped by Leech Seed! (${dmg} dmg)`
      );
      this.addToLog(`${Species[this.active1.species]} restored ${dmg} HP!`);
    }

    // Binding
    if (this.isBound1 && !this.active1.isFainted()) {
      const dmg = Math.floor(this.active1.stats.hp / 16);
      this.active1.applyDamage(dmg);
      this.addToLog(
        `${Species[this.active1.species]} is hurt by the binding move! (${dmg} dmg)`
      );
    }
    if (this.isBound2 && !this.active2.isFainted()) {
      const dmg = Math.floor(this.active2.stats.hp / 16);
      this.active2.applyDamage(dmg);
      this.addToLog(
        `${Species[this.active2.species]} is hurt by the binding move! (${dmg} dmg)`
      );
    }

    // Faint checks
    if (this.active1.isFainted()) {
      this.addToLog(`${Species[this.active1.species]} fainted!`);
    }
    if (this.active2.isFainted()) {
      this.addToLog(`${Species[this.active2.species]} fainted!`);
    }
  }

  /**
   * Check if all Pokémon on a team have fainted, in which case the battle is over.
   */
  isBattleOver(): boolean {
    const allFaint1 = this.team1.every((p) => p.isFainted());
    const allFaint2 = this.team2.every((p) => p.isFainted());
    if (allFaint1 || allFaint2) {
      this.addToLog("--- Battle Over ---");
      if (allFaint1) {
        this.addToLog("Team 2 wins!");
      } else {
        this.addToLog("Team 1 wins!");
      }
      return true;
    }
    return false;
  }

  /**
   * Return the string "team1" or "team2" if there's a winner, or null if still ongoing.
   */
  getWinner(): string | null {
    if (this.team1.every((p) => p.isFainted())) return "team2";
    if (this.team2.every((p) => p.isFainted())) return "team1";
    return null;
  }

  /**
   * Switch the active Pokémon on a given side to the specified new Pokémon.
   * In Gen 1, Reflect/Light Screen vanish for that user on switching out, so we reset volatile statuses.
   */
  private executeSwitch(side: "team1" | "team2", newMon: Pokemon): void {
    if (side === "team1") {
      this.active1.volatileStatus = [];
      this.active1 = newMon;
      newMon.volatileStatus = [];
    } else {
      this.active2.volatileStatus = [];
      this.active2 = newMon;
      newMon.volatileStatus = [];
    }
  }
}