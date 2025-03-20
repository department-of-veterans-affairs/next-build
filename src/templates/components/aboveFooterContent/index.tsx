import { MedalliaAssets } from '@/templates/common/medallia'
import { HumanizedDate } from '../humanizedDate'
import { FeedbackButton } from '../feedbackButton'
import { getSurveyNumber } from '@/lib/utils/medallia'

export function AboveFooterContent({
  changed,
  gitLastupdate,
  lastUpdated,
  // Medallia
  includeFeedbackButton,
  path,
  responsiveType = 'mobile',
}: {
  changed?: number
  gitLastupdate?: string
  lastUpdated?: string
  // Medallia
  includeFeedbackButton?: boolean
  path?: string
  responsiveType?: 'mobile' | 'desktop'
}) {
  const classes = [
    'last-updated',
    'usa-content',
    'vads-u-padding-x--1',
    'desktop-lg:vads-u-padding-x--0',
  ]
  if (responsiveType === 'mobile') {
    classes.push('vads-u-display--none', 'medium-screen:vads-u-display--block')
  } else {
    classes.push('medium-screen:vads-u-display--none')
  }
  let useString: boolean | undefined = undefined
  if (lastUpdated) {
    useString = true
  } else if (changed) {
    useString = false
  } else if (gitLastupdate) {
    useString = true
  }
  if (!includeFeedbackButton && useString === undefined) {
    return null
  }
  return (
    <div data-testid="above-footer-container" className={classes.join(' ')}>
      <div className="mobile-lg:vads-u-display--flex above-footer-elements-container">
        {useString !== undefined && (
          <div className="vads-u-flex--auto" data-testid="last-updated">
            <span className="vads-u-text-align--justify">
              <HumanizedDate
                date={useString ? lastUpdated || gitLastupdate : undefined}
                changed={useString ? undefined : changed}
              />
            </span>
          </div>
        )}
        {includeFeedbackButton && (
          <div
            className="vads-u-flex--1 vads-u-text-align--right"
            data-testid="feedback-button-container"
          >
            <FeedbackButton
              surveyNumber={getSurveyNumber(
                path,
                process.env.NEXT_PUBLIC_BUILD_TYPE === 'vagovprod'
              )}
            />
          </div>
        )}
      </div>
    </div>
  )
  return null
}
