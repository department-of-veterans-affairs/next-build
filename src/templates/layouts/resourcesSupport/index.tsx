import { ResourcesSupport as FormattedResourcesSupport } from '@/types/formatted/resourcesSupport'
import { ContentFooter } from '@/templates/common/contentFooter'
import AlertSingle from '@/templates/components/alertSingle'
import { Button as FormattedButton } from '@/types/formatted/button'
import { Paragraph } from '@/templates/components/paragraph'
import { AudienceTopics } from '@/templates/components/audienceTopics'
import { Button } from '@/templates/common/button'
import { BenefitsHubLinks } from '@/templates/common/benefitsHubLinks'
import { ContactInfo } from '@/templates/components/contactInfo'
import { RateYourExperience } from '@/templates/components/rateYourExperience'

const Buttons = ({
  buttons,
  margin = 'both',
}: {
  buttons: FormattedButton[]
  margin?: 'top' | 'both'
}) => {
  const marginClass =
    margin === 'top' ? 'vads-u-margin-top--3' : 'vads-u-margin-y--3'

  return (
    <ul className={`${marginClass} usa-unstyled-list`}>
      {buttons.map((button) => (
        <li key={button.id} className="vads-u-margin-bottom--2">
          <Button {...button} />
        </li>
      ))}
    </ul>
  )
}

export const ResourcesSupport = ({
  title,
  intro,
  alert,
  buttons,
  repeatButtons = false,
  toc = true,
  tags,
  mainContent,
  contactInformation,
  benefitsHubLinks,
  lastUpdated,
}: FormattedResourcesSupport) => {
  return (
    <div
      id="content"
      className="interior"
      data-resource-type="node--support_resources_detail_page"
    >
      <main className="va-l-detail-page">
        <div className="usa-grid usa-grid-full">
          <div className="usa-width-three-fourths">
            <div className="usa-content">
              <div data-widget-type="i18-select"></div>

              {/* Search Bar */}
              <div className="medium-screen:vads-u-border-bottom--2px vads-u-border-color--gray-light medium-screen:vads-u-margin-bottom--3">
                {/* TODO: SearchBar */}
              </div>

              <article className="usa-content vads-u-padding-x--1 desktop-lg:vads-u-padding-x--0">
                <h1>{title}</h1>

                {/* Intro */}
                <div
                  className="va-introtext"
                  dangerouslySetInnerHTML={{ __html: intro }}
                ></div>

                {/* Alert */}
                {alert && <AlertSingle {...alert} />}

                {/* Buttons */}
                {buttons && <Buttons buttons={buttons} />}

                {/* Table of Contents */}
                {toc && (
                  <va-on-this-page className="vads-u-margin-left--1 vads-u-margin-bottom--0 vads-u-padding-bottom--0"></va-on-this-page>
                )}

                {/* Main Content */}
                {/* Note: eventually this key can just be `pargraph.id`, but only once we implement all paragraph types for this resource*/}
                {mainContent.map((paragraph, index) => (
                  <Paragraph key={paragraph?.id || index} {...paragraph} />
                ))}

                {/* Repeated buttons */}
                {buttons && repeatButtons && (
                  <Buttons buttons={buttons} margin="top" />
                )}
              </article>

              {/* Tags */}
              {tags && <AudienceTopics {...tags} />}

              {/* How do you rate? */}
              <RateYourExperience />

              {/* Related information */}
              {/* {% include "src/site/includes/related-information.drupal.liquid" with fieldRelatedInformation = fieldRelatedInformation %} */}

              {/* VA benefits */}
              <BenefitsHubLinks title="VA benefits" links={benefitsHubLinks} />
            </div>
          </div>
        </div>

        {/* Need more help? */}
        <ContactInfo {...contactInformation} />

        <div className="usa-grid usa-grid-full">
          <div className="usa-width-three-fourths">
            <div className="usa-content">
              <va-back-to-top></va-back-to-top>
              {/* Last updated & feedback button */}
              <ContentFooter lastUpdated={lastUpdated} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
