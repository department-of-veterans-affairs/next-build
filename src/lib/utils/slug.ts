/* eslint-disable no-console */
export function slugToPath(slug: string | string[]): string {
  const path = typeof slug === 'string' ? slug : slug?.join('/')
  const leadingSlashPath = path.substring(0, 1) === '/' ? path : `/${path}`
  return leadingSlashPath
}

export function pathToSlug(path: string): string[] {
  return path?.split('/').filter((segment) => segment !== '')
}

export function slugifyString(string, truncateLength = 100) {
  if (!string) return null
  return string
    .toString()
    .toLowerCase()
    .normalize('NFD') // normalize diacritics
    .replace(/[^-a-zA-Z0-9 ]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, truncateLength)
}
