import {
  VaAccordion,
  VaAccordionItem,
  VaLink,
} from '@department-of-veterans-affairs/web-components/react-bindings/index.js'
import {
  ServiceLocation,
  ServiceLocationType,
} from '@/components/serviceLocation/template'
import { VbaFacilityService } from './formatted-type'
import { slugifyString } from '@/lib/utils/slug'

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
        <VaAccordion data-testid="service-accordion">
          {services.map((service, index) => (
            <VaAccordionItem
              header={service.name}
              key={index}
              level={3}
              bordered
              data-testid="service-accordion-item"
              id={slugifyString(service.name)}
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
                    <VaLink
                      active
                      href={service.onlineSelfService.url}
                      text={service.onlineSelfService.title}
                    ></VaLink>
                  </p>
                </>
              )}
              {service.serviceLocations.map((serviceLocation, i) => (
                <ServiceLocation
                  location={serviceLocation}
                  key={i}
                  mainPhoneString={mainPhone}
                  serviceDescription={service.facilityDescription}
                  serviceHeader={service.facilityHeader}
                  locationType={ServiceLocationType.VBA}
                />
              ))}
            </VaAccordionItem>
          ))}
        </VaAccordion>
      </div>
    </>
  )
}
