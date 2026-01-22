import { processEnv } from 'env-loader'

const exitCode = await processEnv('jest --ci --coverage')
process.exit(exitCode)
