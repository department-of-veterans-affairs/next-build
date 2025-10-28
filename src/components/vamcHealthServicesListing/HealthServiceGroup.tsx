import { VaAccordion } from '@department-of-veterans-affairs/web-components/react-bindings/index.js'
import { hashReference } from '@/lib/utils/hashReference'
import { HealthServiceGroup as HealthServiceGroupType } from './formatted-type'
import { HealthServiceAccordionItem } from './HealthServiceAccordionItem'

interface HealthServiceGroupProps {
  group: HealthServiceGroupType
  systemTitle: string
}

export const HealthServiceGroup = ({
  group,
  systemTitle,
}: HealthServiceGroupProps) => (
  <section data-label={group.typeOfCare}>
    <h2 id={hashReference(group.typeOfCare)}>{group.typeOfCare}</h2>
    <p>Select a topic to learn more.</p>
    <div className="service-accordion-output">
      <VaAccordion>
        {group.services.map((service) => (
          <HealthServiceAccordionItem
            key={service.id}
            service={service}
            systemTitle={systemTitle}
          />
        ))}
      </VaAccordion>
    </div>
  </section>
)
