import { Args, Flags } from "@oclif/core"
import { GeneratorCommand } from "../../generator.js"

export default class NextLayout extends GeneratorCommand<typeof NextLayout> {
  static override args = {
    file: Args.string({ description: "file to read" }),
  }

  static override description = "describe the command here"

  static override examples = ["<%= config.bin %> <%= command.id %>"]

  static override flags = {
    force: Flags.boolean({ char: "f" }),
    name: Flags.string({ char: "n", description: "name to print" }),
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(NextLayout)

    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}
