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
    // Actually, we don't want to drill down into multiple levels to find headings
    // case PARAGRAPH_RESOURCE_TYPES.QA_GROUP:
    // case PARAGRAPH_RESOURCE_TYPES.QA_SECTION:
    //   // Drill down into the QaGroup or QaSection to find the last heading level
    //   return (paragraph as QaSection | QaGroup).questions.reduce((lastLevel, question) => {
    //     const questionLevel = getLastHeadingLevelFromParagraph(question as FormattedParagraph )
    //     return questionLevel ?? lastLevel
    //   }, undefined as HeadingLevel | undefined)
    // case PARAGRAPH_RESOURCE_TYPES.QA:
    //   return (paragraph as QaParagraph).answers.reduce((lastLevel, answer) => {
    //     const answerLevel = getLastHeadingLevelFromParagraph(answer as FormattedParagraph )
    //     return answerLevel ?? lastLevel
    //   }, undefined as HeadingLevel | undefined)
  }
}
