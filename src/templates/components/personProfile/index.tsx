import { MediaImageComponent } from '@/templates/common/mediaImage'
import { PersonProfileType } from '@/types/index'

export type PersonProfileTeaserProps = {
  title: string
  description?: string
}

export const PersonProfile = ({
  body,
  completeBiography,
  completeBiographyCreate,
  emailAddress,
  firstName,
  introText,
  photoAllowHiresDownload,
  description,
  lastName,
  phoneNumber,
  media,
  office,
  suffix,
}): JSX.Element => {
  return (
    <div id="content" className="interior">
      <main className="va-l-detail-page va-facility-page">
        <div className="usa-grid usa-grid-full">
          <div className="usa-width-three-fourths">
            <div className="vads-l-grid-container--full">
              <article className="usa-content">
                <div className="usa-grid usa-grid-full vads-u-margin-bottom--2 vads-u-display--flex vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row">
                  <div className="vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--0 vads-u-margin-right--3">
                    {media && (
                      <MediaImageComponent
                        {...media}
                        className="person-profile-detail-page-image"
                        imageStyle="1_1_square_medium_thumbnail"
                      />
                    )}
                  </div>
                  <div className="vads-u-display--flex vads-u-flex-direction--column">
                    <h1 className="vads-u-font-size--xl vads-u-margin-bottom--0p5">
                      {firstName} {lastName} {suffix}
                    </h1>
                    {description ? (
                      <p className="vads-u-font-size--lg vads-u-margin-bottom--0p5">
                        {description}
                      </p>
                    ) : null}
                    {office ? (
                      <p
                        className="
                             vads-u-font-weight--normal
                             vads-u-margin--0
                             vads-u-margin-bottom--0p5
                             vads-u-font-family--serif
                             vads-u-font-size--lg"
                      >
                        {office && office?.field_vamc_system_official_name}
                      </p>
                    ) : null}

                    {emailAddress && (
                      <p className="vads-u-font-size--lg vads-u-margin-bottom--0p5">
                        <span className="vads-u-font-weight--bold">
                          Email:{' '}
                        </span>
                        <a target="blank" href={`mailto:${emailAddress}`}>
                          {emailAddress}
                        </a>
                      </p>
                    )}
                    {phoneNumber && (
                      <p
                        className="
                vads-u-font-weight--regular
                vads-u-margin--0
                vads-u-margin-bottom--0p5"
                      >
                        <span className="vads-u-font-weight--bold">
                          Phone:{' '}
                        </span>
                        <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>
                      </p>
                    )}
                  </div>
                </div>
                {completeBiographyCreate && (
                  <div className="va-introtext vads-u-margin-bottom--2">
                    <p className="va-introtext vads-u-margin-bottom--0">
                      {introText}
                    </p>
                    <div
                      className="vads-u-margin-bottom--2"
                      dangerouslySetInnerHTML={{ __html: body }}
                    />
                  </div>
                )}
                {photoAllowHiresDownload && (
                  <div
                    className="vads-u-align-content--flex-end va-c-margin-top--auto vads-u-margin-bottom--2"
                    id="download-full-size-photo-link"
                  >
                    <i
                      className="va-c-social-icon fas fa-download"
                      aria-hidden="true"
                    ></i>
                    <a href={media[0]?.link?.self?.href} download>
                      Download full size photo
                    </a>
                  </div>
                )}
                {completeBiography && (
                  <div
                    className="vads-u-align-content--flex-end va-c-margin-top--auto vads-u-margin-bottom--2"
                    id="download-full-size-photo-link"
                  >
                    <i
                      className="va-c-social-icon fas fa-download"
                      aria-hidden="true"
                    ></i>
                    <div className="vads-u-align-content--flex-end va-c-margin-top--auto vads-u-margin-bottom--2">
                      <i className="va-c-social-icon fas fa-download"></i>
                      <a href={completeBiography.url} download>
                        Download full bio (PDF)
                      </a>
                    </div>
                  </div>
                )}
              </article>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export const StaffNewsProfile = ({
  title,
  description,
}: PersonProfileTeaserProps): JSX.Element => {
  return (
    <div className="vads-u-font-size--sm vads-u-margin-bottom--2p5">
      <div className="authored-by-line vads-u-margin-bottom--0p5 vads-u-font-weight--bold">
        By {title}
        {description ? `, ${description}` : null}
      </div>
    </div>
  )
}
