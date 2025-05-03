import type { ActionFunction } from "../types/action.types"

type CheckOption = { checkPath?: boolean; checkAbortOnFail?: boolean }

function isValidAction(
  action: ActionFunction,
  options?: CheckOption,
): { valid: true; reason?: undefined } | { valid: false; reason: string } {
  if (typeof action !== "object") {
    return {
      valid: false,
      reason: `Invalid action object: ${JSON.stringify(action)}`,
    }
  }

  var { path, abortOnFail } = action

  if (options?.checkPath && (typeof path !== "string" || path.length === 0)) {
    return {
      valid: false,
      reason: `Invalid path "${path}"`,
    }
  }

  // abortOnFail is optional, but if it's provided it needs to be a Boolean
  if (options?.checkAbortOnFail && abortOnFail !== undefined && typeof abortOnFail !== "boolean") {
    return {
      valid: false,
      reason: `Invalid value for abortOnFail (${abortOnFail} is not a Boolean)`,
    }
  }

  if ("transform" in action && typeof action.transform !== "function") {
    return {
      valid: false,
      reason: `Invalid value for transform (${typeof action.transform} is not a function)`,
    }
  }

  if (action.type === "modify" && !("pattern" in action) && !("transform" in action)) {
    return {
      valid: false,
      reason: "Invalid modify action (modify must have a pattern or transform function)",
    }
  }

  if ("skip" in action && typeof action.skip !== "function") {
    return {
      valid: false,
      reason: `Invalid value for skip (${typeof action.skip} is not a function)`,
    }
  }

  return { valid: true }
}

export { isValidAction }
