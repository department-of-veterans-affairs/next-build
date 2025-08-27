import React from 'react'
import { StaffProfileTeaser as FormattedStaffProfileTeaser } from '@/components/staffProfile/formatted-type'
import { MediaImage } from '@/components/mediaImage/template'
import { PhoneNumber } from '@/components/phoneNumber/template'

export const StaffProfileTeaser = ({
  media,
  firstName,
  lastName,
  suffix,
  description,
  vamcTitle,
  phoneNumber,
  link,
}: FormattedStaffProfileTeaser) => {
  const formattedName = `${firstName} ${lastName} ${suffix || ''}`.trim()
  return (
    <div className="vads-u-display--flex vads-u-margin-bottom--4">
      {media && (
        <div
          className="vads-u-margin-right--2 vads-u-flex--auto"
          data-testid="staff-profile-image"
        >
          <MediaImage
            {...media}
            className="bio-image vads-u-width--auto"
            imageStyle="2_3_medium_thumbnail"
          />
        </div>
      )}
      <div>
        {link ? (
          <va-link
            class="vads-u-display--block vads-u-margin-bottom--1 vads-u-font-family--serif vads-u-font-weight--bold vads-u-font-size--lg"
            href={link}
            text={formattedName}
            data-testid="staff-profile-link"
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
            {formattedName}
          </span>
        )}
        {description && (
          <p className="vads-u-margin--0 vads-u-font-family--serif tablet:vads-u-font-size--lg">
            {description}
          </p>
        )}
        {vamcTitle && (
          <p className="vads-u-margin--0 vads-u-margin-bottom--1 vads-u-font-family--serif tablet:vads-u-font-size--lg">
            {vamcTitle}
          </p>
        )}
        {phoneNumber && (
          <PhoneNumber
            {...phoneNumber}
            testId="phone-number"
            className="vads-u-margin--0 vads-u-margin-bottom--1"
          />
        )}
      </div>
    </div>
  )
}
