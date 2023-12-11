import {
  QueryData,
  QueryFormatter,
  QueryOpts,
  QueryParams,
} from 'next-drupal-query'
import { drupalClient } from '@/lib/drupal/drupalClient';
import { queries } from '.';
import { NodeEvent } from '@/types/dataTypes/drupal/node';
import { Event } from '@/types/dataTypes/formatted/event';
import { GetServerSidePropsContext } from 'next'
import { MediaImage } from '@/types/dataTypes/formatted/media';



export const params: QueryParams<null> = () => {
  return queries
    .getParams()
    .addInclude([
      'field_media',
      'field_media.image',
      'field_listing',
      'field_administration',
      'field_facility_location'
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
  const entity = opts?.context?.preview
    ? // need to use getResourceFromContext for unpublished revisions
    await drupalClient.getResourceFromContext<NodeEvent>(
      'node--event',
      opts.context,
      {
        params: params().getQueryObject(),
      }
    )
    : // otherwise just lookup by uuid
    await drupalClient.getResource<NodeEvent>(
      'node--event',
      opts.id,
      {
        params: params().getQueryObject(),
      }
    )
  return entity
}

export const formatter: QueryFormatter<NodeEvent, Event> = (
  entity: NodeEvent
) => {
  return {
    id: entity.id,
    entityId: entity.drupal_internal__nid,
    entityPath: entity.path.alias,
    type: entity.type,
    published: entity.status,
    title: entity.title,
    image: queries.formatData('media--image', {
      entity: entity.field_media,
      cropType: '2_1_large',
    }) as MediaImage,
    date: entity.created,
    breadcrumbs: entity.breadcrumbs,
    socialLinks: {
      path: entity.path.alias,
      title: entity.title,
    },
    listing: entity.field_listing.path.alias,
    additionalInfo: entity.field_additional_information_abo,
    address: entity.field_address,
    locationHumanReadable: entity.field_location_humanreadable,
    eventCTA: entity.field_event_cta,
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