import type { RunGeneratorActionFn } from "../core/runner.ts"

export type Context = { [key: string]: unknown }

export type GeneratorType = {
  name: string
  description?: string
  actions: RunGeneratorActionFn[]
  initContext?: () => Record<string, unknown>
}

export type Config = {
  generators: GeneratorType[]
  initContext?: () => Record<string, unknown>
}
