import { getHubIcon } from '@/lib/utils/benefitsHub'
import { recordEvent } from '@/lib/analytics/recordEvent'
import { BenefitsHub as FormattedBenefitsHub } from './formatted-type'
import { ListOfLinkTeasers } from '@/components/listOfLinkTeasers/template'
import { ContentFooter } from '@/components/contentFooter/template'

export function BenefitsHub({
  title,
  titleIcon,
  intro,
  spokes,
  lastUpdated,
  fieldLinks,
  fieldSupportServices,
}: FormattedBenefitsHub) {
  const iconConfig = getHubIcon(titleIcon)

  return (
    <div className="usa-grid usa-grid-full">
      <article className="usa-width-two-thirds">
        {iconConfig ? (
          <div className="tablet:vads-u-display--flex vads-u-margin-y--1 vads-u-align-items--flex-start">
            <span className="vads-u-margin-top--1">
              <va-icon
                icon={iconConfig.icon}
                size="3"
                class={iconConfig.className}
              />
            </span>
            <h1 className="vads-u-margin-top--1 tablet:vads-u-margin-left--1 tablet:vads-u-margin-y--0">
              {title}
            </h1>
          </div>
        ) : (
          <h1>{title}</h1>
        )}
        {intro && (
          <p
            className="va-introtext"
            dangerouslySetInnerHTML={{ __html: intro }}
          />
        )}
        {spokes?.map((spokeSection) => (
          <div key={spokeSection.id}>
            <section className="usa-grid">
              <div className="va-h-ruled--stars"></div>
            </section>
            <ListOfLinkTeasers {...spokeSection} isHubPage={true} />
          </div>
        ))}
        <ContentFooter lastUpdated={lastUpdated} />
      </article>
      <div className="usa-width-one-third" id="hub-rail">
        <va-accordion bordered uswds>
          <va-accordion-item
            className="va-accordion-item"
            level="2"
            open="true"
            header="Ask questions"
            id="ask-questions"
            bordered
            uswds
          >
            <section>
              <h3 className="vads-u-font-size--h4">Message us</h3>
              <ul className="va-nav-linkslist-list social">
                <li data-widget-type="ask-va-widget"></li>
              </ul>
            </section>

            {fieldSupportServices && fieldSupportServices.length > 0 && (
              <section>
                <h3 className="vads-u-font-size--h4">Call us</h3>
                <ul className="va-nav-linkslist-list social">
                  {fieldSupportServices.map((service, index) => {
                    return (
                      <li key={service.id || index}>
                        {service.field_phone_number ? (
                          <a
                            href={service.field_link?.url}
                            onClick={() => {
                              recordEvent({
                                event: 'nav-hub-rail',
                                'nav-path': 'Ask questions',
                              })
                            }}
                          >
                            <span>{service.title}</span>
                            <br />
                            <span>{service.field_phone_number}</span>
                          </a>
                        ) : service?.title?.includes('TTY: 711') ? (
                          // It was requested that we hardcode in the aria-label and href for the TTY service
                          // see: https://github.com/department-of-veterans-affairs/va.gov-team/issues/18151#issuecomment-879993959
                          <a
                            aria-label="TTY: 7 1 1."
                            href="tel:711"
                            onClick={() => {
                              recordEvent({
                                event: 'nav-hub-rail',
                                'nav-path': 'Ask questions',
                              })
                            }}
                          >
                            <span>{service.title}</span>
                            <br />
                          </a>
                        ) : service?.field_link?.url ? (
                          <a
                            href={service.field_link.url}
                            onClick={() => {
                              recordEvent({
                                event: 'nav-hub-rail',
                                'nav-path': 'Ask questions',
                              })
                            }}
                          >
                            <span>{service.title}</span>
                          </a>
                        ) : (
                          service?.title
                        )}
                      </li>
                    )
                  })}
                </ul>
              </section>
            )}
          </va-accordion-item>

          {fieldLinks && fieldLinks.length > 0 && (
            <va-accordion-item
              className="va-accordion-item"
              level="2"
              open="true"
              header="Not a Veteran or family member?"
              id="get-information-for"
              bordered
            >
              <section>
                <h3 className="vads-u-font-size--h4">Get information for:</h3>
                <ul className="va-nav-linkslist-list links">
                  {fieldLinks.map((link, index) => (
                    <li key={index}>
                      <va-link href={link.url.path} text={link.title} />
                    </li>
                  ))}
                </ul>
              </section>
            </va-accordion-item>
          )}
        </va-accordion>
      </div>
    </div>
  )
}
