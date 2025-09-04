// TODO: refine the file. It's a little bit dirty and unkward

import type { GeneratorType } from "../types/types.js"
import type { Genstuff } from "./genstuff.js"
import type { Hooks } from "../lib/hooks.js"

type Ctx = Record<string, any>

export type RunGeneratorActionsParams = {
  genstuff: Genstuff
  generator: GeneratorType
  hooks?: Hooks
  ctx: Ctx
}

export type RunGeneratorActionFn = (
  params: RunGeneratorActionsParams,
) => void | Promise<void>

async function runGeneratorActions(params: RunGeneratorActionsParams) {
  var abort = false
  var changes: any[] = [] // array of changed made by the actions
  var failures: any[] = [] // array of actions that failed
  var customActionTypes = {} // getCustomActionTypes()
  var actionTypes = customActionTypes //toMerged(customActionTypes, customActionTypes)

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
      params.hooks?.onComment?.(action)
      continue
    }

    var actionConfig =
      typeof action === "function"
        ? {
            type: "function" as const,
            path: "",
            force: false,
            abortOnFail: false,
          }
        : action

    var actionLogic =
      actionConfig?.type === "function"
        ? action
        : actionTypes?.[actionConfig?.type]

    // bail out if a previous action aborted
    if (abort) {
      var failure = {
        type: actionConfig?.type || "",
        path: actionConfig?.path || "",
        error: "Aborted due to previous action failure",
      }

      params.hooks?.onFailure?.(failure)

      throw new Error(failure.error)
      failures.push(failure)

      continue
    }

    actionConfig.force = actionConfig?.force === true

    if (typeof actionLogic !== "function") {
      if (actionConfig.abortOnFail !== false) {
        abort = true
      }

      var failure = {
        type: actionConfig?.type || "",
        path: actionConfig?.path || "",
        error: `Invalid action (#${index + 1})`,
      }

      params.hooks?.onFailure?.(failure)

      throw new Error(failure.error)
      failures.push(failure)

      continue
    }

    // try {
    var actionResult = await executeAction({
      action: actionLogic,
      config: actionConfig,
      ctx: params.ctx,
      genstuff: params.genstuff,
    })

    params.hooks?.onSuccess?.(actionResult)

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
  action: (params: Omit<RunGeneratorActionsParams, "generator">) => any
  config: any
  genstuff: Genstuff
  ctx: Ctx
}
async function executeAction(params: ExecuteActionParams) {
  var configData = params.config.data || {}

  // data can also be a function that returns a data object
  if (typeof configData === "function") {
    configData = await configData()
  }

  // check if action should run
  if (typeof params.config.skip === "function") {
    // Merge main data and config data in new object
    var reasonToSkip = await params.config.skip({
      ...params.ctx,
      ...configData,
    })

    if (typeof reasonToSkip === "string") {
      // Return actionResult instead of string
      return { type: "skip", path: reasonToSkip }
    }
  }

  // track keys that can be applied to the main data scope
  var configDataKeys = Object.keys(configData).filter(
    (k) => typeof params.ctx?.[k] === "undefined",
  )

  // copy config data into main data scope so it's available for templates
  for (var key of Object.keys(configData)) {
    params.ctx[key] = configData[key]
  }

  return await Promise.resolve(
    params.action({
      ctx: params.ctx,
      genstuff: params.genstuff,
    }),
  )
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

export {
  //  runGeneratorPrompts,
  runGeneratorActions,
}
