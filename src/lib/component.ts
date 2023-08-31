import path from "node:path"
import {
  RenderExports,
  RenderImports,
  line,
  renderComponent,
  renderExports,
  renderImports,
} from "./template"
import {
  assertingPropsContainTypes,
  equalToDashArrow,
  dashToEqualArrow,
  assertingNumberOfMatches,
  uncapitalize,
  propsContainTypes,
} from "./utils"
import { readFile } from "node:fs/promises"
import { Liquid } from "liquidjs"

const engine = new Liquid()

const parts = [
  "imports",
  "setup",
  "types",
  "function",
  "parameters",
  "parameterTypes",
  "body",
  "return",
  "after",
  "exports",
] as const

type Target = typeof parts[number]

type Exports = {
  defaultExport?: boolean
  variantConfig?: boolean
  variants?: boolean
  propsType?: boolean
  inPlace?: {
    component?: boolean
    types?: boolean
    variants?: boolean
    configs?: boolean
  }
}

type Config = {
  FC?: boolean
  as?: "const" | "function"
  ref?: boolean
  cvax?: boolean
  printDisplayName?: boolean
  exports?: Exports
}

type Content = { [key in Target]: string[] }

type Types = "string" | "number" | "object" | "boolean" | "{}" | "[]" | "any" | "never" | "void"

export class Component {
  #componentName: string

