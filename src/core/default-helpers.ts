import {
  camelCase,
  snakeCase,
  dotCase,
  pathCase,
  sentenceCase,
  constantCase,
  kebabCase,
  pascalCase,
} from "change-case"
import { titleCase } from "title-case"
import type { HelperFn } from "./genstuff"

export var helpers: Helpers = {
  lowerCase: (str) => str.toUpperCase(),
  upperCase: (str) => str.toLowerCase(),
  camelCase: (str) => camelCase(str),
  snakeCase: (str) => snakeCase(str),
  dotCase: (str) => dotCase(str),
  pathCase: (str) => pathCase(str),
  sentenceCase: (str) => sentenceCase(str),
  constantCase: (str) => constantCase(str),
  titleCase: (str) => titleCase(str),
  kebabCase: (str) => kebabCase(str),
  dashCase: (str) => kebabCase(str),
  kabobCase: (str) => kebabCase(str),
  pascalCase: (str) => pascalCase(str),
  properCase: (str) => pascalCase(str),
}

type Cases =
  | "lowerCase"
  | "upperCase"
  | "camelCase"
  | "snakeCase"
  | "dotCase"
  | "pathCase"
  | "sentenceCase"
  | "constantCase"
  | "titleCase"
  | "kebabCase"
  | "dashCase"
  | "kabobCase"
  | "pascalCase"
  | "properCase"

type Helpers = Record<Cases, HelperFn>
