// TODO: clean up

import {
  camelCase,
  capitalCase,
  constantCase,
  dotCase,
  kebabCase,
  noCase,
  pascalCase,
  pascalSnakeCase,
  pathCase,
  sentenceCase,
  snakeCase,
  trainCase,
} from "change-case"
import { titleCase } from "title-case"
import { deburr, lowerFirst, startCase, trim } from "@es-toolkit/es-toolkit"

import type { ActionHooks, ActionHooksChanges, ActionHooksFailures, TextHelpers } from "./types.ts"

//
// -----
//

export const textHelpers: TextHelpers = {
  upperCase: ( str ) => str.toUpperCase(),
  lowerCase: ( str ) => str.toLowerCase(),
  camelCase: ( str ) => camelCase( str ),
  snakeCase: ( str ) => snakeCase( str ),
  dotCase: ( str ) => dotCase( str ),
  pathCase: ( str ) => pathCase( str ),
  sentenceCase: ( str ) => sentenceCase( str ),
  constantCase: ( str ) => constantCase( str ),
  titleCase: ( str ) => titleCase( str ),
  kebabCase: ( str ) => kebabCase( str ),
  dashCase: ( str ) => kebabCase( str ),
  kabobCase: ( str ) => kebabCase( str ),
  pascalCase: ( str ) => pascalCase( str ),
  properCase: ( str ) => pascalCase( str ),
  deburr: ( str ) => deburr( str ),
  lowerFirst: ( str ) => lowerFirst( str ),
  startCase: ( str ) => startCase( str ),
  noCase: ( str ) => noCase( str ),
  capitalCase: ( str ) => capitalCase( str ),
  pascalSnakeCase: ( str ) => pascalSnakeCase( str ),
  trainCase: ( str ) => trainCase( str ),
  trim: ( str ) => trim( str ),
}

//
// -----
//

// import { styleText } from "node:util"
// const typeDisplay = {
//   function: styleText( "yellow", "->" ),
//   add: styleText( "green", "++" ),
//   addMany: styleText( "green", "+!" ),
//   modify: `${`${styleText( "green", "+" )}${styleText( "red", "-" )}`}`,
//   append: styleText( "green", "_+" ),
//   skip: styleText( "green", "--" ),
// }

// function typeMap( name: keyof typeof typeDisplay, noMap: boolean = true ) {
//   const dimType = styleText( "dim", name )
//   return noMap ? dimType : typeDisplay[name] || dimType
// }

export class Hooks implements ActionHooks {
  onComment( message: string ) {
    console.log( message )
  }

  onSuccess( change: ActionHooksChanges ) {
    // let line = ""

    // if ( change.type ) {
    //   line += ` ${typeMap( change.type )}`
    // }

    // if ( change.path ) {
    //   line += ` ${change.path}`
    // }

    console.log( change )
  }

  onFailure( failure: ActionHooksFailures ) {
    // let line = ""

    // if ( failure.type ) {
    //   line += ` ${typeMap( failure.type )}`
    // }

    // if ( failure.path ) {
    //   line += ` ${failure.path}`
    // }

    // const errorMessage = failure.error || failure.message

    // if ( errorMessage ) {
    //   line += ` ${errorMessage}`
    // }

    console.log( failure )
  }
}

//
// -----
//

const ReadOnlyProxyDescriptor = {
  // deno-lint-ignore no-explicit-any ban-types
  get<T extends object>( target: T, key: keyof T & (string & {}) ): any {
    const value = target[key]

    if ( !isObject( value ) ) {
      return value
    }

    return readonly( value )
  },

  set( _target: object, _key: string ) {
    throw new ReadOnlyProxyWriteError( "Cannot write on read-only proxy" )
  },

  deleteProperty( _target: object, _key: string ) {
    throw new ReadOnlyProxyWriteError( "Cannot delete on read-only proxy" )
  },
}

function isObject( thing: unknown ) {
  return thing !== null && typeof thing === "object"
}

class ReadOnlyProxyWriteError extends Error {
  override name = "ReadOnlyProxyWriteError"
}

// Create a read-only proxy over an object.
// Sub-properties that are objects also return read-only proxies.
export function readonly<T extends object>( target: T ) {
  return new Proxy<T>( target, ReadOnlyProxyDescriptor )
}
