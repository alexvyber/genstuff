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

export class Component {
  #componentName: string

  #displayName?: string

  #rawProps: {
    propsTyped: string | undefined
    propsUntyped: string | undefined
  }

  #parsedProps: {
    typed: Array<[string, string[], string | undefined]> | []
    untyped: Array<[string, undefined, string | undefined]> | []
    cvax: Array<[string, string[] | undefined, string | undefined]> | []
    rest?: false | 'rest' | 'props'
  } = {
    typed: [],
    untyped: [],
    cvax: [],
    rest: false,
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
    this.#parsedProps.typed = this.getTypedProps()
    this.#parsedProps.untyped = this.getUntypedProps()
    this.#parsedProps.cvax = this.getCvaxProps(cvax)
    this.#imports = this.generateImpots({ cvax: Boolean(cvax), ref })
    this.#exports = this.generateExports(componentName)
    this.#content = this.createContent()
    this.generateParts()
  }

  private generateParts() {
    if (this.#imports) this.append('imports', this.#imports.join(';'))

    this.append('after', `${this.#componentName}.displayName = "${this.#componentName}"`)

    if (this.#parsedProps.typed.length || this.#parsedProps.untyped.length || this.#parsedProps.cvax.length)
      this.append('parameters', this.generateParameters().join(','))

    if (this.#parsedProps.cvax.length) {
      this.append(
        'setup',
        `const config = { 
        variants: {
          ${this.#parsedProps.cvax
            .map(item => `${item[0]}:  ${item[1] ? `{ ${item[1].map(item_ => `${item_}: ""`)} }` : ''}`)
            .join(',')}
        }
      } as const 
      `,
      )

      this.append('setup', 'const variants = cvax(config)')

      this.append(
        'types',
        `type Props = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof variants> & {${this.#parsedProps.typed
          .map(item => `${item[0]}: ${item[1].join('|')};`)
          .join('')}${this.#parsedProps.untyped.map(item => `${item[0]}: unknown;`).join('')}  };`,
      )
    } else {
      this.append(
        'types',
        `type Props ={${this.#parsedProps.typed
          .map(item => `${item[0]}: ${item[1].join('|')};`)
          .join('')}${this.#parsedProps.untyped.map(item => `${item[0]}: unknown;`).join('')}  };`,
      )
    }

    if (this.#exports) this.append('exports', this.#exports.join(','))
  }

  private generateParameters() {
    return [
      `${this.#parsedProps.typed.map(item => `${item[0]} ${item[2] ? '=' + item[2] : ''}`).join(',')}`,
      `${this.#parsedProps.untyped.map(item => `${item[0]} ${item[2] ? '=' + item[2] : ''}`).join(',')}`,
      `${this.#parsedProps.cvax.map(item => `${item[0]} ${item[2] ? '=' + item[2] : ''}`).join(',')}`,
    ].filter(item => item.length > 0)
  }

  private generateProps() {
    return [
      `${this.#parsedProps.typed.map(item => `${item[0]} ${item[2] ? ':' + item[2] : ''}`).join(',')}`,
      `${this.#parsedProps.untyped.map(item => `${item[0]} ${item[2] ? ':' + item[2] : ''}`).join(',')}`,
      `${this.#parsedProps.cvax.map(item => `${item[0]} ${item[2] ? ':' + item[2] : ''}`).join(',')}`,
    ].filter(item => item.length > 0)
  }

  public renderFunction() {
    if (this.#config.ref) {
      return `
    ${this.#content.imports.join(';')};

    ${this.#content.setup.join(';')};

    ${this.#content.types.join(';')}

    const ${this.#componentName} = ${this.#config.ref ? 'forwardRef<HTMLDivElement, Props>(' : ''}
    ${
      this.#config.exports?.inPlace?.component ? `export ${this.#config.exports?.defaultExport ? 'default' : ''}` : ''
    } function ${this.#componentName} ({ ${this.#content.parameters} ${
        this.#parsedProps.rest ? ', ...' + this.#parsedProps.rest : ''
      } }  ${!this.#config.ref ? ': Props' : ''}
       ${this.#config.ref ? ', ref ' : ''}
      )  {
        return(
          <div
          ${this.#config.ref ? 'ref={ref}' : ''}
          ${
            this.#config.cvax
              ? `className={cn(variants({ ${this.#parsedProps.cvax.map(item => `${item[0]}`).join(',')}}))}`
              : ''
          }
           />
          );
        }

        ${this.#config.ref ? ') ' : ''};

        ${
          this.#config.printDisplayName
            ? `${this.#componentName}.displayName = "${this.#displayName || this.#componentName}"`
            : ''
        }

        export { ${this.#content.exports.join(',')} }
        
        `
    }

    return `
    ${this.#content.imports.join(';')};

    ${this.#content.setup.join(';')};

    ${this.#content.types.join(';')}

    ${
      this.#config.exports?.inPlace?.component ? `export ${this.#config.exports?.defaultExport ? 'default' : ''}` : ''
    } function ${this.#componentName} 
      ({ ${this.#content.parameters} ${this.#parsedProps.rest ? ', ...' + this.#parsedProps.rest : ''} }  ${
      !this.#config.ref ? ': Props' : ''
    }
       ${this.#config.ref ? ', ref ' : ''}
      )  {
        return(
          <div
          ${this.#config.ref ? 'ref={ref}' : ''}
          ${
            this.#config.cvax
              ? `className={cn(variants({ ${this.#parsedProps.cvax.map(item => `${item[0]}`).join(',')}}))}`
              : ''
          }
           />
          );
        }

        ${this.#config.ref ? ') ' : ''};


        ${
          this.#config.printDisplayName
            ? `${this.#componentName}.displayName = "${this.#displayName || this.#componentName}"`
            : ''
        }

        export { ${this.#content.exports.join(',')} }
        
        `
  }

  public renderConst() {
    return `
    ${this.#content.imports.join(';')};

    ${this.#content.setup.join(';')};

    ${this.#content.types.join(';')}

    ${this.#config.exports?.inPlace?.component && !this.#config.exports?.defaultExport ? 'export' : ''} const ${
      this.#componentName
    } = ${this.#config.ref ? 'forwardRef<HTMLDivElement, Props>(' : ''}
      ({ ${this.#content.parameters} ${this.#parsedProps.rest ? ', ...' + this.#parsedProps.rest : ''} }  ${
      !this.#config.ref ? ': Props' : ''
    }
       ${this.#config.ref ? ', ref ' : ''}
      ) => {
        return(
          <div
          ${this.#config.ref ? 'ref={ref}' : ''}
          ${
            this.#config.cvax
              ? `className={cn(variants({ ${this.#parsedProps.cvax.map(item => `${item[0]}`).join(',')}}))}`
              : ''
          }
           />
          );
        }

        ${this.#config.ref ? ') ' : ''};

        
        ${
          this.#config.printDisplayName
            ? `${this.#componentName}.displayName = "${this.#displayName || this.#componentName}"`
            : ''
        }
        

        export {  ${
          this.#config.exports?.defaultExport ? `${this.#componentName} as default,` : ''
        } ${this.#content.exports.join(',')} }
        
        `
  }

  private createContent() {
    return Object.fromEntries(parts.map(part => [part, []])) as Content
  }

  private getTypedProps() {
    let parsed
    if (this.#rawProps.propsTyped) parsed = this.parseTypedProps(this.#rawProps.propsTyped)

    return parsed || []
  }

  private getUntypedProps() {
    let parsed

    if (this.#rawProps.propsUntyped) parsed = this.ParseUntypedProps(this.#rawProps.propsUntyped)

    return parsed || []
  }

  private getCvaxProps(props: string | undefined) {
    if (!props) return []

    const withoutRest = this.getPropsOrRest(props)

    if (propsContainTypes(withoutRest.split(' '))) {
      return this.parseTypedProps(this.cleanProps(withoutRest))
    } else {
      return this.ParseUntypedProps(this.cleanProps(withoutRest))
    }
  }

  private parseTypedProps(props: string) {
    const splitted = props.split(' ')

    assertingPropsContainTypes(splitted, true)

    return splitted.map(item => {
      const replacedArrow = equalToDashArrow(item)

      const [propName, propTypeAndDefaultValue] = replacedArrow.split(':') as [string, string | undefined]

      if (!propTypeAndDefaultValue) throw new Error('Props... Make sure you used comma `,`')

      const propType = dashToEqualArrow(propTypeAndDefaultValue.split('=')[0])

      const defaultValue = replacedArrow.split('=')[1] as string | undefined
      let defaultPropValue
      if (defaultValue) defaultPropValue = dashToEqualArrow(defaultValue)

      return [propName, propType.split('|'), defaultPropValue]
    }) as Array<[string, string[], string | undefined]>
  }

  private ParseUntypedProps(props: string) {
    const withoutRest = this.getPropsOrRest(props)
    const splitted = withoutRest.split(' ')

    assertingPropsContainTypes(splitted, false)

    const arr = splitted.map(item => {
      const replacedArrow = equalToDashArrow(item)

      const [propName, propDefaultValue] = replacedArrow.split('=') as [string, string | undefined]

      let defaultPropValue
      if (propDefaultValue) defaultPropValue = dashToEqualArrow(propDefaultValue)

      return [propName, undefined, defaultPropValue]
    }) as Array<[string, undefined, string | undefined]>

    return arr
  }

  private getPropsOrRest(arg: string): string {
    if (arg.includes(' props')) {
      this.#parsedProps.rest = 'props'
      return arg.replaceAll(' props', '').replaceAll(' rest', '')
    }

    if (arg.includes(' rest')) {
      this.#parsedProps.rest = 'rest'
      return arg.replaceAll(' rest', '')
    }

    return arg
  }

  private cleanProps(props: string) {
    const str = props
      .trim()
      .replace(/\s\s+/g, ' ')
      .replace(/\ :/g, ':')
      .replace(/:\ /g, ':')
      .replace(/\ =/g, '=')
      .replace(/=\ /g, '=')
      .replace(/=>\ /g, '=>')

    if (str.includes('rest=') || str.includes('rest:') || str.includes('props=') || str.includes('props:'))
      throw new Error('Wrong rest or props')

    return str
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
      const [typed, untyped] = cleanedProps.split(',') as [string, string | undefined]
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
  ) {
    const arr: string[] = []

    if (config.ref) arr.push('import { forwardRef } from "react"')
    if (config.cvax) arr.push('import { cvax, cn, VariantProps } from "cvax"')

    return arr
  }

  private generateExports(componentName: string) {
    const arr: string[] = [
      !this.#config.exports?.inPlace?.component
        ? this.#config.exports?.defaultExport
          ? `${componentName} as default`
          : componentName
        : '',
    ]

    if (this.#config.exports?.variantConfig && this.#parsedProps.cvax.length)
      arr.push(`config as ${uncapitalize(componentName)}Config`)

    if (this.#config.exports?.variants && this.#parsedProps.cvax.length)
      arr.push(`variants as ${uncapitalize(componentName)}Variants`)

    if (this.#config.exports?.propsType) arr.push(`type Props as ${componentName}Props`)

    return arr.filter(item => item.trim().length > 0)
  }

  public prepend(target: Target, content: string) {
    this.#content[target] = [content, ...this.#content[target]]
  }
  public append(target: Target, content: string) {
    this.#content[target] = [...this.#content[target], content]
  }

  public renderIndex() {
    if (this.#config.exports?.defaultExport) return `export default from "./${this.#componentName}"`
    return `export {${this.#componentName}} from "./${this.#componentName}"`
  }

  public renderStories(): string {
    return `
    import React from 'react'
    import { ${this.#componentName} } from "./${this.#componentName}"
    
    import type { Story } from "@ladle/react"
    import type { ${this.#componentName}Props as Props } from "./${this.#componentName}"
    
    export default {
      title: "${this.#componentName}/Default"
    }
    
    export const Default: Story<Props> = args => <${this.#componentName} {...args} />
    Default.args = {  ${this.generateProps().join(',')} ${
      this.#parsedProps.rest ? ', ...' + this.#parsedProps.rest : ''
    }  } satisfies Props
    
    Default.argTypes = {}
    `
  }

  public renderTest(): string {
    return `
    import { expect, test } from "vitest";
    import { render, screen, within } from "@testing-library/react";
    import { ${this.#componentName} } from "./${this.#componentName}"
    
    test("${this.#componentName} renders", () => {
      render(<${this.#componentName} {...{  ${this.generateProps().join(',')} ${
      this.#parsedProps.rest ? ', ...' + this.#parsedProps.rest : ''
    } }} />);
    });`
  }
  // get displayName() {
  //   return this.#displayName
  // }
  // set displayName(displayName: string) {
  //   this.#displayName = displayName
  // }

  // private generateRest() {
  //   return {
  //     parameter: `${
  //       this.#parsedProps.rest ? ', ...' + this.#parsedProps.rest : ''
  //     }`,
  //     prop: `${
  //       this.#parsedProps.rest ? '{...' + this.#parsedProps.rest + '}' : ''
  //     }`,
  //   };
  // }

  // get componentName(): string | undefined {
  //   return this.#componentName;
  // }

  // get content() {
  //   return this.#content;
  // }

  // get rawProps() {
  //   return this.#rawProps;
  // }

  // get parsedProps() {
  //   return this.#parsedProps;
  // }
}
