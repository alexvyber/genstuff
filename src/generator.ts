import { Command, type Interfaces } from "@oclif/core"
import chalk from "chalk"
import { existsSync } from "node:fs"
import { renderFile } from "ejs"
import { join, relative } from "node:path"
import { outputFile } from "fs-extra"

export type Args<T extends typeof Command> = Interfaces.InferredArgs<T["args"]>

export type Flags<T extends typeof Command> = Interfaces.InferredFlags<
  (typeof GeneratorCommand)["baseFlags"] & T["flags"]
>

export type FlaggablePrompt = {
  message: string
  options?: readonly string[] | string[]
  validate: (d: string) => boolean | string
}

export type GetFlagOrPromptOptions = {
  /**
   * The default value for the prompt if the `--yes` flag is provided.
   */
  defaultValue: string
  /**
   * A function that returns a value if the user has not provided the value via the flag. This will rerun before
   * the check for the `--yes` flag.
   */
  maybeOtherValue?: () => Promise<string | undefined>
  /**
   * The name of the flaggable prompt. Corresponds to the key in `this.flags`.
   */
  name: string
  /**
   * The type of prompt to display.
   */
  type: "input" | "select"
}

export abstract class GeneratorCommand<T extends typeof Command> extends Command {
  protected args!: Args<T>
  protected flags!: Flags<T>
  public templatesDir!: string

  protected flaggablePrompts!: Record<string, FlaggablePrompt>

  /**
   * Get a flag value or prompt the user for a value.
   *
   * Resolution order:
   * - Flag value provided by the user
   * - Value returned by `maybeOtherValue`
   * - `defaultValue` if the `--yes` flag is provided
   * - Prompt the user for a value
   */
  public async getFlagOrPrompt({ defaultValue, maybeOtherValue, name, type }: GetFlagOrPromptOptions): Promise<string> {
    if (!this.flaggablePrompts) {
      throw new Error("No flaggable prompts defined")
    }

    if (!this.flaggablePrompts[name]) {
      throw new Error(`No flaggable prompt defined for ${name}`)
    }

    const maybeFlag = () => {
      if (!this.flags[name]) {
        return
      }

      this.log(`${chalk.green("?")} ${chalk.bold(this.flaggablePrompts[name].message)} ${chalk.cyan(this.flags[name])}`)

      return this.flags[name]
    }

    const maybeDefault = () => {
      if (!this.flags.yes) {
        this.log(`${chalk.green("?")} ${chalk.bold(this.flaggablePrompts[name].message)} ${chalk.cyan(defaultValue)}`)
      }

      return defaultValue
    }

    const checkMaybeOtherValue = async () => {
      if (!maybeOtherValue) {
        return
      }

      const otherValue = await maybeOtherValue()

      if (!otherValue) {
        return
      }

      this.log(`${chalk.green("?")} ${chalk.bold(this.flaggablePrompts[name].message)} ${chalk.cyan(otherValue)}`)

      return otherValue
    }

    if (type === "select") {
      return (
        maybeFlag() ??
        (await checkMaybeOtherValue()) ??
        maybeDefault() ??
        // Dynamic import because @inquirer/select is ESM only.
        (await import("@inquirer/select")).default({
          choices: (this.flaggablePrompts[name].options ?? []).map((o) => ({ name: o, value: o })),
          default: defaultValue,
          message: this.flaggablePrompts[name].message,
        })
      )
    }

    if (type === "input") {
      return (
        maybeFlag() ??
        (await checkMaybeOtherValue()) ??
        maybeDefault() ??
        // Dynamic import because @inquirer/input is ESM only.
        (await import("@inquirer/input")).default({
          default: defaultValue,
          message: this.flaggablePrompts[name].message,
          validate: this.flaggablePrompts[name].validate,
        })
      )
    }

    throw new Error("Invalid type")
  }

  public async init(): Promise<void> {
    await super.init()

    const { args, flags } = await this.parse({
      args: this.ctor.args,
      baseFlags: (super.ctor as typeof GeneratorCommand).baseFlags,
      enableJsonFlag: this.ctor.enableJsonFlag,
      flags: this.ctor.flags,
      strict: this.ctor.strict,
    })

    this.flags = flags as Flags<T>
    this.args = args as Args<T>

    // @ts-expect-error because we trust that child classes will set this - also, it's okay if they don't
    this.flaggablePrompts = this.ctor.flaggablePrompts ?? {}
    this.templatesDir = join(import.meta.dirname, "./templates")
  }

  public async template(source: string, destination: string, data?: Record<string, unknown>): Promise<void> {
    const rendered = await new Promise<string>((resolve, reject) =>
      renderFile(source, data ?? {}, (err, str) => {
        if (err) {
          reject(err)
        }
        return resolve(str)
      })
    )

    if (!rendered) {
      return
    }

    const relativePath = relative(process.cwd(), destination)

    if (!existsSync(destination)) {
      this.log(`${chalk.yellow("Creating")} ${relativePath}`)
      return outputFile(destination, rendered)
    }

    const confirmation =
      this.flags.force ?? (await (await import("@inquirer/confirm")).default({ message: `Overwrite ${relativePath}?` }))

    if (!confirmation) {
      this.log(`${chalk.yellow("Skipping")} ${relativePath}`)
      return
    }

    this.log(`${chalk.yellow("Overwriting")} ${relativePath}`)
    await outputFile(destination, rendered)
  }
}
