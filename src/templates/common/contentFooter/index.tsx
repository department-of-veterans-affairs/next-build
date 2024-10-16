import React, { useEffect, useState } from 'react'
import { parseDate, getDateParts } from '@/lib/utils/date'
import { MedalliaAssets } from '@/templates/common/medallia'
import { getSurveyNumber, showForm } from '@/lib/utils/medallia'
import { BUILD_TYPES } from '@/lib/constants/environment'

// "Back to top", "Last updated" date and Medallia feedback button

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
      <va-button
        label="Give feedback"
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
        text="Feedback"
      />
    </>
  )
}

export function ContentFooter({ lastUpdated }: ContentFooterProps) {
  const [isDesktop, setIsDesktop] = useState(true)
  let displayDate, machineDate, wrapperClasses
  const date = parseDate(lastUpdated)

  if (date) {
    displayDate = formatDate(date, 'display')
    machineDate = formatDate(date, 'machine')
  }

  useEffect(() => {
    if (window && window?.innerWidth < 768) {
      setIsDesktop(false)
    } else {
      setIsDesktop(true)
    }
  }, [])

  if (isDesktop) {
    wrapperClasses = 'vads-u-display--none medium-screen:vads-u-display--block'
  } else {
    wrapperClasses = 'medium-screen:vads-u-display--none'
  }

  return (
    <div
      className={`last-updated usa-content vads-u-padding-x--1 desktop-lg:vads-u-padding-x--0 ${wrapperClasses}`}
      data-next-component="templates/common/contentFooter"
    >
      <div className="mobile-lg:vads-u-display--flex above-footer-elements-container">
        {(displayDate && machineDate) && (
          <div className="vads-u-flex--auto">
            <span className="vads-u-text-align--justify">
              <p>Last updated:&nbsp;
                <time dateTime={machineDate}>{displayDate}</time>
              </p>
            </span>
          </div>
        )}
        <div className="vads-u-flex--1 vads-u-text-align--right">
          <FeedbackButton />
        </div>
      </div>
    </div>
  )
}
