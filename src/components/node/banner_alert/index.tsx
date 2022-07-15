import { isEmpty } from 'lodash'
import { useRef, useEffect, useState } from 'react'
import { recordEvent } from '@/utils/recordEvent'
import { regionBaseURL, trackLinks } from '@/utils/helpers'
import { VaBanner } from '@department-of-veterans-affairs/component-library/dist/react-bindings'

const BannerAlert = ({ node }): JSX.Element => {
  const [isClicked, setIsClicked] = useState(false)
  const analyticsRef = useRef(null)

  useEffect(() => {
    function handler(event) {
      if (analyticsRef.current?.contains(event.target)) {
        setIsClicked(true)
      }
    }
    window.addEventListener('click', handler)
    return () => window.removeEventListener('click', handler)
  }, [])

  if (isEmpty(node)) return

  const hideOnSubpages = node.field_alert_inheritance_subpages
  const alertType =
    node.field_alert_type === 'information' ? 'info' : node.field_alert_type
  const region = '/' + regionBaseURL(node.path.alias)
  const lastArg = node.path.alias.substring(node.path.alias.lastIndexOf('/'))
  const eventData = {
    event: 'nav-alert-box-link-click',
    'alert-box-status': alertType,
    'alert-box-headline': node.title,
    'alert-box-headline-level': '3',
    'alert-box-background-only': 'false',
    'alert-box-closeable': 'false',
  }
  // const emailUpdates = ''
  let body = trackLinks(node.field_body.processed, eventData)
  let outputStatus = true //This needs to be false
  let statusUrl = ''

  if (isClicked) {
    recordEvent({
      eventCategory: 'Banner',
      eventAction: 'View',
      eventLabel: node.title,
    })
  }

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

  if (node.field_alert_operating_status_cta && statusUrl.length) {
    const analytic = {
      event: 'nav-warning-alert-box-content-link-click',
      alertBoxHeading: `${node.title}`,
    }

    body += `<p>
          <a href='${statusUrl}' onClick='recordEvent(${JSON.stringify(
      analytic
    )})'>
            Get updates on affected services and facilities
          </a>
      </p>`
  }

  // fieldAlertEmailUpdatesButton logic goes here if applicable

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
      <div ref={analyticsRef} dangerouslySetInnerHTML={{ __html: body }} />
    </VaBanner>
  )
}
export default BannerAlert