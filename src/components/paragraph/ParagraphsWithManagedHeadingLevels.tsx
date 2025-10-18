import { FormattedParagraph } from '@/lib/drupal/queries'
import { PARAGRAPH_RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { Wysiwyg as FormattedWysiwyg } from '@/components/wysiwyg/formatted-type'
import {
  HeadingLevel,
  WithHeadingLevel,
} from '@/components/heading/formatted-type'
import { getLastHeadingLevelFromHtml } from '@/lib/utils/getLastHeadingLevelFromHtml'
import { incrementHeadingLevel } from '@/components/heading/incrementHeadingLevel'
import { Paragraph } from './template'

/**
 * This component renders a list of paragraphs with the appropriate heading levels based
 * on the content of the paragraphs. For instance, if a WYSIWYG paragraph contains a
 * heading or multiple headings in its content, paragraphs after it that accept a heading
 * level will take that into account and use the next appropriate heading level.
 */
export const ParagraphsWithManagedHeadingLevels = ({
  paragraphs,
  initialHeadingLevel,
}: {
  paragraphs: Array<(FormattedParagraph & WithHeadingLevel) | null>
  initialHeadingLevel?: HeadingLevel
}) => {
  let currentHeadingLevel: HeadingLevel | undefined
  const paragraphElements = []

  paragraphs.forEach((paragraph, index) => {
    if (!paragraph) return

    paragraphElements.push(
      <Paragraph
        {...paragraph}
        key={paragraph.id || index}
        headingLevel={
          // If we have a heading level from a previous paragraph, use it to determine
          // the appropriate heading level for the next paragraph
          currentHeadingLevel
            ? incrementHeadingLevel(currentHeadingLevel)
            : initialHeadingLevel
        }
      />
    )

    const lastFoundHeadingLevel = getLastHeadingLevelFromParagraph(paragraph)
    if (lastFoundHeadingLevel) {
      currentHeadingLevel = lastFoundHeadingLevel
    }
  })

  return paragraphElements
}

/**
 * For use in conjunction with the `ParagraphsWithManagedHeadingLevels` component, this
 * function determines how to parse the paragraph's content to determine the last heading
 * level used inside the content and returns it.
 */
export function getLastHeadingLevelFromParagraph(
  paragraph: FormattedParagraph
): HeadingLevel | undefined {
  switch (paragraph.type) {
    case PARAGRAPH_RESOURCE_TYPES.WYSIWYG:
    case PARAGRAPH_RESOURCE_TYPES.RICH_TEXT_CHAR_LIMIT_1000:
      return getLastHeadingLevelFromHtml((paragraph as FormattedWysiwyg).html)
  }
}
