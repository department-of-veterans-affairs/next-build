import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { DrupalMediaDocumentExternal } from '@/types/drupal/media'

import { formatter as imageFormatter } from '@/components/mediaImage/query'
import { MediaDocumentExternal } from './formatted-type'

export const formatter: QueryFormatter<
  DrupalMediaDocumentExternal,
  MediaDocumentExternal
> = (entity: DrupalMediaDocumentExternal) => {
  if (!entity) return null
  return {
    id: entity.id,
    name: entity.name,
    drupal_mid: entity.drupal_internal__mid,
    drupal_vid: entity.drupal_internal__vid,
    description: entity.field_description,
    mimeType: entity.field_mime_type,
    url: entity.field_media_external_file.url,
    fileName: entity.field_media_external_file.title,
    /* TODO: `thumbnail` field exists but is unused in template (neither drupal nor next CLP->ResourcesPanel.tsx)
     * The data matches DrupalMediaImage['image'] but with type 'file--file'. This deserves more consideration
     * on how to handle it, but doing so will not serve the scope of the following ticket:
     * https://github.com/department-of-veterans-affairs/va.gov-cms/issues/22445
     */
  }
}
