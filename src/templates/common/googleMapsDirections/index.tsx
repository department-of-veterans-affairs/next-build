

export const GoogleMapsDirections = ({
  title,
  address,
}) => {
  const googleMapsUrl = `https://maps.google.com?saddr=Current+Location&daddr=${encodeURIComponent(address)}`;


  return (
    <div>
      <a
        href={googleMapsUrl}
      >
        Get directions on Google Maps
        <span className="sr-only">to {title}</span>
      </a>
    </div>
  )
}