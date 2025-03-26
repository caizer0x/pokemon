// src/action.ts
import { Move } from "./move";
import { Pokemon } from "./pokemon";

export type Action =
  | { type: "move"; move: Move | null }
  | { type: "switch"; pokemon: Pokemon };
