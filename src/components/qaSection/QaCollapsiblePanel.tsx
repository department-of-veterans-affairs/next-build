import { Paragraph } from '@/components/paragraph/template'
import { slugifyString } from '@/lib/utils/slug'

export const QaCollapsiblePanel = ({ questions }) => {
  return (
    <div data-template="paragraphs/q_a.collapsible_panel">
      <va-accordion>
        {questions.map((questionObject) => (
          <va-accordion-item
            key={questionObject.id || questionObject.entityId}
            class="va-accordion-item"
            header={questionObject.question}
            id={slugifyString(questionObject.question)}
            level="3"
          >
            <div
              id={questionObject.id}
              data-template="paragraphs/q_a.collapsible_panel__qa"
              data-entity-id={questionObject.id}
              data-analytics-faq-section={questionObject.header}
              data-analytics-faq-text={questionObject.question}
            >
              <div id={`qa-${questionObject.id}`}>
                {questionObject.answers.map((answer) => (
                  <Paragraph key={answer.id || answer.entityId} {...answer} />
                ))}
              </div>
            </div>
          </va-accordion-item>
        ))}
      </va-accordion>
    </div>
  )
}
