import {
  QueryData,
  QueryFormatter,
  QueryOpts,
  QueryParams,
} from 'next-drupal-query'
import { queries } from '.'
import { NodePersonProfile } from '@/types/dataTypes/drupal/node'
import { drupalClient } from '@/lib/utils/drupalClient'
import { PersonProfileType } from '@/types/index'

// Define the query params for fetching node--news_story.
export const params: QueryParams<null> = () => {
  return queries.getParams().addInclude(['field_media.image', 'field_office'])
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
    body: entity.field_body?.processed,
    completeBiography: entity.field_complete_biography,
    completeBiographyCreate: entity.field_complete_biography_create,
    emailAddress: entity.field_email_address,
    firstName: entity.field_name_first,
    introText: entity.field_intro_text,
    photoAllowHiresDownload: entity.field_photo_allow_hires_download,
    description: entity.field_description,
    lastName: entity.field_last_name,
    phoneNumber: entity.field_phone_number,
    media: queries.formatData('media--image', entity.field_media),
    office: entity.field_office,
    suffix: entity.field_suffix,
  }))
}
