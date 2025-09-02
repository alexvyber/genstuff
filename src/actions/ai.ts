import type { RunGeneratorActionFn } from "../core/runner.js"

export function ai(): RunGeneratorActionFn {
  return async function execute(_params): Promise<void> {}
}
