import {
  VetCenterInfoVariant,
  VetCenterLocationInfo as VetCenterLocationInfoType,
  VetCenterCapLocationInfo,
  VetCenterOutstationLocationInfo,
  MobileVetCenterLocationInfo,
} from './formatted-type'
import { Address } from '../healthCareLocalFacility/Address'
import { PhoneNumber } from '@/templates/common/phoneNumber'
import { Hours } from '@/templates/components/hours'
import { MediaImage } from '@/components/mediaImage/template'
import { ExpandableOperatingStatus } from '@/templates/components/expandableOperatingStatus'
import { TextWithImage } from '@/templates/components/textWithImage'
import { ReactNode } from 'react'

interface VetCenterLocationInfoMainOfficeProps {
  isMainOffice: true
  vetCenter: VetCenterInfoVariant
  mainOffice?: undefined
}

interface VetCenterLocationInfoSatelliteProps {
  isMainOffice?: false | undefined
  vetCenter: VetCenterInfoVariant
  mainOffice: VetCenterLocationInfoType
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

/**
 * For the map widgets to work, certain global variables need to be set, which is
 * currently being done in the parent VetCenterLocationListing component.
 */
export const VetCenterLocationInfo = ({
  vetCenter,
  isMainOffice = false,
  mainOffice,
}:
  | VetCenterLocationInfoMainOfficeProps
  | VetCenterLocationInfoSatelliteProps) => {
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
    ? mainOffice.phoneNumber
    : vetCenter.phoneNumber

  // Define office hours if they exist or the alternative text for CAPs that opt out of
  // showing hours
  const { officeHours } = vetCenter as
    | VetCenterLocationInfoType
    | VetCenterCapLocationInfo
    | VetCenterOutstationLocationInfo
  let officeHoursAlternative: ReactNode | undefined
  if (isVetCenterCap(vetCenter) && !vetCenter.vetCenterCapHoursOptIn) {
    officeHoursAlternative = (
      <p>Veterans should call main Vet Center for hours</p>
    )
  }

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

      {address && !isMobileVetCenter(vetCenter) && (
        <>
          <div className="vads-u-margin-bottom--3">
            <h4 className="vads-u-margin-top--0 vads-u-margin-bottom--1">
              Address
            </h4>
            <Address address={address} title={title} showOrganization />
          </div>
        </>
      )}

      {phoneNumber && (
        <PhoneNumber
          className="vads-u-margin-bottom--3"
          labelClassName="vads-u-margin-top--0 vads-u-margin-bottom--1"
          treatment="h4"
          label="Phone"
          number={phoneNumber}
        />
      )}

      {officeHoursAlternative
        ? officeHoursAlternative
        : officeHours && (
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
