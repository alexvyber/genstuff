import { readFile } from "node:fs/promises"
import type { RunGeneratorActionFn } from "../core/runner.js"
import type { Template } from "../types/action.types.js"
import { writeFile } from "node:fs/promises"

type WriteActionConfig = Template & { path: string } & { data?: any }
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

    await writeFile(config.path, rendered)
  }
}
