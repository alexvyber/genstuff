export class Stories {
  public static getStories(
    componentName: string,
    props?: string | undefined,
  ): string {
    const content = `
    import { ${componentName} } from "."
    
    import type { Story } from "@ladle/react"
    import type { Props } from "./${componentName}"
    
    export default {
      title: "${componentName}/Default"
    }
    
    export const Default: Story<Props> = args => <${componentName} {...args} />
    Default.args = { ${props ? this.getProps(props) : ""} } satisfies Props
    
    Default.argTypes = {}
    `

    return content
  }

  public static getProps(props: string) {
    const [one, two] = props.replace(/\s+/g, " ").trim().split(",")

    const one_ = one
      .replace(/\s+/g, " ")
      .replace(/\?/g, "")
      .split(" ")
      .map(item => item.split(":")[0] + ":" + Math.floor(Math.random() * 100))
      .join(",\n")

    const two_ = two
      ? two
          .replace(/\s+/g, " ")
          .replace(/\?/g, "")
          .trim()
          .split(" ")
          .map(item => item.split(":")[0] + ":" + '"unknown"')
          .join(",\n")
      : ""

    return one_ + ",\n" + two_
  }
}

const arrows = ["()=>", "(any)=>"] as const
type Arrow = (typeof arrows)[number]

type Types =
  | "string"
  | "number"
  | "object"
  | "boolean"
  | "{}"
  | "[]"
  | "any"
  | "never"
  | "void"

type FuncType = `${Arrow}${Types}`

const getDefaultValue = (arg: FuncType | Types) => {}
