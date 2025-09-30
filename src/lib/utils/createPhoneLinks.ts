/**
 * Add <va-telephone> tags to phone numbers written in plain text coming from
 * Drupal.
 *
 * @param content - The content to search for phone numbers.
 * @returns The content with phone numbers wrapped in <va-telephone> tags.
 */
export const createPhoneLinks = (content: string) => {
  // Change phone to tap to dial.
  const replacePattern =
    /\(?(\d{3})\)?[- ]*(\d{3})[- ]*(\d{4}),?(?: ?(?:x\.?|ext\.?|extension\.?) ?(\d+))?(?!([^<]*>)|(((?!<v?a).)*<\/v?a.*>))/gi

  const matches = content?.match(replacePattern)
  if (!matches) {
    return content
  }

  return content.replace(
    replacePattern,
    `<va-telephone contact="$1-$2-$3" extension="$4$5"></va-telephone>`
  )
}
