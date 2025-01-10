import Script from 'next/script'
import { useEffect } from 'react'
import {
  getSurveyNumber,
  loadForm,
  onMedalliaLoaded,
  setWindowVaSurvey,
} from '@/lib/utils/medallia'
import { BUILD_TYPES } from '@/lib/constants/environment'

export function MedalliaAssets() {
  const scriptId =
    process.env.NEXT_PUBLIC_BUILD_TYPE === BUILD_TYPES.PROD ? 2 : 5

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_BUILD_TYPE === BUILD_TYPES.LOCAL) {
      onMedalliaLoaded(() => {
        const surveyNumber = getSurveyNumber(window.location.pathname, false)
        const neb_status = loadForm(surveyNumber)
        if (neb_status === true) {
          /*eslint-disable-next-line*/
          console.log(`survey number ${surveyNumber} has loaded`)
        }
      })
    }

    const isVamcPage = window.location.pathname.includes('health-care')
    if (isVamcPage) {
      setWindowVaSurvey('mcenter')
    }
  }, [])

  return (
    <Script
      id="medallia"
      src={`https://resource.digital.voice.va.gov/wdcvoice/${scriptId}/onsite/embed.js`}
      strategy="afterInteractive"
    />
  )
}
