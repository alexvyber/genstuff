import type { Action } from "../types.ts"

export function ai(): Action {
  return function execute( _params ) {
    throw new Error( "Action is not implemented" )
  }
}
