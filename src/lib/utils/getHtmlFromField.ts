import { FieldFormattedText } from '@/types/drupal/field_type'
import { drupalToVaPath, phoneLinks } from './helpers'

/**
 * Extract the processed HTML from a FieldFormattedText field and apply filters.
 *
 * Return the HTML string after processing.
 */
export const getHtmlFromField = (formattedTextField?: FieldFormattedText) => {
  const data = [formattedTextField?.processed ?? '']
  const filters = [phoneLinks, drupalToVaPath]
  const filteredData = filters.reduce((d, f) => d.filter(f), data)

  return filteredData[0]
}
