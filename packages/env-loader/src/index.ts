/*eslint-disable no-console*/
import { getCliOptionsAndArgs } from './cli-options'
import { getEnvFileVars } from './env-file'
import { getCmsFeatureFlags } from './cms-feature-flags'
import { spawn } from 'child_process'

export type EnvVars = {
  [key: string]: string
}

export const processEnv = async (command: string): Promise<void> => {
  // CLI
  const { args: cliArgs, options: cliOptions } = getCliOptionsAndArgs()

  // ENV FILE
  const envVars = getEnvFileVars(process.env.APP_ENV)

  // CMS FEATURE FLAGS
  let cmsFeatureFlags
  if (process.env.APP_ENV === 'test') {
    // For now, don't fetch CMS feature flags for tests. Will fail CI.
    cmsFeatureFlags = {}
  } else {
    const drupalBaseUrlProp = 'NEXT_PUBLIC_DRUPAL_BASE_URL'
    const drupalBaseUrl =
      cliOptions[drupalBaseUrlProp] || envVars[drupalBaseUrlProp]
    cmsFeatureFlags = await getCmsFeatureFlags(drupalBaseUrl)
  }

  process.env = {
    ...process.env,
    ...{
      ...envVars,
      ...cmsFeatureFlags,
      ...cliOptions,
    },
  }

  // Pass additional arguments through to the underlying command
  spawn(`${command} ${cliArgs.join(' ')}`, {
    shell: true,
    stdio: 'inherit',
  })
}
