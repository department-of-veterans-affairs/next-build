import { QaSection as FormattedQaSection } from '@/components/qaSection/formatted-type'
import { QaCollapsiblePanel } from '@/components/qaSection/QaCollapsiblePanel'
import { QaGroup as FormattedQaGroup } from '@/components/qaGroup/formatted-type'
import { ParagraphList } from '@/components/paragraph/template'
import { slugifyString } from '@/lib/utils/slug'
import { HeadingElement } from '@/components/heading/template'

export function QaSection({
  header,
  intro,
  questions,
  displayAccordion,
}: FormattedQaSection | FormattedQaGroup) {
  // We actually reset the heading level for QA sections instead of inheriting the
  // current heading level from previous pragraph content.
  const currentHeadingLevel = header ? 'h2' : 'h1'

  return (
    <div data-template="paragraphs/q_a_section">
      {header && (
        <HeadingElement headingLevel="h2" id={slugifyString(header)}>
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
          currentHeadingLevel={currentHeadingLevel}
        />
      )}
    </div>
  )
}
