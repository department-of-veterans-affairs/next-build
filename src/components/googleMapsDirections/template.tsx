import { VaLink } from '@department-of-veterans-affairs/web-components/react-bindings/index.js'
import { FieldAddress } from '@/types/drupal/field_type'
import { addressToString } from './addressToString'

interface GoogleMapsDirectionsProps {
  address: FieldAddress
  location?: string | null
}

export const GoogleMapsDirections = ({
  address,
  location = null,
}: GoogleMapsDirectionsProps) => {
  const dest = encodeURIComponent(addressToString(address))
  const googleMapsUrl = `https://maps.google.com/?saddr=Current+Location&daddr=${dest}`

  return (
    <VaLink
      class="vads-u-display--block vads-u-margin-top--0"
      href={googleMapsUrl}
      name="maps-directions"
      text={`Get directions on Google Maps`}
      data-testid="maps-directions"
      label={location && `Get directions on Google Maps to ${location}`}
    ></VaLink>
  )
}
