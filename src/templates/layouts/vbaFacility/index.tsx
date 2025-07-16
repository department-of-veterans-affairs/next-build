type VbaFacilityProps = {
  title: string
}

export function VbaFacility({ title }: VbaFacilityProps) {
  return (
    <div>
      <p>{title}</p>
    </div>
  )
}
