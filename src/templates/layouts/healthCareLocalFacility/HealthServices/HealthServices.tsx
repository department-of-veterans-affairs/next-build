import { FormattedVAMCFacilityHealthService } from '@/types/formatted/healthCareLocalFacility'
import { ServiceLocation } from './ServiceLocation'
import { hashReference } from '@/lib/utils/hashReference'
import { PhoneNumber } from '@/types/formatted/phoneNumber'

export const HealthServices = ({
  healthServices,
  mentalHealthPhoneNumber,
  mainPhoneString,
}: {
  healthServices: FormattedVAMCFacilityHealthService[]
  mentalHealthPhoneNumber: PhoneNumber
  mainPhoneString: string
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
          // Will this always be true for VAMC facilities?
          const isVha = service.fieldFacilityLocatorApiId?.startsWith('vha_')
          const hasLocationData =
            service.locations?.[0]?.fieldServiceLocationAddress

          return (
            <va-accordion-item
              key={service.name}
              data-label={service.name}
              data-childlabel={service.fieldAlsoKnownAs}
              id={hashReference(service.name)}
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

                {service.description && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: service.description,
                    }}
                  />
                )}

                {hasLocationData ? (
                  service.locations.map((location, i) => (
                    <ServiceLocation
                      location={location}
                      key={i}
                      fieldReferralRequired={service.fieldReferralRequired}
                      fieldTelephone={mentalHealthPhoneNumber}
                      fieldPhoneNumber={mainPhoneString}
                      isMentalHealthService={service.isMentalHealthService}
                    />
                  ))
                ) : (
                  <div>{service.localServiceDescription}</div>
                )}

                {isVha && (
                  <div
                    data-widget-type="facility-appointment-wait-times-widget"
                    data-facility={service.fieldFacilityLocatorApiId}
                    data-service={service.fieldHealthServiceApiId}
                  />
                )}

                {service.fieldBody && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: service.fieldBody
                        .replace(/<h3/g, '<h4')
                        .replace(/<\/h3/g, '</h4'),
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
