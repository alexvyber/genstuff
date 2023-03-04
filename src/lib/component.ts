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

type Target = typeof parts[number]
type Content = { [key in Target]: string[] | [] }

const defaultExportConfig = { component: 'named', variantConfig: true, variants: true, propsType: true } as const

export class Component {
  // ✔️
  #componentName: string

  // ✔️
  #displayName: string

  // ✔️
  #rawProps: {
    // ✔️
    propsTyped: string | undefined
    // ✔️
    propsUntyped: string | undefined
  }

  #parsedProps: {
    // ✔️
    typed: Array<[string, string[], string | undefined]> | []
    // ✔️
    untyped: Array<[string, undefined, string | undefined]> | []
    // ✔️
    cvax: Array<[string, string[] | undefined, string | undefined]> | []

    rest?: false | 'rest' | 'props'
  } = {
    typed: [],
    untyped: [],
    cvax: [],
    rest: false,
  }

  // ✔️
  #exports: string[] | undefined

  // ✔️
  #imports: string[] | undefined

  // ✔️
  #content: Content

  // ✔️
  #config: {
    asFunc?: boolean
    FC?: boolean
    ref?: boolean
    cvax?: boolean
  } = {
    asFunc: false,
    FC: false,
    ref: false,
    cvax: false,
  }

  constructor({
    componentName,
    cvax,
    props,
    ref,
    asFunc,
    FC,
  }: {
    componentName: string
    cvax?: string
    props?: string
    ref?: boolean
    asFunc?: boolean
    FC?: boolean
  }) {
    this.#config = {
      ref,
      FC,
      asFunc,
      cvax: Boolean(cvax),
    }
    this.#componentName = componentName
    this.#displayName = componentName
    this.#rawProps = this.getRawProps(props)
    this.#parsedProps.typed = this.getTypedProps()
    this.#parsedProps.untyped = this.getUntypedProps()
    this.#parsedProps.cvax = this.getCvaxProps(cvax)
    this.#imports = this.generateImpots({ cvax: Boolean(cvax), ref })
    this.#exports = this.generateExports(componentName, defaultExportConfig)
    this.#content = this.createContent()
    this.generateParts()
  }

  private generateParts() {
    if (this.#imports) this.append('imports', this.#imports.join(';'))

    this.append('after', `${this.#componentName}.displayName = "${this.#componentName}"`)

    this.append('parameters', this.generateParameters())

    if (this.#parsedProps.cvax) {
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

    console.log('🚀 ~ Component ~ generateParts ~ this.asdf():', this.asdf())
  }

  private generateParameters() {
    return `
    ${this.#parsedProps.typed.map(item => `${item[0]} ${item[2] ? '=' + item[2] : ''}`).join(',')},
    ${this.#parsedProps.untyped.map(item => `${item[0]} ${item[2] ? '=' + item[2] : ''}`).join(',')},
    ${this.#parsedProps.cvax.map(item => `${item[0]} ${item[2] ? '=' + item[2] : ''}`).join(',')}`
  }

  private generateRest() {
    return {
      parameter: `${this.#parsedProps.rest ? ', ...' + this.#parsedProps.rest : ''}`,
      prop: `${this.#parsedProps.rest ? '{...' + this.#parsedProps.rest + '}' : ''}`,
    }
  }

  private asdf() {
    if (this.#config.asFunc) {
      return ''
    }

    return `const ${this.#componentName} = ${this.#config.ref ? 'forwardRef<HTMLDivElement, Props>' : ''}(
      ({ ${this.#content.parameters}, ${this.#parsedProps.rest ? ', ...' + this.#parsedProps.rest : ''} }, ref) => {
        return(
          <div
          ${this.#config.ref ? 'ref={ref}' : ''}
          ${
            this.#config.cvax
              ? `className={cn(variants({ ${this.#parsedProps.cvax.map(item => `${item[0]}`).join(',')}}))}`
              : ''
          }
           />
          )
        })`
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

  // -- --  -- --  -- --  -- --  -- --  -- --  -- --

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
    if (config.cvax) arr.push('import { cvax, VariantProps } from "cvax"')

    return arr
  }

  private generateExports(
    componentName: string,
    config: {
      component?: 'default' | 'named'
      variantConfig?: boolean
      variants?: boolean
      propsType?: boolean
    } = { component: 'named' },
  ) {
    const arr: string[] = [config.component === 'default' ? `${componentName} as default` : componentName]

    if (config.variantConfig) arr.push(`config as ${uncapitalize(componentName)}Config`)
    if (config.variants) arr.push(`variants as ${uncapitalize(componentName)}Variants`)
    if (config.propsType) arr.push(`type Props as ${componentName}Props`)

    return arr
  }

  public prepend(target: Target, content: string) {
    this.#content[target] = [content, ...this.#content[target]]
  }
  public append(target: Target, content: string) {
    this.#content[target] = [...this.#content[target], content]
  }

  get displayName() {
    return this.#displayName
  }
  set displayName(displayName: string) {
    this.#displayName = displayName
  }

  get content() {
    return this.#content
  }

  get componentName(): string | undefined {
    return this.#componentName
  }

  get rawProps() {
    return this.#rawProps
  }

  get parsedProps() {
    return this.#parsedProps
  }

  // public printShit({
  //   content = false,
  //   imports = false,
  //   exports = false,
  //   parsedProps = false,
  //   componentName = false,
  // }: {
  //   [key: string]: boolean
  // }) {
  //   content && console.log('🚀 ~ Component ~ printShit ~ this.#content:', this.#content)
  //   imports && console.log('🚀 ~ Component ~ printShit ~ this.#imports:', this.#imports)
  //   exports && console.log('🚀 ~ Component ~ printShit ~ this.#exports:', this.#exports)
  //   parsedProps && console.log('🚀 ~ Component ~ printShit ~ this.#parsedProps:', this.#parsedProps)
  //   componentName &&
  //     console.log('🚀 ~ Component ~ printShit ~ this.#componentName:', this.#componentName)
  // }
}
