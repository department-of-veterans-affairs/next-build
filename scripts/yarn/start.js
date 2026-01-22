import { processEnv } from 'env-loader'

const exitCode = await processEnv('next start')
process.exit(exitCode)
