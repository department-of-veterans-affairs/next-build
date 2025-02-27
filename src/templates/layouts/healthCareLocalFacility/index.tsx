type HealthCareLocalFacilityProps = {
  title: string
}

export function HealthCareLocalFacility({
  title,
}: HealthCareLocalFacilityProps) {
  return (
    <div>
      <p>{title}</p>
    </div>
  )
}
