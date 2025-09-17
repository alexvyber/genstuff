import { assert } from "jsr:@std/assert"
import { Renderer } from "./renderer.ts"
import { prompt } from "./actions/prompt.ts"
import * as v from "@valibot/valibot"

import type { Action, Config, ExecuteActionParams, GeneratorParams } from "./types.ts"

async function runGenerator( { context, generator, renderer }: GeneratorParams ): Promise<void> {
  if ( !generator.actions ) {
    throw Error( `${generator.name} has no actions` )
  }

  if ( !Array.isArray( generator.actions ) ) {
    throw new Error( "Provided actions are invalid" )
  }

  for ( const action of generator.actions ) {
    await executeAction( { action, context, renderer } )
  }
}

async function executeAction( { action, context, renderer }: ExecuteActionParams ): Promise<void | Action | Action[]> {
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

export async function run( config_: Config ): Promise<void> {
  const config = v.parse(
    v.object( {
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
    } ),
    config_,
  )

  const renderer = new Renderer()

  if ( config.generators.length === 1 ) {
    return await runGenerator( {
      context: { errors: [], answers: {} },
      renderer,
      generator: config.generators[0],
    } )
  }

  return await runGenerator( {
    context: { errors: [], answers: {} },
    renderer,
    generator: {
      name: "select",
      actions: [
        prompt( [
          {
            type: "select",
            choices: config.generators.map( ( { name, description } ) => ( { name, hint: description } ) ),
            message: "select",
            name: "generator",
          },
        ] ),

        async ( params ) => {
          const generatorName = v.parse( v.pipe( v.string(), v.minLength( 1 ) ), params?.context?.answers?.generator )

          const generator = config.generators.find( ( generator ) => generator.name === generatorName )

          assert( generator )

          return await runGenerator( { context: { errors: [], answers: {} }, renderer, generator } )
        },
      ],
    },
  } )
}
