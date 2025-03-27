import {
  Type,
  getEffectiveness,
  calculateEffectiveness,
  createTypes,
} from "../data/types";

// Helper function to run a test and log the result
function testTypeEffectiveness(
  attackingType: Type,
  defendingType: Type,
  expectedMultiplier: number,
  description: string
): boolean {
  const actualMultiplier = getEffectiveness(defendingType, attackingType);
  const passed = actualMultiplier === expectedMultiplier;

  console.log(
    `${passed ? "✅" : "❌"} ${description}: ${Type[attackingType]} vs ${
      Type[defendingType]
    } = ${actualMultiplier} (expected ${expectedMultiplier})`
  );

  return passed;
}

// Helper function to run a test for dual types
function testDualTypeEffectiveness(
  attackingType: Type,
  defendingType1: Type,
  defendingType2: Type,
  expectedMultiplier: number,
  description: string
): boolean {
  const defenderTypes = createTypes(defendingType1, defendingType2);
  const actualMultiplier = calculateEffectiveness(defenderTypes, attackingType);
  const passed = actualMultiplier === expectedMultiplier;

  console.log(
    `${passed ? "✅" : "❌"} ${description}: ${Type[attackingType]} vs ${
      Type[defendingType1]
    }/${
      Type[defendingType2]
    } = ${actualMultiplier} (expected ${expectedMultiplier})`
  );

  return passed;
}

// Run tests for single-type matchups
console.log("\n=== TESTING SINGLE-TYPE MATCHUPS ===\n");

// Normal type effectiveness
testTypeEffectiveness(
  Type.Normal,
  Type.Rock,
  0.5,
  "Normal is not very effective against Rock"
);
testTypeEffectiveness(
  Type.Normal,
  Type.Ghost,
  0,
  "Normal has no effect on Ghost"
);
testTypeEffectiveness(
  Type.Normal,
  Type.Normal,
  1,
  "Normal is neutral against Normal"
);

// Fighting type effectiveness
testTypeEffectiveness(
  Type.Fighting,
  Type.Normal,
  2,
  "Fighting is super effective against Normal"
);
testTypeEffectiveness(
  Type.Fighting,
  Type.Rock,
  2,
  "Fighting is super effective against Rock"
);
testTypeEffectiveness(
  Type.Fighting,
  Type.Flying,
  0.5,
  "Fighting is not very effective against Flying"
);
testTypeEffectiveness(
  Type.Fighting,
  Type.Ghost,
  0,
  "Fighting has no effect on Ghost"
);

// Flying type effectiveness
testTypeEffectiveness(
  Type.Flying,
  Type.Fighting,
  2,
  "Flying is super effective against Fighting"
);
testTypeEffectiveness(
  Type.Flying,
  Type.Bug,
  2,
  "Flying is super effective against Bug"
);
testTypeEffectiveness(
  Type.Flying,
  Type.Rock,
  0.5,
  "Flying is not very effective against Rock"
);

// Poison type effectiveness
testTypeEffectiveness(
  Type.Poison,
  Type.Grass,
  2,
  "Poison is super effective against Grass"
);
testTypeEffectiveness(
  Type.Poison,
  Type.Poison,
  0.5,
  "Poison is not very effective against Poison"
);
testTypeEffectiveness(
  Type.Poison,
  Type.Ground,
  0.5,
  "Poison is not very effective against Ground"
);

// Ground type effectiveness
testTypeEffectiveness(
  Type.Ground,
  Type.Poison,
  2,
  "Ground is super effective against Poison"
);
testTypeEffectiveness(
  Type.Ground,
  Type.Electric,
  2,
  "Ground is super effective against Electric"
);
testTypeEffectiveness(
  Type.Ground,
  Type.Flying,
  0,
  "Ground has no effect on Flying"
);

// Rock type effectiveness
testTypeEffectiveness(
  Type.Rock,
  Type.Flying,
  2,
  "Rock is super effective against Flying"
);
testTypeEffectiveness(
  Type.Rock,
  Type.Bug,
  2,
  "Rock is super effective against Bug"
);
testTypeEffectiveness(
  Type.Rock,
  Type.Fire,
  2,
  "Rock is super effective against Fire"
);
testTypeEffectiveness(
  Type.Rock,
  Type.Fighting,
  0.5,
  "Rock is not very effective against Fighting"
);

// Bug type effectiveness
testTypeEffectiveness(
  Type.Bug,
  Type.Grass,
  2,
  "Bug is super effective against Grass"
);
testTypeEffectiveness(
  Type.Bug,
  Type.Poison,
  0.5,
  "Bug is not very effective against Poison"
);
testTypeEffectiveness(
  Type.Bug,
  Type.Fire,
  0.5,
  "Bug is not very effective against Fire"
);

