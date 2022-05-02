import Image from '@/components/image'
import { DEV_PATH } from '@/lib/constants'

export const PersonProfile = ({ node }): JSX.Element => {
  if (!node) return
  const {
    uuid,
    title,
    field_body: fieldBody,
    field_email_address: fieldEmailAddress,
    field_phone_number: fieldPhoneNumber,
    field_suffix: suffix,
    field_description: fieldDescription,
    field_complete_biography_create: fieldCompleteBiographyCreate,
    field_intro_text: fieldIntroText,
    field_media: fieldMedia,
    field_photo_allow_hires_download: fieldPhotoAllowHiresDownload,
    field_complete_biography: fieldCompleteBiography,
  } = node

  const thumbnail = DEV_PATH + fieldMedia?.thumbnail?.uri?.url
  const image = DEV_PATH + fieldMedia?.image?.uri?.url
  const meta = fieldMedia?.thumbnail?.resourceIdObjMeta

  return (
    <div key={uuid}>
      <article className="usa-content">
        <div className="usa-grid usa-grid-full vads-u-margin-bottom--2 vads-u-display--flex vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row">
          {fieldMedia?.thumbnail && (
            <div className="vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--0 vads-u-margin-right--3">
              <Image
                className="person-profile-detail-page-image"
                src={thumbnail}
                alt={meta?.alt}
                title={meta.title}
                width={meta?.width}
                height={meta?.height}
              />
            </div>
          )}
          <div className="vads-u-display--flex vads-u-flex-direction--column">
            <h1 className="vads-u-font-size--xl vads-u-margin-bottom--0p5">
              {title}
              {suffix && [suffix]}
            </h1>
            {fieldDescription && (
              <p className="vads-u-font-size--lg vads-u-margin-bottom--0p5">
                {fieldDescription}
              </p>
            )}
            {fieldEmailAddress && (
              <p className="vads-u-font-size--lg vads-u-margin-bottom--0p5">
                <span className="vads-u-font-weight--bold">Email: </span>
                <a target="blank" href="mailto:{{ fieldEmailAddress }}">
                  {fieldEmailAddress}
                </a>
              </p>
            )}
            {fieldPhoneNumber && (
              <p
                className="
                vads-u-font-weight--regular
                vads-u-margin--0
                vads-u-margin-bottom--0p5"
              >
                <span className="vads-u-font-weight--bold">Phone: </span>
                <a href="tel:{{ fieldPhoneNumber }}">{fieldPhoneNumber}</a>
              </p>
            )}
          </div>
        </div>
        {fieldCompleteBiographyCreate && (
          <div className="va-introtext vads-u-margin-bottom--2">
            <p className="va-introtext vads-u-margin-bottom--0">
              {fieldIntroText}
            </p>
            <div
              className="vads-u-margin-bottom--2"
              dangerouslySetInnerHTML={{ __html: fieldBody.processed }}
            />
          </div>
        )}
        {fieldPhotoAllowHiresDownload && (
          <div
            className="vads-u-align-content--flex-end va-c-margin-top--auto vads-u-margin-bottom--2"
            id="download-full-size-photo-link"
          >
            <i
              className="va-c-social-icon fas fa-download"
              aria-hidden="true"
            ></i>
            <a href={image} download>
              Download full size photo
            </a>
          </div>
        )}
        {fieldCompleteBiography && (
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
              <a href={fieldCompleteBiography.url} download>
                Download full bio (PDF)
              </a>
            </div>
          </div>
        )}
      </article>
      <hr />
    </div>
  )
}
