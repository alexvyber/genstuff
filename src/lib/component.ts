export class Component {
  // allowedPropTypes = ["string", "number", "any", "unknown", "object", "boolean"]
  public static getIndex(componentName: string, defaultExport: boolean = false) {
    if (defaultExport) return `export default from "./${componentName}"`
    return `export {${componentName}} from "./${componentName}"`
  }

  public static getComponent({
    componentName,
    props,
    cvax,
  }: {
    componentName: string
    props?: string
    cvax?: string
  }): string {
    let imports = ""
    if (cvax)
      imports += `import { forwardRef } from 'react'
      import { cvax, VariantProps } from "cvax"`

    let declaredTypes = props ? this.getPropTypes(props) : []
    let unknownTypes = props ? this.getUnknownPropTypes(props) : []

    let componentProps: string[] = props ? this.getDestructuredProps(props) : []

    console.log("🚀 ~ Component ~ componentProps:", componentProps)

    const cvaxConfig = cvax ? getCvaxConfig(cvax, componentName) : undefined
    if (cvaxConfig) {
      cvaxConfig.props.forEach(item => componentProps.push(item))
    }

    let componentPropsType = ""
    if (cvaxConfig) {
      componentPropsType = `
      type Props = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof variants> & {
        ${declaredTypes.join("\n")}
        ${unknownTypes.join("\n")}
      }
      
      `
    }

    let componentreturn = ""
    // type Props = ${props ? this.getTypedProps(props) : "{}"}

    const content = `
    
    ${cvaxConfig ? cvaxConfig.template : ""}

    ${cvaxConfig ? componentPropsType : ""}

    const ${componentName} = forwardRef<HTMLDivElement, Props>(
    ({ ${componentProps.join(",")} , ...props }, ref) => {
      return(
        <div
        ref={ref}
        ${cvaxConfig ? `className={variants({ ${cvaxConfig.props.join(",")} })}` : ""}
         {...props} />
        )
      })`

    // console.log("🚀 ~ Component ~ content:", content)

    const exports = `export { 
      ${componentName}, 
      config as ${downCaseFirst(componentName)}Config,
      variants as ${downCaseFirst(componentName)}Variants,
      type Props as ${componentName}Props 
    }
    `

    const res = [imports, content, exports].join("\n\n")

    // console.log("🚀 ~ Component ~ res:\n\n\n\n\n\n\n", res)

    return res
  }

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

  private static getDestructuredProps(propsStr: string): string[] {
    const [props, unknownProps] = propsStr.replace(/\s+/g, " ").trim().split(",")

    const asdf = this.getProp(props)
    // console.log("🚀 ~ Component ~ getDestructuredProps ~ asdf:", asdf)

    return [...asdf, ...unknownProps.trim().replace(/\?/g, "").replace(/\s+/g, " ").split(" ")]

    // return `
    // ${props ? this.getProp(props) : ""}

    // ${
    //   unknownProps
    //     ? unknownProps.replace(/\?/g, "").replace(/\s+/g, " ").split(" ").join(",\n")
    //     : ""
    // }
    // `
  }

  private static getPropProps(propsStr: string): string[] {
    const [props, unknownProps] = propsStr.replace(/\s+/g, " ").trim().split(",")

    return []
    // return `{
    //   ${props ? this.getPropTypes(props) : ""}
    //   ${unknownProps ? this.getUnknownPropTypes(unknownProps) : ""}
    // }`
  }

  private static getProp(props: string): string[] {
    return props
      .replace(/\s+/g, " ")
      .replace(/\?/g, "")
      .trim()
      .split(" ")
      .map(item => {
        if (item.includes("=")) {
          return item.split(":")[0] + "=" + item.split("=")[1]
        }

        return item.split(":")[0]
      })
  }

  private static getUnknownPropTypes(props: string): string[] {
    return props
      .trim()
      .replace(/\s+/g, " ")
      .split(",")[1]
      .trim()
      .split(" ")
      .map(item => item + ":unknown")
  }

  private static getPropTypes(props: string): string[] {
    return props
      .trim()
      .replace(/\s+/g, " ")
      .split(",")[0]
      .split(" ")
      .map(prop => {
        const [key, propType] = prop.split(":")

        if (key === "") throw new Error("key error")
        if (propType === "") throw new Error("propType error")
        if (propType === undefined) throw new Error("propType error")

        let propType_: string

        if (propType.includes("=")) {
          propType_ = propType.split(":")[0].split("=")[0]
          // console.log("🚀 1~ Component ~ getPropTypes ~ propType_:", propType_)
        } else {
          propType_ = propType.split(":")[0]
          // console.log("🚀 2~ Component ~ getPropTypes ~ propType_:", propType_)
        }

        return `${key}: ${propType_}`
      })
  }
}

function getCvaxConfig(cvax: string, componentName: string) {
  const propsSplitted = cvax.split(" ")

  const propsTypesSplitted = propsSplitted.map(item => ({
    variantName: item.split(":")[0],
    variants: item.split(":")[1].split("|"),
  }))

  console.log("🚀 ~ propsTypesSplitted ~ propsTypesSplitted:", propsTypesSplitted)

  const arrOfProps = propsTypesSplitted.map(item => [
    item.variantName,
    item.variants.reduce((obj, variant) => (Object.assign(obj, { [variant]: "" }), obj), {}),
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

function downCaseFirst(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1)
}

// const opbh = Object.fromEntries([
//   ["asdf", "asdf"],
//   ["asdfa", "asdf"],
// ] as const)
// console.log("🚀 ~ opbh:", opbh)