// Ghost type effectiveness
testTypeEffectiveness(
  Type.Ghost,
  Type.Ghost,
  2,
  "Ghost is super effective against Ghost"
);
testTypeEffectiveness(
  Type.Ghost,
  Type.Psychic,
  2,
  "Ghost is super effective against Psychic"
);
testTypeEffectiveness(
  Type.Ghost,
  Type.Normal,
  0,
  "Ghost has no effect on Normal"
);

// Fire type effectiveness
testTypeEffectiveness(
  Type.Fire,
  Type.Grass,
  2,
  "Fire is super effective against Grass"
);
testTypeEffectiveness(
  Type.Fire,
  Type.Bug,
  2,
  "Fire is super effective against Bug"
);
testTypeEffectiveness(
  Type.Fire,
  Type.Ice,
  2,
  "Fire is super effective against Ice"
);
testTypeEffectiveness(
  Type.Fire,
  Type.Water,
  0.5,
  "Fire is not very effective against Water"
);
testTypeEffectiveness(
  Type.Fire,
  Type.Rock,
  0.5,
  "Fire is not very effective against Rock"
);

// Water type effectiveness
testTypeEffectiveness(
  Type.Water,
  Type.Fire,
  2,
  "Water is super effective against Fire"
);
testTypeEffectiveness(
  Type.Water,
  Type.Ground,
  2,
  "Water is super effective against Ground"
);
testTypeEffectiveness(
  Type.Water,
  Type.Rock,
  2,
  "Water is super effective against Rock"
);
testTypeEffectiveness(
  Type.Water,
  Type.Water,
  0.5,
  "Water is not very effective against Water"
);
testTypeEffectiveness(
  Type.Water,
  Type.Grass,
  0.5,
  "Water is not very effective against Grass"
);

// Grass type effectiveness
testTypeEffectiveness(
  Type.Grass,
  Type.Water,
  2,
  "Grass is super effective against Water"
);
testTypeEffectiveness(
  Type.Grass,
  Type.Ground,
  2,
  "Grass is super effective against Ground"
);
testTypeEffectiveness(
  Type.Grass,
  Type.Rock,
  2,
  "Grass is super effective against Rock"
);
testTypeEffectiveness(
  Type.Grass,
  Type.Fire,
  0.5,
  "Grass is not very effective against Fire"
);
testTypeEffectiveness(
  Type.Grass,
  Type.Poison,
  0.5,
  "Grass is not very effective against Poison"
);
testTypeEffectiveness(
  Type.Grass,
  Type.Flying,
  0.5,
  "Grass is not very effective against Flying"
);
testTypeEffectiveness(
  Type.Grass,
  Type.Bug,
  0.5,
  "Grass is not very effective against Bug"
);
testTypeEffectiveness(
  Type.Grass,
  Type.Dragon,
  0.5,
  "Grass is not very effective against Dragon"
);

// Electric type effectiveness
testTypeEffectiveness(
  Type.Electric,
  Type.Water,
  2,
  "Electric is super effective against Water"
);
testTypeEffectiveness(
  Type.Electric,
  Type.Flying,
  2,
  "Electric is super effective against Flying"
);
testTypeEffectiveness(
  Type.Electric,
  Type.Ground,
  0,
  "Electric has no effect on Ground"
);
testTypeEffectiveness(
  Type.Electric,
  Type.Electric,
  0.5,
  "Electric is not very effective against Electric"
);
testTypeEffectiveness(
  Type.Electric,
  Type.Dragon,
  0.5,
  "Electric is not very effective against Dragon"
);

// Psychic type effectiveness
testTypeEffectiveness(
  Type.Psychic,
  Type.Fighting,
  2,
  "Psychic is super effective against Fighting"
);
testTypeEffectiveness(
  Type.Psychic,
  Type.Poison,
  2,
  "Psychic is super effective against Poison"
);
testTypeEffectiveness(
  Type.Psychic,
  Type.Psychic,
  0.5,
  "Psychic is not very effective against Psychic"
);

// Ice type effectiveness
testTypeEffectiveness(
  Type.Ice,
  Type.Grass,
  2,
  "Ice is super effective against Grass"
);
testTypeEffectiveness(
  Type.Ice,
  Type.Ground,
  2,
  "Ice is super effective against Ground"
);
testTypeEffectiveness(
  Type.Ice,
  Type.Flying,
  2,
  "Ice is super effective against Flying"
);
testTypeEffectiveness(
  Type.Ice,
  Type.Dragon,
  2,
  "Ice is super effective against Dragon"
);
testTypeEffectiveness(
  Type.Ice,
  Type.Water,
  0.5,
  "Ice is not very effective against Water"
);
testTypeEffectiveness(
  Type.Ice,
  Type.Fire,
  0.5,
  "Ice is not very effective against Fire"
);
testTypeEffectiveness(
  Type.Ice,
  Type.Ice,
  0.5,
  "Ice is not very effective against Ice"
);

