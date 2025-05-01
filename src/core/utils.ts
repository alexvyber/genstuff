import type { Config, GeneratorType } from "../types/types"
import type { ActionType } from "../types/action.types"
import { Genstuff } from "./genstuff"

function defineConfig(config: Config | ((genstuff: Genstuff) => Config)): Config {
  var genstuff = new Genstuff()

  if (typeof config === "function") {
    return config(genstuff)
  }

  return config
}

function generator<A extends Record<string, any>>(generator: GeneratorType<A>): GeneratorType<A> {
  return generator
}

function action(action: ActionType): ActionType {
  return action
}

function throwStringifiedError(err: Error | string) {
  if (typeof err === "string") {
    throw err
  }

  throw err.message || JSON.stringify(err)
}

export { defineConfig, action, throwStringifiedError, generator }
