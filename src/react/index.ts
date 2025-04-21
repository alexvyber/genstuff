// type PropsType = Record<string, string | Record<string, string  | Record<string, string >>>

import { invariant } from "es-toolkit"

export type ObjectProps = { name: string; optional: boolean; readonly: boolean; type: string }

export function parseProps(strProps: string | string[]): ObjectProps[] {
  if (Array.isArray(strProps)) {
    return strProps.map(parsePropsObject).map(composePropsObject)
  }

  var propStrings = strProps.split(";")

  return propStrings.map(parsePropsObject).map(composePropsObject)
}

function parsePropsObject(str: string): Partial<ObjectProps> {
  var optional = str.includes("?")
  var readonly = str.startsWith("readonly")
  var name = str.replaceAll("?", "").split(":")[0]?.trim().replace("readonly", "")
  var type = str.replaceAll("?", "").split(":").slice(1).join(":")

  return { optional, readonly, name, type }
}

export function composePropsObject(props: Partial<ObjectProps>): ObjectProps {
  invariant(typeof props.name === "string", "name can't be empty")

  return {
    readonly: false,
    optional: false,
    type: "never",
    ...props,
  } as any
}

export function propsFromModel(model: object): ObjectProps[] {
  var props: ObjectProps[] = []

  for (const [name, params] of Object.entries(model)) {
    var obj = composePropsObject({
      name,
      optional: params.nullable,
      type: getTsTypeFromSql(params.type),
    })

    props.push(obj)
  }

  return props
}

function getTsTypeFromSql(str: string) {
  if (["text", "varchar"].includes(str)) {
    return "string"
  }

  return "any"
}
