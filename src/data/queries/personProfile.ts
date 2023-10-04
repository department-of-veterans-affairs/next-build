import {
  QueryData,
  QueryFormatter,
  QueryOpts,
  QueryParams,
} from 'next-drupal-query'
import { queries } from '.'
import { NodePersonProfile } from '@/types/dataTypes/drupal/node'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { PersonProfileType } from '@/types/index'

// Define the query params for fetching node--news_story.
export const params: QueryParams<null> = () => {
  return queries
    .getParams()
    .addInclude([
      'field_media.image',
      'field_office',
      'field_complete_biography',
    ])
}

// Define the option types for the data loader.
type DataOpts = QueryOpts<null>

// Implement the data loader.
export const data: QueryData<DataOpts, NodePersonProfile[]> = async (): Promise<
  NodePersonProfile[]
> => {
  const entities = await drupalClient.getResourceCollection<
    NodePersonProfile[]
  >('node--person_profile', {
    params: params().getQueryObject(),
  })
  return entities
}

export const formatter: QueryFormatter<
  NodePersonProfile,
  PersonProfileType[]
> = (entities: NodePersonProfile) => {
  if (!entities) return null

  return entities.map((entity) => ({
    id: entity.id,
    type: entity.type,
    path: entity.path.alias,
    title: entity.title,
    firstName: entity.field_name_first,
    lastName: entity.field_last_name,
    suffix: entity.field_suffix,
    emailAddress: entity.field_email_address,
    phoneNumber: entity.field_phone_number,
    description: entity.field_description,
    introText: entity.field_intro_text,
    body: entity.field_body?.processed || null,
    media: queries.formatData('media--image', { entity: entity.field_media }),
    completeBiography: entity.field_complete_biography,
    completeBiographyCreate: entity.field_complete_biography_create,
    photoAllowHiresDownload: entity.field_photo_allow_hires_download,
    vamcOfficalName: entity.field_vamc_system_official_name,
    office: entity.field_office,
    entityPath: entity.path.alias,
    entityId: entity.drupal_internal__nid,
  }))
}
