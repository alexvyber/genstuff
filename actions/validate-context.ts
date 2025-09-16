import type { RunGeneratorActionFn } from "../core/runner.ts"

export function validateContext(): RunGeneratorActionFn {
  return async function execute(_params): Promise<void> {}
}
