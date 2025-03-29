import React, { useState, useEffect, useRef } from "react";
import BattlePage from "./components/BattlePage";

function App() {
  const [battleState, setBattleState] = useState<any>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
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

  const sendMessage = (message: any) => {
    if (!wsRef.current) return;
    wsRef.current.send(JSON.stringify(message));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary-color text-white p-4 shadow-md relative">
        <div className="container mx-auto">
          <div className="flex items-center justify-center">
            <div className="pokeball animate-rotate mr-3"></div>
            <h1 className="text-2xl md:text-3xl font-bold text-center">
              Pokémon Battle
            </h1>
            <div className="pokeball animate-rotate ml-3"></div>
          </div>
          <div className="text-center text-xs mt-2 animate-blink">
            GENERATION I
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-2 right-2 flex space-x-2">
          <div className="pokedex-button pokedex-button-red"></div>
          <div className="pokedex-button pokedex-button-yellow"></div>
          <div className="pokedex-button pokedex-button-green"></div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4">
        <BattlePage battleState={battleState} onSendMessage={sendMessage} />
      </main>

      <footer className="bg-dark text-white p-3 text-center text-xs">
        <div className="flex items-center justify-center">
          <div
            className="pokeball mr-2"
            style={{ width: "14px", height: "14px" }}
          ></div>
          <p>Pokémon Battle Engine - Generation I</p>
          <div
            className="pokeball ml-2"
            style={{ width: "14px", height: "14px" }}
          ></div>
        </div>
        <div className="mt-1 text-[10px] opacity-70">
          © {new Date().getFullYear()} Pokémon Trainer
        </div>
      </footer>
    </div>
  );
}

export default App;
