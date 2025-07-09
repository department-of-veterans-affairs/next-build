import { drupalToVaPath, newlinesToBr } from './helpers'
import { createPhoneLinks } from './createPhoneLinks'

export type GetHtmlFromDrupalContentOptions = {
  convertNewlines?: boolean
}

/**
 * Extract and transform HTML content from Drupal with various filters applied.
 *
 * Return the HTML string after processing.
 */
export const getHtmlFromDrupalContent = (
  content: string,
  options: GetHtmlFromDrupalContentOptions = {}
): string => {
  const transformers = [createPhoneLinks, drupalToVaPath]
  if (options.convertNewlines) {
    transformers.push(newlinesToBr)
  }
  return transformers.reduce(
    (contentToTransform, transformFn) => transformFn(contentToTransform),
    content
  )
}
