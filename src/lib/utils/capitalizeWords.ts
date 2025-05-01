/**
 * Convert a string to have all words start capitalized.
 * @param {string} str A string to transform.
 * @returns {string} The transformed string.
 */

export const capitalizeWords = (str: string): string =>
  str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
