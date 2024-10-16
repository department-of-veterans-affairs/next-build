import { QaParagraph as FormattedQaParagraph } from '@/types/formatted/qaParagraph'
import { Paragraph } from '@/templates/components/paragraph'

export function QaParagraph({
  question,
  answers,
  setHeaderh3,
}: FormattedQaParagraph) {
  const DynamicHeader = setHeaderh3 ? 'h3' : 'h2'
  return (
    <div data-next-component="templates/components/qaParagraph">
      <div>
        <div className="vads-u-display--flex">
          <DynamicHeader>{question}</DynamicHeader>
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
