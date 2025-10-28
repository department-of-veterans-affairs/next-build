import { VaPromoBanner } from '@department-of-veterans-affairs/web-components/react-bindings/index.js'
import { PromoBanner as FormattedPromoBanner } from '@/components/banner/formatted-type'

export const PromoBanner = ({
  id,
  href,
  title,
  alertType,
}: FormattedPromoBanner): React.JSX.Element => {
  return (
    <VaPromoBanner
      id={id}
      href={href}
      type={alertType as 'news' | 'announcement' | 'email-signup'}
      data-testid="promo-banner"
    >
      {title}
    </VaPromoBanner>
  )
}
