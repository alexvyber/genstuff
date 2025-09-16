import type { RunGeneratorActionFn } from "../core/runner.ts"

export function modify(): RunGeneratorActionFn {
  return async function execute(_params): Promise<void> {}
}
