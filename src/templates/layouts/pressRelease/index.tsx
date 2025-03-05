import { PressRelease as FormattedPressRelease } from '@/types/formatted/pressRelease'
import { LovellStaticPropsResource } from '@/lib/drupal/lovell/types'
import { LovellSwitcher } from '@/templates/components/lovellSwitcher'
import { formatDate } from '@/lib/utils/helpers'
import { recordEvent } from '@/lib/analytics/recordEvent'
import { ContentFooter } from '@/templates/common/contentFooter'

export const PressRelease = ({
  title,
  releaseDate,
  pdfVersion,
  introText,
  address,
  fullText,
  contacts,
  downloads,
  listing,
  lovellVariant,
  lovellSwitchPath,
}: LovellStaticPropsResource<FormattedPressRelease>) => {
  return (
    <>
      <div>
        <div className="va-l-detail-page va-facility-page">
          <div className="usa-grid usa-grid-full">
            {/* nav here */}
            <div className="usa-width-three-fourths">
              <article className="usa-content">
                <LovellSwitcher
                  currentVariant={lovellVariant}
                  switchPath={lovellSwitchPath}
                />
                <section className="vads-u-margin-bottom--5">
                  <h1 className="vads-u-margin-bottom--2p5">{title}</h1>
                  <p className="vads-u-margin-bottom--0p5">PRESS RELEASE</p>
                  <p className="vads-u-font-weight--bold vads-u-margin-bottom--3 vads-u-margin-top--0">
                    {formatDate(releaseDate)}
                  </p>
                  <div>
                    <button
                      type="button"
                      className="vads-u-margin-right--4 va-button-link"
                      onClick={() => {
                        window.print()
                        return false
                      }}
                    >
                      <i className="fa fa-print vads-u-padding-right--1"></i>
                      Print
                    </button>
                    {pdfVersion && (
                      <a href={pdfVersion} download>
                        <i className="fa fa-download vads-u-padding-right--1"></i>
                        Download press release (PDF)
                      </a>
                    )}
                  </div>
                  <p className="va-introtext vads-u-font-size--lg vads-u-margin-top--3">
                    {`${address.locality}, ${address.administrative_area} - ${introText}`}
                  </p>
                  {/* Body */}
                  <div dangerouslySetInnerHTML={{ __html: fullText }}></div>
                </section>
                <section className="vads-u-margin-bottom--6">
                  {contacts?.length > 0 && (
                    <div className="vads-u-font-weight--bold">
                      Media contacts
                    </div>
                  )}
                  {/* Print each media contact */}
                  {contacts?.map((contact) => {
                    if (!contact) {
                      return null
                    }
                    return (
                      <div key={contact?.id}>
                        <p className="vads-u-margin-top--1 vads-u-margin-bottom--0">
                          {`${contact?.name}${contact?.description ? `, ${contact?.description}` : ''}`}
                        </p>
                        {contact?.numbers?.map((phone, index) => {
                          const label = phone.type === 'fax' ? 'Fax' : 'Phone'
                          return (
                            <p
                              key={phone.id}
                              className="vads-u-margin-top--1 vads-u-margin-bottom--0"
                            >
                              <span
                                data-testId={`phone-label-${index}`}
                                className="vads-u-font-weight--bold vads-u-margin-right--0p5"
                              >
                                {`${label}:`}
                              </span>
                              <va-telephone
                                tty={phone.type === 'tty' || null}
                                sms={phone.type === 'sms' || null}
                                not-clickable={phone.type === 'fax' || null}
                                contact={phone.number}
                                extension={phone.ext || null}
                                data-testid={`phone-${index}`}
                                message-aria-describedby={label}
                              />
                            </p>
                          )
                        })}
                        {contact?.email && (
                          <p className="vads-u-margin-top--1 vads-u-margin-bottom--0">
                            <va-link
                              data-testid="press-email"
                              href={`mailto:${contact?.email}`}
                              text={contact?.email}
                            />
                          </p>
                        )}
                      </div>
                    )
                  })}
                </section>
                {downloads.length > 0 && (
                  <section
                    className="vads-u-margin-bottom--6"
                    data-testid="downloads"
                  >
                    <div className="vads-u-font-weight--bold vads-u-margin-bottom--1">
                      Download media assets
                    </div>
                    {/*Print out unorder list links per type*/}
                    <ul className="vads-u-margin-bottom--1 usa-unstyled-list">
                      {downloads?.map((asset) => {
                        if (!asset?.uri) {
                          return null
                        }
                        let link = (
                          <va-link
                            data-testid="generic-file"
                            filetype={asset.uri.split('.').pop()}
                            href={asset.uri}
                            download
                            text={asset.name}
                          />
                        )
                        switch (asset.type) {
                          case 'media--document':
                            link = (
                              <va-link
                                data-testid="document"
                                filetype={asset.uri.split('.').pop()}
                                href={asset.uri}
                                download
                                text={asset.name}
                              />
                            )
                            break
                          case 'media--image':
                            link = (
                              <va-link
                                data-testid="image"
                                filetype={asset.uri.split('.').pop()}
                                href={asset.uri}
                                download
                                text={`Download ${asset.name}`}
                              />
                            )
                            break
                          case 'media--video':
                            link = (
                              <va-link
                                data-testid="video"
                                video
                                href={asset.uri}
                                text={asset.name}
                              />
                            )
                            break
                          default:
                            break
                        }
                        return (
                          <li
                            key={asset.id}
                            className="vads-u-margin-bottom--1"
                          >
                            {link}
                          </li>
                        )
                      })}
                    </ul>
                  </section>
                )}

                <section className="vads-u-margin-bottom--6 vads-u-text-align--center">
                  ###
                </section>

                <section className="vads-u-margin-bottom--3">
                  {/* should be fieldOffice.entity.fieldPressReleaseBlurb.processed */}
                </section>
                <p className="vads-u-margin--0">
                  <va-link href={listing} text="See all news releases" active />
                </p>
              </article>
              <ContentFooter />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
