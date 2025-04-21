import type inquirer from "inquirer"
import type { Answers } from "inquirer"
import type { Genstuff } from "../core/genstuff"
import type { ActionType, ActionConfig, CustomActionFunction, Action } from "./action.types"
import type { Prompts } from "./prompt.types"

type Inquirer = typeof inquirer

// export interface IncludeDefinitionConfig {
//   generators?: boolean
//   helpers?: boolean
//   partials?: boolean
//   actionTypes?: boolean
// }
// export type IncludeDefinition = boolean | string[] | IncludeDefinitionConfig
// export interface GenstuffAPI {
//   setGenerator(config: GenstuffGeneratorConfig): GenstuffAPI
// }

// export interface GenstuffGeneratorConfig<Name extends string = never> {
//   name: Name
//   description?: string
//   prompts?: Prompts
//   actions?: Actions
// }

// export interface GenstuffGenerator<Name extends string, A extends Record<string, any> = any>
//   extends GenstuffGeneratorConfig {
//   gen: Name

//   runPrompts: (bypassArray?: string[]) => Promise<any>

//   runValidation: (answers: Record<string, string>) => A

//   runActions: (args: { answers: A; hooks?: GenstuffActionHooks }) => Promise<{
//     changes: GenstuffActionHooksChanges[]
//     failures: GenstuffActionHooksFailures[]
//   }>
// }

// export type DynamicActionsFunction = (data?: Answers) => ActionType[]
// export type Actions = DynamicActionsFunction | ActionType[]

// export interface CustomActionConfig<TypeString extends string> extends Omit<ActionConfig, "type"> {
//   type: TypeString extends "addMany" | "modify" | "append" ? never : TypeString
//   [key: string]: any
// }

// export interface GenstuffConfig {
//   force: boolean
//   destBasePath: string | undefined
// }

// declare function Genstuff(params?: {
//   filepath?: string
//   config?: GenstuffConfig
// }): Promise<GenstuffAPI>
// export { Genstuff }

// type ValidationFn

// type PromptConfig = {
//   type: string
//   name: string
//   message?: string
//   parse?: (value: string) => any
//   help?: string
//   choices?: { name: string; value: string }[]
// }
// & (
//   | { validate?: (value: R) => undefined | void | string; schema?: never }
//   | { schema?: any; validate?: never }
// )

// type Hooks<T1, T2> = [(value: unknown) => T1, (value: T1) => T2]

// declare function hooks<T1, T2, T3, T4, T5, T6, T7, T8, T9>(
//   args: SomeArgs,
// ): [
//   (value: unknown) => T1,
//   (value: T1) => T2,
//   (value: T2) => T3,
//   (value: T3) => T4,
//   (value: T4) => T5,
//   (value: T5) => T6,
//   (value: T6) => T7,
//   (value: T7) => T8,
//   (value: T8) => T9,
// ]

// type PromptConfig = {
//   type: string
//   name: string
//   message?: string
//   transorm?: (value: string) => any
// } & (
//   | { hooks?: ((value: unknown) => undefined | void | string)[]; schema?: never }
//   | { schema?: any; hooks?: never }
// )
// type GetPrompt = <R>(config: PromptParams<R>) => PromptConfig

export type Context = { readonly [key: string]: any }

export type GeneratorType<A extends Record<string, any> = any> = {
  name: string
  prompts: Prompts[]
  description?: string
  parse?: (answers: Record<string, string>) => A
  actions: (args: { answers: A; gen: Genstuff; ctx?: Context }) =>
    | Promise<Action<A>[]>
    | Action<A>[]
}

export type Config = {
  generators: GeneratorType[]
}

// export type GenstuffConfig = Config | ((genstuff: Genstuff) => Config)
// export var getPrompt: GetPrompt = (config) => {
//   return { name: config.name, type: "asdf" }
// }

// type SomeArgs = { genstuff: any; context: any }

// type GetAction = <R>(config: any) => Action

// export type GenAnswers = Record<string, any>

export type TODO_RenameOptions = {
  data: string | object
  config?: { force?: boolean; skipIfExists?: boolean; templateFile?: string }
  gen: Genstuff
}
