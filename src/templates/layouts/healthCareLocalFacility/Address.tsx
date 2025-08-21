import { GoogleMapsDirections } from '@/templates/common/googleMapsDirections'
import { FieldAddress } from '@/types/drupal/field_type'

export const Address = ({
  address,
  title,
  showOrganization = false,
}: {
  address: FieldAddress
  title: string
  showOrganization?: boolean
}) => {
  const directionsString = [
    address.address_line1,
    address.locality,
    address.administrative_area,
  ]

  return (
    <>
      <address>
        <p className="vads-u-margin-bottom--0 vads-u-margin-top--0">
          {showOrganization && address.organization && (
            <>
              {address.organization}
              <br />
            </>
          )}
          {address.address_line1}
          {address.address_line2 && (
            <>
              <br />
              {address.address_line2}
            </>
          )}
          <br />
          {`${address.locality}, ${address.administrative_area} ${address.postal_code}`}
        </p>
      </address>
      <p className="vads-u-margin-bottom--0 vads-u-margin-top--0">
        <GoogleMapsDirections address={directionsString} location={title} />
      </p>
    </>
  )
}
