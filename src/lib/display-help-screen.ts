import chalk from "chalk"

function displayHelpScreen() {
  console.log(
    [
      "",
      chalk.bold("Usage:"),
      `  $ genstuff                 ${chalk.dim("Select from a list of available generators")}`,
      `  $ genstuff <name>          ${chalk.dim("Run a generator registered under that name")}`,
      `  $ genstuff <name> [input]  ${chalk.dim("Run the generator with input data to bypass prompts")}`,
      "",
      chalk.bold("Options:"),
      `  -h, --help             ${chalk.dim("Show this help display")}`,
      `  -t, --show-type-names  ${chalk.dim("Show type names instead of abbreviations")}`,
      `  -i, --init             ${chalk.dim("Generate a basic genstuff")}`,
      `      --init-ts          ${chalk.dim("Generate a basic genstuff.ts")}`,
      `  -v, --version          ${chalk.dim("Print current version")}`,
      `  -f, --force            ${chalk.dim("Run the generator forcefully")}`,
      "",
      chalk.dim(" ------------------------------------------------------"),
      chalk.dim("  ⚠  danger waits for those who venture below the line"),
      "",
      chalk.dim("  --genstuff             Path to the genstuff"),
      chalk.dim(
        "  --cwd                  Directory from which relative paths are calculated against while locating the genstuff",
      ),
      chalk.dim(
        "  --preload              String or array of modules to require before running genstuff",
      ),
      chalk.dim(
        "  --dest                 Output to this directory instead of the genstuff's parent directory",
      ),
      chalk.dim("  --no-progress          Disable the progress bar"),
      "",
      chalk.bold("Examples:"),
      `  $ ${chalk.blue("genstuff")}`,
      `  $ ${chalk.blue("genstuff component")}`,
      `  $ ${chalk.blue('genstuff component "name of component"')}`,
      "",
    ].join("\n"),
  )
}

export { displayHelpScreen }
