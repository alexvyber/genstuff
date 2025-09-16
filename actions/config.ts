import type { RunGeneratorActionFn } from "../core/runner.ts"

export function config(): RunGeneratorActionFn {
  return async function execute(_params): Promise<void> {}
}
