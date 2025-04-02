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
    const mEvent = ({
      name,
      action,
      feedbackUUID = false,
      formContent = false,
      label = '',
    }) => {
      const handle = (event) => {
        const mData = event.detail
        const eData = {
          category: 'Medallia',
          action: action,
          label: label || mData.Form_Type,
          value: mData.Form_ID,
          myParams: {} as { feedbackUUID?: string; content?: string },
        }
        if (feedbackUUID) {
          eData.myParams.feedbackUUID = mData.Feedback_UUID
        }
        if (formContent) {
          eData.myParams.content = mData.Content
        }
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
    mEvent({ name: 'ShowForm_Called', action: 'survey-show-form-call' })
    mEvent({ name: 'Form_Displayed', action: 'survey-start-form' })
    mEvent({ name: 'Form_Next_Page', action: 'survey-next-click' })
    mEvent({ name: 'Form_Back_Page', action: 'survey-back-click' })
    mEvent({ name: 'Form_Close_Submitted', action: 'survey-submit-close' })
    mEvent({ name: 'Form_Close_No_Submit', action: 'survey-no-submit-close' })
    mEvent({
      name: 'Feedback_Submit',
      action: 'survey-submit',
      feedbackUUID: true,
      formContent: true,
    })
    mEvent({
      name: 'Submit_Feedback',
      action: 'survey--submission',
      feedbackUUID: true,
      formContent: true,
    })
    mEvent({
      name: 'Feedback_Button_Clicked',
      action: 'survey-button-click',
      feedbackUUID: true,
    })
    mEvent({
      name: 'ThankYou_Displayed',
      action: 'survey--submission-successful',
      feedbackUUID: true,
      formContent: true,
    })
    mEvent({
      name: 'Invite_Displayed',
      action: 'survey-invitation-display',
      label: 'Invite',
    })
    mEvent({
      name: 'Invite_Accepted',
      action: 'survey-invitation-accept',
      label: 'Invite',
    })
    mEvent({
      name: 'Invite_Declined',
      action: 'survey-invitation-decline',
      label: 'Invite',
    })
    mEvent({
      name: 'Invite_Skipped',
      action: 'survey-invitation-skip',
      label: 'Invite',
    })
    return () => {
      /**
       * Cleanup function to remove the event listeners. controller.abort() is called to abort any ongoing requests and prevent memory leaks.
       * https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal#events
       */
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
