/* istanbul ignore file */
// Ignoring this until we get tests written; it's just really detailed
// scaffolding for now.

import { FormattedVAMCFacilityHealthServices } from '@/types/formatted/healthCareLocalFacility'
import { ServiceLocation } from './ServiceLocation'

export const HealthServices = ({
  healthServices,
}: {
  healthServices: FormattedVAMCFacilityHealthServices[]
}) => {
  return (
    <>
      <h2
        id="health-care-offered-here"
        className="vads-u-font-size--xl vads-u-margin-top--5"
      >
        Health services offered here
      </h2>
      <p>Select a topic to learn more.</p>

      <va-accordion>
        {healthServices.map((service) => {
          const id = service.name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .slice(0, 60)
          const isVha = service.fieldFacilityLocatorApiId?.startsWith('vha_')
          const hasLocationData =
            service.locations?.[0]?.single?.fieldServiceLocationAddress

          return (
            <va-accordion-item
              key={id}
              data-label={service.name}
              data-childlabel={service.fieldAlsoKnownAs}
              data-template="facilities/facilities_health_service"
              id={id}
              class="facilities_health_service va-accordion-item"
              subheader={service.fieldAlsoKnownAs}
            >
              <h3 slot="headline">{service.name}</h3>
              <div id={`${service.entityBundle}-${service.entityId}`}>
                {service.fieldCommonlyTreatedCondition && (
                  <p className="vads-u-margin-bottom--2">
                    Common conditions: {service.fieldCommonlyTreatedCondition}
                  </p>
                )}

                {service.fieldTricareDescription ? (
                  <div>{service.fieldTricareDescription}</div>
                ) : service.description ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: service.description,
                    }}
                  />
                ) : null}

                {hasLocationData ? (
                  service.locations.map((locationData, i) => (
                    <ServiceLocation key={i} {...locationData} />
                  ))
                ) : (
                  <div>{service.localServiceDescription}</div>
                )}

                {isVha && (
                  <div
                    data-widget-type="facility-appointment-wait-times-widget"
                    data-facility={service.fieldFacilityLocatorApiId}
                    data-service={service.name}
                  />
                )}

                {service.fieldBody && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: service.fieldBody.replace(/<h3/g, '<h4'),
                    }}
                  />
                )}
              </div>
            </va-accordion-item>
          )
        })}
      </va-accordion>
    </>
  )
}
