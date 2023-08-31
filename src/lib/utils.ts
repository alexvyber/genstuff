import { writeFile } from "node:fs/promises"
import fs from "node:fs"

export function equalToDashArrow(arg: string) {
  return arg.replaceAll("=>", "->")
}
export function dashToEqualArrow(arg: string) {
  return arg.replaceAll("->", "=>")
}

export function uncapitalize<T extends string>(str: T) {
  return (str.charAt(0).toLowerCase() + str.slice(1)) as Uncapitalize<T>
}

export function capitalize<T extends string>(str: T) {
  return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>
}

export function assertNever(arg: never): never {
  throw new Error(`${arg} of type ${typeof arg} should be of type never`)
}

export function assertingPropsContainTypes(props: string[], contains: boolean): void | never {
  if (!Boolean(props.find((item) => item.includes(":"))) === contains)
    throw new Error(
      "Make sure that you use comma to separate props or declare all props for proped types"
    )
}

export function propsContainTypes(props: string[]): boolean {
  return Boolean(props.find((item) => item.includes(":"))) === true
}

export function assertingNumberOfMatches(
  str: string,
  match: string /* | RegExp */,
  min: number = 0,
  max: number = 1
): void | never {
  const re = new RegExp(match, "g")

  const numberOfMatches = [...str.matchAll(re)].length
  if (numberOfMatches < 0 || numberOfMatches > 1)
    throw new Error(
      `${str} has ${numberOfMatches} number ${match}'s. Has to be more than ${min} and less than ${max}`
    )
}

const configs = {
  ui: "src/components/ui",
  common: "src/components/common",
  templates: "src/components/templates",
  views: "src/components/views",
} as const

export function assertPath(path: string): asserts path is keyof typeof configs {
  if (!(path in configs)) throw new Error("path error")
}

export async function write(path: string, content: string, override: boolean = false) {
  if (override)
    return await writeFile(path, content, {
      mode: 0o644,
    })

  if (fs.existsSync(path)) throw new Error(`${path} exist`)

  return await writeFile(path, content, {
    mode: 0o644,
  })
}
