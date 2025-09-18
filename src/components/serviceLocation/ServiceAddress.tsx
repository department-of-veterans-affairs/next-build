import { FieldAddress } from '@/types/drupal/field_type'
import { ParagraphServiceLocationAddress } from '@/types/drupal/paragraph'
import { Address } from '../address/template'

interface ServiceAddressProps {
  serviceLocationAddress: ParagraphServiceLocationAddress
  facilityAddress?: FieldAddress
  useH5?: boolean
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
  useH5 = false,
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
  const getHeading = () => {
    if (serviceLocationAddress.field_clinic_name) {
      return serviceLocationAddress.field_clinic_name
    } else if (
      serviceLocationAddress.field_building_name_number ||
      serviceLocationAddress.field_wing_floor_or_room_number
    ) {
      return 'Location'
    }
    return null
  }
  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column">
      {getHeading() && (
        <>{useH5 ? <h5>{getHeading()}</h5> : <h4>{getHeading()}</h4>}</>
      )}

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
