import { processEnv } from 'env-loader'

const exitCode = await processEnv(
  'node --inspect-brk ./node_modules/jest/bin/jest.js --runInBand --watch'
)
process.exit(exitCode)
