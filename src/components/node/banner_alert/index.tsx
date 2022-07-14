import Link from 'next/link'
import { isEmpty } from 'lodash'
import { recordEvent } from '@/utils/recordEvent'
import {
  drupalToVaPath,
  phoneLinks,
  regionBaseURL,
  trackLinks,
} from '@/utils/helpers'
import { VaBanner } from '@department-of-veterans-affairs/component-library/dist/react-bindings'

const BannerAlert = ({ node }): JSX.Element => {
  if (isEmpty(node)) return

  const hideOnSubpages = node.field_alert_inheritance_subpages
  const alertType =
    node.field_alert_type === 'information' ? 'info' : node.field_alert_type
  const region = '/' + regionBaseURL(node.path.alias)
  const lastArg = node.path.alias.substring(node.path.alias.lastIndexOf('/'))
  // const emailUpdates = ''
  const eventData = {
    event: 'nav-alert-box-link-click',
    'alert-box-status': alertType,
    'alert-box-headline': node.title,
    'alert-box-headline-level': '3',
    'alert-box-background-only': 'false',
    'alert-box-closeable': 'false',
  }
  let body = trackLinks(node.field_body.processed, eventData)
  let outputStatus = true //This needs to be false
  let statusUrl = ''

  node.field_banner_alert_vamcs.map((vamcs) => {
    if (region == vamcs.field_office.path.alias) {
      outputStatus = true
    }
    if (hideOnSubpages && lastArg != region && lastArg != '/operating-status') {
      outputStatus = false
    }
    // emailUpdates = vamcs.field_office.field_email_updates_link
    statusUrl = vamcs.path.alias
  })

  function createMarkup() {
    const analytic = {
      event: 'nav-warning-alert-box-content-link-click',
      alertBoxHeading: `${node.title}`,
    }

    const content = (
      <>
        {/*<div dangerouslySetInnerHTML={{ __html: body }} />*/}
        {node.field_alert_operating_status_cta && statusUrl.length && (
          <p>
            <Link href={statusUrl}>
              <a onClick={() => recordEvent(JSON.stringify(analytic))}>
                Get updates on affected services and facilities
              </a>
            </Link>
          </p>
        )}
      </>
    )

    return {
      __html: content,
    }
  }

  if (node.field_alert_find_facilities_cta) {
    body += `
      <p>
        <Link href="/find-locations">Find other VA facilities near you</Link>
      </p>`
  }

  return (
    <VaBanner
      id={node.id}
      role="va-banner"
      showClose={node.field_alert_dismissable}
      headline={node.title}
      type={node.field_alert_type}
      visible={outputStatus}
      windowSession={node.field_alert_dismissable == 'dismiss-session'}
    >
      <div dangerouslySetInnerHTML={createMarkup()} />
    </VaBanner>
  )
}
export default BannerAlert
