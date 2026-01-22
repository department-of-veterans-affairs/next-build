import { processEnv } from 'env-loader'

const exitCode = await processEnv('next-sitemap')
process.exit(exitCode)
