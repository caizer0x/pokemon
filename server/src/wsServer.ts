import { Server } from "ws";
import { Server as HttpServer } from "http";
import { v4 as uuidv4 } from "uuid";
import { Battle } from "../../src/battle";
import randomTeamGenerator from "../../data/sets/teams";
import { Action } from "../../src/action";

/**
 * We'll store battles by client ID. In a real multi-user system, you'd store them differently.
 */
const battles: Map<string, Battle> = new Map();

export function setupWebSocket(server: HttpServer) {
  const wss = new Server({ server });

  wss.on("connection", (socket) => {
    // Create new battle on connect
    const id = uuidv4();
    const playerTeam = randomTeamGenerator.getRandomTeam(6);
    const aiTeam = randomTeamGenerator.getRandomTeam(6);
    const battle = new Battle(playerTeam, aiTeam);
    battles.set(id, battle);

    // Immediately send initial state
    sendFullBattleState(socket, battle);

    socket.on("message", (data: string) => {
      try {
        const msg = JSON.parse(data);

        // If user disconnected or battle missing, do nothing
        if (!battles.has(id)) return;

        const currentBattle = battles.get(id)!;

        // Only action we handle is "move" with moveIndex
        if (msg.action === "move") {
          const moveIndex = msg.moveIndex;
          // Validate
          if (
            moveIndex == null ||
            moveIndex < 0 ||
            moveIndex >= currentBattle.active1.moves.length
          ) {
            // Send an error or ignore
            return;
          }

          // The player's chosen move
          const playerMove = currentBattle.active1.moves[moveIndex];
          const playerAction: Action = { type: "move", move: playerMove };

          // AI picks random move
          if (currentBattle.active2.moves.length > 0) {
            const aiIndex = Math.floor(Math.random() * currentBattle.active2.moves.length);
            const aiMove = currentBattle.active2.moves[aiIndex];
            const aiAction: Action = { type: "move", move: aiMove };

            currentBattle.turn(playerAction, aiAction);

            // Check if AI or Player Pokemon fainted => switch if available
            handleFaints(currentBattle);
          }

          // Send updated battle state
          sendFullBattleState(socket, currentBattle);
        }
      } catch (err) {
        console.error("Error handling message:", err);
      }
    });

    socket.on("close", () => {
      // On disconnect, remove this battle
      battles.delete(id);
    });
  });
}

/**
 * Helper to handle fainted Pokemon for a single-player scenario:
 * If active1 or active2 fainted, switch to next if available.
 */
function handleFaints(battle: Battle) {
  // If player's active Pokemon fainted, auto-switch if possible
  if (battle.active1.isFainted()) {
    const next = battle.team1.find((p) => !p.isFainted() && p !== battle.active1);
    if (next) {
      battle.active1 = next;
    }
  }
  // If AI's active Pokemon fainted, auto-switch if possible
  if (battle.active2.isFainted()) {
    const next = battle.team2.find((p) => !p.isFainted() && p !== battle.active2);
    if (next) {
      battle.active2 = next;
    }
  }
}

/**
 * Send the entire battle state to the client
 */
function sendFullBattleState(socket: any, battle: Battle) {
  // Build a minimal shape of the battle state to the client
  const data = {
    type: "battleState",
    isOver: battle.isBattleOver(),
    winner: battle.getWinner(),
    team1: battle.team1.map((p) => ({
      species: p.species,
      hp: p.currentHp,
      maxHp: p.stats.hp,
      level: p.level,
      fainted: p.isFainted(),
      status: p.status,
    })),
    team2: battle.team2.map((p) => ({
      species: p.species,
      hp: p.currentHp,
      maxHp: p.stats.hp,
      level: p.level,
      fainted: p.isFainted(),
      status: p.status,
    })),
    active1: {
      species: battle.active1.species,
      hp: battle.active1.currentHp,
      maxHp: battle.active1.stats.hp,
      level: battle.active1.level,
      fainted: battle.active1.isFainted(),
      status: battle.active1.status,
      moves: battle.active1.moves.map((m) => ({
        name: m.name,
        power: m.power,
        accuracy: m.accuracy,
        type: m.type,
      })),
    },
    active2: {
      species: battle.active2.species,
      hp: battle.active2.currentHp,
      maxHp: battle.active2.stats.hp,
      level: battle.active2.level,
      fainted: battle.active2.isFainted(),
      status: battle.active2.status,
      // For UI, we can omit or show AI moves
    },
    turnCount: battle.turnCount,
  };

  socket.send(JSON.stringify(data));
}