import React, { useEffect } from 'react'
import { parseDate, getDateParts } from '@/lib/utils/date'
import { MedalliaAssets } from '@/templates/common/medallia'
import { getSurveyNumber, showForm } from '@/lib/utils/medallia'
import { BUILD_TYPES } from '@/lib/constants/environment'

type ContentFooterProps = {
  lastUpdated?: string | number
}

function formatDate(date: Date, format: 'display' | 'machine'): string {
  const dateParts = getDateParts(date)
  if (format === 'display') {
    const month = dateParts.month?.name
    const day = dateParts.day?.numeric
    const year = dateParts.year?.numeric

    if (month && day && year) {
      return `${month} ${day}, ${year}`
    }

    return null
  } else {
    const month = dateParts.month?.twoDigit
    const day = dateParts.day?.twoDigit
    const year = dateParts.year?.numeric

    if (month && day && year) {
      return `${year}-${month}-${day}`
    }

    return null
  }
}

function FeedbackButton() {
  useEffect(() => {
    const vaButton = document.getElementById('mdFormButton') as HTMLElement & {
      shadowRoot?: ShadowRoot
    }
    if (vaButton && vaButton.shadowRoot) {
      const shadowRoot = vaButton.shadowRoot

      // Create a new observer
      const observer = new MutationObserver(() => {
        const button = shadowRoot.querySelector(
          '.usa-button'
        ) as HTMLButtonElement
        if (button) {
          button.classList.add('feedback-button')
          observer.disconnect() // Stop observing once we've found the button and added the class
        }
      })

      // Start observing the shadow root with the configured parameters
      observer.observe(shadowRoot, { childList: true, subtree: true })
    }
  }, [])
  return (
    <>
      <MedalliaAssets />
      <button
        className="feedback-button usa-button"
        id="mdFormButton"
        onClick={() => {
          const isProduction =
            process.env.NEXT_PUBLIC_BUILD_TYPE === BUILD_TYPES.PROD
          const surveyNumber = getSurveyNumber(
            window.location.pathname,
            isProduction
          )
          showForm(surveyNumber)
        }}
      >
        Feedback
      </button>
    </>
  )
}

export function ContentFooter({ lastUpdated }: ContentFooterProps) {
  let displayDate, machineDate
  const date = parseDate(lastUpdated)
  if (date) {
    displayDate = formatDate(date, 'display')
    machineDate = formatDate(date, 'machine')
  }

  return (
    <>
      <div className="last-updated vads-u-padding-x--1 desktop-lg:vads-u-padding-x--0">
        {displayDate && (
          <div className="mobile-lg:vads-u-display--flex above-footer-elements-container">
            <div className="vads-u-flex--auto">
              <span className="vads-u-text-align--justify">
                <p>
                  <>
                    Last updated:{' '}
                    <time dateTime={machineDate}>{displayDate}</time>
                  </>
                </p>
              </span>
            </div>
            <div className="vads-u-flex--1 vads-u-text-align--right">
              <span className="vads-u-text-align--right">
                <FeedbackButton />
              </span>
            </div>
          </div>
        )}
        {!displayDate && (
          <div className="vads-u-display--flex above-footer-elements-container">
            <div className="vads-u-flex--1 vads-u-text-align--right">
              <span className="vads-u-text-align--right">
                <FeedbackButton />
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
