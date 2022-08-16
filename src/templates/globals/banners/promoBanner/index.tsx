import { VaPromoBanner } from '@department-of-veterans-affairs/component-library/dist/react-bindings'

export interface PromoBannerProps {
  id: string
  title: string
  href?: string
  alertType?: string
  type?: string
}

export const PromoBanner = ({ id, href, title, alertType }): JSX.Element => {
  return (
    <VaPromoBanner
      id={id}
      role="va-promoBanner"
      href={href}
      alertType={alertType}
    >
      {title}
    </VaPromoBanner>
  )
}
