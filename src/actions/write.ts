import type { DefineActionFunciton, Template } from "../types/action.types"

type WriteActionConfig = {
  path: string
  skipIfExists?: boolean
} & Template

const wirte: DefineActionFunciton<WriteActionConfig> = (config) => {
  return (args) => {
    args
  }
}

export { wirte }
