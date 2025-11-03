import { QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { ParagraphStaffProfile } from '@/types/drupal/paragraph'
import { StaffProfileParagraph } from './formatted-type'
import { queries } from '@/lib/drupal/queries'

// Define the query params for fetching node--staff_profile_paragraph.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_staff_profile',
    'field_staff_profile.field_media',
    'field_staff_profile.field_media.image',
    'field_staff_profile.field_office',
    'field_staff_profile.field_telephone',
  ])
}

export const formatter: QueryFormatter<
  ParagraphStaffProfile,
  StaffProfileParagraph
> = (entity: ParagraphStaffProfile) => {
  if (entity.status !== true) return null

  const profile = entity.field_staff_profile
  if (!profile.field_name_first && !profile.field_last_name) {
    // If the first name or last name is not present, this is likely an archived profile.
    return null
  }

  return {
    type: entity.type as StaffProfileParagraph['type'],
    id: entity.id,
    entityId: entity.drupal_internal__id || null,
    firstName: profile.field_name_first,
    lastName: profile.field_last_name,
    suffix: profile.field_suffix,
    emailAddress: profile.field_email_address,
    phoneNumber: queries.formatData(
      'paragraph--phone_number',
      profile.field_telephone
    ),
    description: profile.field_description,
    introText: profile.field_intro_text,
    body: profile.field_body?.processed || null,
    media: queries.formatData('media--image', profile.field_media),
    completeBiographyCreate: profile.field_complete_biography_create,
    photoAllowHiresDownload: profile.field_photo_allow_hires_download,
    vamcTitle: profile?.field_office?.title || null,
  }
}
