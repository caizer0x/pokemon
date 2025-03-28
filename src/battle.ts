import { Pokemon } from "./pokemon";
import { Move as MoveClass } from "./move";  // Renamed to avoid conflict with the enum
import { Action } from "./types";
import { Species } from "../data/species";
import { calculateEffectiveness } from "../data/types";
import { Move as MoveEnum, Effect } from "../data/moves";

/**
 * The Battle class coordinates a turn-based battle between two teams.
 */
export class Battle {
  team1: Pokemon[];
  team2: Pokemon[];
  active1: Pokemon;
  active2: Pokemon;
  turnCount: number = 0;
  battleLog: string[] = [];

  // Additional states
  private isRecharging1 = false;
  private isRecharging2 = false;
  private isBound1 = false;
  private boundTurns1 = 0;
  private isBound2 = false;
  private boundTurns2 = 0;
  private thrashTurns1 = 0;
  private thrashTurns2 = 0;
  private isThrashing1 = false;
  private isThrashing2 = false;
  // Bide, Focus Energy, etc. can be tracked similarly
  // For simplicity, we won't implement all in detail.

  constructor(team1: Pokemon[], team2: Pokemon[]) {
    this.team1 = team1;
    this.team2 = team2;
    this.active1 = team1[0];
    this.active2 = team2[0];
    this.addToLog("Battle started!");
  }

  getBattleLog(): string[] {
    return this.battleLog;
  }
  addToLog(message: string): void {
    this.battleLog.push(message);
    console.log(message);
  }

  turn(action1: Action, action2: Action): void {
    this.turnCount++;
    this.addToLog(`--- Turn ${this.turnCount} ---`);

    // Switches first
    action1 = this.handleSwitch("team1", action1);
    action2 = this.handleSwitch("team2", action2);

    // Hyper Beam recharge
    action1 = this.handleRecharge("team1", action1);
    action2 = this.handleRecharge("team2", action2);

    // Binding skip
    action1 = this.handleBinding("team1", action1);
    action2 = this.handleBinding("team2", action2);

    const order = this.getTurnOrder(action1, action2);

    for (let i = 0; i < order.length; i++) {
      if (this.isBattleOver()) break;
      const [side, action] = order[i];

      const attacker = side === "team1" ? this.active1 : this.active2;
      const defender = side === "team1" ? this.active2 : this.active1;

      // Execute
      this.executeAction(side, action);
      if (this.isBattleOver()) break;

      // If that action caused the opponent to flinch, skip the opponent's upcoming action if it hasn't happened yet
      if (i === 0) {
        const otherSide = order[1][0];
        const otherAction = order[1][1];
        const otherMon = otherSide === "team1" ? this.active1 : this.active2;
        if (otherMon.volatileStatus.includes("flinch")) {
          this.addToLog(`${Species[otherMon.species]} flinched and couldn't move!`);
          otherMon.removeVolatileStatus("flinch");
          // Skip the second action
          break;
        }
      }
    }

    // End-of-turn effects
    this.applyEndOfTurn();
  }

  handleSwitch(side: "team1" | "team2", action: Action): Action {
    if (action.type !== "switch") return action;
    const oldMon = side === "team1" ? this.active1 : this.active2;
    const newMon = action.pokemon;
    this.executeSwitch(side, newMon);
    this.addToLog(
      `${side === "team1" ? "Team 1" : "Team 2"} switched ${Species[oldMon.species]} for ${Species[newMon.species]}`
    );
    // return no-op move
    return { type: "move", move: null };
  }

