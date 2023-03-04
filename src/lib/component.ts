export class Component {
  #componentName: string

  #parsedProps: {
    props: { [key: string]: string } | null
    cvaxProps: { [key: string]: string } | null
  } = {
    props: null,
    cvaxProps: null,
  }

  #exports: {
    component?: string
    variantConfig?: string
    variants?: string
    propsType?: string
  }

  #imports: string[] = []
  // #propsWithTypres = ''
  // #propsUnknown = ''
  #content: {
    body: string | undefined
    displayName?: string
    // body: string | undefined
    // body: string | undefined
    // body: string | undefined
  } = {
    body: undefined,
  }

  // #returns = ''

  constructor(componentName: string) {
    this.#componentName = componentName
    this.#exports = this.generateExports(componentName, {
      component: 'named',
      variantConfig: true,
      variants: true,
      propsType: true,
    })
  }

  public setProps(props: string): void {
    this.#parsedProps.props = { some: 'some' }
  }
  public setCvaxProps(props: string) {
    this.#parsedProps.cvaxProps = { some: 'some' }
  }

  // allowedPropTypes = ["string", "number", "any", "unknown", "object", "boolean"]
  public static getIndex(componentName: string, defaultExport: boolean = false) {
    if (defaultExport) return `export default from "./${componentName}"`
    return `export {${componentName}} from "./${componentName}"`
  }

  public getComponent({
    componentName,
    props,
    cvax,
    forwardRef,
  }: // displayName,
  {
    componentName: string
    props?: string
    cvax?: string
    forwardRef?: boolean
    rest?: boolean
    displayName?: boolean
  }): string {
    if (forwardRef) this.#imports.push('import { forwardRef } from "react"')
    if (cvax) this.#imports.push('import { cvax, VariantProps } from "cvax"')

    let declaredTypes = props ? this.getPropTypes(props) : []
    let unknownTypes = props ? this.getUnknownPropTypes(props) : []
    let componentProps: string[] = props ? this.getDestructuredProps(props) : []

    const cvaxConfig = cvax ? this.getCvaxConfig(cvax, componentName) : undefined
    if (cvaxConfig) {
      cvaxConfig.props.forEach(item => componentProps.push(item))
    }

    let componentPropsType = ''
    if (cvaxConfig) {
      componentPropsType = `
      type Props = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof variants> & {
        ${declaredTypes.join('\n')}
        ${unknownTypes.join('\n')}
      }
      
      `
    }

    // type Props = ${props ? this.getTypedProps(props) : "{}"}

    const content = `
    
    ${cvaxConfig ? cvaxConfig.template : ''}

    ${cvaxConfig ? componentPropsType : ''}

    const ${componentName} = forwardRef<HTMLDivElement, Props>(
    ({ ${componentProps.join(',')} , ...props }, ref) => {
      return(
        <div
        ref={ref}
        ${cvaxConfig ? `className={variants({ ${cvaxConfig.props.join(',')} })}` : ''}
         {...props} />
        )
      })`

    this.#content.body += content

    const exports = `export { 
      ${componentName}, 
      config as ${uncapitalize(componentName)}Config,
      variants as ${uncapitalize(componentName)}Variants,
      type Props as ${componentName}Props 
    }
    `

    const res = [
      this.#imports,
      // this.#content.body,
      // this.#content.displayName,
      exports,
    ].join('\n\n')

    console.log('🚀 ~ Component ~ res:', res)

    return res
  }

  // public setForwardRef(forwardRef?: boolean = false) {
  //   if (displayName) this.#content += `ButtonLink.displayName = "${componentName}"`
  // }

  // public static getExtendingComponent(
  //   baseComponentName: string,
  //   componentName: string,
  //   props?: string | undefined,
  // ): string {
  //   const basePropsName = baseComponentName + "Props"

  //   const content = `
  //   import { Props as ${basePropsName} } from "./${baseComponentName}"

  //   export type Props = ${props ? this.getTypedProps(props) + `& ${basePropsName}` : basePropsName}

  //   export const ${componentName} = ({
  //     ${props ? this.getDestructuredProps(props) + ", ...rest" : ""}}: Props) => {
  //     return(
  //       <></>
  //       )
  //     }
  //     `

  //   return content
  // }

  private getDestructuredProps(propsStr: string): string[] {
    const [props, unknownProps] = propsStr.replace(/\s+/g, ' ').trim().split(',')

    const asdf = this.getProp(props)
    // console.log("🚀 ~ Component ~ getDestructuredProps ~ asdf:", asdf)

    return [...asdf, ...unknownProps.trim().replace(/\?/g, '').replace(/\s+/g, ' ').split(' ')]

    // return `
    // ${props ? this.getProp(props) : ""}

    // ${
    //   unknownProps
    //     ? unknownProps.replace(/\?/g, "").replace(/\s+/g, " ").split(" ").join(",\n")
    //     : ""
    // }
    // `
  }

  private getPropProps(propsStr: string): string[] {
    const [props, unknownProps] = propsStr.replace(/\s+/g, ' ').trim().split(',')

    return []
    // return `{
    //   ${props ? this.getPropTypes(props) : ""}
    //   ${unknownProps ? this.getUnknownPropTypes(unknownProps) : ""}
    // }`
  }

  private getProp(props: string): string[] {
    return props
      .replace(/\s+/g, ' ')
      .replace(/\?/g, '')
      .trim()
      .split(' ')
      .map(item => {
        if (item.includes('=')) {
          return item.split(':')[0] + '=' + item.split('=')[1]
        }

        return item.split(':')[0]
      })
  }

  private getUnknownPropTypes(props: string): string[] {
    return props
      .trim()
      .replace(/\s+/g, ' ')
      .split(',')[1]
      .trim()
      .split(' ')
      .map(item => item + ':unknown')
  }

  private getPropTypes(props: string): string[] {
    return props
      .trim()
      .replace(/\s+/g, ' ')
      .split(',')[0]
      .split(' ')
      .map(prop => {
        const [key, propType] = prop.split(':')

        if (key === '') throw new Error('key error')
        if (propType === '') throw new Error('propType error')
        if (propType === undefined) throw new Error('propType error')

        let propType_: string

        if (propType.includes('=')) {
          propType_ = propType.split(':')[0].split('=')[0]
          // console.log("🚀 1~ Component ~ getPropTypes ~ propType_:", propType_)
        } else {
          propType_ = propType.split(':')[0]
          // console.log("🚀 2~ Component ~ getPropTypes ~ propType_:", propType_)
        }

        return `${key}: ${propType_}`
      })
  }

  private getCvaxConfig(cvax: string, componentName: string) {
    const propsSplitted = cvax.split(' ')

    const propsTypesSplitted = propsSplitted.map(item => ({
      variantName: item.split(':')[0],
      variants: item.split(':')[1].split('|'),
    }))

    const arrOfProps = propsTypesSplitted.map(item => [
      item.variantName,
      item.variants.reduce((obj, variant) => (Object.assign(obj, { [variant]: '' }), obj), {}),
    ])

    return {
      template: `
      const config = {
        variants: ${JSON.stringify(Object.fromEntries(arrOfProps))},
        defaultVariants: {}
      } as const
      
      const variants = cvax("", config)
      `,
      props: propsTypesSplitted.map(item => item.variantName),
    }
  }

  // --
  private generateExports(
    componentName: string,
    config: {
      component?: 'default' | 'named'
      variantConfig?: boolean
      variants?: boolean
      propsType?: boolean
    } = { component: 'named' },
  ) {
    const arr: Array<[keyof typeof config, string]> = [
      ['component', config.component === 'default' ? `${componentName} as default` : componentName],
    ]

    if (config.variantConfig)
      arr.push(['variantConfig', `config as ${uncapitalize(componentName)}Config`])

    if (config.variants)
      arr.push(['variants', `variants as ${uncapitalize(componentName)}Variants`])

    if (config.propsType) arr.push(['propsType', `type Props as ${componentName}Props`])

    return Object.fromEntries(arr) as {
      [key in keyof typeof config]: string
    }
  }

  // --
  public setDisplayName(displayName: boolean | string = false): void {
    if (!displayName) return

    if (displayName === true) {
      this.#content.displayName = `${this.#componentName}.displayName = "${this.#componentName}"`
      return
    }

    if (typeof displayName === 'string') {
      this.#content.displayName = `${this.#componentName}.displayName = "${displayName}"`
      return
    }

    assertNever(displayName)
  }

  // --
  get componentName(): string | undefined {
    return this.#componentName
  }

  // set componentName(arg: string ) {
  //   if (this.#componentName !== undefined) return
  //   this.#componentName = arg
  // }

  public printShit({
    content = false,
    imports = false,
    exports = false,
    parsedProps = false,
    componentName = false,
  }: {
    [key: string]: boolean
  }) {
    content && console.log('🚀 ~ Component ~ printShit ~ this.#content:', this.#content)
    imports && console.log('🚀 ~ Component ~ printShit ~ this.#imports:', this.#imports)
    exports && console.log('🚀 ~ Component ~ printShit ~ this.#exports:', this.#exports)
    parsedProps && console.log('🚀 ~ Component ~ printShit ~ this.#parsedProps:', this.#parsedProps)
    componentName &&
      console.log('🚀 ~ Component ~ printShit ~ this.#componentName:', this.#componentName)
  }
}

// ------------------------------------------------------------------------------------

function uncapitalize<T extends string>(str: T) {
  return (str.charAt(0).toLowerCase() + str.slice(1)) as Uncapitalize<T>
}

function capitalize<T extends string>(str: T) {
  return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>
}

function assertNever(arg: never): never {
  throw new Error(`${arg} of type ${typeof arg} should be of type never`)
}
