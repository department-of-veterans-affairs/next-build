import { QaParagraph as FormattedQaParagraph } from "@/types/formatted/qaParagraph"

export function QaParagraph({ question, answers, id }: FormattedQaParagraph) {
  return (
    <div data-template="paragraphs/q_a" data-entity-id={`${id}`}>
      <div id={`${id}`}>
        <div className="vads-u-display--flex">
          <h2>
            {question}
          </h2>
        </div>
        {answers && (
          <div data-entity-id={id}>
            {answers.map((answer, index) => {
              return (<>{/* TODO Paragraph component logic */}</>)
            })}

          </div>
        )}

      </div>
    </div>
  )
}
