import { Args } from "@oclif/core"
import { GeneratorCommand } from "../../generator.js"
import { kebabCase, camelCase } from "change-case"
import { join } from "node:path"

export default class FastifyRoute extends GeneratorCommand<typeof FastifyRoute> {
  static override args = {
    name: Args.string({ description: "route name", required: true }),
  }

  static override description = "Generate fastify route"

  static override examples = ["<%= config.bin %> <%= command.id %>"]

  async run(): Promise<void> {
    const kebabName = kebabCase(this.args.name)
    const camelName = camelCase(this.args.name)

    const indexPath = join(process.cwd(), kebabName, "index.ts")

    await this.template(join(this.templatesDir, "fastify", "route.ts.ejs"), indexPath, {
      camelName,
      kebabName,
    })
  }
}
