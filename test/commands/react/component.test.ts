import { runCommand } from "@oclif/test"
import { expect } from "chai"

describe("react:component", () => {
  it("runs react:component cmd", async () => {
    const { stdout } = await runCommand("react:component")
    expect(stdout).to.contain("hello world")
  })

  it("runs react:component --name oclif", async () => {
    const { stdout } = await runCommand("react:component --name oclif")
    expect(stdout).to.contain("hello oclif")
  })
})
