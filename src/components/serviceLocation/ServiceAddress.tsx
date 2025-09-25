import { FieldAddress } from '@/types/drupal/field_type'
import { ParagraphServiceLocationAddress } from '@/types/drupal/paragraph'
import { Address } from '../address/template'

interface ServiceAddressProps {
  serviceLocationAddress: ParagraphServiceLocationAddress
  facilityAddress?: FieldAddress
  headingLevel?: 4 | 5 | 6
}

/**
 * Health Service Address component for use in both VAMC Facility & VHA
 * Facility.
 *
 * NOTE: This is a 1:1 correlation to the content-build template. It could use
 * some refactoring.
 */
export const ServiceAddress = ({
  serviceLocationAddress,
  facilityAddress,
  headingLevel = 4,
}: ServiceAddressProps) => {
  // TODO: When refactoring this, we won't ever need the `facilityAddress`, so
  // we can remove it. If `field_use_facility_address` is true, we show no
  // `addressData`.

  const useFacilityAddress =
    serviceLocationAddress.field_use_facility_address && facilityAddress
  const addressData = useFacilityAddress
    ? facilityAddress
    : serviceLocationAddress.field_address

  const hasAddress =
    !!addressData &&
    (addressData.address_line1 ||
      addressData.address_line2 ||
      addressData.locality ||
      addressData.administrative_area ||
      addressData.postal_code)

  const showSection =
    hasAddress ||
    serviceLocationAddress.field_clinic_name ||
    serviceLocationAddress.field_building_name_number ||
    serviceLocationAddress.field_wing_floor_or_room_number

  if (!showSection) {
    return null
  }

  let heading
  if (serviceLocationAddress.field_clinic_name) {
    heading = serviceLocationAddress.field_clinic_name
  } else if (
    serviceLocationAddress.field_building_name_number ||
    serviceLocationAddress.field_wing_floor_or_room_number
  ) {
    heading = 'Location'
  }
  const HeadingTag = `h${headingLevel}` as 'h4' | 'h5'

  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column">
      {heading && <HeadingTag>{heading}</HeadingTag>}

      {hasAddress && !serviceLocationAddress.field_use_facility_address && (
        <Address address={addressData} showDirections={false} />
      )}

      {serviceLocationAddress.field_building_name_number && (
        <p className="vads-u-margin-y--0">
          {serviceLocationAddress.field_building_name_number}
        </p>
      )}

      {serviceLocationAddress.field_wing_floor_or_room_number && (
        <p className="vads-u-margin-y--0">
          {serviceLocationAddress.field_wing_floor_or_room_number}
        </p>
      )}
    </div>
  )
}
