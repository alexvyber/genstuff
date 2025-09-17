import { executeAction } from "../runner.ts"
import type { Action } from "../types.ts"

export function parallel( actions: Action[] ): Action {
  return async function execute( params ) {
    await Promise.all(
      actions.map( ( action ) => executeAction( { action, context: params.context, renderer: params.renderer } ) ),
    )
  }
}
