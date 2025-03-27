import React from "react";
import TeamView from "./TeamView";
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

const BattlePage: React.FC<BattlePageProps> = ({
  battleState,
  onSendMessage,
}) => {
  if (!battleState) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Connecting to server...</p>
        </div>
      </div>
    );
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
    turnCount,
  } = battleState;

  const handleMove = (moveIndex: number) => {
    if (isOver) return;
    console.log("Sending move action:", { action: "move", moveIndex });
    onSendMessage({ action: "move", moveIndex });
  };

  const handleSwitch = (pokemonIndex: number) => {
    if (isOver) return;
    console.log("Sending switch action:", { action: "switch", pokemonIndex });
    onSendMessage({ action: "switch", pokemonIndex });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="text-lg">
            <span className="font-medium">Turn:</span> {turnCount}
          </div>
          <div className="text-lg">
            {isOver ? (
              winner === "team1" ? (
                <span className="text-success font-bold">You won!</span>
              ) : winner === "team2" ? (
                <span className="text-danger font-bold">AI won!</span>
              ) : (
                <span className="text-warning">
                  Battle over! No winner set.
                </span>
              )
            ) : (
              <span className="text-primary">Battle in progress...</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold text-primary mb-3 border-b border-gray-200 pb-2">
            Your Team
          </h2>
          <TeamView
            team={team1}
            activeIndex={active1Index}
            onSwitch={handleSwitch}
            isOpponent={false}
          />
        </div>

        <div>
          <h2 className="text-xl font-bold text-dark mb-3 border-b border-gray-200 pb-2">
            Opponent's Team
          </h2>
          <TeamView team={team2} activeIndex={active2Index} isOpponent={true} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-bold text-primary mb-3 border-b border-gray-200 pb-2">
            Your Active Pokémon: {Species[active1.species]}
          </h3>
          <div className="flex justify-center mb-4">
            <PokemonCard pokemon={active1} />
          </div>

          {active1.fainted ? (
            <div className="text-center p-4 bg-red-100 rounded-lg text-danger font-medium">
              This Pokémon has fainted! Please switch to another Pokémon.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 mt-4">
              {(active1.moves || []).map((move, i) => (
                <button
                  key={i}
                  onClick={() => handleMove(i)}
                  disabled={isOver || active1.fainted}
                  className={`btn ${
                    isOver || active1.fainted
                      ? "bg-gray-300 cursor-not-allowed"
                      : "btn-primary"
                  }`}
                >
                  <div className="font-medium">{move.name}</div>
                  <div className="text-xs mt-1">
                    Power: {move.power} | Accuracy: {move.accuracy}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-bold text-dark mb-3 border-b border-gray-200 pb-2">
            Opponent's Active Pokémon: {Species[active2.species]}
          </h3>
          <div className="flex justify-center">
            <PokemonCard pokemon={active2} />
          </div>
        </div>
      </div>

      {/* Debug section */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-bold mb-2">Debug Info</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium">Your Team:</h4>
            <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-40">
              {JSON.stringify(
                team1.map((p, i) => ({
                  index: i,
                  species: Species[p.species],
                  hp: `${p.hp}/${p.maxHp}`,
                  fainted: p.fainted,
                  isActive: i === active1Index,
                })),
                null,
                2
              )}
            </pre>
          </div>
          <div>
            <h4 className="font-medium">Opponent's Team:</h4>
            <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-40">
              {JSON.stringify(
                team2.map((p, i) => ({
                  index: i,
                  species: Species[p.species],
                  hp: `${p.hp}/${p.maxHp}`,
                  fainted: p.fainted,
                  isActive: i === active2Index,
                })),
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattlePage;
