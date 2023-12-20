import { useRef, useEffect, useState } from 'react'
import { recordEvent } from '@/lib/analytics/recordEvent'
// import { regionBaseURL } from '@/lib/utils/helpers'
import { VaBanner } from '@department-of-veterans-affairs/component-library/dist/react-bindings'
import { FacilityBanner as FormattedFacilityBanner } from '@/types/dataTypes/formatted/banners'

export const FacilityBanner = ({
  id,
  title,
  body,
  path,
  fieldAlertType,
  findFacilities,
  operatingStatus,
  inheritanceSubpages,
  bannerAlertVamcs,
  dismiss,
}: FormattedFacilityBanner): JSX.Element => {
  const [isClicked, setIsClicked] = useState(false)
  const [outputStatus, setOutputStatus] = useState(true)
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

  // const findPath = path
  // const hideOnSubpages = inheritanceSubpages
  const alertType = fieldAlertType === 'information' ? 'info' : fieldAlertType

  // const region = '/' + regionBaseURL(findPath)
  // const lastArg = findPath?.substring(findPath?.lastIndexOf('/'))

  let content = body
  const statusUrl = ''

  // if (bannerAlertVamcs) {
  //   bannerAlertVamcs?.map((vamc) => {
  //     if (region == vamc?.office?.path) {
  //       setOutputStatus(true)
  //       return outputStatus
  //     }
  //     if (
  //       hideOnSubpages &&
  //       lastArg != region &&
  //       lastArg != '/operating-status'
  //     ) {
  //       setOutputStatus(false)
  //       return outputStatus
  //     }
  //     statusUrl = vamc?.path
  //   })
  // }

  if (operatingStatus && statusUrl?.length) {
    content += `<p>
          <a href='${statusUrl}'>
            Get updates on affected services and facilities
          </a>
      </p>`
  }

  if (findFacilities) {
    content += `
      <p>
        <a href="/find-locations">Find other VA facilities near you</a>
      </p>`
  }

  if (isClicked) {
    let eventData = {}

    if (operatingStatus && statusUrl?.length) {
      eventData = {
        event: 'nav-warning-alert-box-content-link-click',
        alertBoxHeading: `${title}`,
      }
    } else {
      eventData = {
        event: 'nav-alert-box-link-click',
        'alert-box-status': alertType,
        'alert-box-headline': title,
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
    <>
      {outputStatus && (
        <VaBanner
          id={id}
          role="region"
          showClose={dismiss}
          headline={title}
          type={alertType}
          visible={true}
          windowSession={dismiss === true ? 'dismiss-session' : null}
        >
          <div
            ref={analyticsRef}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </VaBanner>
      )}
    </>
  )
}
