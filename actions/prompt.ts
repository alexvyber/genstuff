import enquirer from "enquirer"
import type { RunGeneratorActionFn } from "../core/runner.ts"

export function prompt(questions: Parameters<typeof enquirer.prompt>[0]): RunGeneratorActionFn {
  return async function executePrompts(params): Promise<void> {
    const answers = await enquirer.prompt(questions)

    if (!params.ctx.answers) {
      Object.assign(params.ctx, { answers: {} })
    }

    assertObject(params.ctx.answers)

    for (const [key, value] of Object.entries(answers)) {
      if (!value) {
        continue
      }

      Object.assign(params.ctx.answers, { [key]: value })
    }
  }
}

function assertObject(thing: unknown): asserts thing is object {
  if (!thing || typeof thing !== "object") throw new Error("Thnig is not an object")
}
