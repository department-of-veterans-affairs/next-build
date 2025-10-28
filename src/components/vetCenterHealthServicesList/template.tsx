import React from 'react'
import {
  VaAccordion,
  VaAccordionItem,
} from '@department-of-veterans-affairs/web-components/react-bindings/index.js'
import { VetCenterHealthServices as FormattedHealthServices } from '@/components/vetCenterHealthServices/formatted-type'
import { slugifyString } from '@/lib/utils/slug'

interface ServicesListProps {
  services: FormattedHealthServices
}

function ServicesList({ services }: ServicesListProps) {
  if (!services) return null
  return (
    <div className="vads-u-margin-bottom--3">
      <VaAccordion>
        {services.map((service, index) => (
          <VaAccordionItem
            key={index}
            class="va-accordion-item"
            id={`item-${slugifyString(service.name)}`}
            header={service.name}
            subheader={service.vetCenterFriendlyName}
            level={3}
          >
            {service.vetCenterComConditions && (
              <p>{service.vetCenterComConditions}</p>
            )}
            {service.vetCenterServiceDescription && (
              <p
                dangerouslySetInnerHTML={{
                  __html: service.vetCenterServiceDescription,
                }}
              />
            )}
            {service.body && (
              <div dangerouslySetInnerHTML={{ __html: service.body }} />
            )}
          </VaAccordionItem>
        ))}
      </VaAccordion>
    </div>
  )
}

export default ServicesList
