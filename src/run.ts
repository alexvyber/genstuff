import { modify } from "./actions/modify"
import { prompts, type InferPromptsOutput } from "./actions/prompts"
import { wirte } from "./actions/write"
import { wirteMany } from "./actions/write-many"
import { defineConfig, generator } from "./core/utils"

const promptsAction = prompts([
  {
    type: "input",
    message: "asdf",
    name: "adsf",
  },
])

const promptsAction2 = prompts([
  {
    type: "input",
    message: "asdf",
    name: "kek",
  },
])

type Propmts = InferPromptsOutput<typeof promptsAction>


const gen = generator({
  name: "some",
  description: "desc",
  actions: () => [
    promptsAction,

    wirte({ path: "asdf", file: "asdf", context }),
    promptsAction2,

    wirte({ path: "asdf", file: "asdf", context }),

    wirteMany({ base: "./src/some/**/*", destination: "./adsf", templates: ["asdf"] }),

    ({ gen }) => {},

    prompts([
      {
        type: "input",
        message: "asdf",
        name: "adsf",
        // message: "asdf",
        // name:"asdfadsf",
      },
    ]),
  ],
})

const config = defineConfig({
  generators: [gen],
})
