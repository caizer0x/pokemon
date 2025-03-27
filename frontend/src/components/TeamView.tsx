import React from "react";
import PokemonCard from "./PokemonCard";

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
  isOpponent
}) => {
  return (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
      {team.map((pokemon, i) => {
        // we can switch if:
        // - not the opponent
        // - a switch callback is present
        // - pokemon is not fainted
        // - i != activeIndex
        const canSwitch = !isOpponent && onSwitch && !pokemon.fainted && i !== activeIndex;
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <PokemonCard pokemon={pokemon} />
            {canSwitch && (
              <button onClick={() => onSwitch(i)}>Switch</button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TeamView;