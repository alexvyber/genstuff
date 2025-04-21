import {
  getRenderedTemplate,
  getRenderedTemplatePath,
  makeDestinationPath,
  getRelativeToBasePath,
} from "../../lib/action-utils"

import { isValidAction } from "../../lib/is-valid-action"
import { fileExists } from "../../lib/fs-promise-proxy"
import { readFile, writeFile } from "node:fs/promises"
import { throwStringifiedError } from "../utils"

async function append({ data, config, genstuff }: TODO_RenameOptions) {
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

    fileData = await doAppend(data, config, genstuff, fileData)

    await writeFile(fileDestinationPath, fileData)

    return getRelativeToBasePath(fileDestinationPath, genstuff)
  } catch (error) {
    throwStringifiedError(error)
  }
}

async function doAppend(data, config, genstuff, fileData) {
  var stringToAppend = await getRenderedTemplate({ data, config, genstuff })

  // if the appended string should be unique (default),
  // remove any occurence of it (but only if pattern would match)
  var separator = config.separator ?? "\n"

  if (config.unique !== false) {
    // only remove after "pattern", so that we remove not too much accidentally
    var parts = fileData.split(config.pattern)
    var lastPart = parts[parts.length - 1]
    var lastPartWithoutDuplicates = lastPart.replace(
      new RegExp(separator + stringToAppend, "g"),
      "",
    )

    fileData = fileData.replace(lastPart, lastPartWithoutDuplicates)
  }

  // add the appended string to the end of the "fileData" if "pattern"
  // was not provided, i.e. null or false
  if (!config.pattern) {
    // make sure to add a "separator" if "fileData" is not empty
    if (fileData.length > 0) {
      fileData += separator
    }

    return fileData + stringToAppend
  }

  return fileData.replace(config.pattern, `$&${separator}${stringToAppend}`)
}

export { append }
