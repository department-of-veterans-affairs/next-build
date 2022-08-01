import {
  VaAccordion,
  VaAccordionItem,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings'
import { isEmpty } from 'lodash'

export interface ExpandableTextProps {
  header: string
  id: number
  text: string
}

export function ExpandableText({ header, id, text }: ExpandableTextProps) {
  if (isEmpty(header)) return

  return (
    <VaAccordion open-single>
      <VaAccordionItem
        header={header}
        id={id}
        dangerouslySetInnerHTML={{
          __html: text,
        }}
      ></VaAccordionItem>
    </VaAccordion>
  )
}
