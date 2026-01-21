'use client'
// Note that right now `<VaPromoBanner>` is an old class component, which needs to be wrapped in a client component.

import { VaPromoBanner } from '@department-of-veterans-affairs/component-library/dist/react-bindings'
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
      type={alertType}
      data-testid="promo-banner"
    >
      {title}
    </VaPromoBanner>
  )
}
