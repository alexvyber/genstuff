class IndexFile {
  public static getIndex(componentName: string, defaultExport: boolean = false) {
    if (defaultExport) return `export default from "./${componentName}"`
    return `export {${componentName}} from "./${componentName}"`
  }
}
