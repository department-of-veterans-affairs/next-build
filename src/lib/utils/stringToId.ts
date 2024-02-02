/**
 * Converts string to kebab case id
 * @param {string} str A string to transform.
 * @returns {string} The transformed string.
 */
export function stringToId(header) {
  return header
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
