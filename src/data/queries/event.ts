import {
  QueryData,
  QueryFormatter,
  QueryOpts,
  QueryParams,
} from 'next-drupal-query'
import { drupalClient } from '@/lib/drupal/drupalClient';
import { queries } from '.';
import { NodeEvent } from '@/types/dataTypes/drupal/node'; // Modify as per your type definitions
import { GetServerSidePropsContext } from 'next'



export const params: QueryParams<null> = () => {
  return queries
    .getParams()

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
  // console.log(entity)
  return entity
}

export const formatter: QueryFormatter<any, any> = (
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
    }),
    caption: entity.field_image_caption,
    date: entity.created,
    breadcrumbs: entity.breadcrumbs,
    socialLinks: {
      path: entity.path.alias,
      title: entity.title,
    },
    listing: entity.field_listing.path.alias,
    administration: {
      id: entity.field_administration?.drupal_internal__tid || null,
      name: entity.field_administration?.name || null,
    },
    fieldAdditionalListings: entity.field_additional_listings,
    fieldAdditionalInfo: entity.field_additional_information_abo,
    fieldAddress: entity.field_address,
    locationHumanReadable: entity.field_location_humanreadable,
    fieldEventCTA: entity.field_event_cta,
    cost: entity.field_event_cost,
    datetimeRange: entity.field_datetime_range_timezone,
    fieldMedia: entity.field_media,
    fieldFacilityLocation: entity.field_facility_location,
    fieldFeatured: entity.field_featured,
    fieldBody: entity.field_body,
    fieldIncludeRegistrationInfo: entity.field_include_registration_info,
    fieldLocationType: entity.field_location_type,
    fieldOrder: entity.field_order,
    fieldPublishToOutreachCal: entity.field_publish_to_outreach_cal,
    fieldRegistrationRequired: entity.field_event_registrationrequired,
    fieldAdministration: entity.field_administration,
    fieldDescription: entity.field_description,
    fieldLink: entity.field_link,
    fieldUrlOfOnlineEvent: entity.field_url_of_an_online_event,
    fieldListing: entity.field_listing,
  }
}