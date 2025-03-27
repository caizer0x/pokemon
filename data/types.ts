/**
 * Representation of a Generation I type in Pokémon.
 */
export enum Type {
  Normal = 0,
  Fighting = 1,
  Flying = 2,
  Poison = 3,
  Ground = 4,
  Rock = 5,
  Bug = 6,
  Ghost = 7,
  Fire = 8,
  Water = 9,
  Grass = 10,
  Electric = 11,
  Psychic = 12,
  Ice = 13,
  Dragon = 14,
}

// Type effectiveness chart using direct multipliers:
// 0 = immune, 0.5 = not very effective, 1 = normal effectiveness, 2 = super effective
// TYPE_CHART[defender][attacker] gives the effectiveness of attacker against defender
export const TYPE_CHART: number[][] = [
  // Defender: Normal
  // Attacker: Normal, Fight, Flying, Poison, Ground, Rock, Bug, Ghost, Fire, Water, Grass, Electr, Psych, Ice, Dragon
  [1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],

  // Defender: Fighting
  // Attacker: Normal, Fight, Flying, Poison, Ground, Rock, Bug, Ghost, Fire, Water, Grass, Electr, Psych, Ice, Dragon
  [1, 1, 2, 1, 1, 0.5, 0.5, 0, 1, 1, 1, 1, 2, 1, 1],

  // Defender: Flying
  // Attacker: Normal, Fight, Flying, Poison, Ground, Rock, Bug, Ghost, Fire, Water, Grass, Electr, Psych, Ice, Dragon
  [1, 0.5, 1, 1, 0, 2, 0.5, 1, 1, 1, 0.5, 2, 1, 2, 1],

  // Defender: Poison
  // Attacker: Normal, Fight, Flying, Poison, Ground, Rock, Bug, Ghost, Fire, Water, Grass, Electr, Psych, Ice, Dragon
  [1, 0.5, 1, 0.5, 2, 0.5, 0.5, 0.5, 1, 1, 0.5, 1, 2, 1, 1],

  // Defender: Ground
  // Attacker: Normal, Fight, Flying, Poison, Ground, Rock, Bug, Ghost, Fire, Water, Grass, Electr, Psych, Ice, Dragon
  [1, 1, 1, 0.5, 1, 0.5, 0.5, 1, 1, 2, 2, 0, 1, 2, 1],

  // Defender: Rock
  // Attacker: Normal, Fight, Flying, Poison, Ground, Rock, Bug, Ghost, Fire, Water, Grass, Electr, Psych, Ice, Dragon
  [0.5, 2, 0.5, 0.5, 2, 1, 1, 1, 0.5, 2, 2, 1, 1, 1, 1],

  // Defender: Bug
  // Attacker: Normal, Fight, Flying, Poison, Ground, Rock, Bug, Ghost, Fire, Water, Grass, Electr, Psych, Ice, Dragon
  [1, 0.5, 2, 2, 0.5, 2, 1, 0.5, 2, 1, 0.5, 1, 1, 1, 1],

  // Defender: Ghost
  // Attacker: Normal, Fight, Flying, Poison, Ground, Rock, Bug, Ghost, Fire, Water, Grass, Electr, Psych, Ice, Dragon
  [0, 0, 1, 0.5, 1, 1, 0.5, 2, 1, 1, 1, 1, 0, 1, 1],

  // Defender: Fire
  // Attacker: Normal, Fight, Flying, Poison, Ground, Rock, Bug, Ghost, Fire, Water, Grass, Electr, Psych, Ice, Dragon
  [1, 1, 1, 1, 2, 2, 0.5, 1, 0.5, 2, 0.5, 1, 1, 0.5, 0.5],

  // Defender: Water
  // Attacker: Normal, Fight, Flying, Poison, Ground, Rock, Bug, Ghost, Fire, Water, Grass, Electr, Psych, Ice, Dragon
  [1, 1, 1, 1, 1, 1, 1, 1, 0.5, 0.5, 2, 2, 1, 0.5, 0.5],

  // Defender: Grass
  // Attacker: Normal, Fight, Flying, Poison, Ground, Rock, Bug, Ghost, Fire, Water, Grass, Electr, Psych, Ice, Dragon
  [1, 1, 2, 2, 0.5, 1, 2, 1, 2, 0.5, 0.5, 0.5, 1, 2, 0.5],

  // Defender: Electric
  // Attacker: Normal, Fight, Flying, Poison, Ground, Rock, Bug, Ghost, Fire, Water, Grass, Electr, Psych, Ice, Dragon
  [1, 1, 0.5, 1, 2, 1, 1, 1, 1, 1, 1, 0.5, 1, 1, 0.5],

  // Defender: Psychic
  // Attacker: Normal, Fight, Flying, Poison, Ground, Rock, Bug, Ghost, Fire, Water, Grass, Electr, Psych, Ice, Dragon
  [1, 0.5, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 0.5, 1, 1],

  // Defender: Ice
  // Attacker: Normal, Fight, Flying, Poison, Ground, Rock, Bug, Ghost, Fire, Water, Grass, Electr, Psych, Ice, Dragon
  [1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 0.5, 1],

  // Defender: Dragon
  // Attacker: Normal, Fight, Flying, Poison, Ground, Rock, Bug, Ghost, Fire, Water, Grass, Electr, Psych, Ice, Dragon
  [1, 1, 1, 1, 1, 1, 1, 1, 0.5, 0.5, 0.5, 0.5, 1, 2, 2],
];

// Constants and utility functions
export const size = 15; // The number of types in this generation

/**
 * Whether or not this type is considered to be special as opposed to physical.
 */
export function special(type: Type): boolean {
  return type >= Type.Fire;
}

/**
 * Get the effectiveness multiplier of an attacking type against a defending type.
 * @param defendingType The type of the defending Pokémon
 * @param attackingType The type of the attacking move
 * @returns The effectiveness multiplier (0, 0.5, 1, or 2)
 */
export function getEffectiveness(
  defendingType: Type,
  attackingType: Type
): number {
  return TYPE_CHART[defendingType][attackingType];
}

/**
 * Calculate the overall effectiveness of an attack against a Pokémon with potentially two types.
 * @param defenderTypes The types of the defending Pokémon
 * @param attackingType The type of the attacking move
 * @returns The overall effectiveness multiplier
 */
export function calculateEffectiveness(
  defenderTypes: Types,
  attackingType: Type
): number {
  const type1Effectiveness = getEffectiveness(
    defenderTypes.type1,
    attackingType
  );

  // If the Pokémon has the same type twice, just return the effectiveness against that type
  if (defenderTypes.type1 === defenderTypes.type2) {
    return type1Effectiveness;
  }

  const type2Effectiveness = getEffectiveness(
    defenderTypes.type2,
    attackingType
  );

  // Multiply the effectiveness values together
  return type1Effectiveness * type2Effectiveness;
}

/**
 * Representation of a Pokémon's typing.
 */
export interface Types {
  /** A Pokémon's primary type. */
  type1: Type;
  /** A Pokémon's secondary type (may be identical to its primary type). */
  type2: Type;
}

/**
 * Create a new Types object with default values.
 */
export function createTypes(
  type1: Type = Type.Normal,
  type2: Type = Type.Normal
): Types {
  return { type1, type2 };
}

/**
 * Whether this typing is immune to type t.
 */
export function immune(types: Types, t: Type): boolean {
  return calculateEffectiveness(types, t) === 0;
}

/**
 * Whether this typing includes type t.
 */
export function includes(types: Types, t: Type): boolean {
  return types.type1 === t || types.type2 === t;
}
