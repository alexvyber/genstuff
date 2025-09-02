import path from "node:path"
import { deleteAsync } from "del"
import {
  getRenderedTemplate,
  getTransformedTemplate,
  makeDestinationPath,
  getRelativeToBasePath,
} from "./action-utils.js"
import { isBinaryFileSync } from "isbinaryfile"
import { chmod, constants, stat } from "node:fs/promises"
import { mkdirp } from "mkdirp"
// import { throwStringifiedError } from "../core/utils"
// import type { TODO_RenameOptions } from "../types/types"

import fs from "node:fs"

function readFileRaw(path: string) {
  return fs.promises.readFile(path, null)
}

// function writeFile(
//   path: string,
//   data: string ,
// ) {
//   return fs.promises.writeFile(
//     path,
//     typeof data === "object" ? JSON.stringify(data) : data,
//   )
// }

function fileExists(path: string) {
  return fs.promises.access(path).then(
    () => true,
    () => false,
  )
}

export async function createFile({ data, config, genstuff }: any) {
  var fileDestinationPath = makeDestinationPath({ data, config, genstuff })

  try {
    // check path
    var destExists = await fileExists(fileDestinationPath)

    // if we are forcing and the file already exists, delete the file
    if (config?.force === true && destExists) {
      await deleteAsync([fileDestinationPath], { force: true })
      destExists = false
    }

    // we can't create files where one already exists
    if (destExists) {
      if (config?.skipIfExists) {
        return `[SKIPPED] ${fileDestinationPath} (exists)`
      }

      throw `File already exists\n -> ${fileDestinationPath}`
    }

    await mkdirp(path.dirname(fileDestinationPath))

    if (!config?.templateFile) {
      // return the added file path (relative to the destination path)
      return getRelativeToBasePath(fileDestinationPath, genstuff)
    }

    var absTemplatePath = path.resolve(
      genstuff.getGenstuffFilePath(),
      config.templateFile,
    )

    if (absTemplatePath && isBinaryFileSync(absTemplatePath)) {
      var rawTemplate = await readFileRaw(config?.templateFile)

      await writeFile(fileDestinationPath, rawTemplate.toString())
    } else {
      var renderedTemplate = await getRenderedTemplate({
        data,
        config,
        genstuff,
      })

      var transformedTemplate = await getTransformedTemplate({
        template: renderedTemplate,
        data,
        config,
      })

      await writeFile(fileDestinationPath, transformedTemplate)
    }

    if (absTemplatePath) {
      var sourceStats = await stat(absTemplatePath)
      var destStats = await stat(fileDestinationPath)

      var executableFlags =
        sourceStats.mode &
        (constants.S_IXUSR | constants.S_IXGRP | constants.S_IXOTH)

      await chmod(fileDestinationPath, destStats.mode | executableFlags)
    }
  } catch (_err) {
    // throwStringifiedError(err)
  }
}
