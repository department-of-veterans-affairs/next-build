export function slugToPath(slug: string | string[]): string {
  const path = typeof slug === 'string' ? slug : slug.join('/')
  const leadingSlashPath = path.substring(0, 1) === '/' ? path : `/${path}`
  return leadingSlashPath
}

export function pathToSlug(path: string): string[] {
  return path.split('/').filter((segment) => segment !== '')
}

export function slugifyTitle(title, truncateLength = 100) {
  if (!title) return null
  return title
    .toString()
    .toLowerCase()
    .normalize('NFD') // normalize diacritics
    .replace(/[^-a-zA-Z0-9 ]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, truncateLength)
}
