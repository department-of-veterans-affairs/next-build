import { VaAlertExpandable } from '@department-of-veterans-affairs/component-library/dist/react-bindings'
import { isEmpty } from 'lodash'
import { ExpandableText as FormattedExpandableText } from '@/types/formatted/expandableText'
import { ParagraphComponent } from '@/types/formatted/paragraph'

export function ExpandableText({
  id,
  header,
  text,
}: ParagraphComponent<FormattedExpandableText>) {
  if (isEmpty(header)) return

  return (
    <VaAlertExpandable
      id={id}
      trigger={header}
      data-next-component="templates/components/expandableText"
    >
      {text && (
        <div
          dangerouslySetInnerHTML={{
            __html: text,
          }}
        />
      )}
    </VaAlertExpandable>
  )
}
