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
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 mb-6">
      {team.map((pokemon, i) => {
        // we can switch if:
        // - not the opponent
        // - a switch callback is present
        // - pokemon is not fainted
        // - i != activeIndex
        const canSwitch =
          !isOpponent && onSwitch && !pokemon.fainted && i !== activeIndex;
        const isActive = i === activeIndex;

        // Skip the active Pokemon as it's shown separately
        if (isActive) {
          return null;
        }

        return (
          <div key={i} className="flex flex-col items-center">
            <div className="relative w-full">
              <div className="relative z-10">
                <PokemonCard pokemon={pokemon} isActive={false} />
              </div>
            </div>

            {/* Status badge */}
            <div className="text-xs mt-1 mb-1 text-center">
              {pokemon.fainted ? (
                <span className="bg-danger-color text-white text-[9px] font-medium py-1 px-2 rounded-full border border-dark-color shadow-md animate-blink">
                  FAINTED
                </span>
              ) : !isOpponent ? (
                <span className="bg-success text-white text-[9px] font-medium py-1 px-2 rounded-full border border-dark-color shadow-md">
                  AVAILABLE
                </span>
              ) : (
                <span className="bg-dark text-white text-[9px] font-medium py-1 px-2 rounded-full border border-dark-color shadow-md">
                  STANDBY
                </span>
              )}
            </div>

            {canSwitch && (
              <button
                onClick={() => {
                  onSwitch(i);
                }}
                className="btn btn-secondary mt-1 w-full text-[9px] py-1 px-2 font-bold flex items-center justify-center"
              >
                <div className="pokeball w-3 h-3 mr-1"></div>
                SWITCH
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TeamView;
