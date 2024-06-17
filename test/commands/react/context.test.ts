import { runCommand } from "@oclif/test"
import { expect } from "chai"

describe("react:context", () => {
  it("runs react:context cmd", async () => {
    const { stdout } = await runCommand("react:context")
    expect(stdout).to.contain("hello world")
  })

  it("runs react:context --name oclif", async () => {
    const { stdout } = await runCommand("react:context --name oclif")
    expect(stdout).to.contain("hello oclif")
  })
})
