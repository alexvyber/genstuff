import { toMerged } from "es-toolkit/compat"
import { readFile } from "node:fs/promises"
import path from "node:path"

function getFullData(data, config) {
  return toMerged(data, config)
}

function getRelativeToBasePath(filePath: string, genstuff: Genstuff) {
  return filePath.replace(path.resolve(genstuff.getDestinationBasePath()), "")
}

function normalizePath(path) {
  return !path.sep || path.sep === "\\" ? path.replace(/\\/g, "/") : path
}

function makeDestinationPath({ data, config, genstuff }: any) {
  return path.resolve(
    genstuff.getDestinationBasePath(),
    genstuff.renderString(
      normalizePath(config.path) || "",
      getFullData(data, config),
    ),
  )
}

function getRenderedTemplatePath({ data, config, genstuff }: any) {
  if (config.templateFile) {
    var absTemplatePath = path.resolve(
      genstuff.getGenstuffFilePath(),
      config.templateFile,
    )
    return genstuff.renderString(
      normalizePath(absTemplatePath),
      getFullData(data, config),
    )
  }

  return null
}

async function getTemplate({ data, config, genstuff }: any) {
  var makeTemplatePath = (filepath: string) =>
    path.resolve(genstuff.getGenstuffFilePath(), filepath)

  var template = config.template

  if (config.templateFile) {
    template = await readFile(makeTemplatePath(config.templateFile))
  }

  if (!template) {
    template = ""
  }

  return template
}

async function getRenderedTemplate({ data, config, genstuff }: any) {
  var template = await getTemplate({ data, config, genstuff })
  return genstuff.renderString(template, getFullData(data, config))
}

async function getTransformedTemplate({ data, config, template }) {
  // transform() was already typechecked at runtime in interface check

  if (!("transform" in config)) {
    return template
  }

  var result = await config.transform(template, data)

  if (typeof result !== "string") {
    var message = `Invalid return value for transform (${JSON.stringify(result)} is not a string)`
    throw new TypeError(message)
  }

  return result
}

export {
  normalizePath,
  makeDestinationPath,
  getRenderedTemplatePath,
  getTemplate,
  getTransformedTemplate,
  getRelativeToBasePath,
  getRenderedTemplate,
}
