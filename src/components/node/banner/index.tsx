import { VaBanner } from '@department-of-veterans-affairs/web-components/react-bindings'
import { isEmpty } from 'lodash'

const BannerComponent = ({ node }): JSX.Element => {
  if (isEmpty(node)) return

  return (
    <>
      <VaBanner
        headline={node.title}
        showClose={node.field_dismissible_option != 'perm'}
        type={node.field_alert_type}
        visible="true"
        windowSession={node.field_dismissible_option == 'dismiss-session'}
      >
        <div dangerouslySetInnerHTML={{ __html: node.body.processed }} />
      </VaBanner>
    </>
  )
}
export default BannerComponent
