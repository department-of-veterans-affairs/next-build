import { QaParagraph as FormattedQaParagraph } from '@/types/formatted/qaParagraph'
import { Paragraph } from '@/templates/components/paragraph'

export function QaParagraph({ question, answers }: FormattedQaParagraph) {
  return (
    <div data-template="paragraphs/q_a">
      <div>
        <div className="vads-u-display--flex">
          <h2>{question}</h2>
        </div>
        {answers && (
          <div>
            {answers.map((answer, index) => {
              return <Paragraph key={index} {...answer} />
            })}
          </div>
        )}
      </div>
    </div>
  )
}
