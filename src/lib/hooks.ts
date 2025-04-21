import ora, { type Ora } from "ora"
import minimist from "minimist"
import chalk from "chalk"

import { Genstuff } from "../core/genstuff"
import type {
  GenstuffActionHooks,
  GenstuffActionHooksChanges,
  GenstuffActionHooksFailures,
} from "../types/hooks.types"
import type { Context, GeneratorType } from "../types/types"
import { runGeneratorActions, runGeneratorPrompts } from "../core/runner"
import { getErrorMessage } from "./get-error-message"
import { readonly } from "./readonly-proxy"
import { handleBasicArgFlags } from "./handle-arg-flags"
import { chooseOptionFromList, typeMap } from "./console-out"

class Hooks implements GenstuffActionHooks {
  constructor(private spinner?: Ora) {}

  onComment(msg: string) {
    this.spinner?.info(msg)
    this.spinner?.start()
  }

  onSuccess(change: GenstuffActionHooksChanges) {
    var line = ""

    if (change.type) {
      line += ` ${typeMap(change.type)}`
    }

    if (change.path) {
      line += ` ${change.path}`
    }

    this.spinner?.succeed(line)
    this.spinner?.start()
  }

  onFailure(failure: GenstuffActionHooksFailures) {
    var line = ""

    if (failure.type) {
      line += ` ${typeMap(failure.type)}`
    }

    if (failure.path) {
      line += ` ${failure.path}`
    }

    var errorMessage = failure.error || failure.message

    if (errorMessage) {
      line += ` ${errorMessage}`
    }

    this.spinner?.fail(line)
    this.spinner?.start()
  }
}

export { Hooks }
