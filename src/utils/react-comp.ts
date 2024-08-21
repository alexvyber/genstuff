import { uncapitalize } from "remeda"

export type Prop = {
  name: string
  optional: boolean
  type: string
  defaultValue?: string
}

export type Variant = Omit<Prop, "optional" | "type"> & { variants: string[] }

export function parseProps(str?: string): Prop[] {
  if (!str) {
    return []
  }

  const records = str.split(";").map((v) => v.trim())

  const props = [] as Prop[]

  for (const record of records) {
    const parsedRecord: Prop = {
      name: getPropName(record),
      optional: getPropOptional(record),
      defaultValue: getPropDefaultValue(record),
      type: getPropType(record),
    }

    props.push(parsedRecord)
  }

  return props
}

function getPropName(record: string): string {
  if (record.includes("?:")) {
    return record.split("?:")[0]
  }
  return record.split(":")[0]
}

function getPropOptional(record: string): boolean {
  return record.includes("?:")
}

function getPropDefaultValue(record: string): string {
  return record.split("=")[1]
}

function getPropType(record: string): string {
  return record.split("=")[0].split(":")[1]
}

// --

export function renderProps(props: Prop[], typeName = "Props"): string {
  const propsArr = [] as string[]

  for (const prop of props) {
    if (prop.name.startsWith("...")) {
      propsArr.push(prop.name)
      continue
    }

    let str = `${prop.name}`
    if (prop.defaultValue) {
      str += `= ${prop.defaultValue}`
    }

    propsArr.push(str)
  }

  return `{ ${propsArr.join(", ")} }: ${typeName}`
}

export function rednerTypes(props: Prop[]): string {
  const typesArr = [] as string[]

  for (const prop of props) {
    if (prop.name.startsWith("...")) {
      continue
    }
    typesArr.push(`${prop.name}${prop.optional ? "?" : ""}: ${prop.type}`)
  }

  return `${typesArr.join(";\n")}`
}

// --
function getVariants(record: string): string[] {
  return record.split(":")[1].split("|")
}

export function parseVariants(str?: string): Variant[] {
  const variants = [] as Variant[]

  if (!str) {
    return variants
  }

  const records = str.split(";").map((v) => v.trim())

  for (const record of records) {
    const parsedRecord: Variant = {
      name: getPropName(record),
      defaultValue: getPropDefaultValue(record),
      variants: getVariants(record),
    }

    variants.push(parsedRecord)
  }

  return variants
}

export function renderVariants(variants: Variant[], varName?: string): string {
  const vars = [] as string[]

  for (const variant of variants) {
    vars.push(`${variant.name}: { ${variant.variants.map((v) => `${v}: ""`).join(",\n")} }`)
  }

  return `const ${varName ? uncapitalize(varName) : ""}Variants = cvax({
    base: "",
     variants: {
      ${vars.join(",\n")}
     },
    })`
}

export function toType(arg?: string): any {
  if (!arg) {
    return "undefined"
  }
  if (arg.toLowerCase() === "string") {
    return '"string"'
  }
  if (arg.toLowerCase() === "number") {
    return "69"
  }
  if (arg.toLowerCase() === "boolean") {
    return "true"
  }
  return "undefined"
}
