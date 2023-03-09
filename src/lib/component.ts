import {
  assertingPropsContainTypes,
  equalToDashArrow,
  dashToEqualArrow,
  assertingNumberOfMatches,
  uncapitalize,
  propsContainTypes,
} from './utils'

const parts = [
  'imports',
  'setup',
  'types',
  'function',
  'parameters',
  'parameterTypes',
  'body',
  'return',
  'after',
  'exports',
] as const

type Target = (typeof parts)[number]

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
  ref?: boolean
  cvax?: boolean
  printDisplayName?: boolean
  exports?: Exports
}

type Content = { [key in Target]: string[] | [] }

type Types =
  | 'string'
  | 'number'
  | 'object'
  | 'boolean'
  | '{}'
  | '[]'
  | 'any'
  | 'never'
  | 'void'

export class Component {
  #componentName: string

  #displayName?: string

  #rawProps: {
    propsTyped: string | undefined
    propsUntyped: string | undefined
  }

  #props: {
    typed: Array<[string, string[], string | undefined]> | []
    untyped: Array<[string, undefined, string | undefined]> | []
    cvax: Array<[string, string[] | undefined, string | undefined]> | []
    rest?: false | 'rest' | 'props'
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

  #exports: string[] | undefined
  #imports: string[] | undefined

  #content: Content

  #config: Config = {
    FC: false,
    ref: false,
    cvax: false,
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
  }: {
    componentName: string
    displayName?: string | undefined
    cvax?: string
    props?: string
    ref?: boolean
    FC?: boolean
    printDisplayName?: boolean
    exports?: Exports
  }) {
    this.#config = {
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
    this.#imports = this.generateImpots({ cvax: Boolean(cvax), ref })
    this.#exports = this.generateExports(componentName)
    this.#content = this.createContent()
    this.generateParts()
  }

  private generateParts(): void {
    if (this.#imports) this.append('imports', this.#imports.join(';'))

    this.append(
      'after',
      `${this.#componentName}.displayName = "${this.#componentName}"`,
    )

    if (
      this.#props.typed.length ||
      this.#props.untyped.length ||
      this.#props.cvax.length
    )
      this.append('parameters', this.generateParameters().join(','))

    if (this.#props.cvax.length) {
      this.append(
        'setup',
        `const config = { 
        base: "",
        variants: {
          ${this.#props.cvax
            .map(
              item =>
                `${item[0]}:  ${
                  item[1] ? `{ ${item[1].map(item_ => `${item_}: ""`)} }` : '{}'
                }`,
            )
            .join(',')}
        },
        defaultVariants: { ${this.#props.cvax
          .map(
            item => `${item[0]}:  ${item[1] ? `"${item[1][0]}"` : '"FIXME"'}`,
          )
          .join(',')} },
        compoundVariants: [],
      } as const`,
      )

      this.append('setup', 'const variants = cvax(config)')

      this.append(
        'types',
        `type Props = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof variants> & {${this.#props.typed
          .map(item => `${item[0]}: ${item[1].join('|')};`)
          .join('')}
          ${this.#props.untyped.map(item => `${item[0]}: unknown;`).join('')}${
          this.#props.as ? 'as?: keyof JSX.IntrinsicElements;' : ''
        }
        } 
          ${this.#props.children ? '& React.PropsWithChildren' : ''};`,
      )
    } else {
      this.append(
        'types',
        `type Props ={${this.#props.typed
          .map(item => `${item[0]}: ${item[1].join('|')};`)
          .join('')}${this.#props.untyped
          .map(item => `${item[0]}: unknown;`)
          .join('')}  };`,
      )
    }

    if (this.#exports) this.append('exports', this.#exports.join(','))
  }

  private generateParameters(): string[] {
    return [
      `${this.#props.children ? 'children' : ''}`,
      `${this.#props.as ? 'as: Component="div"' : ''}`,
      `${this.#props.typed
        .map(item => `${item[0]} ${item[2] ? '=' + item[2] : ''}`)
        .join(',')}`,
      `${this.#props.untyped
        .map(item => `${item[0]} ${item[2] ? '=' + item[2] : ''}`)
        .join(',')}`,
      `${this.#props.cvax
        .map(item => `${item[0]} ${item[2] ? '=' + item[2] : ''}`)
        .join(',')}`,
    ].filter(item => item.length > 0)
  }

  private generateProps(): string[] {
    return [
      `${this.#props.typed
        .map(item => `${item[0]} ${item[2] ? ':' + item[2] : ''}`)
        .join(',')}`,
      `${this.#props.untyped
        .map(item => `${item[0]} ${item[2] ? ':' + item[2] : ''}`)
        .join(',')}`,
      `${this.#props.cvax
        .map(item => `${item[0]} ${item[2] ? ':' + item[2] : ''}`)
        .join(',')}`,
    ].filter(item => item.length > 0)
  }

  private getPropValue(arg: Types | string | undefined) {
    if (typeof arg === 'string') return '"string"'
    if (typeof arg === 'number') return 69
    if (typeof arg === 'boolean') return Math.random() > 0.5

    return '"unknown"'
  }

  private generateStoriesProps(): string[] {
    return [
      `${this.#props.typed
        .map(
          item =>
            `${item[0]} ${
              item[2]
                ? ':' + item[2]
                : `${item[1] ? `: ${this.getPropValue(item[1][0])}` : ''}`
            }`,
        )
        .join(',')}`,
      `${this.#props.untyped
        .map(item => `${item[0]} ${item[2] ? ':' + item[2] : ''}`)
        .join(',')}`,
      `${this.#props.cvax
        .map(item => `${item[0]} ${item[1] ? ':' + `"${item[1][0]}"` : ''}`)
        .join(',')}`,
    ].filter(item => item.length > 0)
  }

  private createContent() {
    return Object.fromEntries(parts.map(part => [part, []])) as Content
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
    props: string | undefined,
  ):
    | [string, string[], string | undefined][]
    | [string, undefined, string | undefined][] {
    if (!props) return []

    // const withoutRest = this.getPropsOrRest(props)
    // if (propsContainTypes(withoutRest.split(' '))) {
    //   return this.parseTypedProps(this.cleanProps(withoutRest))
    // } else {
    //   return this.ParseUntypedProps(this.cleanProps(withoutRest))
    // }

    if (propsContainTypes(props.split(' '))) {
      return this.parseTypedProps(this.cleanProps(props))
    } else {
      return this.ParseUntypedProps(this.cleanProps(props))
    }
  }

  private parseTypedProps(props: string) {
    const splitted = props.split(' ')

    assertingPropsContainTypes(splitted, true)

    return splitted.map(item => {
      const replacedArrow = equalToDashArrow(item)

      const [propName, propTypeAndDefaultValue] = replacedArrow.split(':') as [
        string,
        string | undefined,
      ]

      if (!propTypeAndDefaultValue)
        throw new Error('Props... Make sure you used comma `,`')

      const propType = dashToEqualArrow(propTypeAndDefaultValue.split('=')[0])

      const defaultValue = replacedArrow.split('=')[1] as string | undefined
      let defaultPropValue
      if (defaultValue) defaultPropValue = dashToEqualArrow(defaultValue)

      return [propName, propType.split('|'), defaultPropValue]
    }) as Array<[string, string[], string | undefined]>
  }

  private ParseUntypedProps(props: string) {
    // const withoutRest = this.getPropsOrRest(props)
    // const splitted = withoutRest.split(' ')
    const splitted = props.split(' ')

    assertingPropsContainTypes(splitted, false)

    return splitted.map(item => {
      const replacedArrow = equalToDashArrow(item)

      const [propName, propDefaultValue] = replacedArrow.split('=') as [
        string,
        string | undefined,
      ]

      let defaultPropValue
      if (propDefaultValue)
        defaultPropValue = dashToEqualArrow(propDefaultValue)

      return [propName, undefined, defaultPropValue]
    }) as Array<[string, undefined, string | undefined]>
  }

  private getPropsOrRest(arg: string): string {
    if (arg.includes(' props')) {
      this.#props.rest = 'props'
      return arg.replaceAll(' props', '').replaceAll(' rest', '')
    }

    if (arg.includes(' rest')) {
      this.#props.rest = 'rest'
      return arg.replaceAll(' rest', '')
    }

    return arg
  }

  private getAsComponent(arg: string): string {
    if (arg.includes(' as-')) {
      this.#props.as = true
      return arg.replaceAll(' as-', '').replace(/\s\s+/g, ' ')
    }

    return arg
  }

  private getChildren(arg: string): string {
    if (arg.includes('children')) {
      this.#props.children = true
      return arg.replaceAll('children', '').replace(/\s\s+/g, ' ')
    }

    return arg
  }

  private cleanProps(props: string): string {
    const str = props
      .trim()
      .replace(/\s\s+/g, ' ')
      .replace(/\ :/g, ':')
      .replace(/:\ /g, ':')
      .replace(/\ =/g, '=')
      .replace(/=\ /g, '=')
      .replace(/=>\ /g, '=>')

    if (
      str.includes('rest=') ||
      str.includes('rest:') ||
      str.includes('props=') ||
      str.includes('props:')
    )
      throw new Error('Wrong rest or props')

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

    assertingNumberOfMatches(props, ',', 0, 1)

    const cleanedProps = this.cleanProps(props)

    if (cleanedProps.includes(':')) {
      const [typed, untyped] = cleanedProps.split(',') as [
        string,
        string | undefined,
      ]
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

  private generateImpots(
    config: {
      cvax?: boolean
      ref?: boolean
    } = {
      cvax: false,
      ref: false,
    },
  ): string[] {
    const arr: string[] = []

    if (config.ref) arr.push('import { forwardRef } from "react"')
    if (config.cvax) arr.push('import { cvax, VariantProps } from "cvax"')

    return arr
  }

  private generateExports(componentName: string): string[] {
    const arr: string[] = [
      !this.#config.exports?.inPlace?.component
        ? this.#config.exports?.defaultExport
          ? `${componentName} as default`
          : componentName
        : '',
    ]

    if (this.#config.exports?.variantConfig && this.#props.cvax.length)
      arr.push(`config as ${uncapitalize(componentName)}Config`)

    if (this.#config.exports?.variants && this.#props.cvax.length)
      arr.push(`variants as ${uncapitalize(componentName)}Variants`)

    if (this.#config.exports?.propsType)
      arr.push(`type Props as ${componentName}Props`)

    return arr.filter(item => item.trim().length > 0)
  }

  public prepend(target: Target, content: string): void {
    this.#content[target] = [content, ...this.#content[target]]
  }
  public append(target: Target, content: string): void {
    this.#content[target] = [...this.#content[target], content]
  }

  public renderIndex(): string {
    if (this.#config.exports?.defaultExport)
      return `export default from "./${this.#componentName}"`
    return `export {${this.#componentName}} from "./${this.#componentName}"`
  }

  public renderStories(): string {
    return `
    import React from 'react'
    import type { Story } from "@ladle/react"
    import { ${this.#componentName}, ${uncapitalize(
      this.#componentName,
    )}Config, type ${this.#componentName}Props as Props   } from "./${
      this.#componentName
    }"

    const { variants } = ${uncapitalize(this.#componentName)}Config

    export default {
      title: "${this.#componentName}/Default"
    }
    
    export const Default: Story<Props> = props => ${
      this.#props.children
        ? `<${this.#componentName} {...props} >{props.children}</${
            this.#componentName
          }>`
        : `<${this.#componentName} {...props} />`
    }

    Default.args = { 
      ${this.#props.children ? 'children: <>children</>,' : ''}
      ${this.generateStoriesProps().join(',')} 
    } satisfies Props
    
    Default.argTypes = {
      ${this.#props.cvax.map(
        item => `${item[0]}: {
        options: getOptions(variants.${item[0]}),
        control: {
          type: "radio"
        },
        defaultValue: getFirstValue(variants.${item[0]}),
        
      }`,
      )}
    }

    // TODO: extract
    function getOptions<T extends Record<string, string>>(arg: T): Array<keyof T> {
      return (Object.keys(arg) as Array<keyof typeof arg>).map(key => key)
    }

    // TODO: extract
    function getFirstValue<T extends object>(variants: T): keyof T {
      return (Object.keys(variants) as Array<keyof T>)[0]
    }
    `
  }

  public renderTest(): string {
    return `
    import { expect, test } from "vitest";
    import { render, screen, within } from "@testing-library/react";
    import { ${this.#componentName} } from "./${this.#componentName}"
    
    test("${this.#componentName} renders", () => {
      render(<${this.#componentName} {...{  ${this.generateProps().join(',')} ${
      this.#props.rest ? ', ...' + this.#props.rest : ''
    } }} />);
    });`
  }

  public renderConst(): string {
    return `
    ${this.#content.imports.join(';')};

    ${this.#content.setup.join(';')};

    ${this.#content.types.join(';')}

    ${
      this.#config.exports?.inPlace?.component &&
      !this.#config.exports?.defaultExport
        ? 'export'
        : ''
    } const ${this.#componentName} = ${
      this.#config.ref ? 'forwardRef<HTMLDivElement, Props>(' : ''
    }
      ({ ${this.#content.parameters} ${
      this.#props.rest ? ', ...' + this.#props.rest : ''
    } }  ${!this.#config.ref ? ': Props' : ''}
       ${this.#config.ref ? ', ref ' : ''}
      ) => {
        return(
          <div
          ${this.#config.ref ? 'ref={ref}' : ''}
          ${
            this.#config.cvax
              ? `className={variants({ ${this.#props.cvax
                  .map(item => `${item[0]}`)
                  .join(',')}})}`
              : ''
          }
          ${this.#props.rest ? ' {...' + this.#props.rest + '}' : ''}
          ${this.#props.children ? '>{children}</div>);}' : '/>);}'}
        ${this.#config.ref ? ') ' : ''};
        ${
          this.#config.printDisplayName
            ? `${this.#componentName}.displayName = "${
                this.#displayName || this.#componentName
              }"`
            : ''
        };

        export {  ${
          this.#config.exports?.defaultExport
            ? `${this.#componentName} as default,`
            : ''
        } ${this.#content.exports.join(',')} };`
  }

  // public renderFunction(): string {
  //   if (this.#config.ref) {
  //     return `
  //   ${this.#content.imports.join(';')};

  //   ${this.#content.setup.join(';')};

  //   ${this.#content.types.join(';')}

  //   const ${this.#componentName} = ${
  //       this.#config.ref ? 'forwardRef<HTMLDivElement, Props>(' : ''
  //     }
  //   ${
  //     this.#config.exports?.inPlace?.component
  //       ? `export ${this.#config.exports?.defaultExport ? 'default' : ''}`
  //       : ''
  //   } function ${this.#componentName} ({ ${this.#content.parameters} ${
  //       this.#props.rest ? ', ...' + this.#props.rest : ''
  //     } }  ${!this.#config.ref ? ': Props' : ''}
  //      ${this.#config.ref ? ', ref ' : ''}
  //     )  { return(<div ${this.#config.ref ? 'ref={ref}' : ''}
  //         ${
  //           this.#config.cvax
  //             ? `className={cn(variants({ ${this.#props.cvax
  //                 .map(item => `${item[0]}`)
  //                 .join(',')}}))}`
  //             : ''
  //         } />);}
  //       ${this.#config.ref ? ') ' : ''};
  //       ${
  //         this.#config.printDisplayName
  //           ? `${this.#componentName}.displayName = "${
  //               this.#displayName || this.#componentName
  //             }"`
  //           : ''
  //       }

  //       export { ${this.#content.exports.join(',')} }`
  //   }

  //   return `
  //   ${this.#content.imports.join(';')};

  //   ${this.#content.setup.join(';')};

  //   ${this.#content.types.join(';')}

  //   ${
  //     this.#config.exports?.inPlace?.component
  //       ? `export ${this.#config.exports?.defaultExport ? 'default' : ''}`
  //       : ''
  //   } function ${this.#componentName}
  //     ({ ${this.#content.parameters} ${
  //     this.#props.rest ? ', ...' + this.#props.rest : ''
  //   } }  ${!this.#config.ref ? ': Props' : ''}
  //      ${this.#config.ref ? ', ref ' : ''}
  //     )  {
  //       return(
  //         <div
  //         ${this.#config.ref ? 'ref={ref}' : ''}
  //         ${
  //           this.#config.cvax
  //             ? `className={cn(variants({ ${this.#props.cvax
  //                 .map(item => `${item[0]}`)
  //                 .join(',')}}))}`
  //             : ''
  //         }
  //          />);};
  //       ${this.#config.ref ? ') ' : ''};
  //       ${
  //         this.#config.printDisplayName
  //           ? `${this.#componentName}.displayName = "${
  //               this.#displayName || this.#componentName
  //             }"`
  //           : ''
  //       };

  //       export { ${this.#content.exports.join(',')} };`
  // }
}
