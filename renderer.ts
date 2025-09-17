// TODO: clean up

// deno-lint-ignore-file no-explicit-any

import { get, set } from "@es-toolkit/es-toolkit/compat"
import handlebars from "handlebars"

import type { HelperFn } from "./types.ts"
import { readonly, textHelpers } from "./lib.ts"

type SetterScope = "helper" | "partial" // | "generator"  | "action"
type SetOptions = { override?: boolean }
type Name = { name: string }

type MappingScope = {
  // generator: GeneratorConfig
  // action: Name & { target: ActionFunction }
  helper: Name & { target: HelperFn }
  partial: Name & { target: string }
}

type Mapping = {
  // generator: GeneratorConfig
  // action: ActionFunction
  helper: HelperFn
  partial: string
}

type GetSetterType<Key extends SetterScope> = Mapping[Key]

type Setter<T extends SetterScope> = { target: GetSetterType<T>; name: string }

type GetReturnType<T extends SetterScope> = Mapping[T]

export class Renderer {
  // #generators: Record<string, any> = {}
  // #actions: Record<string, ( ...args: any[] ) => any> = {}

  #partials: Record<string, string> = {}
  #helpers: Record<string, any> = textHelpers

  // readonly generators: Record<string, any> = readonly( this.#generators )
  // readonly actions: Record<string, ( ...args: any[] ) => any> = readonly( this.#actions )

  readonly partials: Record<string, string> = readonly( this.#partials )
  readonly helpers: Record<string, any> = readonly( this.#helpers )

  #mapping: {
    // generator: Record<string, any>
    // action: Record<string, ( ...args: any[] ) => any>

    partial: Record<string, string>
    helper: Record<string, any>
  } = {
    // generator: this.#generators,
    // action: this.#actions,

    partial: this.#partials,
    helper: this.#helpers,
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
      // case "generators":
      //   return Object.entries( target ).map( ( [ name, value ] ) => ( { ...( value as any ).target, name } ) )

      // case "actions":
      //   return Object.entries( target ).map( ( [ name, action ] ) => ( { name, action } ) ) as any

      case "helpers":
        return Object.entries( target ).map( ( [ name, helper ] ) => ( { name, helper } ) ) as any

      case "partials":
        return Object.entries( target ).map( ( [ name, partial ] ) => ( { name, partial } ) ) as any

      default:
        throw new Error( "can't find the scope" )
    }
  }

  // setGenerator( name: string, generator: GeneratorConfig, options?: SetOptions ): Renderer {
  //   return this.set( "generator", { target: generator, name }, options )
  // }

  // setAction( name: string, action: ActionFunction, options?: SetOptions ): Renderer {
  //   return this.set( "action", { target: action, name }, options )
  // }

  setPartial( name: string, partial: string, options?: SetOptions ): Renderer {
    return this.set( "partial", { target: partial, name }, options )
  }

  setHelper( name: string, helper: HelperFn, options?: SetOptions ): Renderer {
    return this.set( "helper", { target: helper, name }, options )
  }

  renderString( params: { template: string; data: Record<string, unknown> } ): string {
    // TODO: do this once
    for ( const [ name, helper ] of Object.entries( this.#helpers ) ) {
      handlebars.registerHelper( name, helper )
    }

    // TODO: do this once
    for ( const [ name, partial ] of Object.entries( this.#partials ) ) {
      handlebars.registerPartial( name, partial )
    }

    const compiled = handlebars.compile( params.template )

    return compiled( params.data )
  }

  private set<T extends SetterScope>( scope: T, config: Setter<T>, options?: SetOptions ): Renderer {
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
