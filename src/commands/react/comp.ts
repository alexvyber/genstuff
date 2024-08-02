import { Args, Flags } from "@oclif/core"
import { GeneratorCommand } from "../../generator.js"
import { kebabCase } from "change-case"
import { join } from "node:path"

export default class ReactComponent extends GeneratorCommand<typeof ReactComponent> {
  static override args = {
    name: Args.string({ description: "component name", required: true }),
  }

  static override description = "Generate react component"

  static override examples = ["<%= config.bin %> <%= command.id %>"]

  static override flags = {
    props: Flags.string({ char: "p", default: undefined }),
    story: Flags.boolean({ char: "s", default: false }),
    test: Flags.boolean({ char: "t", default: false }),
    dir: Flags.directory({ char: "d", exists: true }),
    path: Flags.string({ default: undefined }),
    force: Flags.boolean({ char: "f", default: false }),
    cvax: Flags.boolean({ default: false }),
    declared: Flags.option({ options: ["fn", "class", "arrow"] as const })({ default: "fn", multiple: false }),
    export: Flags.option({ options: ["props", "default"] as const })({ default: [], multiple: true }),
  }

  /**
   * TODO:
   * 1. parse props
   *    - can be types `one:str` or `two:num` - str num bool arr obj fn
   *    - should work `?` one?:str two?str three ? fn
   *    - child adds children prop
   *    - class adds className - TODO: deside wheter use or not
   * 2. stories
   *    - if stories flag is provided, then craete stories file
   * 3. cvax
   *    - if cvax flag is provided, then all use cvax specific props
   *    - or use separate file for variants declaration
   * 4. tests
   *    - if test flag is provided, then generate tests
   *    - produce render tests based on props when component is being generaed
   */

  async run(): Promise<void> {
    const indexPath = join(process.cwd(), kebabCase(this.args.name), "index.tsx")

    await this.template(join(this.templatesDir, "react", `component-${this.flags.declared}.tsx.ejs`), indexPath, {
      name: this.args.name,
    })

    if (this.flags.story) {
      const storyPath = join(process.cwd(), kebabCase(this.args.name), `${kebabCase(this.args.name)}.stories.tsx`)

      await this.template(join(this.templatesDir, "react", "storybook.tsx.ejs"), storyPath, { name: this.args.name })
    }

    if (this.flags.test) {
      const testPath = join(process.cwd(), kebabCase(this.args.name), `${kebabCase(this.args.name)}.test.tsx`)

      await this.template(join(this.templatesDir, "react", "vitest.tsx.ejs"), testPath, { name: this.args.name })
    }

    if (this.flags.cvax) {
      const cvaxPath = join(process.cwd(), kebabCase(this.args.name), `${kebabCase(this.args.name)}.variants.ts`)

      await this.template(join(this.templatesDir, "react", "cvax.tsx.ejs"), cvaxPath, { name: this.args.name })
    }
  }
}
