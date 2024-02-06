import { Accordion as FormattedAccordion } from '@/types/formatted/accordion'
import { slugifyString } from '@/lib/utils/slug'

type AccordionProps = {
  id: string
  bordered: boolean
  items: FormattedAccordion[]
}

export function Accordion({ id, bordered, items }: AccordionProps) {
  if (!items) return null
  return (
    <div>
      <va-accordion bordered={bordered} id={id}>
        {items.map((item) => (
          <va-accordion-item
            key={`${id}-${slugifyString(item.header)}`}
            header={item.header}
            class="va-accordion-item"
            id={`${id}-${slugifyString(item.header)}`}
          >
            {item.html && (
              <div dangerouslySetInnerHTML={{ __html: item.html }} />
            )}
          </va-accordion-item>
        ))}
      </va-accordion>
    </div>
  )
}
