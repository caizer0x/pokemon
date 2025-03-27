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
      <header className="bg-primary text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-center">
            Pokémon Battle (Gen 1)
          </h1>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4">
        <BattlePage battleState={battleState} onSendMessage={sendMessage} />
      </main>
      <footer className="bg-dark text-white p-3 text-center text-sm">
        <p>Pokémon Battle Engine - Generation 1</p>
      </footer>
    </div>
  );
}

export default App;
