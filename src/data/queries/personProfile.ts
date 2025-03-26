import {
  QueryData,
  QueryFormatter,
  QueryOpts,
  QueryParams,
} from 'next-drupal-query'
import { queries } from '.'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodePersonProfile } from '@/types/drupal/node'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { PersonProfile } from '@/types/formatted/personProfile'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { entityBaseFields } from '@/lib/drupal/query'

// // Define the query params for fetching node--person_profile.
// export const params: QueryParams<null> = () => {
//   return new DrupalJsonApiParams().addInclude([
//     'field_media.image',
//     'field_office',
//     'field_complete_biography',
//   ])
// }

// // Define the option types for the data loader.
// type DataOpts = QueryOpts<null>

// // Implement the data loader.
// export const data: QueryData<DataOpts, NodePersonProfile[]> = async (): Promise<
//   NodePersonProfile[]
// > => {
//   const entities = await drupalClient.getResourceCollection<
//     NodePersonProfile[]
//   >(RESOURCE_TYPES.PERSON_PROFILE, {
//     params: params().getQueryObject(),
//   })
//   return entities
// }

export const formatter: QueryFormatter<NodePersonProfile, PersonProfile> = (
  entity: NodePersonProfile
) => {
  if (!entity) return null

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
    media: queries.formatData('media--image', entity.field_media), //no imageStyle passed
    completeBiography: entity.field_complete_biography?.uri,
    completeBiographyCreate: entity.field_complete_biography_create,
    photoAllowHiresDownload: entity.field_photo_allow_hires_download,
    vamcOfficalName: entity.field_vamc_system_official_name,
    office: entity.field_office,
  }
}
