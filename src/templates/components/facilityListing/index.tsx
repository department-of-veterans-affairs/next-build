import { MediaImage } from '@/templates/common/mediaImage'
import { OperatingStatusFlags } from '@/templates/layouts/healthCareLocalFacility/OperatingStatus'
import { Address } from '@/templates/layouts/healthCareLocalFacility/Address'
import { MinimalLocalFacility } from '@/types/formatted/vamcSystem'
import { Phone } from '@/templates/layouts/healthCareLocalFacility/Phone'

type FacilityListingProps = {
  facility: MinimalLocalFacility
  /**
   * The base path for the VAMC system that contains this facility. See the
   * `OperatingStatusFlags` component's `linkBasePath` prop for more information.
   */
  basePath: string
  /**
   * I'm not 100% sure this is used anywhere.
   */
  type?: 'mobile' | 'desktop'
}

export function FacilityListing({
  facility,
  basePath,
  type,
}: FacilityListingProps) {
  const {
    title,
    path,
    operatingStatusFacility,
    address,
    phoneNumber,
    vaHealthConnectPhoneNumber,
    fieldTelephone,
    image,
  } = facility

  return (
    <div className="region-list usa-width-one-whole vads-u-display--flex vads-u-flex-direction--column mobile-lg:vads-u-flex-direction--row facility vads-u-margin-bottom--4 medium-screen:vads-u-margin-bottom--5">
      <section className="region-grid vads-u-margin-right--2">
        <h3 className="vads-u-margin-bottom--1 vads-u-margin-top--0 vads-u-font-size--md medium-screen:vads-u-font-size--lg">
          <va-link href={path} text={title}></va-link>
        </h3>

        <OperatingStatusFlags
          operatingStatusFacility={operatingStatusFacility}
          basePath={basePath}
        />

        {type !== 'mobile' && (
          <div className="vads-u-margin-bottom--1">
            <Address address={address} title={title} />
          </div>
        )}

        <Phone
          phoneNumber={phoneNumber}
          vaHealthConnectPhoneNumber={vaHealthConnectPhoneNumber}
          fieldTelephone={fieldTelephone}
        />
      </section>

      {image && image.alt && image.links && path && (
        <section className="region-grid usa-width-one-half vads-u-order--first mobile-lg:vads-u-order--initial vads-u-margin-bottom--2">
          <a href={path} aria-label={image.alt}>
            <MediaImage
              {...image}
              imageStyle="3_2_medium_thumbnail"
              className="region-img"
            />
          </a>
        </section>
      )}
    </div>
  )
}
