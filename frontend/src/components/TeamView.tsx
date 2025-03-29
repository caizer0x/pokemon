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
  // This component is now only used for the player's team
  // The opponent's team uses OpponentTeamView
  if (isOpponent) {
    console.warn(
      "TeamView should not be used for opponent's team. Use OpponentTeamView instead."
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-6">
      {team.map((pokemon, i) => {
        // we can switch if:
        // - a switch callback is present
        // - pokemon is not fainted
        // - i != activeIndex
        const canSwitch = onSwitch && !pokemon.fainted && i !== activeIndex;
        const isActive = i === activeIndex;

        // Skip the active Pokemon as it's shown separately
        if (isActive) {
          return null;
        }

        return (
          <div
            key={i}
            className={`flex flex-col items-center ${
              canSwitch
                ? "cursor-pointer hover:scale-105 transition-transform"
                : ""
            }`}
            onClick={() => {
              if (canSwitch && onSwitch) {
                onSwitch(i);
              }
            }}
          >
            <div className="relative w-full">
              <div className="relative z-10">
                <PokemonCard pokemon={pokemon} isActive={false} />
              </div>
            </div>

            {/* Status badge - smaller and more compact */}
            <div className="text-xs mt-1 text-center">
              {pokemon.fainted ? (
                <span className="bg-danger-color text-white text-[8px] font-medium py-0.5 px-1.5 rounded-full border border-dark-color shadow-sm animate-blink">
                  FAINTED
                </span>
              ) : (
                <span className="bg-success text-white text-[8px] font-medium py-0.5 px-1.5 rounded-full border border-dark-color shadow-sm">
                  AVAILABLE
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TeamView;
