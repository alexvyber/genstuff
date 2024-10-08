import { uncapitalize } from "remeda"

import type { TemplateConfig } from "../types.js"
import { renderVariants } from "../../utils/react-comp.js"

export function template({ name, parsedVariants }: TemplateConfig) {
  return `import { cvax, VariantProps } from 'cvax';

${renderVariants(parsedVariants, name)}

type ${name}VariantProps = VariantProps<typeof ${uncapitalize(name)}Variants>;
export type { ${name}VariantProps };
export { ${uncapitalize(name)}Variants };

`
}
