import type minimist from "minimist"
import chalk from "chalk"
import { displayHelpScreen } from "./display-help-screen"
import { createInitGenstufffile } from "./console-out"
import { getErrorMessage } from "./get-error-message"

type handleBasicArgFlags = { env: Record<string, any>; argv: minimist.ParsedArgs }

/**
 * Handles all basic argument flags like --help, --version, etc
 * @param env - Values parsed by Liftoff
 */
export async function handleBasicArgFlags({ argv, env }: handleBasicArgFlags): Promise<void> {
  // Make sure that we're not overwriting `help`, `init,` or `version` args in generators

  // abort if there's no genstuff found
  if (argv._.length > 0) {
    if (!env.configPath) {
      console.error(`${chalk.red("[GENSTUFF]")} No genstuff found`)
      displayHelpScreen()
      process.exit(1)
    }

    return
  }

  // handle request for usage and options
  if (argv.help || argv.h) {
    displayHelpScreen()
    process.exit(0)
  }

  // handle request for initializing a new genstuff
  if (argv.init || argv.i || argv["init-ts"]) {
    var force = argv.force === true || argv.f === true || false

    try {
      createInitGenstufffile(force, !!argv["init-ts"])
      process.exit(0)
    } catch (error) {
      console.error(`${chalk.red("[GENSTUFF]")} ${getErrorMessage(error)}`)
      process.exit(1)
    }
  }

  // handle request for version number
  if (argv.version || argv.v) {
    var localVersion = env.modulePackage.version

    var { default: globalPkg } = await import("../../package.json")

    if (localVersion !== globalPkg.version && localVersion != null) {
      console.log(chalk.yellow("CLI version"), globalPkg.version)
      console.log(chalk.yellow("Local version"), localVersion)
    } else {
      console.log(globalPkg.version)
    }

    process.exit(0)
  }
}
