export class Content {
  public static getExport(
    componentName: string,
    defaultExport: boolean = false,
  ) {
    if (defaultExport) return `export default from "./${componentName}"`
    return `export {${componentName}} from "./${componentName}"`
  }

  public static getProps(props: string) {
    const one = props.replace(/\s+/g, " ")
    console.log("🚀 ~ Content ~ getProps ~ one:", one)
  }

  // public static getComponent(componentName: string) {
  //   return `export { ${
  //     defaultExport ? "default" : componentName
  //   } } from "./${componentName}"`
  // }
}

Content.getProps("some         : string other:    number more: boolean")
