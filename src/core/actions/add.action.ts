import type { TODO_RenameOptions } from "../../types/types"
import { createFile } from "../../lib/craete-file"
import { isValidAction } from "../../lib/is-valid-action"
import { getRenderedTemplatePath } from "../../lib/action-utils"

async function add({ data, config, genstuff }: TODO_RenameOptions) {
  var tested = isValidAction(config)

  if (tested.valid !== true) {
    throw tested.reason
  }

  config.templateFile = getRenderedTemplatePath({ data, config, genstuff })

  return await createFile({ data, config, genstuff })
}

export { add }
