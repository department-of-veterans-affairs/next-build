const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')

const myEnv = dotenv.config({
  path: `envs/.env.${process.env.APP_ENV || 'local'}`,
})

dotenvExpand.expand(myEnv)
console.log(`Using environment variables from: envs/.env.${process.env.APP_ENV || 'local'}`)

/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  images: {
    domains: [
      `${process.env.NEXT_IMAGE_DOMAIN}`,
      'va-gov-cms.ddev.site',
      's3-us-gov-west-1.amazonaws.com',
      'va.gov',
    ],
    loader: 'custom',
  },
  env: {
    NEXT_PUBLIC_DRUPAL_BASE_URL: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
    GOOGLE_TAG_MANAGER_AUTH: process.env.GOOGLE_TAG_MANAGER_AUTH,
    GOOGLE_TAG_MANAGER_PREVIEW: process.env.GOOGLE_TAG_MANAGER_PREVIEW,
    GOOGLE_TAG_MANAGER_ID: process.env.GOOGLE_TAG_MANAGER_ID,
  },
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  staticPageGenerationTimeout: 180, //arbitrary; 60 is default but it's too small
}
module.exports = nextConfig
