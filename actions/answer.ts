import type { RunGeneratorActionFn } from "../core/runner.ts"

export function answer(): RunGeneratorActionFn {
  return async function execute(_params): Promise<void> {}
}
