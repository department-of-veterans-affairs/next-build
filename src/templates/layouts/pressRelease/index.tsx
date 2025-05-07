import { PressRelease as FormattedPressRelease } from '@/types/formatted/pressRelease'
import { LovellStaticPropsResource } from '@/lib/drupal/lovell/types'
import { LovellSwitcher } from '@/templates/components/lovellSwitcher'
import { formatDate } from '@/lib/utils/helpers'
import { ContentFooter } from '@/templates/common/contentFooter'
import { PhoneNumber } from '@/templates/common/phoneNumber'

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
                  <p className="va-flex vads-u-flex-direction--column  mobile:vads-u-flex-direction--row mobile:vads-u-align-items--center mobile:vads-u-padding-bottom--4 ">
                    <va-button
                      data-testid="print-button"
                      onClick={() => {
                        window.print()
                        return false
                      }}
                      secondary
                      text="Print"
                      class="vads-u-margin-right--2 vads-u-padding-bottom--2 mobile:vads-u-padding-bottom--0"
                    />

                    {pdfVersion && (
                      <va-link
                        download
                        href={pdfVersion}
                        text="Download press release"
                        filetype={pdfVersion.split('.').pop().toUpperCase()}
                        data-testid="pdf-version"
                      />
                    )}
                  </p>
                  <p className="va-introtext vads-u-font-size--lg vads-u-margin-top--3">
                    {`${address.locality}, ${address.administrative_area} - ${introText}`}
                  </p>
                  {/* Body */}
                  <div dangerouslySetInnerHTML={{ __html: fullText }}></div>
                </section>
                {/* contacts can have a single object in the array that contains all null values */}
                {contacts?.length > 0 && contacts[0]?.name && (
                  <section
                    className="vads-u-margin-bottom--6"
                    data-testid="media-contacts"
                  >
                    <h2 className="vads-u-font-size--h3">Media contacts</h2>
                    {/* Print each media contact */}
                    {contacts.map((contact) => {
                      return (
                        <div key={contact.id}>
                          <p className="vads-u-margin-top--1 vads-u-margin-bottom--0">
                            {`${contact.name}${contact.description ? `, ${contact.description}` : ''}`}
                          </p>
                          {contact.numbers?.map((phone, index) => {
                            // Skip if phone number is empty
                            if (!phone.number) {
                              return ''
                            }
                            return (
                              <PhoneNumber
                                key={phone.id}
                                id={phone.id}
                                type="phone"
                                className="vads-u-margin-top--1 vads-u-margin-bottom--0"
                                extension={phone.ext || null}
                                number={phone.number}
                                phoneType={phone.type}
                                testId={`phone-${index}`}
                              />
                            )
                          })}
                          {contact.email && (
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
                )}
                {downloads.length > 0 && (
                  <section
                    className="vads-u-margin-bottom--6"
                    data-testid="downloads"
                  >
                    <h2 className="vads-u-margin-bottom--1 vads-u-font-size--h3">
                      Download media assets
                    </h2>
                    {/*Print out unorder list links per type*/}
                    <ul className="vads-u-margin-bottom--1 usa-unstyled-list">
                      {downloads?.map((asset) => {
                        if (!asset?.uri) {
                          return null
                        }
                        let link = (
                          <va-link
                            data-testid="generic-file"
                            filetype={asset.uri.split('.').pop().toUpperCase()}
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
                                filetype={asset.uri
                                  .split('.')
                                  .pop()
                                  .toUpperCase()}
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
                                filetype={asset.uri
                                  .split('.')
                                  .pop()
                                  .toUpperCase()}
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
