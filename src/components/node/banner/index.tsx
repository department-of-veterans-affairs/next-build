import { useRef, useEffect, useState } from 'react'
import { VaBanner } from '@department-of-veterans-affairs/component-library/dist/react-bindings'
import { isEmpty } from 'lodash'
import { recordEvent } from '@/utils/recordEvent'
import { NodeMetaInfo, NodeResourceType } from '@/types/node'

const BannerComponent = ({ node }): JSX.Element => {
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

  if (isClicked) {
    recordEvent({
      eventCategory: 'Banner',
      eventAction: 'Click',
      eventLabel: node.title,
    })
  }

  if (isEmpty(node)) return

  return (
    <VaBanner
      id={node.id}
      role="va-banner"
      showClose={node.field_dismissible_option != 'perm'}
      headline={node.title}
      type={node.field_alert_type}
      visible={true}
      windowSession={node.field_dismissible_option == 'dismiss-session'}
    >
      <div
        ref={analyticsRef}
        dangerouslySetInnerHTML={{ __html: node?.body?.processed }}
      />
    </VaBanner>
  )
}
export default BannerComponent

export const Meta: NodeMetaInfo = {
  resource: NodeResourceType.Banner,
  component: BannerComponent,
  params: null,
  collection: true,
}
