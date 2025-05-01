import path from "node:path"
import fs from "node:fs"
import { globbySync } from "globby"
import { isValidAction } from "../lib/is-valid-action"
import { normalizePath } from "../lib/action-utils"
import { createFile } from "../lib/craete-file"
import type { Genstuff } from "../core/genstuff"
import type { TODO_RenameOptions } from "../types/types"

var defaultConfig = {
  verbose: true,
  stripExtensions: ["hbs"],
}

async function addMany({ data, config, genstuff }: TODO_RenameOptions) {
  // shallow-merge default config and input config
  var config = Object.assign({}, defaultConfig, cofnig)
  // check the common action interface attributes. skip path check because it's NA
  var interfaceTestResult = isValidAction(config, { checkPath: false })
  if (interfaceTestResult.valid !== true) {
    throw interfaceTestResult.reason
  }

  // check that destination (instead of path) is a string value
  var dest = config.destination
  if (typeof dest !== "string" || dest.length === 0) {
    throw `Invalid destination "${dest}"`
  }

  if (config.base) {
    config.base = genstuff.renderString(config.base, data)
  }

  if (typeof config.templateFiles === "function") {
    config.templateFiles = config.templateFiles()
  }

  config.templateFiles = []
    .concat(config.templateFiles) // Ensure `config.templateFiles` is an array, even if a string is passed.
    .map((file) => genstuff.renderString(file, data)) // render the paths as hbs templates

  var templateFiles = resolveTemplateFiles(
    config.templateFiles,
    config.base,
    config.globOptions,
    genstuff,
  )

  var filesAdded = []
  for (var templateFile of templateFiles) {
    var absTemplatePath = path.resolve(genstuff.getGenstufffilePath(), templateFile)

    var fileConfig = Object.assign({}, config, {
      path: stripExtensions(
        config.stripExtensions,
        resolvePath(config.destination, templateFile, config.base),
      ),
      templateFile: absTemplatePath,
    })

    var addedPath = await createFile(data, fileConfig, genstuff)

    filesAdded.push(addedPath)
  }

  var summary = `${filesAdded.length} files added`

  if (!config.verbose) {
    return summary
  }

  return `${summary}\n -> ${filesAdded.join("\n -> ")}`
}

function resolveTemplateFiles(
  templateFilesGlob,
  basePath: string,
  globOptions: Record<string, any>,
  genstuff: Genstuff,
) {
  globOptions = Object.assign({ cwd: genstuff.getGenstufffilePath() }, globOptions)

  return globbySync(templateFilesGlob, Object.assign({ braceExpansion: false }, globOptions))
    .filter(isUnder(basePath))
    .filter(isAbsoluteOrRelativeFileTo(genstuff.getGenstufffilePath()))
}
function isFile(file: string) {
  return fs.existsSync(file) && fs.lstatSync(file).isFile()
}

function isAbsoluteOrRelativeFileTo(relativePath: string) {
  return (file: unknown) =>
    typeof file === "string" ? isFile(file) || isFile(path.join(relativePath, file)) : false
}

function isUnder(basePath = "") {
  return (path: unknown) => (typeof path === "string" ? path.startsWith(basePath) : false)
}

function resolvePath(destination: string, file: string, rootPath: string) {
  return normalizePath(path.join(destination, dropFileRootPath(file, rootPath)))
}

function dropFileRootPath(file: string, rootPath: string) {
  return rootPath ? file.replace(rootPath, "") : dropFileRootFolder(file)
}

function dropFileRootFolder(file: string) {
  var fileParts = path.normalize(file).split(path.sep)

  fileParts.shift()

  return fileParts.join(path.sep)
}

function stripExtensions(shouldStrip: boolean, fileName: string) {
  var maybeFile = path.parse(fileName)

  if (
    Array.isArray(shouldStrip) &&
    !shouldStrip.map((item) => `.${item}`).includes(maybeFile.ext)
  ) {
    return fileName
  }

  var hasDir = path.parse(maybeFile.name).ext !== "" || maybeFile.name.startsWith(".")

  return hasDir ? path.join(maybeFile.dir, maybeFile.name) : fileName
}

export { addMany }
