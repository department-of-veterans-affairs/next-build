const { processEnv } = require('env-loader')

processEnv('RUST_BACKTRACE=1 jest --coverage')
