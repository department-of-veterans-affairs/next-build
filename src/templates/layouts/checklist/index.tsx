import { Checklist } from '@/types/formatted/checklist'
import AlertSingle from '@/templates/components/alertSingle'
import { SecondaryButtonGroup } from '@/templates/common/SecondaryButtonGroup'

export function Checklist({
  alert,
  buttons,
  intro,
  title
}: Checklist) {
  return (
    <main className="va-l-detail-page">
      <div className="usa-grid usa-grid-full">
        <div className="usa-width-three-fourths">
          <div className="usa-content">
            <div data-widget-type="i18-select"></div>
            <div className="medium-screen:vads-u-border-bottom--2px vads-u-border-color--gray-light medium-screen:vads-u-margin-bottom--3">
              <div className="va-hide-on-print-view" data-widget-type="resources-and-support-search" />
            </div>
            <article className="vads-u-padding-x--1 large-screen:vads-u-padding-x--0">
              <h1>{title}</h1>
              <div className="va-introtext" dangerouslySetInnerHTML={{ __html: intro }} />
              {alert && <AlertSingle {...alert} />}
              {buttons && <SecondaryButtonGroup buttons={buttons} />}
            </article>
          </div>
        </div>
      </div>
    </main>
  )
}
