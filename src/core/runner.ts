import inquirer, { type Answers } from "inquirer"
import type { Context, GeneratorType } from "../types/types"
import { promptBypass } from "./prompt-bypass"
import { invariant, toMerged } from "es-toolkit"
import type { Genstuff } from "./genstuff"
import { actions } from "./actions"
import type { CustomActionFunction } from "../types/action.types"
import type { Hooks } from "../lib/hooks"

// triggers inquirer with the correct prompts for this generator
// returns a promise that resolves with the user's answers

async function runGeneratorPrompts({
  generator,
  bypassArray,
}: { generator: GeneratorType; bypassArray?: string[] }) {
  if (!generator?.prompts) throw Error(`${generator.name} has no prompts`)

  // handle bypass data when provided
  var { promptsAfterBypass, bypassAnswers } = await promptBypass({
    prompts: generator.prompts,
    bypassArray,
  })

  return await inquirer
    .prompt(promptsAfterBypass)
    .then((answers) => Object.assign(answers, bypassAnswers))
}

type RunGeneratorActionsParams = {
  gen: Genstuff
  generator: GeneratorType
  answers: Answers
  hooks?: Hooks
}
// Run the actions for this generator
async function runGeneratorActions(params: RunGeneratorActionsParams) {
  var abort = false

  var changes: any[] = [] // array of changed made by the actions
  var failures: any[] = [] // array of actions that failed
  // var { actions } = generator // the list of actions to execute
  var customActionTypes = {} // getCustomActionTypes()
  var actionTypes = toMerged(customActionTypes, actions)

  // if actions are not defined... we cannot proceed.
  if (!params.generator.actions) {
    throw Error(`${params.generator.name} has no actions`)
  }

  invariant(typeof params.generator.actions === "function", "Generator actions must be a function")

  var actions_ = await params.generator.actions({
    answers: params.answers,
    gen: params.gen,
  })

  // if actions are not an array, invalid!
  if (!Array.isArray(actions_)) {
    throw Error(`${params.generator.name} has invalid actions`)
  }

  for (var [index, action] of actions_.entries()) {
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
        ? { type: "function" as const, path: "", force: false, abortOnFail: false }
        : action

    var actionLogic = actionConfig.type === "function" ? action : actionTypes[actionConfig.type]

    // bail out if a previous action aborted
    if (abort) {
      var failure = {
        type: actionConfig.type || "",
        path: actionConfig.path || "",
        error: "Aborted due to previous action failure",
      }

      params.hooks?.onFailure?.(failure)

      failures.push(failure)

      continue
    }

    actionConfig.force = actionConfig.force === true

    if (typeof actionLogic !== "function") {
      if (actionConfig.abortOnFail !== false) {
        abort = true
      }

      var failure = {
        type: actionConfig.type || "",
        path: actionConfig.path || "",
        error: `Invalid action (#${index + 1})`,
      }

      params.hooks?.onFailure?.(failure)

      failures.push(failure)

      continue
    }

    try {
      var actionResult = await executeAction({
        action: actionLogic,
        config: actionConfig,
        answers: params.answers,
        gen: params.gen,
      })

      params.hooks?.onSuccess?.(actionResult)

      changes.push(actionResult)
    } catch (failure) {
      if (actionConfig.abortOnFail !== false) {
        abort = true
      }

      params.hooks?.onFailure?.(failure)

      failures.push(failure)
    }
  }

  return { changes, failures }
}

// request the list of custom actions from the genstuff
// function getCustomActionTypes(genstuff: Genstuff) {
//   var actions = genstuff.list("actions")
//   return genstuff.getActionTypeList().reduce(function (types, name) {
//     types[name] = genstuff.getActionType(name)
//     return types
//   }, {})
// }

type ExecuteActionParams = {
  action: CustomActionFunction
  config: any
  gen: Genstuff
  answers: Answers
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
    var reasonToSkip = await params.config.skip({ ...params.answers, ...configData })

    if (typeof reasonToSkip === "string") {
      // Return actionResult instead of string
      return { type: "skip", path: reasonToSkip }
    }
  }

  // track keys that can be applied to the main data scope
  var configDataKeys = Object.keys(configData).filter(
    (k) => typeof params.answers?.[k] === "undefined",
  )

  // copy config data into main data scope so it's available for templates
  for (var key of Object.keys(configData)) {
    params.answers[key] = configData[key]
  }

  return await Promise.resolve(
    params.action({
      answers: params.answers,
      config: params.config,
      gen: params.gen,
    }),
  )
    .then((result) => ({
      type: params.config.type,
      path:
        result &&
        (typeof result === "string"
          ? result
          : "data" in result && result.data
            ? result.data
            : JSON.stringify(result)),
    }))
    .catch((error) => {
      throw { type: params.config.type, path: "", error: error.message || error.toString() }
    })
    .finally(() => {
      for (var key of configDataKeys) {
        params.answers[key] = undefined
      }
    })
}

export { runGeneratorPrompts, runGeneratorActions }
