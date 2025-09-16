import { access, readFile } from "node:fs/promises"
import type { RunGeneratorActionFn } from "../core/runner.ts"
import { writeFile } from "node:fs/promises"
import { deleteAsync } from "del"
import { mkdirp } from "mkdirp"
import path from "node:path"

type WriteActionConfig = {
  templatePath: string
  // deno-lint-ignore no-explicit-any
  data?: any
  destination: string
  writeMode?: "skip-if-exists" | "force"
}

export function write(config: WriteActionConfig): RunGeneratorActionFn {
  return async (params) => {
    await mkdirp(path.dirname(config.destination))

    const template = (await readFile(config.templatePath)).toString()

    const rendered = params.genstuff.renderString({
      data: config.data,
      template: template,
    })

    const isFileExist = await fileExists(config.destination)

    if (isFileExist && config.writeMode === "force") {
      await deleteAsync([config.destination], { force: true })
    }

    if (isFileExist) {
      if (config.writeMode === "skip-if-exists") {
        console.info(`[SKIPPED] ${config.destination} (exists)`)
        return
      }

      throw `File already exists\n -> ${config.destination}`
    }

    await writeFile(config.destination, rendered)
  }
}

function fileExists(destination: string) {
  return access(destination).then(
    () => true,
    () => false,
  )
}
