import React from "react";
import { Species } from "../../../data/species";

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

/**
 * Additional ephemeral animation triggers we might apply.
 */
interface PokemonCardProps {
  pokemon: PokemonInfo;
  shake?: boolean;          // triggers the "shake" animation
  statChange?: "up" | "down" | null;  // triggers a stat arrow
  fadeSwitch?: boolean;     // triggers fade-in/out on switching
}

const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  shake = false,
  statChange = null,
  fadeSwitch = false,
}) => {
  const hpPercent = Math.floor((pokemon.hp / pokemon.maxHp) * 100);
  const barColorClass =
    hpPercent > 50
      ? "bg-success"
      : hpPercent > 20
      ? "bg-warning"
      : "bg-danger";

  const speciesName = Species[pokemon.species] || `Unknown (#${pokemon.species})`;
  // for retro effect we can do a standard RBY style sprite
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.species}.png`;

  // Classes for container
  const containerClasses = [
    "card",
    "relative", // for stat arrow overlay
    pokemon.fainted ? "opacity-60" : "",
    shake ? "animate-shake" : "",
    fadeSwitch ? "fade-switch" : ""
  ].join(" ");

  return (
    <div className={containerClasses} style={{ width: "200px", margin: "0 auto" }}>
      <div className="flex justify-between items-center mb-2 px-2 pt-2">
        <h3 className="text-sm font-semibold text-primary">
          {speciesName} Lv.{pokemon.level}
        </h3>
      </div>

      <div className="flex flex-col items-center mb-3">
        <img
          src={spriteUrl}
          alt={speciesName}
          className="w-20 h-20 pixelated transition-opacity"
          style={{ imageRendering: "pixelated" }}
        />
      </div>

      <div className="px-2 pb-2">
        <div className="flex justify-between text-xs mb-1">
          <span>
            HP: {pokemon.hp}/{pokemon.maxHp}
          </span>
          <span>{hpPercent}%</span>
        </div>
        <div className="health-bar-bg w-full h-2 bg-gray-300 rounded-full overflow-hidden">
          <div
            className={barColorClass}
            style={{ width: `${hpPercent}%`, height: "100%" }}
          />
        </div>
        <div className="text-xs mt-2">
          Status:{" "}
          <span
            className={pokemon.status ? "text-warning font-medium" : "text-gray-500"}
          >
            {pokemon.status || "None"}
          </span>
        </div>
      </div>

      {/* If there's a stat change, display an arrow overlay */}
      {statChange === "up" && (
        <div className="absolute top-0 right-0 p-2">
          <div className="stat-arrow-up">↑</div>
        </div>
      )}
      {statChange === "down" && (
        <div className="absolute top-0 right-0 p-2">
          <div className="stat-arrow-down">↓</div>
        </div>
      )}
    </div>
  );
};

export default PokemonCard;