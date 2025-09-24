import { GoogleMapsDirections } from '@/components/googleMapsDirections/template'
import { FieldAddress } from '@/types/drupal/field_type'

interface AddressBaseProps {
  address: FieldAddress
  showOrganization?: boolean
}

interface AddressPropsWithDirections extends AddressBaseProps {
  title: string
  showDirections?: true
}

interface AddressPropsWithoutDirections extends AddressBaseProps {
  title?: undefined
  showDirections: false
}

type AddressProps = AddressPropsWithDirections | AddressPropsWithoutDirections

export const Address = ({
  address,
  title,
  showOrganization = false,
  showDirections = true,
}: AddressProps) => {
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
      {showDirections && (
        <p className="vads-u-margin-bottom--0 vads-u-margin-top--0">
          <GoogleMapsDirections address={address} location={title} />
        </p>
      )}
    </>
  )
}
