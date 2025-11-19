import { getHubIcon } from '@/lib/utils/benefitsHub'
import { BenefitsHub as FormattedBenefitsHub } from './formatted-type'
import { ListOfLinkTeasers } from '@/components/listOfLinkTeasers/template'
import { ContentFooter } from '@/components/contentFooter/template'
import { ConnectWithUsPanel } from './ConnectWithUsPanel'

export function BenefitsHub({
  title,
  titleIcon,
  intro,
  spokes,
  lastUpdated,
  fieldLinks,
  connectWithUs,
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
          {spokes?.map((spokeSection) => (
            <div key={spokeSection.id}>
              <section>
                <div className="va-h-ruled--stars"></div>
              </section>
              <ListOfLinkTeasers {...spokeSection} isHubPage={true} />
            </div>
          ))}
          <ContentFooter lastUpdated={lastUpdated} />
        </article>
        <div className="vads-grid-col-12 tablet:vads-grid-col-4" id="hub-rail">
          <va-accordion bordered uswds>
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
    </div>
  )
}
