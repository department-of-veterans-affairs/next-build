export const generateAbsoluteUrl = (origin: string, relativeUrl: string) => {
  // strip trailing slash from origin
  const trimmedOrigin = origin.endsWith('/')
    ? origin.substring(0, origin.length - 1)
    : origin

  // strip leading and trailing slashes from relativeUrl
  const trimmedRelativeUrl = relativeUrl.replace(/^\/|\/$/g, '')

  // always include trailing slash for canonical URL consistency
  return `${trimmedOrigin}/${trimmedRelativeUrl}/`
}

export const generateAbsoluteUrlFromEnv = (relativeUrl: string) =>
  generateAbsoluteUrl(
    process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || '',
    relativeUrl
  )
