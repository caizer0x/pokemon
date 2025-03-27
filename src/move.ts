import { Move as MoveEnum, Effect, get, pp, isMulti } from "../data/moves";
import { Pokemon } from "./pokemon";
import { Type, special } from "../data/types";
import { Species } from "../data/species";

/**
 * Enhanced Move class to handle side-effects, including partial trapping, flinch, OHKO, etc.
 */
export class Move {
  name: string;
  power: number;
  accuracy: number; // as a percent
  type: Type;
  category: "physical" | "special";
  effect: Effect;
  moveId: MoveEnum;

  constructor(moveId: MoveEnum) {
    this.moveId = moveId;
    const data = get(moveId);

    this.name = MoveEnum[moveId];
    this.power = data.bp;
    this.accuracy = data.accuracy;
    this.type = data.type;
    this.effect = data.effect;

    // Gen1: Fire/Water/Electric/Grass/Ice/Psychic/Dragon => special
    this.category = special(this.type) ? "special" : "physical";
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
    if (this.effect === Effect.DoubleHit) return 2;
    if (this.effect === Effect.Twineedle) return 2;
    if (this.effect === Effect.MultiHit) {
      // 2-5 times
      const rand = Math.random();
      if (rand < 0.375) return 2;
      if (rand < 0.75) return 3;
      if (rand < 0.875) return 4;
      return 5;
    }
    return 1;
  }

