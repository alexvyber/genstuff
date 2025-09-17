import { merge } from "@es-toolkit/es-toolkit"
import { readonly } from "../lib.ts"
import type { Action, Context, DeepReadonly } from "../types.ts"

export function context(
  callback: ( context: DeepReadonly<Context> ) => Partial<Context> | Promise<Partial<Context>>,
): Action {
  return async function execute( params ) {
    const newContext = await callback( readonly( params.context ) )
    merge( params.context, newContext )
  }
}
