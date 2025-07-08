import { drupalToVaPath, newlinesToBr } from './helpers'
import { createPhoneLinks } from './createPhoneLinks'

/**
 * Extract and transform HTML content from Drupal with various filters applied.
 *
 * Return the HTML string after processing.
 */
export const getHtmlFromDrupalContent = (content: string): string => {
  return [createPhoneLinks, drupalToVaPath, newlinesToBr].reduce(
    (contentToTransform, transformFn) => transformFn(contentToTransform),
    content
  )
}
