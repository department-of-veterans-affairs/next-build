import { drupalToVaPath, newlinesToBr, addH2Ids, addH3Ids } from './helpers'
import { createPhoneLinks } from './createPhoneLinks'

export type GetHtmlFromDrupalContentOptions = {
  convertNewlines?: boolean
  addH2Ids?: boolean
  addH3Ids?: boolean
}

/**
 * Extract and transform HTML content from Drupal with various filters applied.
 *
 * Return the HTML string after processing.
 */
export const getHtmlFromDrupalContent = (
  content: string,
  options: GetHtmlFromDrupalContentOptions = { addH2Ids: true }
): string => {
  const transformers = [createPhoneLinks, drupalToVaPath]
  if (options.convertNewlines) {
    transformers.push(newlinesToBr)
  }
  if (options.addH2Ids) {
    transformers.push(addH2Ids)
  }
  if (options.addH3Ids) {
    transformers.push(addH3Ids)
  }
  return transformers.reduce(
    (contentToTransform, transformFn) => transformFn(contentToTransform),
    content
  )
}
