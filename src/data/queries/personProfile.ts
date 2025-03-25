/* eslint-disable no-console */
import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { queries } from '.'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodePersonProfile } from '@/types/drupal/node'
import { Menu } from '@/types/drupal/menu'
import { PersonProfile } from '@/types/formatted/personProfile'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
  getMenu,
} from '@/lib/drupal/query'
import { buildSidebarData } from '@/lib/drupal/facilityNoDrupalPageSideNav'

// Define the query params for fetching node--person_profile.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_media.image',
    'field_office',
    'field_complete_biography',
    'field_telephone',
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
  menu?: Menu
}

// Implement the data loader.
export const data: QueryData<PersonProfileDataOpts, PersonProfileData> = async (
  opts
) => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.PERSON_PROFILE,
    params
  )) as NodePersonProfile

  // Fetch the menu name dynamically off of the field_office reference if available.
  let menu = null
  if (entity.field_office?.field_system_menu) {
    menu = await getMenu(
      entity.field_office.field_system_menu.resourceIdObjMeta
        .drupal_internal__target_id
    )
  }

  return {
    entity,
    menu,
  }
}

export const formatter: QueryFormatter<PersonProfileData, PersonProfile> = ({
  entity,
  menu,
}) => {
  let formattedMenu = null
  if (menu !== null)
    formattedMenu = entity?.path
      ? buildSidebarData(entity.title, entity.field_office.path.alias)
      : null

  if (!entity) {
    return null
  }

  if (entity?.path?.alias === undefined) {
    console.log('Path is showing undefined. EntityId:', entity.id)
  }

  return {
    ...entityBaseFields(entity),
    firstName: entity.field_name_first,
    lastName: entity.field_last_name,
    suffix: entity.field_suffix,
    emailAddress: entity.field_email_address,
    phoneNumber: entity?.field_telephone ? queries.formatData(
      'paragraph--phone_number',
      entity.field_telephone
    ) : null,
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
  }
}
