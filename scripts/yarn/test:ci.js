const { processEnv } = require('env-loader')

processEnv('jest --ci --coverage')
