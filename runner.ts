import { assert } from "@std/assert"
import { Genstuff } from "./genstuff.ts"
import { prompt } from "./actions/prompt.ts"
import { merge } from "@es-toolkit/es-toolkit"
import * as v from "@valibot/valibot"

import type { Action, ExecuteActionParams, GeneratorParams } from "./types.ts"

async function runGenerator( { context, generator, genstuff }: GeneratorParams ): Promise<void> {
  if ( !generator.actions ) {
    throw Error( `${generator.name} has no actions` )
  }

  if ( !Array.isArray( generator.actions ) ) {
    throw new Error( "Provided actions are invalid" )
  }

  for ( const action of generator.actions ) {
    await executeAction( { action, context, genstuff } )
  }
}

async function executeAction( { action, context, genstuff }: ExecuteActionParams ): Promise<void | Action | Action[]> {
  const executed = await action( { context, genstuff } )

  if ( !executed ) {
    return undefined
  }

  return await rec( executed, { context, genstuff } )
}

async function rec(
  executed: Action | Action[],
  { context, genstuff }: Omit<ExecuteActionParams, "action">,
): Promise<Action | Action[] | void> {
  if ( Array.isArray( executed ) ) {
    const executionResults: (Action)[] = []

    for ( const action of executed ) {
      const result = await executeAction( { action, context, genstuff } )

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
    return await executeAction( { action: executed, context, genstuff } )
  }

  assert( !executed )

  return undefined
}

export async function run( config_: unknown ): Promise<void> {
  const config = v.parse(
    v.object( {
      initContext: v.optional( v.any() ),
      generators: v.array(
        v.object( {
          name: v.string(),
          description: v.optional( v.string() ),
          initContext: v.optional( v.any() ),
          actions: v.array( v.any() ),
        } ),
      ),
    } ),
    config_,
  )

  const genstuff = new Genstuff()

  if ( config.generators.length === 1 ) {
    const generator = config.generators[0]

    await runGenerator( {
      context: merge(
        { errors: [], answers: {} },
        merge( merge( {}, generator.initContext?.() ?? {} ), config.initContext?.() ?? {} ),
      ),
      genstuff: genstuff,
      generator: config.generators[0],
    } )

    return
  }

  genstuff.setGenerator( "choose", {
    name: "choose",
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
        const hasGenerator = params?.context?.answers &&
          typeof params?.context?.answers === "object" &&
          "generator" in params?.context?.answers

        if ( !hasGenerator ) {
          throw new Error( "No generators provided" )
        }

        const generatorName = v.parse( v.string(), params?.context?.answers.generator )

        const generator = config.generators.find( ( generator ) => generator.name === generatorName )

        if ( !generator ) {
          console.error( "No generator found" )
          Deno.exit( 1 )
        }

        await runGenerator( {
          context: merge(
            { errors: [], answers: {} },
            merge( merge( {}, generator.initContext?.() ?? {} ), config.initContext?.() ?? {} ),
          ),
          genstuff: genstuff,
          generator,
        } )
      },
    ],
  } )

  await runGenerator( {
    context: { errors: [], answers: {} },
    genstuff: genstuff,
    generator: genstuff.get( "generator", "choose" ),
  } )
}
