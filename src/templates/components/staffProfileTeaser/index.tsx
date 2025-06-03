import React from 'react'
import { StaffProfileTeaser as FormattedStaffProfileTeaser } from '@/types/formatted/staffProfile'
import { MediaImage } from '@/templates/common/mediaImage'
import { PhoneNumber } from '@/templates/common/phoneNumber'

export const StaffProfileTeaser = ({
  media,
  firstName,
  lastName,
  suffix,
  description,
  vamcTitle,
  phoneNumber,
  link,
  id,
}: FormattedStaffProfileTeaser) => {
  return (
    <div className="vads-u-display--flex vads-u-margin-bottom--4">
      {media && (
        <div className="vads-u-margin-right--2 vads-u-flex--auto">
          <MediaImage
            {...media}
            className="person-profile-detail-page-image vads-u-width--auto"
            imageStyle="2_3_medium_thumbnail"
          />
        </div>
      )}
      <div>
        {link ? (
          <va-link
            class="vads-u-display--block vads-u-margin-bottom--1 vads-u-font-family--serif vads-u-font-weight--bold vads-u-font-size--lg"
            href={link}
            text={`${firstName} ${lastName} ${suffix}`}
          ></va-link>
        ) : (
          <span
            className="
            vads-u-font-family--serif
            vads-u-font-weight--bold
            vads-u-display--block
            vads-u-margin-bottom--1
            vads-u-font-size--lg"
          >
            {`${firstName} ${lastName} ${suffix}`}
          </span>
        )}
        {description && (
          <p className="vads-u-margin--0 vads-u-font-family--serif medium-screen:vads-u-font-size--lg">
            {description}
          </p>
        )}
        {vamcTitle && (
          <p className="vads-u-margin--0 vads-u-font-family--serif medium-screen:vads-u-font-size--lg">
            {vamcTitle}
          </p>
        )}
        {phoneNumber && <PhoneNumber {...phoneNumber} />}
      </div>
    </div>
  )
}
