import { FieldAddress } from '@/types/drupal/field_type'
import { ParagraphServiceLocationAddress } from '@/types/drupal/paragraph'

interface ServiceAddressProps {
  serviceLocationAddress: ParagraphServiceLocationAddress
  facilityAddress?: FieldAddress
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

  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column">
      {serviceLocationAddress.field_clinic_name ? (
        <h4>{serviceLocationAddress.field_clinic_name}</h4>
      ) : serviceLocationAddress.field_building_name_number ||
        serviceLocationAddress.field_wing_floor_or_room_number ? (
        <h4>Location</h4>
      ) : null}

      {hasAddress && !serviceLocationAddress.field_use_facility_address && (
        <>
          {addressData?.address_line1 && (
            <span className="vads-u-margin-bottom--0">
              {addressData.address_line1}
            </span>
          )}
          {addressData?.address_line2 && (
            <span className="vads-u-margin-bottom--0">
              {addressData.address_line2}
            </span>
          )}
          {addressData?.locality &&
            addressData?.administrative_area &&
            addressData?.postal_code && (
              <span className="vads-u-margin-bottom--0">
                {addressData.locality}, {addressData.administrative_area}{' '}
                {addressData.postal_code}
              </span>
            )}
        </>
      )}

      {serviceLocationAddress.field_building_name_number && (
        <span className="vads-u-margin-bottom--0">
          {serviceLocationAddress.field_building_name_number}
        </span>
      )}

      {serviceLocationAddress.field_wing_floor_or_room_number && (
        <span className="vads-u-margin-bottom--0">
          {serviceLocationAddress.field_wing_floor_or_room_number}
        </span>
      )}
    </div>
  )
}
