import {
  VaAccordion,
  VaAccordionItem,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings'
import { isEmpty } from 'lodash'
import { ExpandableTextType } from '@/types/index'

export function ExpandableText({ id, header, text }: ExpandableTextType) {
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
