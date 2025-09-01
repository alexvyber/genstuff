import type { RunGeneratorActionFn } from "../core/runner.js"

export function answer(): RunGeneratorActionFn {
  return async function execute(params): Promise<void> {}
}