  #rawProps: {
    propsTyped: string | undefined
    propsUntyped: string | undefined
  }

  #props: {
    typed: Array<[string, string[], string | undefined]> | []
    untyped: Array<[string, undefined, string | undefined]> | []
    cvax: Array<[string, string[] | undefined, string | undefined]> | []
    rest?: false | "rest" | "props"
    as?: boolean
    children?: boolean
  } = {
    typed: [],
    untyped: [],
    cvax: [],
    rest: false,
    as: false,
    children: false,
  }

  #exports: string | undefined
  #imports: string | undefined
  #displayName?: string

  #content: Content

  #config: Config = {
    FC: false,
    ref: false,
    cvax: false,
    as: "function",
    printDisplayName: true,
    exports: {
      defaultExport: false,
      variantConfig: false,
      variants: false,
      propsType: false,
      inPlace: {
        component: false,
        types: false,
        variants: false,
        configs: false,
      },
    },
  }

  constructor({
    componentName,
    displayName,
    cvax,
    props,
    ref,
    FC,
    printDisplayName,
    exports,
    as,
  }: {
    componentName: string
    displayName?: string | undefined
    cvax?: string
    props?: string
    ref?: boolean
    FC?: boolean
    printDisplayName?: boolean
    exports?: Exports
    as?: Config["as"]
  }) {
    this.#config = {
      as,
      ref,
      FC,
      cvax: Boolean(cvax),
      printDisplayName,
      exports,
    }

    this.#componentName = componentName
    this.#displayName = displayName
    this.#rawProps = this.getRawProps(props)
    this.#props.typed = this.getTypedProps()
    this.#props.untyped = this.getUntypedProps()
    this.#props.cvax = this.getCvaxProps(cvax)
    this.#content = this.initContent()
  }

  public async renderMain(): Promise<string> {
    await this.generateParts()

    const [imports, setup, component, exports] = await Promise.all([
      renderImports(
        this.generateImpots({
          cvax: Boolean(this.#props.cvax),
          ref: this.#config.ref,
        })
      ),

      new Promise<string>((res, _rej) => res(this.#content.setup.join(";\n"))),

      renderComponent({
        componentName: this.#componentName,
        exportInPlace: this.#config.exports?.inPlace?.component,
        exportDefault: this.#config.exports?.defaultExport,
        ref: this.#config.ref,
        passedProps: {
          className: `variants({ ${this.#props.cvax.map((item) => `${item[0]}`).join(",")}})`,
        },
        props: [...this.#content.parameters, this.#props.rest ? this.#props.rest : ""],
        as: this.#config.as,
      }),

      renderExports(this.generateExports(this.#componentName)),
    ])

    const filePath = path.resolve(__dirname, "../templates/component.liquid")
    const content = await readFile(filePath, { encoding: "utf8" })

    return engine.parseAndRender(content, {
      imports: line(imports, { bottom: 20 }),
      setup: line(setup, { top: 12, bottom: 12 }),
      component: line(component, { top: 1, bottom: 1 }),
      exports,
    })
  }

  private async generateParts(): Promise<void> {
    if (this.#props.typed.length || this.#props.untyped.length || this.#props.cvax.length)
      this.append("parameters", this.generateParameters().join(","))

    if (this.#props.cvax.length) {
      this.append(
        "setup",
        `const config = createVariant({ 
        base: "",
        variants: {
          ${this.#props.cvax
            .map(
              (item) =>
                `${item[0]}:  ${item[1] ? `{ ${item[1].map((item_) => `${item_}: ""`)} }` : "{}"}`
            )
            .join(",")}
        },
        defaultVariants: { ${this.#props.cvax
          .map((item) => `${item[0]}:  ${item[1] ? `"${item[1][0]}"` : '"FIXME"'}`)
          .join(",")} },
        compoundVariants: [],
      });\n`
      )
      this.append("setup", `const variants = cvax(config);\n`)

      this.append(
        "setup",
        `;\n
        type Props = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof variants> & {${this.#props.typed
          .map((item) => `${item[0]}: ${item[1].join("|")};`)
          .join("")}
          ${this.#props.untyped.map((item) => `${item[0]}: unknown;`).join("")}${
            this.#props.as ? "as?: keyof JSX.IntrinsicElements;" : ""
          }
        } 
          ${this.#props.children ? "& React.PropsWithChildren" : ""};`
      )
    } else {
      this.append(
        "setup",
        `type Props ={${this.#props.typed
          .map((item) => `${item[0]}: ${item[1].join("|")};`)
          .join("")}${this.#props.untyped.map((item) => `${item[0]}: unknown;`).join("")}  };`
      )
    }
  }

  private generateParameters(): string[] {
    return [
      `${this.#props.children ? "children" : ""}`,
      `${this.#props.as ? 'as: Component="div"' : ""}`,
      `${this.#props.typed.map((item) => `${item[0]} ${item[2] ? "=" + item[2] : ""}`).join(",")}`,
      `${this.#props.untyped
        .map((item) => `${item[0]} ${item[2] ? "=" + item[2] : ""}`)
        .join(",")}`,
      `${this.#props.cvax.map((item) => `${item[0]} ${item[2] ? "=" + item[2] : ""}`).join(",")}`,
    ].filter((item) => item.length > 0)
  }

  private generateProps(): string[] {
    return [
      `${this.#props.typed.map((item) => `${item[0]} ${item[2] ? ":" + item[2] : ""}`).join(",")}`,
      `${this.#props.untyped
        .map((item) => `${item[0]} ${item[2] ? ":" + item[2] : ""}`)
        .join(",")}`,
      `${this.#props.cvax.map((item) => `${item[0]} ${item[2] ? ":" + item[2] : ""}`).join(",")}`,
    ].filter((item) => item.length > 0)
  }

  private getPropValue(arg: Types | string | undefined) {
    if (typeof arg === "string") return '"string"'
    if (typeof arg === "number") return 69
    if (typeof arg === "boolean") return Math.random() > 0.5

    return '"unknown"'
  }

  private generateStoriesProps(): string[] {
    return [
      `${this.#props.typed
        .map(
          (item) =>
            `${item[0]} ${
              item[2] ? ":" + item[2] : `${item[1] ? `: ${this.getPropValue(item[1][0])}` : ""}`
            }`
        )
        .join(",")}`,
      `${this.#props.untyped
        .map((item) => `${item[0]} ${item[2] ? ":" + item[2] : ""}`)
        .join(",")}`,
      `${this.#props.cvax
        .map((item) => `${item[0]} ${item[1] ? ":" + `"${item[1][0]}"` : ""}`)
        .join(",")}`,
    ].filter((item) => item.length > 0)
  }

  private initContent() {
    return Object.fromEntries(parts.map((part) => [part, []])) as any as Content
  }

  private getTypedProps(): [string, string[], string | undefined][] {
    if (!this.#rawProps.propsTyped) return []

    return this.parseTypedProps(this.#rawProps.propsTyped)
  }

  private getUntypedProps(): [string, undefined, string | undefined][] {
    if (!this.#rawProps.propsUntyped) return []

    return this.ParseUntypedProps(this.#rawProps.propsUntyped)
  }

  private getCvaxProps(
    props: string | undefined
  ): [string, string[], string | undefined][] | [string, undefined, string | undefined][] {
    if (!props) return []
    if (propsContainTypes(props.split(" "))) {
      return this.parseTypedProps(this.cleanProps(props))
    } else {
      return this.ParseUntypedProps(this.cleanProps(props))
    }
  }

  private parseTypedProps(props: string) {
    const splitted = props.split(" ")

    assertingPropsContainTypes(splitted, true)

    return splitted.map((item) => {
      const replacedArrow = equalToDashArrow(item)

      const [propName, propTypeAndDefaultValue] = replacedArrow.split(":") as [
        string,
        string | undefined
      ]

      if (!propTypeAndDefaultValue) throw new Error("Props... Make sure you used comma `,`")

      const propType = dashToEqualArrow(propTypeAndDefaultValue.split("=")[0])

      const defaultValue = replacedArrow.split("=")[1] as string | undefined
      let defaultPropValue
      if (defaultValue) defaultPropValue = dashToEqualArrow(defaultValue)

      return [propName, propType.split("|"), defaultPropValue]
    }) as Array<[string, string[], string | undefined]>
  }

  private ParseUntypedProps(props: string) {
    const splitted = props.split(" ")

    assertingPropsContainTypes(splitted, false)

    return splitted.map((item) => {
      const replacedArrow = equalToDashArrow(item)

      const [propName, propDefaultValue] = replacedArrow.split("=") as [string, string | undefined]

      let defaultPropValue
      if (propDefaultValue) defaultPropValue = dashToEqualArrow(propDefaultValue)

      return [propName, undefined, defaultPropValue]
    }) as Array<[string, undefined, string | undefined]>
  }

  private getPropsOrRest(arg: string): string {
    if (arg.includes(" props")) {
      this.#props.rest = "props"
      return arg.replaceAll(" props", "").replaceAll(" rest", "")
    }

    if (arg.includes(" rest")) {
      this.#props.rest = "rest"
      return arg.replaceAll(" rest", "")
    }

    return arg
  }

  private getAsComponent(arg: string): string {
    if (arg.includes(" as-")) {
      this.#props.as = true
      return arg.replaceAll(" as-", "").replace(/\s\s+/g, " ")
    }

    return arg
  }

  private getChildren(arg: string): string {
    if (arg.includes("children")) {
      this.#props.children = true
      return arg.replaceAll("children", "").replace(/\s\s+/g, " ")
    }

    return arg
  }

  private cleanProps(props: string): string {
    const str = props
      .trim()
      .replace(/\s\s+/g, " ")
      .replace(/\ :/g, ":")
      .replace(/:\ /g, ":")
      .replace(/\ =/g, "=")
      .replace(/=\ /g, "=")
      .replace(/=>\ /g, "=>")

    if (
      str.includes("rest=") ||
      str.includes("rest:") ||
      str.includes("props=") ||
      str.includes("props:")
    )
      throw new Error("Wrong rest or props")

    return this.getChildren(this.getAsComponent(this.getPropsOrRest(str)))
  }

  private getRawProps(props: string | undefined): {
    propsTyped: string | undefined
    propsUntyped: string | undefined
  } {
    if (!props)
      return {
        propsTyped: undefined,
        propsUntyped: undefined,
      }

    assertingNumberOfMatches(props, ",", 0, 1)

    const cleanedProps = this.cleanProps(props)

    if (cleanedProps.includes(":")) {
      const [typed, untyped] = cleanedProps.split(",") as [string, string | undefined]
      return {
        propsTyped: typed.trim(),
        propsUntyped: untyped ? untyped.trim() : undefined,
      }
    }

    return {
      propsTyped: undefined,
      propsUntyped: cleanedProps,
    }
  }

  public renderIndex(): string {
    if (this.#config.exports?.defaultExport) return `export default from "./${this.#componentName}"`
    return `export {${this.#componentName}} from "./${this.#componentName}"`
  }

  private generateImpots(
    config: {
      cvax?: boolean
      ref?: boolean
    } = {
      cvax: false,
      ref: false,
    }
  ): RenderImports[] {
    const imports: RenderImports[] = []

    if (config.ref)
      imports.push({
        source: "react",
        namedImports: ["forwardRef"],
      })

    if (config.cvax)
      imports.push({
        source: "cvax",
        namedImports: ["cvax", "VariantProps", "createVariant"],
      })

    return imports
  }

  private generateExports(componentName: string): RenderExports {
    const exports: RenderExports = {
      defaultExport: undefined,
      namedExports: [],
    }

    if (this.#config.exports?.defaultExport) {
      exports.defaultExport = componentName
    } else {
      exports.namedExports.push(componentName)
    }

    if (this.#config.exports?.variantConfig && this.#props.cvax.length)
      exports.namedExports.push(`config as ${uncapitalize(componentName)}Config`)

    if (this.#config.exports?.variants && this.#props.cvax.length)
      exports.namedExports.push(`variants as ${uncapitalize(componentName)}Variants`)

    if (this.#config.exports?.propsType)
      exports.namedExports.push(`type Props as ${componentName}Props`)

    return {
      defaultExport: exports.defaultExport,
      namedExports: exports.namedExports,
    }
  }

  public prepend(target: Target, content: string): void {
    this.#content[target].unshift(content)
  }
  public append(target: Target, content: string): void {
    this.#content[target].push(content)
  }

  public renderStories(): string {
    return `
    import React from 'react'
    import type { Story } from "@ladle/react"
    import { ${this.#componentName}, ${uncapitalize(this.#componentName)}Config, type ${
      this.#componentName
    }Props as Props   } from "./${this.#componentName}"

    import { getFirstValue, getOptions } from "@alexvyber/turbo-helpers-ladle"

    const { variants } = ${uncapitalize(this.#componentName)}Config

    export default {
      title: "${this.#componentName}/Default"
    }
    
    export const Default: Story<Props> = props => ${
      this.#props.children
        ? `<${this.#componentName} {...props} >{props.children}</${this.#componentName}>`
        : `<${this.#componentName} {...props} />`
    }

    Default.args = { 
      ${this.#props.children ? "children: <>children</>," : ""}
      ${this.generateStoriesProps().join(",")} 
    } satisfies Props
    
    Default.argTypes = {
      ${this.#props.cvax.map(
        (item) => `${item[0]}: {
        options: getOptions(variants.${item[0]}),
        control: {
          type: "radio"
        },
        defaultValue: getFirstValue(variants.${item[0]}),
        
      }`
      )}
    }
    `
  }

  public renderTest(): string {
    return `
    import { expect, test } from "vitest";
    import { render, screen, within } from "@testing-library/react";
    import { ${this.#componentName} } from "./${this.#componentName}"
    
    test("${this.#componentName} renders", () => {
      render(<${this.#componentName} {...{  ${this.generateProps().join(",")} ${
      this.#props.rest ? ", ..." + this.#props.rest : ""
    } }} />);
    });`
  }
}
