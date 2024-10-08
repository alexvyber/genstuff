export interface TemplateConfig {
  name: string
}

export function template({ name }: TemplateConfig) {
  return `import React from "react"

type Props = Record<string, any>

export class ${name} extends React.Component<Props>{
    render() {
      return <h1>Hello, {this.props.name}!</h1>;
    }
  }`
}
