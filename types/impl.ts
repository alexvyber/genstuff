import { readonly } from "./readonly-proxy"

type SetterScope =
  | "generator"
  | "helper"
  | "partial"
  | "message"
  | "action"
  | "defaultInclude"
  | "destinationBasePath"
  | "configFile"

type Some = {
  [_ in SetterScope]: { name: string }
}
type Setter<T extends SetterScope> = Some[T]

type Other = {
  [_ in SetterScope]: () => any
}
type GetReturnType<T extends SetterScope> = Other[T]

class Genstuff {
  #generators: Record<string, any> = {}
  #partials: Record<string, string> = {}
  #helpers: Record<string, any> = {}
  #actions: Record<string, (...args: any[]) => any> = {}

  readonly generators = readonly(this.#generators)
  readonly partials = readonly(this.#partials)
  readonly helpers = readonly(this.#helpers)
  readonly actions = readonly(this.#actions)

  #mapping = {
    generator: this.#generators,
  }

  welcomeMessage = ""

  set<T extends SetterScope>(scope: T, config: Setter<T>): Genstuff {
    const target = this.#mapping[scope]
    Object.assign(target, { [config.name]: () => console.log("some") })
    return this
  }

  get<T extends SetterScope>(scope: T): GetReturnType<T> {
    return undefined as any
  }

  list<T extends SetterScope>(scope: T): T extends "generator" ? { name: string }[] : string[] {
    return undefined as any
  }
}

const gen = new Genstuff()

console.log("🚀 ~ gen:", gen)

gen.set("generator", { name: "some" })
console.log("🚀 ~ gen:", gen)
gen.set("generator", { name: "more" })

// gen.generators["other"] = () => {}
console.log("🚀 ~ gen:", gen)

// gen.set("helper", { name: "asdfa" }).set("helper", { name: "other" })
