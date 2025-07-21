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
    <va-additional-info disable-border uswds trigger={header}>
      {text && (
        <div
          dangerouslySetInnerHTML={{
            __html: text,
          }}
        />
      )}
    </va-additional-info>
  )
}
