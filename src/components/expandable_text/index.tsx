import {
  VaAccordion,
  VaAccordionItem,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings'
import { isEmpty } from 'lodash'

export interface ExpandableTextProps {
  id: string
  header: string
  text: string
}

export function ExpandableText({ id, header, text }: ExpandableTextProps) {
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
