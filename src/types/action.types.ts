import type { Genstuff } from "../core/genstuff"

export type ActionType = ActionFunction

export interface ActionConfig {
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

export type ActionFunction = (args: {
  gen: Genstuff
}) => Promise<void> | void

export interface CustomActionConfig<TypeString extends string> extends Omit<ActionConfig, "type"> {
  type: TypeString extends "addMany" | "modify" | "append" | "config" | "add" ? never : TypeString
  [key: string]: any
}

export type TransformFn<T> = (args: { template: string; data: any; config: T }) =>
  | string
  | Promise<string>

export type Action = ActionFunction

export type DefineActionFunciton<Conifg extends object> = (
  config: Conifg & ActionConfig,
) => ActionFunction

export type Template = { template: string; file?: never } | { template?: never; file: string }
export type Templates =
  | { templates: string[]; files?: never }
  | { templates?: never; files: string[] }
