import fs from "node:fs"

function readFileRaw(path: string) {
  return fs.promises.readFile(path, null)
}

function writeFile(path: string, data: string | object, options?: { raw?: boolean }) {
  return fs.promises.writeFile(
    path,
    typeof data === "object" ? JSON.stringify(data) : data,
    options?.raw ? "utf8" : undefined,
  )
}

function fileExists(path: string) {
  return fs.promises.access(path).then(
    () => true,
    () => false,
  )
}

export { writeFile, readFileRaw, fileExists }
