import { kebabCase } from "change-case"
import { uncapitalize } from "remeda"
import { rednerTypes, renderProps } from "../../utils/react-comp.js"
import type { TemplateConfig } from "../types.js"

export function template({ name, parsedProps, parsedVariants }: TemplateConfig) {
  const p = parsedProps.find((v) => v.name.includes("..."))
  const hasClassName = parsedProps.some((v) => v.name === "className")
  const hasVariants = parsedVariants.length > 0
  return `import React from "react"
  ${hasVariants ? `import { ${uncapitalize(name)}Variants, type  ${name}VariantProps  } from "./${kebabCase(name)}.variants"` : ""}

type Props = ${hasVariants ? `${name}VariantProps` : ""} & { ${rednerTypes(parsedProps.filter(p => !parsedVariants.some(v => v.name ===p.name)))} };

function ${name} ( ${renderProps([...parsedProps])} ) {
    return <div 
    ${p ? `{${p.name}}` : ""}
    ${hasVariants ? `className={${uncapitalize(name)}Variants({ ${hasClassName ? "className" : ""} ${parsedVariants.reduce((acc, cur) => `${acc}, ${cur.name}`, "")}})}  ` : ""}
    
    
>{children}</div>
}

export { ${name} };
export type { Props as ${name}Props };
`
}
