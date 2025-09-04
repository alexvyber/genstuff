import { Command } from "@oclif/core"

import { loadConfig } from "c12"
import { runFirstGenerator } from "../lib/utils.js"
import * as v from "valibot"

export default class Gen extends Command {
  static override description = "describe the command here"
  static override examples = ["<%= config.bin %> <%= command.id %>"]

  // static override args = {};
  // static override flags = {};

  public async run(): Promise<void> {
    // const { args, flags } = await this.parse(Gen);

    const config = await loadConfig({ name: "genstuff" })

    await runFirstGenerator(validateConfig(config.config))
  }
}

function validateConfig(config: unknown) {
  const schema = v.object({
    name: v.string(),
    description: v.optional(v.string()),
    initContext: v.optional(v.any()),
    generators: v.array(
      v.object({
        name: v.string(),
        initContext: v.optional(v.any()),
        actions: v.array(v.any()),
      }),
    ),
  })

  return v.parse(schema, config)
}
