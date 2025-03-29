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
  shake?: boolean; // triggers the "shake" animation
  statChange?: "up" | "down" | null; // triggers a stat arrow
  fadeSwitch?: boolean; // triggers fade-in/out on switching
  isActive?: boolean; // indicates if this is an active Pokemon
}

const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  shake = false,
  statChange = null,
  fadeSwitch = false,
  isActive = false,
}) => {
  const hpPercent = Math.floor((pokemon.hp / pokemon.maxHp) * 100);
  const barColorClass =
    hpPercent > 50
      ? "bg-success"
      : hpPercent > 20
      ? "bg-warning-color"
      : "bg-danger-color";

  const speciesName =
    Species[pokemon.species] || `Unknown (#${pokemon.species})`;

  // For retro effect we can do a standard RBY style sprite
  // Use both front and back sprites based on whether it's a player or opponent Pokemon
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.species}.png`;

  // Classes for container
  const containerClasses = [
    "card",
    "relative", // for stat arrow overlay
    "border-4",
    isActive ? "border-secondary-color" : "border-dark-color",
    "bg-pokedex-screen",
    pokemon.fainted ? "opacity-60" : "",
    shake ? "animate-shake" : "",
    fadeSwitch ? "fade-switch" : "",
  ].join(" ");

  return (
    <div
      className={containerClasses}
      style={{
        width: isActive ? "220px" : "160px",
        margin: "0 auto",
        transform: isActive ? "scale(1)" : "scale(0.85)",
      }}
    >
      {/* Pokemon ID display like a Pokedex */}
      <div className="absolute top-2 left-2 bg-primary-color text-white text-xs px-2 py-1 rounded-md">
        #{pokemon.species}
      </div>

      <div className="flex justify-center items-center mb-2 pt-2">
        <h3 className="text-sm font-semibold text-dark-color text-center mt-4">
          {speciesName.toUpperCase()}{" "}
          <span className="text-primary-color">Lv.{pokemon.level}</span>
        </h3>
      </div>

      <div className="flex flex-col items-center mb-3 bg-white rounded-lg p-2 mx-2 border-2 border-dark-color">
        <img
          src={spriteUrl}
          alt={speciesName}
          className="w-24 h-24 pixelated transition-opacity"
          style={{ imageRendering: "pixelated" }}
        />
      </div>

      <div className="px-3 pb-3">
        <div className="flex justify-between text-xs mb-1 font-bold">
          <span className="text-dark-color">
            HP: {pokemon.hp}/{pokemon.maxHp}
          </span>
          <span
            className={
              hpPercent < 30
                ? "text-danger-color animate-blink"
                : "text-dark-color"
            }
          >
            {hpPercent}%
          </span>
        </div>
        <div className="health-bar-bg">
          <div
            className={`${barColorClass} transition-all duration-500`}
            style={{ width: `${hpPercent}%`, height: "100%" }}
          />
        </div>
        <div className="flex justify-between items-center mt-3">
          <div className="text-xs font-bold text-dark-color">STATUS:</div>
          <div
            className={`text-xs px-2 py-1 rounded-md ${
              pokemon.status
                ? "bg-warning-color text-dark-color font-bold animate-blink"
                : "bg-success text-white"
            }`}
          >
            {pokemon.status ? pokemon.status.toUpperCase() : "NORMAL"}
          </div>
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

      {/* Decorative Pokedex elements */}
      <div className="absolute bottom-2 right-2 flex space-x-1">
        <div className="w-2 h-2 bg-primary-color rounded-full"></div>
        <div className="w-2 h-2 bg-secondary-color rounded-full"></div>
      </div>
    </div>
  );
};

export default PokemonCard;
