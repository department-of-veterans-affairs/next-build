import {
  VaAccordion,
  VaAccordionItem,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings'
import { isEmpty } from 'lodash'
import { ExpandableText as FormattedExpandableText } from '@/types/dataTypes/formatted/expandableText'

export function ExpandableText({ id, header, text }: FormattedExpandableText) {
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
