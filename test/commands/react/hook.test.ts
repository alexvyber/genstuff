import { runCommand } from "@oclif/test"
import { expect } from "chai"

describe("react:hook", () => {
  it("runs react:hook cmd", async () => {
    const { stdout } = await runCommand("react:hook")
    expect(stdout).to.contain("hello world")
  })

  it("runs react:hook --name oclif", async () => {
    const { stdout } = await runCommand("react:hook --name oclif")
    expect(stdout).to.contain("hello oclif")
  })
})
