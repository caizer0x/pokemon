// src/index.ts
import { Pokemon } from "./pokemon";
import { Move } from "./move";
import { Battle } from "./battle";
import { Action } from "./action";
import { Species } from "../data/species";
import { Move as MoveEnum } from "../data/moves";
import { Type } from "../data/types";
import randomTeamGenerator from "../data/sets/teams";

// Create a battle with random teams
function runRandomBattle() {
  // Generate two random teams of 6 Pokémon each
  const team1 = randomTeamGenerator.getRandomTeam(6);
  const team2 = randomTeamGenerator.getRandomTeam(6);

  // Create a battle
  const battle = new Battle(team1, team2);

  console.log("Random Battle started!");
  console.log("Team 1:");
  team1.forEach((pokemon) => {
    console.log(
      `- ${Species[pokemon.species]} (Lv. ${
        pokemon.level
      }) with moves: ${pokemon.moves.map((m) => m.name).join(", ")}`
    );
  });

  console.log("\nTeam 2:");
  team2.forEach((pokemon) => {
    console.log(
      `- ${Species[pokemon.species]} (Lv. ${
        pokemon.level
      }) with moves: ${pokemon.moves.map((m) => m.name).join(", ")}`
    );
  });
  console.log("\n");

  // Run the battle simulation for a maximum of 50 turns
  const MAX_TURNS = 50;
  for (let i = 0; i < MAX_TURNS; i++) {
    if (battle.isBattleOver()) break;

    console.log(`Turn ${battle.turnCount + 1}`);
    console.log(
      `${Species[battle.active1.species]} (HP: ${battle.active1.currentHp}/${
        battle.active1.stats.hp
      }) vs ${Species[battle.active2.species]} (HP: ${
        battle.active2.currentHp
      }/${battle.active2.stats.hp})`
    );

    // For simplicity, always use a random move if available
    // If no moves are available, use a null move (skip turn)
    let action1: Action;
    let action2: Action;

    if (battle.active1.moves.length > 0) {
      const moveIndex1 = Math.floor(
        Math.random() * battle.active1.moves.length
      );
      action1 = {
        type: "move",
        move: battle.active1.moves[moveIndex1],
      };
      console.log(
        `${Species[battle.active1.species]} used ${
          battle.active1.moves[moveIndex1].name
        }!`
      );
    } else {
      action1 = { type: "move", move: null };
      console.log(
        `${Species[battle.active1.species]} has no moves and skipped its turn!`
      );
    }

    if (battle.active2.moves.length > 0) {
      const moveIndex2 = Math.floor(
        Math.random() * battle.active2.moves.length
      );
      action2 = {
        type: "move",
        move: battle.active2.moves[moveIndex2],
      };
      console.log(
        `${Species[battle.active2.species]} used ${
          battle.active2.moves[moveIndex2].name
        }!`
      );
    } else {
      action2 = { type: "move", move: null };
      console.log(
        `${Species[battle.active2.species]} has no moves and skipped its turn!`
      );
    }

    // Execute the turn
    battle.turn(action1, action2);
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

    // If a Pokémon faints, switch to the next available one
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
    console.log(`Battle simulation ended after ${MAX_TURNS} turns.`);
  }
}

// Run the random battle
runRandomBattle();
