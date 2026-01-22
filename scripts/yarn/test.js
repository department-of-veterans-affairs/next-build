import { processEnv } from 'env-loader'

const exitCode = await processEnv('jest')
process.exit(exitCode)
