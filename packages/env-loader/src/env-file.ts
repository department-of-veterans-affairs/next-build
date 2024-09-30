import fs from 'fs'
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import { EnvVars } from '.'

const loadEnvVarsFromPath = (path: string): EnvVars => {
  const envVars = {}
  dotenvExpand.expand(
    dotenv.config({
      path,
      override: true,
      processEnv: envVars,
    })
  )

  // eslint-disable-next-line no-console
  console.log(`Using environment variables from: ${path}`)
  // eslint-disable-next-line no-console
  console.log(envVars)
  return envVars
}

export const getEnvFileVars = (appEnv?: string): EnvVars => {
  //  Load env vars from `.env.${process.env.APP_ENV}` if it exists,
  //  otherwise load env vars from `.env.local` if it exists.
  if (appEnv && fs.existsSync(`envs/.env.${appEnv}`)) {
    return loadEnvVarsFromPath(`envs/.env.${appEnv}`)
  } else if (fs.existsSync('envs/.env.local')) {
    return loadEnvVarsFromPath(`envs/.env.local`)
  }

  return {}
}
