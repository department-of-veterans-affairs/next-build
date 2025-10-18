import { HeadingLevel } from '@/components/heading/formatted-type'

/**
 * Parses the HTML to look for heading elements and returns the last heading level found.
 */
export function getLastHeadingLevelFromHtml(
  html: string
): HeadingLevel | undefined {
  const headingRegex = /<h([1-6])>/g
  const headings = html.match(headingRegex)
  if (headings) {
    const level = headings[headings.length - 1].match(/<h([1-6])>/)[1]
    return `h${level}` as HeadingLevel
  }
}
