import type { Action } from "../types.ts"
import { join, resolve } from "@std/path"

export function loadTemplates( templatesPath: string ): Action {
  return async function execute( params ) {
    const templates: Map<string, string> = new Map()

    for await ( const file of walkDir( templatesPath ) ) {
      const contentRaw = await Deno.readFile( resolve( templatesPath, file ) )
      templates.set( file, new TextDecoder().decode( contentRaw ) )
    }

    Object.assign( params.context, { templates } )
  }
}

async function* walkDir( path: string ): AsyncGenerator<string> {
  for await ( const entry of Deno.readDir( path ) ) {
    const fullpath = join( path, entry.name )

    if ( entry.isDirectory ) {
      yield* walkDir( fullpath )
    }

    if ( entry.isFile ) {
      yield fullpath
    }
  }
}
