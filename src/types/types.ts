import type { RunGeneratorActionFn } from "../core/runner.js"

export type Context = { [key: string]: any }

export type GeneratorType = {
  name: string
  description?: string
  actions: RunGeneratorActionFn[]
}

export type Config = {
  generators: GeneratorType[]
}
