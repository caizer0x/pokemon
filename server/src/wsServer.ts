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

        // Handle "move" action
        if (msg.action === "move") {
          const moveIndex = msg.moveIndex;
          if (
            moveIndex == null ||
            moveIndex < 0 ||
            moveIndex >= currentBattle.active1.moves.length
          ) {
            // Send an error or ignore
            return;
          }

          // Player's chosen move
          const playerMove = currentBattle.active1.moves[moveIndex];
          const playerAction: Action = { type: "move", move: playerMove };

          // AI picks random move if available
          let aiAction: Action = { type: "move", move: null };
          if (currentBattle.active2.moves.length > 0) {
            const aiIndex = Math.floor(
              Math.random() * currentBattle.active2.moves.length
            );
            const aiMove = currentBattle.active2.moves[aiIndex];
            aiAction = { type: "move", move: aiMove };
          }

          currentBattle.turn(playerAction, aiAction);
          handleFaints(currentBattle);

          sendFullBattleState(socket, currentBattle);
        } else if (msg.action === "switch") {
          // Switch out player's active Pokemon
          const switchIndex = msg.pokemonIndex;
          const cbt = currentBattle;

          // Validate index
          if (
            switchIndex == null ||
            switchIndex < 0 ||
            switchIndex >= cbt.team1.length
          ) {
            // invalid index
            return;
          }

          const chosenMon = cbt.team1[switchIndex];
          // Can't switch to fainted or the same as active
          if (
            !chosenMon ||
            chosenMon.isFainted() ||
            chosenMon === cbt.active1
          ) {
            // ignoring
            return;
          }

          // Perform the switch
          const switchAction: Action = { type: "switch", pokemon: chosenMon };
          // AI picks random move
          let aiAction: Action = { type: "move", move: null };
          if (cbt.active2.moves.length > 0) {
            const aiIndex = Math.floor(
              Math.random() * cbt.active2.moves.length
            );
            const aiMove = cbt.active2.moves[aiIndex];
            aiAction = { type: "move", move: aiMove };
          }

          cbt.turn(switchAction, aiAction);
          handleFaints(cbt);

          sendFullBattleState(socket, cbt);
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
 * If active1 or active2 fainted, auto-switch if possible
 */
function handleFaints(battle: Battle) {
  // If player's active Pokemon fainted, auto-switch if possible
  if (battle.active1.isFainted()) {
    const next = battle.team1.find(
      (p) => !p.isFainted() && p !== battle.active1
    );
    if (next) {
      const faintedPokemon = battle.active1;
      battle.active1 = next;
      battle.active1.resetStatStages();
      battle.active1.volatileStatus = [];
      // Log the auto-switch
      battle.addToLog(`${faintedPokemon.species} fainted!`);
      battle.addToLog(`Team 1 sent out ${next.species}!`);
    }
  }
  // If AI's active Pokemon fainted, auto-switch if possible
  if (battle.active2.isFainted()) {
    const next = battle.team2.find(
      (p) => !p.isFainted() && p !== battle.active2
    );
    if (next) {
      const faintedPokemon = battle.active2;
      battle.active2 = next;
      battle.active2.resetStatStages();
      battle.active2.volatileStatus = [];
      // Log the auto-switch
      battle.addToLog(`${faintedPokemon.species} fainted!`);
      battle.addToLog(`Team 2 sent out ${next.species}!`);
    }
  }
}

/**
 * Send the entire battle state to the client
 */
function sendFullBattleState(socket: any, battle: Battle) {
  const active1Index = battle.team1.indexOf(battle.active1);
  const active2Index = battle.team2.indexOf(battle.active2);

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
      // Typically hide the AI moves from the player
    },
    active1Index,
    active2Index,
    turnCount: battle.turnCount,
    battleLog: battle.battleLog, // Include the battle log
  };

  socket.send(JSON.stringify(data));
}
