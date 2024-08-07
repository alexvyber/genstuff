import { Args, Flags } from "@oclif/core"
import { GeneratorCommand } from "../../generator.js"
import { kebabCase } from "change-case"
import { join } from "node:path"
import { camelCase } from "change-case/keys"

export default class FastifyRoute extends GeneratorCommand<typeof FastifyRoute> {
  static override args = {
    name: Args.string({ description: "route name", required: true }),
  }

  static override flags = {
    path: Flags.string({ default: "", charAliases: ["p"] }),
  }

  static override description = "Generate fastify route"

  static override examples = ["<%= config.bin %> <%= command.id %>"]
  async run(): Promise<void> {
    const indexPath = join(process.cwd(), kebabCase(this.flags.path), `${kebabCase(this.args.name)}.tsx`)

    await this.template(join(this.templatesDir, "fastify", "route.ts.ejs"), indexPath, {
      camelName: camelCase(this.args.name),
      kebabName: kebabCase(this.args.name),
    })
  }
}
