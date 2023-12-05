export const environments = {
  LOCAL: 'localhost',
  TUGBOAT: 'tugboat',
  DEV: 'development',
  STAGING: 'staging',
  PROD: 'production',
} as const

export const hosts = {
  [environments.LOCAL]: {
    hostname: 'localhost',
    origin: 'http://localhost:3000',
  },
  [environments.TUGBOAT]: {
    hostname: process.env.TUGBOAT_DEFAULT_SERVICE_URL_HOST,
    origin: process.env.TUGBOAT_DEFAULT_SERVICE_URL,
  },
  [environments.DEV]: {
    hostname: 'dev.va.gov',
    origin: 'https://dev.va.gov',
  },
  [environments.STAGING]: {
    hostname: 'staging.va.gov',
    origin: 'https://staging.va.gov',
  },
  [environments.PROD]: {
    hostname: 'www.va.gov',
    origin: 'https://www.va.gov',
  },
} as const
