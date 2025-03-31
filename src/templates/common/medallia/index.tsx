import Script from 'next/script'
import { useEffect } from 'react'
import {
  getSurveyNumber,
  loadForm,
  onMedalliaLoaded,
  setWindowVaSurvey,
} from '@/lib/utils/medallia'
import { BUILD_TYPES } from '@/lib/constants/environment'
import { recordEvent } from '@/lib/analytics/recordEvent'

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

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    const withFormContent = (acc, data) => {
      //console.log("acc.content data",data.Content);
      acc.content = data.Content
    }

    const withFeedbackUUID = (acc, data) => {
      acc.feedbackUUID = data.Feedback_UUID
    }

    const mEvent = (name, action, opts) => {
      const custom = opts.custom
      const label = opts.label

      const handle = (event) => {
        const mData = event.detail
        const eData = {
          category: 'Medallia',
          action: action,
          label: label || mData.Form_Type,
          value: mData.Form_ID,
          myParams: {},
        }
        if (custom) {
          let i
          for (i = 0; i < custom.length; i++) custom[i](eData.myParams, mData)
        }
        const end = +new Date()
        recordEvent({
          event: eData.action,
          'survey-tool': eData.category,
          'survey-form-id': eData.value,
          'survey-status': eData.label,
          'survey-details': eData.myParams,
        })
      }
      window.addEventListener('MDigital_' + name, handle, { signal })
    }
    mEvent('ShowForm_Called', 'survey-show-form-call', {})
    mEvent('Form_Displayed', 'survey-start-form', {})
    mEvent('Form_Next_Page', 'survey-next-click', {})
    mEvent('Form_Back_Page', 'survey-back-click', {})
    mEvent('Form_Close_Submitted', 'survey-submit-close', {})
    mEvent('Form_Close_No_Submit', 'survey-no-submit-close', {})
    mEvent('Feedback_Submit', 'survey-submit', {
      custom: [withFeedbackUUID, withFormContent],
    })
    mEvent('Submit_Feedback', 'survey--submission', {
      custom: [withFeedbackUUID, withFormContent],
    })
    mEvent('Feedback_Button_Clicked', 'survey-button-click', {
      custom: [withFeedbackUUID],
    })
    mEvent('ThankYou_Displayed', 'survey--submission-successful', {
      custom: [withFeedbackUUID, withFormContent],
    })
    mEvent('Invite_Displayed', 'survey-invitation-display', {
      label: 'Invite',
    })
    mEvent('Invite_Accepted', 'survey-invitation-accept', {
      label: 'Invite',
    })
    mEvent('Invite_Declined', 'survey-invitation-decline', {
      label: 'Invite',
    })
    mEvent('Invite_Skipped', 'survey-invitation-skip', {
      label: 'Invite',
    })
    return () => {
      controller.abort()
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
