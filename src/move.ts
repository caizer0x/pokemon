import { MoveData, Status } from "./types";
import { Type, special } from "../data/types";
import {
  Effect,
  Move as MoveEnum,
  get,
  pp,
  isMulti,
} from "../data/moves";
import { Pokemon } from "./pokemon";

/**
 * Enhanced Move class that can handle extra side-effects
 * like recoil, explosion, self-heal, etc.
 */
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
    const moveData = get(moveId);

    this.name = MoveEnum[moveId]; // Convert enum ID to string
    this.power = moveData.bp;
    this.accuracy = moveData.accuracy;
    this.type = moveData.type;
    this.effect = moveData.effect;

    // In Gen 1, Fire/Water/Grass/Electric/Ice/Psychic/Dragon are special
    this.category = special(moveData.type) ? "special" : "physical";
  }

  /**
   * Apply side-effects after damage is dealt.
   * @param attacker  The Pokémon that used this move
   * @param defender  The Pokémon on the receiving end
   * @param damageDealt The amount of damage inflicted
   * @returns Optional message for the battle log
   */
  applyEffect(
    attacker: Pokemon,
    defender: Pokemon,
    damageDealt: number
  ): string | null {
    // If there's no effect or effect is 0, we do nothing
    if (!this.effect) {
      return null;
    }

    switch (this.effect) {
      // (A) Status-inflicting logic
      case Effect.Poison:
        if (!defender.status) {
          defender.setStatus("poison");
          return `${defender.species} was poisoned!`;
        }
        return null;

      case Effect.BurnChance1:
      case Effect.BurnChance2:
        if (!defender.status && Math.random() < 0.3) {
          defender.setStatus("burn");
          return `${defender.species} was burned!`;
        }
        return null;

      case Effect.ParalyzeChance1:
      case Effect.ParalyzeChance2:
        if (!defender.status && Math.random() < 0.3) {
          defender.setStatus("paralysis");
          return `${defender.species} was paralyzed!`;
        }
        return null;

      case Effect.Sleep:
        if (!defender.status) {
          defender.setStatus("sleep");
          return `${defender.species} fell asleep!`;
        }
        return null;

      case Effect.FreezeChance:
        if (!defender.status && Math.random() < 0.1) {
          defender.setStatus("freeze");
          return `${defender.species} was frozen solid!`;
        }
        return null;

      case Effect.Confusion:
        defender.addVolatileStatus("confusion");
        return `${defender.species} became confused!`;

      case Effect.LeechSeed:
        if (!defender.volatileStatus.includes("leechSeed")) {
          defender.addVolatileStatus("leechSeed");
          return `${defender.species} was seeded!`;
        }
        return null;

      // (B) Stat changes
      case Effect.AttackDown1:
        defender.modifyStat("atk", -1);
        return `${defender.species}'s Attack fell!`;

      case Effect.DefenseDown1:
        defender.modifyStat("def", -1);
        return `${defender.species}'s Defense fell!`;

      case Effect.SpeedDown1:
        defender.modifyStat("spe", -1);
        return `${defender.species}'s Speed fell!`;

      case Effect.AttackUp1:
        attacker.modifyStat("atk", 1);
        return `${attacker.species}'s Attack rose!`;

      case Effect.DefenseUp1:
        attacker.modifyStat("def", 1);
        return `${attacker.species}'s Defense rose!`;

      case Effect.SpecialUp1:
        attacker.modifyStat("spc", 1);
        return `${attacker.species}'s Special rose!`;

      // (C) Recoil moves
      case Effect.Recoil:
        if (damageDealt > 0) {
          const recoilDamage = Math.floor(damageDealt / 4);
          attacker.applyDamage(recoilDamage);
          return `${attacker.species} is hit by recoil! (${recoilDamage} dmg)`;
        }
        return null;

      // (D) Explosive moves
      case Effect.Explode:
        attacker.currentHp = 0;
        return `${attacker.species} explodes and faints!`;

      // (E) Healing moves (Recover, SoftBoiled, Rest)
      case Effect.Heal:
        if (this.moveId === MoveEnum.Rest) {
          attacker.heal(attacker.stats.hp);
          attacker.setStatus("sleep");
          return `${attacker.species} used Rest and is now fully healed (and asleep)!`;
        } else {
          const halfHp = Math.floor(attacker.stats.hp / 2);
          const actual = Math.min(attacker.stats.hp - attacker.currentHp, halfHp);
          if (actual <= 0) {
            return `${attacker.species} tried to heal, but is already at full HP!`;
          }
          attacker.heal(halfHp);
          return `${attacker.species} regained health! (~50%)`;
        }

      // (F) Dream Eater
      case Effect.DreamEater:
        if (defender.status === "sleep") {
          const healAmount = Math.floor(damageDealt / 2);
          attacker.heal(healAmount);
          return `${attacker.species} ate ${defender.species}'s dreams and restored HP by ${healAmount}!`;
        }
        return `But it failed... ${defender.species} is not sleeping.`;

      default:
        return null;
    }
  }

  getPP(): number {
    return pp(this.moveId);
  }

  hasHighCritical(): boolean {
    return this.effect === Effect.HighCritical;
  }

  isMultiHit(): boolean {
    return isMulti(this.effect);
  }

  getHitCount(): number {
    if (!this.isMultiHit()) return 1;
    if (this.effect === Effect.DoubleHit) return 2;

    // For multi-hit: 2-5 times
    const rand = Math.random();
    if (rand < 0.375) return 2;
    if (rand < 0.75) return 3;
    if (rand < 0.875) return 4;
    return 5;
  }
}