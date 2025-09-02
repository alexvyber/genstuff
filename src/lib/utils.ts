import { styleText } from "node:util"
import { Genstuff } from "../core/genstuff.js"
import type { GeneratorType } from "../types/types.js"
import { prompt } from "../actions/prompt.js"
import { runGeneratorActions } from "../core/runner.js"

// var defaultChoosingMessage = `${styleText("blue", "[GENSTUFF]")} Please choose a generator.`

export async function run__TODO_chooseBetterName(
  generators: GeneratorType[],
  // message = defaultChoosingMessage,
): Promise<void> {
  var genstuff = new Genstuff()

  genstuff.setGenerator("choose", {
    actions: [
      prompt([
        {
          type: "select",
          choices: generators.map(({ name, description }) => ({
            name,
            hint: description,
          })),
          message: "select",
          name: "generator",
        },
      ]),

      async (params) => {
        const generator = generators.find(
          (generator) => generator.name === params.ctx.answers.generator,
        )

        if (!generator) {
          console.error("No generator found")
          process.exit(1)
        }

        await runGeneratorActions({
          ctx: {},
          genstuff: genstuff,
          generator,
        })
      },
    ],
    name: "choose",
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
