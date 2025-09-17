import type { Action } from "../types.ts"

export function echo(message?: string): Action {
  return function execute( params ) {
    console.log({ message: message ?? "Hello, World!", params })
  }
}
