import Head from 'next/head'
import { useEffect } from 'react'
import {
  getSurveyNumber,
  loadForm,
  onMedalliaLoaded,
  setWindowVaSurvey,
} from '@/lib/utils/medallia'

export function MedalliaAssets() {
  const scriptId = process.env.BUILD_TYPE === 'production' ? 2 : 5

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_BUILD_TYPE === 'localhost') {
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
    <Head>
      <script
        defer
        type="text/javascript"
        src={`https://resource.digital.voice.va.gov/wdcvoice/${scriptId}/onsite/embed.js`}
        async
      ></script>
    </Head>
  )
}
