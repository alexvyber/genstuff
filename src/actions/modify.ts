import type { ActionConfig, DefineActionFunciton, Template } from "../types/action.types"

interface ModifyActionConfigBase extends ActionConfig {
  path: string
  pattern: string | RegExp
}

// type ModifyActionConfigBase = {
//   path: string
//   skipIfExists?: boolean
// } & Template

const modify: DefineActionFunciton<ModifyActionConfigBase> = (config) => {
  return (args) => {
    args
  }
}

export { modify }
