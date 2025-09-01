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
import { deburr, lowerFirst, startCase, trim } from "es-toolkit/string"
import type { HelperFn } from "./genstuff.js"

export var helpers = {
  upperCase: (str) => str.toUpperCase(),
  lowerCase: (str) => str.toLowerCase(),
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
  deburr: (str) => deburr(str),
  lowerFirst: (str) => lowerFirst(str),
  startCase: (str) => startCase(str),
  trim: (str) => trim(str),
} satisfies Helpers

type Helpers = Record<string, HelperFn>
