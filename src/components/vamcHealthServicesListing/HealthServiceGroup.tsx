import { HealthServiceGroup as HealthServiceGroupType } from './formatted-type'
import { HealthServiceAccordionItem } from './HealthServiceAccordionItem'

interface HealthServiceGroupProps {
  group: HealthServiceGroupType
  systemTitle: string
}

export const HealthServiceGroup = ({ 
  group,
  systemTitle
}: HealthServiceGroupProps) => (
    <section data-label={group.typeOfCare}>
      <h2>{group.typeOfCare}</h2>
      <p>Select a topic to learn more.</p>
      <div className="service-accordion-output">
        <va-accordion bordered uswds="true">
          {group.services.map((service) => (
            <HealthServiceAccordionItem
              key={service.id}
              service={service}
              systemTitle={systemTitle}
            />
          ))}
        </va-accordion>
      </div>
    </section>
  )
