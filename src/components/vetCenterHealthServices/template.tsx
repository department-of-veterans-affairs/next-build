import ServicesList from '@/components/vetCenterHealthServicesList/template'
import { VetCenterHealthServices as FormattedHealthServices } from '@/components/vetCenterHealthServices/formatted-type'

interface HealthServicesProps {
  services: FormattedHealthServices
  typeOfCare: string
}

const headingsMap = {
  counseling: 'Counseling services',
  referral: 'Referral services',
  default: 'Other services',
}

function HealthServices({ services, typeOfCare }: HealthServicesProps) {
  if (!services.length) return null

  const heading = headingsMap[typeOfCare] || headingsMap.default

  return (
    <>
      <h2
        id={typeOfCare}
        className="vads-u-margin-top--0 vads-u-font-size--lg
          mobile-lg:vads-u-font-size--xl vads-u-margin-bottom--2"
      >
        {heading}
      </h2>
      <p>Select a topic to learn more.</p>
      <ServicesList services={services} />
    </>
  )
}

export default HealthServices
