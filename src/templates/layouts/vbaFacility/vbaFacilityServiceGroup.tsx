import { ServiceLocation } from '@/templates/components/serviceLocation/ServiceLocation'
import { VbaFacilityService } from '@/types/formatted/vbaFacility'

export const VbaFacilityServiceGroup = ({
  heading,
  headingId,
  services,
  mainPhone,
}: {
  heading: string
  headingId: string
  services: VbaFacilityService[]
  mainPhone: string
}) => {
  return (
    <>
      <h2 id={headingId}>{heading}</h2>
      <p>Select a topic to learn more.</p>
      <div className="vads-u-margin-bottom--3">
        <va-accordion data-testid="service-accordion">
          {services.map((service, index) => (
            <va-accordion-item
              header={service.name}
              key={index}
              level={3}
              bordered
              data-testid="service-accordion-item"
            >
              <p>{service.serviceDescription}</p>
              {service.onlineSelfService && (
                <>
                  <h4>Manage your benefits online</h4>

                  <p>
                    You always have the option to apply for and manage your VA
                    benefits online.
                  </p>

                  <p>
                    <va-link
                      active
                      href={service.onlineSelfService.url}
                      text={service.onlineSelfService.title}
                    ></va-link>
                  </p>
                  {service.serviceLocations.map((serviceLocation, i) => (
                    <ServiceLocation
                      location={serviceLocation}
                      key={i}
                      mainPhoneString={mainPhone}
                      serviceDescription={service.facilityDescription}
                      serviceHeader={service.facilityHeader}
                      isVba={true}
                    />
                  ))}
                </>
              )}
            </va-accordion-item>
          ))}
        </va-accordion>
      </div>
    </>
  )
}
