import type { ActionFunction, DefineActionFunciton } from "../types/action.types"
import type { Prompts } from "../types/prompt.types"
import type { Genstuff } from "../core/genstuff"
import type { Pretty, UnionToIntersection } from "../types/types"

type InferPromptOutputType<T extends { name: string; type: Prompts["type"] }> = {
  [Key in keyof T as Key extends "name" ? T[Key] : never]: T["type"] extends "input"
    ? string
    : T["type"] extends "checkbox"
      ? boolean
      : any
}

interface PromptAction<T> extends ActionFunction<T> {
  $inferOutputType: T
}

export function prompts<const T extends Prompts[]>(
  arr: T,
): PromptAction<Pretty<UnionToIntersection<InferPromptOutputType<T[number]>>>> {
  return {} as any
}

export type InferPromptsOutput<T> = T extends { $inferOutputType: infer R } ? R : never

export type InferPromptsOutputs<T extends { $inferOutputType: any }[], Acc = {}> = T extends [
  infer First,
  ...infer Rest extends { $inferOutputType: any }[],
]
  ? InferPromptsOutputs<Rest, Acc & InferPromptsOutput<First>>
  : Pretty<Acc>
