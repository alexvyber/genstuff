// TODO: refine the file. It's a little bit dirty and unkward

import type { GeneratorType } from "../types/types.ts"
import type { Genstuff } from "./genstuff.ts"
// import type { Hooks } from "../lib/hooks.ts"

type Ctx = Record<string, unknown>

export type RunGeneratorActionsParams = {
  genstuff: Genstuff
  generator: GeneratorType
  hooks?: unknown //Hooks
  ctx: Ctx
}

export type RunGeneratorActionFn = (
  params: RunGeneratorActionsParams,
) => void | Promise<void>

export async function run(params: RunGeneratorActionsParams): Promise<{
  changes: unknown[]
  failures: unknown[]
}> {
  let abort = false
  const changes: unknown[] = [] // array of changed made by the actions
  const failures: unknown[] = [] // array of actions that failed
  const customActionTypes = {} // getCustomActionTypes()
  const actionTypes = customActionTypes //toMerged(customActionTypes, customActionTypes)

  // if actions are not defined... we cannot proceed.
  if (!params.generator.actions) {
    throw Error(`${params.generator.name} has no actions`)
  }

  if (!Array.isArray(params.generator.actions)) {
    throw new Error("Provided actions are invalid")
  }

  for (const [index, action] of params.generator.actions.entries()) {
    // including strings in the actions array is used for commenting
    if (typeof action === "string" && abort) {
      continue
    }

    if (typeof action === "string") {
      // params.hooks?.onComment?.(action)
      continue
    }

    const actionConfig = typeof action === "function"
      ? {
        type: "function" as const,
        path: "",
        force: false,
        abortOnFail: false,
      }
      : action

    const actionLogic = actionConfig?.type === "function" ? action : actionTypes?.[actionConfig?.type]

    // bail out if a previous action aborted
    if (abort) {
      const failure = {
        type: actionConfig?.type || "",
        path: actionConfig?.path || "",
        error: "Aborted due to previous action failure",
      }

      // params.hooks?.onFailure?.(failure)

      throw new Error(failure.error)
    }

    actionConfig.force = actionConfig?.force === true

    if (typeof actionLogic !== "function") {
      if (actionConfig.abortOnFail !== false) {
        abort = true
      }

      const failure = {
        type: actionConfig?.type || "",
        path: actionConfig?.path || "",
        error: `Invalid action (#${index + 1})`,
      }

      // params.hooks?.onFailure?.(failure)

      throw new Error(failure.error)
    }

    // try {
    const actionResult = await executeAction({
      // deno-lint-ignore no-explicit-any
      action: actionLogic as any,
      config: actionConfig,
      ctx: params.ctx,
      genstuff: params.genstuff,
    })

    // params.hooks?.onSuccess?.(actionResult)

    changes.push(actionResult)
    // }
    // catch (failure) {
    //   if (actionConfig.abortOnFail !== false) {
    //     abort = true
    //   }

    //   params.hooks?.onFailure?.(failure)

    //   if (failure instanceof Error) {
    //     throw failure
    //   }
    //   throw new Error()
    //   failures.push(failure)
    // }
  }

  return { changes, failures }
}

type ExecuteActionParams = {
  action: (params: Omit<RunGeneratorActionsParams, "generator">) => unknown
  // deno-lint-ignore no-explicit-any
  config: any
  genstuff: Genstuff
  ctx: Ctx
}
async function executeAction(params: ExecuteActionParams) {
  let configData = params.config.data || {}

  // data can also be a function that returns a data object
  if (typeof configData === "function") {
    configData = await configData()
  }

  // check if action should run
  if (typeof params.config.skip === "function") {
    // Merge main data and config data in new object
    const reasonToSkip = await params.config.skip({ ...params.ctx, ...configData })

    if (typeof reasonToSkip === "string") {
      // Return actionResult instead of string
      return { type: "skip", path: reasonToSkip }
    }
  }

  // track keys that can be applied to the main data scope
  // const _configDataKeys = Object.keys(configData).filter(    (k) => typeof params.ctx?.[k] === "undefined",  )

  // copy config data into main data scope so it's available for templates
  for (const key of Object.keys(configData)) {
    params.ctx[key] = configData[key]
  }

  return await Promise.resolve(params.action({ ctx: params.ctx, genstuff: params.genstuff }))
  // .then((result) => ({
  //   type: params.config?.type,
  //   path:
  //     result &&
  //     (typeof result === "string"
  //       ? result
  //       : "data" in result && result.data
  //         ? result.data
  //         : JSON.stringify(result)),
  // }))
  // .catch((error) => {
  //   throw {
  //     type: params.config?.type,
  //     path: "",
  //     error: error.message || error.toString(),
  //   }
  // })
  // .finally(() => {
  //   for (var key of configDataKeys) {
  //     params.ctx[key] = undefined
  //   }
  // })
}
