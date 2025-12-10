/**
 * CompareHeader - Navigation and settings header for HTML comparison
 */

import * as React from 'react'
import { CompareHeaderProps } from './types'
import { styles } from './styles'

export const CompareHeader: React.FC<CompareHeaderProps> = ({
  totalElements,
  differenceCount,
  acceptedCount,
  currentDifferenceIndex,
  includeAcceptedInNav,
  onIncludeAcceptedChange,
  collapseWhitespace,
  onCollapseWhitespaceChange,
  includeDataTestId,
  onIncludeDataTestIdChange,
  onPreviousDifference,
  onNextDifference,
  onAcceptAll,
  onUnacceptAll,
  hasUnacceptedDifferences,
  hasAcceptedDifferences,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [menuOpen])

  return (
    <div className={styles.compareHeader}>
      <div className={styles.compareHeaderContent}>
        {/* Left side - Summary stats */}
        <div className={styles.summary}>
          <div>
            <div className={styles.summaryTitle}>Comparison Summary</div>
            <div className={styles.summaryText}>
              {totalElements} elements
              {differenceCount > 0 && (
                <span className={styles.summaryBadge}>
                  {differenceCount} difference
                  {differenceCount !== 1 ? 's' : ''}
                </span>
              )}
              {acceptedCount > 0 && (
                <span className={styles.summaryBadgeAccepted}>
                  {acceptedCount} accepted
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right side - Navigation controls */}
        <div className={styles.navControls}>
          {/* Include accepted checkbox */}
          <div className={styles.navCheckboxWrapper}>
            <input
              type="checkbox"
              id="include-accepted-nav"
              checked={includeAcceptedInNav}
              onChange={(e) => onIncludeAcceptedChange(e.target.checked)}
              className={styles.navCheckbox}
            />
            <label
              htmlFor="include-accepted-nav"
              className={styles.navCheckboxLabel}
            >
              Include accepted
            </label>
          </div>

          <div className={styles.navDivider} />

          {/* Settings menu */}
          <div ref={menuRef} className={styles.settingsWrapper}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className={styles.settingsButton}
              title="Options"
              aria-label="Options menu"
            >
              <va-icon icon="menu" size={4} />
            </button>

            {menuOpen && (
              <div className={styles.settingsDropdown}>
                {/* Action Buttons */}
                <div className={styles.settingsSection}>
                  <div className={styles.settingsSectionTitle}>Actions</div>
                  <button
                    type="button"
                    onClick={() => {
                      onAcceptAll()
                      setMenuOpen(false)
                    }}
                    className={styles.settingsActionButton}
                    disabled={!hasUnacceptedDifferences}
                    title="Accept all differences"
                  >
                    <va-icon icon="check_circle" size={3} />
                    Accept All
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onUnacceptAll()
                      setMenuOpen(false)
                    }}
                    className={styles.settingsActionButton}
                    disabled={!hasAcceptedDifferences}
                    title="Unaccept all differences"
                  >
                    <va-icon icon="cancel" size={3} />
                    Unaccept All
                  </button>
                </div>

                {/* Divider */}
                <div className={styles.settingsDivider} />

                {/* Options */}
                <div className={styles.settingsSection}>
                  <div className={styles.settingsSectionTitle}>Options</div>
                  <div className={styles.settingsItem}>
                    <input
                      type="checkbox"
                      id="collapse-whitespace"
                      checked={collapseWhitespace}
                      onChange={(e) =>
                        onCollapseWhitespaceChange(e.target.checked)
                      }
                      className={styles.settingsCheckbox}
                    />
                    <label
                      htmlFor="collapse-whitespace"
                      className={styles.settingsLabel}
                    >
                      Collapse whitespace differences
                    </label>
                  </div>
                  <div className={styles.settingsItem}>
                    <input
                      type="checkbox"
                      id="include-data-testid"
                      checked={includeDataTestId}
                      onChange={(e) =>
                        onIncludeDataTestIdChange(e.target.checked)
                      }
                      className={styles.settingsCheckbox}
                    />
                    <label
                      htmlFor="include-data-testid"
                      className={styles.settingsLabel}
                    >
                      Include data-testid attributes
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.navDivider} />

          {/* Navigation buttons */}
          {differenceCount > 0 ? (
            <>
              <div className={styles.navCounter}>
                {currentDifferenceIndex} of {differenceCount}
              </div>
              <div className={styles.navButtons}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    onPreviousDifference()
                  }}
                  className={styles.navButton}
                  title="Go to previous difference"
                >
                  <va-icon icon="expand_less" size={3} />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    onNextDifference()
                  }}
                  className={styles.navButton}
                  title="Go to next difference"
                >
                  Next
                  <va-icon icon="expand_more" size={3} />
                </button>
              </div>
            </>
          ) : (
            <div className={styles.navEmptyMessage}>
              {includeAcceptedInNav
                ? 'No differences found'
                : 'No unaccepted differences'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
