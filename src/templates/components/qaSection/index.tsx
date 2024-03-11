import { QaSection as FormattedQaSection } from '@/types/formatted/qaSection'
import { QaCollapsiblePanel } from '../qaCollapsiblePanel'
import { QaParagraph as FormattedQaParagraph } from '@/types/formatted/qaParagraph'
import { QaGroup as FormattedQaGroup } from '@/types/formatted/qaGroup'
import { Paragraph } from '@/templates/components/paragraph'

export function QaSection({
  header,
  intro,
  questions,
  displayAccordion,
}: FormattedQaSection | FormattedQaGroup) {
  const setHeaderh3 = header ? true : false
  return (
    <div data-template="paragraphs/q_a_section">
      {header && <h2>{header}</h2>}
      {intro && <p>{intro}</p>}
      {displayAccordion ? (
        <QaCollapsiblePanel questions={questions} />
      ) : (
        questions.map((questionContent: FormattedQaParagraph, index) => (
          <Paragraph
            key={questionContent?.id || index}
            setHeaderh3={setHeaderh3}
            {...questionContent}
          />
        ))
      )}
    </div>
  )
}
