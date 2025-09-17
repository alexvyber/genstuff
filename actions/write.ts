// TODO: get rid of `node:` imports and "del", "mkdirp" libraries
import { access, readFile } from "node:fs/promises"

import { dirname } from "@std/path"

import type { Action } from "../types.ts"

type WriteActionConfig = {
  templatePath: string
  data?: Record<string, unknown>
  destination: string
  writeMode?: "skip-if-exists" | "force"
}

export function write( config: WriteActionConfig ): Action {
  return async ( params ) => {
    await Deno.mkdir( dirname( config.destination ), { recursive: true } )

    const template = ( await readFile( config.templatePath ) ).toString()

    const rendered = params.renderer.renderString( { data: config.data ?? {}, template: template } )

    const isFileExist = await fileExists( config.destination )

    if ( isFileExist && config.writeMode === "force" ) {
      await Deno.remove( config.destination, { recursive: true } )
    }

    if ( isFileExist ) {
      if ( config.writeMode === "skip-if-exists" ) {
        console.info( `[SKIPPED] ${config.destination} (exists)` )
        return
      }

      throw `File already exists\n -> ${config.destination}`
    }

    await Deno.writeFile( config.destination, new TextEncoder().encode( rendered ) )
  }
}

function fileExists( destination: string ) {
  return access( destination ).then(
    () => true,
    () => false,
  )
}
