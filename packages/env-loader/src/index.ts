/*eslint-disable no-console*/
import { getCliOptions } from './cli-options'
import { getEnvFileVars } from './env-file'
import { getCmsFeatureFlags } from './cms-feature-flags'
import { spawn } from 'child_process'

export type EnvVars = {
  [key: string]: string
}

const getAllEnvVars = async (): Promise<EnvVars> => {
  // CLI OPTIONS
  const cliOptions = getCliOptions()

  // ENV FILE VARS
  const envVars = getEnvFileVars(process.env.APP_ENV)

  // CMS FEATURE FLAGS
  const drupalBaseUrlProp = 'NEXT_PUBLIC_DRUPAL_BASE_URL'
  const drupalBaseUrl =
    cliOptions[drupalBaseUrlProp] || envVars[drupalBaseUrlProp]
  const cmsFeatureFlags = await getCmsFeatureFlags(drupalBaseUrl)

  // Return all options with proper cascading:
  // 1. CLI options have highest precedence
  // 2. CMS feature flags next
  // 3. ENV file vars last
  return {
    ...envVars,
    ...cmsFeatureFlags,
    ...cliOptions,
  }
}

export const processEnv = async (command: string): Promise<void> => {
  process.env = {
    ...process.env,
    ...(await getAllEnvVars()),
  }

  spawn(command, {
    shell: true,
    stdio: 'inherit',
  })
}
