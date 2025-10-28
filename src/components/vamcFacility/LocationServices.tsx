import {
  VaAccordion,
  VaAccordionItem,
} from '@department-of-veterans-affairs/web-components/react-bindings/index.js'
import { hashReference } from '@/lib/utils/hashReference'

export const LocationServices = ({
  items,
}: {
  items: Array<{ title: string; wysiwigContents: string }>
}) => {
  if (!items?.length) return null

  return (
    <section
      className="vads-u-margin-bottom--4"
      data-label="Prepare for your visit"
    >
      <h2
        id="prepare-for-your-visit"
        className="vads-u-margin-top--0 vads-u-font-size--lg mobile-lg:vads-u-font-size--xl vads-u-margin-bottom--2"
      >
        Prepare for your visit
      </h2>
      <p>Select a topic to learn more.</p>
      <VaAccordion section-heading="Prepare for your visit">
        {items.map((item) => {
          return (
            <VaAccordionItem
              id={hashReference(item.title, 60)}
              key={item.title}
              header={item.title}
              level={3}
              data-label={item.title}
            >
              <div dangerouslySetInnerHTML={{ __html: item.wysiwigContents }} />
            </VaAccordionItem>
          )
        })}
      </VaAccordion>
    </section>
  )
}
