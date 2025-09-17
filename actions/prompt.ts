// deno-lint-ignore-file no-explicit-any

import enquirer from "enquirer"
import type { Action } from "../types.ts"
import { EventEmitter } from "node:events"

export function prompt( questions: PromptOptions | PromptOptions[] ): Action {
  return async function executePrompts( params ) {
    const answers = await enquirer.prompt( questions )

    if ( !params.context.answers ) {
      Object.assign( params.context, { answers: {} } )
    }

    for ( const [ key, value ] of Object.entries( answers ) ) {
      Object.assign( params.context.answers, { [key]: value } )
    }
  }
}

// NOTE: Stupid enquirer doesn't export types at all!!!
//       So, I, being stupid dev, just copied them to get better inference

type PromptTypes =
  | "autocomplete"
  | "editable"
  | "form"
  | "multiselect"
  | "select"
  | "survey"
  | "list"
  | "scale"
  | "confirm"
  | "input"
  | "invisible"
  | "list"
  | "password"
  | "text"
  | "numeral"
  | "snippet"
  | "sort"

interface BasePromptOptions {
  name: string | (() => string)
  type: PromptTypes | (() => PromptTypes)
  message: string | (() => string) | (() => Promise<string>)
  prefix?: string
  initial?: any
  required?: boolean
  enabled?: boolean | string
  disabled?: boolean | string
  format?( value: string ): string | Promise<string>
  result?( value: string ): string | Promise<string>
  skip?: (( state: object ) => boolean | Promise<boolean>) | boolean
  validate?( value: string ): boolean | string | Promise<boolean | string>
  onSubmit?( name: string, value: any, prompt: BasePrompt ): boolean | Promise<boolean>
  onCancel?( name: string, value: any, prompt: BasePrompt ): boolean | Promise<boolean>
  stdin?: NodeJS.ReadStream
  stdout?: NodeJS.WriteStream
}

interface Choice {
  name: string
  message?: string
  value?: unknown
  hint?: string
  role?: string
  enabled?: boolean
  disabled?: boolean | string
}

interface ArrayPromptOptions extends BasePromptOptions {
  type:
    | "autocomplete"
    | "editable"
    | "form"
    | "multiselect"
    | "select"
    | "survey"
    | "list"
    | "scale"
  choices: (string | Choice)[]
  maxChoices?: number
  multiple?: boolean
  initial?: number
  delay?: number
  separator?: boolean
  sort?: boolean
  linebreak?: boolean
  edgeLength?: number
  align?: "left" | "right"
  scroll?: boolean
}

interface BooleanPromptOptions extends BasePromptOptions {
  type: "confirm"
  initial?: boolean
}

interface StringPromptOptions extends BasePromptOptions {
  type: "input" | "invisible" | "list" | "password" | "text"
  initial?: string
  multiline?: boolean
}

interface NumberPromptOptions extends BasePromptOptions {
  type: "numeral"
  min?: number
  max?: number
  delay?: number
  float?: boolean
  round?: boolean
  major?: number
  minor?: number
  initial?: number
}

interface SnippetPromptOptions extends BasePromptOptions {
  type: "snippet"
  newline?: string
  template?: string
}

interface SortPromptOptions extends BasePromptOptions {
  type: "sort"
  hint?: string
  drag?: boolean
  numbered?: boolean
}

type PromptOptions =
  | BasePromptOptions
  | ArrayPromptOptions
  | BooleanPromptOptions
  | StringPromptOptions
  | NumberPromptOptions
  | SnippetPromptOptions
  | SortPromptOptions

declare class BasePrompt extends EventEmitter {
  constructor( options?: PromptOptions )
  render(): void
  run(): Promise<any>
}
