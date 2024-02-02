import { Accordion as FormattedAccordion } from '@/types/formatted/accordion'
import { stringToId } from '@/lib/utils/stringToId'

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
            key={`${id}-${stringToId(item.header)}`}
            header={item.header}
            className="va-accordion-item"
            id={`${id}-${stringToId(item.header)}`}
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
