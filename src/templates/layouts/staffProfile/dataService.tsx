// TODO: refactor this file to the @data/queries directory
import { ParagraphStaffProfile } from '@/types/drupal/paragraph'
import { StaffProfile } from '@/types/formatted/staffProfile'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { queries } from '@/data/queries'

function isRequestValid(paragraph) {
  return paragraph.field_staff_profile !== null
}

export const transformStaffProfileData = function (
  entity: ParagraphStaffProfile,
  viewMode?: string
): StaffProfile {
  if (!entity || !isRequestValid(entity)) return

  const name =
    `${entity.field_staff_profile.field_name_first} ${
      entity.field_staff_profile.field_last_name
    } ${entity.field_staff_profile.field_suffix || ''}`.trim() || ''

  switch (viewMode) {
    default:
      return {
        id: entity.field_staff_profile.id,
        name: name,
        thumbnail: queries.formatData(
          'media--image',
          entity.field_staff_profile.field_media
        ),
        linkToBio: entity.field_staff_profile.field_complete_biography_create,
        path: entity.field_staff_profile.field_entity?.entityUrl.path || null,
        description: entity.field_staff_profile.field_description,
        phone: entity.field_staff_profile.field_phone_number,
        email: entity.field_staff_profile.field_email_address,
      }
  }
}

const params = new DrupalJsonApiParams()
  .addInclude([
    'field_media',
    'field_media.image',
    'field_author',
    'field_listing',
  ])
  .addPageLimit(10)
