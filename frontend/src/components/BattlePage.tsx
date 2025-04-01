import React, { useEffect, useState } from "react";
import TeamView from "./TeamView";
import OpponentTeamView from "./OpponentTeamView";
import PokemonCard from "./PokemonCard";
import { Species } from "../../../data/species";
import BattleLog from "./BattleLog";
import { useBattleLogQueue } from "../hooks/useBattleLogQueue";

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
  battleLog?: string[];
}

interface BattlePageProps {
  battleState: BattleState | null;
  onSendMessage: (msg: any) => void;
}

const BattlePage: React.FC<BattlePageProps> = ({ battleState, onSendMessage }) => {
  // ephemeral animations for each side's active card
  const [animations, setAnimations] = useState<{
    team1: { shake: boolean; statChange: "up" | "down" | null; fadeSwitch: boolean };
    team2: { shake: boolean; statChange: "up" | "down" | null; fadeSwitch: boolean };
  }>({
    team1: { shake: false, statChange: null, fadeSwitch: false },
    team2: { shake: false, statChange: null, fadeSwitch: false },
  });

  // track last indexes to detect switching
  const [lastActive1Index, setLastActive1Index] = useState<number | undefined>(undefined);
  const [lastActive2Index, setLastActive2Index] = useState<number | undefined>(undefined);

  // Function to reset ephemeral animations after a delay
  function resetAnimations() {
    setAnimations((prev) => ({
      team1: { ...prev.team1, shake: false, statChange: null },
      team2: { ...prev.team2, shake: false, statChange: null },
    }));
  }

  // We'll parse lines for certain keywords to set the ephemeral animations
  function parseLineForAnimations(line: string) {
    if (!battleState) return;
    let side: "team1" | "team2" | null = null;

    // if it includes active1 species or "Team 1"
    if (
      line.includes("Team 1") ||
      line.includes(Species[battleState.active1.species])
    ) {
      side = "team1";
    } else if (
      line.includes("Team 2") ||
      line.includes(Species[battleState.active2.species])
    ) {
      side = "team2";
    }

    if (!side) return;

    // Shake if line includes certain keywords
    if (
      line.includes("damage") ||
      line.includes("hit") ||
      line.includes("hurt") ||
      line.includes("effective") ||
      line.includes("crash") ||
      line.includes("KO")
    ) {
      // Typically the 'defender' is shaking. We'll invert the side for the shake.
      const targetSide = side === "team1" ? "team2" : "team1";
      setAnimations((prev) => ({
        ...prev,
        [targetSide]: { ...prev[targetSide], shake: true },
      }));
    }

    // Stat changes
    if (line.includes(" rose")) {
      setAnimations((prev) => ({
        ...prev,
        [side!]: { ...prev[side!], statChange: "up" },
      }));
    } else if (line.includes(" fell")) {
      setAnimations((prev) => ({
        ...prev,
        [side!]: { ...prev[side!], statChange: "down" },
      }));
    }
  }

  // Our custom log queue hook
  const { displayedLogs } = useBattleLogQueue({
    battleState,
    parseLineForAnimations,
    resetAnimations,
    lineDelay: 2000,
    resetDelay: 500,
  });

  // handle some side-effect when battleState changes, e.g. switching detection
  useEffect(() => {
    if (!battleState) return;

    const switchingTeam1 =
      lastActive1Index !== undefined && lastActive1Index !== battleState.active1Index;
    const switchingTeam2 =
      lastActive2Index !== undefined && lastActive2Index !== battleState.active2Index;

    if (switchingTeam1 || switchingTeam2) {
      setAnimations((prev) => ({
        team1: { ...prev.team1, fadeSwitch: switchingTeam1 },
        team2: { ...prev.team2, fadeSwitch: switchingTeam2 },
      }));
      // remove fade after 1 second
      setTimeout(() => {
        setAnimations((prev) => ({
          team1: { ...prev.team1, fadeSwitch: false },
          team2: { ...prev.team2, fadeSwitch: false },
        }));
      }, 1000);
    }

    setLastActive1Index(battleState.active1Index);
    setLastActive2Index(battleState.active2Index);
  }, [battleState, lastActive1Index, lastActive2Index]);

  // Handlers for moves and switching
  const handleMove = (moveIndex: number) => {
    if (!battleState || battleState.isOver) return;
    onSendMessage({ action: "move", moveIndex });
  };

  const handleSwitch = (pokemonIndex: number) => {
    if (!battleState || battleState.isOver) return;
    onSendMessage({ action: "switch", pokemonIndex });
  };

  if (!battleState) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4" />
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

  return (
    <div className="retro-screen">
      <div className="pokedex-screen">
        {/* Battle Status Bar */}
        <div className="bg-pokedex-screen rounded-lg p-2 mb-4 border-2 border-dark-color">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="pokedex-button pokedex-button-red w-4 h-4 mr-2 animate-blink"></div>
              <div className="text-sm">
                Turn: <span className="font-bold">{turnCount}</span>
              </div>
            </div>
            <div className="text-sm">
              {isOver ? (
                winner === "team1" ? (
                  <span className="text-success font-bold animate-blink">
                    YOU WON!
                  </span>
                ) : winner === "team2" ? (
                  <span className="text-danger font-bold animate-blink">
                    AI WON!
                  </span>
                ) : (
                  <span className="text-warning animate-blink">
                    BATTLE ENDED! NO WINNER?
                  </span>
                )
              ) : (
                <span className="text-primary">BATTLE IN PROGRESS...</span>
              )}
            </div>
          </div>
        </div>

        {/* Opponent's Team at the top */}
        <div className="mb-4">
          <h2 className="text-xs font-bold text-danger mb-2 border-b-2 border-danger-color pb-1 flex items-center">
            <div className="pokeball mr-2"></div>
            OPPONENT'S TEAM
          </h2>
          <OpponentTeamView team={team2} activeIndex={active2Index} />
        </div>

        {/* Main Battle Area - Active Pokémon */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Left side - Your active Pokémon */}
          <div className="flex-1 card">
            <h3 className="text-xs font-bold text-primary mb-2 flex items-center">
              <div className="pokeball w-4 h-4 mr-2"></div>
              YOUR ACTIVE POKÉMON: {Species[active1.species]}
            </h3>
            <div className="flex justify-center mb-4">
              <PokemonCard
                pokemon={active1}
                shake={animations.team1.shake}
                statChange={animations.team1.statChange}
                fadeSwitch={animations.team1.fadeSwitch}
                isActive={true}
              />
            </div>
            {active1.fainted && (
              <div className="text-center p-2 bg-danger-color text-white text-xs font-medium rounded-md animate-blink">
                THIS POKÉMON FAINTED! PLEASE SWITCH.
              </div>
            )}
          </div>

          {/* Right side - Opponent's active Pokémon */}
          <div className="flex-1 card">
            <h3 className="text-xs font-bold text-danger mb-2 flex items-center">
              <div className="pokeball w-4 h-4 mr-2"></div>
              OPPONENT'S ACTIVE POKÉMON: {Species[active2.species]}
            </h3>
            <div className="flex justify-center mb-4">
              <PokemonCard
                pokemon={active2}
                shake={animations.team2.shake}
                statChange={animations.team2.statChange}
                fadeSwitch={animations.team2.fadeSwitch}
                isActive={true}
              />
            </div>
          </div>
        </div>

        {/* Moves Section */}
        {!active1.fainted && (
          <div className="mb-6">
            <h3 className="text-xs font-bold text-primary mb-2 border-b-2 border-primary-color pb-1 flex items-center">
              <div className="pokeball mr-2"></div>
              MOVES
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {(active1.moves || []).map((move, i) => (
                <button
                  key={i}
                  onClick={() => handleMove(i)}
                  disabled={isOver || active1.fainted}
                  className={`btn btn-primary text-xs`}
                >
                  <div className="font-medium">{move.name}</div>
                  <div className="text-[10px]">
                    PWR: {move.power} ACC: {move.accuracy}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Your Team at the bottom with all 6 Pokémon */}
        <div className="mb-4">
          <h2 className="text-xs font-bold text-primary mb-2 border-b-2 border-primary-color pb-1 flex items-center">
            <div className="pokeball mr-2"></div>
            YOUR TEAM
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {team1.map((pokemon, i) => {
              const isActive = i === active1Index;
              const canSwitch = !pokemon.fainted && !isActive;
              return (
                <div
                  key={i}
                  className={`relative cursor-pointer ${
                    isActive ? "ring-4 ring-secondary-color" : ""
                  }`}
                  onClick={() => {
                    if (canSwitch) {
                      handleSwitch(i);
                    }
                  }}
                >
                  <div
                    className={`bg-white rounded-lg p-2 border-2 ${
                      isActive ? "border-secondary-color" : "border-dark-color"
                    } ${pokemon.fainted ? "opacity-60" : ""}`}
                  >
                    {/* Species number */}
                    <div className="absolute top-0 left-0 bg-primary-color text-white text-[8px] px-1 rounded-br-md">
                      #{pokemon.species}
                    </div>

                    {/* Pokémon image */}
                    <div className="flex justify-center">
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.species}.png`}
                        alt={Species[pokemon.species]}
                        className="w-12 h-12 pixelated"
                        style={{ imageRendering: "pixelated" }}
                      />
                    </div>

                    {/* HP bar - always visible but minimal */}
                    <div
                      className="health-bar-bg mt-1"
                      style={{ height: "4px" }}
                    >
                      <div
                        className={`${
                          pokemon.hp > pokemon.maxHp / 2
                            ? "bg-success"
                            : pokemon.hp > pokemon.maxHp / 5
                            ? "bg-warning-color"
                            : "bg-danger-color"
                        } transition-all duration-500`}
                        style={{
                          width: `${Math.floor(
                            (pokemon.hp / pokemon.maxHp) * 100
                          )}%`,
                          height: "100%",
                        }}
                      />
                    </div>
                  </div>

                  {/* Status badge - minimal */}
                  <div className="text-[8px] mt-1 text-center">
                    <span
                      className={`${
                        pokemon.fainted
                          ? "bg-danger-color"
                          : isActive
                          ? "bg-secondary-color"
                          : "bg-success"
                      } text-white py-0.5 px-1 rounded-full border border-dark-color shadow-sm`}
                    >
                      {pokemon.fainted
                        ? "FAINTED"
                        : isActive
                        ? "ACTIVE"
                        : "AVAILABLE"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Battle Log Section */}
        <div className="mt-4">
          <h3 className="text-xs font-bold mb-2 border-b-2 border-dark-color pb-1 flex items-center">
            <div className="pokeball mr-2"></div>
            BATTLE LOG
          </h3>
          <BattleLog logs={displayedLogs} />
        </div>

        {/* Pokedex Buttons */}
        <div className="pokedex-buttons mt-6">
          <div className="pokedex-button pokedex-button-red"></div>
          <div className="pokedex-button pokedex-button-blue"></div>
          <div className="pokedex-button pokedex-button-yellow"></div>
          <div className="pokedex-button pokedex-button-green"></div>
        </div>
      </div>
    </div>
  );
};

export default BattlePage;