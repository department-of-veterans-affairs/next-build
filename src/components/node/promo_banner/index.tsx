import { VaPromoBanner } from '@department-of-veterans-affairs/web-components/react-bindings'
import { isEmpty } from 'lodash'

const PromoBannerComponent = ({ node }): JSX.Element => {
  if (isEmpty(node)) return

  return (
    <VaPromoBanner
      role="va-promoBanner"
      text={node.title}
      href={node.field_link.uri}
      type={node.field_promo_type}
    >
      {node.title}
    </VaPromoBanner>
  )
}
export default PromoBannerComponent
