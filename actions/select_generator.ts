import { assert } from "jsr:@std/assert"
import type { Action, Config } from "../types.ts"
import { prompt } from "./prompt.ts"
import { Renderer } from "../renderer.ts"
import { runGenerator } from "../runner.ts"

export function selectGenerator( config: Config ): Action {
  const choices = config.generators.map( ( { name, description } ) => ( { name, hint: description } ) )

  return () => [
    prompt( [ { type: "select", choices, message: "select", name: "generator" } ] ),

    function runSelectedGenerator( params ) {
      const generator = config.generators.find( ( generator ) =>
        generator.name === params?.context?.answers?.generator
      )

      assert( generator )

      return runGenerator( { context: { errors: [], answers: {} }, renderer: new Renderer(), generator } )
    },
  ]
}
