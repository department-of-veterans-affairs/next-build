import ServicesList from '../servicesList'
import { HealthServices as FormattedHealthServices } from '@/types/formatted/healthServices'

interface HealthServicesProps {
  services: FormattedHealthServices
  typeOfCare: string
}

const headingsMap = {
  counseling: 'Counseling Services',
  referral: 'Referral Services',
  default: 'Other Services',
}

function HealthServices({ services, typeOfCare }: HealthServicesProps) {
  if (!services.length) return null

  const heading = headingsMap[typeOfCare] || headingsMap.default

  return (
    <>
      <h2
        id={typeOfCare}
        className="vads-u-margin-top--0 vads-u-font-size--lg mobile-lg:vads-u-font-size--xl vads-u-margin-bottom--2"
      >
        {heading}
      </h2>
      <p>Click on a service for more details.</p>
      <ServicesList services={services} />
    </>
  )
}

export default HealthServices
