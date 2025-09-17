import type { Action, Context } from "../types.ts"

export function renderTemplate( { fullpath, template, getData, saveFn }: {
  template: string
  fullpath: string
  getData?: ( ctx: Context ) => Record<string, unknown>
  saveFn?: ( params: { fullpath: string; content: string } ) => void | Promise<void>
} ): Action {
  return async function execute( params ) {
    const renderedTemplate = params.renderer.renderString( {
      template,
      data: getData?.( params.context ) ?? params.context,
    } )

    const renderedPath = params.renderer.renderString( {
      template: fullpath,
      data: getData?.( params.context ) ?? params.context,
    } )

    if ( saveFn ) {
      await saveFn( { content: renderedTemplate, fullpath: renderedPath } )
    }
  }
}
