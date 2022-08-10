import { EntityMetaInfo } from '@/data/delegators/entityMetaProvider'
import { ParagraphStaffProfile, ParagraphResourceType } from '@/types/data-types/drupal/paragraph'
import { StaffProfile, StaffProfileProps } from './index'
import { mediaImageDataService } from '@/templates/common/media/dataService'

function isRequestValid(paragraph) {
  return paragraph.field_staff_profile !== null
}

export const transformStaffProfileData = function (
  entity: ParagraphStaffProfile,
  viewMode?: string
): StaffProfileProps {
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
        thumbnail: mediaImageDataService(
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

export const Meta: EntityMetaInfo = {
  resource: ParagraphResourceType.StaffProfile,
  component: StaffProfile,
  dataService: transformStaffProfileData,
}
