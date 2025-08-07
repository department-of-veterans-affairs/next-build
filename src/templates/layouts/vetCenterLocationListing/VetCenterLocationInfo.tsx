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
import { TextWithImage } from '@/templates/components/textWithImage'

interface VetCenterLocationInfoProps {
  isMainOffice?: boolean
  mainVetCenterPhone?: string
  vetCenter: VetCenterInfoVariant
}

// Type guards to check Vet Center variant types
const isVetCenter = (
  vetCenter: VetCenterInfoVariant
): vetCenter is VetCenterLocationInfoType => {
  return vetCenter.type === 'node--vet_center'
}

const isVetCenterCap = (
  vetCenter: VetCenterInfoVariant
): vetCenter is VetCenterCapLocationInfo => {
  return vetCenter.type === 'node--vet_center_cap'
}

const isMobileVetCenter = (
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

  let alsoCalled: string | undefined
  let alsoCalledId: string | undefined
  if (isVetCenter(vetCenter)) {
    const { officialName } = vetCenter
    if (officialName && title !== officialName) {
      alsoCalled = `Also called the ${officialName}`
      alsoCalledId = 'vet-center-title'
    }
  }

  const { operatingStatusFacility, operatingStatusMoreInfo } = vetCenter as
    | VetCenterLocationInfoType
    | VetCenterCapLocationInfo

  const phoneNumber = isVetCenterCap(vetCenter)
    ? mainVetCenterPhone
    : vetCenter.phoneNumber

  const officeHours =
    isVetCenter(vetCenter) && isMainOffice ? vetCenter.officeHours : undefined

  return (
    <TextWithImage
      data-template="includes/vet_center_address_phone_image"
      image={
        <>
          {image && <MediaImage {...image} imageStyle="3_2_medium_thumbnail" />}
          <div
            data-widget-type={
              isMainOffice
                ? 'facility-map-satellite-main-office'
                : 'facility-map-satellite-locations'
            }
            data-facility={fieldFacilityLocatorApiId}
          />
        </>
      }
    >
      {title && (
        <>
          <h3
            className="vads-u-margin-bottom--1 vads-u-margin-top--0 vads-u-font-size--md vads-u-font-size--lg"
            aria-describedby={alsoCalledId}
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
          <h4 className="vads-u-margin-top--0 vads-u-margin-bottom--1">
            Address
          </h4>
          <div className="vads-u-margin-bottom--3">
            <Address address={address} title={title} />
          </div>
        </>
      )}

      {phoneNumber && (
        <div className="vads-u-margin-bottom--3">
          <PhoneNumber
            className="vads-u-margin-top--0 vads-u-margin-bottom--0"
            treatment="h4"
            label="Phone"
            number={phoneNumber}
          />
        </div>
      )}

      {officeHours && (
        <div className="vads-u-margin-bottom--3">
          <h4 className="vads-u-margin-top--0 vads-u-margin-bottom--1">
            Hours
          </h4>
          <Hours allHours={officeHours} />
        </div>
      )}
    </TextWithImage>
  )
}
