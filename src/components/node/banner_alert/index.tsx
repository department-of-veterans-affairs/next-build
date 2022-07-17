import { isEmpty } from 'lodash'
import { useRef, useEffect, useState } from 'react'
import { recordEvent } from '@/utils/recordEvent'
import { regionBaseURL } from '@/utils/helpers'
import { VaBanner } from '@department-of-veterans-affairs/component-library/dist/react-bindings'
import { NodeResourceType, NodeMetaInfo } from '@/types/node'

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

  let body = node.field_body.processed
  let outputStatus = false
  let statusUrl = ''

  node.field_banner_alert_vamcs?.map((vamcs) => {
    if (region == vamcs.field_office.path.alias) {
      outputStatus = true
    }
    if (hideOnSubpages && lastArg != region && lastArg != '/operating-status') {
      outputStatus = false
    }
    statusUrl = vamcs.path.alias
  })

  if (node.field_alert_operating_status_cta && statusUrl.length) {
    body += `<p>
          <a href='${statusUrl}'>
            Get updates on affected services and facilities
          </a>
      </p>`
  }

  if (node.field_alert_find_facilities_cta) {
    body += `
      <p>
        <a href="/find-locations">Find other VA facilities near you</a>
      </p>`
  }

  if (isClicked) {
    let eventData = {}

    if (node.field_alert_operating_status_cta && statusUrl.length) {
      eventData = {
        event: 'nav-warning-alert-box-content-link-click',
        alertBoxHeading: `${node.title}`,
      }
    } else {
      eventData = {
        event: 'nav-alert-box-link-click',
        'alert-box-status': alertType,
        'alert-box-headline': node.title,
        'alert-box-headline-level': '3',
        'alert-box-background-only': 'false',
        'alert-box-closeable': 'false',
        'alert-box-click-label': '$2',
      }
    }
    recordEvent(eventData)
    setIsClicked(false)
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

/** Export information necessary to identify the component and query it.
 * See {@link NodeMetaInfo}
 */
export const Meta: NodeMetaInfo = {
  resource: NodeResourceType.BannerAlert,
  component: BannerAlert,
  params: null,
}

export default BannerAlert
