import {
  QueryData,
  QueryFormatter,
  QueryOpts,
  QueryParams,
} from 'next-drupal-query'
import { queries } from '.'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeEvent } from '@/types/drupal/node'
import { Event } from '@/types/formatted/event'
import { GetServerSidePropsContext } from 'next'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { getNestedIncludes } from '@/lib/utils/queries'

export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    ...getNestedIncludes('field_media', 'media--image'),
    ...getNestedIncludes('field_listing', 'node--event_listing'),
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
    lastUpdated: entity.changed,
    socialLinks: {
      path: `${process.env.SITE_URL}${entity.path.alias}`,
      title: entity.title,
    },
    listing: entity.field_listing.path.alias,
    listingOffice: entity.field_listing.field_office.title,
    additionalInfo: entity.field_additional_information_abo,
    address: entity.field_address,
    locationHumanReadable: entity.field_location_humanreadable,
    eventCTA: entity.field_event_cta,
    emailCTA: entity.field_cta_email,
    howToSignUp: entity.field_how_to_sign_up,
    cost: entity.field_event_cost,
    registrationRequired: entity.field_event_registrationrequired,
    datetimeRange: entity.field_datetime_range_timezone,
    facilityLocation: entity.field_facility_location,
    body: entity.field_body,
    locationType: entity.field_location_type,
    description: entity.field_description,
    link: entity.field_link,
    urlOfOnlineEvent: entity.field_url_of_an_online_event,
    administration: {
      id: entity.field_administration?.drupal_internal__tid || null,
      name: entity.field_administration?.name || null,
    },
  }
}
