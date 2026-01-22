import { processEnv } from 'env-loader'

const exitCode = await processEnv('next dev --turbopack')
process.exit(exitCode)
