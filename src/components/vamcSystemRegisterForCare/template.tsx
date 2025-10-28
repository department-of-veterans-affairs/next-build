import {
  VaLink,
  VaLinkAction,
} from '@department-of-veterans-affairs/web-components/react-bindings/index.js'
import { Fragment } from 'react'
import { VamcSystemRegisterForCare as FormattedVamcSystemRegisterForCare } from './formatted-type'
import { ContentFooter } from '../contentFooter/template'
import { Wysiwyg } from '../wysiwyg/template'
import { ListOfLinkTeasers } from '../listOfLinkTeasers/template'
import {
  ServiceLocation,
  ServiceLocationType,
} from '../serviceLocation/template'
import { Address } from '@/components/address/template'
import { LovellSwitcher } from '@/components/lovellSwitcher/template'
import { SideNavLayout } from '@/components/sideNavLayout/template'

export const VamcSystemRegisterForCare = ({
  title,
  vamcSystem,
  lastUpdated,
  menu,
  topOfPageContent,
  bottomOfPageContent,
  relatedLinks,
  services,
  lovellVariant,
  lovellSwitchPath,
}: FormattedVamcSystemRegisterForCare) => {
  return (
    <SideNavLayout menu={menu} data-template="vamc_system_register_for_care">
      <article className="usa-content">
        <LovellSwitcher
          currentVariant={lovellVariant}
          switchPath={lovellSwitchPath}
        />

        <h1>{title}</h1>
        <div className="va-introtext">
          <p>
            Register to get care at one of our {vamcSystem?.title} facilities.
            Not yet enrolled in VA health care? We can help you apply in person
            or get started online.
          </p>
        </div>

        <va-on-this-page></va-on-this-page>

        <div className="usa-content">
          <Wysiwyg {...topOfPageContent} />
        </div>

        {services.map((service) => (
          <Fragment key={service.id}>
            <h3>
              <VaLink href={service.path} text={service.title}></VaLink>
            </h3>
            {service.address && (
              <Address address={service.address} showDirections={false} />
            )}
            {service.serviceLocations.map((serviceLocation) => (
              <ServiceLocation
                key={serviceLocation.id}
                location={serviceLocation}
                locationType={ServiceLocationType.NON_CLINICAL}
                mainPhoneString={service.phoneNumber}
                headingLevel={4}
              />
            ))}
          </Fragment>
        ))}

        <Wysiwyg {...bottomOfPageContent} />

        {/* TODO: Related links */}
        <div className="va-nav-linkslist va-nav-linkslist--related">
          <ListOfLinkTeasers {...relatedLinks} />
        </div>

        <va-back-to-top></va-back-to-top>

        <ContentFooter lastUpdated={lastUpdated} />
      </article>
    </SideNavLayout>
  )
}

export default VamcSystemRegisterForCare
