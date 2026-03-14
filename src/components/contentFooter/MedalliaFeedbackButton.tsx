'use client'

import { MedalliaAssets } from '@/components/medallia/template'
import { openFeedbackForm } from '@/lib/utils/medallia'

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
        onClick={openFeedbackForm}
        text="Feedback"
      />
    </div>
  )
}
