import { access, readFile } from "node:fs/promises"
import type { RunGeneratorActionFn } from "../core/runner.js"
import type { Template } from "../types/action.types.js"
import { writeFile } from "node:fs/promises"
import { deleteAsync } from "del"
import { mkdirp } from "mkdirp"
import path from "node:path"

type WriteActionConfig = Template & { path: string } & { data?: any } & {
  writeMode?: "skip-if-exists" | "force"
}
// | (Template & { config: string })
// | (Templates & { destination: string; path: string })
// | (Templates & { destination: string; config: string });

export function write(config: WriteActionConfig): RunGeneratorActionFn {
  return async (params) => {
    const template =
      config.templateString ?? (await readFile(config.templateFile)).toString()

    const rendered = params.genstuff.renderString({
      data: config.data,
      template: template,
    })

    const isFileExist = await fileExists(config.path)

    if (isFileExist && config.writeMode === "force") {
      await deleteAsync([config.path], { force: true })
    }

    // we can't create files where one already exists
    if (isFileExist) {
      if (config.writeMode === "skip-if-exists") {
        console.info(`[SKIPPED] ${config.path} (exists)`)
        return
      }

      throw `File already exists\n -> ${config.path}`
    }

    await mkdirp(path.dirname(config.path))

    await writeFile(config.path, rendered)
  }
}

function fileExists(path: string) {
  return access(path).then(
    () => true,
    () => false,
  )
}
