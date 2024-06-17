import { Args, Command, Flags } from "@oclif/core"

export default class ReactComponent extends Command {
  static override args = {
    name: Args.string({ description: "component name" }),
  }

  static override description = "describe the command here"

  static override examples = ["<%= config.bin %> <%= command.id %>"]

  static override flags = {
    props: Flags.string({ char: "p" }),

    stories: Flags.boolean({ char: "s" }),

    test: Flags.boolean({ char: "t" }),

    defaultExport: Flags.boolean({ char: "D" }),

    path: Flags.string(),

    force: Flags.boolean({ char: "f", default: false }),

    cvax: Flags.string(),

    displayName: Flags.string(),

    rsc: Flags.boolean(),
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(ReactComponent)

    const name = flags.name ?? "world"
    this.log(`hello ${name} from /Users/alexs/@alexvyber/genstuff/src/commands/react/component.ts`)
    if (args.name && flags.force) {
      this.log(`you input --force and --name: ${args.name}`)
    }
  }
}
