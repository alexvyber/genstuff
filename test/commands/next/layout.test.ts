import { runCommand } from "@oclif/test"
import { expect } from "chai"

describe("next:layout", () => {
  it("runs next:layout cmd", async () => {
    const { stdout } = await runCommand("next:layout")
    expect(stdout).to.contain("hello world")
  })

  it("runs next:layout --name oclif", async () => {
    const { stdout } = await runCommand("next:layout --name oclif")
    expect(stdout).to.contain("hello oclif")
  })
})
