import React from "react";
import PokemonCard from "./PokemonCard";
import { Species } from "../../../data/species"; // for mapping ID to name

interface MoveInfo {
  name: string;
  power: number;
  accuracy: number;
  type: number;
}

interface PokemonInfo {
  species: number;
  hp: number;
  maxHp: number;
  level: number;
  fainted: boolean;
  status: string | null;
  moves?: MoveInfo[];
}

interface TeamViewProps {
  team: PokemonInfo[];
  activeIndex: number;
  onSwitch?: (index: number) => void; // only used by player's team
  isOpponent: boolean;
}

const TeamView: React.FC<TeamViewProps> = ({
  team,
  activeIndex,
  onSwitch,
  isOpponent,
}) => {
  // Debug info
  console.log("TeamView props:", {
    team,
    activeIndex,
    isOpponent,
    hasOnSwitch: !!onSwitch,
  });

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {team.map((pokemon, i) => {
        // we can switch if:
        // - not the opponent
        // - a switch callback is present
        // - pokemon is not fainted
        // - i != activeIndex
        const canSwitch =
          !isOpponent && onSwitch && !pokemon.fainted && i !== activeIndex;
        const isActive = i === activeIndex;

        // Debug info for each Pokémon
        console.log(`Pokémon ${i}:`, {
          species: Species[pokemon.species],
          canSwitch,
          isActive,
          fainted: pokemon.fainted,
        });

        return (
          <div
            key={i}
            className={`flex flex-col items-center ${
              isActive ? "ring-2 ring-secondary rounded-lg p-1" : ""
            }`}
          >
            <PokemonCard pokemon={pokemon} />

            {/* Always show the status of this Pokémon for debugging */}
            <div className="text-xs mt-1 mb-1 text-center">
              {isActive ? (
                <span className="bg-secondary text-xs font-medium py-1 px-2 rounded-full">
                  Active
                </span>
              ) : pokemon.fainted ? (
                <span className="bg-danger text-white text-xs font-medium py-1 px-2 rounded-full">
                  Fainted
                </span>
              ) : !isOpponent ? (
                <span className="bg-success text-white text-xs font-medium py-1 px-2 rounded-full">
                  Available
                </span>
              ) : null}
            </div>

            {canSwitch && (
              <button
                onClick={() => {
                  console.log(`Switch button clicked for Pokémon ${i}`);
                  onSwitch(i);
                }}
                className="btn btn-secondary mt-2 w-full text-sm py-2 px-3 font-bold"
              >
                Switch to {Species[pokemon.species]}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TeamView;
