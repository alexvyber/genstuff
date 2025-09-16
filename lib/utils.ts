import { styleText } from "node:util"
import { Genstuff } from "../core/genstuff.ts"
import type { GeneratorType } from "../types/types.ts"
import { prompt } from "../actions/prompt.ts"
import { run } from "../core/runner.ts"
import { merge } from "@es-toolkit/es-toolkit"
import process from "node:process"
import * as v from "@valibot/valibot"

type Config = {
  generators: GeneratorType[]
  initContext?: () => Record<string, unknown>
}

export async function runGenerator(
  config_: unknown,
  initContext: () => Record<string, unknown>,
): Promise<void> {
  const config = validateConfig(config_) as Config
  const genstuff = new Genstuff()

  if (config.generators.length === 1) {
    const generator = config.generators[0]
    await run({
      ctx: merge(merge(initContext?.() ?? {}, generator.initContext?.() ?? {}), config.initContext?.() ?? {}),
      genstuff: genstuff,
      generator: config.generators[0],
    })

    return
  }

  genstuff.setGenerator("choose", {
    name: "choose",
    actions: [
      prompt([
        {
          type: "select",
          choices: config.generators.map(({ name, description }) => ({
            name,
            hint: description,
          })),
          message: "select",
          name: "generator",
        },
      ]),

      async (params) => {
        if (
          !(params?.ctx?.answers &&
            typeof params?.ctx?.answers === "object" &&
            "generator" in params?.ctx?.answers)
        ) {
          throw new Error("No generators provided")
        }

        const generatorName = v.parse(v.string(), params?.ctx?.answers.generator)

        const generator = config.generators.find((generator) => generator.name === generatorName)

        if (!generator) {
          console.error("No generator found")
          process.exit(1)
        }

        await run({
          ctx: merge(merge(initContext?.() ?? {}, generator.initContext?.() ?? {}), config.initContext?.() ?? {}),
          genstuff: genstuff,
          generator,
        })
      },
    ],
  })

  await run({
    ctx: {},
    genstuff: genstuff,
    generator: genstuff.get("generator", "choose"),
  })
}

const typeDisplay = {
  function: styleText("yellow", "->"),
  add: styleText("green", "++"),
  addMany: styleText("green", "+!"),
  modify: `${`${styleText("green", "+")}${styleText("red", "-")}`}`,
  append: styleText("green", "_+"),
  skip: styleText("green", "--"),
}

export function typeMap(name: keyof typeof typeDisplay, noMap: boolean = true) {
  const dimType = styleText("dim", name)
  return noMap ? dimType : typeDisplay[name] || dimType
}

function validateConfig(config: unknown) {
  const schema = v.object({
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
