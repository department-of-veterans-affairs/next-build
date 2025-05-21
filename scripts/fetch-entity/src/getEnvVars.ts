/**
 * This is essentially a copy of what's in the env-loader package, but we need
 * to copy it over here because getting the silly thing to run as a script is a
 * pain otherwise.
 */

/* eslint-disable import/no-extraneous-dependencies */
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'

export type EnvVars = {
  [key: string]: string
}

const loadEnvVarsFromPath = (path: string, verbose: boolean): EnvVars => {
  const envVars = {}
  dotenvExpand.expand(
    dotenv.config({
      path,
      override: true,
      processEnv: envVars,
    })
  )

  if (verbose) {
    // eslint-disable-next-line no-console
    console.log(`Using environment variables from: ${path}`)
  }

  return envVars
}

export const getEnvFileVars = (appEnv?: string, verbose = true): EnvVars => {
  return loadEnvVarsFromPath(`envs/.env.local`, verbose)
}
