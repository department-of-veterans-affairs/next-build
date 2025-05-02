/**
 * Retern a string that's usable in a URL.
 */
export const hashReference = (str: string, length = 100) => {
  if (!str) return null
  return str
    .toString()
    .toLowerCase()
    .normalize('NFD') // normalize diacritics
    .replace(/[^-a-zA-Z0-9 ]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, length)
}
