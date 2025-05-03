import type { ActionConfig, DefineActionFunciton } from "../types/action.types"

interface ModifyActionConfigBase extends ActionConfig {
  path: string
  pattern: string | RegExp
}

const modify: DefineActionFunciton<ModifyActionConfigBase> = (config) => {
  return (args) => {
    args
  }
}

export { modify }
