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
