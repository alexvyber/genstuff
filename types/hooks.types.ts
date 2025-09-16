export interface GenstuffActionHooksFailures {
  type: TODOTypeName
  path: string
  error: string
  message?: string
}

export interface GenstuffActionHooksChanges {
  type: TODOTypeName
  path: string
}

type TODOTypeName = "function" | "add" | "add" | "modify" | "append" | "skip"

export interface GenstuffActionHooks {
  onComment?: (msg: string) => void
  onSuccess?: (change: GenstuffActionHooksChanges) => void
  onFailure?: (failure: GenstuffActionHooksFailures) => void
}
