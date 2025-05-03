import { ai } from "./actions/ai"
import { prompts, type InferPromptsOutputs } from "./actions/prompts"
import { write } from "./actions/write"
import { defineConfig, generator } from "./core/utils"
import { actions } from "./types/types"

const promptsAction = prompts([{ type: "input", message: "Name?", name: "name" }])
const promptsAction2 = prompts([{ type: "input", message: "Props?", name: "props" }])
const promptsAction3 = prompts([{ type: "input", message: "asdf", name: "adsf" }])

type Propmts = InferPromptsOutputs<
  [typeof promptsAction, typeof promptsAction2, typeof promptsAction3]
>

const gen = generator({
  name: "some",
  description: "desc",
  actions: actions<Propmts>([
    promptsAction,

    write({ path: "asdf", file: "asdf" }),

    promptsAction2,

    ai({
      model: "gemeni-2.5",
      path: "asdfasdf",
      provider: "google",
      template: "asdfasdf",
      prompt: ({ gen, answers, context }) => {
        return ""
      },
    }),

    write({ path: "asdf", file: "asdf" }),

    write({ path: "./src/some/**/*", destination: "./adsf", templates: ["asdf"] }),

    promptsAction3,

    ({ gen, answers, context }) => {
      answers.props
    },
  ]),
})

const two = generator({
  name: "some",
  description: "desc",
  actions: actions<Propmts>([
    promptsAction,

    write({ path: "asdf", file: "asdf" }),

    promptsAction2,

    ai({
      model: "gemeni-2.5",
      path: "asdfasdf",
      provider: "google",
      template: "asdfasdf",
      prompt: ({ gen, answers, context }) => {
        return ""
      },
    }),

    write({ path: "asdf", file: "asdf" }),

    write({ path: "./src/some/**/*", destination: "./adsf", templates: ["asdf"] }),

    promptsAction3,

    ({ gen, answers, context }) => {
      answers.props
    },
  ]),
})

const config = defineConfig({
  generators: [gen, two],
})
