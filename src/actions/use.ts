import type {
  RunGeneratorActionFn,
  RunGeneratorActionsParams,
} from "../core/runner.js"

export function use(
  callback: (params: RunGeneratorActionsParams) =>  Promise<RunGeneratorActionFn> ,
): RunGeneratorActionFn {
  return async function runAction(params) {
    const actionFn = await callback(params)
    return actionFn(params)
  }
}
