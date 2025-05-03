import type inquirer from "inquirer"

export type Prompts = Parameters<typeof inquirer.prompt>[0]
