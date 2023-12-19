const { processEnv } = require('env-loader')

processEnv(
  'node --inspect-brk ./node_modules/jest/bin/jest.js --runInBand --watch'
)
