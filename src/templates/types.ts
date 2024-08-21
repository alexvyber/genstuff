import type { Prop, Variant } from "../utils/react-comp.js"

export type TemplateFn<C> = (config?: C) => string

export interface TemplateConfig {
  name: string
  parsedProps: Prop[]
  parsedVariants: Variant[]
}
