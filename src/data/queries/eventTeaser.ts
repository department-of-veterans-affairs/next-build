import { QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeEvent } from '@/types/drupal/node'
import { EventWidgetTeaser } from '@/types/formatted/event'
import { formatDateObject } from '@/lib/utils/date'

// Define the query params for fetching node--event--teaser.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_listing',
    'field_administration',
    'field_facility_location',
  ])
}

// This formats Event nodes in the manner that the events widget from vets-website expects.
export const formatter: QueryFormatter<NodeEvent, EventWidgetTeaser> = (
  entity: NodeEvent
) => {
  const time = formatDateObject(entity.field_datetime_range_timezone)

  return {
    changed: entity.changed,
    entityBundle: entity.type,
    entityId: entity.id,
    entityPublished: entity.status,
    entityUrl: {
      path: entity.path.alias,
    },
    fieldAdditionalInformationAbo: entity.field_additional_information_abo,
    fieldAdditionalListings: null,
    fieldAddress: {
      addressLine1: entity.field_address?.address_line1 || null,
      addressLine2: entity.field_address?.address_line2 || null,
      administrativeArea: entity.field_address?.administrative_area || null,
      countryCode: entity.field_address?.country_code || null,
      locality: entity.field_address?.locality || null,
      postalCode: entity.field_address?.postal_code || null,
    },
    fieldAdministration: {
      entity: {
        entityId: entity.field_administration.id,
      },
    },
    fieldBody: entity.field_body,
    fieldCtaEmail: entity.field_cta_email,
    fieldDatetimeRangeTimezone: time,
    fieldDescription: entity.field_description,
    fieldEventCost: entity.field_event_cost,
    fieldEventCta: entity.field_event_cta,
    fieldEventRegistrationrequired: entity.field_event_registrationrequired,
    fieldFacilityLocation: entity.field_facility_location
      ? {
          entity: {
            entityUrl: {
              path: entity.field_facility_location.path?.alias || null,
            },
            fieldAddress: {
              addressLine1:
                entity.field_facility_location.field_address?.address_line1 ||
                null,
              addressLine2:
                entity.field_facility_location.field_address?.address_line2 ||
                null,
              administrativeArea:
                entity.field_facility_location.field_address
                  ?.administrative_area || null,
              countryCode:
                entity.field_facility_location.field_address?.country_code ||
                null,
              locality:
                entity.field_facility_location.field_address?.locality || null,
              postalCode:
                entity.field_facility_location.field_address?.postal_code ||
                null,
            },
            title: entity.field_facility_location?.title || null,
          },
        }
      : null,
    fieldFeatured: entity.field_featured,
    fieldHowToSignUp: entity.field_how_to_sign_up,
    fieldLink: entity.field_link,
    fieldListing: {
      entity: {
        entityId: entity.field_listing.id,
      },
    },
    fieldLocationHumanreadable: entity.field_location_humanreadable,
    fieldLocationType: entity.field_location_type,
    fieldOrder: entity.field_order,
    fieldUrlOfAnOnlineEvent: entity.field_url_of_an_online_event,
    title: entity.title,
  }
}
