import { NumberCallout as FormattedNumberCallout } from '@/components/numberCallout/formatted-type'

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
      <va-card background class="vads-u-margin-bottom--3">
        <span className="number vads-u-font-family--serif 40px vads-u-font-size--h2 vads-u-font-weight--bold vads-u-line-height--1 vads-u-padding-bottom--2 vads-u-border-bottom--1px vads-u-border-color--gray-light vads-u-display--inline-block">
          {numberPhrase}
        </span>
        <span
          className="description vads-u-font-size--base vads-u-font-weight--normal vads-u-padding-top--0p5 vads-u-display--block"
          dangerouslySetInnerHTML={{ __html: description }}
        ></span>
      </va-card>
    </div>
  )
}
