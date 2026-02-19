'use client'

import { MedalliaAssets } from '@/components/medallia/template'
import { getSurveyNumber, showForm } from '@/lib/utils/medallia'
import { BUILD_TYPES } from '@/lib/constants/environment'

/**
 * Client component for Medallia feedback button.
 * Extracted from ContentFooter to allow ContentFooter to be a server component.
 */
export function MedalliaFeedbackButton() {
  return (
    <div className="vads-u-flex--1 vads-u-text-align--right">
      <MedalliaAssets />
      <va-button
        id="mdFormButton"
        disable-analytics
        secondary
        className="vads-u-background-color--white"
        onClick={() => {
          // Use window.location.pathname instead of usePathname() to avoid issues during static export
          const pathname =
            typeof window !== 'undefined' ? window.location.pathname : ''
          const isProduction =
            process.env.NEXT_PUBLIC_BUILD_TYPE === BUILD_TYPES.PROD
          const surveyNumber = getSurveyNumber(pathname, isProduction)
          showForm(surveyNumber)
        }}
        text="Feedback"
      />
    </div>
  )
}
