// TODO: get rid of `node:` imports and "del", "mkdirp" libraries
import { access } from "node:fs/promises"

import { dirname } from "@std/path"

import type { Action } from "../types.ts"

// type WriteActionConfig = {

//   data?: Record<string, unknown>
//   destination: string
//   writeMode?: "skip-if-exists" | "force"
// } & (
//   // |{templatePath: string}
//   | { template: string }
//   |
// )

export type WriteActionConfig = {
  content: string
  destination: string
  mode?: "force" | "skip-if-exists"
}

export function write( config: WriteActionConfig ): Action {
  return async function execute() {
    await Deno.mkdir( dirname( config.destination ), { recursive: true } )

    let doesExist = await fileExists( config.destination )

    if ( doesExist && config.mode === "force" ) {
      await Deno.remove( config.destination, { recursive: true } )
      doesExist = false
    }

    if ( doesExist && config.mode !== "skip-if-exists" ) {
      throw `File already exists\n -> ${config.destination}`
    }

    if ( doesExist && config.mode === "skip-if-exists" ) {
      console.info( `[SKIPPED] ${config.destination} (exists)` )
      return
    }

    await Deno.writeFile( config.destination, new TextEncoder().encode( config.content ) )
  }

  // if(eager) {
  //   return execute()
  // } else {
  //   return execute
  // }
  // return async ( params ) => {
  //   await Deno.mkdir( dirname( config.destination ), { recursive: true } )

  //   // const template = ( await readFile( config.template ) ).toString()

  //   const rendered = params.renderer.renderString( { data: config.data ?? {}, template: template } )

  //   const doesExist = await fileExists( config.destination )

  //   if ( doesExist && config.writeMode === "force" ) {
  //     await Deno.remove( config.destination, { recursive: true } )
  //   }

  //   if ( doesExist ) {
  //     if ( config.writeMode === "skip-if-exists" ) {
  //       console.info( `[SKIPPED] ${config.destination} (exists)` )
  //       return
  //     }

  //     throw `File already exists\n -> ${config.destination}`
  //   }

  //   await Deno.writeFile( config.destination, new TextEncoder().encode( rendered ) )
  // }
}

function fileExists( destination: string ) {
  return access( destination ).then(
    () => true,
    () => false,
  )
}
