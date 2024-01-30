import React from 'react';
import { HealthServices as HealthServicesType } from '@/types/formatted/healthServices';

interface ServicesListProps {
  services: HealthServicesType;
}

function ServicesList({ services }: ServicesListProps) {
  return (
    <div className="vads-u-margin-bottom--3">
      <va-accordion bordered>
        {services.map((service, index) => (
          <va-accordion-item
            key={index}
            class="va-accordion-item"
            id={`item-${service.name}`}
            header={service.name}
            subheader={service.vetCenterFriendlyName}
            level="3"
          >
            {service.vetCenterComConditions && (
              <p>{service.vetCenterComConditions}</p>
            )}
            {service.vetCenterServiceDescription && (
              <p>{service.vetCenterServiceDescription}</p>
            )}
            {service.body && (
              <div dangerouslySetInnerHTML={{ __html: service.body }} />
            )}
          </va-accordion-item>

        ))}
      </va-accordion>
    </div>
  );
}

export default ServicesList;
