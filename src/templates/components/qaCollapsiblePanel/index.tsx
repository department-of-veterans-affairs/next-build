export const QaCollapsiblePanel = ({ questions }) => {
  return (
    <div data-next-component="templates/components/qaCollapsiblePanel">
      <va-accordion>
        {questions.map((questionObject) => (
          <va-accordion-item
            key={questionObject.id}
            class="va-accordion-item"
            header={questionObject.question}
            id={`${questionObject.question}-header`}
            level="3"
          >
            <div
              id={questionObject.id}
              data-entity-id={questionObject.id}
              data-analytics-faq-section={questionObject.header}
              data-analytics-faq-text={questionObject.question}
            >
              <div id={`qa-${questionObject.id}`}>
                {questionObject.answers.map((answer, index) => (
                  <div
                    key={index}
                    dangerouslySetInnerHTML={{ __html: answer.html }}
                  />
                ))}
              </div>
            </div>
          </va-accordion-item>
        ))}
      </va-accordion>
    </div>
  )
}
