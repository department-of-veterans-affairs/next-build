import { getHubIcon } from '@/lib/utils/benefitsHub'
import { recordEvent } from '@/lib/analytics/recordEvent'
import { BenefitsHub as FormattedBenefitsHub } from './formatted-type'
import { ListOfLinkTeasers } from '@/components/listOfLinkTeasers/template'
import { ContentFooter } from '@/components/contentFooter/template'
import { ConnectWithUsPanel } from './ConnectWithUsPanel'
import { AlertBlock } from '@/components/alertBlock/template'
import Image from 'next/image'

export function BenefitsHub({
  title,
  titleIcon,
  intro,
  spokes,
  lastUpdated,
  fieldLinks,
  supportServices,
  connectWithUs,
  relatedLinks,
  alert,
  promo,
}: FormattedBenefitsHub) {
  const iconConfig = getHubIcon(titleIcon)

  return (
    <div className="vads-grid-container">
      <div className="vads-grid-row vads-u-margin-bottom--4">
        <article className="vads-grid-col-12 vads-u-margin-bottom--3 tablet:vads-grid-col-8 tablet:vads-u-padding-right--4">
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
          {spokes?.length > 0 && <va-on-this-page></va-on-this-page>}
          {alert && <AlertBlock {...alert} />}
          {spokes?.map((spokeSection) => (
            <div key={spokeSection.id}>
              <section>
                <div className="va-h-ruled--stars"></div>
              </section>
              <ListOfLinkTeasers {...spokeSection} isHubPage={true} />
            </div>
          ))}
        </article>
        <div className="vads-grid-col-12 tablet:vads-grid-col-4" id="hub-rail">
          {promo && (
            <va-card className="vads-u-padding--0" background>
              <Image
                src={promo.img.src}
                alt={promo.img.alt || ''}
                style={{ objectFit: 'cover' }}
                width={480}
                height={320}
              />
              <div className="vads-u-padding--2">
                <h3 className="vads-u-margin-top--1">
                  <va-link {...promo.link} />
                </h3>
                <p>{promo.description}</p>
              </div>
            </va-card>
          )}
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
              {supportServices && supportServices.length > 0 && (
                <section>
                  <h3 className="vads-u-font-size--h4">Call us</h3>
                  <ul className="va-nav-linkslist-list social">
                    {supportServices.map((service, index) => {
                      const handleClick = () => {
                        recordEvent({
                          event: 'nav-hub-rail',
                          'nav-path': 'Ask questions',
                        })
                      }

                      const renderServiceContent = () => {
                        if (service?.number) {
                          return (
                            <a href={service.link?.url} onClick={handleClick}>
                              <span>{service.title}</span>
                              <br />
                              <span>{service.number}</span>
                            </a>
                          )
                        }

                        // TTY special case
                        // It was requested that we hardcode in the aria-label and href for the TTY service
                        // see: https://github.com/department-of-veterans-affairs/va.gov-team/issues/18151#issuecomment-879993959
                        if (service?.title?.includes('TTY: 711')) {
                          return (
                            <a
                              aria-label="TTY: 7 1 1."
                              href="tel:711"
                              onClick={handleClick}
                            >
                              <span>{service.title}</span>
                              <br />
                            </a>
                          )
                        }

                        if (service?.link?.url) {
                          return (
                            <a href={service.link.url} onClick={handleClick}>
                              <span>{service.title}</span>
                            </a>
                          )
                        }

                        return service?.title
                      }

                      // Skip rendering if service is not published
                      if (!service || !service.title) {
                        return null
                      }

                      return (
                        <li key={service.id || index}>
                          {renderServiceContent()}
                        </li>
                      )
                    })}
                  </ul>
                </section>
              )}
            </va-accordion-item>
            {fieldLinks && fieldLinks.length > 0 && (
              <va-accordion-item
                class="va-accordion-item"
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
            {connectWithUs && (
              <ConnectWithUsPanel connectWithUs={connectWithUs} />
            )}
          </va-accordion>
        </div>
      </div>
      {relatedLinks && (
        <section className="merger-majorlinks va-nav-linkslist va-nav-linkslist--related">
          <ListOfLinkTeasers
            {...relatedLinks}
            isHubPage={true}
            isRelatedLinks={true}
          />
        </section>
      )}
      <ContentFooter lastUpdated={lastUpdated} />
    </div>
  )
}
