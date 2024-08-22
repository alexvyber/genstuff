import { Args, Flags } from "@oclif/core"
import { GeneratorCommand } from "../../generator.js"
import { join } from "node:path"
import { kebabCase } from "change-case"
import { parseProps, parseVariants } from "../../utils/react-comp.js"

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
    variants: Flags.string({ char: "v", default: undefined }),
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
   * 3. variants
   *    - if variants flag is provided, then all use variants specific props
   *    - or use separate file for variants declaration
   * 4. tests
   *    - if test flag is provided, then generate tests
   *    - produce render tests based on props when component is being generaed
   */

  async run(): Promise<void> {
    const parsedVariants = parseVariants(this.flags.variants)
    const store = {
      name: this.args.name,
      parsedProps: parseProps(
        [...(parsedVariants.length > 0 ? ["className?:string"] : []), this.flags.variants, this.flags.props].join(";")
      ),
      parsedVariants,
    }

    {
      const templatePath = join(this.templatesDir, "react", `component-${this.flags.declared}.tsx.js`)
      const indexPath = join(process.cwd(), kebabCase(store.name), `${kebabCase(store.name)}.tsx`)

      await this.writeTemplate(templatePath, indexPath, store)
    }

    if (this.flags.story) {
      const templatePath = join(this.templatesDir, "react", "stories.tsx.js")
      const storyPath = join(process.cwd(), kebabCase(store.name), `${kebabCase(store.name)}.stories.tsx`)

      await this.writeTemplate(templatePath, storyPath, store)
    }

    if (this.flags.variants) {
      const templatePath = join(this.templatesDir, "react", "variants.tsx.js")
      const variantsPath = join(process.cwd(), kebabCase(store.name), `${kebabCase(store.name)}.variants.ts`)

      await this.writeTemplate(templatePath, variantsPath, store)
    }
  }
}
