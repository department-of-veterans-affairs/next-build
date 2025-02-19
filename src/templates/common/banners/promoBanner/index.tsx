import { VaPromoBanner } from '@department-of-veterans-affairs/component-library/dist/react-bindings'
import { PromoBanner as FormattedPromoBanner } from '@/types/formatted/banners'

export const PromoBanner = ({
  id,
  href,
  title,
  alertType,
}: FormattedPromoBanner): JSX.Element => {
  return (
    <VaPromoBanner
      id={id}
      href={href}
      type={alertType}
      data-testid="promo-banner"
    >
      {title}
    </VaPromoBanner>
  )
}
