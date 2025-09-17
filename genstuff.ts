// TODO: clean up

// deno-lint-ignore-file no-explicit-any

import { get, set } from "@es-toolkit/es-toolkit/compat"
import handlebars from "handlebars"

import type { GeneratorConfig, HelperFn } from "./types.ts"
import { readonly, textHelpers } from "./lib.ts"

type SetterScope = "generator" | "helper" | "partial" //| "action"
type SetOptions = { override?: boolean }
type Name = { name: string }

type MappingScope = {
  generator: GeneratorConfig
  helper: Name & { target: HelperFn }
  partial: Name & { target: string }
  // action: Name & { target: ActionFunction }
}

type Mapping = {
  generator: GeneratorConfig
  helper: HelperFn
  partial: string
  // action: ActionFunction
}

type GetSetterType<Key extends SetterScope> = Mapping[Key]

type Setter<T extends SetterScope> = { target: GetSetterType<T>; name: string }

type GetReturnType<T extends SetterScope> = Mapping[T]

export class Genstuff {
  #generators: Record<string, any> = {}

  #partials: Record<string, string> = {}

  #helpers: Record<string, any> = textHelpers

  // #actions: Record<string, ( ...args: any[] ) => any> = {}

  readonly generators: Record<string, any> = readonly( this.#generators )

  readonly partials: Record<string, string> = readonly( this.#partials )

  readonly helpers: Record<string, any> = readonly( this.#helpers )

  // readonly actions: Record<string, ( ...args: any[] ) => any> = readonly(
  //   this.#actions,
  // )

  #mapping: {
    generator: Record<string, any>

    partial: Record<string, string>

    helper: Record<string, any>
    // action: Record<string, ( ...args: any[] ) => any>
  } = {
    generator: this.#generators,
    partial: this.#partials,
    helper: this.#helpers,
    // action: this.#actions,
  }

  welcomeMessage: string = "Genstuff welcome message"

  getWelcomeMessage(): string {
    return this.welcomeMessage
  }

  get<T extends SetterScope>( scope: T, name: string ): GetReturnType<T> {
    const target = get( this.#mapping, scope )

    if ( !target ) {
      throw new Error( "!" )
    }

    return get( target, name )
  }

  list<T extends `${SetterScope}s`, O extends boolean = false>(
    scope: T,
    options?: { full?: O },
  ): O extends true ? MappingScope[T extends `${infer S}s` ? S : T][]
    : string[] {
    const target = get( this.#mapping, scope.slice( 0, scope.length - 1 ) )

    if ( !target ) {
      throw new Error( "No mapping" )
    }

    if ( !options?.full ) {
      return Object.keys( target ) as any
    }

    switch ( scope ) {
      // case "actions":
      //   return Object.entries( target ).map( ( [ name, action ] ) => ( { name, action } ) ) as any

      case "helpers":
        return Object.entries( target ).map( ( [ name, helper ] ) => ( { name, helper } ) ) as any

      case "partials":
        return Object.entries( target ).map( ( [ name, partial ] ) => ( { name, partial } ) ) as any

      case "generators":
        return Object.entries( target ).map( ( [ name, value ] ) => ( { ...( value as any ).target, name } ) )

      default:
        throw new Error( "can't find the scope" )
    }
  }

  getGenstuffFilePath(): string {
    return Deno.cwd()
  }

  setGenerator(
    name: string,
    generator: GeneratorConfig,
    options?: SetOptions,
  ): Genstuff {
    return this.set( "generator", { target: generator, name }, options )
  }

  // setAction(
  //   name: string,
  //   action: ActionFunction,
  //   options?: SetOptions,
  // ): Genstuff {
  //   return this.set( "action", { target: action, name }, options )
  // }

  setPartial( name: string, partial: string, options?: SetOptions ): Genstuff {
    return this.set( "partial", { target: partial, name }, options )
  }

  setHelper( name: string, helper: HelperFn, options?: SetOptions ): Genstuff {
    return this.set( "helper", { target: helper, name }, options )
  }

  renderString( params: {
    template: string
    data: Record<string, unknown>
  } ): string {
    for ( const [ name, helper ] of Object.entries( this.#helpers ) ) {
      handlebars.registerHelper( name, helper )
    }

    for ( const [ name, partial ] of Object.entries( this.#partials ) ) {
      handlebars.registerPartial( name, partial )
    }

    const compiled = handlebars.compile( params.template )

    return compiled( params.data )
  }

  private set<T extends SetterScope>(
    scope: T,
    config: Setter<T>,
    options?: SetOptions,
  ): Genstuff {
    if ( !config.name ) {
      throw new Error( "Name must be non-empty string" )
    }

    const target = get( this.#mapping, scope )

    if ( !target ) throw new Error( "No mapping" )

    if ( config.name in target && !options?.override ) {
      throw new Error( "Can't override" )
    }

    set( target, config.name, config.target )

    return this
  }
}
