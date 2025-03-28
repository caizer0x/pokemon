import React, { useEffect, useState, useRef } from "react";
import TeamView from "./TeamView";
import PokemonCard from "./PokemonCard";
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

/**
 * We'll maintain a queue for logs that haven't been displayed yet.
 * We'll display them one by one every 2 seconds. While a line is displayed,
 * we parse it for keywords to trigger certain animations (shake, stat changes, switch fade).
 */
const BattlePage: React.FC<BattlePageProps> = ({ battleState, onSendMessage }) => {
  const [displayedLogs, setDisplayedLogs] = useState<string[]>([]);
  const [pendingLogs, setPendingLogs] = useState<string[]>([]);
  const [animating, setAnimating] = useState<boolean>(false);

  // We track ephemeral animations for each side's active card:
  // e.g. { team1: {shake: false, statChange: null, fadeSwitch: false}, team2: {...} }
  const [animations, setAnimations] = useState<{
    team1: { shake: boolean; statChange: "up"|"down"|null; fadeSwitch: boolean };
    team2: { shake: boolean; statChange: "up"|"down"|null; fadeSwitch: boolean };
  }>({
    team1: { shake: false, statChange: null, fadeSwitch: false },
    team2: { shake: false, statChange: null, fadeSwitch: false },
  });

  // To detect if a switch occurred, track the last active1Index and active2Index
  const [lastActive1Index, setLastActive1Index] = useState<number|undefined>(undefined);
  const [lastActive2Index, setLastActive2Index] = useState<number|undefined>(undefined);

  // When we get a new battleState, check for new logs to queue
  useEffect(() => {
    if (!battleState) return;

    // If the active index changed from the previous, it means a switch or new Pokemon is out.
    const switchingTeam1 = lastActive1Index !== undefined && lastActive1Index !== battleState.active1Index;
    const switchingTeam2 = lastActive2Index !== undefined && lastActive2Index !== battleState.active2Index;

    // Mark fadeSwitch = true if switching
    if (switchingTeam1 || switchingTeam2) {
      setAnimations(prev => ({
        team1: {
          ...prev.team1,
          fadeSwitch: switchingTeam1,
        },
        team2: {
          ...prev.team2,
          fadeSwitch: switchingTeam2,
        }
      }));
      // We'll remove fade switch after 1 second
      setTimeout(() => {
        setAnimations(prev => ({
          team1: { ...prev.team1, fadeSwitch: false },
          team2: { ...prev.team2, fadeSwitch: false },
        }));
      }, 1000);
    }

    setLastActive1Index(battleState.active1Index);
    setLastActive2Index(battleState.active2Index);

    // see if there's new lines in battleLog
    const newLines = battleState.battleLog || [];
    // figure out which lines are new compared to displayedLogs + pendingLogs
    const allShown = [...displayedLogs, ...pendingLogs];
    const fresh = newLines.slice(allShown.length);
    if (fresh.length > 0) {
      setPendingLogs(pl => [...pl, ...fresh]);
    }
  }, [battleState, displayedLogs, pendingLogs, lastActive1Index, lastActive2Index]);

  // Keep a ref for processing queue
  const queueRef = useRef(false);

  // Each time pendingLogs changes, if we're not currently animating a line, handle the next line
  useEffect(() => {
    if (queueRef.current) return; // already processing

    const processNext = () => {
      // If no more pending logs, done
      if (pendingLogs.length === 0) {
        queueRef.current = false;
        return;
      }
      // Mark we are processing
      queueRef.current = true;
      setAnimating(true);

      // take first line
      const line = pendingLogs[0];
      const remainder = pendingLogs.slice(1);

      // parse line for special triggers (shake, stat up/down)
      parseLineForAnimations(line);

      // show it after 2 seconds
      setTimeout(() => {
        // Add to displayed
        setDisplayedLogs((dl) => [...dl, line]);
        // remove from pending
        setPendingLogs(remainder);
        setAnimating(false);

        // reset ephemeral animations after each line
        // but give 0.5s for the user to see the effect
        setTimeout(() => {
          resetAnimations();
          // done with this line, process next
          queueRef.current = false;
          processNext();
        }, 500);

      }, 2000);
    };

    if (!animating && pendingLogs.length > 0) {
      processNext();
    }
  }, [pendingLogs, animating]);

  function resetAnimations() {
    setAnimations(prev => ({
      team1: { ...prev.team1, shake: false, statChange: null },
      team2: { ...prev.team2, shake: false, statChange: null },
    }));
  }

  function parseLineForAnimations(line: string) {
    // We do simple substring checks. If "Team 1" or "Team 2" is the subject, we apply the effect to that side's animations
    // Alternatively, it might say "Bulbasaur used Tackle!" or "Bulbasaur's Attack rose!"
    // We'll guess "Team 1" or "Team 2" if present. If not, we try to see if it's about the active1 or active2 species.
    let side: "team1"|"team2"|null = null;
    if (line.includes("Team 1") || (battleState && line.includes(Species[battleState.active1.species]))) {
      side = "team1";
    } else if (line.includes("Team 2") || (battleState && line.includes(Species[battleState.active2.species]))) {
      side = "team2";
    }

    if (!side) return;

    // Shake if "hit", "damage", "super effective", "hurt"
    if (
      line.includes("damage") ||
      line.includes("hit") ||
      line.includes("hurt") ||
      line.includes("effective") ||
      line.includes("crash")
    ) {
      // Typically the 'defender' is shaking. Let's invert the side for the shake.
      const targetSide = side === "team1" ? "team2" : "team1";
      setAnimations(prev => ({
        ...prev,
        [targetSide]: { ...prev[targetSide], shake: true },
      }));
    }

    // Stat changes
    // If line includes "rose", statChange = up
    // If line includes "fell", statChange = down
    if (line.includes(" rose")) {
      setAnimations(prev => ({
        ...prev,
        [side!]: { ...prev[side!], statChange: "up" }
      }));
    } else if (line.includes(" fell")) {
      setAnimations(prev => ({
        ...prev,
        [side!]: { ...prev[side!], statChange: "down" }
      }));
    }
  }

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
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="text-sm">
            Turn: <span className="font-bold">{turnCount}</span>
          </div>
          <div className="text-sm">
            {isOver ? (
              winner === "team1" ? (
                <span className="text-success font-bold">You won!</span>
              ) : winner === "team2" ? (
                <span className="text-danger font-bold">AI won!</span>
              ) : (
                <span className="text-warning">
                  Battle ended! No winner?
                </span>
              )
            ) : (
              <span className="text-primary">Battle in progress...</span>
            )}
          </div>
        </div>
      </div>

      {/* Teams */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-sm font-bold text-primary mb-3 border-b border-gray-300 pb-2">
            Your Team (Team 1)
          </h2>
          <TeamView
            team={team1}
            activeIndex={active1Index}
            onSwitch={handleSwitch}
            isOpponent={false}
          />
        </div>
        <div>
          <h2 className="text-sm font-bold text-danger mb-3 border-b border-gray-300 pb-2">
            Opponent's Team (Team 2)
          </h2>
          <TeamView
            team={team2}
            activeIndex={active2Index}
            isOpponent={true}
          />
        </div>
      </div>

      {/* Active Pokémon + Moves */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-xs font-bold text-primary mb-2">
            Your Active Pokémon: {Species[active1.species]}
          </h3>
          <div className="flex justify-center mb-4">
            <PokemonCard
              pokemon={active1}
              shake={animations.team1.shake}
              statChange={animations.team1.statChange}
              fadeSwitch={animations.team1.fadeSwitch}
            />
          </div>
          {active1.fainted ? (
            <div className="text-center p-2 bg-red-100 text-xs text-danger font-medium">
              This Pokémon fainted! Please switch.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 mt-4">
              {(active1.moves || []).map((move, i) => (
                <button
                  key={i}
                  onClick={() => handleMove(i)}
                  disabled={isOver || active1.fainted}
                  className={`btn btn-primary text-xs`}
                >
                  <div className="font-medium">{move.name}</div>
                  <div className="text-[10px]">Pwr: {move.power} Acc: {move.accuracy}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-xs font-bold text-danger mb-2">
            Opponent's Active Pokémon: {Species[active2.species]}
          </h3>
          <div className="flex justify-center mb-4">
            <PokemonCard
              pokemon={active2}
              shake={animations.team2.shake}
              statChange={animations.team2.statChange}
              fadeSwitch={animations.team2.fadeSwitch}
            />
          </div>
        </div>
      </div>

      {/* Battle Log Section */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-4">
        <h3 className="text-sm font-bold mb-2 border-b border-gray-300 pb-1">
          Battle Log
        </h3>
        <div className="bg-gray-100 p-3 rounded-lg h-64 overflow-y-auto text-xs leading-relaxed">
          {displayedLogs.length === 0 ? (
            <p className="text-gray-500 italic text-center">
              Battle log will appear here...
            </p>
          ) : (
            displayedLogs.map((message, index) => (
              <div key={index} className="mb-1">
                {message}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BattlePage;