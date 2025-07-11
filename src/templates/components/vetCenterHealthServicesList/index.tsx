import React from 'react'
import { VetCenterHealthServices as FormattedHealthServices } from '@/types/formatted/vetCenterHealthServices'
import { slugifyString } from '@/lib/utils/slug'

interface ServicesListProps {
  services: FormattedHealthServices
}

function ServicesList({ services }: ServicesListProps) {
  if (!services) return null
  return (
    <div className="vads-u-margin-bottom--3">
      <va-accordion bordered>
        {services.map((service, index) => (
          <va-accordion-item
            key={index}
            class="va-accordion-item"
            id={`item-${slugifyString(service.name)}`}
            header={service.name}
            subheader={service.vetCenterFriendlyName}
            level="3"
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
              <p dangerouslySetInnerHTML={{ __html: service.body }} />
            )}
          </va-accordion-item>
        ))}
      </va-accordion>
    </div>
  )
}

export default ServicesList
