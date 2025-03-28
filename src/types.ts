export type Stat = "hp" | "atk" | "def" | "spc" | "spe";
export type Status =
  | "burn"
  | "poison"
  | "paralysis"
  | "sleep"
  | "freeze"
  | null;

/**
 * In Gen 1, "volatile" conditions vanish when switching or if Haze is used.
 * We add "reflect" and "lightscreen" as volatile effects (though in official Gen 1, they're "side" conditions).
 * This ensures the code compiles and runs as intended.
 */
export type VolatileStatus =
  | "substitute"
  | "confusion"
  | "leechSeed"
  | "wrap"
  | "reflect"
  | "lightscreen"
  | "flinch"  /* <-- Added flinch here */
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

/**
 * An Action can be either using a move or switching to another Pokémon.
 */
export type Action =
  | { type: "move"; move: any | null }
  | { type: "switch"; pokemon: any };