import type { RunGeneratorActionFn } from "../core/runner.js"

export function answer(): RunGeneratorActionFn {
  return async function execute(_params): Promise<void> {}
}
