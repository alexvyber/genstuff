import { Command } from "@oclif/core"

import { loadConfig } from "c12"
import { run__TODO_chooseBetterName } from "../lib/utils.js"

export default class Gen extends Command {
  static override description = "describe the command here"
  static override examples = ["<%= config.bin %> <%= command.id %>"]

  // static override args = {};
  // static override flags = {};

  public async run(): Promise<void> {
    // const { args, flags } = await this.parse(Gen);

    const config = await loadConfig({ name: "genstuff" })

    await run__TODO_chooseBetterName(config.config.generators)
  }
}
