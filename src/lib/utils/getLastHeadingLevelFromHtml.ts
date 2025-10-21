import { HeadingLevel } from '@/components/heading/formatted-type'

/**
 * Parses the HTML to look for heading elements and returns the last heading level found.
 * Supports headings with or without attributes (class, id, data-*, etc.)
 */
export function getLastHeadingLevelFromHtml(
  html: string
): HeadingLevel | undefined {
  // Match heading tags with optional attributes: <h1>, <h2 class="...">, etc.
  const headingRegex = /<h([1-6])(?:\s[^>]*)?>/g
  const headings = html.match(headingRegex)
  if (headings) {
    const lastHeading = headings[headings.length - 1]
    const levelMatch = lastHeading.match(/<h([1-6])/)
    if (levelMatch) {
      return `h${levelMatch[1]}` as HeadingLevel
    }
  }
}
