import { runCommand } from "@oclif/test"
import { expect } from "chai"

describe("next:page", () => {
  it("runs next:page cmd", async () => {
    const { stdout } = await runCommand("next:page")
    expect(stdout).to.contain("hello world")
  })

  it("runs next:page --name oclif", async () => {
    const { stdout } = await runCommand("next:page --name oclif")
    expect(stdout).to.contain("hello oclif")
  })
})
