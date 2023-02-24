import { Args, Command, Flags } from "@oclif/core"
import { Component } from "../lib/component"
import fs = require("node:fs")
import { writeFile } from "node:fs/promises"
import { exec } from "node:child_process"
import { Stories } from "../lib/stories"

const configs = {
  ui: "src/components/ui",
  common: "src/components/common",
  views: "src/components/views",
} as const

export default class Gen extends Command {
  static description = "describe the command here"
  static examples = ["<%= config.bin %> <%= command.id %>"]

  static flags = {
    props: Flags.string({ char: "p" }),
    stories: Flags.boolean({ char: "s" }),
    default: Flags.boolean({ char: "D" }),
    folder: Flags.string({ char: "f", default: "ui" }),
  }

  static args = {
    componentName: Args.string({ description: "file to read" }),
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Gen)

    if (!args.componentName) throw new Error("Must be component name")

    const component = args.componentName

    let writePath

    assertPath(flags.folder)
    writePath = configs[flags.folder]

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
    const storiesContent = flags.stories
      ? Stories.getStories(component, flags.props)
      : null

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
    exec("prettier --write " + `${writePath}/${component}/*`)
  }
}

function assertPath(path: string): asserts path is keyof typeof configs {
  if (!(path in configs)) throw new Error("path error")
}
