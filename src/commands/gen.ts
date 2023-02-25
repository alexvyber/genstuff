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
    defaultExport: Flags.boolean({ char: "D" }),
    folder: Flags.string({ char: "f", default: "ui" }),
    extend: Flags.string({ char: "e" }),
  }

  static args = {
    componentName: Args.string({ description: "file to read" }),
  }

  public async run(): Promise<void | void[]> {
    const { args, flags } = await this.parse(Gen)

    if (!args.componentName) throw new Error("Must be component name")

    const component = args.componentName

    assertPath(flags.folder)
    const writePath = configs[flags.folder]

    if (!fs.existsSync(writePath)) {
      fs.mkdirSync(writePath)
    }

    if (flags.extend) {
      if (flags.extend === args.componentName) throw new Error("Components have the same name")

      if (!fs.existsSync(`${writePath}/${flags.extend}/${flags.extend}.tsx`))
        throw new Error("Component doesn't exist")

      Promise.all([
        writeFiles({
          writePath,
          componentFolder: flags.extend,
          componentName: component,
          props: flags.props,
          stories: flags.stories,
          defaultExport: flags.defaultExport,
          extend: true,
        }),

        await writeIndex({
          writePath,
          componentFolder: flags.extend,
          componentName: component,
          append: true,
        }),
      ])
    } else {
      if (fs.existsSync(`${writePath}/${component}`)) throw new Error("Component Exist")
      fs.mkdirSync(`${writePath}/${component}`)

      Promise.all([
        writeFiles({
          writePath,
          componentFolder: component,
          componentName: component,
          props: flags.props,
          stories: flags.stories,
          defaultExport: flags.defaultExport,
        }),

        await writeIndex({
          writePath,
          componentFolder: component,
          componentName: component,
        }),
      ])
    }

    // format written files
    exec("prettier --write " + `${writePath}/${flags.extend || args.componentName}/*`)
  }
}

async function writeFiles({
  writePath,
  componentFolder,
  componentName,
  props,
  stories,
  extend = false,
  defaultExport: _ = false,
}: {
  writePath: string
  componentFolder: string
  componentName: string
  props: string | undefined
  stories: boolean | undefined
  extend?: boolean | undefined
  defaultExport: boolean
}) {
  // paths
  const componentPath = `${writePath}/${componentFolder}/${componentName}.tsx`
  // const indexPath = `${writePath}/${componentFolder}/index.ts`
  const storiesPath = `${writePath}/${componentFolder}/${componentName}.stories.tsx`

  if (fs.existsSync(componentPath)) throw new Error("Component Exist")
  if (fs.existsSync(storiesPath)) throw new Error("Stories Exist")

  // file's content
  const componentContent = extend
    ? Component.getExtendingComponent(componentFolder, componentName, props)
    : Component.getComponent(componentName, props)
  // const indexContent = Component.getIndex(componentName, defaultExport)
  const storiesContent = stories ? Stories.getStories(componentName, props) : null

  // write content to the files
  await Promise.all([
    await writeFile(componentPath, componentContent, {
      mode: 0o644,
    }),

    storiesContent &&
      (await writeFile(storiesPath, storiesContent, {
        mode: 0o644,
      })),
  ])
}

async function writeIndex({
  writePath,
  componentFolder,
  componentName,
  append = false,
  defaultExport = false,
}: {
  writePath: string
  componentFolder: string
  componentName: string
  append?: boolean
  defaultExport?: boolean
}) {
  const indexPath = `${writePath}/${componentFolder}/index.ts`

  if (append) {
    const indexContent = fs.readFileSync(indexPath, "utf8")
    const newIndexContent = indexContent + Component.getIndex(componentName, defaultExport)

    return await writeFile(indexPath, newIndexContent, {
      mode: 0o644,
    })
  }

  const indexContent = Component.getIndex(componentName, defaultExport)
  return await writeFile(indexPath, indexContent, {
    mode: 0o644,
  })
}

function assertPath(path: string): asserts path is keyof typeof configs {
  if (!(path in configs)) throw new Error("path error")
}
