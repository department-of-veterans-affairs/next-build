import { QaParagraph as FormattedQaParagraph } from '@/components/qaParagraph/formatted-type'
import { ParagraphList } from '@/components/paragraph/template'
import { WithCurrentHeadingLevel } from '@/components/heading/formatted-type'
import { HeadingElement } from '../heading/template'
import { incrementHeadingLevel } from '../heading/incrementHeadingLevel'

export function QaParagraph({
  question,
  answers,
  currentHeadingLevel = 'h1',
}: FormattedQaParagraph & WithCurrentHeadingLevel) {
  const headingLevel = incrementHeadingLevel(currentHeadingLevel)
  return (
    <div data-template="paragraphs/q_a">
      <div>
        <div className="vads-u-display--flex">
          <HeadingElement headingLevel={headingLevel}>
            {question}
          </HeadingElement>
        </div>
        {answers && (
          <ParagraphList
            paragraphs={answers}
            currentHeadingLevel={headingLevel}
          />
        )}
      </div>
    </div>
  )
}
