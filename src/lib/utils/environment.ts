import { hosts } from '@/lib/constants/environment'

export const generateAbsoluteUrlFromBuildType = (
  relativeUrl: string,
  buildType: string
) => {
  const host = hosts[buildType]
  if (!host) {
    return relativeUrl
  }
  return relativeUrl.charAt(0) === '/'
    ? `${host.origin}${relativeUrl}`
    : `${host.origin}/${relativeUrl}`
}

export const generateAbsoluteUrlFromEnv = (relativeUrl: string) =>
  generateAbsoluteUrlFromBuildType(
    relativeUrl,
    process.env.NEXT_PUBLIC_BUILD_TYPE
  )
