import {
  VaAccordion,
  VaAccordionItem,
} from '@department-of-veterans-affairs/web-components/react-bindings/index.js'
import {
  Accordion as FormattedAccordion,
  AccordionItem as FormattedAccordionItem,
} from '@/components/accordion/formatted-type'
import { slugifyString } from '@/lib/utils/slug'
import { ParagraphComponent } from '@/components/paragraph/formatted-type'

export function AccordionItem({
  id,
  header,
  html,
  itemLevel,
}: ParagraphComponent<FormattedAccordionItem>) {
  return (
    <VaAccordionItem
      key={`${id}-${slugifyString(header)}`}
      header={header}
      class="va-accordion-item"
      id={`${slugifyString(header)}`}
      data-testid={`accordion-item-${id}-${slugifyString(header)}`}
      level={itemLevel ?? 2}
      bordered={true}
    >
      {html && <div dangerouslySetInnerHTML={{ __html: html }} />}
    </VaAccordionItem>
  )
}

export function Accordion({ id, bordered, items }: FormattedAccordion) {
  if (!items) return null
  return (
    <div>
      <VaAccordion id={id}>
        {items.map((item) => (
          <AccordionItem key={item.id} {...item} />
        ))}
      </VaAccordion>
    </div>
  )
}
