import {
  drupalToVaPath,
  newlinesToBr,
  addH2Ids,
  addH3Ids,
  convertActionLinks,
} from './helpers'
import { createPhoneLinks } from './createPhoneLinks'
import { createUrlLinks } from './createUrlLinks'

export type GetHtmlFromDrupalContentOptions = {
  convertNewlines?: boolean
  addH2Ids?: boolean
  addH3Ids?: boolean
  convertActionLinks?: boolean
}

/**
 * Extract and transform HTML content from Drupal with various filters applied.
 *
 * Return the HTML string after processing.
 */
export const getHtmlFromDrupalContent = (
  content: string,
  options: GetHtmlFromDrupalContentOptions = {
    addH2Ids: true,
    convertActionLinks: true,
  }
): string => {
  const transformers = [createUrlLinks, createPhoneLinks, drupalToVaPath]
  if (options.convertNewlines) {
    transformers.push(newlinesToBr)
  }
  if (options.addH2Ids) {
    transformers.push(addH2Ids)
  }
  if (options.addH3Ids) {
    transformers.push(addH3Ids)
  }
  if (options.convertActionLinks) {
    transformers.push(convertActionLinks)
  }
  return transformers.reduce(
    (contentToTransform, transformFn) => transformFn(contentToTransform),
    content
  )
}
