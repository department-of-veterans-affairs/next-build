import { FieldFormattedText } from '@/types/drupal/field_type'
import {
  getHtmlFromDrupalContent,
  GetHtmlFromDrupalContentOptions,
} from './getHtmlFromDrupalContent'

/**
 * Extract the processed HTML from a FieldFormattedText field and apply filters.
 *
 * Return the HTML string after processing.
 */
export const getHtmlFromField = (
  formattedTextField?: Pick<FieldFormattedText, 'processed'>,
  options?: GetHtmlFromDrupalContentOptions
) => getHtmlFromDrupalContent(formattedTextField?.processed ?? '', options)
