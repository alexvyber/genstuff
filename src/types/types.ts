import type { Genstuff } from "../core/genstuff"
import type { ActionFunction, Action } from "./action.types"

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

// export type DynamicActionsFunction = (data?: Answers) => ActionFunction[]
// export type Actions = DynamicActionsFunction | ActionFunction[]

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
// type ActionsSome<Actions extends Action[]> = Actions

// export type GenstuffConfig = Config | ((genstuff: Genstuff) => Config)
// export var getPrompt: GetPrompt = (config) => {
//   return { name: config.name, type: "asdf" }
// }
// type SomeArgs = { genstuff: any; context: any }
// type GetAction = <R>(config: any) => Action
// export type GenAnswers = Record<string, any>

// type Fn<T extends (...args: any) => any, A> = (args: {
//   gen: Genstuff
//   answers: AnswersRecord
// }) => any
// //  R extends "prompts"
// // ? { action: "prompts"; answers: A }
// // : R extends "write"
// //   ? { action: "write" }
// //   : never

// // type Fnn<T extends (...args: any[]) => any, Acc> =(args: {
// //   answers: Acc
// // }) => ReturnType<T>

// type Fnn<T extends (...args: any) => any> = (
//   args: string,
// ) => ReturnType<T> extends { action: "prompts" } ? ReturnType<T> : never

// T extends (args: infer Args )=> infer Return  ?
// never
// // (args: Acc) => any
// : never

// type Kik<T extends readonly Fn[],
//  Acc extends AnswersRecord = NeverRecord
//  > = T extends [infer First, ...infer Rest]
//   ? First
//   //  Rest extends Fn[]
//     // ? [Fnn<First, { some: string }>, ...Kik<Rest,  { other: number }>]
//     // :  [Fnn<First, { some: string }>  ]
//   : T

// type Kik<T extends readonly ((...args: any) => any)[]> = [...T] extends [
//   infer First extends (...args: any) => any,
//   ...infer Rest extends ((...args: any) => any)[],
// ]
//   ? [Fn<First>, ...Kik<Rest>]
//   : T

// type Kik<
//   T extends readonly ((...args: any) => { action: "prompts" | "write" })[],
//   Acc extends AnswersRecord = {},
// > = [...T] extends [infer First, ...infer Rest]
//   ? First extends (args: any) => any
//     ? //
//       Rest extends ((...args: any) => any)[]
//       ? First extends (args: any) => any
//         ? [(args: { res: Acc }) => ReturnType<First>, ...Kik<Rest, Acc & InferAnswers<First>>]
//         : [First, ...Kik<Rest, Acc>]
//       : First extends (args: any) => any
//         ? [(args: { res: Acc }) => ReturnType<First>]
//         : T
//     : //
//       Rest extends ((...args: any) => any)[]
//       ? Kik<Rest, Acc>
//       : T
//   : T

// [...T] extends [infer First, ...infer Rest]
//   ? [
//       (params: { gen?: Genstuff; answers: Acc }) => ReturnType<First>,
//       ...Kik<Rest, Acc & InferAnswers<First>>,
//     ]
//   : T

// type Res = Kik<[(params) => { action: "prompts" }, (params) => { action: "write" }]>

// type Pop<T extends readonly ((...args: any) => any)[]> = [(arg: { s: "s"}) => ReturnType<T[number]>]

// type Func = (...args: any[]) => any
// type AdditionalParams<Fn1 extends Func, Fn2 extends Func> = ReturnType<Fn1> extends {
//   answers: infer Answers
// }
//   ? (args: Pretty<Parameters<Fn2>[0] & { answers: Answers }>) => ReturnType<Fn2>
//   : Fn2
// type fn = (args: unknown) => any

// type ExtendParams<Fn extends Func, Params> = (
//   arg: Parameters<Fn>[0] & { answers: Params },
// ) => ReturnType<Fn>
// type PPP = { action: "prompts" | "write" }

// function some<R1 extends PPP, R2 extends PPP, R3 extends PPP, R4 extends PPP>(
//   fn1: (arg: any) => R1,
// ): any

// function some<R1 extends PPP, R2 extends PPP, R3 extends PPP, R4 extends PPP>(
//   fn1: (arg: any) => R1,
//   fn2: (arg: Pretty<InferAnswersObj<R1>>) => R2,
// ): any

// function some<R1 extends PPP, R2 extends PPP, R3 extends PPP, R4 extends PPP>(
//   fn1: (arg: any) => R1,
//   fn2: (arg: Pretty<InferAnswersObj<R1>>) => R2,
//   fn3: (arg: Pretty<InferAnswersObj<R1> & InferAnswersObj<R2>>) => R3,
// ): any
// function some<R1 extends PPP, R2 extends PPP, R3 extends PPP, R4 extends PPP>(
//   fn1: (arg: any) => R1,
//   fn2: (arg: Pretty<InferAnswersObj<R1>>) => R2,
//   fn3: (arg: Pretty<InferAnswersObj<R1> & InferAnswersObj<R2>>) => R3,
//   fn4: (arg: Pretty<InferAnswersObj<R1> & InferAnswersObj<R2> & InferAnswersObj<R3>>) => R4,
// ): any

