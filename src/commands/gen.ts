import { Args, Command, Flags } from "@oclif/core"
import { Component } from "../lib/component"

import fs = require("node:fs")
import { writeFile } from "node:fs/promises"
import { exec } from "node:child_process"
import { Stories } from "../lib/stories"

const configs = {
  defaultFolder: "components",
}

export default class Gen extends Command {
  static description = "describe the command here"

  static examples = ["<%= config.bin %> <%= command.id %>"]

  static flags = {
    where: Flags.string({ char: "w" }),
    props: Flags.string({ char: "p" }),
    stories: Flags.boolean({ char: "s" }),
    default: Flags.boolean({ char: "D" }),
  }

  static args = {
    componentName: Args.string({ description: "file to read" }),
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Gen)

    if (!args.componentName) throw new Error("Must be component name")

    const component = args.componentName
    const writePath = flags.where || configs.defaultFolder

    if (!fs.existsSync(writePath)) {
      fs.mkdirSync(writePath)
    }

    if (!fs.existsSync(`${writePath}/${component}`)) {
      fs.mkdirSync(`${writePath}/${component}`)
    }

    // paths
    const componentPath = `${writePath}/${component}/${component}.tsx`
    const indexPath = `${writePath}/${component}/index.ts`
    const storiesPath = `${writePath}/${component}/${component}.stories.tsx`

    // file's content
    const componentContent = Component.getComponent(component, flags.props)
    const indexContent = Component.getIndex(component, flags.default)
    const storiesContent = flags.stories ? Stories.getStories(component) : null

    // write content to the files
    await Promise.all([
      await writeFile(componentPath, componentContent, {
        mode: 0o644,
      }),

      await writeFile(indexPath, indexContent, {
        mode: 0o644,
      }),

      storiesContent &&
        (await writeFile(storiesPath, storiesContent, {
          mode: 0o644,
        })),
    ])

    // format written files
    exec("prettier --write " + `${writePath}/${component}/index.ts`)
    exec("prettier --write " + `${writePath}/${component}/${component}.tsx`)
    exec(
      "prettier --write " +
        `${writePath}/${component}/${component}.stories.tsx`,
    )
  }
}
