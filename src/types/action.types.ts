import type { Context } from "./types"
import type { Genstuff } from "../core/genstuff"

export type ActionType =
  // | string
  // | AddActionConfig
  // | AddManyActionConfig
  // | ModifyActionConfig
  // | AppendActionConfig

  ActionConfig | CustomActionFunction

//   type	String		the type of action (add, modify, addMany, etc)
// force	Boolean	false	performs the action forcefully (means different things depending on the action)
// data	Object / Function	{}	specifies data that should be mixed with user prompt answers when running this action
// abortOnFail	Boolean	true	if this action fails for any reason abort all future actions
// skip	Function		an optional function that specifies if the action should run

export interface ActionConfig {
  type: string
  name?: string
  force?: boolean
  context?: object
  abortOnFail?: boolean
  skip?: (...args: any[]) => any
}

interface AddActionConfigBase extends ActionConfig {
  type: "add"
  path: string
  skipIfExists?: boolean
  transform?: TransformFn<AddActionConfig>
}
export type AddActionConfig = AddActionConfigBase & Template

export interface AddManyActionConfig
  extends Pick<
    AddActionConfig,
    Exclude<keyof AddActionConfig, "type" | "templateFile" | "template" | "transform">
  > {
  type: "addMany"
  destination: string
  base: string
  templateFiles: string | string[]
  stripExtensions?: string[]
  globOptions: any
  verbose?: boolean
  transform?: TransformFn<AddManyActionConfig>
}

interface ModifyActionConfigBase extends ActionConfig {
  type: "modify"
  path: string
  pattern: string | RegExp
  transform?: TransformFn<ModifyActionConfig>
}
export type ModifyActionConfig = ModifyActionConfigBase & Template

interface AppendActionConfigBase extends ActionConfig {
  type: "append"
  path: string
  pattern: string | RegExp
  unique: boolean
  separator: string
}
export type AppendActionConfig = AppendActionConfigBase & Template

type ActionReturnType =
  | { data: unknown; error?: null }
  | { error: Error; data?: null }
  | undefined
  | string

export type CustomActionFunction<Answers extends Record<string, any> = Record<string, any>> =
  (args: {
    answers: Answers
    config: CustomActionConfig<string>
    gen: Genstuff
  }) => Promise<ActionReturnType> | ActionReturnType

export interface CustomActionConfig<TypeString extends string> extends Omit<ActionConfig, "type"> {
  type: TypeString extends "addMany" | "modify" | "append" ? never : TypeString
  [key: string]: any
}

export type Template =
  | { template?: never; templateFile: string }
  | { template: string; templateFile?: never }

export type TransformFn<T> = (args: { template: string; data: any; config: T }) =>
  | string
  | Promise<string>

export type Action<A extends Record<string, any> = any> =
  | string
  | { type: "config"; config: string; abortOnFail?: boolean; force?: boolean; path?: string }
  // | { type: "add"; path: string; templateFile: string; abortOnFail?: boolean; force?: boolean }
  // | ((args: SomeArgs) => Action | void)
  | CustomActionFunction<A>
