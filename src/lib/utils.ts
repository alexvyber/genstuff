import { styleText } from "node:util"
import { Genstuff } from "../core/genstuff.js"
import type { GeneratorType } from "../types/types.js"
import { prompt } from "../actions/prompt.js"
import { runGeneratorActions } from "../core/runner.js"
import { merge } from "es-toolkit/compat"

// var defaultChoosingMessage = `${styleText("blue", "[GENSTUFF]")} Please choose a generator.`

export async function runFirstGenerator(
  config: {
    generators: GeneratorType[]
    initContext?: () => Record<string, any>
  },
  // message = defaultChoosingMessage,
): Promise<void> {
  var genstuff = new Genstuff()

  if (config.generators.length === 1) {
    const generator = config.generators[0]
    await runGeneratorActions({
      ctx:
        merge(generator.initContext?.() ?? {}, config.initContext?.() ?? {}) ??
        {},
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
        const generator = config.generators.find(
          (generator) => generator.name === params.ctx.answers.generator,
        )

        if (!generator) {
          console.error("No generator found")
          process.exit(1)
        }

        await runGeneratorActions({
          ctx: config.initContext?.() ?? {},
          genstuff: genstuff,
          generator,
        })
      },
    ],
  })

  await runGeneratorActions({
    ctx: {},
    genstuff: genstuff,
    generator: genstuff.get("generator", "choose"),
  })
}

var typeDisplay = {
  function: styleText("yellow", "->"),
  add: styleText("green", "++"),
  addMany: styleText("green", "+!"),
  modify: `${`${styleText("green", "+")}${styleText("red", "-")}`}`,
  append: styleText("green", "_+"),
  skip: styleText("green", "--"),
}

export function typeMap(name: keyof typeof typeDisplay, noMap: boolean = true) {
  var dimType = styleText("dim", name)
  return noMap ? dimType : typeDisplay[name] || dimType
}
