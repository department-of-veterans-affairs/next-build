const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')

const myEnv = dotenv.config({
  path: `envs/.env.${process.env.APP_ENV || 'local'}`,
})

dotenvExpand.expand(myEnv)
