import type { ActionFunction, AiPromptFunction, Template } from "../types/action.types"

type AiActionConfig<T> = {
  path: string
  prompt?: string | string[] | AiPromptFunction<T>
  provider: "openai" | "google"
  model: "o3" | "gemeni-2.5"
} & Template

const ai = <T>(config: AiActionConfig<T>): ActionFunction<T> => {
  return (args) => {
    args
  }
}

export { ai }
