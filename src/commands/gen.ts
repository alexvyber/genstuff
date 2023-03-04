import { Args, Command, Flags } from '@oclif/core'
import { Component } from '../lib/component'
import fs = require('node:fs')
import { writeFile } from 'node:fs/promises'
import { exec } from 'node:child_process'
import { Stories } from '../lib/stories'

const configs = {
  ui: 'src/components/ui',
  common: 'src/components/common',
  templates: 'src/components/templates',
  views: 'src/components/views',
} as const

export default class Gen extends Command {
  static description = 'describe the command here'
  static examples = ['<%= config.bin %> <%= command.id %>']

  static flags = {
    props: Flags.string({ char: 'p' }),
    stories: Flags.boolean({ char: 's' }),
    defaultExport: Flags.boolean({ char: 'D' }),
    path: Flags.string({ default: 'ui' }),
    extend: Flags.string({ char: 'e' }),
    // force: Flags.boolean({ char: "f", default: false }),
    cvax: Flags.string({ char: 'x' }),
    displayName: Flags.string(),
  }

  static args = {
    componentName: Args.string({ description: 'file to read' }),
  }

  public async run(): Promise<void | void[]> {
    const { args, flags } = await this.parse(Gen)
    if (!args.componentName) throw new Error('Must be component name')

    const component = new Component({
      componentName: args.componentName,
      props: flags.props,
    }) //.getComponent({ componentName, props, cvax })

    if (flags.displayName) component.setDisplayName(flags.displayName)

    // component.getTypedProps(flags.props)
    component.printShit({
      parsedProps: true,
    })
  }
}

/*

















































































*/

// async function writeStories({
//   writePath,
//   componentFolder,
//   componentName,
//   props,
// }: {
//   writePath: string
//   componentFolder: string
//   componentName: string
//   props: string | undefined
// }): Promise<void> {
//   const storiesPath = `${writePath}/${componentFolder}/${componentName}.stories.tsx`
//   const storiesContent = Stories.getStories(componentName, props)

//   return write(storiesPath, storiesContent)
// }

// async function writeComponent({
//   writePath,
//   componentFolder,
//   componentName,
//   props,
//   extend = false,
//   cvax,
// }: {
//   writePath: string
//   componentFolder: string
//   componentName: string
//   props?: string
//   extend?: boolean
//   cvax?: string
// }): Promise<void> {
//   const componentPath = `${writePath}/${componentFolder}/${componentName}.tsx`
//   // const componentContent = extend
//   //   ? Component.getExtendingComponent({ componentFolder, componentName, props, cvax })
//   //   : Component.getComponent({ componentName, props, cvax })

//   const componentContent = new Component(componentName).getComponent({ componentName, props, cvax })

//   return write(componentPath, componentContent)
// }

// async function writeIndex({
//   writePath,
//   componentFolder,
//   componentName,
//   append = false,
//   defaultExport = false,
// }: {
//   writePath: string
//   componentFolder: string
//   componentName: string
//   append?: boolean
//   defaultExport?: boolean
// }): Promise<void> {
//   const indexPath = `${writePath}/${componentFolder}/index.ts`

//   if (append) {
//     const indexContent = fs.readFileSync(indexPath, 'utf8')
//     const newIndexContent = indexContent + Component.getIndex(componentName, defaultExport)

//     return await write(indexPath, newIndexContent, true)
//   }

//   const indexContent = Component.getIndex(componentName, defaultExport)
//   return await write(indexPath, indexContent)
// }

// async function write(path: string, content: string, override: boolean = false) {
//   if (override)
//     return await writeFile(path, content, {
//       mode: 0o644,
//     })

//   if (fs.existsSync(path)) throw new Error(`${path} exist`)

//   return await writeFile(path, content, {
//     mode: 0o644,
//   })
// }

// function assertPath(path: string): asserts path is keyof typeof configs {
//   if (!(path in configs)) throw new Error('path error')
// }
