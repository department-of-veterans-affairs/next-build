type VamcOperatingStatusAndAlertsProps = {
  title: string
}

export function VamcOperatingStatusAndAlerts({
  title,
}: VamcOperatingStatusAndAlertsProps) {
  return (
    <div>
      <p>{title}</p>
    </div>
  )
}
