import React from 'react'
import { MedalliaAssets } from '@/templates/common/medallia'
import { getSurveyNumber, showForm } from '@/lib/utils/medallia'
import { BUILD_TYPES } from '@/lib/constants/environment'
import { format } from 'date-fns'

// "Back to top", "Last updated" date and Medallia feedback button

type ContentFooterProps = {
  lastUpdated?: string | number
  // responsiveLayout should be passed by the "landing_page" content type only
  responsiveLayout?: string
}

export function ContentFooter({
  lastUpdated,
  responsiveLayout,
}: ContentFooterProps) {
  let wrapperClasses = ''

  if (responsiveLayout === 'desktop') {
    wrapperClasses = ' vads-u-display--none tablet:vads-u-display--block'
  } else if (responsiveLayout === 'mobile') {
    wrapperClasses = 'tablet:vads-u-display--none'
  }

  return (
    <div className={`last-updated ${wrapperClasses}`}>
      <div className="mobile-lg:vads-u-display--flex above-footer-elements-container">
        {lastUpdated && (
          <div className="vads-u-flex--auto">
            <span className="vads-u-text-align--justify">
              <p>
                Last updated:&nbsp;
                <time dateTime={format(lastUpdated, 'yyyy-MM-dd')}>
                  {format(lastUpdated, 'MMMM d, yyyy')}
                </time>
              </p>
            </span>
          </div>
        )}
        <div className="vads-u-flex--1 vads-u-text-align--right">
          <MedalliaAssets />
          <va-button
            label="Give feedback"
            id="mdFormButton"
            disable-analytics
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
