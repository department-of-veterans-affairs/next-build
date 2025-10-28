import {
  VaAccordion,
  VaAccordionItem,
} from '@department-of-veterans-affairs/web-components/react-bindings/index.js'
import { Paragraph } from '@/components/paragraph/template'

export const QaCollapsiblePanel = ({ questions }) => {
  return (
    <div data-template="paragraphs/q_a.collapsible_panel">
      <VaAccordion>
        {questions.map((questionObject) => (
          <VaAccordionItem
            key={questionObject.id || questionObject.entityId}
            class="va-accordion-item"
            header={questionObject.question}
            id={`${questionObject.question}-header`}
            level={3}
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
          </VaAccordionItem>
        ))}
      </VaAccordion>
    </div>
  )
}
