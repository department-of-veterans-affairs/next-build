import { placeholders } from './placeholders.temp'

export const ResourcesPanel = () => {
  return (
    placeholders.fieldClpResourcesPanel && (
      <div className="vads-l-grid-container vads-u-padding-y--3 vads-u-padding-x--4 desktop-lg:vads-u-padding-x--0">
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--9">
            <p className="va-u-text-transform--uppercase vads-u-color--gray-medium vads-u-font-size--sm vads-u-margin-bottom--0">
              Downloadable resources
            </p>
            <h2 className="vads-u-margin-top--0">
              {placeholders.fieldClpResourcesHeader}
            </h2>
            <p className="va-introtext vads-u-margin-top--1 vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--4">
              {placeholders.fieldClpResourcesIntroText}
            </p>
          </div>
        </div>

        <div className="vads-l-row vads-u-margin-bottom--2 medium-screen:vads-u-margin-x--neg1">
          {placeholders.fieldClpResources.map((resource, index) => (
            <div
              key={index}
              className="vads-l-col--12 medium-screen:vads-l-col--4 vads-u-align-content--stretch vads-u-margin-y--1 "
            >
              <div className="vads-u-background-color--gray-light-alt vads-u-height--full vads-u-padding--2 vads-u-display--flex vads-u-flex-direction--column vads-u-justify-content--space-between medium-screen:vads-u-margin-x--1 medium-screen:vads-u-margin-y--0">
                <h3 className="vads-u-margin--0">{resource.entity.name}</h3>
                <p className="vads-u-flex--1">
                  {resource.entity.fieldDescription}
                </p>

                {/* TODO: In the Liquid template, this one is NOT a va-link where other links are.
                 * note to Zach Button to ask the team why */}
                <a
                  aria-label={`Download ${resource.entity.name} PDF`}
                  download
                  href={resource.entity.fieldMediaExternalFile.uri}
                  onClick={() => {
                    // TODO: recordEvent analytics function needs to be implemented
                    // recordEvent({ 'event': 'clp-link-click', 'clp-section-category': 'Downloadable resources', 'clp-section-title': fieldClpResourcesHeader, 'clp-total-sections': clpTotalSections, 'clp-click-label': `Download ${resource.entity.name}` });
                  }}
                >
                  Download (PDF)
                </a>
              </div>
            </div>
          ))}
        </div>

        {placeholders.fieldClpResourcesCta.entity.fieldButtonLink &&
          placeholders.fieldClpResourcesCta.entity.fieldButtonLabel && (
            <div className="vads-l-row">
              <div className="vads-u-col--12">
                <va-link-action
                  href={
                    placeholders.fieldClpResourcesCta.entity.fieldButtonLink.url
                      .path
                  }
                  type="secondary"
                  text={
                    placeholders.fieldClpResourcesCta.entity.fieldButtonLabel
                  }
                />
              </div>
            </div>
          )}
      </div>
    )
  )
}
