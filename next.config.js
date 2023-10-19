const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')

const myEnv = dotenv.config({
  path: `envs/.env.${process.env.APP_ENV || 'local'}`,
})

dotenvExpand.expand(myEnv)
// eslint-disable-next-line no-console
console.log(
  `Using environment variables from: envs/.env.${
    process.env.APP_ENV || 'local'
  }`
)

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    loaderFile: './src/templates/common/image/customLoader.js',
    loader: 'custom',
  },
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  staticPageGenerationTimeout: 180, //arbitrary; 60 is default but it's too small
}
module.exports = nextConfig
