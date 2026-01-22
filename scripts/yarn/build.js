import { processEnv } from 'env-loader'

const exitCode = await processEnv('next build --turbopack')
process.exit(exitCode)
