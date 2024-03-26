import { NumberCallout as FormattedNumberCallout } from '@/types/formatted/numberCallout'

export function NumberCallout({
  numberPhrase,
  entityId,
  description,
}: FormattedNumberCallout) {
  return (
    <div
      data-template="paragraphs/number_callout"
      data-entity-id={entityId}
      className="card information"
    >
      <span className="number">{numberPhrase}</span>
      <span className="description">{description}</span>
    </div>
  )
}
