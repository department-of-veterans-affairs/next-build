import {
  CCQaSection as FormattedCCQaSection,
  QaSection as FormattedQaSection,
} from '@/types/formatted/qaSection'
import { QaCollapsiblePanel } from '../qaCollapsiblePanel'
import { QaGroup as FormattedQaGroup } from '@/types/formatted/qaGroup'
import { Paragraph } from '@/templates/components/paragraph'
import { FormattedParagraph } from '@/data/queries'
import { kebabCase } from 'lodash'

export function QaSection({
  header,
  intro,
  questions,
  displayAccordion,
}: FormattedQaSection | FormattedQaGroup | FormattedCCQaSection) {
  const setHeaderh3 = header ? true : false
  return (
    <div data-template="paragraphs/q_a_section">
      {header && (
        <h2 id={`qa-section-header-${kebabCase(header).slice(0, 20)}`}>
          {header}
        </h2>
      )}
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
