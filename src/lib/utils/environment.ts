import { hosts } from '@/lib/constants/environment'

export const generateAbsoluteUrlFromBuildType = (
  relativeUrl: string,
  appEnv: string
) => {
  const host = hosts[appEnv]
  if (!host) {
    return relativeUrl
  }
  return relativeUrl.charAt(0) === '/'
    ? `${host.origin}${relativeUrl}`
    : `${host.origin}/${relativeUrl}`
}

export const generateAbsoluteUrlFromEnv = (relativeUrl: string) =>
  generateAbsoluteUrlFromBuildType(relativeUrl, process.env.APP_ENV)
