import { assert } from "@std/assert"
import { Renderer } from "./renderer.ts"
import * as v from "valibot"

import type { Action, Config, ExecuteActionParams, GeneratorParams } from "./types.ts"
import { selectGenerator } from "./actions/select_generator.ts"

export async function runGenerator( { context, generator, renderer }: GeneratorParams ): Promise<void> {
  assert( generator )
  assert( Array.isArray( generator.actions ) && generator.actions.length > 0 )

  for ( const action of generator.actions ) {
    await executeAction( { action, context, renderer } )
  }
}

export async function executeAction(
  { action, context, renderer }: ExecuteActionParams,
): Promise<void | Action | Action[]> {
  const executed = await action( { context, renderer } )

  if ( !executed ) {
    return undefined
  }

  return await execRecursive( executed, { context, renderer } )
}

async function execRecursive(
  executed: Action | Action[],
  { context, renderer }: Omit<ExecuteActionParams, "action">,
): Promise<Action | Action[] | void> {
  if ( Array.isArray( executed ) ) {
    const executionResults: (Action)[] = []

    for ( const action of executed ) {
      const result = await executeAction( { action, context, renderer } )

      if ( result ) {
        if ( Array.isArray( result ) ) {
          executionResults.push( ...result.flat() )
        } else {
          executionResults.push( result )
        }
      }
    }

    return executionResults
  }

  if ( typeof executed === "function" ) {
    return await executeAction( { action: executed, context, renderer } )
  }

  assert( !executed )

  return undefined
}

const ConfigSchema = v.object( {
  generators: v.pipe(
    v.array(
      v.object( {
        name: v.string(),
        description: v.optional( v.string() ),
        actions: v.pipe( v.array( v.any() ), v.minLength( 1 ) ),
      } ),
    ),
    v.minLength( 1 ),
  ),
} )

export async function run( config_: Config ): Promise<void> {
  const config = v.parse( ConfigSchema, config_ )

  if ( config.generators.length === 1 ) {
    return await runGenerator( {
      context: { errors: [], answers: {} },
      renderer: new Renderer(),
      generator: config.generators[0],
    } )
  }

  return await runGenerator( {
    context: { errors: [], answers: {} },
    renderer: new Renderer(),
    generator: {
      name: "select",
      actions: [
        selectGenerator( config ),
      ],
    },
  } )
}
