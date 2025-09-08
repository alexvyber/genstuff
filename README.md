genstuff
=================

A new CLI generated with oclif


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/genstuff.svg)](https://npmjs.org/package/genstuff)
[![Downloads/week](https://img.shields.io/npm/dw/genstuff.svg)](https://npmjs.org/package/genstuff)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g genstuff
$ gen COMMAND
running command...
$ gen (--version)
genstuff/0.0.1-dev.1 darwin-arm64 node-v24.7.0
$ gen --help [COMMAND]
USAGE
  $ gen COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`gen gen`](#gen-gen)
* [`gen help [COMMAND]`](#gen-help-command)
* [`gen plugins`](#gen-plugins)
* [`gen plugins add PLUGIN`](#gen-plugins-add-plugin)
* [`gen plugins:inspect PLUGIN...`](#gen-pluginsinspect-plugin)
* [`gen plugins install PLUGIN`](#gen-plugins-install-plugin)
* [`gen plugins link PATH`](#gen-plugins-link-path)
* [`gen plugins remove [PLUGIN]`](#gen-plugins-remove-plugin)
* [`gen plugins reset`](#gen-plugins-reset)
* [`gen plugins uninstall [PLUGIN]`](#gen-plugins-uninstall-plugin)
* [`gen plugins unlink [PLUGIN]`](#gen-plugins-unlink-plugin)
* [`gen plugins update`](#gen-plugins-update)

## `gen gen`

describe the command here

```
USAGE
  $ gen gen

DESCRIPTION
  describe the command here

EXAMPLES
  $ gen gen
```

_See code: [src/commands/gen.ts](https://github.com/repos/genstuff/blob/v0.0.1-dev.1/src/commands/gen.ts)_

## `gen help [COMMAND]`

Display help for gen.

```
USAGE
  $ gen help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for gen.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.32/src/commands/help.ts)_

## `gen plugins`

List installed plugins.

```
USAGE
  $ gen plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ gen plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.46/src/commands/plugins/index.ts)_

## `gen plugins add PLUGIN`

Installs a plugin into gen.

```
USAGE
  $ gen plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into gen.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the GEN_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the GEN_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ gen plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ gen plugins add myplugin

  Install a plugin from a github url.

    $ gen plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ gen plugins add someuser/someplugin
```

## `gen plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ gen plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ gen plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.46/src/commands/plugins/inspect.ts)_

## `gen plugins install PLUGIN`

Installs a plugin into gen.

```
USAGE
  $ gen plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into gen.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the GEN_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the GEN_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ gen plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ gen plugins install myplugin

  Install a plugin from a github url.

    $ gen plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ gen plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.46/src/commands/plugins/install.ts)_

## `gen plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ gen plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ gen plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.46/src/commands/plugins/link.ts)_

## `gen plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ gen plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ gen plugins unlink
  $ gen plugins remove

EXAMPLES
  $ gen plugins remove myplugin
```

## `gen plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ gen plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.46/src/commands/plugins/reset.ts)_

## `gen plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ gen plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ gen plugins unlink
  $ gen plugins remove

EXAMPLES
  $ gen plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.46/src/commands/plugins/uninstall.ts)_

## `gen plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ gen plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ gen plugins unlink
  $ gen plugins remove

EXAMPLES
  $ gen plugins unlink myplugin
```

## `gen plugins update`

Update installed plugins.

```
USAGE
  $ gen plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.46/src/commands/plugins/update.ts)_
<!-- commandsstop -->
