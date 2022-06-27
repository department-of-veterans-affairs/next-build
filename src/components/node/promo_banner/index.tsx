import { VaPromoBanner } from '@department-of-veterans-affairs/component-library/dist/react-bindings'
import { isEmpty } from 'lodash'

const PromoBannerComponent = ({ node }): JSX.Element => {
  if (isEmpty(node)) return

  return (
    <VaPromoBanner
      role="va-promoBanner"
      href={node.field_link.uri}
      type={node.field_promo_type}
    >
      {node.title}
    </VaPromoBanner>
  )
}
export default PromoBannerComponent
