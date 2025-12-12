/**
 * Convert plain text URLs to clickable anchor tags.
 *
 * This utility finds URLs in plain text content and wraps them in <a> tags.
 * It avoids converting URLs that are already inside href attributes or anchor tags.
 *
 * @param content - The content to search for URLs.
 * @returns The content with URLs wrapped in <a> tags.
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
    const trailingPunctuationMatch = cleanUrl.match(/([.,;:!?)]+)$/)
    if (trailingPunctuationMatch) {
      const trailing = trailingPunctuationMatch[1]
      // Check if it's a closing paren that has a matching open paren in the URL
      if (trailing === ')' && cleanUrl.includes('(')) {
        // Keep the paren if there's a matching open paren (e.g., Wikipedia URLs)
      } else {
        trailingChars = trailing
        cleanUrl = cleanUrl.slice(0, -trailing.length)
      }
    }

    return `<a href="${cleanUrl}">${cleanUrl}</a>${trailingChars}`
  })
}
