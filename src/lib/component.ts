type S = {
  componentName: string
  cvax?: string
  [k: string]: any
  forwardRef?: boolean
  props: string | undefined
}
export class Component {
  // ✔️
  #componentName: string

  // ✔️
  #rawProps: {
    // ✔️
    propsTyped: string | undefined
    // ✔️
    propsUntyped: string | undefined
  }

  #parsedProps: {
    // ✔️
    typed: Array<[string, string, string | undefined]> | []
    // ✔️
    untyped: Array<[string, undefined, string | undefined]> | []
    // ...
    cvax: Array<[string, undefined, string | undefined]> | []
  } = {
    typed: [],
    untyped: [],
    cvax: [],
  }

  // ✔️
  #exports: {
    component?: string
    variantConfig?: string
    variants?: string
    propsType?: string
  }

  // ✔️
  #imports: {
    cvax?: string
    forwardRef?: string
  } = {}
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

  constructor({ componentName, cvax, props, forwardRef }: S) {
    this.#componentName = componentName
    this.#rawProps = this.getRawProps(props)
    this.#exports = this.generateExports(componentName, {
      component: 'named',
      variantConfig: true,
      variants: true,
      propsType: true,
    })
    this.#imports = this.generateImpots({ cvax: Boolean(cvax), forwardRef })
    this.#parsedProps.typed = this.getTypedProps()
    this.#parsedProps.untyped = this.getUntypedProps()
  }

  // public setProps(props: string): void {
  //   this.#parsedProps.props = { some: 'some' }
  // }
  // public setCvaxProps(props: string) {
  //   this.#parsedProps.cvaxProps = { some: 'some' }
  // }

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
  private getUntypedProps() {
    let parsed

    if (this.#rawProps.propsUntyped) parsed = this.ParseUntypedProps(this.#rawProps.propsUntyped)

    return parsed || []
  }

  private ParseUntypedProps(props: string) {
    const splitted = props.split(' ')

    return splitted.map(item => {
      const replacedArrow = equalToDashArrow(item)

      const [propName, propDefaultValue] = replacedArrow.split('=') as [string, string | undefined]

      let defaultPropValue
      if (propDefaultValue) defaultPropValue = dashToEqualArrow(propDefaultValue)

      return [propName, undefined, defaultPropValue]
    }) as Array<[string, undefined, string | undefined]>
  }

  // --
  private getTypedProps() {
    let parsed
    if (this.#rawProps.propsTyped) parsed = this.parseTypedProps(this.#rawProps.propsTyped)

    return parsed || []
  }

  private parseTypedProps(props: string) {
    // :
    //   | {
    //       propName: string
    //       propType: string
    //       defaultPropValue: string | undefined
    //     }[]
    //   | never

    // "laoding?:boolean some?:string|undefined='asdfasdfasdfsadf"
    // onClick:()=>()=>string=()=>()=>"asdfasdf"
    // ['laoding?:boolean', 'onClick:()=>()=>string=()=>()=>"asdfasdf"']
    const splitted = props.split(' ')

    assertingPropsContainTypes(splitted) // assert that all typed props have ":"

    return splitted.map(item => {
      const replacedArrow = equalToDashArrow(item)

      const [propName, propTypeAndDefaultValue] = replacedArrow.split(':')

      const propType = dashToEqualArrow(propTypeAndDefaultValue.split('=')[0])

      const defaultValue = replacedArrow.split('=')[1] as string | undefined
      let defaultPropValue
      if (defaultValue) defaultPropValue = dashToEqualArrow(defaultValue)

      return [propName, propType, defaultPropValue]
    }) as Array<[string, string, string | undefined]>
  }

  private getPropsOrRest(arg: string): [string, 'props'] | [string, 'rest'] | [string, undefined] {
    if (arg.includes(' props'))
      return [arg.replaceAll(' props', '').replaceAll(' rest', ''), 'props']

    if (arg.includes(' rest')) return [arg.replaceAll(' rest', ''), 'rest']

    return [arg, undefined]
  }

  private cleanProps(props: string) {
    const one = props.trim().replace(/\s\s+/g, ' ').replace(/\ :/g, ':').replace(/:\ /g, ':')
    return one
  }

  private getRawProps(props: string | undefined): {
    propsTyped: string | undefined
    propsUntyped: string | undefined
  } {
    if (!props) throw new Error('NO PROPS ERROR')

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

  // --
  private generateImpots(
    config: {
      cvax?: boolean
      forwardRef?: boolean
    } = {
      cvax: false,
      forwardRef: false,
    },
  ) {
    const arr: Array<[keyof typeof config, string]> = []

    if (config.forwardRef) arr.push(['forwardRef', 'import { forwardRef } from "react"'])
    if (config.cvax) arr.push(['cvax', 'import { cvax, VariantProps } from "cvax"'])

    return Object.fromEntries(arr) as {
      [key in keyof typeof config]: string
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

function equalToDashArrow(arg: string) {
  return arg.replaceAll('=>', '->')
}
function dashToEqualArrow(arg: string) {
  return arg.replaceAll('->', '=>')
}

function uncapitalize<T extends string>(str: T) {
  return (str.charAt(0).toLowerCase() + str.slice(1)) as Uncapitalize<T>
}

function capitalize<T extends string>(str: T) {
  return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>
}

function assertNever(arg: never): never {
  throw new Error(`${arg} of type ${typeof arg} should be of type never`)
}

function assertingPropsContainTypes(props: string[]): void | never {
  if (Boolean(props.find(item => !item.includes(':'))))
    throw new Error(
      'Make sure that you use comma to separate props or declare all props for proped types',
    )
}

function assertingNumberOfMatches(
  str: string,
  match: string /* | RegExp */,
  min: number = 0,
  max: number = 1,
): void | never {
  const re = new RegExp(match, 'g')

  const numberOfMatches = [...str.matchAll(re)].length
  if (numberOfMatches < 0 || numberOfMatches > 1)
    throw new Error(
      `${str} has ${numberOfMatches} number ${match}'s. Has to be more than ${min} and less than ${max}`,
    )
}
