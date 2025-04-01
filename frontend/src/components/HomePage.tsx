import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface PendingGame {
  roomId: string;
  createdAt: number;
}

const HomePage: React.FC = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [pendingGames, setPendingGames] = useState<PendingGame[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Make sure this matches your server’s actual port.
    const wsUrl = "ws://localhost:3001";
    console.log("[WebSocket] Attempting connection to", wsUrl);

    const ws = new WebSocket(wsUrl);
    setSocket(ws);

    ws.onopen = () => {
      console.log("[WebSocket] connected to", wsUrl);
      // Request the current pending games
      ws.send(JSON.stringify({ action: "listGames" }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("[WebSocket] message:", message);

      switch (message.type) {
        case "lobbyUpdate": {
          setPendingGames(message.pendingGames);
          break;
        }
        case "gameCreated": {
          console.log("[GameCreated]", message.roomId);
          break;
        }
        case "battleStart": {
          console.log("[battleStart]", message);
          navigate("/battle");
          break;
        }
        case "error": {
          console.error("[ServerError]", message.message);
          break;
        }
        default:
          console.log("[WebSocket] unknown message", message);
      }
    };

    ws.onclose = () => {
      console.log("[WebSocket] disconnected from", wsUrl);
    };

    ws.onerror = (err: any) => {
      console.error("[WebSocket] error:", err.message || err);
    };

    // cleanup
    return () => {
      ws.close();
    };
  }, [navigate]);

  const handleCreateGame = () => {
    if (socket) {
      socket.send(JSON.stringify({ action: "createGame" }));
    }
  };

  const handleJoinGame = (roomId: string) => {
    if (socket) {
      socket.send(JSON.stringify({ action: "joinGame", roomId }));
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Pokémon Battle Lobby</h2>
      <button className="btn btn-primary" onClick={handleCreateGame}>Create New Game</button>

      <div className="mt-4">
        <h3 className="font-bold text-md">Open Games</h3>
        {pendingGames.length === 0 ? (
          <p className="text-sm italic">No open games yet.</p>
        ) : (
          <ul className="list-disc list-inside">
            {pendingGames.map((game) => (
              <li key={game.roomId} className="flex items-center gap-2">
                <span>Room: {game.roomId}</span>
                <button className="btn btn-secondary text-xs" onClick={() => handleJoinGame(game.roomId)}>
                  Join
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HomePage;