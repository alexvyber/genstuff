import type { RunGeneratorActionFn } from "../core/runner.js"

export function config(): RunGeneratorActionFn {
  return async function execute(_params): Promise<void> {}
}
