import { runCommand } from "@oclif/test"
import { expect } from "chai"

describe("fastify:plugin", () => {
  it("runs fastify:plugin cmd", async () => {
    const { stdout } = await runCommand("fastify:plugin")
    expect(stdout).to.contain("hello world")
  })

  it("runs fastify:plugin --name oclif", async () => {
    const { stdout } = await runCommand("fastify:plugin --name oclif")
    expect(stdout).to.contain("hello oclif")
  })
})
