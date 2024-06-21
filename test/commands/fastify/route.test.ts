import { runCommand } from "@oclif/test"
import { expect } from "chai"

describe("fastify:route", () => {
  it("runs fastify:route cmd", async () => {
    const { stdout } = await runCommand("fastify:route")
    expect(stdout).to.contain("hello world")
  })

  it("runs fastify:route --name oclif", async () => {
    const { stdout } = await runCommand("fastify:route --name oclif")
    expect(stdout).to.contain("hello oclif")
  })
})
