import { Server } from "ws";
import { Server as HttpServer } from "http";
import { randomUUID } from "crypto";
import { Battle } from "../../src/battle";
import { Pokemon } from "../../src/pokemon";
import randomTeamGenerator from "../../data/sets/teams";
import { Action } from "../../src/action";
import type { WebSocket as WsSocket } from "ws";

interface PlayerInfo {
  playerId: string;
  socket: WsSocket;
  team?: Pokemon[];
}

interface GameRoom {
  roomId: string;
  host: PlayerInfo;
  guest?: PlayerInfo;
  createdAt: number;
  state: "pending" | "in-progress";
  battle?: Battle;
  pendingActionHost?: Action;
  pendingActionGuest?: Action;
}

const gameRooms: Map<string, GameRoom> = new Map();
const playerToRoomId: Map<string, string> = new Map();
const allSockets = new Set<WsSocket>();

export function setupWebSocket(server: HttpServer) {
  const wss = new Server({ server });

  wss.on("connection", (socket: WsSocket) => {
    allSockets.add(socket);

    const playerId = randomUUID();
    console.log("New connection from player", playerId);

    socket.on("message", (data) => {
      let msg: any;
      try {
        msg = JSON.parse(String(data));
      } catch {
        console.error("Bad JSON from client");
        return;
      }
      handleMessage(playerId, socket, msg);
    });

    socket.on("close", () => {
      allSockets.delete(socket);
      const roomId = playerToRoomId.get(playerId);
      if (roomId) {
        const room = gameRooms.get(roomId);
        if (room) {
          if (room.state === "pending") {
            if (room.host.playerId === playerId) {
              gameRooms.delete(roomId);
              broadcastLobbyState();
            }
          } else {
            gameRooms.delete(roomId);
          }
        }
      }
      playerToRoomId.delete(playerId);
    });
  });
}

/** Central message handler from client. */
function handleMessage(playerId: string, socket: WsSocket, msg: any) {
  switch (msg.action) {
    case "listGames":
      sendPendingToOne(socket);
      break;
    case "createGame":
      createGame(playerId, socket);
      break;
    case "cancelGame":
      cancelGame(playerId, msg.roomId);
      break;
    case "joinGame":
      joinGame(playerId, socket, msg.roomId);
      break;
    case "move":
    case "switch":
      handleBattleAction(playerId, msg);
      break;
    default:
      socket.send(JSON.stringify({ type: "error", message: "Unknown action" }));
  }
}

function createGame(playerId: string, socket: WsSocket) {
  if (playerToRoomId.has(playerId)) {
    socket.send(JSON.stringify({ type: "error", message: "Already in a room" }));
    return;
  }
  const roomId = randomUUID();
  gameRooms.set(roomId, {
    roomId,
    host: { playerId, socket },
    createdAt: Date.now(),
    state: "pending",
  });
  playerToRoomId.set(playerId, roomId);

  socket.send(JSON.stringify({ type: "gameCreated", roomId }));
  broadcastLobbyState();
}

function cancelGame(playerId: string, roomId: string) {
  const room = gameRooms.get(roomId);
  if (!room) return;
  if (room.host.playerId !== playerId) return;
  if (room.state !== "pending") return;

  gameRooms.delete(roomId);
  playerToRoomId.delete(playerId);
  broadcastLobbyState();
}

function joinGame(playerId: string, socket: WsSocket, roomId: string) {
  const room = gameRooms.get(roomId);
  if (!room) {
    socket.send(JSON.stringify({ type: "error", message: "No such room" }));
    return;
  }
  if (room.state !== "pending") {
    socket.send(JSON.stringify({ type: "error", message: "Room is not pending" }));
    return;
  }
  if (playerToRoomId.has(playerId)) {
    socket.send(JSON.stringify({ type: "error", message: "You are already in a room" }));
    return;
  }

  room.guest = { playerId, socket };
  room.state = "in-progress";
  gameRooms.set(roomId, room);
  playerToRoomId.set(playerId, roomId);

  startBattle(room);
  broadcastLobbyState();
}

function startBattle(room: GameRoom) {
  const hostTeam = randomTeamGenerator.getRandomTeam(6);
  const guestTeam = randomTeamGenerator.getRandomTeam(6);
  room.host.team = hostTeam;
  room.guest!.team = guestTeam;

  const battle = new Battle(hostTeam, guestTeam);
  room.battle = battle;

  // send "battleStart" to each side
  room.host.socket.send(JSON.stringify({
    type: "battleStart",
    roomId: room.roomId,
    yourTeam: hostTeam.map(serializePokemon),
  }));
  if (room.guest) {
    room.guest.socket.send(JSON.stringify({
      type: "battleStart",
      roomId: room.roomId,
      yourTeam: guestTeam.map(serializePokemon),
    }));
  }
}