  /**
   * Apply side-effects after damage is inflicted. We return a message for the battle log or null.
   */
  applyEffect(attacker: Pokemon, defender: Pokemon, damageDealt: number): string | null {
    switch (this.effect) {
      // No effect
      case Effect.None:
        return null;

      // Guaranteed confusion
      case Effect.Confusion:
        if (!defender.volatileStatus.includes("confusion")) {
          defender.addVolatileStatus("confusion");
          return `${Species[defender.species]} became confused!`;
        }
        return null;

      case Effect.ConfusionChance:
        // 10% chance to confuse
        if (!defender.volatileStatus.includes("confusion") && Math.random() < 0.1) {
          defender.addVolatileStatus("confusion");
          return `${Species[defender.species]} became confused!`;
        }
        return null;

      // Guaranteed Sleep
      case Effect.Sleep:
        if (!defender.status) {
          defender.setStatus("sleep");
          return `${Species[defender.species]} fell asleep!`;
        }
        return null;

      // OHKO
      case Effect.OHKO:
        // Gen1 formula involves comparing speeds if accuracy check passes, but let's keep it simple
        // If it hits, target faints
        // We'll do an external accuracy check. If we reached here, we consider it "hit".
        defender.currentHp = 0;
        return `${Species[defender.species]} was instantly KO'd!`;

      // Poison
      case Effect.Poison:
        if (!defender.status) {
          defender.setStatus("poison");
          return `${Species[defender.species]} was poisoned!`;
        }
        return null;

      // PoisonChance1 => 20% chance
      case Effect.PoisonChance1:
        if (!defender.status && Math.random() < 0.2) {
          defender.setStatus("poison");
          return `${Species[defender.species]} was poisoned!`;
        }
        return null;

      // PoisonChance2 => 30% chance
      case Effect.PoisonChance2:
        if (!defender.status && Math.random() < 0.3) {
          defender.setStatus("poison");
          return `${Species[defender.species]} was poisoned!`;
        }
        return null;

      // Burn
      case Effect.BurnChance1: // 10%
        if (!defender.status && Math.random() < 0.1) {
          defender.setStatus("burn");
          return `${Species[defender.species]} was burned!`;
        }
        return null;

      case Effect.BurnChance2: // 30%
        if (!defender.status && Math.random() < 0.3) {
          defender.setStatus("burn");
          return `${Species[defender.species]} was burned!`;
        }
        return null;

      // Freeze => 10% if triggered, or guaranteed freeze doesn't exist in Gen1 (it’s always chance-based)
      case Effect.FreezeChance:
        if (!defender.status && Math.random() < 0.1) {
          defender.setStatus("freeze");
          return `${Species[defender.species]} was frozen solid!`;
        }
        return null;

      // Paralyze
      case Effect.Paralyze:
        if (!defender.status) {
          defender.setStatus("paralysis");
          return `${Species[defender.species]} was paralyzed!`;
        }
        return null;

      // 10% chance to paralyze
      case Effect.ParalyzeChance1:
        if (!defender.status && Math.random() < 0.1) {
          defender.setStatus("paralysis");
          return `${Species[defender.species]} was paralyzed!`;
        }
        return null;

      // 30% chance to paralyze
      case Effect.ParalyzeChance2:
        if (!defender.status && Math.random() < 0.3) {
          defender.setStatus("paralysis");
          return `${Species[defender.species]} was paralyzed!`;
        }
        return null;

      // Flinch chance
      case Effect.FlinchChance1: // 10%
        if (Math.random() < 0.1) {
          defender.addVolatileStatus("flinch");
          return `${Species[defender.species]} flinched!`;
        }
        return null;

      case Effect.FlinchChance2: // 30%
        if (Math.random() < 0.3) {
          defender.addVolatileStatus("flinch");
          return `${Species[defender.species]} flinched!`;
        }
        return null;

      // Stats up/down
      case Effect.AttackUp1:
        attacker.modifyStat("atk", 1);
        return `${Species[attacker.species]}'s Attack rose!`;

      case Effect.AttackUp2:
        attacker.modifyStat("atk", 2);
        return `${Species[attacker.species]}'s Attack sharply rose!`;

      case Effect.DefenseUp1:
        attacker.modifyStat("def", 1);
        return `${Species[attacker.species]}'s Defense rose!`;

      case Effect.DefenseUp2:
        attacker.modifyStat("def", 2);
        return `${Species[attacker.species]}'s Defense sharply rose!`;

      case Effect.SpeedUp2:
        attacker.modifyStat("spe", 2);
        return `${Species[attacker.species]}'s Speed sharply rose!`;

      case Effect.SpecialUp1:
        attacker.modifyStat("spc", 1);
        return `${Species[attacker.species]}'s Special rose!`;

      case Effect.SpecialUp2:
        attacker.modifyStat("spc", 2);
        return `${Species[attacker.species]}'s Special sharply rose!`;

      case Effect.EvasionUp1:
        // In Gen1 there's no direct "evasion" stat, but let's store it in statStages['spe'] or custom. We'll skip detailed or we could store 'evasion'
        // We'll store it as a "spe" or do nothing for brevity:
        // For correctness, you might track a separate "evasionStage" but let's do a placeholder:
        return `${Species[attacker.species]}'s Evasion rose (not fully implemented)!`;

      case Effect.AttackDown1:
        defender.modifyStat("atk", -1);
        return `${Species[defender.species]}'s Attack fell!`;

      case Effect.DefenseDown1:
        defender.modifyStat("def", -1);
        return `${Species[defender.species]}'s Defense fell!`;

      case Effect.DefenseDown2:
        defender.modifyStat("def", -2);
        return `${Species[defender.species]}'s Defense sharply fell!`;

      case Effect.SpeedDown1:
        defender.modifyStat("spe", -1);
        return `${Species[defender.species]}'s Speed fell!`;

      // chance-based stat lowers
      case Effect.AttackDownChance:
        // typically 33% chance to lower Attack by 1
        if (Math.random() < 0.33) {
          defender.modifyStat("atk", -1);
          return `${Species[defender.species]}'s Attack fell!`;
        }
        return null;

      case Effect.DefenseDownChance:
        // typically 10% or 33% chance depending on the move. We'll approximate 10% for Acid, 33% for others.
        // But let's do 0.1 for Acid, 0.33 for AuroraBeam = AttackDownChance.
        // We'll generalize to 0.1 for Acid, 0.33 for AuroraBeam. We can't easily differentiate which move is in effect. We'll guess 0.1 for ID=51, else 0.33
        if (this.moveId === MoveEnum.Acid) {
          if (Math.random() < 0.1) {
            defender.modifyStat("def", -1);
            return `${Species[defender.species]}'s Defense fell!`;
          }
        } else {
          // Aurora Beam => Attack down
          if (Math.random() < 0.33) {
            // For Aurora Beam we said AttackDownChance
            if (this.moveId === MoveEnum.AuroraBeam) {
              defender.modifyStat("atk", -1);
              return `${Species[defender.species]}'s Attack fell!`;
            } else {
              // default
              defender.modifyStat("def", -1);
              return `${Species[defender.species]}'s Defense fell!`;
            }
          }
        }
        return null;

      case Effect.SpeedDownChance:
        // typically 33% chance
        if (Math.random() < 0.33) {
          defender.modifyStat("spe", -1);
          return `${Species[defender.species]}'s Speed fell!`;
        }
        return null;

      case Effect.SpecialDownChance:
        // typically 33% chance to drop special by 1
        if (Math.random() < 0.33) {
          defender.modifyStat("spc", -1);
          return `${Species[defender.species]}'s Special fell!`;
        }
        return null;

      // Recoil
      case Effect.Recoil:
        if (damageDealt > 0) {
          const recoilDamage = Math.floor(damageDealt / 4);
          attacker.applyDamage(recoilDamage);
          return `${Species[attacker.species]} is hurt by recoil! (${recoilDamage} dmg)`;
        }
        return null;

      // Self-destruct / Explosion
      case Effect.Explode:
        // user faints. Very large damage is handled externally
        attacker.currentHp = 0;
        return `${Species[attacker.species]} explodes! It fainted!`;

      // Heal => either 50% or if it's Rest, then 100% + Sleep
      case Effect.Heal:
        // If move is "Rest" specifically:
        if (this.moveId === MoveEnum.Rest) {
          attacker.heal(attacker.stats.hp); // full restore
          attacker.setStatus("sleep"); // put user to sleep
          return `${Species[attacker.species]} used Rest and fell asleep, fully restoring its HP!`;
        }
        // else Softboiled / Recover => ~50% heal
        const halfHP = Math.floor(attacker.stats.hp / 2);
        const preHP = attacker.currentHp;
        attacker.heal(halfHP);
        const healed = attacker.currentHp - preHP;
        return `${Species[attacker.species]} regained about ${healed} HP!`;

      case Effect.DreamEater:
        // Only works if target is asleep
        if (defender.status === "sleep") {
          const healAmount = Math.floor(damageDealt / 2);
          attacker.heal(healAmount);
          return `${Species[attacker.species]} drained the target's dreams and restored ${healAmount} HP!`;
        }
        return `But it failed... The target is not sleeping.`;

      // Binding => partial trap handled in battle.ts
      case Effect.Binding:
        // We'll set isBound on defender in battle.ts if the move hits
        return null;

      // Charge => two-turn moves (handled mostly in battle.ts)
      case Effect.Charge:
        return null;

      // SpecialDamage => e.g. Seismic Toss, NightShade, Dragon Rage, etc.
      case Effect.SpecialDamage:
        // We'll do partial logic in battle.ts or we do direct?
        // Already handled in calculateDamage with special check
        return null;

      // SuperFang => half current HP
      case Effect.SuperFang:
        // half the target's current HP
        return null;

      // Swift => never misses (handled in accuracy check in battle.ts if we want)
      case Effect.Swift:
        return null;

      // Thrashing => 2-3 turns + confusion (battle.ts manages)
      case Effect.Thrashing:
        return null;

      case Effect.JumpKick:
        // Recoil on miss is handled in battle.ts if it misses
        return null;

      case Effect.Rage:
        // Gen1: locks user in, Attack up if user is hit
        return null;

      case Effect.FocusEnergy:
        // In RBY, there's a bug that lowers the crit rate. We'll do correct version or replicate bug. We'll do a placeholder:
        return `Focus Energy used (buggy in RBY).`;

      case Effect.HyperBeam:
        // We handle the recharge next turn in battle.ts
        return null;

      case Effect.Bide:
        return null;

      case Effect.Metronome:
        return `Metronome used (random move to be chosen).`;

      case Effect.MirrorMove:
        return `Mirror Move used (will copy the foe's last move).`;

      case Effect.Mimic:
        return `Mimic used (copies an opponent's move).`;

      case Effect.Substitute:
        return `Substitute created (25% of HP).`;

      case Effect.SwitchAndTeleport:
        return null;

      case Effect.LeechSeed:
        // handled in end-of-turn logic
        return null;

      case Effect.Mist:
        return `Mist used (prevents stat drops).`;

      case Effect.Haze:
        return `Haze used (resets all stat changes).`;

      case Effect.Reflect:
        return `Reflect set (halves physical damage).`;

      case Effect.LightScreen:
        return `Light Screen set (halves special damage).`;

      case Effect.Transform:
        return `User transformed into the target (copy moves/stats).`;

      case Effect.Conversion:
        return `User changed its type to the target's type.`;

      case Effect.Disable:
        return `Disable used (one target move is disabled).`;

      case Effect.Splash:
        return `But nothing happened...`;

      default:
        return null;
    }
  }
}