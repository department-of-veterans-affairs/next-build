import { VaBanner } from '@department-of-veterans-affairs/component-library/dist/react-bindings'
import { isEmpty } from 'lodash'

const BannerComponent = ({ node }): JSX.Element => {
  if (isEmpty(node)) return

  return (
    <VaBanner
      role="va-banner"
      showClose={node.field_dismissible_option != 'perm'}
      headline={node.title}
      type={node.field_alert_type}
      visible={true}
      windowSession={node.field_dismissible_option == 'dismiss-session'}
    >
      <div dangerouslySetInnerHTML={{ __html: node.body.processed }} />
    </VaBanner>
  )
}
export default BannerComponent
