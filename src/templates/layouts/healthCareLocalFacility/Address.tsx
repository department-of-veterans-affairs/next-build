import { GoogleMapsDirections } from '@/templates/common/googleMapsDirections'

export const Address = ({
  address,
  title,
}: {
  address: {
    address_line1: string
    address_line2: string
    locality: string
    administrative_area: string
    postal_code: string
  }
  title: string
}) => {
  const directionsString = [
    address?.address_line1,
    address?.locality,
    address?.administrative_area,
  ]
  return (
    <div className="vads-u-margin-bottom--3">
      <address>
        <p>{address.address_line1}</p>
        {address.address_line2 && <p>{address.address_line2}</p>}
        <p>{`${address.locality}, ${address.administrative_area} ${address.postal_code}`}</p>
      </address>
      <GoogleMapsDirections address={directionsString} location={title} />
    </div>
  )
}
