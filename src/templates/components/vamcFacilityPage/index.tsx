import { LovellChildVariant } from '@/lib/drupal/lovell/types'
import { LovellSwitcher } from '../lovellSwitcher'
import { AboveFooterContent } from '../aboveFooterContent'
import { ContentFooter } from '@/templates/common/contentFooter'

export function VamcSystemFacilityPage({
  children,
  currentVariant,
  includeFeedbackButton,
  lastUpdated,
  switchPath,
  path,
}: {
  children: React.ReactNode
  includeFeedbackButton?: boolean
  lastUpdated?: string
  // Include the LovellSwitcher component if both have values
  currentVariant?: LovellChildVariant
  switchPath?: string
  path?: string
}) {
  return (
    <>
      <div data-widget-type="situation-updates-banner" />
      <div className="usa-grid usa-grid-full">
        <div className="usa-width-three-fourths">
          <article className="usa-content">
            <LovellSwitcher
              currentVariant={currentVariant}
              switchPath={switchPath}
            />
            {children}
            <va-back-to-top></va-back-to-top>
            <AboveFooterContent
              includeFeedbackButton={includeFeedbackButton}
              path={path}
            />
          </article>
        </div>
      </div>
    </>
  )
}
