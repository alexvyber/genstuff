import { Args, Command, Errors, Flags } from "@oclif/core"
import { GeneratorCommand } from "../../generator.js"
import { join } from "node:path"
import { camelCase, kebabCase, pascalCase, snakeCase } from "change-case"

export default class ReactComponent extends GeneratorCommand<typeof ReactComponent> {
  static override args = {
    name: Args.string({ description: "component name", required: true }),
  }

  static override description = "Generate react component"

  static override examples = ["<%= config.bin %> <%= command.id %>"]

  static override flags = {
    props: Flags.string({ char: "p", default: undefined }),

    story: Flags.boolean({ char: "s", default: false }),

    test: Flags.boolean({ char: "t", default: false }),

    defaultExport: Flags.boolean({ char: "D", default: false }),

    path: Flags.string({ default: undefined }),

    force: Flags.boolean({ char: "f", default: false }),

    cvax: Flags.string({ default: undefined }),

    displayName: Flags.string({ default: undefined }),

    client: Flags.boolean({ default: false }),

    arrow: Flags.boolean({ default: false }),

    class: Flags.boolean({ default: false }),
  }

  async run(): Promise<void> {
    const destination = join(process.cwd(), `${kebabCase(this.args.name)}.tsx`)

    const opts = {
      className: pascalCase(this.args.name),
      name: this.args.name,
      path: destination,
      type: "command",
    }

    const templateFile = `component-${this.flags.class ? "class" : this.flags.arrow ? "arrow" : "function"}.tsx.ejs`
    await this.template(join(this.templatesDir, "react", templateFile), destination, opts)
  }
}
