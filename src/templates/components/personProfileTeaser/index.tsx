import React from 'react'
import { PersonProfileTeaser as FormattedPersonProfileTeaser } from '@/types/formatted/personProfileTeaser'
import { MediaImage } from '@/templates/common/mediaImage'
import { PhoneNumber } from '@/templates/common/phoneNumber'

// //     emailAddress: entity.field_email_address,
// //     phoneNumber: entity?.field_telephone?.field_phone_number || null,
// //     description: entity.field_description,
// //     introText: entity.field_intro_text,
// //     body: entity.field_body?.processed || null,
// //     media: queries.formatData('media--image', entity.field_media),
// //     completeBiography: entity?.field_complete_biography?.uri || null,
// //     completeBiographyCreate: entity.field_complete_biography_create,
// //     photoAllowHiresDownload: entity.field_photo_allow_hires_download,
// //     vamcOfficalName:
// //       entity?.field_office?.field_vamc_system_official_name || null,
// //     office: entity.field_office,
// //     menu: formattedMenu,

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
  const staffName = `${firstName} ${lastName}${suffix ? ` ${suffix}` : ''}` || '';

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
        <p className="vads-u-margin--0 vads-u-font-family--serif vads-u-font-weight--bold vads-u-font-size--lg">
          {staffName}
        </p>
      }
      {description && (
        <p className="vads-u-margin--0 vads-u-margin-top--1 vads-u-font-family--serif vads-u-font-size--base medium-screen:vads-u-font-size--lg">
          {description}
        </p>
      )}
      {office && (
        <p className="vads-u-margin--0 vads-u-font-family--serif vads-u-font-size--base medium-screen:vads-u-font-size--lg">
          {office}
        </p>
      )}
      {phoneNumber && (
        <PhoneNumber className="vads-u-margin-top--1" {...phoneNumber} />
      )}
      {emailAddress && (
        <p className="vads-u-margin--0 medium-screen:vads-u-font-size--lg">
          <b>Email:</b>
          <va-link type="email" href={`mailto:${emailAddress}`} text={emailAddress}></va-link>
        </p>
      )}
     </div>
    </div>
  )
}

export default PersonProfileTeaser
