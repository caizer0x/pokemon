// Adapted from Pokémon Showdown's random team generator
import { Species } from "../species";
import { Move as MoveEnum } from "../moves";
import { Pokemon } from "../../src/pokemon";
import { Move } from "../../src/move";

// Load the data from data.json
const randomData: any = require("./data.json");

// Define interfaces for our team generator
interface StatsTable {
  hp: number;
  atk: number;
  def: number;
  spc: number;
  spe: number;
}

interface RandomSet {
  name: string;
  species: Species;
  moves: MoveEnum[];
  level: number;
  ivs: {
    hp: number;
    atk: number;
    def: number;
    spc: number;
    spe: number;
  };
  evs: {
    hp: number;
    atk: number;
    def: number;
    spc: number;
    spe: number;
  };
}

export class RandomTeamGenerator {
  private prng: {
    seed: number[];
    next(limit?: number): number;
    sample<T>(items: T[]): T;
    shuffle<T>(items: T[]): T[];
  };

  constructor(seed?: number[]) {
    // Simple PRNG implementation
    this.prng = {
      seed: seed || [
        Math.floor(Math.random() * 0x10000),
        Math.floor(Math.random() * 0x10000),
        Math.floor(Math.random() * 0x10000),
        Math.floor(Math.random() * 0x10000),
      ],
      next(limit?: number) {
        const s0 = this.seed[0];
        const s1 = this.seed[1];
        const s2 = this.seed[2];
        const s3 = this.seed[3];

        // Xorshift algorithm
        let t = s0 ^ (s0 << 11);
        this.seed[0] = s1;
        this.seed[1] = s2;
        this.seed[2] = s3;
        this.seed[3] = s3 ^ (s3 >>> 19) ^ (t ^ (t >>> 8));

        const result = this.seed[3] >>> 0;
        return limit ? result % limit : result / 0x100000000;
      },
      sample<T>(items: T[]): T {
        return items[Math.floor(this.next(items.length))];
      },
      shuffle<T>(items: T[]): T[] {
        const result = [...items];
        for (let i = result.length - 1; i > 0; i--) {
          const j = Math.floor(this.next(i + 1));
          [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
      },
    };
  }

  /**
   * Generate a random team of 6 Pokémon
   */
  public getRandomTeam(teamSize: number = 6): Pokemon[] {
    const team: Pokemon[] = [];
    const speciesPool = Object.keys(randomData);

    // Shuffle the species pool
    const shuffledSpecies = this.prng.shuffle(speciesPool);

    // Select random species for the team
    for (let i = 0; i < teamSize && i < shuffledSpecies.length; i++) {
      const speciesId = shuffledSpecies[i];
      const speciesData = randomData[speciesId];

      // Get the species enum value
      const speciesEnum = (Species as any)[
        this.capitalizeFirstLetter(speciesId)
      ];

      if (!speciesEnum) continue; // Skip if species not found in our enum

      // Get level from data or default to 50
      const level = speciesData.level || 50;

      // Generate random IVs (0-15 in Gen 1)
      const ivs = {
        hp: Math.floor(this.prng.next(16)),
        atk: Math.floor(this.prng.next(16)),
        def: Math.floor(this.prng.next(16)),
        spc: Math.floor(this.prng.next(16)),
        spe: Math.floor(this.prng.next(16)),
      };

      // Calculate HP IV based on other IVs (Gen 1 mechanic)
      ivs.hp =
        (ivs.atk & 1) * 8 +
        (ivs.def & 1) * 4 +
        (ivs.spe & 1) * 2 +
        (ivs.spc & 1);

      // Max EVs in Gen 1
      const evs = {
        hp: 255,
        atk: 255,
        def: 255,
        spc: 255,
        spe: 255,
      };

      // Get moves from data
      let movePool: string[] = [];

      // Add essential moves first
      if (speciesData.essentialMoves) {
        movePool = [...speciesData.essentialMoves];
      }

      // Add regular moves
      if (speciesData.moves) {
        movePool = [...movePool, ...speciesData.moves];
      }

      // Add exclusive moves if available
      if (speciesData.exclusiveMoves) {
        // Add one random exclusive move
        movePool.push(this.prng.sample(speciesData.exclusiveMoves));
      }

      // Shuffle the move pool
      movePool = this.prng.shuffle(movePool);

      // Select up to 4 moves
      const selectedMoves: MoveEnum[] = [];
      for (let j = 0; j < Math.min(4, movePool.length); j++) {
        const moveName = movePool[j];
        // Convert move name to enum value
        const moveEnum = this.getMoveEnum(moveName);
        if (moveEnum !== undefined) {
          selectedMoves.push(moveEnum);
        }
      }

      // If no valid moves were found, add a default move (Tackle)
      if (selectedMoves.length === 0) {
        if (MoveEnum.Tackle) {
          selectedMoves.push(MoveEnum.Tackle);
        } else if (MoveEnum.Struggle) {
          selectedMoves.push(MoveEnum.Struggle);
        }
      }

      // Ensure each Pokémon has 4 moves by adding common moves
      // Define a list of common moves to fill in empty slots
      const commonMoves = [
        MoveEnum.Tackle,
        MoveEnum.Growl,
        MoveEnum.TailWhip,
        MoveEnum.Scratch,
        MoveEnum.QuickAttack,
        MoveEnum.Pound,
        MoveEnum.Leer,
      ].filter((move) => move !== undefined);

      // Fill remaining slots with common moves
      while (selectedMoves.length < 4 && commonMoves.length > 0) {
        // Get a random common move
        const randomIndex = Math.floor(this.prng.next(commonMoves.length));
        const commonMove = commonMoves[randomIndex];

        // Only add if not already in the selected moves
        if (!selectedMoves.includes(commonMove)) {
          selectedMoves.push(commonMove);
        }

        // Remove this move from the pool to avoid trying it again
        commonMoves.splice(randomIndex, 1);
      }

      // Create Move objects
      const moveObjects = selectedMoves.map((moveEnum) => new Move(moveEnum));

      // Create the Pokémon
      const pokemon = new Pokemon(speciesEnum, ivs, evs, moveObjects, level);

      team.push(pokemon);
    }

    return team;
  }

  /**
   * Helper method to convert move name to MoveEnum
   */
  private getMoveEnum(moveName: string): MoveEnum | undefined {
    // Convert move name to enum format (e.g., "bodyslam" -> "BodySlam")
    const formattedName = this.capitalizeFirstLetter(moveName);

    // Return the enum value if it exists
    return (MoveEnum as any)[formattedName];
  }

  /**
   * Helper method to capitalize the first letter of each word
   */
  private capitalizeFirstLetter(str: string): string {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }
}

// Export a default instance
export default new RandomTeamGenerator();
