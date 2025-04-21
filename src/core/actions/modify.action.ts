import {
  getRenderedTemplate,
  makeDestinationPath,
  getRelativeToBasePath,
  getRenderedTemplatePath,
  getTransformedTemplate,
} from "../../lib/action-utils"

import { isValidAction } from "../../lib/is-valid-action"
import { fileExists } from "../../lib/fs-promise-proxy"
import { readFile, writeFile } from "node:fs/promises"
import { throwStringifiedError } from "../utils"

async function modify({ data, config, genstuff }: TODO_RenameOptions) {
  var interfaceTestResult = isValidAction(config)

  if (interfaceTestResult.valid !== true) {
    throw interfaceTestResult.reason
  }

  var fileDestinationPath = makeDestinationPath({ data, config, genstuff })

  try {
    // check path
    var pathExists = await fileExists(fileDestinationPath)

    if (!pathExists) {
      throw "File does not exist"
    }

    var fileData = await readFile(fileDestinationPath)
    config.templateFile = getRenderedTemplatePath({ data, config, genstuff })
    var replacement = await getRenderedTemplate({ data, config, genstuff })

    var shoudReplace = typeof config.pattern === "string" || config.pattern instanceof RegExp

    if (shoudReplace) {
      fileData = fileData.replace(config.pattern, replacement)
    }

    var transformed = await getTransformedTemplate({
      template: fileData,
      data,
      config,
    })

    await writeFile(fileDestinationPath, transformed)

    return getRelativeToBasePath(fileDestinationPath, genstuff)
  } catch (error) {
    throwStringifiedError(error)
  }
}

export { modify }
