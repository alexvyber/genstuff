import type { ActionFunction } from "../types/action.types"
import { config } from "./from-config"

export var actions = {
  // add, addMany, modify, append ,
  config,
} satisfies Record<string, ActionFunction>
