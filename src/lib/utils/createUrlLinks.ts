/**
 * Convert plain text URLs to clickable va-link components.
 *
 * This utility finds URLs in plain text content and wraps them in <va-link> tags.
 * It avoids converting URLs that are already inside href attributes or anchor tags.
 *
 * @param content - The content to search for URLs.
 * @returns The content with URLs wrapped in <va-link> tags.
 */
export const createUrlLinks = (content: string): string => {
  if (!content) {
    return content
  }

  // Regex to match URLs that are NOT already inside an href attribute or anchor tag
  // This pattern matches:
  // - http:// or https:// protocols
  // - Domain names with optional subdomains
  // - Optional paths, query strings, and fragments
  // The negative lookbehind (?<!href="|href=') ensures we don't match URLs already in href attributes
  // The negative lookahead (?![^<]*<\/a>) ensures we don't match URLs already inside anchor tags
  const urlPattern =
    /(?<!href=["'])(https?:\/\/[^\s<>"']+)(?![^<]*<\/a>)(?![^<]*>)/gi

  return content.replace(urlPattern, (url) => {
    // Clean up any trailing punctuation that shouldn't be part of the URL
    // Common cases: periods, commas, parentheses at the end of sentences
    let cleanUrl = url
    let trailingChars = ''

    // Handle trailing punctuation that's likely not part of the URL
    // Process character by character from the end to properly handle parentheses
    while (cleanUrl.length > 0) {
      const lastChar = cleanUrl[cleanUrl.length - 1]

      if (lastChar === ')') {
        // Count open and close parens in the URL (excluding what we've already removed)
        const openCount = (cleanUrl.match(/\(/g) || []).length
        const closeCount = (cleanUrl.match(/\)/g) || []).length

        if (closeCount > openCount) {
          // Unbalanced - this closing paren is likely not part of the URL
          trailingChars = lastChar + trailingChars
          cleanUrl = cleanUrl.slice(0, -1)
        } else {
          // Balanced - keep this paren (e.g., Wikipedia URLs)
          break
        }
      } else if (/[.,;:!?(]/.test(lastChar)) {
        // Other punctuation (including unmatched opening parens) - strip it
        trailingChars = lastChar + trailingChars
        cleanUrl = cleanUrl.slice(0, -1)
      } else {
        // Not trailing punctuation - we're done
        break
      }
    }

    // Also strip unbalanced opening parens from the end
    // This handles cases like "https://google.com(google" where the regex
    // captured an opening paren but the closing paren was cut off by a space
    while (cleanUrl.length > 0) {
      const openCount = (cleanUrl.match(/\(/g) || []).length
      const closeCount = (cleanUrl.match(/\)/g) || []).length

      if (openCount > closeCount) {
        // Find and remove the last opening paren and everything after it
        const lastOpenIndex = cleanUrl.lastIndexOf('(')
        trailingChars = cleanUrl.slice(lastOpenIndex) + trailingChars
        cleanUrl = cleanUrl.slice(0, lastOpenIndex)
      } else {
        break
      }
    }

    return `<va-link href="${cleanUrl}" text="${cleanUrl}"></va-link>${trailingChars}`
  })
}
