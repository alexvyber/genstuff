import type { Action } from "../types.ts"

export function echo( message?: string ): Action {
  return function execute() {
    console.log( message )
  }
}