/** Moves & switching in the actual battle. */
function handleBattleAction(playerId: string, msg: any) {
  const roomId = playerToRoomId.get(playerId);
  if (!roomId) return;
  const room = gameRooms.get(roomId);
  if (!room || !room.battle) return;

  const battle = room.battle;
  const isHost = (room.host.playerId === playerId);

  let action: Action;
  if (msg.action === "move") {
    if (isHost) {
      const i = msg.moveIndex;
      if (i == null || i < 0 || i >= battle.active1.moves.length) return;
      action = { type: "move", move: battle.active1.moves[i] };
    } else {
      const i = msg.moveIndex;
      if (i == null || i < 0 || i >= battle.active2.moves.length) return;
      action = { type: "move", move: battle.active2.moves[i] };
    }
  } else if (msg.action === "switch") {
    if (isHost) {
      const i = msg.pokemonIndex;
      if (i < 0 || i >= battle.team1.length) return;
      const chosen = battle.team1[i];
      if (!chosen || chosen.isFainted() || chosen === battle.active1) return;
      action = { type: "switch", pokemon: chosen };
    } else {
      const i = msg.pokemonIndex;
      if (i < 0 || i >= battle.team2.length) return;
      const chosen = battle.team2[i];
      if (!chosen || chosen.isFainted() || chosen === battle.active2) return;
      action = { type: "switch", pokemon: chosen };
    }
  } else {
    return;
  }

  if (isHost) {
    room.pendingActionHost = action;
  } else {
    room.pendingActionGuest = action;
  }

  // Process turn once both have chosen
  if (room.pendingActionHost && room.pendingActionGuest) {
    const hostAction = room.pendingActionHost;
    const guestAction = room.pendingActionGuest;
    room.pendingActionHost = undefined;
    room.pendingActionGuest = undefined;

    if (isHost) {
      battle.turn(hostAction, guestAction);
    } else {
      battle.turn(guestAction, hostAction);
    }
    sendBattleState(room);
  }
}

/** After a turn, update both players with the new state. */
function sendBattleState(room: GameRoom) {
  if (!room.battle) return;
  const b = room.battle;
  const data = {
    type: "battleState",
    isOver: b.isBattleOver(),
    winner: b.getWinner(),
    team1: b.team1.map(mon => packMon(mon, false)),
    team2: b.team2.map(mon => packMon(mon, false)),
    active1: packMon(b.active1, true),
    active2: packMon(b.active2, true),
    active1Index: b.team1.indexOf(b.active1),
    active2Index: b.team2.indexOf(b.active2),
    turnCount: b.turnCount,
    battleLog: b.battleLog,
  };
  const out = JSON.stringify(data);

  room.host.socket.send(out);
  if (room.guest) {
    room.guest.socket.send(out);
  }
}

/** packMon function that expects 2 arguments. */
function packMon(mon: Pokemon, showMoves: boolean) {
  return {
    species: mon.species,
    hp: mon.currentHp,
    maxHp: mon.stats.hp,
    level: mon.level,
    fainted: mon.isFainted(),
    status: mon.status,
    moves: showMoves
      ? mon.moves.map(m => ({
          name: m.name,
          power: m.power,
          accuracy: m.accuracy,
          type: m.type,
        }))
      : [],
  };
}

/** Send the user the current pending rooms. */
function sendPendingToOne(socket: WsSocket) {
  const pending = getPendingGames();
  socket.send(JSON.stringify({ type: "lobbyUpdate", pendingGames: pending }));
}

/** Broadcast pending games to everyone in allSockets. */
function broadcastLobbyState() {
  const pending = getPendingGames();
  const payload = JSON.stringify({ type: "lobbyUpdate", pendingGames: pending });

  for (const sock of allSockets) {
    sock.send(payload);
  }
}

function getPendingGames() {
  return Array.from(gameRooms.values())
    .filter(r => r.state === "pending")
    .map(r => ({
      roomId: r.roomId,
      createdAt: r.createdAt
    }));
}

function serializePokemon(p: Pokemon) {
  return {
    species: p.species,
    hp: p.currentHp,
    maxHp: p.stats.hp,
    level: p.level,
  };
}