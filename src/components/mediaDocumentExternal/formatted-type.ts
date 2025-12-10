import { MediaImage } from '@/components/mediaDocument/formatted-type'

export interface MediaDocumentExternal {
  id: string
  name: string
  drupal_mid: number | string
  drupal_vid: number | string
  description: string | null
  mimeType: string
  url: string
  fileName: string
  /* TODO: `thumbnail` field exists but is unused in template (neither drupal nor next CLP->ResourcesPanel.tsx)
   * The data matches DrupalMediaImage['image'] but with type 'file--file'. This deserves more consideration
   * on how to handle it, but doing so will not serve the scope of the following ticket:
   * https://github.com/department-of-veterans-affairs/va.gov-cms/issues/22445
   */
}
