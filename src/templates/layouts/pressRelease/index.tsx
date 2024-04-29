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

  /*listing,*/
  lovellVariant,
  lovellSwitchPath,
}: LovellStaticPropsResource<FormattedPressRelease>) => {
  return (
    <>
      <div>
        <main className="va-l-detail-page va-facility-page">
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
                    {releaseDate || formatDate(releaseDate)}
                  </p>
                  <div>
                    <button
                      type="button"
                      className="va-u-margin-right--4 va-button-link"
                      onClick={() => {
                        window.print()
                        return false
                      }}
                    >
                      <i className="fa fa-print vads--u-padding-right--1"></i>
                      Print
                    </button>
                    {pdfVersion && (
                      <a href={pdfVersion.field_document.uri.url} download>
                        <i className="fa fa-download vads--u-padding-right--1"></i>
                        Download press release (PDF)
                      </a>
                    )}
                  </div>
                  <p className="va-introtext vads-u-font-size--lg vads-u-margin-top--3">
                    {address.locality},{address.administrative_area} -
                    {introText}
                  </p>
                  {/* Body */}
                  <div dangerouslySetInnerHTML={{__html: fullText.processed}}></div>
                </section>
                <section className="vads-u-margin-bottom--6">
                  <div className="vads-u-font-weight--bold">Media contacts</div>
                  {/* Print each media contact */}
                  {contacts.map((contact) => {
                    if (!contact) {
                      return null
                    }
                    return (
                      <div key={contact.id}>
                        <p className="vads-u-margin-top--1 vads-u-margin-bottom--0">
                          {contact.title}{' '}
                          {contact.field_description &&
                            `, ${contact.field_description}`}
                        </p>
                        <p className="vads-u-margin-top--1 vads-u-margin-bottom--0">
                          {contact.field_phone_number}
                        </p>
                        {contact.field_email_address && (
                          <p className="vads-u-margin-top--1 vads-u-margin-bottom--0">
                            <a href={`mailto:${contact.field_email_address}`}>
                              {contact.field_email_address}
                            </a>
                          </p>
                        )}
                      </div>
                    )
                  })}
                </section>
                {downloads.length > 0 && (
                  <section className="vads-u-margin-bottom--6">
                    <div className="vads-u-font-weight--bold vades-u-margin-bottom--1">
                      Download media assets
                    </div>
                    {/*Print out unorder list links per type*/}
                    {downloads.map((asset) => {
                      if (!asset) {
                        return null
                      }
                      return (
                        <ul key={asset.id}>
                          <li>
                            {asset.type === 'DrupalMediaDocument' && (
                              <a href={asset.field_document.uri.url} download>
                                {asset.name}
                              </a>
                            )}
                            {asset.type === 'DrupalMediaImage' && (
                              <a href={asset.image.uri.url} download>
                                {asset.name}
                              </a>
                            )}
                            {asset.type === 'DrupalMediaVideo' && (
                              <a href={asset.field_document.uri.url} download>
                                {asset.name}
                              </a>
                            )}
                          </li>
                        </ul>
                      )
                    })}
                  </section>
                )}

                <section className="vads-u-margin-bottom--6 vads-u-text-align--center">
                  {/* ### */}
                </section>

                <section className="vads-u-margin-bottom--3">

                  {/* should be fieldOffice.entity.fieldPressReleaseBlurb.processed */}
                </section>
                <a
                  onClick={() =>
                    recordEvent({ event: 'nav-secondary-button-click' })
                  }
                  href="#"
                >
                  {' '}
                  {/*fieldListing.path.alias*/}
                  See all news releases
                </a>
              </article>
              <ContentFooter />
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
