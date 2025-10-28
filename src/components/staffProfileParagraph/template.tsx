import { VaIcon } from '@department-of-veterans-affairs/web-components/react-bindings/index.js'
import { StaffProfileParagraph as FormattedStaffProfileParagraph } from './formatted-type'
import { PhoneNumber } from '@/components/phoneNumber/template'
import { MediaImage } from '@/components/mediaImage/template'

export function StaffProfileParagraph({
  firstName,
  lastName,
  suffix,
  emailAddress,
  phoneNumber,
  description,
  media,
  completeBiographyCreate,
  vamcTitle,
}: FormattedStaffProfileParagraph) {
  // Don't render if no data
  if (!firstName && !lastName) {
    return null
  }

  const fullName = `${firstName} ${lastName} ${suffix || ''}`.trim()

  return (
    <div
      data-template="includes/bioParagraph"
      className="vads-u-display--flex vads-u-margin-bottom--4 vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row"
    >
      <div className="vads-u-flex--auto medium-screen:vads-u-margin-right--3 vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--0">
        {!media ? (
          <div className="circular-profile-image bio-paragraph-image vads-u-position--relative vads-u-background-color--gray-lightest vads-u-display--block">
            <div className="circular-profile-missing-icon">
              <VaIcon size={6} icon="person" />
            </div>
          </div>
        ) : (
          <MediaImage
            {...media}
            className="circular-profile-image bio-paragraph-image"
            imageStyle="1_1_square_medium_thumbnail"
          />
        )}
      </div>
      <div className="vads-u-flex--1">
        <p className="vads-u-margin-top--0 vads-u-font-family--serif vads-u-font-weight--bold vads-u-display--block vads-u-margin-bottom--0 vads-u-font-size--md">
          {completeBiographyCreate ? (
            <a
              href={`/staff-profiles/${firstName.toLowerCase()}-${lastName.toLowerCase()}`}
            >
              {fullName}
            </a>
          ) : (
            fullName
          )}
        </p>
        {description && (
          <p className="vads-u-font-weight--normal vads-u-font-size--base vads-u-margin--0 vads-u-margin-bottom--0">
            {description}
          </p>
        )}
        {vamcTitle && (
          <p className="vads-u-font-weight--normal vads-u-font-size--base vads-u-margin--0 vads-u-margin-bottom--1">
            {vamcTitle}
          </p>
        )}
        {phoneNumber && (
          <div className="vads-u-margin--0 vads-u-margin-bottom--1">
            <PhoneNumber {...phoneNumber} />
          </div>
        )}
        {emailAddress && (
          <p className="vads-u-font-weight--normal vads-u-margin--0 vads-u-margin-bottom--1">
            <b>Email:</b>{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`mailto:${emailAddress}`}
            >
              {emailAddress}
            </a>
          </p>
        )}
      </div>
    </div>
  )
}
