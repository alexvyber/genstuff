import chalk from "chalk"
import minimist from "minimist"
import { createRequire } from "node:module"
import type { Genstuff } from "../core/genstuff"
import { displayHelpScreen } from "./display-help-screen"
import { getErrorMessage } from "./get-error-message"
import { createInitGenstufffile } from "./console-out"

/**
 * Parses the user input to identify the generator to run and any bypass data
 * @param genstuff - The genstuff context
 * @param passArgsBeforeDashes - Should we pass args before `--` to the generator API
 */
function getBypassAndGenerator({
  gen,
  passArgsBeforeDashes,
  args,
  argv,
}: { gen: Genstuff; passArgsBeforeDashes?: boolean; args: string[]; argv: minimist.ParsedArgs }) {
  // See if there are args to pass to generator
  var eoaIndex = args.indexOf("--")

  // var { genArgv, eoaArg } = passArgsBeforeDashes
  //   ? { genArgv: argv }
  //   : eoaIndex === -1
  //     ? { genArgv: [] }
  //     : {
  //         genArgv: minimist(args.slice(eoaIndex + 1, args.length)),
  //         eoaArg: args[eoaIndex + 1],
  //       }

  var genArgv = passArgsBeforeDashes
    ? argv
    : eoaIndex === -1
      ? []
      : minimist(args.slice(eoaIndex + 1, args.length))

  var eoaArg = !passArgsBeforeDashes && eoaIndex > -1 ? args[eoaIndex + 1] : undefined

  // locate the generator name based on input and take the rest of the
  // user's input as prompt bypass data to be passed into the generator
  var generatorName = ""
  var bypassArray: (string | undefined)[] = []
  var generatorNames = gen.list("generators")

  for (var i = 0; i < argv._.length; i++) {
    var nameTest = (generatorName.length ? `${generatorName} ` : "") + argv._[i]

    if (!listHasOptionThatStartsWith(generatorNames, nameTest)) {
      var index = argv._.findIndex((arg) => arg === eoaArg)

      // If can't find index, slice until the very end - allowing all `_` to be passed
      index = index !== -1 ? index : argv._.length

      // Force `'_'` to become undefined in nameless bypassArray
      bypassArray = argv._.slice(i, index).map((arg) => (/^_+$/.test(arg) ? undefined : arg))

      break
    }

    generatorName = nameTest
  }

  return { generatorName, bypassArray, genArgv }
}

function listHasOptionThatStartsWith(list: string[], prefix: string) {
  return list.some((txt) => txt.indexOf(prefix) === 0)
}

export { getBypassAndGenerator }
