export interface TemplateConfig {
  name: string
}

export function template({ name }: TemplateConfig) {
  return `import React from "react"

type Props = Record<string, any>

export const ${name} = (props: Props) => {
    return <div>Hello</div>
}`
}
