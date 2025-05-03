import type { DefineActionFunciton, Template, Templates } from "../types/action.types"

type WriteActionConfig =
  | (Template & { path: string })
  | (Template & { config: string })
  | (Templates & { destination: string; path: string })
  | (Templates & { destination: string; config: string })

const write: DefineActionFunciton<WriteActionConfig> = (config) => {
  return (args) => {
    args
  }
}

export { write }
