import { Liquid } from "liquidjs"
import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { capitalize, write } from "./utils"
import { camelToKebab } from "@alexvyber/convert-case"
const engine = new Liquid()

// -------------------------------------------------------------
export type RenderImports = (
  | { defaultImport: string; namedImports?: string[] }
  | { defaultImport?: string; namedImports: string[] }
) & { source: string }

export async function renderImports(imports: RenderImports[]) {
  const content = await getTemplate("../templates/import.liquid")

  const some = imports.map(async ({ defaultImport, namedImports, source }): Promise<string> => {
    if (!defaultImport && !namedImports) throw new Error("both imports can't be omited")

    const filteredNamedImports = namedImports?.filter(Boolean)
    if (!defaultImport && filteredNamedImports && filteredNamedImports.filter(Boolean).length === 0)
      throw new Error("if no default named can't be empty or with empty string only")

    let importModules = ""

    if (defaultImport)
      importModules += defaultImport + `${(filteredNamedImports?.length || 0) > 0 ? ", " : " "}`
    if (filteredNamedImports && filteredNamedImports.length > 0)
      importModules += `{ ${filteredNamedImports.join(", ")} }`

    return await engine.parseAndRender(content, {
      modules: importModules,
      source,
    })
  })

  let other = ""
  for await (const num of some) {
    other += line(num)
  }

  return other
}

// -------------------------------------------------------------
export type RenderExports =
  | { defaultExport: string; namedExports?: string[] }
  | { defaultExport?: string; namedExports: string[] }

export async function renderExports({ defaultExport, namedExports }: RenderExports) {
  if (!defaultExport && !namedExports) throw new Error("both Exports can't be omited")

  const filteredNamedExports = namedExports?.filter(Boolean)
  if (!defaultExport && filteredNamedExports && filteredNamedExports.length === 0)
    throw new Error("if no default named can't be empty or with empty string only")

  let exportModules = ""

  if (filteredNamedExports && filteredNamedExports.length > 0)
    exportModules += line(`export { ${filteredNamedExports.join(", ")} }`)
  if (defaultExport) exportModules += line("export default " + defaultExport)

  return exportModules
}

// -------------------------------------------------------------
function renderDisplayName(componentName: string, displayName?: string) {
  return `${capitalize(componentName)}.displayName = "${capitalize(displayName || componentName)}"`
}

// -------------------------------------------------------------
export async function renderComponent({
  componentName,
  as = "const",
  ref = false,
  exportInPlace = false,
  exportDefault = false,
  props,
  passedProps,
}: {
  componentName: string
  as?: "const" | "function"
  ref?: boolean
  exportInPlace?: boolean
  exportDefault?: boolean
  passedProps?: React.AllHTMLAttributes<HTMLElement>
  props?: string[]
}) {
  console.log("🚀 ~ as:", as)
  const content = await getTemplate(`../templates/${as}${ref ? "-ref" : ""}.liquid`)

  const props_ = props
    ?.filter(Boolean)
    .filter((item) => !["children", "rest", "props"].includes(item))
  const rest = props?.includes("rest")
    ? "...rest"
    : props?.includes("props")
    ? "...props"
    : undefined

  return await engine.parseAndRender(content, {
    componentName,
    props:
      props_ && props_.length > 0
        ? `{ ${props_.join(", ")} ${rest ? "," + rest : ""} }`
        : undefined,
    exportInPlace,
    className: passedProps?.className ? `className={${passedProps.className}}` : undefined,
    exportDefault,
    children: props?.includes("children"),
    rest: `{ ${rest} } `,
    displayName: ref ? renderDisplayName(componentName) : undefined,
  })
}

// -------------------------------------------------------------
async function renderPropsType({
  componentName,
  ref,
}: {
  componentName: string
  as?: "const" | "function"
  ref?: boolean
  props?: any
}) {
  const some = `type Porps = { 

  }`
  // const content = await getTemplate(`../templates/${as}${ref ? "-ref": ""}.liquid`)

  // return engine.parseAndRender(content, {
  //   componentName,
  //   props: "{ some, other}",
  // })
}

// ---
async function renderAll(componentName: string) {
  const [imports, setup, component, exports] = await Promise.all([
    renderImports([
      {
        source: "react",
        defaultImport: "React",
      },
      {
        source: "katzen",
        defaultImport: "Katzen",
      },
      {
        source: "some",
        defaultImport: "Some",
      },
    ]),

    new Promise((res, _rej) => res("setup")),

    renderComponent({
      componentName,
      exportInPlace: true,
      exportDefault: true,
      ref: true,
      passedProps: {
        className: '"CLASS_NAME"',
      },
      props: ["one", "two", "children", "rest"],
    }),

    renderExports({
      defaultExport: "Some",
      namedExports: ["some", "other"],
    }),
  ])

  const filePath = path.resolve(__dirname, "../templates/component.liquid")
  const content = await readFile(filePath, { encoding: "utf8" })

  return engine.parseAndRender(content, {
    imports,
    setup,
    component,
    exports,
  })
}

// renderAll("SomeShit")

// ---

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// ---
export function line(str: string, offset?: { top?: number; bottom?: number }) {
  return "\n".repeat(0 + (offset?.top || 0)) + str + ";" + "\n".repeat(1 + (offset?.bottom || 0))
}

async function getTemplate(templatePath: string): Promise<string> {
  const filePath = path.resolve(__dirname, templatePath)
  return readFile(filePath, { encoding: "utf8" })
}
