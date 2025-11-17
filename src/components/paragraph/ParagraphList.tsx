import { FormattedParagraph } from '@/lib/drupal/queries'
import { PARAGRAPH_RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { Wysiwyg as FormattedWysiwyg } from '@/components/wysiwyg/formatted-type'
import {
  HeadingLevel,
  WithCurrentHeadingLevel,
} from '@/components/heading/formatted-type'
import { getLastHeadingLevelFromHtml } from '@/lib/utils/getLastHeadingLevelFromHtml'
import { Paragraph } from './template'

/**
 * This component renders a list of paragraphs with the appropriate heading levels based
 * on the content of the paragraphs. For instance, if a WYSIWYG paragraph contains a
 * heading or multiple headings in its content, paragraphs after it that accept a heading
 * level will take that into account and use the next appropriate heading level.
 *
 * When a paragraph's heading level is not being affected by a previous paragraph's
 * heading level, that paragraph's heading level will fall back to `initialHeadingLevel`.
 */
export const ParagraphList = ({
  paragraphs,
  currentHeadingLevel = 'h1',
}: {
  paragraphs: Array<(FormattedParagraph & WithCurrentHeadingLevel) | null>
} & WithCurrentHeadingLevel) => {
  const paragraphElements = []

  paragraphs.forEach((paragraph, index) => {
    if (!paragraph) return

    paragraphElements.push(
      <Paragraph
        {...paragraph}
        key={paragraph.id || index}
        currentHeadingLevel={currentHeadingLevel}
      />
    )

    // If this paragraph has a heading in it, that is now our current heading level to
    // be used in subsequent paragraphs.
    const foundHeadingLevel = getLastHeadingLevelFromParagraph(paragraph)
    if (foundHeadingLevel) {
      currentHeadingLevel = foundHeadingLevel
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
    // Note that it is a design decision to not drill down into multiple levels of
    // paragraphs in order to find headings, though I did set up this switch statement
    // to allow for that and to recursively search. It is not always the editor's intent
    // to have a subsequent paragraph be under the heading of a previous paragraph, so
    // we're purposely keeping this logic simple.
  }
}
