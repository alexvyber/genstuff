import type { Context } from "./types.ts"

export interface ActionConfig {
  name?: string
  force?: boolean
  context?: Context
  skip?: (...args: unknown[]) => unknown
}

// deno-lint-ignore ban-types
export type FunctionArgs<Answers = {}, Ctx = Context> = {
  answers: Answers
  context: Ctx
}

// deno-lint-ignore ban-types
export type ActionFunction<Answers = {}> = (
  arg: FunctionArgs<Answers>,
) => Promise<void> | void

// deno-lint-ignore ban-types
export type AiPromptFunction<Answers = {}> = (
  arg: FunctionArgs<Answers>,
) => Promise<string | string[]> | string | string[]

export type TransformFn<T> = (arg: {
  template: string
  data: unknown
  config: T
}) => string | Promise<string>

export type Action = ActionFunction

export type DefineActionFunciton<Conifg extends object> = (
  config: Conifg & ActionConfig,
) => ActionFunction

// export type Template = { templatePath: string }
// | { templateString: string; templatePath?: never }
// | { templateString?: never; templatePath: string }
// export type Templates =
//   | { templates: string[]; files?: never }
//   | { templates?: never; files: string[] }
