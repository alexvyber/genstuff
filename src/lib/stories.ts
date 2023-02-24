export class Stories {
  public static getStories(componentName: string): string {
    const content = `
    import { ${componentName} } from "."
    
    import type { Story } from "@ladle/react"
    import type { Props } from "./${componentName}"
    
    export default {
      title: "${componentName}/Default"
    }
    
    export const Default: Story<Props> = args => <${componentName} {...args} />
    Default.args = {
    
    } satisfies Props
    
    Default.argTypes = {}
    `

    return content
  }
}