  handleRecharge(side: "team1" | "team2", action: Action): Action {
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

  handleBinding(side: "team1" | "team2", action: Action): Action {
    if (side === "team1" && this.isBound1) {
      this.boundTurns1--;
      if (this.boundTurns1 <= 0) {
        this.isBound1 = false;
        this.addToLog(`${Species[this.active1.species]} is freed from binding!`);
      } else {
        return { type: "move", move: null };
      }
    }
    if (side === "team2" && this.isBound2) {
      this.boundTurns2--;
      if (this.boundTurns2 <= 0) {
        this.isBound2 = false;
        this.addToLog(`${Species[this.active2.species]} is freed from binding!`);
      } else {
        return { type: "move", move: null };
      }
    }
    return action;
  }

  /**
   * Change to returning [("team1"|"team2"), Action][]
   */
  getTurnOrder(action1: Action, action2: Action): [("team1"|"team2"), Action][] {
    const speed1 = this.active1.getEffectiveStat("spe");
    const speed2 = this.active2.getEffectiveStat("spe");
    if (speed1 === speed2) {
      return Math.random() < 0.5
        ? [["team1", action1], ["team2", action2]]
        : [["team2", action2], ["team1", action1]];
    }
    return speed1 > speed2
      ? [["team1", action1], ["team2", action2]]
      : [["team2", action2], ["team1", action1]];
  }

  executeAction(side: "team1" | "team2", action: Action): void {
    const attacker = side === "team1" ? this.active1 : this.active2;
    const defender = side === "team1" ? this.active2 : this.active1;

    if (attacker.isFainted() || action.type !== "move" || !action.move) {
      return;
    }

    // Check for paralysis
    if (attacker.status === "paralysis" && Math.random() < 0.25) {
      this.addToLog(`${Species[attacker.species]} is paralyzed and can't move!`);
      return;
    }

    // Check if asleep
    if (attacker.status === "sleep") {
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
      if (Math.random() < 0.1) {
        attacker.cureStatus();
        this.addToLog(`${Species[attacker.species]} thawed out!`);
      } else {
        this.addToLog(`${Species[attacker.species]} is frozen solid!`);
        return;
      }
    }

    this.addToLog(`${Species[attacker.species]} used ${action.move.name}!`);

    // Check Swift ignoring accuracy
    let isGuaranteedHit = false;
    if (action.move.effect === Effect.Swift) {
      isGuaranteedHit = true;
    }

    // Possibly an OHKO move
    let moveAcc = action.move.accuracy;
    if (action.move.effect === Effect.OHKO) {
      // We'll keep it simple
    }

    // Jump Kick or High Jump Kick => recoil if miss
    const isJumpKick = (action.move.effect === Effect.JumpKick);

    // Accuracy check
    let hits = true;
    if (!isGuaranteedHit) {
      const accuracyRoll = Math.random() * 100;
      if (accuracyRoll >= moveAcc || Math.random() < 1/256) {
        hits = false;
      }
    }
    if (!hits) {
      this.addToLog(`${Species[attacker.species]}'s attack missed!`);
      if (isJumpKick) {
        attacker.applyDamage(1);
        this.addToLog(`${Species[attacker.species]} kept going and crashed!`);
      }
      return;
    }

    // Multi-hit
    let totalDamage = 0;
    const hitsCount = action.move.getHitCount();
    for (let i = 0; i < hitsCount; i++) {
      if (defender.isFainted()) break;
      const dmg = this.calculateDamage(attacker, defender, action.move);
      defender.applyDamage(dmg);
      totalDamage += dmg;
      if (dmg > 0) {
        this.addToLog(
          `${action.move.name} hit ${Species[defender.species]} for ${dmg} damage!`
        );
        const multiplier = this.getTypeEffectiveness(defender, action.move);
        if (multiplier > 1) {
          this.addToLog("It's super effective!");
        } else if (multiplier < 1 && multiplier > 0) {
          this.addToLog("It's not very effective...");
        } else if (multiplier === 0) {
          this.addToLog("It had no effect!");
        }
      } else {
        this.addToLog(`${action.move.name} did no damage.`);
      }
    }

    // Side effect
    const effectMsg = action.move.applyEffect(attacker, defender, totalDamage);
    if (effectMsg) {
      this.addToLog(effectMsg);
    }

    // Binding?
    if (action.move.effect === Effect.Binding && !defender.isFainted()) {
      if (side === "team1") {
        this.isBound2 = true;
        this.boundTurns2 = Math.floor(Math.random() * 4) + 2;
      } else {
        this.isBound1 = true;
        this.boundTurns1 = Math.floor(Math.random() * 4) + 2;
      }
    }

    // Hyper Beam recharge
    if (action.move.effect === Effect.HyperBeam && !defender.isFainted()) {
      if (side === "team1") this.isRecharging1 = true;
      else this.isRecharging2 = true;
    }
  }

  calculateDamage(attacker: Pokemon, defender: Pokemon, move: MoveClass): number {
    // SpecialDamage (Seismic Toss, DragonRage, etc.)
    if (move.effect === Effect.SpecialDamage) {
      const id = move.moveId;
      if (id === MoveEnum.SeismicToss || id === MoveEnum.NightShade) {
        return attacker.level;
      }
      if (id === MoveEnum.DragonRage) {
        return 40;
      }
      if (id === MoveEnum.SonicBoom) {
        return 20;
      }
      if (id === MoveEnum.Psywave) {
        const max = Math.floor(attacker.level * 1.5);
        return 1 + Math.floor(Math.random() * max);
      }
      return 0;
    }
    if (move.effect === Effect.SuperFang) {
      return Math.floor(defender.currentHp / 2);
    }

    if (move.power === 0) return 0;

    const isPhysical = move.category === "physical";
    const atk = isPhysical
      ? attacker.getEffectiveStat("atk")
      : attacker.getEffectiveStat("spc");
    const def = isPhysical
      ? defender.getEffectiveStat("def")
      : defender.getEffectiveStat("spc");

    let baseDamage = Math.floor(
      Math.floor(((2 * attacker.level) / 5 + 2) * atk * move.power / def) / 50
    ) + 2;

    // Critical hits
    let crit = false;
    let critChance = attacker.baseStats.spe / 512;
    if (move.hasHighCritical()) {
      critChance *= 8;
    }
    if (Math.random() < critChance) {
      baseDamage *= 2;
      crit = true;
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
    const typeMult = this.getTypeEffectiveness(defender, move);

    // Random factor
    const randFactor = Math.floor(Math.random() * 39) + 217;

    let damage = Math.floor(baseDamage * stab * typeMult * (randFactor / 255));
    if (typeMult === 0) {
      damage = 0;
    } else {
      damage = Math.max(1, damage);
    }

    // Reflect or Light Screen
    if (
      isPhysical &&
      defender.volatileStatus.includes("reflect") &&
      damage > 0
    ) {
      damage = Math.floor(damage / 2);
    }
    if (
      !isPhysical &&
      defender.volatileStatus.includes("lightscreen") &&
      damage > 0
    ) {
      damage = Math.floor(damage / 2);
    }

    return damage;
  }

  getTypeEffectiveness(defender: Pokemon, move: MoveClass): number {
    return calculateEffectiveness(defender.types, move.type);
  }

  applyEndOfTurn(): void {
    this.addToLog("--- End of turn effects ---");

    // handle burn/poison
    for (const mon of [this.active1, this.active2]) {
      if (mon.status === "burn" && !mon.isFainted()) {
        const dmg = Math.floor(mon.stats.hp / 8);
        mon.applyDamage(dmg);
        this.addToLog(`${Species[mon.species]} was hurt by its burn (${dmg} dmg)!`);
      }
      if (mon.status === "poison" && !mon.isFainted()) {
        const dmg = Math.floor(mon.stats.hp / 16);
        mon.applyDamage(dmg);
        this.addToLog(`${Species[mon.species]} was hurt by poison (${dmg} dmg)!`);
      }
      // leech seed
      if (mon.volatileStatus.includes("leechSeed") && !mon.isFainted()) {
        const other = mon === this.active1 ? this.active2 : this.active1;
        if (!other.isFainted()) {
          const dmg = Math.floor(mon.stats.hp / 16);
          mon.applyDamage(dmg);
          other.heal(dmg);
          this.addToLog(`${Species[mon.species]}'s health was sapped by Leech Seed!`);
        }
      }
    }

    // faint checks
    if (this.active1.isFainted()) {
      this.addToLog(`${Species[this.active1.species]} fainted!`);
    }
    if (this.active2.isFainted()) {
      this.addToLog(`${Species[this.active2.species]} fainted!`);
    }
  }

  isBattleOver(): boolean {
    const allFaint1 = this.team1.every(p => p.isFainted());
    const allFaint2 = this.team2.every(p => p.isFainted());
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

  getWinner(): string | null {
    if (this.team1.every(p => p.isFainted())) return "team2";
    if (this.team2.every(p => p.isFainted())) return "team1";
    return null;
  }

  executeSwitch(side: "team1" | "team2", newMon: Pokemon): void {
    if (side === "team1") {
      this.active1.volatileStatus = [];
      this.active1.resetStatStages();
      this.active1 = newMon;
      newMon.volatileStatus = [];
      newMon.resetStatStages();
    } else {
      this.active2.volatileStatus = [];
      this.active2.resetStatStages();
      this.active2 = newMon;
      newMon.volatileStatus = [];
      newMon.resetStatStages();
    }
  }
}