// function some<
//   R1 extends PPP,
//   R2 extends PPP,
//   R3 extends PPP,
//   R4 extends PPP,
//   R5 extends PPP,
//   R6 extends PPP,
//   R7 extends PPP,
//   R8 extends PPP,
//   R9 extends PPP,
//   R10 extends PPP,
//   R11 extends PPP,
//   R12 extends PPP,
//   R13 extends PPP,
//   R14 extends PPP,
//   R15 extends PPP,
// >(
//   fn1: (arg: any) => R1,
//   fn2: (arg: Pretty<InferAnswersObj<R1>>) => R2,
//   fn3: (arg: Pretty<InferAnswersObj<R1> & InferAnswersObj<R2>>) => R3,
//   fn4: (arg: Pretty<InferAnswersObj<R1> & InferAnswersObj<R2> & InferAnswersObj<R3>>) => R4,

//   fn15: (
//     arg: Pretty<
//       InferAnswersObj<R1> &
//         InferAnswersObj<R2> &
//         InferAnswersObj<R3> &
//         InferAnswersObj<R4> &
//         InferAnswersObj<R5> &
//         InferAnswersObj<R6> &
//         InferAnswersObj<R7> &
//         InferAnswersObj<R8> &
//         InferAnswersObj<R9> &
//         InferAnswersObj<R10> &
//         InferAnswersObj<R11> &
//         InferAnswersObj<R12> &
//         InferAnswersObj<R13> &
//         InferAnswersObj<R14> &
//         InferAnswersObj<R15>
//     >,
//   ) => R15,
// ): any

// function some(...args: any[]): any {}

// function some<const T extends any[], Acc extends AnswersRecord=NeverRecord>(arr:  Kik<T, Acc>):Kik<T, Acc>{
//   for (const item of arr) {
//     console.log("🚀 ~ item:", item)
//   }
//   return {} as any
// }

// const res = some(
//   (args) => ({ action: "prompts", answers: { some: "some" } }),
//   (args) => ({ action: "write" }),
//   // (args) => ({ action: "prompts", answers: { kuk: "chpok" } }),
//   (args) => ({ action: "prompts", answers: { other: "other" } }),
//   (args) => ({ action: "write" }),

//   // (args) => ({ action: "write" }),
//   // (args) => ({ action: "write" }),
//   // (args) => ({ action: "write" }),
// )

// res[1]({ answers: { some: "asdf" } })
// res[2]({ answers: { some: "some", kuk: "asdf" } })
// res[3]({ answers: { some: "some", kuk: "adsf", other: "asdf" } })
// // res[4]({ answers: { some: "some", Kik: "asdf",  } })

// function pop() {
//   return { answers: { some: "asdf" } }
// }

// type InferAnswersObj<Obj extends object> = Obj extends {
//   answers: infer Answers
//   action: "prompts"
// }
//   ? { answers: Answers }
//   : {}

// type Kik<T extends ((arg: unknown) => unknown)[], Acc> = T extends [
//   infer First extends (arg: unknown) => unknown,
//   ...infer Rest extends ((arg: unknown) => unknown)[],
// ]
//   ? [
//       (params: { gen?: Genstuff; answers: Acc }) => ReturnType<First>,
//       ...Kik<Rest, Pretty<Acc & InferAnswers<First>>>,
//     ]
//   : T
// type Pop<Actions, Acc> = Actions extends [infer First, ...infer Rest]
//   ? Pop<Rest, Acc & InferAnswers<First>>
//   : Acc

export type Context = { [key: string]: any }

export type GeneratorType<A extends Record<string, any> = any> = {
  name: string
  description?: string
  actions: Action[]
}

export type Config = {
  generators: GeneratorType[]
}

export type TODO_RenameOptions = {
  data: string | object
  config?: { force?: boolean; skipIfExists?: boolean; templateFile?: string }
  gen: Genstuff
}

export type AnswersRecord = Record<string, string | boolean | number>
export type NeverRecord = Record<string, never>
type InferAnswers<AnswerFn> = AnswerFn extends (...args: any[]) => {
  answers: infer Answers
}
  ? Answers
  : never

export function actions<Answers extends AnswersRecord = {}>(arg: ActionFunction<Answers>[]): [] {
  return {} as any
}

export type Pretty<T> = {
  -readonly [Key in keyof T as T[Key] extends never ? never : Key]: T[Key] extends object
    ? Pretty<T[Key]>
    : T[Key]
} & {}

export type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (
  x: infer I,
) => void
  ? I
  : never
