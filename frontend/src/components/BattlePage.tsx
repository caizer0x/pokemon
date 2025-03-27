import React from "react";
import TeamView from "./TeamView";
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

interface BattleState {
  type: string;
  isOver: boolean;
  winner: string | null;
  team1: PokemonInfo[];
  team2: PokemonInfo[];
  active1: PokemonInfo;
  active2: PokemonInfo;
  active1Index: number;
  active2Index: number;
  turnCount: number;
}

interface BattlePageProps {
  battleState: BattleState | null;
  onSendMessage: (msg: any) => void;
}

const BattlePage: React.FC<BattlePageProps> = ({ battleState, onSendMessage }) => {
  if (!battleState) {
    return <p>Connecting to server...</p>;
  }

  const {
    team1,
    team2,
    active1,
    active2,
    active1Index,
    active2Index,
    isOver,
    winner,
    turnCount
  } = battleState;

  const handleMove = (moveIndex: number) => {
    if (isOver) return;
    onSendMessage({ action: "move", moveIndex });
  };

  const handleSwitch = (pokemonIndex: number) => {
    if (isOver) return;
    onSendMessage({ action: "switch", pokemonIndex });
  };

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <p>Turn: {turnCount}</p>
        {isOver ? (
          winner === "team1" ? (
            <p>You won!</p>
          ) : winner === "team2" ? (
            <p>AI won!</p>
          ) : (
            <p>Battle over! No winner set.</p>
          )
        ) : (
          <p>Battle in progress...</p>
        )}
      </div>

      <h2>Your Team:</h2>
      <TeamView
        team={team1}
        activeIndex={active1Index}
        onSwitch={handleSwitch}
        isOpponent={false}
      />

      <h2>Opponent's Team:</h2>
      <TeamView
        team={team2}
        activeIndex={active2Index}
        isOpponent={true}
      />

      <div style={{ marginTop: "2rem" }}>
        <h3>Your Active Pokémon:</h3>
        <PokemonCard pokemon={active1} />
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
          {(active1.moves || []).map((move, i) => (
            <button
              key={i}
              onClick={() => handleMove(i)}
              disabled={isOver || active1.fainted}
            >
              {move.name} (Pwr:{move.power}, Acc:{move.accuracy})
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h3>Opponent's Active Pokémon:</h3>
        <PokemonCard pokemon={active2} />
      </div>
    </div>
  );
};

export default BattlePage;