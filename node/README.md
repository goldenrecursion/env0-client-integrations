
# @env0/cli [![License](https://img.shields.io/npm/l/@env0/cli?color=blue)](https://github.com/env0/env0-client-integrations/blob/master/LICENSE) [![Version](https://img.shields.io/npm/v/@env0/cli)](https://www.npmjs.com/package/@env0/cli) [![Downloads](https://img.shields.io/npm/dw/@env0/cli)](https://www.npmjs.com/package/@env0/cli) [![CI](https://github.com/env0/env0-client-integrations/workflows/CI/badge.svg?branch=master)](https://github.com/env0/env0-client-integrations/actions?query=workflow%3ACI+branch%3Amaster) 
 
The command-line tool for the env0 platform.

- [Commands](#commands-overview)
- [Arguments](#arguments-overview)

## Features

  - **deploy** - Creates a new environment or deploy an existing environment.
  - **destroy** - Destroys an existing environment.
  - **approve**	- Resumes a deployment that awaits an approval.
  - **cancel** - Cancels a deployment that awaits an approval.

## Installation

```bash
$ yarn global add @env0/cli
# or
$ npm install -g @env0/cli
```

## Commands Overview

### `env0 help`

Run `env0 help` to get a helpful list of supported commands and arguments.

### `env0 configure <arguments>`

Sets configurable options for the CLI.
If no arguments are given, displays a set of prompts that will help you configure the CLI options.

### `env0 deploy <arguments>`

Initiates a new deployment on env0, whether for a new environment or for an existing one.

### `env0 destroy <arguments>`

Initiates a new deployment to destroy and existing environment.

### `env0 approve <arguments>`

Runs an approval of an existing deployment that is waiting to be approved (AKA waiting in plan stage).

### `env0 cancel <arguments>`

Cancels an existing deployment that is waiting to be approved (AKA waiting in plan stage).

## Arguments Overview

The arguments are loaded from env0 configuration files, environment variables and CLI parameters.
The order of precedence of the arguments is:
1. `env0` CLI explicit parameters
2. Environment Variables
3. Configuration File

### API Key
> env0 API Key (Required)
- Usage: `--apiKey`
- Alias: `-k`

### API Secret
> env0 API Secret (Required)
- Usage: `--apiSecret`
- Alias: `-s`

### Organization ID
> env0 Organization ID (Required)
- Usage: `--organizationId`
- Alias: `-o`

### Project ID
> env0 Project ID (Required)
- Usage: `--projectId`
- Alias: `-p`

### Blueprint ID
> The Blueprint ID you would like to deploy with (Required for new environments)
- Usage: `--blueprintId`
- Alias: `-b`

### Environment Name
> The environment name you would like to create, or deploy to an existing one (Required for existing environments)
- Usage: `--environmentName`
- Alias: `-e`

### Workspace Name
> (Optional) - A name for Terraform Workspace created for your new environment. This cannot be changed after an environment was created
- Usage: `--workspaceName`
- Alias: `-w`

### Environment Variables
> The environment variables to set on the deployed environment - works only on deploy and can be multiple, the format is "environmentVariableName1=value"
- Usage: `--environmentVariables`
- Alias: `-v`

For sensitive environment variables, use:
- Usage: `--sensitiveEnvironmentVariables`
- Alias: `-q`

### Revision
> Your GIT revision, can be a branch, a tag or a commit hash. (For existing environments - if not specified, will use the previously defined revision)
- Usage: `--revision`
- Alias: `-r`

### Requires Approval
> Requires approval for deployment. Valid values are either "true" or "false".
- Usage: `--requiresApproval <true/false>`
- Alias: `-a`

### Targets (Partial Apply)
> A list of resources to explicitly include in the deployment, delimited by a comma. Format is "resource1,resource2,resource3"
- Usage: `--targets`
- Alias: `-t`

## Configuration File
After initial deployment, a configuration file will be created under `~/.env0/config.json`

This file holds your last action's required parameters and will spare you from re-configuring the required parameters on every action.

## Supported Environment Variables

- `ENV0_API_KEY`
- `ENV0_API_SECRET`
- `ENV0_ORGANIZATION_ID`
- `ENV0_PROJECT_ID`
- `ENV0_BLUEPRINT_ID`
- `ENV0_ENVIRONMENT_NAME`

## API Reference

https://docs.env0.com/reference

## Compiling from Source

You can compile and run the CLI from source by cloning the repo from Github and then running the following:
```bash
# clone the repo from github
yarn install
yarn link # link your local copy of the CLI to your terminal path
```


## Publishing
```bash
# we publish it to the public npm (consider cleaning your global `~/.npmrc` file)
# make sure your user have permissions under env0's npm organization
npm login
npm publish --access public
```
