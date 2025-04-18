import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { queries } from '.'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodePersonProfile } from '@/types/drupal/node'
import { StaffProfile } from '@/types/formatted/staffProfile'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  DoNotPublishError,
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'
import { buildStaffProfileSidebarData } from '@/lib/drupal/staffProfileSideNav'

// Define the query params for fetching node--person_profile.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_media.image',
    'field_office',
    'field_complete_biography',
    'field_telephone',
    'field_administration',
  ])
}

// Define the option types for the data loader.
export type PersonProfileDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Define the data shape returned by the query.
type PersonProfileData = {
  entity: NodePersonProfile
}

// Implement the data loader.
export const data: QueryData<PersonProfileDataOpts, PersonProfileData> = async (
  opts
) => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.STAFF_PROFILE,
    params
  )) as NodePersonProfile

  return { entity }
}

export const formatter: QueryFormatter<PersonProfileData, StaffProfile> = ({
  entity,
}) => {
  if (!entity) {
    return null
  }
  const formattedMenu = entity?.field_office?.path
    ? buildStaffProfileSidebarData(entity.title, entity.field_office.path.alias)
    : null
  if (!entity.field_complete_biography_create) {
    throw new DoNotPublishError('this profile should not be generated')
  }
  return {
    ...entityBaseFields(entity),
    firstName: entity.field_name_first,
    lastName: entity.field_last_name,
    suffix: entity.field_suffix,
    emailAddress: entity.field_email_address,
    phoneNumber: queries.formatData(
      'paragraph--phone_number',
      entity.field_telephone
    ),
    description: entity.field_description,
    introText: entity.field_intro_text,
    body: entity.field_body?.processed || null,
    media: queries.formatData('media--image', entity.field_media),
    completeBiography: entity?.field_complete_biography?.uri || null,
    completeBiographyCreate: entity.field_complete_biography_create,
    photoAllowHiresDownload: entity.field_photo_allow_hires_download,
    vamcOfficalName:
      entity?.field_office?.field_vamc_system_official_name || null,
    office: entity.field_office,
    menu: formattedMenu,
    administration: {
      id: entity.field_administration?.drupal_internal__tid || null,
      name: entity.field_administration?.name || null,
    },
  }
}
