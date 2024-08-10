import { GeneratorCommand } from "../../generator.js"
import { join } from "node:path"

// TODO: resolve this
// TMP: works just fine at time of writing
// @ts-ignore
import routes from "../../../tmp/fastify/routes.js"
import { camelCase } from "change-case"
import { existsSync } from "node:fs"
import { mkdir, writeFile } from "node:fs/promises"
import { Flags } from "@oclif/core"

export default class FastifyRoute extends GeneratorCommand<typeof FastifyRoute> {
  static override description = "Generate fastify route"

  static override examples = ["<%= config.bin %> <%= command.id %>"]

  static override flags = {
    path: Flags.string({ char: "p", default: undefined }),
  }

  async run(): Promise<void> {
    const router = new Map<string, Set<string>>()

    for (const { method, path: path_ } of routes) {
      const path = path_.endsWith("/") ? path_ : `${path_}/`
      if (!router.has(path)) {
        router.set(path, new Set())
      }
      // @ts-expect-error: broken ts
      router.get(path).add(method)
    }

    const filesContent = new Map<string, { pluginName: string; content: string[]; indexPath: string }>()

    for (const [route, methods] of router.entries()) {
      const dirpath = join(process.cwd(), this.flags.path ?? "", route.split(":")[0])

      const config: { pluginName: string; content: string[]; indexPath: string } = {
        content: [],
        pluginName: camelCase(route.split(":")[0].split("/").filter(Boolean).join(" ")),
        indexPath: join(dirpath, "index.ts"),
      }

      for (const method of methods.values()) {
        config.content.push(regMethod(route, method))
      }

      if (filesContent.has(dirpath)) {
        // @ts-expect-error: broken ts
        filesContent.get(dirpath).content.push(...config.content)
      } else {
        filesContent.set(dirpath, config)
      }
    }

    for (const [dirpath, { indexPath, content, pluginName }] of filesContent.entries()) {
      try {
        if (!existsSync(dirpath)) {
          await mkdir(dirpath, { recursive: true })
        }
        await writeFile(indexPath, regPlugin(pluginName, content))
      } catch (error) {
        console.error(error)
      }
    }
  }
}

const regMethod = (route: string, method: string) =>
  tag`fastify.${method}("${route}", {}, async (request, reply) => { reply.send({ ok: true })})`

const regPlugin = (name: string, content: string[]) =>
  tag`import { FastifyPluginAsync } from "fastify";

const ${name}: FastifyPluginAsync = async (fastify, opts): Promise<void> => { ${content.join(";\n\n")} }; 

export default ${name};`

function tag(strings: TemplateStringsArray, ...expressions: string[]) {
  let str = ""
  for (let i = 0; i < strings.length; i++) {
    str += strings[i] + (expressions[i] ?? "")
  }
  return str
}
