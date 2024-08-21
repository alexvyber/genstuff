import { camelCase, kebabCase } from "change-case"
import type { TemplateConfig } from "../types.js"
import { capitalize } from "remeda"
import { toType } from "../../utils/react-comp.js"

export function template({ name, parsedVariants, parsedProps }: TemplateConfig) {
  let variants = ""

  for (const variant of parsedVariants) {
    const some = capitalize(camelCase(kebabCase(`${name}_${variant.name}`)))

    variants += `export const ${some}: Story<${name}Props> = (props) => {
    
    return <>
${variant.variants.reduce((acc, cur, _, arr) => {
  return `${acc}\n <${name} {...props} ${variant.name}={${cur}} />`
}, "")}
    </>};\n`

    let others = ""
    for (const prop of parsedProps) {
      if (prop.name.includes("...")) {
        continue
      }
      if (prop.name === "children") {
        others += `children: '${some}',`
        continue
      }
      others += `${prop.name}: ${toType(prop.type)} ,`
    }

    variants += `${some}.args = {
       ${others}
      };\n\n`
  }

  return `
import React from 'react';
import type { StoryDefault, Story } from "@ladle/react";
import { ${name}, ${name}Props } from "./${kebabCase(name)}.tsx"

export default {
    title: "${name}",
    meta: {
      key: "value",
    },
  } satisfies StoryDefault;

${variants}




`
}
