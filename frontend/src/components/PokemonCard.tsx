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
  const barColor = hpPercent > 50 ? "green" : hpPercent > 20 ? "yellow" : "red";
  const faintText = pokemon.fainted ? " (Fainted)" : "";

  // get species name from data/species
  const speciesName = Species[pokemon.species] || `Unknown (#${pokemon.species})`;
  // use species numeric for sprite
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.species}.png`;

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "1rem",
        borderRadius: "8px",
        width: "200px",
        marginBottom: "1rem",
      }}
    >
      <h3>
        {speciesName} (Lv.{pokemon.level})
        {faintText}
      </h3>
      <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
        <img
          src={spriteUrl}
          alt={speciesName}
          style={{ imageRendering: "pixelated", width: "96px", height: "96px" }}
        />
      </div>
      <p>Status: {pokemon.status || "None"}</p>
      <div style={{ background: "#eee", width: "100%", height: "10px", marginTop: "0.5rem" }}>
        <div
          style={{
            background: barColor,
            width: hpPercent + "%",
            height: "100%",
          }}
        />
      </div>
      <p>
        HP: {pokemon.hp}/{pokemon.maxHp}
      </p>
    </div>
  );
};

export default PokemonCard;