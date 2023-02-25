export class Component {
  // allowedPropTypes = ["string", "number", "any", "unknown", "object", "boolean"]
  public static getIndex(componentName: string, defaultExport: boolean = false) {
    if (defaultExport) return `export default from "./${componentName}"`
    return `export {${componentName}} from "./${componentName}"`
  }

  public static getComponent(componentName: string, props: string | undefined): string {
    const content = `
    export type Props = ${props ? this.getTypedProps(props) : "{}"}
    
    export const ${componentName} = ({${props ? this.getDestructuredProps(props) : ""}}: Props) => {
      return(
        <></>
        )
      }
      `

    return content
  }

  public static getExtendingComponent(
    baseComponentName: string,
    componentName: string,
    props?: string | undefined,
  ): string {
    const basePropsName = baseComponentName + "Props"

    const content = `
    import { Props as ${basePropsName} } from "./${baseComponentName}"

    export type Props = ${props ? this.getTypedProps(props) + `& ${basePropsName}` : basePropsName}
    
    export const ${componentName} = ({
      ${props ? this.getDestructuredProps(props) + ", ...rest" : ""}}: Props) => {
      return(
        <></>
        )
      }
      `

    return content
  }

  private static getDestructuredProps(propsStr: string): string {
    const [props, unknownProps] = propsStr.replace(/\s+/g, " ").trim().split(",")

    return `${props ? this.getProp(props) : ""}
          ${
            unknownProps
              ? unknownProps.replace(/\?/g, "").replace(/\s+/g, " ").split(" ").join(",\n")
              : ""
          }
      `
  }

  private static getTypedProps(propsStr: string): string {
    const [props, unknownProps] = propsStr.replace(/\s+/g, " ").trim().split(",")

    return `{
      ${props ? this.getPropTypes(props) : ""}
      ${unknownProps ? this.getUnknownPropTypes(unknownProps) : ""}
    }`
  }

  private static getProp(props: string): string {
    return props
      .replace(/\s+/g, " ")
      .replace(/\?/g, "")
      .trim()
      .split(" ")
      .map(item => item.split(":")[0])
      .join(",\n")
  }

  private static getUnknownPropTypes(props: string): string {
    return props
      .replace(/\s+/g, " ")
      .trim()
      .split(" ")
      .map(item => item + ": unknown")
      .join("\n")
  }

  private static getPropTypes(props: string): string {
    return props
      .replace(/\s+/g, " ")
      .trim()
      .split(" ")
      .map(prop => {
        const [key, propType] = prop.split(":")

        if (key === "") throw new Error("key error")
        if (propType === "") throw new Error("propType error")

        return `${key}: ${propType}`
      })
      .join("\n")
  }
}

function downCaseFirst(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1)
}
