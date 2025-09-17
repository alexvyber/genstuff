import { run } from "./runner.ts"
import { assert } from "@std/assert"
import { blank1, blank2 } from "./actions/blank.ts"

import type { Config, GeneratorConfig } from "./types.ts"

Deno.test("simple", async () => {
  const simple: GeneratorConfig = {
    name: "simple",
    description: "Some adsfadsf",
    actions: [ blank1, blank2 ],
  }

  const config: Config = { generators: [ simple ] }
  const result = await run( config )

  assert( typeof result === "undefined" )
})
