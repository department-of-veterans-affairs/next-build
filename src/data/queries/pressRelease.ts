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
    ...getNestedIncludes('field_press_release_downloads', ["media--image","media--document", "media--video"] ),
    'field_press_release_contacts',
    'field_press_release_pdf_version',
    'field_press_release_office',
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
  return {
    ...entityBaseFields(entity),
    title: entity.title,
    releaseDate: entity.fieldReleaseDate,
    pdfVersion: entity?.fieldPdfVersion,
    introText: entity.fieldIntroText,
    address: entity.fieldAddress,
    fullText: entity.fieldFullText,
    contacts: entity.fieldContacts,
    downloads: entity.fieldDownloads,
    listing: entity.fieldListing?.path.alias,
  }
}

