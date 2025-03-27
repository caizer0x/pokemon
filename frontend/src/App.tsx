import React, { useState, useEffect, useRef } from "react";
import "./App.css";

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
  turnCount: number;
}

function App() {
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to WebSocket server
    const ws = new WebSocket("ws://localhost:3001");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data);
        if (data.type === "battleState") {
          setBattleState(data);
        }
      } catch (err) {
        console.error("Error parsing message", err);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleMoveClick = (index: number) => {
    if (!wsRef.current || !battleState) return;
    if (battleState.isOver) return;

    // Send a "move" action with moveIndex
    const msg = {
      action: "move",
      moveIndex: index,
    };
    wsRef.current.send(JSON.stringify(msg));
  };

  if (!battleState) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Pokémon Battle (Gen 1) - WebSockets</h1>
        </header>
        <main>
          <p>Connecting to server...</p>
        </main>
      </div>
    );
  }

  const { active1, active2, isOver, winner, turnCount } = battleState;
  const moves = active1.moves || [];

  return (
    <div className="app">
      <header className="app-header">
        <h1>Pokémon Battle (Gen 1) - WebSockets</h1>
      </header>
      <main>
        <div style={{ marginBottom: "1rem" }}>
          <p>Turn: {turnCount}</p>
          {isOver ? (
            winner === "team1" ? (
              <p>You won!</p>
            ) : winner === "team2" ? (
              <p>AI won!</p>
            ) : (
              <p>It's over! But no winner set.</p>
            )
          ) : (
            <p>Battle in progress...</p>
          )}
        </div>

        {/* Display Player Pokemon */}
        <div style={{ marginBottom: "1rem" }}>
          <h2>Your Active Pokémon:</h2>
          <PokemonCard pokemon={active1} />
          <h3>Moves:</h3>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {moves.map((move, i) => (
              <button key={i} onClick={() => handleMoveClick(i)} disabled={isOver || active1.fainted}>
                {move.name} (Pwr:{move.power}, Acc:{move.accuracy})
              </button>
            ))}
          </div>
        </div>

        {/* Display AI Pokemon */}
        <div>
          <h2>Opponent's Active Pokémon:</h2>
          <PokemonCard pokemon={active2} />
        </div>
      </main>
    </div>
  );
}

function PokemonCard({ pokemon }: { pokemon: PokemonInfo }) {
  const hpPercent = Math.floor((pokemon.hp / pokemon.maxHp) * 100);
  const barColor = hpPercent > 50 ? "green" : hpPercent > 20 ? "yellow" : "red";
  const faintText = pokemon.fainted ? " (Fainted)" : "";

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "1rem",
        borderRadius: "8px",
        width: "250px",
        marginBottom: "1rem",
      }}
    >
      <h3>
        Species: {pokemon.species} Lv.{pokemon.level}
        {faintText}
      </h3>
      <p>Status: {pokemon.status || "None"}</p>
      <div style={{ background: "#eee", width: "100%", height: "10px" }}>
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
}

export default App;