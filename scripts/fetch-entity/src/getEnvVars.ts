/**
 * This is essentially a copy of what's in the env-loader package, but we need
 * to copy it over here because getting the silly thing to run as a script is a
 * pain otherwise.
 */

/* eslint-disable import/no-extraneous-dependencies */
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import path from 'path'

export type EnvVars = {
  [key: string]: string
}

export const getEnvFileVars = (): EnvVars => {
  const envVars = {}
  const __dirname = new URL('.', import.meta.url).pathname
  dotenvExpand.expand(
    dotenv.config({
      path: path.join(__dirname, '../../../envs/.env.local'),
      override: true,
      processEnv: envVars,
    })
  )
  return envVars
}
