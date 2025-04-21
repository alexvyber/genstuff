import chalk from "chalk"
import fs from "node:fs"
import { Genstuff } from "../core/genstuff"
import type { GeneratorType } from "../types/types"
import { runGeneratorPrompts } from "../core/runner"

var defaultChoosingMessage = `${chalk.blue("[GENSTUFF]")} Please choose a generator.`

function getHelpMessage(generator: GeneratorType) {
  if (!generator.prompts) {
    return
  }

  var lengths = generator.prompts?.map((prompt) => prompt.name.length)
  var maxLenght = lengths?.length ? Math.max(...lengths) : 0
  var messageArray = ["", chalk.bold("Options:")]

  for (var prompt of generator.prompts) {
    var message = `  --${prompt.name}${" ".repeat(maxLenght - prompt.name.length + 2)}${chalk.dim(prompt.message)}`
    messageArray.push(message)
  }

  console.log(messageArray.join("\n"))
}

async function chooseOptionFromList(generators: GeneratorType[], message: string): Promise<string> {
  var genstuff = new Genstuff()

  var generator = genstuff
    .setGenerator("choose", {
      actions: () => [],
      name: "choose",
      prompts: [
        {
          type: "list",
          name: "generator",
          message: message ?? defaultChoosingMessage,
          choices: generators.map(({ name, description }) => ({
            name: name + description ? chalk.gray(` - ${description}`) : "",
            value: name,
          })),
        },
      ],
    })
    .get("generator", "choose")

  return runGeneratorPrompts({ generator }).then((answers) => answers.generator)
}

function createInitGenstufffile(force = false, useTypescript = false) {
  var initString = useTypescript
    ? "import type { NodeGenstuffAPI } from 'genstuff'\n" +
      "\n" +
      "export default async function (genstuff: NodeGenstuffAPI) {\n" +
      "\n" +
      "}\n" +
      "\n"
    : "export default function (genstuff) {\n\n" +
      "\tplop.setGenerator('basics', {\n" +
      "\t\tdescription: 'this is a skeleton genstuff',\n" +
      "\t\tprompts: [],\n" +
      "\t\tactions: []\n" +
      "\t});\n\n" +
      "};"

  for (var ext of ["js", "cjs", "ts", "mjs", "cts", "mts"]) {
    var name = `genstuff.${ext}`

    if (fs.existsSync(`${process.cwd()}/${name}`) && force === false) {
      throw Error(`"${name}" already exists at this location.`)
    }
  }

  var outExt = useTypescript ? "ts" : "js"

  fs.writeFileSync(`${process.cwd()}/genstuff.${outExt}`, initString)
}

var typeDisplay = {
  function: chalk.yellow("->"),
  add: chalk.green("++"),
  addMany: chalk.green("+!"),
  modify: `${chalk.green("+")}${chalk.red("-")}`,
  append: chalk.green("_+"),
  skip: chalk.green("--"),
}

function typeMap(name: keyof typeof typeDisplay, noMap: boolean = true) {
  var dimType = chalk.dim(name)
  return noMap ? dimType : typeDisplay[name] || dimType
}

export { chooseOptionFromList, createInitGenstufffile, typeMap, getHelpMessage }
