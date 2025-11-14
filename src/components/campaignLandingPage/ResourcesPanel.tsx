import { CampaignLandingPageProps } from './template'
import { recordEvent } from '@/lib/analytics/recordEvent'

export const ResourcesPanel = ({
  resources,
  pageSectionCount,
}: CampaignLandingPageProps) => {
  if (!resources?.show) {
    return null
  }

  return (
    <div
      className="vads-l-grid-container vads-u-padding-y--3 vads-u-padding-x--4 desktop-lg:vads-u-padding-x--0"
      data-testid="resources-panel"
    >
      <div className="vads-l-row">
        <div className="vads-l-col--12 medium-screen:vads-l-col--9">
          <p className="va-u-text-transform--uppercase vads-u-color--gray-medium vads-u-font-size--sm vads-u-margin-bottom--0">
            Downloadable resources
          </p>
          <h2 className="vads-u-margin-top--0">{resources.header}</h2>
          <p className="va-introtext vads-u-margin-top--1 vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--4">
            {resources.intro}
          </p>
        </div>
      </div>

      <div className="vads-l-row vads-u-margin-bottom--2 medium-screen:vads-u-margin-x--neg1">
        {resources.documents.map((doc) => (
          <div
            key={doc.id}
            className="vads-l-col--12 medium-screen:vads-l-col--4 vads-u-align-content--stretch vads-u-margin-y--1 "
          >
            <div className="vads-u-background-color--gray-light-alt vads-u-height--full vads-u-padding--2 vads-u-display--flex vads-u-flex-direction--column vads-u-justify-content--space-between medium-screen:vads-u-margin-x--1 medium-screen:vads-u-margin-y--0">
              <h3 className="vads-u-margin--0">{doc.name}</h3>
              <p className="vads-u-flex--1">{doc.description}</p>

              <a
                aria-label={`Download ${doc.fileName} PDF`}
                download
                data-testid="resource-link"
                href={doc.url}
                onClick={() => {
                  recordEvent({
                    event: 'clp-link-click',
                    'clp-section-category': 'Downloadable resources',
                    'clp-section-title': encodeURIComponent(resources.header),
                    'clp-total-sections': pageSectionCount,
                    'clp-click-label': `Download ${encodeURIComponent(doc.name)}`,
                  })
                }}
              >
                Download (PDF)
              </a>
            </div>
          </div>
        ))}
      </div>

      {resources.cta && (
        <div className="vads-l-row">
          <div className="vads-u-col--12">
            <va-link-action
              href={resources.cta.url}
              type="secondary"
              text={resources.cta.label}
              data-testid="resources-cta"
            />
          </div>
        </div>
      )}
    </div>
  )
}
