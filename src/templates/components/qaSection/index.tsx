import { QaSection as FormattedQaSection } from '@/types/formatted/qaSection'
import { QaCollapsiblePanel } from '../qaCollapsiblePanel'
import { QaGroup as FormattedQaGroup } from '@/types/formatted/qaGroup'
import { Paragraph } from '@/templates/components/paragraph'
import { FormattedParagraph } from '@/data/queries'
import { slugifyString } from '@/lib/utils/slug'

export function QaSection({
  header,
  intro,
  questions,
  displayAccordion,
}: FormattedQaSection | FormattedQaGroup) {
  const setHeaderh3 = header ? true : false
  // Prepare id for use by va-on-this-page component to identify the QaSection
  const headerId = header ? slugifyString(header) : ''
  return (
    <div data-template="paragraphs/q_a_section">
      {header && <h2 id={headerId}>{header}</h2>}
      {intro && <p>{intro}</p>}
      {displayAccordion ? (
        <QaCollapsiblePanel questions={questions} />
      ) : (
        questions.map((questionContent: FormattedParagraph) => (
          <Paragraph
            key={questionContent.id}
            setHeaderh3={setHeaderh3}
            {...questionContent}
          />
        ))
      )}
    </div>
  )
}
