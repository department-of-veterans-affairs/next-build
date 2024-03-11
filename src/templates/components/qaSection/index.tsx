import { QaSection as FormattedQaSection } from '@/types/formatted/qaSection'
import { QaCollapsiblePanel } from '../qaCollapsiblePanel'
import { QaParagraph } from '../qaParagraph'
import { QaParagraph as FormattedQaParagraph } from '@/types/formatted/qaParagraph'
import { QaGroup as FormattedQaGroup } from '@/types/formatted/qaGroup'

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
        questions.map((questionObject: FormattedQaParagraph, index) => (
          <QaParagraph
            key={index}
            type={questionObject.type}
            answers={questionObject.answers}
            question={questionObject.question}
            id={questionObject.id}
            setHeaderh3={setHeaderh3}
          />
        ))
      )}
    </div>
  )
}
