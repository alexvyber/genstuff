import { check } from "valibot"
import type { ActionFunction, DefineActionFunciton } from "../types/action.types"
import type { Prompts } from "../types/prompt.types"
import type { Genstuff } from "../core/genstuff"


type InferPromptOutputType<T extends { name: string; type: Prompts["type"] }> = {
  [Key in keyof T as Key extends "name" ? T[Key] : never]: T["type"] extends "input"
    ? string
    : T["type"] extends "checkbox"
      ? boolean
      : any
}

type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (x: infer I) => void
  ? I
  : never

interface PromptAction<T> {
  (args: { gen: Genstuff }): void
  $inferOutputType: T
}

export function prompts<const T extends Prompts[]>(
  arr: T,
): PromptAction<Pretty<UnionToIntersection<InferPromptOutputType<T[number]>>>> {
  return {} as any
}


type Pretty<T> = { -readonly [Key in keyof T as Key]: T[Key] } & {}


const res = prompts([
  { name: "one", type: "input", message: "adsfadsf" },
  { name: "two", type: "checkbox", message: "adsfadsf" },
])

export type InferPromptsOutput<T extends { $inferOutputType: any }> = T extends {
  $inferOutputType: infer R
}
  ? R
  : never

type Propmts = InferPromptsOutput<typeof res>

function some<const T extends ((...args: any[]) => any)[]>(args: T): T[number] {
  return {} as any
}

// const res = some([() => ({ some: 1 }), () => ({ other: "adsf" })])
