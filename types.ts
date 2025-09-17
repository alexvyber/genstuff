import type { Genstuff } from "./genstuff.ts"

type Context = {
  answers: Record<string, string | number | boolean | (string | number | boolean)[]>
  errors: Error[]
} & Record<string, unknown>

export type GeneratorParams = {
  context: Context
  genstuff: Genstuff
  generator: GeneratorConfig
  hooks?: ActionHooks
}

export type ActionParams = {
  context: Context
  genstuff: Genstuff
  hooks?: ActionHooks
}

export type ExecuteActionParams = {
  context: Context
  genstuff: Genstuff
  action: Action
}

export type GeneratorConfig = {
  name: string
  // TODO: implement commented out interface
  description?: string // | (( params: unknown ) => string)
  // TODO: implement commented out interface
  actions: Action[] // | Promise<Action[]>  | (( params: unknown ) => Action[] | Promise<Action[]>)
}

export type Config = {
  generators: GeneratorConfig[]
}

export type TextHelpers = Record<string, HelperFn>

export type Actions = Action | Action[]

export type Action = ( params: ActionParams ) => void | Action | Action[] | Promise<void | Action | Action[]>

export type HelperFn = ( str: string ) => string

export interface ActionHooksFailures {
  path: string
  error: string
  message?: string
}

export interface ActionHooksChanges {
  path: string
}

export interface ActionHooks {
  onComment?: ( msg: string ) => void
  onSuccess?: ( change: ActionHooksChanges ) => void
  onFailure?: ( failure: ActionHooksFailures ) => void
}
