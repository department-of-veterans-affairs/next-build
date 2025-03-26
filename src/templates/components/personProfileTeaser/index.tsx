import React from 'react'
import { PersonProfileTeaser as FormattedPersonProfileTeaser } from '@/types/formatted/personProfileTeaser'
import { MediaImage } from '@/templates/common/mediaImage'
import { PhoneNumber } from '@/templates/common/phoneNumber'

/**
 * Staff image side-by-side with details. The only required information is first and last
 * name and office (or health care region).
 */
const PersonProfileTeaser = ({
  completeBiographyCreate,
  description,
  emailAddress,
  entityPath,
  firstName,
  lastName,
  media,
  office,
  phoneNumber,
  suffix,
}: FormattedPersonProfileTeaser) => {
  let modifiedSuffix

  if (suffix?.startsWith(',')) {
    modifiedSuffix = suffix
  } else if (suffix) {
    modifiedSuffix = ` ${suffix}`
  } else {
    modifiedSuffix = ''
  }

  const staffName = `${firstName} ${lastName}${modifiedSuffix}` || ''

  return (
   <div className="vads-u-display--flex vads-u-margin-bottom--4">
    {media &&
      <MediaImage
        {...media}
        className="vads-u-margin-right--2"
        imageStyle="2_3_medium_thumbnail"
        style={{ height: '178px', width: '119px', objectFit: 'cover' }}
        />
    }
    <div>
      {completeBiographyCreate && entityPath ? (
        <va-link
          class="vads-u-font-family--serif vads-u-font-weight--bold vads-u-font-size--lg"
          href={entityPath}
          text={staffName}
        />
      ) :
        <p data-testid="pp-teaser-name" className="vads-u-margin--0 vads-u-font-family--serif vads-u-font-weight--bold vads-u-font-size--lg">
          {staffName}
        </p>
      }
      {description && (
        <p data-testid="pp-teaser-desc" className="vads-u-margin--0 vads-u-margin-top--1 vads-u-font-family--serif vads-u-font-size--base medium-screen:vads-u-font-size--lg">
          {description}
        </p>
      )}
      {office && (
        <p data-testid="pp-teaser-office" className="vads-u-margin--0 vads-u-font-family--serif vads-u-font-size--base medium-screen:vads-u-font-size--lg">
          {office}
        </p>
      )}
      {phoneNumber && (
        <PhoneNumber className="vads-u-margin-top--1" {...phoneNumber} />
      )}
      {emailAddress && (
        <p data-testid="pp-teaser-email" className="vads-u-margin--0">
          <b>Email:</b>{' '}
          <va-link type="email" href={`mailto:${emailAddress}`} text={emailAddress}></va-link>
        </p>
      )}
     </div>
    </div>
  )
}

export default PersonProfileTeaser
