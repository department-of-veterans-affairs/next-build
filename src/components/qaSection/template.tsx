import { QaSection as FormattedQaSection } from '@/components/qaSection/formatted-type'
import { QaCollapsiblePanel } from '@/components/qaSection/QaCollapsiblePanel'
import { QaGroup as FormattedQaGroup } from '@/components/qaGroup/formatted-type'
import { ParagraphList } from '@/components/paragraph/template'
import { slugifyString } from '@/lib/utils/slug'
import { WithCurrentHeadingLevel } from '@/components/heading/formatted-type'
import { HeadingElement } from '@/components/heading/template'
import { incrementHeadingLevel } from '../heading/incrementHeadingLevel'

export function QaSection({
  currentHeadingLevel,
  header,
  intro,
  questions,
  displayAccordion,
}: (FormattedQaSection | FormattedQaGroup) & WithCurrentHeadingLevel) {
  const headingLevel = header
    ? incrementHeadingLevel(currentHeadingLevel ?? 'h1')
    : currentHeadingLevel
  return (
    <div data-template="paragraphs/q_a_section">
      {header && (
        <HeadingElement headingLevel={headingLevel} id={slugifyString(header)}>
          {header}
        </HeadingElement>
      )}
      {intro && <p>{intro}</p>}
      {/* Note that this doesn't properly handle the case where the QaSection is a
          QaGroup and the displayAccordion is false */}
      {displayAccordion ? (
        <QaCollapsiblePanel questions={questions} />
      ) : (
        <ParagraphList
          paragraphs={questions}
          currentHeadingLevel={headingLevel}
        />
      )}
    </div>
  )
}
