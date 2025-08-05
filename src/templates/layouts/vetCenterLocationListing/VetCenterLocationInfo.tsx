import {
  VetCenterInfoVariant,
  VetCenterLocationInfo as VetCenterLocationInfoType,
  VetCenterCapLocationInfo,
  MobileVetCenterLocationInfo,
} from '@/types/formatted/vetCenterLocationListing'
import { Address } from '@/templates/layouts/healthCareLocalFacility/Address'
import { PhoneNumber } from '@/templates/common/phoneNumber'
import { Hours } from '@/templates/components/hours'
import { MediaImage } from '@/templates/common/mediaImage'
import { ExpandableOperatingStatus } from '@/templates/components/expandableOperatingStatus'
import { ImageAndStaticMap } from '@/templates/components/imageAndStaticMap'

interface VetCenterLocationInfoProps {
  isMainOffice?: boolean
  mainVetCenterPhone?: string
  vetCenter: VetCenterInfoVariant
}

// Type guards to check Vet Center variant types
const isMainVetCenter = (
  vetCenter: VetCenterInfoVariant
): vetCenter is VetCenterLocationInfoType => {
  return vetCenter.type === 'node--vet_center'
}

const isVetCenterCap = (
  vetCenter: VetCenterInfoVariant
): vetCenter is VetCenterCapLocationInfo => {
  return vetCenter.type === 'node--vet_center_cap'
}

const isVetCenterMobile = (
  vetCenter: VetCenterInfoVariant
): vetCenter is MobileVetCenterLocationInfo => {
  return vetCenter.type === 'node--vet_center_mobile_vet_center'
}

export const VetCenterLocationInfo = ({
  vetCenter,
  isMainOffice = false,
  mainVetCenterPhone,
}: VetCenterLocationInfoProps) => {
  const { title, address, image, fieldFacilityLocatorApiId } = vetCenter

  // Extract variant-specific fields
  const officialName = isMainVetCenter(vetCenter)
    ? vetCenter.officialName
    : undefined
  const phoneNumber =
    isMainVetCenter(vetCenter) || isVetCenterMobile(vetCenter)
      ? vetCenter.phoneNumber
      : undefined
  const officeHours = isMainVetCenter(vetCenter)
    ? vetCenter.officeHours
    : undefined
  const operatingStatusFacility =
    isMainVetCenter(vetCenter) || isVetCenterCap(vetCenter)
      ? vetCenter.operatingStatusFacility
      : undefined
  const operatingStatusMoreInfo =
    isMainVetCenter(vetCenter) || isVetCenterCap(vetCenter)
      ? vetCenter.operatingStatusMoreInfo
      : undefined

  const alsoCalled =
    officialName && title !== officialName
      ? `Also called the ${officialName}`
      : null
  const alsoCalledId = 'vet-center-title'

  const displayPhoneNumber = mainVetCenterPhone || phoneNumber

  return (
    <div
      data-template="includes/vet_center_address_phone_image"
      className="region-list usa-width-one-whole vads-u-display--flex vads-u-flex-direction--column mobile-lg:vads-u-flex-direction--row facility vads-u-margin-bottom--4 medium-screen:vads-u-margin-bottom--1"
    >
      <section className="region-grid vads-u-margin-right--2">
        {title && (
          <>
            <h3
              className="vads-u-margin-bottom--1 vads-u-margin-top--0 vads-u-font-size--md vads-u-font-size--lg"
              aria-describedby={alsoCalled ? alsoCalledId : undefined}
            >
              {isMainOffice ? (
                <va-link href={vetCenter.path} text={title}></va-link>
              ) : (
                <span>{title}</span>
              )}
            </h3>
            {alsoCalled && (
              <p
                id={alsoCalledId}
                className="vads-u-line-height--4 vads-u-font-family--sans vads-u-font-size--md vads-u-font-weight--bold vads-u-padding-bottom--0p5"
              >
                {alsoCalled}
              </p>
            )}
          </>
        )}

        {operatingStatusFacility && (
          <ExpandableOperatingStatus
            operatingStatusFlag={operatingStatusFacility}
            operatingStatusMoreInfo={operatingStatusMoreInfo}
          />
        )}

        {address && (
          <>
            <h4 className="force-small-header vads-u-margin-top--0 vads-u-line-height--1 vads-u-margin-bottom--1">
              Address
            </h4>
            <div className="vads-u-margin-bottom--3">
              <Address address={address} title={title} />
            </div>
          </>
        )}

        {displayPhoneNumber && (
          <div className="vads-u-margin-bottom--3">
            <PhoneNumber
              className="vads-u-margin-top--0 vads-u-margin-bottom--0"
              treatment="h4"
              label="Phone"
              number={displayPhoneNumber}
            />
          </div>
        )}

        {isMainOffice && officeHours && (
          <div className="vads-u-margin-bottom--3">
            <Hours allHours={officeHours} headerType="small" />
          </div>
        )}
      </section>

      <section className="region-grid usa-width-one-half vads-u-order--first mobile-lg:vads-u-order--initial vads-u-margin-bottom--2">
        {image && isMainOffice && (
          <ImageAndStaticMap
            image={image}
            facilityId={fieldFacilityLocatorApiId}
          />
        )}
      </section>
    </div>
  )
}
