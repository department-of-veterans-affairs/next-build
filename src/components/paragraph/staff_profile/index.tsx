import { v4 as uuidv4 } from 'uuid'
import Link from 'next/link'
import Image from '@/components/image'
import { DEV_PATH } from '@/lib/constants'

export const StaffProfiles = ({ paragraph }): JSX.Element => {
  if (!paragraph) return
  const {
    field_first_name: fieldFirstName,
    field_last_name: fieldLastName,
    field_email_address: fieldEmailAddress,
    field_phone_number: fieldPhoneNumber,
    field_suffix: fieldSuffix,
    field_description: fieldDescription,
    field_complete_biography_create: fieldCompleteBiographyCreate,
    field_media: fieldMedia,
    field_entity: fieldEntity,
  } = paragraph.field_staff_profile

  const thumbnail = DEV_PATH + fieldMedia?.thumbnail?.uri?.url
  const meta = fieldMedia?.thumbnail?.resourceIdObjMeta

  return (
    <div key={uuidv4()}>
      <article className="usa-content">
        <div className="vads-u-display--flex vads-u-margin-bottom--4 vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row">
          {!fieldMedia?.thumbnail ? (
            <div className="vads-u-flex--auto medium-screen:vads-u-margin-right--3 vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--0">
              <span className="circular-profile-image bio-paragraph-image vads-u-position--relative vads-u-background-color--gray-lightest vads-u-display--block">
                <span className="fas fa-user circular-profile-missing-icon"></span>
              </span>
            </div>
          ) : (
            <div className="vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--0 vads-u-margin-right--3">
              <Image
                className="circular-profile-image bio-paragraph-image max-width-100"
                src={thumbnail}
                alt={meta?.alt}
                title={meta?.title}
                width={meta?.width}
                height={meta?.height}
              />
            </div>
          )}
          <div className="vads-u-display--flex vads-u-flex-direction--column">
            <p
              className="
            vads-u-margin-top--0
            vads-u-font-family--serif
            vads-u-font-weight--bold
            vads-u-display--block
            vads-u-margin-bottom--0
            vads-u-font-size--md"
            >
              {fieldCompleteBiographyCreate ? (
                <a className="bioLink" href={fieldEntity?.entityUrl.path}>
                  {fieldFirstName} {fieldLastName} {fieldSuffix}
                </a>
              ) : (
                <span>
                  {fieldFirstName} {fieldLastName} {fieldSuffix}{' '}
                </span>
              )}
            </p>
            {fieldDescription && (
              <p className="vads-u-font-size--lg vads-u-margin-bottom--0p5">
                {fieldDescription}
              </p>
            )}
            {fieldPhoneNumber && (
              <p
                className="
                vads-u-font-weight--normal
                vads-u-margin--0
                vads-u-margin-bottom--1"
              >
                <span className="vads-u-font-weight--bold">Phone: </span>
                <a href={`tel:${fieldPhoneNumber}`}>{fieldPhoneNumber}</a>
              </p>
            )}
            {fieldEmailAddress && (
              <p
                className="  vads-u-font-weight--normal
              vads-u-margin--0
              vads-u-margin-bottom--1"
              >
                <span className="vads-u-font-weight--bold">Email: </span>
                <a
                  href={`mailto:${fieldEmailAddress}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {fieldEmailAddress}
                </a>
              </p>
            )}
          </div>
        </div>
      </article>
      <hr />
    </div>
  )
}
