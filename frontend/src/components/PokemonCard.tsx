import React from "react";
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

interface PokemonCardProps {
  pokemon: PokemonInfo;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  const hpPercent = Math.floor((pokemon.hp / pokemon.maxHp) * 100);
  const barColorClass =
    hpPercent > 50
      ? "health-bar-fill-high"
      : hpPercent > 20
      ? "health-bar-fill-medium"
      : "health-bar-fill-low";

  // get species name from data/species
  const speciesName =
    Species[pokemon.species] || `Unknown (#${pokemon.species})`;
  // use species numeric for sprite
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.species}.png`;

  return (
    <div className={`card ${pokemon.fainted ? "opacity-60" : ""}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-primary">
          {speciesName}{" "}
          <span className="text-sm font-normal">Lv.{pokemon.level}</span>
          {pokemon.fainted && (
            <span className="text-danger ml-1">(Fainted)</span>
          )}
        </h3>
      </div>

      <div className="flex flex-col items-center mb-3">
        <img
          src={spriteUrl}
          alt={speciesName}
          className="w-24 h-24 object-contain pixelated"
          style={{ imageRendering: "pixelated" }}
        />
      </div>

      <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
          <span>
            Status:{" "}
            <span
              className={
                pokemon.status ? "text-warning font-medium" : "text-gray-500"
              }
            >
              {pokemon.status || "None"}
            </span>
          </span>
        </div>

        <div className="flex justify-between text-sm mb-1">
          <span>
            HP: {pokemon.hp}/{pokemon.maxHp}
          </span>
          <span>{hpPercent}%</span>
        </div>

        <div className="health-bar-bg">
          <div className={barColorClass} style={{ width: `${hpPercent}%` }} />
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
