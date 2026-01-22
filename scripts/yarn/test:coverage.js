import { processEnv } from 'env-loader'

const exitCode = await processEnv('RUST_BACKTRACE=1 jest --coverage')
process.exit(exitCode)
