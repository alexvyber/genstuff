import { runCommand } from "@oclif/test"
import { expect } from "chai"

describe("fastify:routes", () => {
  it("runs fastify:routes cmd", async () => {
    const { stdout } = await runCommand("fastify:routes")
    expect(stdout).to.contain("hello world")
  })

  it("runs fastify:routes --name oclif", async () => {
    const { stdout } = await runCommand("fastify:routes --name oclif")
    expect(stdout).to.contain("hello oclif")
  })
})
