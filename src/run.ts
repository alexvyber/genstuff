#!/usr/bin/env node

import ora from "ora"
import minimist from "minimist"
import chalk from "chalk"

import { getBypassAndGenerator } from "./lib/input-processing"
import { Genstuff } from "./core/genstuff"
import type { GeneratorType } from "./types/types"
import { runGeneratorActions, runGeneratorPrompts } from "./core/runner"
import { getErrorMessage } from "./lib/get-error-message"
import { handleBasicArgFlags } from "./lib/handle-arg-flags"
import { chooseOptionFromList, typeMap } from "./lib/console-out"
import { Hooks } from "./lib/hooks"
import { loadEnv, loadConfig, parseConfig } from "./lib/config"
import { combineBypassData } from "./lib/bypass"

async function run() {
  var passArgsBeforeDashes = true

  var args = process.argv.slice(2)
  console.log("🚀 ~ run ~ args:", args)
  var argv = minimist(args)
  var env = loadEnv(argv)
  console.log("🚀 ~ run ~ env:", env)

  handleBasicArgFlags({ argv: argv, env: env })

  var cofnfigContent = await loadConfig(env)
  var config = await parseConfig(cofnfigContent)
  var gen = await init()

  setGenerators(gen, config.generators)

  // var { generatorName, genArgv, bypassArray } = getBypassAndGenerator({
  //   args,
  //   argv,
  //   gen,
  //   passArgsBeforeDashes,
  // })

  var generator = await getGenerator({
    generatorName: "config",
    gen,
    bypassArray: [],
  })

  // var bypassData = combineBypassData({generator, bypassArray: [], genArgv: []})

  return doTheGenstuff({ generator, bypassArray: [], gen })
}

function setGenerators(gen: Genstuff, generators: GeneratorType[]): void {
  for (const generator of generators) {
    gen.setGenerator(generator.name, generator)
  }
}

async function getGenerator({
  gen,
  bypassArray,
  generatorName,
}: {
  gen: Genstuff
  bypassArray?: string[]
  generatorName?: string
}): Promise<GeneratorType> {
  var generators = gen.list("generators", { full: true })

  if (!generators.length) {
    console.error(`${chalk.red("[GENSTUFF]")} No generator found in genstuff`)
    process.exit(1)
  }

  if (!generatorName && generators.length === 1) {
    return generators[0]!
  }

  if (!generatorName && generators.length > 1 && !bypassArray?.length) {
    try {
      var name = await chooseOptionFromList(generators, gen.getWelcomeMessage())
      var generator = gen.get("generator", name)
      return generator
    } catch (error) {
      console.error(`${chalk.red("[GENSTUFF]")} Something went wrong with selecting a generator`)
      console.error(getErrorMessage(error))
    }
  }

  var maybeGenerator = generators.find((generator) => generator.name === generatorName)
  if (maybeGenerator) {
    return maybeGenerator
  }

  var message = `${chalk.red("[GENSTUFF]")} Could not find a generator for "${generatorName}"`
  console.error(message)
  process.exit(1)
}

async function doTheGenstuff({
  gen,
  generator,
  bypassArray,
  disableSpinner,
}: {
  gen: Genstuff
  generator: GeneratorType
  bypassArray: string[]
  disableSpinner?: boolean
}) {
  var rawAnswers = await runGeneratorPrompts({ generator, bypassArray })

  var answers = generator?.parse ? generator.parse(rawAnswers) : rawAnswers

  try {
    var spinner = ora({
      stream: process.env.NODE_ENV === "test" ? process.stdout : process.stderr,
      isEnabled: process.env.NODE_ENV !== "test" && !disableSpinner,
    })

    spinner.start()

    var res = await runGeneratorActions({
      answers,
      hooks: new Hooks(spinner),
      gen,
      generator,
    })

    spinner.stop()

    if (res.failures.length) {
      throw res.failures[0]
    }
  } catch (error) {
    console.error(chalk.red("[ERROR]"), getErrorMessage(error))
    process.exit(1)
  }
}

async function init(params?: {

}): Promise<Genstuff> {
  return new Genstuff()

}

export { run }
