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
      data-next-component="templates/common/banners/promoBanner"
      id={id}
      role="region"
      href={href}
      type={alertType}
    >
      {title}
    </VaPromoBanner>
  )
}
