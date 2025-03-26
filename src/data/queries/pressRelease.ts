import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodePressRelease } from '@/types/drupal/node'
import { PressRelease } from '@/types/formatted/pressRelease'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'
import { get } from 'lodash'
import { getNestedIncludes } from '@/lib/utils/queries'

// Define the query params for fetching node--press_release.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    ...getNestedIncludes('field_press_release_downloads', [
      'media--image',
      'media--document',
    ]),
    'field_press_release_contact',
    'field_press_release_contact.field_telephone',
    'field_listing',
    'field_administration',
    ...getNestedIncludes('field_pdf_version', 'media--document'),
  ])
}

// Define the option types for the data loader.
export type PressReleaseDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Implement the data loader.
export const data: QueryData<PressReleaseDataOpts, NodePressRelease> = async (
  opts
): Promise<NodePressRelease> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.PRESS_RELEASE,
    params
  )) as NodePressRelease
  return entity
}

export const formatter: QueryFormatter<NodePressRelease, PressRelease> = (
  entity: NodePressRelease
) => {
  const downloads = entity.field_press_release_downloads
    ? entity.field_press_release_downloads.map((download) => {
        if (download.type === 'media--document') {
          return {
            id: download.id,
            type: download.type,
            name: download.name,
            uri: download?.field_document?.uri?.url || null,
          }
        }
        if (download.type === 'media--image') {
          return {
            id: download.id,
            type: download.type,
            name: download.name,
            uri: download?.image.uri?.url || null,
          }
        }
        //No clear download field option; entering a url potential redirect option
        if (download.type === 'media--video') {
          return {
            id: download.id,
            type: download.type,
            name: download.name,
            uri: download?.field_media_video_embed_field || null,
          }
        }
      })
    : []
  // Setting phone numbers to an array even though there is only one in case multiple are added in the future.
  const formattedContacts = entity.field_press_release_contact
    ? entity.field_press_release_contact.map((contact) => {
        return {
          id: contact?.id || null,
          description: contact?.field_description || null,
          name: contact?.title || null,
          email: contact?.field_email_address || null,
          numbers: [contact?.field_telephone].map((number) => {
            return {
              id: number?.id || null,
              type: number?.field_phone_number_type || null,
              number: number?.field_phone_number || null,
              ext: number?.field_phone_extension || null,
            }
          }),
        }
      })
    : []
  return {
    ...entityBaseFields(entity),
    releaseDate: entity.field_release_date,
    pdfVersion: entity.field_pdf_version?.field_document?.uri?.url || null,
    introText: entity.field_intro_text,
    address: entity.field_address,
    fullText: entity.field_press_release_fulltext.processed,
    contacts: formattedContacts,
    downloads: downloads,
    listing: entity.field_listing?.path?.alias,
    administration: {
      id: entity.field_administration?.drupal_internal__tid || null,
      name: entity.field_administration?.name || null,
    },
  }
}
