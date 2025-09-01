import type { Context } from "./types.js"

export interface ActionConfig {
  name?: string
  force?: boolean
  context?: Context
  skip?: (...args: any[]) => any
}

export type FunctionArgs<Answers = {}, Ctx = Context> = {
  answers: Answers
  context: Ctx
}

export type ActionFunction<Answers = {}> = (
  arg: FunctionArgs<Answers>,
) => Promise<void> | void

export type AiPromptFunction<Answers = {}> = (
  arg: FunctionArgs<Answers>,
) => Promise<string | string[]> | string | string[]

export type TransformFn<T> = (arg: {
  template: string
  data: any
  config: T
}) => string | Promise<string>

export type Action = ActionFunction

export type DefineActionFunciton<Conifg extends object> = (
  config: Conifg & ActionConfig,
) => ActionFunction

export type Template =
  | { templateString: string; templateFile?: never }
  | { templateString?: never; templateFile: string }
export type Templates =
  | { templates: string[]; files?: never }
  | { templates?: never; files: string[] }
