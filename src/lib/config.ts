import minimist from "minimist"
import { Genstuff } from "../core/genstuff"
import path from "node:path"
import { existsSync } from "node:fs"

import * as v from "valibot"
import type { GeneratorType } from "../types/types"

function loadConfig(env: {
  cwd: string
  config?: string | undefined
}) {
  var finalpath = env.config ? path.resolve(env.cwd, env.config) : findConfig(env.cwd)
  console.log("🚀 ~ finalpath:", finalpath)

  if (!finalpath) {
    throw new Error("No config file found")
  }

  return import(finalpath)
}

function findConfig(cwd: string) {
  for (var ext of ["js", "cjs", "ts", "mjs", "cts", "mts"]) {
    var name = `genstuff.${ext}`

    var fullpath = path.resolve(cwd, name)

    if (existsSync(fullpath)) {
      return fullpath
    }
  }

  return undefined
}

function loadEnv(args: minimist.ParsedArgs) {
  var EnvSchema = v.object({
    cwd: v.optional(v.string(), process.cwd()),
    config: v.optional(v.string()),
  })

  var env = v.parse(EnvSchema, { cwd: args.cwd, config: args.config })

  return env
}

async function parseConfig(config: unknown): Promise<{ generators: GeneratorType[] }> {
  var PromptsSchema = v.object({
    type: v.string(),
    name: v.string(),
    message: v.optional(v.string()),
    parse: v.optional(v.function()),
  })

  var Schema = v.object({
    default: v.object({
      generators: v.array(
        v.object({
          name: v.string(),
          description: v.optional(v.string()),
          prompts: v.array(PromptsSchema),
          actions: v.optional(v.union([v.function(), v.record(v.string(), v.any())])),
          parse: v.optional(v.function()),
        }),
      ),
    }),
  })

  var parsed = v.parse(Schema, config)

  return parsed.default as any
}

export { loadConfig, loadEnv, parseConfig }
