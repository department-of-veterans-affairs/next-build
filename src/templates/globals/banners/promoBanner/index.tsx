import { VaPromoBanner } from '@department-of-veterans-affairs/component-library/dist/react-bindings'
import { PromoBannerType } from '@/types/index'

export const PromoBanner = ({
  id,
  href,
  title,
  alertType,
}: PromoBannerType): JSX.Element => {
  return (
    <VaPromoBanner id={id} role="region" href={href} type={alertType}>
      {title}
    </VaPromoBanner>
  )
}
