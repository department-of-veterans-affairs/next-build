import {
  VaAccordion,
  VaAccordionItem,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings'
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
    <VaAccordion open-single>
      <VaAccordionItem
        id={id}
        header={header}
        dangerouslySetInnerHTML={{
          __html: text,
        }}
      ></VaAccordionItem>
    </VaAccordion>
  )
}
