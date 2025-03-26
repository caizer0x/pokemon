// src/index.ts
import { Pokemon } from "./pokemon";
import { Move } from "./move";
import { Battle } from "./battle";
import { Action } from "./action";
import { Species } from "../data/species";
import { Move as MoveEnum } from "../data/moves";
import { Type } from "../data/types";

// Create some sample Pokémon
function createPikachu(): Pokemon {
  // Create moves for Pikachu
  const thunderbolt = new Move(MoveEnum.Thunderbolt);
  const quickAttack = new Move(MoveEnum.QuickAttack);
  const thunder = new Move(MoveEnum.Thunder);
  const surf = new Move(MoveEnum.Surf); // Yes, Pikachu can learn Surf in Gen 1 via special events

  // Create Pikachu with max IVs and EVs
  return new Pokemon(
    Species.Pikachu,
    { hp: 15, atk: 15, def: 15, spc: 15, spe: 15 }, // IVs (15 is max in Gen 1)
    { hp: 255, atk: 255, def: 255, spc: 255, spe: 255 }, // EVs (255 is max in Gen 1)
    [thunderbolt, quickAttack, thunder, surf],
    100 // Level 50
  );
}

function createCharizard(): Pokemon {
  // Create moves for Charizard
  const flamethrower = new Move(MoveEnum.Flamethrower);
  const fireBlast = new Move(MoveEnum.FireBlast);
  const earthquake = new Move(MoveEnum.Earthquake);
  const fly = new Move(MoveEnum.Fly);

  // Create Charizard with max IVs and EVs
  return new Pokemon(
    Species.Charizard,
    { hp: 15, atk: 15, def: 15, spc: 15, spe: 15 }, // IVs
    { hp: 255, atk: 255, def: 255, spc: 255, spe: 255 }, // EVs
    [flamethrower, fireBlast, earthquake, fly],
    55 // Level 55
  );
}

function createBlastoise(): Pokemon {
  // Create moves for Blastoise
  const surf = new Move(MoveEnum.Surf);
  const hydroPump = new Move(MoveEnum.HydroPump);
  const iceBeam = new Move(MoveEnum.IceBeam);
  const bodySlam = new Move(MoveEnum.BodySlam);

  // Create Blastoise with max IVs and EVs
  return new Pokemon(
    Species.Blastoise,
    { hp: 15, atk: 15, def: 15, spc: 15, spe: 15 }, // IVs
    { hp: 255, atk: 255, def: 255, spc: 255, spe: 255 }, // EVs
    [surf, hydroPump, iceBeam, bodySlam],
    100 // Level 52
  );
}

function createVenusaur(): Pokemon {
  // Create moves for Venusaur
  const razorLeaf = new Move(MoveEnum.RazorLeaf);
  const sleepPowder = new Move(MoveEnum.SleepPowder);
  const bodySlam = new Move(MoveEnum.BodySlam);
  const swordsDance = new Move(MoveEnum.SwordsDance);

  // Create Venusaur with max IVs and EVs
  return new Pokemon(
    Species.Venusaur,
    { hp: 15, atk: 15, def: 15, spc: 15, spe: 15 }, // IVs
    { hp: 255, atk: 255, def: 255, spc: 255, spe: 255 }, // EVs
    [razorLeaf, sleepPowder, bodySlam, swordsDance],
    51 // Level 51
  );
}

// Create a sample battle
function runSampleBattle() {
  // Create two teams
  const team1 = [createPikachu(), createBlastoise()];
  const team2 = [createCharizard(), createVenusaur()];

  // Create a battle
  const battle = new Battle(team1, team2);

  console.log("Battle started!");
  console.log(
    `Team 1: ${Species[team1[0].species]} and ${Species[team1[1].species]}`
  );
  console.log(
    `Team 2: ${Species[team2[0].species]} and ${Species[team2[1].species]}`
  );
  console.log("\n");

  // Run a few turns
  for (let i = 0; i < 5; i++) {
    if (battle.isBattleOver()) break;

    console.log(`Turn ${battle.turnCount + 1}`);
    console.log(
      `${Species[battle.active1.species]} (HP: ${battle.active1.currentHp}/${
        battle.active1.stats.hp
      }) vs ${Species[battle.active2.species]} (HP: ${
        battle.active2.currentHp
      }/${battle.active2.stats.hp})`
    );

    // For simplicity, always use the first move
    const action1: Action = { type: "move", move: battle.active1.moves[0] };
    const action2: Action = { type: "move", move: battle.active2.moves[0] };

    // Execute the turn
    battle.turn(action1, action2);

    console.log(
      `${Species[battle.active1.species]} used ${battle.active1.moves[0].name}!`
    );
    console.log(
      `${Species[battle.active2.species]} used ${battle.active2.moves[0].name}!`
    );
    console.log(
      `${Species[battle.active1.species]} HP: ${battle.active1.currentHp}/${
        battle.active1.stats.hp
      }`
    );
    console.log(
      `${Species[battle.active2.species]} HP: ${battle.active2.currentHp}/${
        battle.active2.stats.hp
      }`
    );
    console.log("\n");

    // If a Pokémon faints, break the loop and end the simulation
    if (battle.active1.isFainted() || battle.active2.isFainted()) {
      if (battle.active1.isFainted()) {
        console.log(`${Species[battle.active1.species]} fainted!`);

        // Find the next available Pokémon
        const nextPokemon = team1.find(
          (p) => !p.isFainted() && p !== battle.active1
        );

        if (nextPokemon) {
          console.log(`Switching to ${Species[nextPokemon.species]}!`);
          // Manually update the active Pokémon
          battle.active1 = nextPokemon;
        } else {
          console.log("No more Pokémon available for Team 1!");
          break;
        }
      }

      if (battle.active2.isFainted()) {
        console.log(`${Species[battle.active2.species]} fainted!`);

        // Find the next available Pokémon
        const nextPokemon = team2.find(
          (p) => !p.isFainted() && p !== battle.active2
        );

        if (nextPokemon) {
          console.log(`Switching to ${Species[nextPokemon.species]}!`);
          // Manually update the active Pokémon
          battle.active2 = nextPokemon;
        } else {
          console.log("No more Pokémon available for Team 2!");
          break;
        }
      }
    }
  }

  // Check if the battle is over
  if (battle.isBattleOver()) {
    const winner = battle.getWinner();
    console.log(
      `Battle over! ${winner === "team1" ? "Team 1" : "Team 2"} wins!`
    );
  } else {
    console.log("Battle simulation ended after 5 turns.");
  }
}

// Run the sample battle
runSampleBattle();
