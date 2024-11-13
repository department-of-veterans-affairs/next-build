import { Fragment } from 'react';
import { Checklist } from '@/types/formatted/checklist'
import AlertSingle from '@/templates/components/alertSingle'
import { AudienceTopics } from '@/templates/components/audienceTopics'
import { BenefitsHubLinks } from '@/templates/common/benefitsHubLinks'
import { ContactInfo } from '@/templates/components/contactInfo'
import { ContentFooter } from '@/templates/common/contentFooter'
import { RateYourExperience } from '@/templates/components/rateYourExperience'
import { RelatedInformation } from '@/templates/common/relatedInformation'
import { SecondaryButtonGroup } from '@/templates/common/secondaryButtonGroup'

export function Checklist({
  alert,
  benefitsHubLinks,
  buttons,
  checklist,
  contactInformation,
  intro,
  lastUpdated,
  relatedInformation,
  repeatButtons,
  tags,
  title
}: Checklist) {
  const {
    additionalContact,
    benefitHubContacts,
    contactType,
    defaultContact
  } = contactInformation

  return (
    <main className="va-l-detail-page" data-next-component="templates/layouts/checklist">
      <div className="usa-grid usa-grid-full vads-u-padding-x--1 desktop-lg:vads-u-padding-x--0">
        <div className="usa-width-three-fourths">
          <div className="usa-content">
            <div data-widget-type="i18-select" />
            <div className="medium-screen:vads-u-border-bottom--2px vads-u-border-color--gray-light medium-screen:vads-u-margin-bottom--3">
              <div className="va-hide-on-print-view" data-widget-type="resources-and-support-search" />
            </div>
            <article className="vads-u-padding-x--0">
              <h1>{title}</h1>
              {intro && <div className="va-introtext" dangerouslySetInnerHTML={{ __html: intro }} />}
              {alert && <AlertSingle {...alert} />}
              {buttons && <SecondaryButtonGroup buttons={buttons} />}
              {checklist?.length && (
                checklist.map((list, index) =>
                  <Fragment key={index}>
                    {list.header && <h2>{list.header}</h2>}
                    {list.intro && <p className="vads-u-margin-bottom--4">{list.intro}</p>}
                    {list.items && list.items?.length && (
                      <ul className="usa-unstyled-list">
                        {list.items.map((item, index) => (
                          <li
                            className={
                              index < list.items.length - 1 ?
                              `vads-u-margin-bottom--4` :
                            ''}
                            key={index}
                          >
                            <va-checkbox label={item} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </Fragment>
                )
              )}
              {repeatButtons && buttons && <SecondaryButtonGroup buttons={buttons} />}
            </article>
            {tags && <AudienceTopics {...tags} />}
            <RateYourExperience />
            {relatedInformation && <RelatedInformation relatedInformation={relatedInformation} />}
            {benefitsHubLinks && <BenefitsHubLinks links={benefitsHubLinks} />}
          </div>
        </div>
      </div>
      {contactInformation &&
        <ContactInfo
          additionalContact={additionalContact}
          benefitHubContacts={benefitHubContacts}
          contactType={contactType}
          defaultContact={defaultContact}
        />
      }
      <div className="usa-grid usa-grid-full">
        <div className="usa-width-three-fourths">
          <div className="usa-content">
            <va-back-to-top />
            <ContentFooter lastUpdated={lastUpdated} />
          </div>
        </div>
      </div>
    </main>
  )
}
