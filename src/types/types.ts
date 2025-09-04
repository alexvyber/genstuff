import type { RunGeneratorActionFn } from "../core/runner.js"

export type Context = { [key: string]: any }

export type GeneratorType = {
  name: string
  description?: string
  actions: RunGeneratorActionFn[]
  initContext?: () => Record<string, any>
}

export type Config = {
  generators: GeneratorType[]
  initContext?: () => Record<string, any>
}
