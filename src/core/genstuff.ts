import { get, set } from "es-toolkit/compat"
import { readonly } from "../lib/readonly-proxy.js"
import type { GeneratorType } from "../types/types.js"
import type { ActionFunction } from "../types/action.types.js"
import handlebars from "handlebars"
import { helpers } from "./default-helpers.js"

type SetterScope = "generator" | "helper" | "partial" | "action"
type SetOptions = { override?: boolean }
type Name = { name: string }

export type HelperFn = (str: string) => string

type Mapping = {
  generator: GeneratorType
  helper: Name & { target: HelperFn }
  partial: Name & { target: string }
  action: Name & { target: ActionFunction }
}

type MappingLol = {
  generator: GeneratorType
  helper: HelperFn
  partial: string
  action: ActionFunction
}

type GetSetterType<Key extends SetterScope> = MappingLol[Key]

type Setter<T extends SetterScope> = { target: GetSetterType<T>; name: string }

type GetReturnType<T extends SetterScope> = MappingLol[T]

export class Genstuff {
  #generators: Record<string, any> = {}
  #partials: Record<string, string> = {}
  #helpers: Record<string, any> = helpers
  #actions: Record<string, (...args: any[]) => any> = {}

  readonly generators = readonly(this.#generators)
  readonly partials = readonly(this.#partials)
  readonly helpers = readonly(this.#helpers)
  readonly actions = readonly(this.#actions)

  #mapping = {
    generator: this.#generators,
    partial: this.#partials,
    helper: this.#helpers,
    action: this.#actions,
  }

  welcomeMessage = "Genstuff welcome message"

  getWelcomeMessage() {
    return this.welcomeMessage
  }

  get<T extends SetterScope>(scope: T, name: string): GetReturnType<T> {
    var target = get(this.#mapping, scope)

    if (!target) {
      throw new Error("!")
    }

    return get(target, name)
  }

  list<T extends `${SetterScope}s`, O extends boolean = false>(
    scope: T,
    options?: { full?: O },
  ): O extends true ? Mapping[T extends `${infer S}s` ? S : T][] : string[] {
    var scope_ = scope.slice(0, scope.length - 1)
    var target = get(this.#mapping, scope_)

    if (!target) throw new Error("No mapping")

    if (!options?.full) {
      return Object.keys(target) as any
    }

    switch (scope) {
      case "actions":
        return Object.entries(target).map(([name, action]) => ({
          name,
          action,
        })) as any

      case "helpers":
        return Object.entries(target).map(([name, helper]) => ({
          name,
          helper,
        })) as any

      case "partials":
        return Object.entries(target).map(([name, partial]) => ({
          name,
          partial,
        })) as any

      case "generators":
        return Object.entries(target).map(([name, value]) => ({
          ...((value as any).target as any),
          name,
        })) as any

      default:
        throw new Error("can't find the scope")
    }
  }

  getGenstuffFilePath(): string {
    return process.cwd()
  }

  setGenerator(name: string, generator: GeneratorType, options?: SetOptions) {
    return this.set("generator", { target: generator, name }, options)
  }

  setAction(name: string, action: ActionFunction, options?: SetOptions) {
    return this.set("action", { target: action, name }, options)
  }

  setPartial(name: string, partial: string, options?: SetOptions) {
    return this.set("partial", { target: partial, name }, options)
  }

  setHelper(name: string, helper: HelperFn, options?: SetOptions) {
    return this.set("helper", { target: helper, name }, options)
  }

  renderString(params: {
    template: string
    data: Record<string, any>
  }): string {
    for (var [name, helper] of Object.entries(this.#helpers)) {
      handlebars.registerHelper(name, helper)
    }

    for (var [name, partial] of Object.entries(this.#partials)) {
      handlebars.registerPartial(name, partial)
    }

    var compiled = handlebars.compile(params.template)

    return compiled(params.data)
  }

  private set<T extends SetterScope>(
    scope: T,
    config: Setter<T>,
    options?: SetOptions,
  ): Genstuff {
    if (!config.name) throw new Error("Name must be non-empty string")

    var target = get(this.#mapping, scope)
    if (!target) throw new Error("No mapping")

    if (config.name in target && !options?.override) {
      throw new Error("Can't override")
    }

    set(target, config.name, config.target)

    return this
  }
}
