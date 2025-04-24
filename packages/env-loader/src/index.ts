/*eslint-disable no-console*/
import fs from 'fs'
import path from 'path'

import { getCliOptionsAndArgs } from './cli-options'
import { getEnvFileVars } from './env-file'
import { getCmsFeatureFlags } from './cms-feature-flags'
import { spawn } from 'child_process'

const buildIDFile = path.join(process.cwd(), 'build_id')
const exitCodeFile = path.join(process.cwd(), 'exit_code')

export type EnvVars = {
  [key: string]: string | boolean
}

/**
 * Processes and sets up the environment variables, CMS feature flags, and CLI
 * options before executing a given shell command. This function integrates data
 * from multiple sources (CLI, environment files, and CMS) into `process.env`
 * and then spawns the specified command.
 *
 * Behavior:
 * 1. **CLI Options and Arguments**: - Parses command-line arguments and options
 *    using `getCliOptionsAndArgs`.
 *
 * 2. **Environment Variables**: - Loads environment variables from a file
 *    specific to `process.env.APP_ENV`.
 *
 * 3. **CMS Feature Flags**: - Fetches feature flags from a Drupal CMS instance
 *    if `APP_ENV` is not `test`. - For `test` environments, skips CMS flag
 *    fetching to avoid CI failures. - Combines CLI options, environment file
 *    variables, and CMS flags into `process.env`.
 *
 * 4. **Command Execution**: - Spawns the given shell command with any
 *    additional arguments passed from the CLI. - Uses `stdio: 'inherit'` to
 *    mirror command output in real-time. - Exits the parent process with the
 *    same exit code as the spawned command.
 *
 * Dependencies:
 * - `getCliOptionsAndArgs` for parsing CLI options and arguments.
 * - `getEnvFileVars` for loading environment-specific variables.
 * - `getCmsFeatureFlags` for fetching CMS feature flags.
 * - `child_process.spawn` for executing the shell command.
 *
 * Example Usage:
 * ```ts
 * await processEnv('next build');
 * ```
 *
 * Notes:
 * - CMS feature flags are only fetched if the environment is not `test` to
 *   avoid breaking CI pipelines.
 * - The function combines multiple sources of environment variables to ensure a
 *   fully configured environment.
 */
export const processEnv = async (
  /**
   * The shell command to be executed, with additional arguments passed through.
   */
  command: string,
  verbose = false
): Promise<void> => {
  // CLI
  const { args: cliArgs, options: cliOptions } = getCliOptionsAndArgs()

  // ENV FILE
  const envVars = getEnvFileVars(process.env.APP_ENV)

  // CMS FEATURE FLAGS
  let cmsFeatureFlags // EnvVars, but TypeScript gets angry when assigning a boolean to a property of process.env
  if (process.env.APP_ENV === 'test') {
    // For now, don't fetch CMS feature flags for tests. Will fail CI.
    cmsFeatureFlags = {}
  } else {
    const drupalBaseUrlProp = 'NEXT_PUBLIC_DRUPAL_BASE_URL'
    const drupalBaseUrl =
      cliOptions[drupalBaseUrlProp] || envVars[drupalBaseUrlProp]
    cmsFeatureFlags = await getCmsFeatureFlags(
      drupalBaseUrl as string,
      cliOptions.DEBUG as boolean
    )
  }

  process.env = {
    ...process.env,
    ...{
      ...cmsFeatureFlags,
      ...envVars,
      ...cliOptions,
    },
  }

  await cleanup(verbose)

  // Pass additional arguments through to the underlying command
  const cmd = spawn(`${command} ${cliArgs.join(' ')}`, {
    shell: true,
    stdio: 'inherit',
  })

  if (command === 'next build') {
    // Write the PID of the build process to a file so we can kill it quickly
    // and accurately later if we need to. This is only necessary for the
    // `next build` command.
    fs.writeFileSync(buildIDFile, cmd.pid.toString(), 'utf8')
  }

  cmd.on('exit', (code) => {
    let exitCode = code
    try {
      // Override the exit code with the one from the file if it exists.
      // This is to make sure that we don't accidentally exit with a code 0 if
      // we need to ensure the process fails loudly.
      if (fs.existsSync(exitCodeFile)) {
        exitCode = parseInt(fs.readFileSync(exitCodeFile, 'utf8'), 10)
      }
    } catch (e) {
      console.error(e)
    }

    cleanup(verbose).finally(() => process.exit(exitCode))
  })
}

async function cleanup(verbose = false) {
  const chalk = await import('chalk').then((mod) => mod.default)

  const log = verbose ? console.log : () => {}

  console.log('verbose:', verbose)

  log(chalk.blue('\nCleaning up...'))
  try {
    if (fs.existsSync(buildIDFile)) {
      fs.unlinkSync(buildIDFile)
      log(chalk.green(`  Deleted build ID file at ${buildIDFile}`))
    } else {
      log(chalk.yellow(`  No build ID file to delete at ${buildIDFile}`))
    }
  } catch (e) {
    log(chalk.red(`  Failed to delete build ID file at ${buildIDFile}`))
    log(e.toString())
  }
  try {
    if (fs.existsSync(exitCodeFile)) {
      fs.unlinkSync(exitCodeFile)
      log(chalk.green(`  Deleted exit code file at ${exitCodeFile}`))
    } else {
      log(chalk.yellow(`  No exit code file to delete at ${exitCodeFile}`))
    }
  } catch (e) {
    log(chalk.red(`  Failed to delete exit code file\ at ${exitCodeFile}`))
    log(e.toString())
  }
}
