import type { TODO_RenameOptions } from "../../types/types"
import type { CustomActionFunction } from "../../types/action.types"
import { createFile } from "../../lib/craete-file"
import { isValidAction } from "../../lib/is-valid-action"
import { getRenderedTemplatePath } from "../../lib/action-utils"

const config: CustomActionFunction = async function config({ answers, config, gen }) {
  var tested = isValidAction(config)

  if (tested.valid !== true) {
    throw tested.reason
  }

  config.templateFile = getRenderedTemplatePath({ data: answers, config, genstuff: gen })

  await createFile({ data: answers, config, genstuff: gen })

  return
}

export { config }
