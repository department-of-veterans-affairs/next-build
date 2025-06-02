import { FieldAddress } from '@/types/drupal/field_type'
import { ParagraphServiceLocationAddress } from '@/types/drupal/paragraph'

interface ServiceAddressProps {
  serviceLocationAddress: ParagraphServiceLocationAddress
  facilityAddress?: FieldAddress
  headerLevel?: number // Corresponds to serviceLocationAddressHeaderLevel
}

export const ServiceAddress = ({
  serviceLocationAddress,
  facilityAddress,
  headerLevel = 3,
}: ServiceAddressProps) => {
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

  const HeadingTag = `h${headerLevel}` as keyof JSX.IntrinsicElements

  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column">
      {serviceLocationAddress.field_clinic_name ? (
        <HeadingTag>{serviceLocationAddress.field_clinic_name}</HeadingTag>
      ) : serviceLocationAddress.field_building_name_number ||
        serviceLocationAddress.field_wing_floor_or_room_number ? (
        <HeadingTag>Location</HeadingTag>
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
