import type {
  RunGeneratorActionFn,
  RunGeneratorActionsParams,
} from "../core/runner.js"

export function use(
  callback: (params: RunGeneratorActionsParams) => RunGeneratorActionFn,
): RunGeneratorActionFn {
  return function runAction(params) {
    const actionFn = callback(params)
    return actionFn(params)
  }
}
