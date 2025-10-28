import {
  VaAccordionItem,
  VaLink,
} from '@department-of-veterans-affairs/web-components/react-bindings/index.js'
import { HealthService } from './formatted-type'
import { hashReference } from '@/lib/utils/hashReference'

interface HealthServiceAccordionItemProps {
  service: HealthService
  systemTitle: string
}

export function HealthServiceAccordionItem({
  service,
  systemTitle,
}: HealthServiceAccordionItemProps) {
  const serviceId = hashReference(service.title, 60)

  return (
    <VaAccordionItem
      subheader={service.alsoKnownAs}
      data-childlabel={service.alsoKnownAs}
      className="va-accordion-item"
      data-label={service.title}
      data-template="facilities/health_service"
      id={`item-${serviceId}`}
    >
      <h3 slot="headline">{service.title}</h3>
      <>
        {service.commonlyTreatedCondition && (
          <p className="vads-u-margin-bottom--2">
            Common conditions: {service.commonlyTreatedCondition}
          </p>
        )}

        <div
          dangerouslySetInnerHTML={{
            __html: service.descriptionHtml,
          }}
        />

        {service.locations.length > 0 && (
          <>
            <h4 className="vads-u-font-size--h3">
              Available at these locations
            </h4>
            <ul className="usa-unstyled-list" role="list">
              {service.locations.map((location) => (
                <li key={location.id} className="vads-u-margin-bottom--2">
                  <VaLink
                    href={`${location.path}/#${serviceId}`}
                    text={location.title}
                  />
                </li>
              ))}
            </ul>
          </>
        )}

        {service.bodyHtml && (
          <>
            <h4 className="vads-u-font-size--h3">
              {/* Use template literal to avoid broken text for screen readers */}
              {`Care we provide at ${systemTitle}`}
            </h4>
            <div
              dangerouslySetInnerHTML={{
                __html: service.bodyHtml,
              }}
            />
          </>
        )}
      </>
    </VaAccordionItem>
  )
}
