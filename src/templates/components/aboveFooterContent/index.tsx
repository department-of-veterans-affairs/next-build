export function AboveFooterContent({
  includeFeedbackButton,
  lastUpdated,
}: {
  includeFeedbackButton?: boolean
  lastUpdated?: string
}) {
  const classes = [
    'last-updated',
    'usa-content',
    'vads-u-padding-x--1',
    'desktop-lg:vads-u-padding-x--0',
  ]
  if (!includeFeedbackButton && !lastUpdated) {
    return null
  }
  return (
    <div className={classes.join(' ')}>
      <div className="mobile-lg:vads-u-display--flex above-footer-elements-container">
        {!!lastUpdated && (
          <div className="vads-u-flex--auto">
            <span className="vads-u-text-align--justify">{<></>}</span>
          </div>
        )}
        {includeFeedbackButton && (
          <div className="vads-u-flex--1 vads-u-text-align--right">
            <span className="vads-u-text-align--right">{<></>}</span>
          </div>
        )}
      </div>
    </div>
  )
  return null
}
