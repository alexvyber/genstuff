import inquirer, { Answers, Question } from "inquirer"

type Inquirer = typeof inquirer

export interface IncludeDefinitionConfig {
  generators?: boolean
  helpers?: boolean
  partials?: boolean
  actionTypes?: boolean
}

export type IncludeDefinition = boolean | string[] | IncludeDefinitionConfig

export interface GenstuffAPI {
  setGenerator(config: GenstuffGeneratorConfig): GenstuffAPI
}

interface GenstuffActionHooksFailures {
  type: string
  path: string
  error: string
  message: string
}

interface GenstuffActionHooksChanges {
  type: string
  path: string
}

interface GenstuffActionHooks {
  onComment?: (msg: string) => void
  onSuccess?: (change: GenstuffActionHooksChanges) => void
  onFailure?: (failure: GenstuffActionHooksFailures) => void
}

export interface GenstuffGeneratorConfig<Name extends string = never> {
  name: Name
  description?: string
  prompts?: Prompts
  actions?: Actions
}

export interface GenstuffGenerator<Name extends string, A extends Record<string, any> = any>
  extends GenstuffGeneratorConfig {
  gen: Name

  runPrompts: (bypassArr?: string[]) => Promise<any>

  runValidation: (answers: Record<string, string>) => A

  runActions: (args: { answers: A; hooks?: GenstuffActionHooks }) => Promise<{
    changes: GenstuffActionHooksChanges[]
    failures: GenstuffActionHooksFailures[]
  }>
}

export type PromptQuestion = Question
// | CheckboxQuestion
// | ListQuestion
// | ExpandQuestion
// | ConfirmQuestion
// | EditorQuestion
// | RawListQuestion
// | PasswordQuestion
// | NumberQuestion
// | InputQuestion

export type DynamicPromptsFunction = (inquirer: Inquirer) => Promise<Answers>
export type DynamicActionsFunction = (data?: Answers) => ActionType[]

export type Prompts = DynamicPromptsFunction | PromptQuestion[]
export type Actions = DynamicActionsFunction | ActionType[]

type Template =
  | { template?: never; templateFile: string }
  | { template: string; templateFile?: never }

export interface CustomActionConfig<TypeString extends string> extends Omit<ActionConfig, "type"> {
  type: TypeString extends "addMany" | "modify" | "append" ? never : TypeString
  [key: string]: any
}

// --

export type ActionType =
  | string
  | ActionConfig
  | AddActionConfig
  | AddManyActionConfig
  | ModifyActionConfig
  | AppendActionConfig
  | CustomActionFunction

export interface ActionConfig {
  type: string
  force?: boolean
  data?: object
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

export type CustomActionFunction = (args: {
  answers: Answers
  config: CustomActionConfig<string>
  genstuffApi: GenstuffAPI
}) => Promise<string> | string

// --

type TransformFn<T> = (args: { template: string; data: any; config: T }) => string | Promise<string>

// export interface GenstuffConfig {
//   force: boolean
//   destBasePath: string | undefined
// }

declare function Genstuff(params?: {
  filepath?: string
  config?: GenstuffConfig
}): Promise<GenstuffAPI>

export { Genstuff }

// type ValidationFn

type PromptConfig = {
  type: string
  name: string
  message?: string
  parse?: (value: string) => any
}
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

type Config<V = any> = {
  generators: {
    name: string
    description?: string
    prompts?:
      | PromptConfig[]
      | { validation: "schema" | ((answers: Record<string, string>) => V); prompts: PromptConfig[] }
    actions?: (args: { answers: V }) => Action[]
  }[]
}

export function buildCofing<V>(config: Config<V>) {
  return {} as any
}

export type GenstuffConfig = Config | ((genstuff: GenstuffAPI) => Config)

// export const getPrompt: GetPrompt = (config) => {
//   return { name: config.name, type: "asdf" }
// }

type SomeArgs = { genstuff: any; context: any }

export type Action =
  | string
  | { type: "add"; path: string; templateFile: string; abortOnFail: boolean }
  | ((args: SomeArgs) => Action | void)

type GetAction = <R>(config: any) => Action

export const getAction: GetAction = (config): any => {
  return {}
}
