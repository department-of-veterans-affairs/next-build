import { processEnv } from 'env-loader'

processEnv('RUST_BACKTRACE=1 jest --coverage')
