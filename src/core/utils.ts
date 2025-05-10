import type { Config, GeneratorType } from "../types/types"
import type { ActionFunction } from "../types/action.types"
import { Genstuff } from "./genstuff"

function config(config: Config | ((genstuff: Genstuff) => Config)): Config {
  var genstuff = new Genstuff()

  if (typeof config === "function") {
    return config(genstuff)
  }

  return config
}

function generator<A extends Record<string, any>>(generator: GeneratorType<A>): GeneratorType<A> {
  return generator
}

function action(action: ActionFunction): ActionFunction {
  return action
}

function throwStringifiedError(err: Error | string) {
  if (typeof err === "string") {
    throw err
  }

  throw err.message || JSON.stringify(err)
}

export { config, action, throwStringifiedError, generator }
