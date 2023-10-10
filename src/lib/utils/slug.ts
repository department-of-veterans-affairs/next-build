export function slugToPath(slug: string | string[]): string {
  const path = typeof slug === 'string' ? slug : slug.join('/')
  const leadingSlashPath = path.substring(0, 1) === '/' ? path : `/${path}`
  return leadingSlashPath
}
