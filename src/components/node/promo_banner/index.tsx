import PromoBanner from '@department-of-veterans-affairs/component-library/PromoBanner'
import { isEmpty } from 'lodash'

const PromoBannerComponent = ({ node }): JSX.Element => {
  if (isEmpty(node)) return

  return (
    <>
      <PromoBanner
        aria-label={node.title}
        role="region"
        href={node.field_link.url.path}
        type={node.field_promo_type}
      >
        {node.title}
      </PromoBanner>
    </>
  )
}
export default PromoBannerComponent
