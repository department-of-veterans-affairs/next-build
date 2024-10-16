import {
  Accordion as FormattedAccordion,
  AccordionItem as FormattedAccordionItem,
} from '@/types/formatted/accordion'
import { slugifyString } from '@/lib/utils/slug'
import { ParagraphComponent } from '@/types/formatted/paragraph'

export function AccordionItem({
  id,
  header,
  html,
}: ParagraphComponent<FormattedAccordionItem>) {
  return (
    <va-accordion-item
      key={`${id}-${slugifyString(header)}`}
      header={header}
      class="va-accordion-item"
      id={`${id}-${slugifyString(header)}`}
    >
      {html && <div dangerouslySetInnerHTML={{ __html: html }} />}
    </va-accordion-item>
  )
}

export function Accordion({ id, bordered, items }: FormattedAccordion) {
  if (!items) return null
  return (
    <div data-next-component="templates/components/accordion">
      <va-accordion bordered={bordered} id={id}>
        {items.map((item) => (
          <AccordionItem key={item.id} {...item} />
        ))}
      </va-accordion>
    </div>
  )
}
