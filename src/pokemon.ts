// src/pokemon.ts
import { BaseStats, IVs, EVs, Stat, Status, VolatileStatus } from "./types";
import { Move } from "./move";
import { Species, get as getSpeciesData } from "../data/species";
import { Type, Types } from "../data/types";

export class Pokemon {
  species: Species;
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
  types: Types;

  constructor(
    species: Species,
    ivs: IVs,
    evs: EVs,
    moves: Move[],
    level: number = 100
  ) {
    this.species = species;

    // Get species data from the data file
    const speciesData = getSpeciesData(species);

    this.baseStats = speciesData.stats;
    this.types = speciesData.types;
    this.ivs = ivs;
    this.evs = evs;
    this.moves = moves;
    this.level = level;
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

    // Apply stat stage modifiers
    let multiplier =
      this.statStages[stat] >= 0
        ? (2 + this.statStages[stat]) / 2
        : 2 / (2 - this.statStages[stat]);

    // Clamp multiplier between 0.25 and 4
    multiplier = Math.max(0.25, Math.min(4, multiplier));

    let effective = this.stats[stat] * multiplier;

    // Apply status effects
    if (stat === "spe" && this.status === "paralysis") effective *= 0.25; // Gen 1 uses 0.25
    if (stat === "atk" && this.status === "burn") effective *= 0.5; // Burn halves attack

    return Math.floor(effective);
  }

  applyDamage(damage: number): void {
    this.currentHp = Math.max(0, this.currentHp - damage);
  }

  heal(amount: number): void {
    this.currentHp = Math.min(this.stats.hp, this.currentHp + amount);
  }

  setStatus(status: Status): void {
    // Can't set a status if already has one
    if (!this.status) this.status = status;
  }

  cureStatus(): void {
    this.status = null;
  }

  addVolatileStatus(status: VolatileStatus): void {
    if (!this.volatileStatus.includes(status)) this.volatileStatus.push(status);
  }

  removeVolatileStatus(status: VolatileStatus): void {
    this.volatileStatus = this.volatileStatus.filter((s) => s !== status);
  }

  modifyStat(stat: Stat, stages: number): void {
    if (stat === "hp") return; // HP can't be modified by stages

    // Clamp stat stages between -6 and +6
    this.statStages[stat] = Math.max(
      -6,
      Math.min(6, this.statStages[stat] + stages)
    );
  }

  resetStatStages(): void {
    for (const stat of ["atk", "def", "spc", "spe"] as Stat[]) {
      this.statStages[stat] = 0;
    }
  }

  isFainted(): boolean {
    return this.currentHp <= 0;
  }
}
