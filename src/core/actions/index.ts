import type { CustomActionFunction } from "../../types/action.types"
import { config } from "./from-config.action"

export var actions = {
  // add, addMany, modify, append ,
  config,
} satisfies Record<string, CustomActionFunction>
