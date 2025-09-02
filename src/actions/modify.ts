import type { RunGeneratorActionFn } from "../core/runner.js"

export function modify(): RunGeneratorActionFn {
  return async function execute(_params): Promise<void> {}
}
