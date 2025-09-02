import type { RunGeneratorActionFn } from "../core/runner.js"

export function validateContext(): RunGeneratorActionFn {
  return async function execute(params): Promise<void> {}
}
