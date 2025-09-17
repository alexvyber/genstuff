import type { Action } from "../types.ts"

export function answer(): Action {
  return function execute( _params ) {
    throw new Error( "Action is not implemented" )
  }
}
