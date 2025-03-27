import React, { useState, useEffect, useRef } from "react";
import "./App.css";
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
    <div className="app">
      <header className="app-header">
        <h1>Pokémon Battle (Gen 1) - WebSockets</h1>
      </header>
      <main>
        <BattlePage battleState={battleState} onSendMessage={sendMessage} />
      </main>
    </div>
  );
}

export default App;