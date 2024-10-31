export const GoogleMapsDirections = ({ title, address }) => {
  const googleMapsUrl = `https://maps.google.com?saddr=Current+Location&daddr=${encodeURIComponent(
    address
  )}`

  return (
    <va-link
      class="vads-u-display--block vads-u-margin-top--0"
      href={googleMapsUrl}
      name="maps-directions"
      id="google-map-directions"
      text={`Get directions on Google Maps`}
      data-testid="maps-directions"
    ></va-link>
  )
}
