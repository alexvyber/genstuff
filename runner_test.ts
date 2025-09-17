import { run } from "./runner.ts"
import { assert } from "@std/assert"
import { join } from "@std/path"
import { blank1, blank2 } from "./actions/blank.ts"

import type { Config, GeneratorConfig } from "./types.ts"
import { loadTemplates } from "./actions/load_templates.ts"
import { context } from "./actions/context.ts"

Deno.test("simple", async () => {
  const simple: GeneratorConfig = {
    name: "simple",
    description: "description",
    actions: [
      blank1,
      blank2,
      context( () => ( { kek: Math.random() } ) ),
      console.log,
      loadTemplates( join( Deno.cwd(), "actions" ) ),
    ],
  }

  const config: Config = { generators: [ simple ] }
  const result = await run( config )

  assert( typeof result === "undefined" )
})
