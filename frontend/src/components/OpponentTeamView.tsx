import React from "react";
import { Species } from "../../../data/species";

interface PokemonInfo {
  species: number;
  hp: number;
  maxHp: number;
  level: number;
  fainted: boolean;
  status: string | null;
}

interface OpponentTeamViewProps {
  team: PokemonInfo[];
  activeIndex: number;
}

const OpponentTeamView: React.FC<OpponentTeamViewProps> = ({
  team,
  activeIndex,
}) => {
  // Calculate HP percentage for each Pokémon
  const getHpPercent = (pokemon: PokemonInfo) => {
    return Math.floor((pokemon.hp / pokemon.maxHp) * 100);
  };

  // Determine HP bar color based on percentage
  const getBarColorClass = (hpPercent: number) => {
    return hpPercent > 50
      ? "bg-success"
      : hpPercent > 20
      ? "bg-warning-color"
      : "bg-danger-color";
  };

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {team.map((pokemon, i) => {
        // Skip the active Pokémon as it's shown separately
        if (i === activeIndex) {
          return null;
        }

        const hpPercent = getHpPercent(pokemon);
        const barColorClass = getBarColorClass(hpPercent);
        const speciesName =
          Species[pokemon.species] || `Unknown (#${pokemon.species})`;
        const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.species}.png`;

        return (
          <div key={i} className="flex flex-col items-center">
            <div className="relative">
              {/* Simple card with just the image and minimal info */}
              <div
                className={`bg-white rounded-lg p-1 border-2 border-dark-color ${
                  pokemon.fainted ? "opacity-60" : ""
                }`}
                style={{ width: "80px" }}
              >
                {/* Species number */}
                <div className="absolute top-0 left-0 bg-primary-color text-white text-[8px] px-1 rounded-br-md">
                  #{pokemon.species}
                </div>

                {/* Pokémon image */}
                <div className="flex justify-center">
                  <img
                    src={spriteUrl}
                    alt={speciesName}
                    className="w-12 h-12 pixelated"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>

                {/* HP bar - always visible but minimal */}
                <div className="health-bar-bg mt-1" style={{ height: "4px" }}>
                  <div
                    className={`${barColorClass} transition-all duration-500`}
                    style={{ width: `${hpPercent}%`, height: "100%" }}
                  />
                </div>
              </div>
            </div>

            {/* Status badge - minimal */}
            <div className="text-[8px] mt-1 text-center">
              <span className="bg-dark text-white py-0.5 px-1 rounded-full border border-dark-color shadow-sm">
                {pokemon.fainted ? "FAINTED" : "STANDBY"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OpponentTeamView;
