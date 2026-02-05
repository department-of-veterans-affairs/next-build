import { format } from 'date-fns'
import { MedalliaFeedbackButton } from './MedalliaFeedbackButton'

// "Back to top", "Last updated" date and Medallia feedback button

type ContentFooterProps = {
  lastUpdated?: string | number
  // responsiveLayout should be passed by the "landing_page" content type only
  responsiveLayout?: string
}

/**
 * Server component for content footer.
 * Date formatting is done server-side using date-fns (not bundled client-side).
 * Interactive parts (Medallia feedback) are handled by MedalliaFeedbackButton client component.
 */
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
    <div
      data-testid="content-footer"
      className={`last-updated ${wrapperClasses}`}
    >
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
        <MedalliaFeedbackButton />
      </div>
    </div>
  )
}
