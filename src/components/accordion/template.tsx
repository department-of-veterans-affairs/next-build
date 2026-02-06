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
  // Note: AccordionItem is used inside Accordion, which is already wrapped in a hidden div
  // So we don't need to hide AccordionItem individually
  return (
    <va-accordion-item
      key={`${id}-${slugifyString(header)}`}
      header={header}
      class="va-accordion-item"
      id={`${slugifyString(header)}`}
      data-testid={`accordion-item-${id}-${slugifyString(header)}`}
      level={itemLevel ?? 2}
    >
      {html && <div dangerouslySetInnerHTML={{ __html: html }} />}
    </va-accordion-item>
  )
}

export function Accordion({ id, bordered, items }: FormattedAccordion) {
  if (!items) return null
  const accordionClass = bordered ? 'usa-accordion--bordered' : 'usa-accordion'
  
  return (
    <div>
      {/* I want the va-accordion to still trigger a lazy load of the custom element */}
      <div style={{ display: 'none' }}>
        <va-accordion bordered={bordered} id={id}>
          {items.map((item) => (
            <AccordionItem key={item.id} {...item} />
          ))}
        </va-accordion>
      </div>
      {/* Static HTML structure extracted from va-accordion shadow DOM */}
      <div className={`va-accordion-wrapper ${accordionClass}`}>
        <ul className="expand-collapse-list">
          <li>
            <button className="va-accordion__button" data-testid="expand-all-accordions" aria-pressed="false" aria-label="Expand all accordions">
              Expand all
            </button>
          </li>
          <li>
            <button className="va-accordion__button" data-testid="collapse-all-accordions" aria-pressed="false" aria-label="Collapse all accordions">
              Collapse all
            </button>
          </li>
        </ul>
        <ul className="usa-accordion">
          {items.map((item) => {
            const itemId = slugifyString(item.header)
            return (
              <li key={item.id}>
                <h5 className="usa-accordion__heading">
                  <button
                    type="button"
                    className="usa-accordion__button"
                    aria-expanded="false"
                    aria-controls={`content-${itemId}`}
                  >
                    <span className="va-accordion__header">
                      <span>{item.header}</span>
                    </span>
                  </button>
                </h5>
                <div
                  id={`content-${itemId}`}
                  className="usa-accordion__content usa-prose"
                  hidden
                >
                  {item.html && <div dangerouslySetInnerHTML={{ __html: item.html }} />}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
