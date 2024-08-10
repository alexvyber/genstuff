import { Args } from "@oclif/core"
import { GeneratorCommand } from "../../generator.js"
import { kebabCase, camelCase } from "change-case"
import { join } from "node:path"

import routes from "../../routes.js"
import { writeFile } from "node:fs/promises"
import { existsSync, mkdirSync } from "node:fs"

export default class FastifyRoute extends GeneratorCommand<typeof FastifyRoute> {
  static override description = "Generate fastify route"

  static override examples = ["<%= config.bin %> <%= command.id %>"]

  async run(): Promise<void> {
    const router = new Map<string, Set<string>>()

    for (const { method, path } of routes) {
      let [take] = path.split(":")
      if (!take.endsWith("/")) take = `${take}/`

      console.log({ method, take })

      if (!router.has(take)) {
        router.set(take, new Set())
      }

      router.get(take)?.add(method)
    }

    for (const [route, methods] of router.entries()) {
      let content: string[] = []
      const dirPath = join(process.cwd(), route)
      const indexPath = join(dirPath, "index.ts")

      for (const method of methods.values()) {
        if (!existsSync(dirPath)) {
          mkdirSync(dirPath, { recursive: true })
        }
        content.push( regMethod(route, method))
      }

      try {
        await writeFile(indexPath, regPlugin(camelCase(route.split("/").filter(Boolean).join(" ")), content))
      } catch (error) {
        console.error(error)
      }
    }
  }
}

const regMethod = (route: string, method: string) =>
  registerMethod`fastify.${method}("${route}", {}, async (request, reply) => { reply.send({ ok: true })})`

function registerMethod(strings: TemplateStringsArray, ...expressions: [method: string, name: string]) {
  let str = ""
  for (let i = 0; i < strings.length; i++) {
    str += strings[i] + expressions[i]
  }
  return str
}

const regPlugin = (name: string, content: string[]) =>
  registerPlugin`import { FastifyPluginAsync } from "fastify"; const ${name} => { ${content.join(";")} }; export default ${name};`

function registerPlugin(strings: TemplateStringsArray, ...expressions: string[]) {
  let str = ""
  for (let i = 0; i < strings.length; i++) {
    str += strings[i] + expressions[i]
  }
  return str
}
