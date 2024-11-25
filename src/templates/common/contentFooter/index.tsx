import React, { useEffect } from 'react'
import { parseDate, getDateParts } from '@/lib/utils/date'
import { MedalliaAssets } from '@/templates/common/medallia'
import { getSurveyNumber, showForm } from '@/lib/utils/medallia'
import { BUILD_TYPES } from '@/lib/constants/environment'

// "Back to top", "Last updated" date and Medallia feedback button

type ContentFooterProps = {
  lastUpdated?: string | number
  // responsiveLayout should be passed by the "landing_page" content type only
  responsiveLayout?: string
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

export function ContentFooter({
  lastUpdated,
  responsiveLayout,
}: ContentFooterProps) {
  let displayDate, machineDate
  let wrapperClasses = ''
  const date = parseDate(lastUpdated)

  if (date) {
    displayDate = formatDate(date, 'display')
    machineDate = formatDate(date, 'machine')
  }

  if (responsiveLayout === 'desktop') {
    wrapperClasses = ' vads-u-display--none medium-screen:vads-u-display--block'
  } else if (responsiveLayout === 'mobile') {
    wrapperClasses = ' medium-screen:vads-u-display--none'
  }

  return (
    <div
      className={`last-updated usa-content vads-u-padding-x--1 desktop-lg:vads-u-padding-x--0${wrapperClasses}`}
    >
      <div className="mobile-lg:vads-u-display--flex above-footer-elements-container">
        {displayDate && machineDate && (
          <div className="vads-u-flex--auto">
            <span className="vads-u-text-align--justify">
              <p>
                Last updated:&nbsp;
                <time dateTime={machineDate}>{displayDate}</time>
              </p>
            </span>
          </div>
        )}
        <div className="vads-u-flex--1 vads-u-text-align--right">
          <MedalliaAssets />
          <va-button
            label="Give feedback"
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
        </div>
      </div>
    </div>
  )
}
