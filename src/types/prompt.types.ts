import type inquirer from "inquirer"

// type Inquirer = typeof inquirer

// export type DynamicPromptsFunction = (inquirer: Inquirer) => Promise<Answers>
export type Prompts = Parameters<typeof inquirer.prompt>[0]
//  | DynamicPromptsFunction
