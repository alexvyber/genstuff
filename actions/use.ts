import type { Action } from "../types.ts"

// TODO: implement use in a way, that it can use actions from some repository... Maybe...

export function use(): Action {
  return function execute( _params ) {
    throw new Error( "Action is not implemented" )
  }
}
