import type { Action } from "../types.ts"

type Callback = ( params: unknown ) => Action | Promise<Action>

export function use( callback: Callback ): Action {
  return async function runAction( params ) {
    const actionFn = await callback( params )
    return actionFn( params )
  }
}
