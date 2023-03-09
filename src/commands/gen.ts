import { Args, Command, Flags } from '@oclif/core'
import { Component } from '../lib/component'
import fs = require('node:fs')
import { exec } from 'node:child_process'
import { write } from '../lib/utils'

export default class Gen extends Command {
  static description = 'describe the command here'
  static examples = ['<%= config.bin %> <%= command.id %>']

  static flags = {
    props: Flags.string({ char: 'p' }),
    stories: Flags.boolean({ char: 's' }),
    defaultExport: Flags.boolean({ char: 'D' }),
    path: Flags.string({ default: 'ui', char: 'P' }),
    extend: Flags.string({ char: 'e' }),
    force: Flags.boolean({ char: 'f', default: false }),
    cvax: Flags.string({ char: 'x' }),
    display: Flags.string(),
    test: Flags.boolean(),
    ref: Flags.boolean(),
    // 'as-func': Flags.boolean({ default: false }),
    'no-variants': Flags.boolean(),
    'no-config': Flags.boolean(),
    'no-type': Flags.boolean(),
    'in-place': Flags.boolean(),
    'no-display': Flags.boolean(),
    pretty: Flags.boolean(),
  }

  static args = {
    componentName: Args.string({ description: 'file to read' }),
  }

  public async run(): Promise<void | void[]> {
    const { args, flags } = await this.parse(Gen)
    if (!args.componentName) throw new Error('Must be component name')

    const component = new Component({
      componentName: args.componentName,
      printDisplayName: !flags['no-display'],
      displayName: flags.display,
      props: flags.props,
      cvax: flags.cvax,
      ref: flags.ref,
      exports: {
        defaultExport: flags.defaultExport,
        variants: !flags['no-variants'],
        variantConfig: !flags['no-config'],
        propsType: !flags['no-type'],
        inPlace: flags['in-place']
          ? {
              component: true,
              types: true,
              variants: true,
              configs: true,
            }
          : undefined,
      },
    })

    if (!fs.existsSync(`src/components/${flags.path}`))
      fs.mkdirSync(`src/components/${flags.path}`)

    if (!fs.existsSync(`src/components/${flags.path}/${args.componentName}`))
      fs.mkdirSync(`src/components/${flags.path}/${args.componentName}`)

    write(
      `src/components/${flags.path}/${args.componentName}/${args.componentName}.tsx`,
      component.renderConst(),
      flags.force,
    )

    if (flags.stories)
      write(
        `src/components/${flags.path}/${args.componentName}/${args.componentName}.stories.tsx`,
        component.renderStories(),
        flags.force,
      )

    if (flags.test)
      write(
        `src/components/${flags.path}/${args.componentName}/${args.componentName}.test.tsx`,
        component.renderTest(),
        flags.force,
      )

    write(
      `src/components/${flags.path}/${args.componentName}/index.ts`,
      component.renderIndex(),
      flags.force,
    )

    // FIXME: rewrite to use prettier like normal human
    flags.pretty &&
      exec(
        `prettier --write src/components/${flags.path}/${args.componentName}/*`,
      )
  }
}
