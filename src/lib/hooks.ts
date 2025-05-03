import { type Ora } from "ora"
import type {
  GenstuffActionHooks,
  GenstuffActionHooksChanges,
  GenstuffActionHooksFailures,
} from "../types/hooks.types"
import { typeMap } from "./console-out"

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
