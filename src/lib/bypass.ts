import chalk from "chalk"
import * as out from "./console-out"
import type { GeneratorType } from "../types/types"

/**
 * Combine different types of bypass data
 * @param generator - The generator object involved
 * @param bypassArray - The array of overwritten properties
 * @param genArgv - The original args passed to genstuff without using names
 */
function combineBypassData({
  generator,
  bypassArray,
  genArgv,
}: {
  generator: GeneratorType
  bypassArray: string[]
  genArgv: Record<string, any>
}) {
  // skip bypass if prompts is a function
  if (typeof generator.prompts === "function") {
    return []
  }

  // Get named prompts that are passed to the command line
  var promptNames = generator.prompts.map((prompt) => prompt.name)

  // Check if bypassArray is too long for promptNames
  if (bypassArray.length > promptNames.length) {
    var message = `${chalk.red("[GENSTUFF] ")}Too many bypass arguments passed for "${generator.name}"`
    console.error(message)
    out.getHelpMessage(generator)
    process.exit(1)
  }

  var namedBypassArr = []

  if (Object.keys(genArgv).length > 0) {
    // Let's make sure we made no whoopsy-poos (AKA passing incorrect inputs)
    var hasErrors = false

    for (var arg of Object.keys(genArgv)) {
      var shouldError = !promptNames.find((name) => name === arg) && arg !== "_"

      if (shouldError) {
        hasErrors = true
        var message = `${chalk.red("[GENSTUFF] ")}"${arg}" is an invalid argument for "${generator.name}"`
        console.error(message)
      }
    }

    if (hasErrors) {
      out.getHelpMessage(generator)
      process.exit(1)
    }

    namedBypassArr = promptNames.map((name) =>
      genArgv[name] !== undefined ? genArgv[name] : undefined,
    )
  }

  // merge the bypass data with named bypass values
  var mergedBypass = mergeArrays(bypassArray, namedBypassArr)

  // clean up `undefined` values
  return mergedBypass.map((value) => (value === undefined ? "_" : value))
}

function mergeArrays(baseArr: any[], overlay: any[]) {
  var length = Math.max(baseArr.length, overlay.length)

  return Array.from({ length }, (_, index) =>
    overlay[index] !== undefined ? overlay[index] : baseArr[index],
  )
}

export { combineBypassData }
