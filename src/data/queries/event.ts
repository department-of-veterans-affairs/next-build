import {
  QueryData,
  QueryFormatter,
  QueryOpts,
  QueryParams,
} from 'next-drupal-query'
import { queries } from '.'
import { NodeEvent } from '@/types/drupal/node'
import { Event } from '@/types/formatted/event'
import { GetServerSidePropsContext } from 'next'
import { MediaImage } from '@/types/formatted/media'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'

export const params: QueryParams<null> = () => {
  return queries
    .getParams()
    .addInclude([
      'field_media',
      'field_media.image',
      'field_listing',
      'field_administration',
      'field_facility_location',
    ])
}

// Define the option types for the data loader.
export type EventDataOpts = QueryOpts<{
  id: string
  context?: GetServerSidePropsContext
}>

export const data: QueryData<EventDataOpts, NodeEvent> = async (
  opts
): Promise<NodeEvent> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.EVENT,
    params
  )) as NodeEvent

  return entity
}

export const formatter: QueryFormatter<NodeEvent, Event> = (
  entity: NodeEvent
) => {
  return {
    ...entityBaseFields(entity),
    image: queries.formatData('media--image', entity.field_media), //cropType: '2_1_large'
    date: entity.created,
    socialLinks: {
      path: entity.path.alias,
      title: entity.title,
    },
    listing: entity.field_listing.path.alias,
    additionalInfo: entity.field_additional_information_abo,
    address: entity.field_address,
    locationHumanReadable: entity.field_location_humanreadable,
    eventCTA: entity.field_event_cta,
    emailCTA: entity.field_cta_email,
    howToSignUp: entity.field_how_to_sign_up,
    cost: entity.field_event_cost,
    datetimeRange: entity.field_datetime_range_timezone,
    facilityLocation: entity.field_facility_location,
    body: entity.field_body,
    locationType: entity.field_location_type,
    description: entity.field_description,
    link: entity.field_link,
    urlOfOnlineEvent: entity.field_url_of_an_online_event,
  }
}
