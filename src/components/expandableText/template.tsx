import { isEmpty } from 'lodash'
import { VaAdditionalInfo } from '@department-of-veterans-affairs/web-components/react-bindings/index.js'
import { ExpandableText as FormattedExpandableText } from '@/components/expandableText/formatted-type'
import { ParagraphComponent } from '@/components/paragraph/formatted-type'

export function ExpandableText({
  id,
  header,
  text,
}: ParagraphComponent<FormattedExpandableText>) {
  if (isEmpty(header)) return

  return (
    <VaAdditionalInfo disable-border uswds trigger={header}>
      {text && (
        <div
          dangerouslySetInnerHTML={{
            __html: text,
          }}
        />
      )}
    </VaAdditionalInfo>
  )
}
