# oclif-hello-world

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [oclif-hello-world](#oclif-hello-world)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g genstuff
$ genstuff COMMAND
running command...
$ genstuff (--version)
genstuff/0.0.0-alpha.0 linux-x64 node-v18.13.0
$ genstuff --help [COMMAND]
USAGE
  $ genstuff COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`genstuff hello PERSON`](#genstuff-hello-person)
* [`genstuff hello world`](#genstuff-hello-world)
* [`genstuff help [COMMANDS]`](#genstuff-help-commands)
* [`genstuff plugins`](#genstuff-plugins)
* [`genstuff plugins:install PLUGIN...`](#genstuff-pluginsinstall-plugin)
* [`genstuff plugins:inspect PLUGIN...`](#genstuff-pluginsinspect-plugin)
* [`genstuff plugins:install PLUGIN...`](#genstuff-pluginsinstall-plugin-1)
* [`genstuff plugins:link PLUGIN`](#genstuff-pluginslink-plugin)
* [`genstuff plugins:uninstall PLUGIN...`](#genstuff-pluginsuninstall-plugin)
* [`genstuff plugins:uninstall PLUGIN...`](#genstuff-pluginsuninstall-plugin-1)
* [`genstuff plugins:uninstall PLUGIN...`](#genstuff-pluginsuninstall-plugin-2)
* [`genstuff plugins update`](#genstuff-plugins-update)

## `genstuff hello PERSON`

Say hello

```
USAGE
  $ genstuff hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/alexvyber/genstuff/blob/v0.0.0-alpha.0/dist/commands/hello/index.ts)_

## `genstuff hello world`

Say hello world

```
USAGE
  $ genstuff hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ genstuff hello world
  hello world! (./src/commands/hello/world.ts)
```

## `genstuff help [COMMANDS]`

Display help for genstuff.

```
USAGE
  $ genstuff help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for genstuff.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.4/src/commands/help.ts)_

## `genstuff plugins`

List installed plugins.

```
USAGE
  $ genstuff plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ genstuff plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.3.2/src/commands/plugins/index.ts)_

## `genstuff plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ genstuff plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ genstuff plugins add

EXAMPLES
  $ genstuff plugins:install myplugin 

  $ genstuff plugins:install https://github.com/someuser/someplugin

  $ genstuff plugins:install someuser/someplugin
```

## `genstuff plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ genstuff plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ genstuff plugins:inspect myplugin
```

## `genstuff plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ genstuff plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ genstuff plugins add

EXAMPLES
  $ genstuff plugins:install myplugin 

  $ genstuff plugins:install https://github.com/someuser/someplugin

  $ genstuff plugins:install someuser/someplugin
```

## `genstuff plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ genstuff plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ genstuff plugins:link myplugin
```

## `genstuff plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ genstuff plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ genstuff plugins unlink
  $ genstuff plugins remove
```

## `genstuff plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ genstuff plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ genstuff plugins unlink
  $ genstuff plugins remove
```

## `genstuff plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ genstuff plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ genstuff plugins unlink
  $ genstuff plugins remove
```

## `genstuff plugins update`

Update installed plugins.

```
USAGE
  $ genstuff plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
