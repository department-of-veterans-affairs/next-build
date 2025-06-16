import { FieldFormattedText } from '@/types/drupal/field_type'
import { drupalToVaPath } from './helpers'
import { createPhoneLinks } from './createPhoneLinks'

/**
 * Extract the processed HTML from a FieldFormattedText field and apply filters.
 *
 * Return the HTML string after processing.
 */
export const getHtmlFromField = (
  formattedTextField?: Pick<FieldFormattedText, 'processed'>
) => {
  return [createPhoneLinks, drupalToVaPath].reduce(
    (contentToTransform, transformFn) => transformFn(contentToTransform),
    formattedTextField?.processed ?? ''
  )
}
