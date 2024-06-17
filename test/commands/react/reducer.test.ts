import { runCommand } from "@oclif/test"
import { expect } from "chai"

describe("react:reducer", () => {
  it("runs react:reducer cmd", async () => {
    const { stdout } = await runCommand("react:reducer")
    expect(stdout).to.contain("hello world")
  })

  it("runs react:reducer --name oclif", async () => {
    const { stdout } = await runCommand("react:reducer --name oclif")
    expect(stdout).to.contain("hello oclif")
  })
})
