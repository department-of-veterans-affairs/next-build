/**
 * Convert a snake_cased or kebab-cased string to camelCased.
 * @param {string} str A string to transform.
 * @returns {string} The transformed string.
 */
export const toCamelCase = (str: string) =>
  str
    .toLowerCase()
    .replace(/[-_\s.]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))

/**
 * Camel-case the keys of an object, the objects within an array, or the objects within an object.
 * @param item The item to transform.
 * @return The item, possibly transformed.
 */
export const camelKeys = (item) => {
  if (Array.isArray(item)) {
    return item.map((index) => camelKeys(index))
  } else if (typeof item === 'object' && item !== null) {
    const result = {}
    Object.keys(item).forEach(
      (key) => (result[toCamelCase(key)] = camelKeys(item[key]))
    )
    return result
  }
  return item
}