// Dragon type effectiveness
testTypeEffectiveness(
  Type.Dragon,
  Type.Dragon,
  2,
  "Dragon is super effective against Dragon"
);
testTypeEffectiveness(
  Type.Dragon,
  Type.Fire,
  0.5,
  "Dragon is not very effective against Fire"
);
testTypeEffectiveness(
  Type.Dragon,
  Type.Water,
  0.5,
  "Dragon is not very effective against Water"
);
testTypeEffectiveness(
  Type.Dragon,
  Type.Grass,
  0.5,
  "Dragon is not very effective against Grass"
);
testTypeEffectiveness(
  Type.Dragon,
  Type.Electric,
  0.5,
  "Dragon is not very effective against Electric"
);

// Run tests for dual-type matchups
console.log("\n=== TESTING DUAL-TYPE MATCHUPS ===\n");

// Test cases for common dual types
testDualTypeEffectiveness(
  Type.Water,
  Type.Fire,
  Type.Flying,
  2,
  "Water vs Fire/Flying"
);
testDualTypeEffectiveness(
  Type.Electric,
  Type.Water,
  Type.Flying,
  4,
  "Electric vs Water/Flying"
);
testDualTypeEffectiveness(
  Type.Rock,
  Type.Fire,
  Type.Flying,
  4,
  "Rock vs Fire/Flying"
);
testDualTypeEffectiveness(
  Type.Water,
  Type.Fire,
  Type.Rock,
  4,
  "Water vs Fire/Rock"
);
testDualTypeEffectiveness(
  Type.Ground,
  Type.Fire,
  Type.Rock,
  4,
  "Ground vs Fire/Rock"
);
testDualTypeEffectiveness(
  Type.Fighting,
  Type.Ice,
  Type.Psychic,
  1,
  "Fighting vs Ice/Psychic"
);
testDualTypeEffectiveness(
  Type.Bug,
  Type.Grass,
  Type.Poison,
  1,
  "Bug vs Grass/Poison"
);
testDualTypeEffectiveness(
  Type.Fire,
  Type.Grass,
  Type.Poison,
  2,
  "Fire vs Grass/Poison"
);
testDualTypeEffectiveness(
  Type.Psychic,
  Type.Grass,
  Type.Poison,
  2,
  "Psychic vs Grass/Poison"
);
testDualTypeEffectiveness(
  Type.Ice,
  Type.Grass,
  Type.Poison,
  2,
  "Ice vs Grass/Poison"
);
testDualTypeEffectiveness(
  Type.Flying,
  Type.Grass,
  Type.Poison,
  2,
  "Flying vs Grass/Poison"
);
testDualTypeEffectiveness(
  Type.Fire,
  Type.Bug,
  Type.Grass,
  4,
  "Fire vs Bug/Grass"
);
testDualTypeEffectiveness(
  Type.Rock,
  Type.Bug,
  Type.Flying,
  4,
  "Rock vs Bug/Flying"
);
testDualTypeEffectiveness(
  Type.Electric,
  Type.Water,
  Type.Ground,
  0,
  "Electric vs Water/Ground"
);
testDualTypeEffectiveness(
  Type.Grass,
  Type.Water,
  Type.Ground,
  4,
  "Grass vs Water/Ground"
);
testDualTypeEffectiveness(
  Type.Ice,
  Type.Dragon,
  Type.Flying,
  4,
  "Ice vs Dragon/Flying"
);
testDualTypeEffectiveness(
  Type.Ice,
  Type.Ground,
  Type.Rock,
  2,
  "Ice vs Ground/Rock"
);
testDualTypeEffectiveness(
  Type.Water,
  Type.Ground,
  Type.Rock,
  4,
  "Water vs Ground/Rock"
);
testDualTypeEffectiveness(
  Type.Fighting,
  Type.Normal,
  Type.Flying,
  1,
  "Fighting vs Normal/Flying"
);
testDualTypeEffectiveness(
  Type.Ghost,
  Type.Normal,
  Type.Flying,
  0,
  "Ghost vs Normal/Flying"
);
testDualTypeEffectiveness(
  Type.Electric,
  Type.Flying,
  Type.Ground,
  0,
  "Electric vs Flying/Ground"
);
