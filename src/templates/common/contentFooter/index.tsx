import React from 'react'
import { parseDate, getDateParts } from '@/lib/utils/date'
import { MedalliaAssets } from '@/templates/globals/medallia'
import { getSurveyNumber, showForm } from '@/lib/utils/medallia'
import { environments } from '@/lib/constants/environment'

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
  return (
    <>
      <MedalliaAssets />
      <button
        type="button"
        className="feedback-button usa-button"
        id="mdFormButton"
        aria-label="give feedback"
        onClick={() => {
          const isProduction =
            process.env.NEXT_PUBLIC_BUILD_TYPE === environments.PROD
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
      <div className="last-updated usa-content vads-u-padding-x--1 large-screen:vads-u-padding-x--0">
        <div className="small-screen:vads-u-display--flex above-footer-elements-container">
          <div className="vads-u-flex--auto">
            <span className="vads-u-text-align--justify">
              <p>
                {displayDate && (
                  <>
                    Last updated:{' '}
                    <time dateTime={machineDate}>{displayDate}</time>
                  </>
                )}
              </p>
            </span>
          </div>
          <div className="vads-u-flex--1 vads-u-text-align--right">
            <span className="vads-u-text-align--right">
              <FeedbackButton />
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
